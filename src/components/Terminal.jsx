// src/components/Terminal.jsx

import React, { useEffect, useRef } from 'react';
import { Shell } from '../core/shell.js';
import ProfileCard from './ProfileCard.jsx';

// --- HEADER BAR ---
const HeaderBar = () => (
  <div className="w-full h-16 bg-page-bg flex items-center justify-between px-8 flex-shrink-0">
    <h1 className="text-2xl font-bold text-white">Aniket</h1>
    <h2 className="text-xl font-mono text-gray-400">Portfolio</h2>
  </div>
);

// --- TERMINAL NAV BAR ---
const TerminalNavBar = () => (
  <div className="flex items-center h-8 px-4 bg-terminal-header flex-shrink-0">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
    </div>
    <div className="flex-grow text-center text-gray-400 text-sm font-mono">
      aniket@portfolio
    </div>
    <div className="w-16"></div>
  </div>
);

// --- MAIN COMPONENT ---
function Terminal() {
  const terminalRef = useRef(null);
  const shellRef = useRef(null);

  useEffect(() => {
    if (terminalRef.current && !shellRef.current) {
      const shell = new Shell();
      shellRef.current = shell;
      shell.mount(terminalRef.current);
      
      const fitTerminal = () => shell.fitAddon.fit();
      
      // Fit on load and also on resize
      setTimeout(fitTerminal, 100);
      window.addEventListener('resize', fitTerminal);

      return () => {
        window.removeEventListener('resize', fitTerminal);
      };
    }
  }, []);

  return (
    // Root container (full screen, vertical layout)
    <div className="w-screen h-screen flex flex-col bg-page-bg">
      
      {/* Row 1: The Header Bar */}
      <HeaderBar />

      {/* Row 2: The Main Content Area */}
      {/* This is the responsive part:
        - It's a vertical column by default (mobile-first).
        - At 'md' (medium) breakpoint, it becomes a horizontal row.
        - 'overflow-y-auto' adds scrolling on mobile if needed.
      */}
      <div className="flex-grow flex flex-col md:flex-row p-9 gap-40 overflow-y-auto overflow-x-hidden">
        
        {/* Column 1: The Profile Card */}
        {/* - On mobile (flex-col), it's a standard block.
          - On desktop (md:flex-row), we make it shrinkable 
            and set a 'max-h' to respect the vertical centering.
        */}
        <div className="md:flex-shrink-0 pl-20">
          <ProfileCard />
        </div>

        {/* Column 2: The Terminal (fills the remaining space) */}
        {/* - 'min-h-[400px]' gives the terminal a minimum height on mobile.
          - 'flex-grow' makes it fill all remaining space (horizontal on desktop, vertical on mobile).
        */}
        <div className="flex-grow flex flex-col rounded-lg overflow-hidden shadow-2xl min-h-[400px]">
          
          <TerminalNavBar />
          
          <div 
            ref={terminalRef} 
            id="terminal-body"
            className="flex-grow p-2 overflow-hidden bg-terminal-bg" 
          >
            {/* xterm.js will attach its canvas here */}
          </div>
        </div>
      </div>

    </div>
  );
}

export default Terminal;