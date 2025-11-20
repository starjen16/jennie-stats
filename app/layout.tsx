// app/layout.tsx

// Import the Header component (which you already have)
import Header from "./components/Header"; 
// You don't need to import React.ReactNode, but it's good practice
// if you were using an older Next.js version or had custom types.

// ... (Your metadata object) ...

// FIX: Add the correct type annotation for the children prop
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        <Header /> 
        <main className="max-w-6xl mx-auto px-4 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}