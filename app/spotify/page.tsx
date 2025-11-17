export default function SpotifyOverview() {
  return (
    <div className="text-white">

      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold text-center mb-8">
        <span className="text-red-500">Spotify</span> Overview
      </h1>

      {/* DESCRIPTION */}
      <p className="text-center text-gray-400 mb-10">
        Jennie's Spotify charts, tracks, albums & artist analytics.
      </p>

      {/* PLACEHOLDER SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="bg-black/50 border border-red-900/40 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Spotify Global Stats</h2>
          <p className="text-gray-400">Data will be added here...</p>
        </div>

        <div className="bg-black/50 border border-red-900/40 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Daily Streams</h2>
          <p className="text-gray-400">Charts coming soon...</p>
        </div>

        <div className="bg-black/50 border border-red-900/40 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Top Jennie Songs</h2>
          <p className="text-gray-400">Tracks list coming...</p>
        </div>

        <div className="bg-black/50 border border-red-900/40 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Album Performance</h2>
          <p className="text-gray-400">Album stats loading...</p>
        </div>

      </div>
    </div>
  );
}
