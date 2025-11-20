import React from "react";

export default async function TracksPage() {
  // Dummy Jennie track data (replace with Redis later)
  const tracks = [
    { title: "One Of The Girls", streams: 2273974557, daily: 2495241 },
    { title: "SOLO", streams: 749276471, daily: 194775 },
    { title: "Like JENNIE", streams: 608757600, daily: 1400213 },
    { title: "Mantra", streams: 450246893, daily: 582472 },
    { title: "You & Me", streams: 314061139, daily: 163782 },
  ];

  const lastUpdated = "Nov 20, 2025";

  return (
    <div className="text-white">
      <h1 className="text-center text-3xl font-bold text-red-500 mb-4">
        Track Streams
      </h1>

      <p className="text-center text-gray-300 mb-6">
        Last updated: {lastUpdated}
      </p>

      <div className="max-w-4xl mx-auto bg-black/50 p-6 rounded-lg border border-red-900">
        <table className="w-full text-left text-gray-200">
          <thead>
            <tr className="border-b border-red-900 text-red-400">
              <th className="py-2">Track</th>
              <th className="py-2">Total Streams</th>
              <th className="py-2">Daily Gain</th>
            </tr>
          </thead>

          <tbody>
            {tracks.map((t, index) => (
              <tr key={index} className="border-b border-red-900/20">
                <td className="py-3">{t.title}</td>
                <td>{t.streams.toLocaleString()}</td>
                <td className="text-green-400">+{t.daily.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
