import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jennie Stats",
  description: "Streaming stats, charts & milestones for Jennie",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <header className="w-full border-b border-red-900/40 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold tracking-wide">
              <span className="text-red-500">Jennie</span> Stats
            </h1>

            <nav className="flex gap-6 text-sm">
              <a href="/" className="hover:text-red-400">Home</a>
              <a href="/spotify" className="hover:text-red-400">Spotify</a>
              <a href="/youtube" className="hover:text-red-400">YouTube</a>
              <a href="/apple-music" className="hover:text-red-400">Apple Music</a>
              <a href="/discography" className="hover:text-red-400">Discography</a>
              <a href="/charts" className="hover:text-red-400">Charts</a>
              <a href="/milestones" className="hover:text-red-400">Milestones</a>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-10">
          {children}
        </main>

        <footer className="text-center text-xs text-gray-500 py-6 border-t border-neutral-900">
          Fan-made website · Jennie Stats © {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
