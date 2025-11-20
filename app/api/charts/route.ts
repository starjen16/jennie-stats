// app/api/charts/route.ts

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Define the directory name safely for Vercel
const dataDir = path.join(process.cwd(), 'data'); 
const dataFilePath = path.join(dataDir, 'jennie_charts_cache.json');

export async function GET() {
    try {
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents);

        return NextResponse.json(cachedData);
    } catch (error) {
        console.error("Error reading charts cache:", error);

        // 👇👇👇 FIX START: Type check the error object 👇👇👇
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        
        return NextResponse.json(
            { 
                error: "Failed to read data cache. Is the file missing or path incorrect?", 
                details: errorMessage // Use the safely checked variable
            }, 
            { status: 500 }
        );
        // 👆👆👆 FIX END 👆👆👆
    }
}