// ... inside lib/scraper.ts ...

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

    // THIS IS THE CORRECT SPOTIFY TOKEN ENDPOINT
    const tokenUrl = 'https://accounts.spotify.com/api/token'; 
    
    // FIX: Use .trim() (already added, keeping it here for safety)
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
        console.error("Error fetching Spotify access token (Code 404? Check URL):", (error as any).response?.data || (error as any).message);
        throw new Error("Failed to authenticate with Spotify API.");
    }
}

// ----------------------------------------------------
// Step 2: Main data fetching function
// ----------------------------------------------------
export async function scrapeData(): Promise<ScrapedData> {
    let lastUpdatedDate = new Date().toLocaleString();
    
    // ... (fallbackData definition remains the same) ...

    try {
        const accessToken = await getAccessToken();
        
        // Spotify Artist ID for JENNIE (from BLACKPINK)
        const artistId = '250b0WlC5VkOCoUsaCY84M'; 
        
        // THIS IS THE CORRECT SPOTIFY API ENDPOINT for Top Tracks
        const topTracksUrl = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;
        
        // Fetch Top 10 Tracks for the artist
        const { data: topTracksResponse } = await axios.get(topTracksUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            }
        });

        // ... (remaining mapping code remains the same) ...
        
        return {
            spotify: spotifyData,
            youtube: youtubeData
        };

    } catch (error) {
        console.error("Error in scrapeData (Spotify API):", (error as any).message);
        return fallbackData;
    }
}