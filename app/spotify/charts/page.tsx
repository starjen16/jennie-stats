export default function SpotifyChartsPage() {
  return (
    <div className="text-white space-y-12">

      <h1 className="text-center text-4xl font-bold mb-6">
        <span className="text-red-500">Spotify</span> Charts
      </h1>

      <p className="text-center text-gray-300 mb-10">
        Daily & weekly Spotify chart positions for Jennie songs.
      </p>


      {/* -------------------- DAILY TOP SONGS -------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">🔥 Daily Top Songs (Placeholder)</h2>

        <div className="border border-red-800 rounded-xl p-4 bg-black/40">
          <div className="flex justify-between border-b border-red-900 pb-2 mb-3 text-gray-300">
            <span># — Song Name</span>
            <span>Streams — Movement</span>
          </div>
          <p className="text-gray-500">Daily top songs will load here...</p>
        </div>
      </section>


      {/* -------------------- DAILY TOP ARTISTS -------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">🎤 Daily Top Artists (Placeholder)</h2>

        <div className="border border-red-800 rounded-xl p-4 bg-black/40">
          <p className="text-gray-500">Daily top artists will load here...</p>
        </div>
      </section>


      {/* -------------------- DAILY VIRAL SONGS -------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">🔥 Daily Viral Songs (Placeholder)</h2>

        <div className="border border-red-800 rounded-xl p-4 bg-black/40">
          <p className="text-gray-500">Daily viral songs will load here...</p>
        </div>
      </section>


      {/* -------------------- WEEKLY TOP SONGS -------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">📅 Weekly Top Songs (Placeholder)</h2>

        <div className="border border-red-800 rounded-xl p-4 bg-black/40">
          <p className="text-gray-500">Weekly top songs will load here...</p>
        </div>
      </section>


      {/* -------------------- WEEKLY TOP ALBUMS -------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">💿 Weekly Top Albums (Placeholder)</h2>

        <div className="border border-red-800 rounded-xl p-4 bg-black/40">
          <p className="text-gray-500">Weekly top albums will load here...</p>
        </div>
      </section>


      {/* -------------------- COUNTRY CHARTS -------------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-3">🌍 Country Charts (Placeholder)</h2>

        <div className="border border-red-800 rounded-xl p-4 bg-black/40">
          <p className="text-gray-500">Country chart data will load here...</p>
        </div>
      </section>

    </div>
  );
}
