// src/components/ContactModal.jsx

import React, { useState, useEffect } from 'react';

// Simple "X" icon for closing
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const ContactModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('');
        setMessage('');
        setStatus('idle');
      }, 300); // Wait for closing animation
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
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
      
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Backdrop overlay
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } bg-black/60 backdrop-blur-sm`}
      onClick={onClose}
    >
      {/* Modal Content */}
      <div
        className={`relative w-full max-w-lg p-8 m-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } bg-card-bg/75 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl`}
        onClick={(e) => e.stopPropagation()} // Prevent closing on modal click
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Contact Me</h2>

        {/* Form Area */}
        {status === 'success' ? (
          <div className="text-center">
            <h3 className="text-xl text-green-400 mb-4">Message Sent!</h3>
            <p className="text-gray-300">Thanks for reaching out. I'll get back to you soon.</p>
            <button
              onClick={onClose}
              className="mt-6 w-full px-4 py-2 bg-brand-orange text-white rounded-md hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 rounded bg-terminal-bg/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="5"
                className="w-full p-2 rounded bg-terminal-bg/50 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-orange"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full px-4 py-2 bg-brand-orange text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {status === 'sending' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'error' && (
              <p className="text-red-400 text-center mt-4">
                Error: Failed to send message. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactModal;