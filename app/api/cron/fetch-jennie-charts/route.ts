import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

// Avoid duplicate connection in Vercel runtime
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

// Download + parse CSV (Spotify format)
async function fetchCSV(url: string): Promise<TrackRow[]> {
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.trim().split("\n");

  const rows: TrackRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i]
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
    // --- Fetch TODAY ---
    const todayCsv =
      "https://spotifycharts.com/regional/global/daily/latest/download";
    const todayRows = await fetchCSV(todayCsv);

    // --- Fetch YESTERDAY for movement comparison ---
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const prevDate = yesterday.toISOString().slice(0, 10);

    let prevRows: TrackRow[] = [];
    try {
      prevRows = await fetchCSV(
        `https://spotifycharts.com/regional/global/daily/${prevDate}/download`
      );
    } catch {}

    const prevMap = new Map<string, TrackRow>();
    prevRows.forEach((r) => {
      prevMap.set(`${r.track}-${r.artist}`, r);
    });

    // --- Jennie Filter ---
    // Matches:
    // ✔ Artist contains "Jennie" (solo or featured)
    // ✔ Track contains "Jennie" (LIKE JENNIE)
    const jennieTracks = todayRows
      .filter((t) => {
        const artist = t.artist.toLowerCase();
        const track = t.track.toLowerCase();

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

          movement: prev ? prev.position - t.position : null,

          streamsChange: prev ? t.streams - prev.streams : null,
        };
      });

    const today = new Date().toISOString().slice(0, 10);

    // Save to Redis
    await redis.set(
      `jennie_global_${today}`,
      JSON.stringify({
        date: today,
        tracks: jennieTracks,
      })
    );

    return NextResponse.json({
      success: true,
      saved: `jennie_global_${today}`,
      count: jennieTracks.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
