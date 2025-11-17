import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.connect();

async function fetchSpotify(date: string) {
  const url =
    `https://charts-spotify-com-service.spotify.com/auth/v0/charts?` +
    `type=regional&country=global&date=${date}&limit=200`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "Origin": "https://charts.spotify.com",
      "Referer": "https://charts.spotify.com/",
      "X-Client-Id": "",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("FAILED:", res.status, await res.text());
    throw new Error("Spotify API error");
  }

  return res.json();
}

export async function GET() {
  try {
    // Spotify always updates charts for YESTERDAY
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const date = d.toISOString().slice(0, 10);

    // Fetch full global chart
    const data = await fetchSpotify(date);
    const entries = data?.entries || [];

    // Filter JENNIE tracks
    const jennieTracks = entries.filter((e: any) => {
      const track = e.track_name || "";
      const artists = e.artist_names || [];
      return (
        /jennie/i.test(track) ||
        artists.some((a: string) => /jennie/i.test(a))
      );
    });

    // Save in Redis
    await redis.set(
      `jennie_global_${date}`,
      JSON.stringify({
        date,
        tracks: jennieTracks,
      })
    );

    return NextResponse.json({
      success: true,
      date,
      count: jennieTracks.length,
      saved: `jennie_global_${date}`,
    });

  } catch (err: any) {
    console.error("ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
