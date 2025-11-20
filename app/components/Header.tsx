"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [spotifyOpen, setSpotifyOpen] = useState(false);

  return (
    <header className="w-full bg-black border-b border-red-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          <span className="text-red-500">JENNIE</span> STATS
        </Link>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-3xl"
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/">Home</Link>

          <div className="relative group">
            <button className="flex items-center gap-1">
              Spotify ▾
            </button>

            <div className="absolute hidden group-hover:block bg-black border border-red-900 p-3 mt-2">
              <Link className="block py-1" href="/spotify/tracks">Tracks</Link>
              <Link className="block py-1" href="/spotify/albums">Albums</Link>
              <Link className="block py-1" href="/spotify/artist">Artist</Link>
            </div>
          </div>

          <Link href="/youtube">YouTube</Link>
          <Link href="/apple">Apple Music</Link>
          <Link href="/discography">Discography</Link>
          <Link href="/milestones">Milestones</Link>

        </nav>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black border-t border-red-900 p-4 text-lg">
          <Link className="block py-2" href="/">Home</Link>

          <button className="block py-2" onClick={() => setSpotifyOpen(!spotifyOpen)}>
            Spotify ▾
          </button>

          {spotifyOpen && (
            <div className="ml-4">
              <Link className="block py-1" href="/spotify/tracks">Tracks</Link>
              <Link className="block py-1" href="/spotify/albums">Albums</Link>
              <Link className="block py-1" href="/spotify/artist">Artist</Link>
            </div>
          )}

          <Link className="block py-2" href="/youtube">YouTube</Link>
          <Link className="block py-2" href="/apple">Apple Music</Link>
          <Link className="block py-2" href="/discography">Discography</Link>
          <Link className="block py-2" href="/milestones">Milestones</Link>
        </div>
      )}
    </header>
  );
}
