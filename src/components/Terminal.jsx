// src/components/Terminal.jsx

import { useState, useEffect, useRef } from 'react';
import { Shell } from '../core/shell.js';
import ProfileCard from './ProfileCard.jsx';
import ContactModal from './Contactmodal.jsx'; // 1. Import the modal

// --- HEADER BAR ---
const HeaderBar = () => (
  <div className="w-full h-16 bg-page-bg flex items-center justify-between px-8 flex-shrink-0">
    <h1 className="text-2xl font-bold text-white">Aniket</h1>
    <h2 className="text-xl font-mono text-gray-400">Portfolio</h2>
  </div>
);

// --- TERMINAL NAV BAR ---
const TerminalNavBar = () => (
  <div className="flex items-center h-8 px-4 bg-terminal-header/75 backdrop-blur-lg flex-shrink-0">
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
  
  // 2. Add state for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (terminalRef.current && !shellRef.current) {
      const shell = new Shell();
      shellRef.current = shell;
      shell.mount(terminalRef.current);
      
      const fitTerminal = () => shell.fitAddon.fit();
      
      setTimeout(fitTerminal, 100);
      window.addEventListener('resize', fitTerminal);

      return () => {
        window.removeEventListener('resize', fitTerminal);
      };
    }
  }, []);

  return (
    // Root container
    <div className="w-screen h-screen flex flex-col bg-page-bg">
      
      {/* Row 1: The Header Bar */}
      <HeaderBar />

      {/* Row 2: The Main Content Area */}
      <div className="flex-grow flex flex-col md:flex-row p-8 gap-8 overflow-y-auto overflow-x-hidden">
        
        {/* Column 1: The Profile Card */}
        <div className="md:flex-shrink-0">
          {/* 3. Pass the "open" function to the card */}
          <ProfileCard onOpenContact={() => setIsModalOpen(true)} />
        </div>

        {/* Column 2: The Terminal */}
        <div className="flex-grow flex flex-col rounded-lg overflow-hidden shadow-2xl min-h-[400px] border border-white/10">
          <TerminalNavBar />
          <div 
            ref={terminalRef} 
            id="terminal-body"
            className="flex-grow p-2 overflow-hidden bg-terminal-bg/75 backdrop-blur-lg" 
          >
            {/* xterm.js will attach its canvas here */}
          </div>
        </div>
      </div>

      {/* 4. Render the modal (it's hidden by default) */}
      <ContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}

export default Terminal;