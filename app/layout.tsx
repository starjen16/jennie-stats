import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Jennie Stats",
  description: "Jennie's Global Streaming Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">

        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-red-800/30">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">

            {/* LOGO */}
            <h1 className="text-2xl font-extrabold tracking-widest text-red-500">
              JENNIE <span className="text-white">STATS</span>
            </h1>

            {/* NAV */}
            <nav className="hidden sm:flex gap-6 text-sm">
              <Link href="/" className="hover:text-red-500 transition">Home</Link>
              <Link href="/spotify" className="hover:text-red-500 transition">Spotify</Link>
              <Link href="/youtube" className="hover:text-red-500 transition">YouTube</Link>
              <Link href="/apple" className="hover:text-red-500 transition">Apple Music</Link>
              <Link href="/discography" className="hover:text-red-500 transition">Discography</Link>
              <Link href="/milestones" className="hover:text-red-500 transition">Milestones</Link>
            </nav>

          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="fade-in max-w-6xl mx-auto px-4 py-10">
          {children}
        </main>

      </body>
    </html>
  );
}
