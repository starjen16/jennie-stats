// app/charts/page.tsx

// Define the data structure you expect from the API
type JennieStat = {
    source: string;
    rank?: number;
    song?: string;
    streams?: string;
    views?: string;
    count?: string;
};

// Main function to fetch data and render the page
// This uses Next.js server component fetching
export default async function ChartsPage() {
    let stats: JennieStat[] = [];
    let timestamp = "Invalid Date";
    let hasData = false;
    
    // Determine the base URL for the API call (safe for both local and Vercel environments)
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    
    try {
        // Fetch data from your API route that reads the /tmp cache file
        const res = await fetch(`${baseUrl}/api/charts`, {
            // Force dynamic request to get fresh data on every page load
            cache: 'no-store' 
        });

        if (res.ok) {
            stats = await res.json();
            
            // Check if the stats array has actual, valid data
            if (Array.isArray(stats) && stats.length > 0) {
                // If you implemented the fallback in /api/charts/route.ts, check for it:
                if (stats.length === 1 && stats[0].source === "No Data Yet") {
                    hasData = false; // Treat it as no data if it's the specific placeholder
                } else {
                    hasData = true;
                    // Use the current time for the timestamp since the scraper doesn't save one
                    timestamp = new Date().toLocaleTimeString(); 
                }
            }
        }
    } catch (error) {
        console.error("Error fetching chart data:", error);
    }

    return (
        <div className="text-center mt-20">
            <h1 className="text-red-500 text-3xl font-bold mb-5">Global Chart Rankings & Stats</h1>
            
            {hasData ? (
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
                <p className="text-lg text-gray-400 mt-5">No statistics available right now. Please check back later!</p>
            )}

            <p className="text-center text-gray-500 mt-6 text-sm">
                Data last updated: **{timestamp}**
            </p>
        </div>
    );
}