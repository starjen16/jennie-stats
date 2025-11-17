import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL,
});
redis.connect();

async function getLatestJennieChart() {
  const keys = await redis.keys("jennie_global_*");
  if (!keys.length) return null;

  const latestKey = keys.sort().reverse()[0];
  const data = await redis.get(latestKey);

  if (!data) return null;
  return JSON.parse(data);
}

export default async function JennieGlobalPage() {
  const data = await getLatestJennieChart();

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

  const { date, tracks } = data;

  return (
    <main className="p-8 text-white max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-red-500">
          Jennie — Spotify Global Daily Chart
        </h1>

        <p className="mt-1 text-white/60">Updated: {date}</p>
        <p className="text-xs text-white/40 mt-1">
          (Spotify charts always reflect the previous day)
        </p>
      </div>

      {/* TRACK LIST */}
      <div className="space-y-4">
        {tracks.map((t: any) => {
          const prev = t.chart_entry_data?.previous_rank;
          const movement =
            prev && prev > 0 ? prev - t.chart_entry_data.current_rank : null;

          return (
            <div
              key={`${t.track_id}-${t.chart_entry_data.current_rank}`}
              className="flex justify-between items-center bg-[#111] 
                         border border-red-600/40 p-4 rounded-xl shadow-lg"
            >
              {/* LEFT - Position + Track Info */}
              <div className="flex items-center gap-5">
                <div className="text-3xl font-bold w-10 text-center">
                  {t.chart_entry_data.current_rank}
                </div>

                <div>
                  <div className="text-xl font-semibold">{t.track_name}</div>
                  <div className="text-sm text-white/60">
                    {t.artist_names.join(", ")}
                  </div>
                </div>
              </div>

              {/* RIGHT - Stats */}
              <div className="text-right">
                <p className="text-sm text-white/60">Streams</p>
                <p className="text-lg font-semibold">
                  {t.chart_entry_data.streams.toLocaleString()}
                </p>

                {/* Movement */}
                <p
                  className={`text-xs mt-1 ${
                    movement === null
                      ? "text-white/40"
                      : movement > 0
                      ? "text-green-400"
                      : movement < 0
                      ? "text-red-400"
                      : "text-white/60"
                  }`}
                >
                  {movement === null
                    ? "-"
                    : movement > 0
                    ? `+${movement}`
                    : movement}
                </p>

                {/* Peak + Streak */}
                <p className="text-xs text-white/50 mt-2">
                  Peak: {t.chart_entry_data.peak_rank} • Streak:{" "}
                  {t.chart_entry_data.weeks_on_chart}
                </p>
              </div>
            </div>
          );
        })}

        {tracks.length === 0 && (
          <p className="text-white/60 text-center py-10">
            Jennie has no songs on the Global chart for this date.
          </p>
        )}
      </div>
    </main>
  );
}
