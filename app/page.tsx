export default function Home() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-2">
          Welcome to <span className="text-red-500">Jennie Stats</span>
        </h2>
        <p className="text-gray-400 text-sm">
          Live auto-updating Spotify, YouTube, and Apple Music statistics for Jennie —
          including charts, milestones, and fan streaming leaderboards.
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Spotify Streams" value="—" />
        <Card title="YouTube Views" value="—" />
        <Card title="Apple Music Ranks" value="—" />
        <Card title="Tracks Monitored" value="—" />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink href="/spotify" label="Spotify Stats" />
          <QuickLink href="/charts" label="Daily & Weekly Charts" />
          <QuickLink href="/youtube" label="YouTube Views" />
          <QuickLink href="/apple-music" label="Apple Music" />
          <QuickLink href="/discography" label="Jennie Discography" />
          <QuickLink href="/milestones" label="Milestones" />
        </div>
      </section>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border border-red-900/40 bg-red-950/20 p-5 shadow-lg shadow-red-900/20">
      <div className="text-red-400 text-xs uppercase">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="block p-4 rounded-lg border border-neutral-800 bg-neutral-900 hover:border-red-600 hover:bg-red-900/20 transition"
    >
      {label}
    </a>
  );
}
