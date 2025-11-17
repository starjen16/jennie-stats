import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

// fetch Spotify public JSON
async function fetchSpotifyChart(date: string) {
  const url = `https://charts-spotify-com-service.spotify.com/charts/v2/regions/global/daily/${date}?limit=200&offset=0`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
      "Origin": "https://charts.spotify.com",
      "Referer": "https://charts.spotify.com/",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  if (!res.ok) {
    throw new Error(`Spotify API error ${res.status}`);
  }

  return res.json();
}

export async function GET() {
  try {
    // Spotify charts always reflect yesterday
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const date = d.toISOString().slice(0, 10);

    const data = await fetchSpotifyChart(date);

    const entries = data?.entries ?? [];

    // Filter Jennie tracks
    const jennie = entries.filter((e: any) => {
      const nameMatch = /jennie/i.test(e.track?.name);
      const artistMatch = e.track?.artists?.some((a: any) =>
        /jennie/i.test(a.name)
      );
      return nameMatch || artistMatch;
    });

    await redis.set(
      `jennie_global_${date}`,
      JSON.stringify({ date, tracks: jennie })
    );

    return NextResponse.json({
      success: true,
      date,
      saved: `jennie_global_${date}`,
      count: jennie.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
