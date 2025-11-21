// app/spotify/charts/page.tsx
import { scrapeData } from '../../api/cron/route'; // <-- CORRECTED FIX APPLIED HERE

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

// Function to fetch and process data from the API route
async function getChartData(): Promise<ScrapedData> {
    // We call the scraper function directly for server-side rendering
    const data = await scrapeData();
    return data;
}

// Component to render the page
export default async function SpotifyChartsPage() {
    let data: ScrapedData | null = null;
    let error: string | null = null;

    try {
        data = await getChartData();
    } catch (e) {
        console.error("Failed to fetch data:", e);
        error = "Failed to load data. The scraping endpoint may have failed.";
    }

    if (error) {
        return (
            <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-100">
                <h2 className="text-xl font-bold">Data Error</h2>
                <p>{error}</p>
            </div>
        );
    }

    // --- Start of BCD Styling ---
    const spotifyData = data?.spotify || [];
    const youtubeData = data?.youtube || { views: 0, title: 'N/A', date: 'N/A' };


    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-extrabold text-white border-b border-gray-700/50 pb-2 mb-6">
                Spotify Global Charts (Daily)
            </h1>

            {/* 1. YouTube Data Card (Small, BCD-style stats box) */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
                <h2 className="text-xl font-bold text-red-500 mb-2">YouTube Stats</h2>
                <p className="text-sm text-gray-400">"{youtubeData.title}" Music Video Views</p>
                <div className="mt-4 flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-white">
                        {youtubeData.views.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500">VIEWS</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">Last Updated: {youtubeData.date}</p>
            </div>

            {/* 2. Spotify Charts Card (Main Data Table) */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-red-500 border-b border-gray-700/50 pb-3">
                        Top 50 Spotify Global Chart Entries
                    </h2>
                </div>
                
                {/* BCD-Style Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-800">
                        {/* Table Header */}
                        <thead>
                            <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-3 text-left font-medium w-16">Rank</th>
                                <th className="px-6 py-3 text-left font-medium">Title</th>
                                <th className="px-6 py-3 text-left font-medium hidden sm:table-cell">Artist</th>
                                <th className="px-6 py-3 text-right font-medium">Daily Streams</th>
                            </tr>
                        </thead>
                        {/* Table Body */}
                        <tbody className="divide-y divide-gray-800 text-sm">
                            {spotifyData.map((entry, index) => (
                                <tr key={index} className="hover:bg-gray-800 transition-colors">
                                    <td className="px-6 py-3 whitespace-nowrap text-center font-extrabold text-red-500/80">
                                        {entry.rank}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap font-medium text-white">
                                        {entry.title}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-gray-400 hidden sm:table-cell">
                                        {entry.artist}
                                    </td>
                                    <td className="px-6 py-3 whitespace-nowrap text-right font-mono text-white">
                                        {entry.streams}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-800">
                    <p className="text-xs text-gray-500">
                        Data from Spotify Charts, updated: {spotifyData[0]?.date || 'N/A'}
                    </p>
                </div>
            </div>
        </div>
    );
}