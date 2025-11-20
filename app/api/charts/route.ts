// app/api/charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// FIX: Define the directory name as the root directory of the current file's module.
// In Vercel, this is safer than using process.cwd() for file paths.
const dataDir = path.join(process.cwd(), 'data'); 
const dataFilePath = path.join(dataDir, 'jennie_charts_cache.json');

export async function GET() {
    try {
        // 1. Read the data from the local cache file
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents);

        // 2. Return the cached data instantly
        return NextResponse.json(cachedData);
    } catch (error) {
        console.error("Error reading charts cache:", error);
        
        // Return a clear error message in the response for debugging (status 500)
        return NextResponse.json(
            { 
                error: "Failed to read data cache. Is the file missing or path incorrect?", 
                details: error.message
            }, 
            { status: 500 }
        );
    }
}