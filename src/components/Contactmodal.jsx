// src/components/ContactModal.jsx

import React, { useState, useEffect } from 'react';

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Helper function to encode form data
const encode = (data) => {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
    .join('&');
};

export const ContactModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setEmail('');
        setMessage('');
        setStatus('idle');
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact', // This name must match the form's name
          email,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error('Form submission error');
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
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } bg-black/60 backdrop-blur-sm`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-lg p-8 m-4 transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } bg-card-bg/75 backdrop-blur-lg border border-white/10 rounded-lg shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <CloseIcon />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Contact Me</h2>

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
          // --- 1. ADD NETLIFY ATTRIBUTES TO THE FORM ---
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
          >
            {/* This hidden input is required by Netlify */}
            <input type="hidden" name="form-name" value="contact" />
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                name="email" // 'name' attribute is required
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
                name="message" // 'name' attribute is required
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