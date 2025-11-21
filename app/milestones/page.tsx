type Milestone = {
  source: string;
  title: string;
  date: string;
};

const milestones: Milestone[] = [
  { source: "SPOTIFY", title: "SOLO surpassed 1.0 billion streams on Spotify", date: "2025-10-01" },
  { source: "SPOTIFY", title: "You & Me surpassed 300 million streams on Spotify", date: "2025-09-15" },
  { source: "SPOTIFY", title: "Converse High surpassed 100 million streams on Spotify", date: "2025-08-18" },
  { source: "YOUTUBE", title: "SOLO Official MV reached 950 million views", date: "2025-08-01" },
  { source: "NEWS", title: "MAMA 2025 nominations announced for Jennie", date: "2025-10-30" }
];

export default function MilestonesPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-extrabold text-white">Milestones</h1>
        <p className="text-gray-400 mt-2">Recent achievements and records for Jennie</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {milestones.map((m, idx) => (
          <div key={idx} className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide px-2 py-1 rounded bg-red-900 text-red-100">
                {m.source}
              </span>
              <span className="text-xs text-gray-500">{m.date}</span>
            </div>
            <h2 className="mt-3 text-white font-semibold">{m.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
