import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL
});

redis.connect();

type TrackRow = {
  position: number;
  track: string;
  artist: string;
  streams: number;
  url?: string;
};

// Download & parse CSV
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
    const todayCsv = "https://spotifycharts.com/regional/global/daily/latest/download";
    const todayRows = await fetchCSV(todayCsv);

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

    const jennieTracks = todayRows
      .filter((t) => /jennie/i.test(t.track) || /jennie/i.test(t.artist))
      .map((t) => {
        const prev = prevMap.get(`${t.track}-${t.artist}`);

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

    await redis.set(`jennie_global_${today}`, JSON.stringify({
      date: today,
      tracks: jennieTracks
    }));

    return NextResponse.json({
      success: true,
      saved: `jennie_global_${today}`,
      count: jennieTracks.length,
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
