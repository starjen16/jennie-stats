// app/components/Header.tsx
'use client'; 

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  // The border and text colors are updated for the red/white BCD look
  return (
    <header className="w-full bg-black border-b border-gray-700/50 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* 1. JENNIE STATS is now entirely RED and acts as the Home link */}
        <Link 
          href="/" 
          className="text-2xl font-bold text-red-500 hover:text-red-400 transition-colors"
          onClick={() => setMenuOpen(false)} // Close menu if mobile user clicks home
        >
          JENNIE STATS
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
          {/* Home Link is now handled by the JENNIE STATS logo */}

          {/* Spotify Dropdown Group (Charts, Albums, Tracks, Artist) */}
          <div className="relative group">
            {/* Main Spotify Link (Directs to Charts) */}
            <Link href="/spotify/charts" className="flex items-center gap-1 hover:text-red-500">
              Spotify
            </Link>
            {/* Dropdown Menu */}
            <div className="absolute hidden group-hover:block bg-black border border-gray-700/50 p-2 mt-2 z-10 w-40">
              <Link href="/spotify/charts" className="block py-1 hover:text-red-500">Charts</Link>
              <Link href="/spotify/albums" className="block py-1 hover:text-red-500">Albums</Link>
              <Link href="/spotify/tracks" className="block py-1 hover:text-red-500">Tracks</Link>
              <Link href="/spotify/artist" className="block py-1 hover:text-red-500">Artist Profile</Link>
            </div>
          </div>
          
          {/* Top-level links - Updated to match the requested tabs */}
          <Link href="/youtube" className="hover:text-red-500">YouTube</Link> 
          <Link href="/apple-music" className="hover:text-red-500">Apple Music</Link> {/* Updated link for routing consistency */}
          <Link href="/discography" className="hover:text-red-500">Discography</Link>
          <Link href="/milestones" className="hover:text-red-500">Milestones</Link>
        </nav>
      </div>
      
      {/* Mobile Dropdown Menu (Renders when menuOpen is true) */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-gray-700/50 p-4 text-lg">
          
          {/* Spotify Dropdown for Mobile */}
          <button 
            className="block py-2 hover:text-red-500" 
            onClick={() => setSpotifyOpen(!spotifyOpen)}
          >
            Spotify
          </button>
          {spotifyOpen && (
            <div className="ml-4">
              <Link href="/spotify/charts" className="block py-1" onClick={() => { setMenuOpen(false); setSpotifyOpen(false); }}>Charts</Link>
              <Link href="/spotify/albums" className="block py-1" onClick={() => { setMenuOpen(false); setSpotifyOpen(false); }}>Albums</Link>
              <Link href="/spotify/tracks" className="block py-1" onClick={() => { setMenuOpen(false); setSpotifyOpen(false); }}>Tracks</Link>
              <Link href="/spotify/artist" className="block py-1" onClick={() => { setMenuOpen(false); setSpotifyOpen(false); }}>Artist Profile</Link>
            </div>
          )}

          {/* Other Mobile Links */}
          <Link href="/youtube" className="block py-2 hover:text-red-500" onClick={() => setMenuOpen(false)}>YouTube</Link>
          <Link href="/apple-music" className="block py-2 hover:text-red-500" onClick={() => setMenuOpen(false)}>Apple Music</Link>
          <Link href="/discography" className="block py-2 hover:text-red-500" onClick={() => setMenuOpen(false)}>Discography</Link>
          <Link href="/milestones" className="block py-2 hover:text-red-500" onClick={() => setMenuOpen(false)}>Milestones</Link>
        </div>
      )}
    </header>
  );
}