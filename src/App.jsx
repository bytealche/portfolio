// src/App.jsx

import React, { useState, useEffect } from 'react';
import Terminal from './components/Terminal.jsx';
import MobileFallback from './components/MobileFallback.jsx';

// This is a new, more aggressive check.
// It looks at the "User Agent" string of the browser.
function detectIsMobile() {
  const toCheck = [
    /Android/i,
    /webOS/i,
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /BlackBerry/i,
    /Windows Phone/i,
  ];
  
  return toCheck.some((item) => navigator.userAgent.match(item));
}

function App() {
  // We only run the check once when the app loads
  const [isMobile, setIsMobile] = useState(detectIsMobile());

  // We don't need a resize listener anymore, as the user agent won't change.

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