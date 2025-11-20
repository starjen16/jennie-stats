// app/api/cron/fetch-jennie-charts/route.ts

// ... (imports and helper functions remain the same)

export async function GET() {
    try {
        const scrapedStats = await getChartData(); // This is the array of stats
        
        // --- CHANGE 1: Write a full data object ---
        const cacheData = {
            timestamp: new Date().toISOString(), // Use ISO string for reliable parsing
            stats: scrapedStats 
        };
        
        // 2. Write the JSON object to the local cache file
        await fs.writeFile(dataFilePath, JSON.stringify(cacheData));

        return NextResponse.json({ success: true, message: "Charts cache updated successfully." });
    } catch (error) {
// ...