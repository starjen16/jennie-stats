// app/api/charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// FIX: Force the route to run dynamically and not cache 
export const dynamic = 'force-dynamic'; 

const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        // 1. Read the data from the local cache file (now in /tmp)
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents);

        // 2. Return the cached data
        return NextResponse.json(cachedData);

    } catch (error) {
        console.error("Error reading charts cache:", error);

        // Safely check for the error message
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        
        // Return a 500 status with an empty/default data structure to prevent page crash
        return NextResponse.json(
            [ 
                { source: "No Data Yet", song: "Please refresh /api/cron/fetch-jennie-charts", count: "N/A" }
            ], 
            { status: 200 } // Return 200 so the page doesn't crash, but return a placeholder
        );
    }
}