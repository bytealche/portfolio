import React from 'react';
import fileSystem from '../core/fileSystem';

// Helper component for a single project
const Project = ({ title, content }) => (
  <div className="mb-4">
    <h3 className="text-xl font-bold text-green-400">{title}</h3>
    <p className="text-gray-300 whitespace-pre-line">{content.split('\n').slice(1, 4).join('\n')}</p>
  </div>
);

// Helper component for a link
const Link = ({ href, children }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="block py-2 text-lg text-cyan-400 hover:text-cyan-300"
  >
    {children}
  </a>
);

function MobileFallback() {
  // Get data directly from our file system
  const about = fileSystem['~'].children['about.md'].content;
  const projects = fileSystem['~'].children['projects'].children;
  const resumeUrl = fileSystem['~'].children['resume.pdf'].url;
  const socials = fileSystem['~'].children['socials.txt'].content;

  return (
    <div className="w-full min-h-screen p-6 bg-terminal-bg text-terminal-text font-mono">
      <div className="max-w-2xl mx-auto">
        
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white">Aniket</h1>
          <h2 className="text-2xl text-gray-400">Data Analyst</h2>
          
          {/* --- NEW NAV BAR --- */}
          <nav className="mt-4 flex space-x-6">
            <a href="#about" className="text-lg text-cyan-400 hover:text-cyan-300">
              About
            </a>
            <a href="#projects" className="text-lg text-cyan-400 hover:text-cyan-300">
              Projects
            </a>
            <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-lg text-cyan-400 hover:text-cyan-300">
              Resume
            </a>
          </nav>
          {/* --- END NEW NAV BAR --- */}
        </header>

        {/* --- ADDED id="about" --- */}
        <section id="about" className="mb-8">
          <h3 className="text-2xl font-bold text-green-400 mb-2">About Me</h3>
          <p className="text-gray-300 whitespace-pre-line">{about}</p>
        </section>

        <section className="mb-8">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Quick Links</h3>
          {socials.split('\n').map(line => {
            if (!line.includes(':')) return null;
            const [platform, url] = line.split(':');
            return <Link key={platform} href={url.trim()}>{platform}</Link>
          })}
        </section>

        {/* --- ADDED id="projects" --- */}
        <section id="projects">
          <h3 className="text-2xl font-bold text-green-400 mb-4">Featured Projects</h3>
          {Object.entries(projects).map(([fileName, data]) => (
            <Project key={fileName} title={fileName} content={data.content} />
          ))}
        </section>

        <footer className="mt-12 text-center text-gray-500">
          <p>Built by Aniket. (This is the mobile-friendly view)</p>
        </footer>
      </div>
    </div>
  );
}

export default MobileFallback;