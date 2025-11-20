import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// CRUCIAL FIX: Force the route to run dynamically on every request.
export const dynamic = 'force-dynamic'; 

const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        // 1. Read the data from the local cache file in /tmp
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents); 

        // 2. Return the cached data (the full object: { timestamp, stats })
        return NextResponse.json(cachedData);

    } catch (error) {
        console.error("Error reading charts cache:", error);
        
        // Fallback placeholder data matching the object structure
        return NextResponse.json(
            { 
                timestamp: '', 
                stats: [ 
                    { source: "Cache Read Error", song: "Please trigger /api/cron/fetch-jennie-charts", count: "N/A" }
                ]
            }, 
            { status: 500 }
        );
    }
}