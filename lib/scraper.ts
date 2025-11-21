import * as cheerio from 'cheerio';
import axios from 'axios';

// Interfaces for the raw scraped data (keeping for reference, but not strictly used in final structure)
type JennieStat = {
    source: string;
    rank?: number;
    song: string;
    streams?: string; // Daily or total streams, use string for scraped value
    views?: string; // YouTube views, use string for scraped value
    count?: string; // A placeholder for other metrics
}

// Interfaces for the final structured data expected by page.tsx
interface SpotifyChartEntry {
    rank: number;
    title: string;
    artist: string;
    streams: string;
    date: string;
}

interface ScrapedData {
    spotify: SpotifyChartEntry[];
    youtube: {
        views: number;
        title: string;
        date: string;
    };
}


// This function fetches data from Kworb and is called directly by the Next.js Server Component.
export async function scrapeData(): Promise<ScrapedData> {
    const kworbUrl = "https://kworb.net/spotify/artist/250b0WlC5VkOCoUsaCY84M_songs.html";
    const spotifyData: SpotifyChartEntry[] = [];
    let lastUpdatedDate = new Date().toLocaleString();

    try {
        // 1. Fetch the HTML content with a User-Agent header to bypass potential anti-scraping measures
        const { data } = await axios.get(kworbUrl, {
            headers: {
                // Common desktop browser User-Agent string
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            // Set a timeout for the request (e.g., 10 seconds)
            timeout: 10000 
        });
        const $ = cheerio.load(data);

        // 2. Extract the last updated date
        const dateElement = $('h2').filter(function() {
            return $(this).text().includes('Top Songs | Current charts');
        }).next('p').text();
        
        // Kworb date format is like: "Last updated: 2025/11/19"
        const match = dateElement.match(/Last updated: (.*)/);
        if (match && match[1]) {
            lastUpdatedDate = new Date(match[1]).toLocaleString();
        }

        // 3. Select the main table rows
        // Using ':first' for the most robust selection of the main song list table
        const $rows = $('table.sortable:first tbody tr');

        $rows.each((i, el) => {
            const $tds = $(el).find('td');
            
            // Kworb table structure for this page has Daily Streams at index 4 (5th column)
            if ($tds.length >= 5) {
                const rawTitle = $tds.eq(0).text().trim();
                const dailyStreams = $tds.eq(4).text().trim();

                // Clean the title: Remove the rank number and potential special characters
                const titleMatch = rawTitle.match(/^[0-9\*#]+\s*(.*)$/);
                const title = titleMatch ? titleMatch[1].trim() : rawTitle;
                
                // Add entry to our array
                spotifyData.push({
                    rank: i + 1,
                    title: title,
                    artist: 'Jennie', 
                    streams: dailyStreams,
                    date: lastUpdatedDate,
                });
            }
        });

    } catch (error) {
        // If scraping fails (network or selector error), log it and return empty data
        console.error("Error scraping Kworb data:", error);
        lastUpdatedDate = new Date().toLocaleString();
        return {
            spotify: [],
            youtube: {
                views: 0,
                title: 'Scraping Failed',
                date: lastUpdatedDate
            }
        };
    }

    // --- YouTube Placeholder Data ---
    // Keeping static placeholder for YouTube data since Kworb doesn't provide it
    const youtubeData = {
        views: 950000000,
        title: 'SOLO Official MV',
        date: lastUpdatedDate
    };
    
    // 4. Return the final structured data
    return {
        spotify: spotifyData,
        youtube: youtubeData
    };
}