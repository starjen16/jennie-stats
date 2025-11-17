export default function SpotifyCharts() {
  return (
    <div className="text-white">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-red-500">Spotify</span> Charts
      </h1>

      {/* DESCRIPTION */}
      <p className="text-center text-gray-400 mb-8">
        Daily and weekly Spotify chart positions for Jennie songs.
      </p>

      {/* CHART SECTIONS */}
      <div className="space-y-10">

        {/* DAILY CHARTS */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-400">
            🔥 Daily Global Chart (Placeholder)
          </h2>

          {/* List container */}
          <div className="bg-black/40 border border-red-900/40 rounded-xl p-4 space-y-4">

            {/* Chart Row - 1 */}
            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg border border-red-900/20">
              <div className="flex items-center gap-4">
                <span className="text-gray-300 font-bold"># —</span>
                <span className="text-white">Song Name</span>
              </div>

              <div className="text-right text-gray-400">
                <p>Streams —</p>
                <p className="text-sm text-gray-500">Movement —</p>
              </div>
            </div>

            {/* More rows will auto-generate later */}
          </div>
        </div>

        {/* WEEKLY CHARTS */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-400">
            📅 Weekly Global Chart (Placeholder)
          </h2>

          <div className="bg-black/40 border border-red-900/40 rounded-xl p-4">
            <p className="text-gray-400">Weekly chart data will load here...</p>
          </div>
        </div>

        {/* COUNTRY CHARTS */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-red-400">
            🌍 Country Charts (Placeholder)
          </h2>

          <div className="bg-black/40 border border-red-900/40 rounded-xl p-4">
            <p className="text-gray-400">Country-specific stats coming soon...</p>
          </div>
        </div>

      </div>
    </div>
  );
}
