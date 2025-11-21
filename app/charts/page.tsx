// app/charts/page.tsx

// FIX: Force dynamic rendering to resolve "Dynamic server usage" error
export const dynamic = 'force-dynamic';

import ChartsView from '@/components/views/ChartsView';
import { Metadata } from 'next';
import { scrapeCharts } from '@/lib/scraper';

export const metadata: Metadata = {
  title: 'Charts | JENNIE Stats',
  description: 'Spotify and YouTube chart data for JENNIE.',
};

export default async function ChartsPage() {
  // Assuming scrapeCharts is a function that calls your API route 
  // or your scraping logic directly.
  const chartData = await scrapeCharts();

  return <ChartsView chartData={chartData} />;
}