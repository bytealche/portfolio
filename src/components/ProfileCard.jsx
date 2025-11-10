// src/components/ProfileCard.jsx

import React from 'react';
import { profileData } from '../core/profileData';

// Icon components (simple SVGs)
const Icons = {
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
  ),
};

function ProfileCard() {
  return (
    // This is the main card container
   <div className="w-[343px] h-full bg-card-bg/75 backdrop-blur-lg border border-white/10 text-white p-12 flex flex-col justify-center items-center flex-shrink-0 relative overflow-hidden rounded-lg shadow-2xl">
      {/* Decorative orange circles (like the image) */}
      <div className="absolute -top-1/4 -left-1/4 w-72 h-72 border-[1.5rem] border-brand-orange rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-16 -right-1/4 w-96 h-96 border-[2rem] border-brand-orange rounded-full opacity-10"></div>
      
      {/* Card Content */}
      <div className="z-10 flex flex-col items-center text-center">
        {/* Profile Image */}
        <div className="w-48 h-48 mb-6 rounded-2xl overflow-hidden shadow-lg border-4 border-gray-700">
          <img 
            src={profileData.image} 
            alt={profileData.name}
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Name */}
        <h1 className="text-4xl font-bold mb-2">{profileData.name}</h1>
        
        {/* Title */}
        <h2 className="text-xl text-gray-400 mb-6">{profileData.title}</h2>
        
        {/* Bio */}
        <p className="text-lg text-gray-300 mb-8">{profileData.bio}</p>
        
        {/* Social Links */}
        <div className="flex space-x-6">
          {profileData.links.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="text-gray-400 hover:text-brand-orange transition-colors duration-200"
            >
              {Icons[link.icon] || link.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;