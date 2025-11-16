export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-6">
        Jennie Stats
      </h1>

      <p className="text-gray-300 text-lg text-center max-w-xl mb-10">
        Real-time charts, rankings, streams, and milestones for Jennie.
      </p>

      <div className="flex gap-4">
        <a
          href="#charts"
          className="px-6 py-3 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          View Stats
        </a>

        <a
          href="#milestones"
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Milestones
        </a>
      </div>
    </main>
  );
}
