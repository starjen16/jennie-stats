// app/api/cron/fetch-jennie-charts/route.ts
// This route is the target of your Vercel Cron Job.
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// IMPORTANT: Force this route to be dynamic for Cron jobs to execute reliably
export const dynamic = 'force-dynamic'; 

// Path to the cache file (root of the project: process.cwd())
const dataFilePath = path.join(process.cwd(), 'data/jennie_charts_cache.json');

/**
 * Replace this with your actual KWORB scraper logic.
 * It should return an array of processed stats objects.
 */
async function runScraper() {
    console.log("Starting KWORB Scraper...");
    
    // --- START: YOUR REAL SCRAPING CODE GOES HERE ---
    // Example placeholder data:
    const newStats = [
        { source: "Spotify Global", rank: 1, song: "SOLO", streams: "1.24 Billion" },
        { source: "YouTube MV", rank: 3, song: "SOLO", views: "905 Million" },
        { source: "Apple Music", rank: 1, song: "You & Me", streams: "201 Million" },
    ];
    // --- END: YOUR REAL SCRAPING CODE GOES HERE ---

    return newStats;
}

export async function GET() {
    try {
        // 1. Run the scraper to get fresh data
        const freshStats = await runScraper();
        const newTimestamp = new Date().toISOString();

        const updatedData = {
            timestamp: newTimestamp,
            stats: freshStats
        };

        // 2. Write the fresh data to the local JSON cache file
        await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 2));

        console.log(`Cron job completed. Cache updated at: ${newTimestamp}`);

        // 3. Optional: Revalidate the public API route cache (more advanced technique)
        // If you were using fetch with tags on the public route, you would revalidate here.

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