import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

// GET Spotify Charts JSON API
async function getSpotifyCharts(date: string) {
  const url =
    `https://charts-spotify-com-service.spotify.com/auth/v0/charts?` +
    `type=regional&country=global&date=${date}&limit=200`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Origin": "https://charts.spotify.com",
      "Referer": "https://charts.spotify.com/",
      "Accept-Language": "en-US,en;q=0.9",
      "X-Client-Id": "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("Spotify API status:", res.status);
    throw new Error("Spotify API error");
  }

  return res.json();
}

export async function GET() {
  try {
    // Spotify updates charts one day late → fetch yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const date = d.toISOString().slice(0, 10);

    // Fetch global charts
    const json = await getSpotifyCharts(date);
    const entries = json.entries || [];

    // Filter all Jennie-related songs
    const jennie = entries.filter((item: any) => {
      const track = item.track_name || "";
      const artists = (item.artist_names || []).join(" ");
      return /jennie/i.test(track) || /jennie/i.test(artists);
    });

    // Save results in Redis
    await redis.set(
      `jennie_global_${date}`,
      JSON.stringify({
        date,
        tracks: jennie,
      })
    );

    return NextResponse.json({
      success: true,
      saved: `jennie_global_${date}`,
      count: jennie.length,
      date,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
