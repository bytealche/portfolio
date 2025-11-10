import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal.jsx';
import MobileFallback from './components/MobileFallback.jsx';

// Set the screen width breakpoint
const MOBILE_BREAKPOINT = 768;

function App() {
  // State to track if we're in mobile view
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT
  );

  // This effect runs once on mount and then listens for window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    
    // Cleanup the listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty array ensures this runs only once on mount

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