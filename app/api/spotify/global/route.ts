import Papa from "papaparse";
import { NextResponse } from "next/server";

const CHART_URL =
  "https://spotifycharts.com/regional/global/daily/latest/download";

export async function GET() {
  try {
    const csv = await fetch(CHART_URL).then(res => res.text());

    const parsed = Papa.parse(csv, { header: true }).data;

    // Filter only JENNIE songs
    const jennieSongs = parsed.filter((item: any) =>
      item["Track"]?.toLowerCase().includes("jennie")
    );

    return NextResponse.json({
      date: parsed[0]?.Date,
      songs: jennieSongs
    });

  } catch (e) {
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
