// app/components/Sidebar.tsx

import Link from 'next/link';

// Defines the structured navigation links
const navItems = [
    { 
        name: 'Spotify', 
        href: '/spotify/charts', // Main Spotify link points to charts
        subItems: [
            { name: 'Charts', href: '/spotify/charts' },
            { name: 'Albums', href: '/spotify/albums' },
            { name: 'Tracks', href: '/spotify/tracks' },
            { name: 'Artist Profile', href: '/spotify/artist' },
        ]
    },
    { name: 'YouTube', href: '/youtube' },
    { name: 'Apple Music', href: '/apple-music' },
    { name: 'Milestones', href: '/milestones' },
];

export default function Sidebar() {
    return (
        <div className="w-64 min-h-screen bg-black border-r border-red-900/50 flex flex-col fixed top-0 left-0 pt-8 z-10">
            <div className="px-6 pb-6 border-b border-red-900/50">
                {/* 1. Subtitle Removed - Only JENNIE STATS remains */}
                <h1 className="text-xl font-extrabold text-red-500">JENNIE STATS</h1>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-4"> {/* Increased space-y to 4 for separation */}
                {navItems.map((item) => (
                    <div key={item.name}>
                        {/* Main Category Link (e.g., Spotify) */}
                        <Link 
                            href={item.href} 
                            className="flex items-center px-4 py-2 text-sm font-bold text-gray-100 rounded-lg hover:bg-red-900 hover:text-white transition-colors"
                        >
                            {item.name}
                        </Link>

                        {/* Sub-Items (Spotify only) */}
                        {item.subItems && (
                            <div className="pl-6 pt-1 space-y-1">
                                {item.subItems.map((subItem) => (
                                    <Link 
                                        key={subItem.name} 
                                        href={subItem.href} 
                                        className="flex items-center px-4 py-1 text-sm text-gray-400 rounded-lg hover:bg-red-900 hover:text-white transition-colors"
                                    >
                                        {subItem.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </nav>
        </div>
    );
}