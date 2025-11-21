// app/components/Sidebar.tsx

import Link from 'next/link';

// Defines the navigation links for the Sidebar
const navItems = [
    { name: 'Global Charts', href: '/charts' },
    { name: 'Profile / Milestones', href: '/profile' },
    { name: 'Timeline', href: '/timeline' },
];

export default function Sidebar() {
    return (
        // Changed bg-gray-900 to bg-black
        <div className="w-64 min-h-screen bg-black border-r border-red-900/50 flex flex-col fixed top-0 left-0 pt-8 z-10">
            <div className="px-6 pb-6 border-b border-red-900/50">
                <h1 className="text-xl font-extrabold text-red-500">JENNIE STATS</h1>
                <p className="text-xs text-gray-500 mt-1">Global Data Analysis</p>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-2">
                {navItems.map((item) => (
                    <Link 
                        key={item.name} 
                        href={item.href} 
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 rounded-lg hover:bg-red-900 hover:text-white transition-colors"
                    >
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
}