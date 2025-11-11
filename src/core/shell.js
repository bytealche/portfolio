// src/core/shell.js

import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import commandMap from './commands.js';

const PROMPT = 'aniket@portfolio:~$ ';
const TYPE_SPEED = 10;

export class Shell {
  constructor() {
    this.terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"JetBrains Mono", Consolas, "Courier New", monospace',
      fontSize: 15,
// ...
      theme: {
        background: '#1E1E1E',
        foreground: '#CECECE',
      },
    });
    
    this.fitAddon = new FitAddon();
    this.terminal.loadAddon(this.fitAddon);

    // Internal state
    this.currentPath = '~';
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentLine = '';
    this.isWriting = false;
  }

  mount(element) {
    this.terminal.open(element);
    this.printWelcome();
    this.setupListeners();
  }

  setupListeners() {
    this.terminal.onKey(({ key, domEvent }) => {
      // If we're writing, ignore ALL key presses
      if (this.isWriting) {
        return;
      }

      const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

      switch (domEvent.key) {
        case 'Enter':
          this.terminal.write('\r\n'); // Echo the newline
          this.handleInput(this.currentLine);
          this.currentLine = '';
          this.historyIndex = -1;
          break;
        case 'Backspace':
          let promptLength = PROMPT.replace('~', this.currentPath).length;

          if (this.terminal.buffer.active.cursorX > promptLength) {
            this.currentLine = this.currentLine.slice(0, -1);
            this.terminal.write('\b \b');
          }
          break;
        case 'ArrowUp':
          domEvent.preventDefault();
          this.navigateHistory(1);
          break;
        case 'ArrowDown':
          domEvent.preventDefault();
          this.navigateHistory(-1);
          break;
        case 'c':
          if (domEvent.ctrlKey) {
            this.terminal.write('^C');
            this.currentLine = '';
            this.historyIndex = -1;
            this.printPrompt();
          } else {
            this.currentLine += key;
            this.terminal.write(key);
          }
          break;
        default:
          if (printable && domEvent.key.length === 1) {
            this.currentLine += key;
            this.terminal.write(key);
          }
      }
    });
  }

  printWelcome() {
    const welcomeResult = commandMap.welcome();
    this.isWriting = true;
    this.writeOutput(welcomeResult.output, () => {
      this.printPrompt();
    });
  }

  printPrompt(promptText = null) {
    this.terminal.write(`\r\n${promptText || PROMPT.replace('~', this.currentPath)}`);
  }

  /**
   * Main input handler
   */
  handleInput(input) {
    const trimmedInput = input.trim();
    if (trimmedInput.length === 0) {
      this.printPrompt();
      return;
    }

    this.commandHistory.unshift(trimmedInput);
    const parts = trimmedInput.split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);
    const command = commandMap[commandName];

    let result = {};
    if (command) {
      result = command({ args, currentPath: this.currentPath });
    } else {
      result.output = `command not found: ${commandName}`;
    }

    const onWriteComplete = () => {
      if (result.newPath) {
        this.currentPath = result.newPath;
      }
      
      if (commandName !== 'clear') {
        this.printPrompt();
      }
    };

    if (result.output) {
      this.isWriting = true;
      this.writeOutput(result.output, onWriteComplete);
    } else {
      onWriteComplete();
    }
  }

  writeOutput(outputString, onCompleteCallback, speed = TYPE_SPEED) {
    const processedOutput = outputString.replace(/\n/g, '\r\n');
    let charIndex = 0;
    const writeChar = () => {
      if (charIndex < processedOutput.length) {
        const char = processedOutput[charIndex];
        this.terminal.write(char);
        charIndex++;
        const timeout = (char === '\n' || char === '\r') ? 0 : speed;
        setTimeout(writeChar, timeout);
      } else {
        this.isWriting = false;
        onCompleteCallback();
      }
    };
    writeChar();
  }

  navigateHistory(direction) {
    if (this.historyIndex === -1 && direction === -1) return;
    this.historyIndex += direction;
    if (this.historyIndex < 0) {
      this.historyIndex = -1;
      this.clearLine();
      this.currentLine = '';
      return;
    }
    if (this.historyIndex >= this.commandHistory.length) {
      this.historyIndex = this.commandHistory.length - 1;
      return;
    }
    const command = this.commandHistory[this.historyIndex];
    this.clearLine();
    this.terminal.write(command);
    this.currentLine = command;
  }
  
  clearLine() {
    const promptLength = PROMPT.replace('~', this.currentPath).length;
    const currentLength = this.currentLine.length;
    const backspaces = '\b \b'.repeat(currentLength);
    this.terminal.write(backspaces);
  }
}