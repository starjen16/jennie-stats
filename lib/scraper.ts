import axios from 'axios';
import { Buffer } from 'buffer'; // 👈 FIX: Explicitly import Buffer for Vercel build compatibility

// Interfaces for the final structured data expected by page.tsx
interface SpotifyChartEntry {
    rank: number;
    title: string;
    artist: string;
    // Using Spotify's 'popularity' score (0-100) instead of raw streams
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

// ----------------------------------------------------
// Step 1: Get Access Token (Client Credentials Flow)
// ----------------------------------------------------
async function getAccessToken(): Promise<string> {
    // Get credentials from environment variables (local or Vercel)
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error("Spotify Client ID or Secret is missing. Check .env.local and Vercel settings.");
        throw new Error("Missing Spotify credentials.");
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    // The Authorization header must be a Base64 encoded string of "Client ID:Client Secret"
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    try {
        const response = await axios.post(tokenUrl, 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return response.data.access_token;
    } catch (error) {
        // Log the exact error from Spotify if available
        console.error("Error fetching Spotify access token:", (error as any).response?.data || error);
        throw new Error("Failed to authenticate with Spotify API.");
    }
}

// ----------------------------------------------------
// Step 2: Main data fetching function
// ----------------------------------------------------
export async function scrapeData(): Promise<ScrapedData> {
    let lastUpdatedDate = new Date().toLocaleString();
    
    // Fallback data for API failure (Crucial for a Server Component)
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
        // Endpoint to get the artist's 10 most popular tracks
        const topTracksUrl = `https://api.spotify.com/v1/artists/$${artistId}/top-tracks?country=US`; 
        
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
                rank: index + 1, // Rank is based on the order Spotify returns them (most popular first)
                title: track.name,
                // Handle multiple featured artists
                artist: track.artists.map((a: any) => a.name).join(', '),
                // Display the popularity score (0-100) as the 'streams' value
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
        console.error("Error in scrapeData (Spotify API):", (error as any).message);
        // Return fallback data on failure
        return fallbackData;
    }
}