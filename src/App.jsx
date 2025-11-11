import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal.jsx';
import MobileFallback from './components/MobileFallback.jsx';

/**
 * A comprehensive, industry-standard regex to detect 
 * mobile phone user agents.
 */
function detectIsMobileAgent() {
  const regex = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|lex)|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i;
  
  // We also check a shorter regex for other common mobile patterns
  const regex2 = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;

  return regex.test(navigator.userAgent) || regex2.test(navigator.userAgent);
}

/**
 * A check for small screen size.
 * We use 767px as the cutoff (standard phone/tablet portrait width)
 */
const mediaQuery = window.matchMedia(`(max-width: 767px)`);

function App() {
  // We combine both checks.
  // isMobile is true IF:
  // 1. The user agent is a known mobile device.
  // OR
  // 2. The screen size is very small (like a phone).
  const [isMobile, setIsMobile] = useState(
    detectIsMobileAgent() || mediaQuery.matches
  );

  // We still need a listener in case the user resizes their desktop window
  // (or rotates a tablet)
  useEffect(() => {
    const handleResize = () => {
      // Re-run the check on resize
      setIsMobile(detectIsMobileAgent() || mediaQuery.matches);
    };
    
    mediaQuery.addEventListener('change', handleResize);
    
    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, []);

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