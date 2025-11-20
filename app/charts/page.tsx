// app/charts/page.tsx (Modify the top part of the ChartsPage function)
export default async function ChartsPage() {
    let data: any[] = [];
    const API_URL = 'https://jennie-stats.vercel.app/api/charts';
    const CRON_URL = 'https://jennie-stats.vercel.app/api/cron/fetch-jennie-charts';

    // Helper function to fetch data
    const fetchData = async () => {
        const res = await fetch(API_URL, { cache: 'no-store' });
        return await res.json();
    };

    data = await fetchData();

    // Check 1: Did the API return the "Cache Read Error" fallback?
    if (data.length > 0 && data[0].source === "Cache Read Error") {
        console.log("Cache Read Error detected, triggering cron job...");
        
        // 1. Force the cache file to be written on this instance/request
        await fetch(CRON_URL, { cache: 'no-store' });
        
        // 2. Wait a moment (Vercel is fast, but just in case)
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // 3. Re-fetch the data immediately after writing
        data = await fetchData();
    }
    
    // ... rest of your component logic follows, using the final 'data' variable
    
    // ... (rest of the return statement where you check data.length)
}