// src/components/TypeWriter.jsx

import React, { useState, useEffect } from 'react';

// Default props for reusability
const DEFAULT_TYPE_SPEED = 150;
const DEFAULT_WAIT_SPEED = 2000;

const TypeWriter = ({
  staticText,
  words,
  typeSpeed = DEFAULT_TYPE_SPEED,
  waitSpeed = DEFAULT_WAIT_SPEED,
}) => {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    // This useEffect hook acts as a state machine
    const currentIndex = wordIndex % words.length;
    const currentWord = words[currentIndex];

    // --- State 1: WAITING ---
    // If we're done typing a word, wait before deleting
    if (isWaiting) {
      const timer = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true); // Move to the DELETING state
      }, waitSpeed);
      
      // Cleanup the timer if the component unmounts
      return () => clearTimeout(timer);
    }

    // Determine the speed for this "tick"
    let currentTypeSpeed = isDeleting ? typeSpeed / 2 : typeSpeed;

    // --- State 2: DELETING ---
    if (isDeleting) {
      const timer = setTimeout(() => {
        const newText = currentWord.substring(0, text.length - 1);
        setText(newText);

        // If we're done deleting, move to the TYPING state for the next word
        if (newText === '') {
          setIsDeleting(false);
          setWordIndex(wordIndex + 1);
        }
      }, currentTypeSpeed);

      return () => clearTimeout(timer);
    }

    // --- State 3: TYPING ---
    // Default state: just type the next letter
    const timer = setTimeout(() => {
      const newText = currentWord.substring(0, text.length + 1);
      setText(newText);

      // If we're done typing, move to the WAITING state
      if (newText === currentWord) {
        setIsWaiting(true);
      }
    }, currentTypeSpeed);

    return () => clearTimeout(timer);

  }, [
    text,
    isDeleting,
    isWaiting,
    wordIndex,
    words,
    typeSpeed,
    waitSpeed,
  ]); // Re-run the effect when any of these state variables change

  return (
    <div className="typewriter">
      {staticText.map((sentence, index) => (
        <span
          key={index}
          className={`sentence ${
            index === staticText.length - 1 ? 'last-sentence' : ''
          }`}
        >
          {sentence}&nbsp;
        </span>
      ))}
      <span className={`dynamic-text ${isWaiting ? 'fade' : ''}`}>
        {text}
      </span>
      {/* A simple blinking cursor */}
      <span className="cursor">|</span>
    </div>
  );
};

export default TypeWriter;