// app/api/cron/fetch-jennie-charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { scrapeKWORBStats } from '@/lib/scraper'; // Your scraping function

// Prevents Vercel from caching the response, forcing the function to run
export const dynamic = 'force-dynamic';

// FIX: Change cache path to Vercel's only writable directory: /tmp
const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        // 1. Run the scraper function (which currently returns placeholder data)
        const newStats = await scrapeKWORBStats();

        // 2. Write the scraped data to the /tmp cache file
        await fs.writeFile(dataFilePath, JSON.stringify(newStats, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Charts cache updated successfully.' });
    } catch (error) {
        console.error("Cron Job Failed to Scrape and Write:", error);
        return NextResponse.json({ success: false, message: 'Failed to update cache.', error: error.message || "Unknown error" }, { status: 500 });
    }
}