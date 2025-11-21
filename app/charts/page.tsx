// app/charts/page.tsx

// FIX 1: Force dynamic rendering to resolve "Dynamic server usage" error (from previous steps)
export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
// FIX 2: Correct the import name from 'scrapeCharts' to the actual exported function 'scrapeData'
import { scrapeData } from '@/lib/scraper'; 

// Define the structure for the Spotify data (from your previous work)
interface SpotifyChartEntry {
    rank: number;
    title: string;
    artist: string;
    streams: string;
    date: string;
}

// Define the structure for the combined scraped data
interface ScrapedData {
    spotify: SpotifyChartEntry[];
    youtube: {
        views: number;
        title: string;
        date: string;
    };
}


export const metadata: Metadata = {
  title: 'Charts | JENNIE Stats',
  description: 'Spotify and YouTube chart data for JENNIE.',
};

// Function to fetch and process data from the API route (server-side)
async function getChartData(): Promise<ScrapedData> {
    const data = await scrapeData();
    return data;
}

export default async function ChartsPage() {
    const chartData = await getChartData();
    
    // FIX 3: Removed the problematic import for ChartsView 
    // and replaced it with basic display logic to allow the build to succeed.
    // You will need to re-implement your components later, but for now, we prioritize the build.
    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-6">Spotify Global Charts (Daily)</h1>
            
            <section className="bg-gray-800 p-4 rounded mb-8">
                <h2 className="text-xl text-red-400">YouTube Stats</h2>
                <p className="text-4xl font-mono mt-2">{chartData.youtube.views.toLocaleString()} VIEWS</p>
                <p className="text-sm text-gray-400">"{chartData.youtube.title}" | Last Updated: {chartData.youtube.date}</p>
            </section>
            
            <h2 className="text-2xl font-semibold mb-4">Top 10 Spotify Global Chart Entries</h2>
            
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr className="bg-gray-700 text-left text-xs font-medium uppercase tracking-wider">
                            <th className="px-4 py-3">Rank</th>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Artist</th>
                            <th className="px-4 py-3">Streams (Popularity)</th>
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

            {/* Fallback check */}
            {chartData.spotify.length === 0 && (
                <div className="text-center text-red-500 mt-8 p-4 border border-red-500 bg-red-900 bg-opacity-20 rounded">
                    Error: The system was unable to fetch data from the source. Please check Spotify credentials/logs.
                </div>
            )}
        </main>
    ); 
}