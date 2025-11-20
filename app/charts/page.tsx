// app/charts/page.tsx

// Define the data structure you expect for rendering
type JennieStat = {
    source: string;
    rank?: number;
    song?: string;
    streams?: string;
    views?: string;
    count?: string;
};

// Define the full structure returned by the API
type ChartData = {
    timestamp: string;
    stats: JennieStat[];
};

export default async function ChartsPage() {
    
    const API_URL = 'https://jennie-stats.vercel.app/api/charts';
    const CRON_URL = 'https://jennie-stats.vercel.app/api/cron/fetch-jennie-charts';

    // Helper function to fetch data
    const fetchData = async (): Promise<ChartData> => {
        try {
            const res = await fetch(API_URL, { cache: 'no-store', next: { revalidate: 0 } });
            if (!res.ok) {
                // If the API returns a server error (500), read the body to get the fallback data
                return await res.json();
            }
            return await res.json();
        } catch (e) {
            console.error("Network or parsing error:", e);
            // Return a guaranteed error structure if network fails
            return { timestamp: '', stats: [{ source: "Network Error", song: "Failed to connect to API", count: "N/A" }] };
        }
    };

    let finalData = await fetchData();

    // --- Self-Healing Logic (Triggers cron job if cache read fails) ---
    // Check if the API returned the specific "Cache Read Error" fallback
    if (finalData.stats?.length > 0 && finalData.stats[0].source === "Cache Read Error") {
        console.log("Cache Read Error detected, triggering cron job...");
        
        // 1. Force the cache file to be written on this instance/request
        await fetch(CRON_URL, { cache: 'no-store' });
        
        // 2. Re-fetch the data immediately after writing
        finalData = await fetchData();
    }
    
    // Extract data for rendering
    const stats = finalData.stats || [];
    const timestamp = finalData.timestamp || '';
    
    // Check if we have valid stats to display (i.e., not the error message)
    const hasValidData = stats.length > 0 && stats[0].source !== "Cache Read Error";

    return (
        <div className="text-center mt-20">
            <h1 className="text-red-500 text-3xl font-bold mb-5">Global Chart Rankings & Stats</h1>
            
            {/* --- Display the Last Updated Time --- */}
            <p className="text-center text-gray-500 mt-6 text-sm mb-8">
                Data last updated: **
                {timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}
                **
            </p>

            {hasValidData ? (
                // --- Display the Table with Data ---
                <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-xl p-4 mx-auto max-w-4xl">
                    <table className="min-w-full divide-y divide-red-900">
                        <thead className="bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Song</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank/Type</th>
                            </tr>
                        </thead>
                        <tbody className="bg-black divide-y divide-red-900/50">
                            {stats.map((stat, index) => (
                                <tr key={index} className="hover:bg-gray-900 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-400">{stat.source}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{stat.song || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{stat.streams || stat.views || stat.count || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{stat.rank !== undefined ? `#${stat.rank}` : 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                // --- Display the No Data Message ---
                <div className="bg-gray-800 border-l-4 border-red-500 text-gray-200 p-4 mx-auto max-w-md" role="alert">
                    <p className="font-bold">No statistics available right now.</p>
                    <p className="text-sm">The system is attempting to build the cache. Please perform a **Hard Refresh (Ctrl/Cmd+Shift+R)** in a few seconds.</p>
                </div>
            )}
        </div>
    );
}