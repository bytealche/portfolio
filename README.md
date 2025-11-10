# Terminal Portfolio

A fully interactive terminal-based portfolio built with React and xterm.js.

This project simulates a bash shell environment in the browser, complete with a virtual file system, command history, and custom commands to showcase my projects, skills, and resume.

![]

---

## 🚀 Features

* **Interactive Shell:** A custom-built shell that parses and executes commands.
* **Virtual File System:** A JSON-based mock file system (`~/`, `~/projects`, etc.).
* **Command History:** Use the `Up` and `Down` arrow keys to cycle through past commands.
* **Responsive Fallback:** Includes a clean, mobile-friendly fallback site for small screens.
* **Core Commands:** `ls`, `cat`, `cd`, `help`, `clear`, and more.

---

## 🛠️ Tech Stack

* **Frontend:** React (with Vite)
* **Terminal Emulator:** `@xterm/xterm`
* **Styling:** Tailwind CSS

---

## Available Commands

| Command | Description |
| :--- | :--- |
| `help` | Shows the list of all available commands. |
| `ls [path]` | Lists files and directories. |
| `cat <file>` | Displays the content of a file. |
| `cd <dir>` | Changes the current directory. |
| `open <file>` | Opens a file's URL (e.g., `open resume.pdf`). |
| `social` | Displays my social media links. |
| `welcome` | Prints the welcome message again. |
| `clear` | Clears the terminal screen. |

---

## ⚡ Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/terminal-portfolio.git
    cd terminal-portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the dev server:**
    ```bash
    npm run dev
    ```

4.  **Open the site:**
    Navigate to `http://localhost:5173` in your browser.

---

## To-Do / Future Enhancements

* [ ] Implement `contact` command with a serverless function.
* [ ] Add `Tab` autocomplete for file and directory names.
* [ ] Add a `theme` command to change terminal colors.