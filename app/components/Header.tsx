'use client'; 

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  // Function to close both mobile menus
  const closeMenus = () => {
    setMenuOpen(false);
    setSpotifyOpen(false);
  };

  return (
    // Using pure black background and a subtle gray border for the top bar
    <header className="w-full bg-black border-b border-gray-700/50 text-white shadow-lg sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo / Title - Now a functional Home Link */}
        <Link href="/" className="text-2xl font-bold transition-opacity hover:opacity-80" onClick={closeMenus}>
          {/* JENNIE is White, STATS is Red (your requested colors) */}
          <span className="text-white">JENNIE</span><span className="text-red-500"> STATS</span>
        </Link>

        {/* Mobile Menu Button (Hamburger Icon) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl p-2 rounded-lg hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {/* Using the hamburger icon character */}
          &#x2261; 
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-red-500 transition-colors">Home</Link>

          {/* Spotify Dropdown Group - Hover behavior for desktop */}
          <div className="relative group">
            <button 
              className="flex items-center gap-1 hover:text-red-500 transition-colors" 
              aria-expanded={spotifyOpen}
              aria-controls="spotify-menu-desktop"
            >
              Spotify
              {/* Simple down arrow icon */}
              <svg className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {/* Dropdown content */}
            <div 
              id="spotify-menu-desktop"
              className="absolute hidden group-hover:block bg-black border border-gray-700 p-2 mt-2 z-30 min-w-[120px] rounded-md shadow-xl"
            >
              <Link href="/spotify/charts" className="block py-1 px-2 hover:text-red-500 transition-colors">Charts</Link>
              <Link href="/spotify/tracks" className="block py-1 px-2 hover:text-red-500 transition-colors">Tracks</Link>
              <Link href="/spotify/albums" className="block py-1 px-2 hover:text-red-500 transition-colors">Albums</Link>
              <Link href="/spotify/artist" className="block py-1 px-2 hover:text-red-500 transition-colors">Artist</Link>
            </div>
          </div>
          
          {/* Top-level links */}
          <Link href="/youtube" className="hover:text-red-500 transition-colors">YouTube</Link> 
          <Link href="/apple" className="hover:text-red-500 transition-colors">Apple Music</Link>
          <Link href="/discography" className="hover:text-red-500 transition-colors">Discography</Link>
          <Link href="/milestones" className="hover:text-red-500 transition-colors">Milestones</Link>
        </nav>
      </div>
      
      {/* Mobile Dropdown Menu (Renders when menuOpen is true) */}
      {menuOpen && (
        // Use a higher Z-index to ensure it sits over page content
        <div className="md:hidden bg-black border-t border-gray-700/50 p-4 text-base transition-all duration-300 ease-in-out">
          <Link href="/" className="block py-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Home</Link>

          {/* Spotify Dropdown for Mobile - Click to toggle sub-menu */}
          <button 
            className="w-full text-left py-2 hover:text-red-500 transition-colors" 
            onClick={() => setSpotifyOpen(!spotifyOpen)}
          >
            Spotify
            {/* Simple arrow icon */}
            <svg className={`w-4 h-4 inline ml-2 transform transition-transform ${spotifyOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {spotifyOpen && (
            <div className="ml-4 border-l border-gray-700">
              {/* Added Charts link based on your previous request */}
              <Link href="/spotify/charts" className="block py-1 px-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Charts</Link>
              <Link href="/spotify/tracks" className="block py-1 px-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Tracks</Link>
              <Link href="/spotify/albums" className="block py-1 px-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Albums</Link>
              <Link href="/spotify/artist" className="block py-1 px-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Artist</Link>
            </div>
          )}

          {/* Other Mobile Links */}
          <Link href="/youtube" className="block py-2 hover:text-red-500 transition-colors" onClick={closeMenus}>YouTube</Link>
          <Link href="/apple" className="block py-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Apple Music</Link>
          <Link href="/discography" className="block py-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Discography</Link>
          <Link href="/milestones" className="block py-2 hover:text-red-500 transition-colors" onClick={closeMenus}>Milestones</Link>
        </div>
      )}
    </header>
  );
}