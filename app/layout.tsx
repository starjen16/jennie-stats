import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";   // ✅ IMPORTANT

export const metadata: Metadata = {
  title: "Jennie Stats",
  description: "Streaming stats, charts & milestones for Jennie",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">

        {/* HEADER */}
        <header className="w-full border-b border-red-900/40 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">
              <span className="text-red-500">Jennie</span> Stats
            </h1>

            {/* NAVIGATION */}
            <nav className="flex gap-6 text-sm">
              <Link href="/" className="hover:text-red-400">Home</Link>
              <Link href="/spotify" className="hover:text-red-400">Spotify</Link>
              <Link href="/youtube" className="hover:text-red-400">YouTube</Link>
              <Link href="/apple" className="hover:text-red-400">Apple Music</Link>
              <Link href="/discography" className="hover:text-red-400">Discography</Link>
              <Link href="/charts" className="hover:text-red-400">Charts</Link>
              <Link href="/milestones" className="hover:text-red-400">Milestones</Link>
            </nav>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          {children}
        </main>

      </body>
    </html>
  );
}
