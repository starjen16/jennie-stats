import { createClient } from "redis";

// Create Redis client safely for serverless environments
const redis = createClient({
  url: process.env.REDIS_URL,
});

if (!redis.isOpen) {
  redis.connect();
}

// -------- Load latest saved Jennie chart --------
async function getLatestJennieChart() {
  const keys = await redis.keys("jennie_global_*");
  if (!keys.length) return null;

  // newest date = last alphabetically
  const latestKey = keys.sort().reverse()[0];
  const raw = await redis.get(latestKey);
  if (!raw) return null;

  return JSON.parse(raw);
}

export default async function JennieGlobalPage() {
  const data = await getLatestJennieChart();

  // If no data saved yet
  if (!data) {
    return (
      <main className="p-8 text-white">
        <h1 className="text-3xl font-bold">Jennie — Spotify Global Chart</h1>
        <p className="mt-3 text-red-400">
          No data yet — Cron job has not saved any charts.
        </p>
      </main>
    );
  }

  // Chart date comes *from Redis*, NOT from today
  const { date, tracks } = data;

  return (
    <main className="p-8 text-white max-w-4xl mx-auto">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-red-500">
          Jennie — Spotify Global Daily Chart
        </h1>
        <p className="mt-1 text-white/60">Updated: {date}</p>
        <p className="mt-1 text-white/40 text-sm">
          (Spotify charts always reflect the previous day)
        </p>
      </div>

      {/* TRACKS LIST */}
      <div className="space-y-4">
        {tracks.map((t: any) => (
          <div
            key={`${t.track}-${t.position}`}
            className="flex justify-between items-center bg-[#111] border border-red-600/40 p-4 rounded-xl shadow-lg"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-5">
              <div className="text-3xl font-bold w-10 text-center">
                {t.position}
              </div>

              <div>
                <div className="text-xl font-semibold">{t.track}</div>
                <div className="text-sm text-white/60">{t.artist}</div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right">
              <p className="text-sm text-white/60">Streams</p>
              <p className="text-lg font-semibold">
                {t.streams.toLocaleString()}
              </p>

              {/* Stream change */}
              <p
                className={`text-xs mt-1 ${
                  t.streamsChange === null
                    ? "text-white/40"
                    : t.streamsChange > 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {t.streamsChange === null
                  ? "-"
                  : `${t.streamsChange > 0 ? "+" : ""}${t.streamsChange.toLocaleString()}`}
              </p>

              {/* Movement */}
              <span
                className={`inline-block mt-2 px-3 py-1 text-xs rounded-full font-medium ${
                  t.movement === null
                    ? "bg-gray-600 text-white/70"
                    : t.movement > 0
                    ? "bg-green-400 text-black"
                    : t.movement < 0
                    ? "bg-red-400 text-black"
                    : "bg-gray-600 text-white/70"
                }`}
              >
                {t.movement === null
                  ? "NEW"
                  : t.movement > 0
                  ? `+${t.movement}`
                  : t.movement}
              </span>
            </div>
          </div>
        ))}

        {/* NO TRACKS */}
        {tracks.length === 0 && (
          <p className="text-white/60 text-center py-10">
            Jennie has no songs on the Global chart for this date.
          </p>
        )}
      </div>
    </main>
  );
}
