// app/components/Layout.tsx

import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        // Changed bg-gray-900 to bg-black
        <div className="min-h-screen bg-black">
            <Sidebar />
            
            {/* Main content area shifts to the right by the width of the sidebar (w-64 = ml-64) */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}