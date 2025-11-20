// app/api/cron/fetch-jennie-charts/route.ts

import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as cheerio from 'cheerio'; // Import Cheerio

// Define the expected structure for our scraped data
type JennieStat = {
    source: string;
    rank?: number;
    song?: string;
    streams?: string;
    views?: string;
    count?: string;
};

// The main scraping function
async function getChartData(): Promise<JennieStat[]> {
    const URL = 'https://kworb.net/spotify/artist/250b0WIc5Vrk0CoUsaCY84M_songs.html';
    
    try {
        const response = await fetch(URL, { cache: 'no-store' });
        const html = await response.text();
        const $ = cheerio.load(html);

        const stats: JennieStat[] = [];
        
        // --- 1. Scrape Overall Total Streams (From the summary table) ---
        // We target the main data rows in the first table (the summary box)
        const totalStreamsRow = $('table.sortable > tbody > tr').eq(0);
        const totalStreamsValue = totalStreamsRow.find('td').eq(1).text();
        
        stats.push({
            source: "Spotify - Total Streams",
            count: totalStreamsValue.trim()
        });

        // --- 2. Scrape Top Songs (From the main song list table) ---
        // We target the second table on the page (the top songs list)
        $('table.sortable').eq(1).find('tbody > tr').each((index, element) => {
            const columns = $(element).find('td');
            
            // Skip the first row if it's a header or irrelevant
            if (columns.length < 3) return; 

            const songTitle = columns.eq(0).text().trim();
            const streams = columns.eq(1).text().trim();

            stats.push({
                source: "Spotify - Top Track",
                // KWORB uses a zero-based index for the rows, so rank is index + 1
                rank: index + 1, 
                song: songTitle,
                streams: streams
            });
        });

        // Return the first 10 tracks plus the total streams entry
        // This ensures the response isn't massive, as there are many songs.
        return stats.slice(0, 11);

    } catch (error) {
        console.error("Scraping failed:", error);
        
        // Return fallback data in case of scraping failure
        return [{ 
            source: "Scraper Error", 
            song: "Failed to fetch or parse Spotify data.", 
            count: "N/A" 
        }];
    }
}

const CACHE_FILE_NAME = 'jennie_charts_cache.json';
const dataFilePath = path.join('/tmp', CACHE_FILE_NAME);

export async function GET() {
    try {
        const scrapedStats = await getChartData(); 
        
        // Construct the data object with timestamp and scraped stats
        const cacheData = {
            timestamp: new Date().toISOString(),
            stats: scrapedStats 
        };
        
        // Write the JSON object to the local cache file
        await fs.writeFile(dataFilePath, JSON.stringify(cacheData));

        return NextResponse.json({ success: true, message: "Charts cache updated successfully." });
    } 
    catch (error) { 
        console.error("Error updating charts cache:", error);
        return NextResponse.json({ success: false, message: "Failed to update charts cache." }, { status: 500 });
    }
}