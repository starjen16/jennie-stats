import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

// Avoid duplicate connection in Vercel serverless
if (!redis.isOpen) {
  redis.connect();
}

type TrackRow = {
  position: number;
  track: string;
  artist: string;
  streams: number;
  url?: string;
};

// ------------------------------
// Parse Spotify CSV file
// ------------------------------
async function fetchCSV(url: string): Promise<TrackRow[]> {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split("\n");

  const rows: TrackRow[] = [];

  // Skip header — start at index 1
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i]
      // Handle quoted CSV rows correctly
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map((x) => x.replace(/^"|"$/g, ""));

    if (parts.length < 4) continue;

    rows.push({
      position: Number(parts[0]),
      track: parts[1],
      artist: parts[2],
      streams: Number(parts[3].replace(/,/g, "")),
      url: parts[4],
    });
  }

  return rows;
}

export async function GET() {
  try {
    // -------------------------------------------------------
    // 1) Spotify "latest" = YESTERDAY'S chart, not today!
    // -------------------------------------------------------
    const chartDate = new Date();
    chartDate.setDate(chartDate.getDate() - 1);

    const chartKey = chartDate.toISOString().slice(0, 10); // YYYY-MM-DD

    const todayCsv = `https://spotifycharts.com/regional/global/daily/${chartKey}/download`;

    // Fetch current chart data
    const todayRows = await fetchCSV(todayCsv);

    // -------------------------------------------------------
    // 2) Fetch PREVIOUS day for movement comparison
    // -------------------------------------------------------
    const prevDateObj = new Date(chartDate);
    prevDateObj.setDate(prevDateObj.getDate() - 1);
    const prevDate = prevDateObj.toISOString().slice(0, 10);

    let prevRows: TrackRow[] = [];
    try {
      prevRows = await fetchCSV(
        `https://spotifycharts.com/regional/global/daily/${prevDate}/download`
      );
    } catch {
      prevRows = [];
    }

    const prevMap = new Map<string, TrackRow>();
    prevRows.forEach((r) => {
      prevMap.set(`${r.track}-${r.artist}`, r);
    });

    // -------------------------------------------------------
    // 3) Correct Jennie detection
    // -------------------------------------------------------
    const jennieTracks = todayRows
      .filter((t) => {
        const artist = t.artist.toLowerCase();
        const track = t.track.toLowerCase();

        // Jennie solo OR featured
        const isJennieArtist = artist.includes("jennie");
        const isJennieTrack = track.includes("jennie");

        return isJennieArtist || isJennieTrack;
      })
      .map((t) => {
        const key = `${t.track}-${t.artist}`;
        const prev = prevMap.get(key);

        return {
          position: t.position,
          track: t.track,
          artist: t.artist,
          streams: t.streams,
          url: t.url,

          // Movement: previous position - today's position
          movement: prev ? prev.position - t.position : null,

          // Stream change
          streamsChange: prev ? t.streams - prev.streams : null,
        };
      });

    // -------------------------------------------------------
    // 4) Save chart under correct Spotify date
    // -------------------------------------------------------
    await redis.set(
      `jennie_global_${chartKey}`,
      JSON.stringify({
        date: chartKey,
        tracks: jennieTracks,
      })
    );

    return NextResponse.json({
      success: true,
      saved: `jennie_global_${chartKey}`,
      count: jennieTracks.length,
      chart_date: chartKey,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
