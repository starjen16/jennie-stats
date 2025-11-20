// app/charts/page.tsx

// ... (imports remain the same)

export default async function ChartsPage() {
    
    const API_URL = 'https://jennie-stats.vercel.app/api/charts';
    const CRON_URL = 'https://jennie-stats.vercel.app/api/cron/fetch-jennie-charts';

    // Helper function to fetch data
    const fetchData = async () => {
        const res = await fetch(API_URL, { cache: 'no-store' });
        // --- CHANGE 3: The API now returns an OBJECT, not just an array ---
        const finalData = await res.json(); 
        return finalData;
    };

    let finalData = await fetchData();

    // Check 1: Did the API return the "Cache Read Error" fallback?
    // We check the first element of the 'stats' array within the object.
    if (finalData.stats?.length > 0 && finalData.stats[0].source === "Cache Read Error") {
        console.log("Cache Read Error detected, triggering cron job...");
        
        // 1. Force the cache file to be written on this instance/request
        await fetch(CRON_URL, { cache: 'no-store' });
        
        // 2. Re-fetch the data immediately after writing
        finalData = await fetchData();
    }
    
    // Extract the stats array and the timestamp from the final data object
    const stats = finalData.stats || [];
    const timestamp = finalData.timestamp || '';
    
    // --- The rest of your return logic (THE RENDER BLOCK) ---
    return (
        <main className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Jennie Stats</h1>
            
            {/* --- CHANGE 4: Use the extracted timestamp --- */}
            <p className="text-sm text-gray-500 mb-6">
                Data last updated: **
                {timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}
                **
            </p>
            
            {/* --- CHANGE 5: Check the length of the new stats array --- */}
            {stats.length > 0 && stats[0].source !== "Cache Read Error" ? (
                // Your Table Component goes here, using the 'stats' array:
                <div className="overflow-x-auto">
                    {/* Assuming you have a component like <ChartsTable data={stats} /> */}
                    {/* Please replace the placeholder comment below with your actual table rendering code, ensuring it uses the 'stats' variable */}
                    <p className="text-green-500 font-semibold">SUCCESS: Table Placeholder - Data should render here!</p> 
                    <pre>{JSON.stringify(stats, null, 2)}</pre>
                </div>
            ) : (
                // This is the blank screen fallback
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">No statistics available right now.</p>
                    <p>The system is recovering from a cache read error. Please try a **Hard Refresh (Ctrl/Cmd+Shift+R)** in a few seconds.</p>
                </div>
            )}
        </main>
    );
}