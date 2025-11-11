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
      fontFamily: 'Consolas, "Courier New", monospace',
      fontSize: 15,
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

    // --- NEW PROMPT STATE ---
    this.promptState = {
      active: false,
      questions: [],
      index: 0,
      answers: {},
      onComplete: null,
    };
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
          let promptLength = this.promptState.active 
            ? this.promptState.questions[this.promptState.index].length 
            : PROMPT.replace('~', this.currentPath).length;

          if (this.terminal.buffer.active.cursorX > promptLength) {
            this.currentLine = this.currentLine.slice(0, -1);
            this.terminal.write('\b \b');
          }
          break;
        case 'ArrowUp':
          if (!this.promptState.active) {
            domEvent.preventDefault();
            this.navigateHistory(1);
          }
          break;
        case 'ArrowDown':
          if (!this.promptState.active) {
            domEvent.preventDefault();
            this.navigateHistory(-1);
          }
          break;
        case 'c':
          if (domEvent.ctrlKey) {
            this.terminal.write('^C');
            this.currentLine = '';
            this.historyIndex = -1;
            this.promptState.active = false; // Cancel prompt on Ctrl+C
            this.printPrompt();
          } else {
            // Regular 'c'
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
    // --- NEW: Check if we are in a prompt ---
    if (this.promptState.active) {
      this.handlePromptResponse(input);
      return;
    }
    // --- End new ---

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
      
      // --- NEW: Check for prompt ---
      if (result.prompt === 'contact') {
        this.startContactPrompt();
      } 
      // --- End new ---
      
      else if (commandName !== 'clear' && !result.prompt) {
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

  // --- NEW: Handles interactive prompt for 'contact' ---
  startContactPrompt() {
    this.promptState = {
      active: true,
      questions: ['Your Email: ', 'Your Message: '],
      index: 0,
      answers: {},
      onComplete: (answers) => this.sendContactEmail(answers),
    };
    this.printPrompt(this.promptState.questions[0]);
  }

  handlePromptResponse(input) {
    const { questions, index } = this.promptState;
    this.promptState.answers[index] = input;
    const newIndex = index + 1;

    if (newIndex < questions.length) {
      // Ask next question
      this.promptState.index = newIndex;
      this.printPrompt(questions[newIndex]);
    } else {
      // All questions answered
      this.isWriting = true;
      this.writeOutput("Sending message...", () => {
        this.promptState.onComplete(this.promptState.answers);
        this.promptState = { active: false, questions: [], index: 0, answers: {}, onComplete: null };
      });
    }
  }

  async sendContactEmail(answers) {
    const email = answers[0];
    const message = answers[1];

    try {
      // --- THIS IS THE CORRECTED LINE ---
      const response = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, message }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      this.writeOutput("Message sent successfully!", () => this.printPrompt());

    } catch (error) {
      this.writeOutput("Error: Failed to send message.", () => this.printPrompt());
    }
  }
  // --- End new functions ---

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
    // ... (rest of the function is unchanged)
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
    // ... (rest of the function is unchanged)
    const promptLength = PROMPT.replace('~', this.currentPath).length;
    const currentLength = this.currentLine.length;
    const backspaces = '\b \b'.repeat(currentLength);
    this.terminal.write(backspaces);
  }
}