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


// RENAME: Renamed from scrapeKWORBStats to scrapeData, and returns ScrapedData
export async function scrapeData(): Promise<ScrapedData> {
    const kworbUrl = "https://kworb.net/spotify/artist/250b0WlC5VkOCoUsaCY84M_songs.html";
    const spotifyData: SpotifyChartEntry[] = [];
    let lastUpdatedDate = new Date().toLocaleString();

    try {
        // 1. Fetch the HTML content
        const { data } = await axios.get(kworbUrl);
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

        // 3. Select the main table rows (typically class 'sortable' or 'table-striped')
        // We look for the main table body containing the songs
        const $rows = $('table.sortable tbody tr');

        $rows.each((i, el) => {
            const $tds = $(el).find('td');

            // Kworb table structure for this page is typically:
            // TD[0]: Song Title (includes rank number)
            // TD[1]: Total Streams
            // TD[2]: As Lead Streams
            // TD[3]: Solo Streams
            // TD[4]: Daily Streams (This is the value we want for the streams column)
            
            // Check if we have enough columns (5 for daily streams)
            if ($tds.length >= 5) {
                const rawTitle = $tds.eq(0).text().trim();
                const dailyStreams = $tds.eq(4).text().trim();

                // Clean the title: Remove the rank number and potential special characters (*, #)
                const titleMatch = rawTitle.match(/^[0-9\*#]+\s*(.*)$/);
                const title = titleMatch ? titleMatch[1].trim() : rawTitle;
                
                // Add entry to our array
                spotifyData.push({
                    rank: i + 1, // Use the iteration index for rank
                    title: title,
                    artist: 'Jennie', // Hardcoded as this is her artist page
                    streams: dailyStreams,
                    date: lastUpdatedDate,
                });
            }
        });

    } catch (error) {
        console.error("Error scraping Kworb data:", error);
        // Fallback to empty data structure on error
        lastUpdatedDate = new Date().toLocaleString();
        return {
            spotify: [],
            youtube: {
                views: 0,
                title: 'Scraping Failed',
                date: lastUpdatedDate
            }
        };
    } // <--- The catch block ends here

    // --- YouTube Placeholder Data ---
    // The Kworb page shown doesn't contain YouTube data, so we'll return a static placeholder
    // If you plan to scrape YouTube later, you'll replace this block.
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
} // <--- THIS is the final missing brace for the async function scrapeData()