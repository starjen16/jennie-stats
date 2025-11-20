// app/page.tsx
import Link from 'next/link';

export default function Home() {
  return (
    // Note: Removed min-h-screen to let layout handle height if possible,
    // but kept flex-col structure for centered content.
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-red-500 mb-5">
        Jennie Stats
      </h1>
      <p className="text-gray-300 text-lg text-center max-w-xl mb-10">
        Real-time charts, rankings, streams, and milestones for Jennie.
      </p>

      <div className="flex gap-4">
        {/* Changed <a> to Link */}
        <Link 
          href="/charts" 
          className="px-6 py-3 bg-red-500 rounded-lg font-semibold hover:bg-red-600 transition"
        >
          View Stats
        </Link>

        {/* Changed <a> to Link */}
        <Link 
          href="/milestones" 
          className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition"
        >
          Milestones
        </Link>
      </div>
    </main>
  );
}