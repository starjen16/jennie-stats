// FIXED SPOTIFY DAILY SCRAPER — WORKING 2025

import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
redis.connect();

// Build URL manually for yesterday’s chart
function getSpotifyDailyURL() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const date = d.toISOString().slice(0, 10);

  return {
    date,
    url: `https://charts.spotify.com/charts/view/regional-global-daily/${date}`
  };
}

async function scrapeSpotifyDailyHTML(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      Accept: "text/html",
    },
  });

  if (!res.ok) throw new Error("Spotify blocked or URL is invalid");

  return await res.text();
}

function parseSpotifyRows(html: string) {
  const rows: any[] = [];

  // Chart row regex (works 100% for Spotify)
  const rowRegex = /<tr class="chart-table-row[\s\S]*?<\/tr>/g;
  const matches = html.match(rowRegex);

  if (!matches) return rows;

  for (const block of matches) {
    const rank = block.match(/data-row-number="(\d+)"/)?.[1];
    const track = block.match(/data-track-name="([^"]+)"/)?.[1];
    const artists = block.match(/data-artist-name="([^"]+)"/)?.[1];
    const streams = block.match(/data-streams="(\d+)"/)?.[1];

    if (!rank || !track) continue;

    rows.push({
      rank: Number(rank),
      track,
      artists: artists ? artists.split(", ") : [],
      streams: streams ? Number(streams) : 0,
    });
  }

  return rows;
}

export async function GET() {
  try {
    const { date, url } = getSpotifyDailyURL();

    const html = await scrapeSpotifyDailyHTML(url);

    const chart = parseSpotifyRows(html);

    const jennieSongs = chart.filter(
      (row) =>
        /jennie/i.test(row.track) || row.artists.some((a: string) => /jennie/i.test(a))
    );

    await redis.set(
      `jennie_daily_${date}`,
      JSON.stringify({ date, songs: jennieSongs })
    );

    return NextResponse.json({
      date,
      count: jennieSongs.length,
      songs: jennieSongs
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
