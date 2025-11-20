// app/api/charts/route.ts
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// 👇👇👇 FIX START: Force the route to run dynamically and not cache 👇👇👇
export const dynamic = 'force-dynamic';
// 👆👆👆 FIX END 👆👆👆

// ... rest of the file ...
const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        // 1. Read the data from the local cache file (now in /tmp)
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        // ... rest of the try block ...