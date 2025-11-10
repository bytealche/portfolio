import fileSystem from './fileSystem.js';

/**
 * Resolves a path string into an absolute path array.
 * @param {string} pathStr - The path string to resolve (e.g., 'projects', '../', '~/projects').
 * @param {string} currentPath - The current absolute path (e.g., '~/projects').
 * @returns {string} A new absolute path string (e.g., '~', '~/projects').
 */
export const resolvePath = (pathStr, currentPath) => {
  if (pathStr.startsWith('~/')) {
    // It's an absolute path from home
    currentPath = '~';
    pathStr = pathStr.substring(2);
  } else if (pathStr.startsWith('/')) {
    // It's an absolute path from root. We treat '~' as root.
    currentPath = '~';
    pathStr = pathStr.substring(1);
  }

  // Start resolution from the current path
  const parts = currentPath.split('/').filter(Boolean); // ['~', 'projects']
  const newParts = pathStr.split('/').filter(Boolean);

  if (newParts.length === 0 && pathStr !== '.') {
    return currentPath; // Nothing to resolve (e.g., 'cd ' or 'cd /')
  }

  for (const part of newParts) {
    if (part === '..') {
      // Go up one level, but not past root ('~')
      if (parts.length > 1) {
        parts.pop();
      }
    } else if (part !== '.') {
      parts.push(part);
    }
  }

  // Handle edge case where path is just '~'
  if (parts.length === 1 && parts[0] === '~') {
    return '~';
  }
  
  // Re-join the path
  let finalPath = parts.join('/');
  
  // Ensure it always starts with '~'
  if (!finalPath.startsWith('~')) {
    finalPath = '~/' + finalPath;
  }
  
  // Clean up '~/~' case
  if (finalPath.startsWith('~/~') && finalPath.length > 3) {
      finalPath = '~' + finalPath.substring(3);
  } else if (finalPath === '~/~') {
      finalPath = '~';
  }


  return finalPath;
};

/**
 * Gets an entry (file or dir) from the file system by its path.
 * @param {string} path - The absolute path string (e.g., '~/projects/virtual-queue-system.md').
 * @param {object} fs - The file system object.
 * @returns {object | null} The file/dir object or null if not found.
 */
export const getEntry = (path, fs) => {
  if (path === '~') {
    return fs['~'];
  }

  // Remove '~/' from the start
  const parts = path.replace(/^~\//, '').split('/');
  let current = fs['~'];

  for (const part of parts) {
    if (current && current.type === 'dir' && current.children[part]) {
      current = current.children[part];
    } else {
      return null; // Path not found
    }
  }
  return current;
};