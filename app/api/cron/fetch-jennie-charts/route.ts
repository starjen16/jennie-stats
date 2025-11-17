import { NextResponse } from "next/server";
import { createClient } from "redis";

// Connect Redis
const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

// Scrape HTML from Spotify Charts
async function scrapeSpotifyDaily() {
  const url = "https://charts.spotify.com/charts/view/regional-global-daily/latest";

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
      "Accept": "text/html",
    },
  });

  if (!res.ok) throw new Error("Failed to scrape Spotify Charts");

  return await res.text();
}

// Extract chart rows from HTML
function parseChart(html: string) {
  const rows: any[] = [];

  // FIX: remove ES2018 "s" flag → use [\s\S] (matches any char)
  const rowRegex = /"chart-row[\s\S]*?<\/a>/g;

  const matches = html.match(rowRegex);
  if (!matches) return rows;

  for (const block of matches) {
    // Rank
    const rank = block.match(/"rank">(\d+)</)?.[1];

    // Track title
    const track = block.match(/"track-name">([^<]+)</)?.[1];

    // Artists
    const artistMatches = [...block.matchAll(/"artist-name">([^<]+)</g)];
    const artists = artistMatches.map((m) => m[1]);

    // Streams
    const streams = block.match(/"chart-stat-value">([^<]+)</)?.[1];

    if (!rank || !track) continue;

    rows.push({
      rank: Number(rank),
      track,
      artists,
      streams: streams ? Number(streams.replace(/,/g, "")) : 0,
    });
  }

  return rows;
}

export async function GET() {
  try {
    // Step 1: Scrape HTML
    const html = await scrapeSpotifyDaily();

    // Step 2: Parse chart rows
    const chart = parseChart(html);

    // Step 3: Filter for Jennie
    const jennie = chart.filter(
      (t) =>
        /jennie/i.test(t.track) ||
        t.artists.some((a: string) => /jennie/i.test(a))
    );

    // Spotify always reports yesterday's chart
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const date = d.toISOString().slice(0, 10);

    // Step 5: Save to Redis
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
      tracks: jennie,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
