"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-red-800/40">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-2xl font-extrabold tracking-widest text-red-500">
          JENNIE <span className="text-white">STATS</span>
        </h1>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Nav href="/">Home</Nav>
          <Nav href="/spotify">Spotify</Nav>
          <Nav href="/youtube">YouTube</Nav>
          <Nav href="/apple">Apple Music</Nav>
          <Nav href="/discography">Discography</Nav>
          <Nav href="/milestones">Milestones</Nav>
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-black border-t border-red-800/40 px-6 py-4 space-y-4">
          <MobileNav href="/" label="Home" onClick={() => setOpen(false)} />
          <MobileNav href="/spotify" label="Spotify" onClick={() => setOpen(false)} />
          <MobileNav href="/youtube" label="YouTube" onClick={() => setOpen(false)} />
          <MobileNav href="/apple" label="Apple Music" onClick={() => setOpen(false)} />
          <MobileNav href="/discography" label="Discography" onClick={() => setOpen(false)} />
          <MobileNav href="/milestones" label="Milestones" onClick={() => setOpen(false)} />
        </div>
      )}
    </header>
  );
}

function Nav({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="hover:text-red-500 transition font-semibold tracking-wide">
      {children}
    </Link>
  );
}

function MobileNav({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-lg font-semibold hover:text-red-400 transition"
    >
      {label}
    </Link>
  );
}
