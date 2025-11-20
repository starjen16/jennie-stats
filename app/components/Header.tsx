"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-red-900 bg-black text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">

        <Link href="/" className="text-2xl font-bold">
          <span className="text-red-500">JENNIE</span> STATS
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/">Home</Link>

          <div className="relative group">
            <button className="flex items-center">
              Spotify ▼
            </button>
            <div className="absolute hidden group-hover:block bg-black border border-red-900 mt-2 w-40">
              <Link href="/spotify/tracks" className="block px-4 py-2 hover:bg-red-900/30">Tracks</Link>
              <Link href="/spotify/albums" className="block px-4 py-2 hover:bg-red-900/30">Albums</Link>
              <Link href="/spotify/artist" className="block px-4 py-2 hover:bg-red-900/30">Artist</Link>
            </div>
          </div>

          <Link href="/youtube">YouTube</Link>
          <Link href="/apple">Apple Music</Link>
          <Link href="/discography">Discography</Link>
          <Link href="/milestones">Milestones</Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {open && (
        <div className="md:hidden bg-black border-t border-red-900">
          <Link href="/" className="block px-4 py-2">Home</Link>
          <Link href="/spotify/tracks" className="block px-4 py-2">Spotify – Tracks</Link>
          <Link href="/spotify/albums" className="block px-4 py-2">Spotify – Albums</Link>
          <Link href="/spotify/artist" className="block px-4 py-2">Spotify – Artist</Link>
          <Link href="/youtube" className="block px-4 py-2">YouTube</Link>
          <Link href="/apple" className="block px-4 py-2">Apple Music</Link>
          <Link href="/discography" className="block px-4 py-2">Discography</Link>
          <Link href="/milestones" className="block px-4 py-2">Milestones</Link>
        </div>
      )}
    </header>
  );
}
