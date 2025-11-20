// app/charts/page.tsx
// This component now relies on the /api/charts route, which reads the local cache.

type ChartStat = {
    source: string;
    rank?: number;
    song?: string;
    streams?: string;
    views?: string;
    count?: string;
};

type ChartData = {
    timestamp: string;
    stats: ChartStat[];
};

// Function to fetch data from our fast API route
async function getChartStats(): Promise<ChartData> {
  const API_BASE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

  // Fetch from the public API route, which reads the static cache file
  const res = await fetch(`${API_BASE_URL}/api/charts`, {
    // This is the key Next.js feature: revalidate every 60 seconds (or your desired interval)
    // The cron job updates the *source file*, but this makes the fetch request fresh.
    next: { revalidate: 60 } 
  });
  
  if (!res.ok) {
    console.error(`Failed to fetch charts: ${res.status} ${res.statusText}`);
    return { timestamp: 'Error loading data', stats: [] };
  }

  return res.json();
}

export default async function ChartsPage() {
  const data = await getChartStats();

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold text-red-500 mb-8 text-center">
        Global Chart Rankings & Stats
      </h1>
      
      {data.stats.length === 0 ? (
          <p className="text-center text-xl text-gray-500">
            No statistics available right now. Please check back later!
          </p>
      ) : (
        <div className="overflow-x-auto bg-black border border-red-900 rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-red-900">
            <thead className="bg-gray-900">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-red-400">Source</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-red-400">Rank/Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-red-400">Item</th>
                <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider text-red-400">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-red-900">
              {data.stats.map((stat, index) => (
                <tr key={index} className="hover:bg-gray-800 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap font-medium">{stat.source}</td>
                  <td className="py-3 px-4 whitespace-nowrap text-red-400">
                    {stat.rank ? `#${stat.rank}` : stat.count ? 'Count' : 'N/A'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{stat.song || 'N/A'}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {stat.streams || stat.views || stat.count || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <p className="text-center text-gray-500 mt-6 text-sm">
        Data last updated: **{new Date(data.timestamp).toLocaleString()}**
      </p>

    </main>
  );
}