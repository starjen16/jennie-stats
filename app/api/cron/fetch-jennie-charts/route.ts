import { NextResponse } from "next/server";
import { createClient } from "redis";

// -----------------------------
// Connect Redis
// -----------------------------
const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

// -----------------------------
// Utility: Spotify uses yesterday's date
// -----------------------------
function getSpotifyDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// -----------------------------
// Fetch Spotify API Data
// -----------------------------
async function fetchSpotifyAPI(date: string) {
  const apiUrl = `https://charts.spotify.com/api/charts/v2/sections/region:global/daily/${date}?limit=200&offset=0`;

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Spotify API error");

  return await res.json();
}

// -----------------------------
// CRON SECURE ENDPOINT
// -----------------------------
export async function GET(req: Request) {
  try {
    // -------------------------------------
    // 1. Validate Cron Secret
    // -------------------------------------
    const auth = req.headers.get("Authorization");
    const expected = `Bearer ${process.env.CRON_SECRET}`;

    if (auth !== expected) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid CRON_SECRET" },
        { status: 401 }
      );
    }

    // -------------------------------------
    // 2. Get correct Spotify date (yesterday)
    // -------------------------------------
    const date = getSpotifyDate();

    // -------------------------------------
    // 3. Fetch daily Spotify global chart
    // -------------------------------------
    const json = await fetchSpotifyAPI(date);
    const entries = json?.entries ?? [];

    // -------------------------------------
    // 4. Filter Jennie tracks
    // -------------------------------------
    const jennie = entries.filter(
      (e: any) =>
        /jennie/i.test(e.trackName) ||
        e.artistNames?.some((a: string) => /jennie/i.test(a))
    );

    // -------------------------------------
    // 5. Save to Redis
    // -------------------------------------
    await redis.set(
      `jennie_global_${date}`,
      JSON.stringify({
        date,
        count: jennie.length,
        songs: jennie,
      })
    );

    // -------------------------------------
    // 6. Return success response
    // -------------------------------------
    return NextResponse.json({
      ok: true,
      savedKey: `jennie_global_${date}`,
      date,
      count: jennie.length,
      songs: jennie,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
