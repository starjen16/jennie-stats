export const dynamic = 'force-dynamic'
import { scrapeData } from '@/lib/scraper'

interface SpotifyChartEntry {
  rank: number
  title: string
  artist: string
  streams: string
  date: string
}

interface ScrapedData {
  spotify: SpotifyChartEntry[]
  youtube: {
    views: number
    title: string
    date: string
  }
}

async function getChartData(): Promise<ScrapedData> {
  const data = await scrapeData()
  return data
}

export default async function SpotifyChartsPage() {
  const data = await getChartData()
  const spotify = data.spotify || []
  const youtube = data.youtube || { views: 0, title: 'N/A', date: '' }

  if (!spotify.length) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-extrabold text-white">Spotify Charts</h1>
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 text-red-100">
          <div className="text-lg font-semibold">No data available</div>
          <div className="text-sm">Add Spotify credentials to enable live charts.</div>
        </div>
      </div>
    )
  }

  const totalPopularity = spotify.reduce((sum, e) => sum + Number(e.streams || 0), 0)
  const lastUpdated = spotify[0]?.date || ''
  const topTrack = spotify[0]

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-700/50 pb-3">
        <h1 className="text-3xl font-extrabold text-white">Spotify Charts</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
          <div className="text-xs text-gray-400">Entries</div>
          <div className="text-4xl font-extrabold text-white">{spotify.length}</div>
          <div className="text-xs text-gray-500 mt-2">Last Updated: {lastUpdated}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
          <div className="text-xs text-gray-400">Total Popularity</div>
          <div className="text-4xl font-extrabold text-white">{totalPopularity.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">Top Track: {topTrack?.title}</div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl">
          <div className="text-xs text-gray-400">YouTube Views</div>
          <div className="text-4xl font-extrabold text-white">{youtube.views.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">{youtube.title}</div>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <div className="text-xl font-bold text-red-500">Top Tracks</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-800">
            <thead>
              <tr className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium w-16">Rank</th>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium hidden sm:table-cell">Artist</th>
                <th className="px-6 py-3 text-right font-medium">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-sm">
              {spotify.map((entry) => (
                <tr key={entry.rank} className="hover:bg-gray-800">
                  <td className="px-6 py-3 text-center font-extrabold text-red-500/80">{entry.rank}</td>
                  <td className="px-6 py-3 font-medium text-white">{entry.title}</td>
                  <td className="px-6 py-3 text-gray-400 hidden sm:table-cell">{entry.artist}</td>
                  <td className="px-6 py-3 text-right font-mono text-white">{entry.streams}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-800">
          <div className="text-xs text-gray-500">Updated: {lastUpdated}</div>
        </div>
      </div>
    </div>
  )
}