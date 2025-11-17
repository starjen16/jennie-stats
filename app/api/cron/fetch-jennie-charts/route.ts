import { NextResponse } from "next/server";
import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});

if (!redis.isOpen) redis.connect();

type TrackRow = {
  position: number;
  track: string;
  artist: string;
  streams: number;
  url?: string;
};

// -------- Parse CSV (Spotify style) --------
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

// ------- CLEAN JENNIE MATCH FUNCTION --------
function isJennieTrack(track: string, artist: string): boolean {
  const t = track.toLowerCase();
  const a = artist.toLowerCase();

  return (
    t.includes("jennie") ||
    a.includes("jennie") ||
    t.includes("(with jennie") ||
    a.includes("the weeknd") && t.includes("girls") && t.includes("jennie")
  );
}

export async function GET() {
  try {
    // Spotify publishes *yesterday’s chart*
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const chartDate = now.toISOString().slice(0, 10);

    const csvTodayUrl = `https://spotifycharts.com/regional/global/daily/${chartDate}/download`;
    const todayRows = await fetchCSV(csvTodayUrl);

    // ------- Load Previous Day -------
    const prev = new Date(now);
    prev.setDate(prev.getDate() - 1);
    const prevDate = prev.toISOString().slice(0, 10);

    let prevRows: TrackRow[] = [];
    try {
      prevRows = await fetchCSV(
        `https://spotifycharts.com/regional/global/daily/${prevDate}/download`
      );
    } catch {}

    const prevMap = new Map<string, TrackRow>();
    prevRows.forEach((r) =>
      prevMap.set(`${r.track.toLowerCase()}_${r.artist.toLowerCase()}`, r)
    );

    // -------- Filter Jennie songs --------
    const jennieTracks = todayRows
      .filter((r) => isJennieTrack(r.track, r.artist))
      .map((t) => {
        const key = `${t.track.toLowerCase()}_${t.artist.toLowerCase()}`;
        const prev = prevMap.get(key);

        return {
          ...t,
          movement: prev ? prev.position - t.position : null,
          streamsChange: prev ? t.streams - prev.streams : null,
        };
      });

    // ---------- SAVE TO REDIS ----------
    const redisKey = `jennie_global_${chartDate}`;

    await redis.set(
      redisKey,
      JSON.stringify({
        date: chartDate,
        tracks: jennieTracks,
      })
    );

    return NextResponse.json({
      success: true,
      saved: redisKey,
      chart_date: chartDate,
      count: jennieTracks.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
