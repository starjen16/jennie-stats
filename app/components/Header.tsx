// app/components/Header.tsx
'use client'; 

import Link from 'next/link';
import { useState } from 'react';

// Assuming you have a component/icon for the menu button (e.g., a simple hamburger icon)

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  return (
    <header className="w-full bg-black border-b border-red-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <Link href="/" className="text-2xl font-bold">
          <span>JENNIE</span><span className="text-red-500"> STATS</span>
        </Link>

        {/* Mobile Menu Button (Toggle menuOpen state) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl"
        >
          {/* Use a simple character or an icon component here */}
          &#x2261; 
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>

          {/* Spotify Dropdown Group */}
          <div className="relative group">
            <button className="flex items-center gap-1">
              Spotify
            </button>
            <div className="absolute hidden group-hover:block bg-black border border-red-900 p-2 mt-2 z-10">
              <Link href="/spotify/tracks" className="block py-1 hover:text-red-500">Tracks</Link>
              <Link href="/spotify/albums" className="block py-1 hover:text-red-500">Albums</Link>
              <Link href="/spotify/artist" className="block py-1 hover:text-red-500">Artist</Link>
            </div>
          </div>
          
          {/* Top-level links - Changed <a> to Link */}
          <Link href="/youtube" className="hover:text-red-500">YouTube</Link> 
          <Link href="/apple" className="hover:text-red-500">Apple Music</Link>
          <Link href="/discography" className="hover:text-red-500">Discography</Link>
          <Link href="/milestones" className="hover:text-red-500">Milestones</Link>
        </nav>
      </div>
      
      {/* Mobile Dropdown Menu (Renders when menuOpen is true) */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-red-900 p-4 text-lg">
          <Link href="/" className="block py-2" onClick={() => setMenuOpen(false)}>Home</Link>

          {/* Spotify Dropdown for Mobile */}
          <button className="block py-2" onClick={() => setSpotifyOpen(!spotifyOpen)}>
            Spotify
          </button>
          {spotifyOpen && (
            <div className="ml-4">
              <Link href="/spotify/tracks" className="block py-1" onClick={() => setMenuOpen(false)}>Tracks</Link>
              <Link href="/spotify/albums" className="block py-1" onClick={() => setMenuOpen(false)}>Albums</Link>
              <Link href="/spotify/artist" className="block py-1" onClick={() => setMenuOpen(false)}>Artist</Link>
            </div>
          )}

          {/* Other Mobile Links - Changed <a> to Link */}
          <Link href="/youtube" className="block py-2" onClick={() => setMenuOpen(false)}>YouTube</Link>
          <Link href="/apple" className="block py-2" onClick={() => setMenuOpen(false)}>Apple Music</Link>
          <Link href="/discography" className="block py-2" onClick={() => setMenuOpen(false)}>Discography</Link>
          <Link href="/milestones" className="block py-2" onClick={() => setMenuOpen(false)}>Milestones</Link>
        </div>
      )}
    </header>
  );
}