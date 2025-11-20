import { NextResponse } from "next/server";
import { createClient } from "redis";
import * as cheerio from "cheerio";

const redis = createClient({
  url: process.env.REDIS_URL!,
});
redis.connect();

function cleanNumber(str: string) {
  return Number(str.replace(/[^0-9]/g, ""));
}

export async function GET(req: Request) {
  try {
    // 1. Fetch KWORB HTML
    const url =
      "https://kworb.net/spotify/artist/250b0Wlc5Vk0CoUsaCY84M_songs.html";

    const res = await fetch(url);
    const html = await res.text();
    const $ = cheerio.load(html);

    let tracks: any[] = [];
    let totalStreams = 0;
    let totalDaily = 0;

    // 2. Parse table rows
    $("table tr").each((i, row) => {
      const cols = $(row).find("td");
      if (cols.length < 3) return;

      const title = $(cols[0]).text().trim();
      const streams = cleanNumber($(cols[1]).text());
      const daily = cleanNumber($(cols[2]).text());

      if (!title || !streams) return;

      totalStreams += streams;
      totalDaily += daily;

      tracks.push({
        title,
        streams,
        daily,
      });
    });

    const today = new Date().toISOString().slice(0, 10);

    // 3. Save to Redis
    await redis.set("jennie:spotify:tracks", JSON.stringify(tracks));
    await redis.set("jennie:spotify:date", today);
    await redis.set("jennie:spotify:total_streams", String(totalStreams));
    await redis.set("jennie:spotify:daily_total", String(totalDaily));

    return NextResponse.json({
      status: "SUCCESS",
      date: today,
      trackCount: tracks.length,
      totalStreams,
      totalDaily,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
