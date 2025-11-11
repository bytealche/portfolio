// src/core/commands.js

import fileSystem from './fileSystem.js';
import { getEntry, resolvePath } from './utils.js';

// Helper: Formats 'ls' output
const formatLsOutput = (entry) => {
  if (!entry || entry.type !== 'dir') {
    return 'ls: Not a directory\n';
  }
  return Object.keys(entry.children)
    .map(key => (entry.children[key].type === 'dir' ? `${key}/` : key))
    .join('  ');
};

// --- Command Definitions ---
const commands = {
  
  guide: () => ({
    output: `
Portfolio Commands:
  about         - Displays a summary about me
  projects      - Lists my projects
  experience    - Shows my professional experience
  education     - Shows my academic background
  certificates  - Lists my certifications
  resume        - Opens my resume in a new tab
  social        - Displays my social media links
  
Utility Commands:
  guide         - Shows this guide
  ls [path]     - Lists files and directories
  cat <file>    - Displays the content of a file
  cd <dir>      - Changes the current directory
  open <file>   - Opens a file (e..g, 'open resume.pdf')
  clear         - Clears the terminal screen
`,
  }),

  // --- ALIASES ---
  about: () => {
    return commands.cat({ args: ['~/about.md'], currentPath: '~' });
  },
  projects: () => {
    return commands.ls({ args: ['~/projects'], currentPath: '~' });
  },
  experience: () => {
    return commands.cat({ args: ['~/experience.md'], currentPath: '~' });
  },
  education: () => {
    return commands.cat({ args: ['~/education.md'], currentPath: '~' });
  },
  certificates: () => {
    return commands.cat({ args: ['~/certificates.md'], currentPath: '~' });
  },
  resume: () => {
    return commands.open({ args: ['resume.pdf'], currentPath: '~' });
  },

  // --- STANDARD COMMANDS ---
  welcome: () => {
    return commands.cat({ args: ['~/welcome.txt'], currentPath: '~' });
  },
  ls: ({ args, currentPath }) => {
    const path = args[0] || '.';
    const resolvedPath = resolvePath(path, currentPath);
    const entry = getEntry(resolvedPath, fileSystem);
    if (!entry || entry.type !== 'dir') {
      return { output: `ls: cannot access '${path}': No such file or directory` };
    }
    return { output: formatLsOutput(entry) };
  },
  cat: ({ args, currentPath }) => {
    if (args.length === 0) return { output: 'cat: missing operand' };
    const path = args[0];
    const resolvedPath = resolvePath(path, currentPath);
    const entry = getEntry(resolvedPath, fileSystem);
    if (!entry) return { output: `cat: '${path}': No such file or directory` };
    if (entry.type === 'dir') return { output: `cat: '${path}': Is a directory` };
    if (entry.url) return { output: `Content for '${path}' is external.\nHint: Try 'open ${path}'` };
    return { output: entry.content || '' };
  },
  cd: ({ args, currentPath }) => {
    if (args.length === 0) return { newPath: '~' };
    const path = args[0];
    const resolvedPath = resolvePath(path, currentPath);
    const entry = getEntry(resolvedPath, fileSystem);
    if (!entry || entry.type !== 'dir') {
      return { output: `cd: '${path}': No such file or directory` };
    }
    return { newPath: resolvedPath };
  },
  open: ({ args, currentPath }) => {
    if (args.length === 0) return { output: 'open: missing operand' };
    const path = args[0];
    const resolvedPath = resolvePath(path, currentPath);
    const entry = getEntry(resolvedPath, fileSystem);
    if (!entry) return { output: `open: '${path}': No such file or directory` };
    if (entry.type === 'dir') return { output: `open: '${path}': Is a directory` };
    if (!entry.url) return { output: `open: '${path}' does not have a URL to open` };
    try {
      // Try opening a new tab/window directly. Using an empty window first
      // can avoid some popup blockers in async contexts.
      const newWin = window.open('', '_blank');
      if (newWin) {
        // Navigate the newly opened window to the target URL
        newWin.location.href = entry.url;
        // Sever the opener for security
        try { newWin.opener = null; } catch (e) { /* ignore */ }
      } else {
        // Fallback: create a temporary anchor and click it
        const a = document.createElement('a');
        a.href = entry.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      return { output: `Opening ${entry.url}...` };
    } catch (err) {
      return { output: `Failed to open ${entry.url}: ${err.message}` };
    }
  },
  social: () => {
    return commands.cat({ args: ['~/socials.txt'], currentPath: '~' });
  },
  clear: () => ({
    clear: true,
  }),
  help: () => ({
    output: `Command not found: help. Did you mean 'guide'?`,
  }),
  
  // REMOVED 'contact' command
};

export default commands;