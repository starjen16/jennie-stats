"use client";
import { useEffect, useState } from "react";

export default function SpotifyChartsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/cron/fetch-jennie-charts", {
          cache: "no-store",
        });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <p>Loading Jennie’s chart…</p>;
  if (!data || !data.tracks || data.tracks.length === 0)
    return <p>No Jennie songs found on today’s global chart.</p>;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold text-red-500">
        Jennie — Global Daily Chart
      </h1>

      <p className="opacity-60">Updated: {data.date}</p>

      <div className="mt-6 space-y-4">
        {data.tracks.map((t: any, i: number) => (
          <div
            key={i}
            className="border border-red-800 p-4 rounded-lg bg-black/30"
          >
            <p className="text-xl font-semibold">
              #{t.rank} — {t.track}
            </p>
            <p className="opacity-70">Artists: {t.artists.join(", ")}</p>
            <p className="opacity-70">
              Streams: {t.streams.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
