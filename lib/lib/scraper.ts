// app/api/cron/fetch-jennie-charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { scrapeKWORBStats } from '@/lib/scraper'; // <-- IMPORT NEW FUNCTION

export const dynamic = 'force-dynamic'; 

const dataFilePath = path.join(process.cwd(), 'data/jennie_charts_cache.json');

export async function GET() {
    try {
        // 1. Run the actual KWORB scraper function
        const freshStats = await scrapeKWORBStats(); // <-- NOW CALLING THE REAL SCRAPER
        
        if (freshStats.length === 0) {
            // Important check: Don't overwrite good data with bad data if scraping fails
            return NextResponse.json(
                { success: false, message: "Scraper ran but returned no data. Cache NOT updated." },
                { status: 200 } // Success in running the handler, but data is an issue
            );
        }
        
        const newTimestamp = new Date().toISOString();
        const updatedData = {
            timestamp: newTimestamp,
            stats: freshStats
        };

        // 2. Write the fresh data to the local JSON cache file
        await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));

        console.log(`Cron job completed. Cache updated at: ${newTimestamp}`);

        return NextResponse.json({ 
            success: true, 
            message: "Charts cache updated successfully.",
            timestamp: newTimestamp
        });
    } catch (error) {
        console.error("Cron job failed:", error);
        return NextResponse.json(
            { success: false, message: "Cron job failed to update cache." },
            { status: 500 }
        );
    }
}