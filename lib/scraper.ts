// lib/scraper.ts

import axios from 'axios'; 
import { Buffer } from 'buffer'; 

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

// Base URLs
const SPOTIFY_ACCOUNT_URL = 'https://accounts.spotify.com/api/token'; // For Token Request
const SPOTIFY_API_URL = 'https://api.spotify.com';    // For Data Request

// ----------------------------------------------------
// Step 1: Get Access Token (Client Credentials Flow)
// ----------------------------------------------------
async function getAccessToken(): Promise<string> {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Spotify Client ID or Secret is missing. Check .env.local and Vercel settings.");
        throw new Error("Missing Spotify credentials.");
    }

    // CRITICAL FIX: Use the correct Token URL constant
    const tokenUrl = SPOTIFY_ACCOUNT_URL; 
    
    // FIX: Use .trim() to remove any hidden spaces causing 400 Bad Request
    const credentials = `${clientId.trim()}:${clientSecret.trim()}`;
    const authString = Buffer.from(credentials).toString('base64');
    
    try {
        const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Spotify access token:", (error as any).response?.data || (error as any).message);
        throw new Error("Failed to authenticate with Spotify API.");
    }
}

// ----------------------------------------------------
// Step 2: Main data fetching function
// ----------------------------------------------------
export async function scrapeData(): Promise<ScrapedData> {
    let lastUpdatedDate = new Date().toLocaleString();
    
    // Fallback data for API failure
    const fallbackData: ScrapedData = {
        spotify: [],
        youtube: {
            views: 0,
            title: 'Spotify API Failed (Check credentials/logs)',
            date: lastUpdatedDate
        }
    };

    try {
        const accessToken = await getAccessToken();
        
        // Spotify Artist ID for JENNIE (from BLACKPINK)
        const artistId = '250b0WlC5VkOCoUsaCY84M'; 
        
        // CRITICAL FIX: Use the correct API Base URL and interpolation for artistId
        const topTracksUrl = `${SPOTIFY_API_URL}/artists/${artistId}/top-tracks?market=US`; 
        
        // Fetch Top 10 Tracks for the artist
        const { data: topTracksResponse } = await axios.get(topTracksUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        // Map API response to your expected structure
        const spotifyData: SpotifyChartEntry[] = topTracksResponse.tracks
            .slice(0, 10) // Take only the top 10
            .map((track: any, index: number) => ({
                rank: index + 1,
                title: track.name,
                artist: track.artists.map((a: any) => a.name).join(', '),
                streams: `${track.popularity}`, 
                date: lastUpdatedDate,
            }));

        // --- YouTube Placeholder Data (Static) ---
        const youtubeData = {
            views: 950000000,
            title: 'SOLO Official MV',
            date: lastUpdatedDate
        };
        
        return {
            spotify: spotifyData,
            youtube: youtubeData
        };

    } catch (error) {
        // Now logging a helpful message to see the final error status
        console.error("Error in scrapeData (Spotify API):", (error as any).response?.status, (error as any).message);
        // Return fallback data on failure
        return fallbackData;
    }
}