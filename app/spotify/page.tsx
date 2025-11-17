import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

// Get latest jennie key
async function getLatestJennieChart() {
  const keys = await redis.keys("jennie_global_*");
  if (!keys.length) return null;

  const latest = keys.sort().reverse()[0];
  const data = await redis.get(latest);
  return data ? JSON.parse(data) : null;
}

export default async function JennieGlobalPage() {
  const data = await getLatestJennieChart();

  if (!data) {
    return (
      <main className="p-8 text-white max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-red-500">
          Jennie — Spotify Global Daily Chart
        </h1>
        <p className="mt-2 text-white/60">No chart data found.</p>
      </main>
    );
  }

  const { date, tracks } = data;

  return (
    <main className="p-8 text-white max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-red-500">
          Jennie — Spotify Global Daily Chart
        </h1>
        <p className="mt-1 text-white/60">
          Updated: {date}
        </p>
        <p className="text-white/40 text-sm">
          (Spotify publishes charts for the previous day)
        </p>
      </div>

      {/* EMPTY STATE */}
      {tracks.length === 0 && (
        <p className="text-center text-white/60 py-10">
          Jennie has no songs on the Global chart for this date.
        </p>
      )}

      {/* TRACK LIST */}
      <div className="space-y-4">
        {tracks.map((t: any) => (
          <div
            key={`${t.track_name}-${t.position}`}
            className="flex justify-between items-center bg-[#0c0c0c] border border-red-500/30 p-4 rounded-xl"
          >
            {/* LEFT SIDE */}
            <div className="flex items-center gap-5">
              <div className="text-3xl font-bold w-10 text-center text-red-400">
                {t.position}
              </div>

              <div>
                <div className="text-xl font-semibold">{t.track_name}</div>
                <div className="text-white/60 text-sm">
                  {t.artist_names.join(", ")}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="text-right">
              <p className="text-white/60 text-sm">Streams</p>
              <p className="font-semibold text-lg">
                {t.streams.toLocaleString()}
              </p>

              {/* Movement */}
              <span
                className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium
                  ${
                    t.entry_movement > 0
                      ? "bg-green-400 text-black"
                      : t.entry_movement < 0
                      ? "bg-red-400 text-black"
                      : "bg-gray-600 text-white/70"
                  }
                `}
              >
                {t.entry_movement === 0
                  ? "NEW"
                  : t.entry_movement > 0
                  ? `+${t.entry_movement}`
                  : t.entry_movement}
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
