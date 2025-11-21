import Sidebar from './Sidebar';

// Important: Define the type for 'children' to prevent TypeScript errors.
interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        // Set the primary dark background for the entire page
        <div className="min-h-screen bg-gray-900">
            {/* The Sidebar is fixed on the left */}
            <Sidebar />
            
            {/* Main content area shifts to the right by the width of the sidebar (w-64 = ml-64) */}
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}