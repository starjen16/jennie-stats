import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

// GET Spotify Charts API JSON
async function getSpotifyCharts(date: string) {
  const url =
    `https://charts-spotify-com-service.spotify.com/auth/v0/charts?` +
    `type=regional&country=global&date=${date}&limit=200`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Spotify API error");

  return res.json();
}

export async function GET() {
  try {
    // Spotify charts = yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const date = d.toISOString().slice(0, 10);

    // Fetch global chart
    const data = await getSpotifyCharts(date);
    const entries = data.entries || [];

    // Filter Jennie tracks
    const jennie = entries.filter((e: any) =>
      /jennie/i.test(e.track_name) ||
      e.artist_names.some((a: string) => /jennie/i.test(a))
    );

    // Save in Redis
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
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
