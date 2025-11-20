import "./globals.css";
import type { Metadata } from "next";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Jennie Stats",
  description: "Jennie's Global Streaming Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-10">{children}</main>
      </body>
    </html>
  );
}
