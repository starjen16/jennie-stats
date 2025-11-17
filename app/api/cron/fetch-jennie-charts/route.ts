import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

function getSpotifyDate() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function fetchSpotifyAPI(date: string) {
  const apiUrl = `https://charts.spotify.com/api/charts/v2/sections/region:global/daily/${date}?limit=200&offset=0`;

  const res = await fetch(apiUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      Accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Spotify API error");
  return await res.json();
}

export async function GET() {
  try {
    const date = getSpotifyDate();

    const json = await fetchSpotifyAPI(date);

    const entries = json?.entries ?? [];

    const jennie = entries.filter(
      (e: any) =>
        /jennie/i.test(e.trackName) ||
        e.artistNames.some((a: string) => /jennie/i.test(a))
    );

    await redis.set(
      `jennie_global_${date}`,
      JSON.stringify({ date, songs: jennie })
    );

    return NextResponse.json({
      date,
      count: jennie.length,
      songs: jennie,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
