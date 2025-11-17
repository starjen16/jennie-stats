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
};

function clean(value: string) {
  return value.replace(/^"|"$/g, "");
}

async function fetchCSV(url: string): Promise<TrackRow[]> {
  const res = await fetch(url);
  const text = await res.text();

  const lines = text.trim().split("\n");
  const rows: TrackRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]
      .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)
      .map(clean);

    if (cols.length < 4) continue;

    rows.push({
      position: Number(cols[0]),
      track: cols[1],
      artist: cols[2],
      streams: Number(cols[3].replace(/,/g, "")),
    });
  }

  return rows;
}

export async function GET() {
  try {
    // TODAY = actually shows yesterday's chart
    const todayCsv =
      "https://spotifycharts.com/top-songs/global/daily/latest/download";

    const todayRows = await fetchCSV(todayCsv);

    // build YYYY-MM-DD for key name (yesterday)
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const chartDate = d.toISOString().slice(0, 10);

    // FILTER ONLY JENNIE SONGS
    const jennie = todayRows.filter(
      (t) =>
        /jennie/i.test(t.track) ||
        /jennie/i.test(t.artist)
    );

    // SAVE to Redis
    await redis.set(
      `jennie_global_${chartDate}`,
      JSON.stringify({
        date: chartDate,
        tracks: jennie,
      })
    );

    return NextResponse.json({
      success: true,
      saved: `jennie_global_${chartDate}`,
      count: jennie.length,
      chart_date: chartDate,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
