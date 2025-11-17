import { NextResponse } from "next/server";

export async function GET() {
  try {
    const API_URL =
      "https://charts-spotify-com-service.spotify.com/auth/v0/charts/regional-global-daily/latest?limit=200&offset=0";

    const res = await fetch(API_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        "Accept": "application/json"
      }
    });

    if (!res.ok) throw new Error("Spotify Charts API failed");

    const data = await res.json();

    const chart = data.entries.map((item: any) => ({
      rank: item.rank,
      track: item.trackMetadata.trackName,
      artists: item.trackMetadata.artists.map((a: any) => a.name),
      streams: item.streams,
      movement: item.previousRank
        ? item.previousRank - item.rank
        : 0,
    }));

    // Filter JENNIE songs
    const jennie = chart.filter(
      (t: any) =>
        /jennie/i.test(t.track) ||
        t.artists.some((a: string) => /jennie/i.test(a))
    );

    const today = new Date();
    today.setDate(today.getDate() - 1);
    const date = today.toISOString().split("T")[0];

    return NextResponse.json({
      date,
      count: jennie.length,
      tracks: jennie
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
