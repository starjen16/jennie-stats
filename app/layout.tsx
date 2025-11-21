// app/layout.tsx

import './globals.css'; 
import Layout from './components/Layout'; 

// You can keep your existing Metadata or set it up later

export default function RootLayout({
  children,
}: {
  // We specify the type of children here for TypeScript
  children: React.ReactNode 
}) {
  return (
    <html lang="en">
      {/* Note: We removed the `className` from body since `globals.css` now handles the colors. */}
      <body> 
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}