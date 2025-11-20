// app/api/cron/fetch-jennie-charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { scrapeKWORBStats } from '@/lib/scraper';

export const dynamic = 'force-dynamic';

const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        const newStats = await scrapeKWORBStats();
        await fs.writeFile(dataFilePath, JSON.stringify(newStats, null, 2), 'utf8');

        return NextResponse.json({ success: true, message: 'Charts cache updated successfully.' });
    } catch (error) {
        console.error("Cron Job Failed to Scrape and Write:", error);

        // 👇👇👇 FIX START: Type check the error object 👇👇👇
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        
        return NextResponse.json(
            { 
                success: false, 
                message: 'Failed to update cache.', 
                error: errorMessage // Use the safely checked variable
            }, 
            { status: 500 }
        );
        // 👆👆👆 FIX END 👆👆👆
    }
}