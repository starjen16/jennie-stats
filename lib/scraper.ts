import * as cheerio from 'cheerio';
import axios from 'axios';

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


// This function returns reliable mock data because external scraping is blocked by the target site.
export async function scrapeData(): Promise<ScrapedData> {
    const lastUpdatedDate = new Date().toLocaleString();

    const spotifyData: SpotifyChartEntry[] = [
        {
            rank: 1,
            title: 'SOLO',
            artist: 'Jennie',
            streams: '1,234,567', // Daily Streams Mock
            date: lastUpdatedDate,
        },
        {
            rank: 2,
            title: 'You & Me',
            artist: 'Jennie',
            streams: '987,654', // Daily Streams Mock
            date: lastUpdatedDate,
        },
        {
            rank: 3,
            title: 'One Of The Girls',
            artist: 'The Weeknd, JENNIE, Lily-Rose Depp',
            streams: '852,110', // Daily Streams Mock
            date: lastUpdatedDate,
        },
    ];

    const youtubeData = {
        views: 950000000,
        title: 'SOLO Official MV',
        date: lastUpdatedDate
    };
    
    // Return the mock structured data
    return {
        spotify: spotifyData,
        youtube: youtubeData
    };
}