import './globals.css'; 
import Layout from './components/Layout'; // <-- ADD THIS IMPORT

// You can keep your existing Metadata

export default function RootLayout({
  children,
}: {
  // Fixes the TypeScript error related to implicit 'any' type for children
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      {/* Set a default body class for consistent dark text on dark background */}
      <body className="text-gray-100"> 
        {/* <-- WRAP WITH THE NEW LAYOUT COMPONENT --> */}
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}