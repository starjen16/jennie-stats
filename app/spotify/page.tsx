import React from "react";

const data = [
  { title: "SOLO", streams: 749276471, daily: 194775 },
  { title: "Like Jennie", streams: 608757600, daily: 1400213 },
  { title: "Mantra", streams: 450246893, daily: 582472 },
  { title: "You & Me", streams: 314061139, daily: 163782 },
];

export default function TracksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500 text-center mb-8">
        Track Streams
      </h1>

      <div className="space-y-4">
        {data.map((track, index) => (
          <div
            key={index}
            className="border border-red-900 p-4 rounded-lg bg-black/40"
          >
            <h2 className="text-xl font-semibold">{track.title}</h2>
            <p>Total Streams: {track.streams.toLocaleString()}</p>
            <p className="text-green-400">
              + {track.daily.toLocaleString()} today
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
