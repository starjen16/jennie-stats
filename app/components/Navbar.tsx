"use client";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-black border-b border-red-900 text-white px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-2xl font-bold">
        <span className="text-red-500">JENNIE</span> STATS
      </Link>

      <div className="hidden md:flex space-x-8 items-center">
        <Link href="/">Home</Link>

        <div className="group relative">
          <button>Spotify ▾</button>
          <div className="absolute hidden group-hover:block bg-black border border-red-800 py-2 w-40">
            <Link href="/spotify/tracks" className="block px-4 py-2 hover:bg-red-700">Tracks</Link>
            <Link href="/spotify/albums" className="block px-4 py-2 hover:bg-red-700">Albums</Link>
            <Link href="/spotify/artist" className="block px-4 py-2 hover:bg-red-700">Artist</Link>
          </div>
        </div>

        <Link href="/youtube">YouTube</Link>
        <Link href="/apple">Apple Music</Link>
        <Link href="/discography">Discography</Link>
        <Link href="/milestones">Milestones</Link>
      </div>

      <button className="md:hidden" onClick={() => setOpen(!open)}>☰</button>

      {open && (
        <div className="absolute top-16 right-4 bg-black w-48 p-4 border border-red-800 md:hidden space-y-3">
          <Link href="/">Home</Link>

          <details>
            <summary>Spotify</summary>
            <div className="ml-4 mt-2 space-y-1">
              <Link href="/spotify/tracks">Tracks</Link>
              <Link href="/spotify/albums">Albums</Link>
              <Link href="/spotify/artist">Artist</Link>
            </div>
          </details>

          <Link href="/youtube">YouTube</Link>
          <Link href="/apple">Apple Music</Link>
          <Link href="/discography">Discography</Link>
          <Link href="/milestones">Milestones</Link>
        </div>
      )}
    </nav>
  );
}
