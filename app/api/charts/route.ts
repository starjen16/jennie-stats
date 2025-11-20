// app/api/charts/route.ts
// This route serves the cached data quickly to the Chart page component.
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Path to the cache file
const dataFilePath = path.join(process.cwd(), 'data/jennie_charts_cache.json');

export async function GET() {
    try {
        // 1. Read the data from the local cache file
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents);

        // 2. Return the cached data instantly
        return NextResponse.json(cachedData);
    } catch (error) {
        console.error("Error reading charts cache:", error);
        // If the cache file is missing or corrupted, return a fallback.
        return NextResponse.json(
            { 
                timestamp: "N/A", 
                stats: [] 
            }, 
            { status: 200 } // Still a success, but with no data
        );
    }
}