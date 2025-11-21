// app/api/cron/route.ts
import { NextResponse } from "next/server";
import { scrapeData } from "@/lib/scraper"; // Import your function

export async function GET() {
    try {
        // Your logic: 1. Fetch data, 2. Save to database/cache
        const chartData = await scrapeData();
        console.log("CRON JOB: Charts successfully updated!");

        // You should save this data to a database (e.g., Vercel Postgres, Redis) 
        // so your main pages can read it.

        return NextResponse.json({ success: true, timestamp: new Date() });
    } catch (error) {
        console.error("CRON JOB FAILED:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}