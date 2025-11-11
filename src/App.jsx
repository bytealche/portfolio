// src/App.jsx

import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal.jsx';
import MobileFallback from './components/MobileFallback.jsx';

// Set the screen width breakpoint
const MOBILE_BREAKPOINT = 768;

// Create a media query object. This is more reliable than window.innerWidth
const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

function App() {
  // Set the initial state based on whether the media query matches
  const [isMobile, setIsMobile] = useState(mediaQuery.matches);

  useEffect(() => {
    // Define a listener function to update state when the screen size changes
    const handleResize = (e) => {
      setIsMobile(e.matches);
    };

    // Add the listener
    // Note: addEventListener is the modern, recommended way
    mediaQuery.addEventListener('change', handleResize);

    // Cleanup the listener when the component unmounts
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []); // The empty array [] ensures this effect runs only once on mount

  // Render the correct component based on the state
  if (isMobile) {
    return <MobileFallback />;
  }

  // Render the terminal for desktop users
  return (
    <div className="App">
      <Terminal />
    </div>
  );
}

export default App;