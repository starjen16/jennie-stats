import "./globals.css";
import Header from "./components/Header";

export const metadata = {
  title: "Jennie Stats",
  description: "Jennie's Global Streaming Dashboard",
};

export default function RootLayout({ children }) {
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