// app/api/charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// FIX: Change cache path to Vercel's only writable directory: /tmp
const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        // 1. Read the data from the local cache file (now in /tmp)
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents);

        // 2. Return the cached data instantly
        return NextResponse.json(cachedData);
    } catch (error) {
        // Log the error for Vercel console
        console.error("Error reading charts cache:", error);
        
        // Handle the error gracefully
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";

        // FIX: Return placeholder data if file is missing (First load)
        const initialData = [
            { source: "No Data Yet", rank: 0, song: "Please run cron job", streams: "0" }
        ];

        // Return a temporary response until the cache is written
        return NextResponse.json(initialData, { status: 200 });
    }
}