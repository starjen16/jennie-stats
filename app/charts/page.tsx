// app/charts/page.tsx

// FIX: Force dynamic rendering to resolve "Dynamic server usage" error
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
// FIX: Correctly import the 'scrapeData' function
import { scrapeData } from '@/lib/scraper'; 

// --- Interfaces to mirror lib/scraper.ts ---
interface SpotifyChartEntry {
    rank: number;
    title: string;
    artist: string;
    streams: string;
    date: string;
}

interface ScrapedData {
    spotify: SpotifyChartEntry[];
    youtube: {
        views: number;
        title: string;
        date: string;
    };
}
// ------------------------------------------

export const metadata: Metadata = {
  title: 'Charts | JENNIE Stats',
  description: 'Spotify and YouTube chart data for JENNIE.',
};

async function getChartData(): Promise<ScrapedData> {
    // Calls the corrected logic in lib/scraper.ts
    const data = await scrapeData();
    return data;
}

export default async function ChartsPage() {
    const chartData = await getChartData();
    
    // Renders basic HTML and a table to replace the problematic ChartsView component.
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">📈 JENNIE Performance Charts</h1>
            
            {/* YouTube Section (Placeholder Data) */}
            <section className="bg-gray-800 p-4 rounded mb-8">
                <h2 className="text-xl text-yellow-400">YouTube Stats (Static)</h2>
                <p className="text-4xl font-mono mt-2">{chartData.youtube.views.toLocaleString()} VIEWS</p>
                <p className="text-sm text-gray-400">"{chartData.youtube.title}" | Last Updated: {chartData.youtube.date}</p>
            </section>
            
            {/* Spotify Section */}
            <h2 className="text-2xl font-semibold mb-4">Top 10 Spotify Global Chart Entries</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr className="bg-gray-700 text-left text-xs font-medium uppercase tracking-wider">
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Artist</th>
                            <th className="px-4 py-3">Popularity Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {chartData.spotify.map((entry) => (
                            <tr key={entry.rank} className="hover:bg-gray-800">
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{entry.rank}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{entry.title}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-400">{entry.artist}</td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm">{entry.streams}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Error Message when Spotify API fails */}
            {chartData.spotify.length === 0 && (
                <div className="text-center text-red-500 mt-8 p-4 border border-red-500 bg-red-900 bg-opacity-20 rounded">
                    ⚠️ Error: Could not fetch data from the Spotify API. Check Vercel Environment Variables.
                </div>
            )}
        </main>
    ); 
}