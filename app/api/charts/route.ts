// app/api/charts/route.ts

// ... (imports remain the same)

export const dynamic = 'force-dynamic'; 

// ... (file path constants remain the same)

export async function GET() {
    try {
        // 1. Read the data from the local cache file in /tmp
        const fileContents = await fs.readFile(dataFilePath, 'utf8');
        const cachedData = JSON.parse(fileContents); // This is now { timestamp: string, stats: any[] }

        // 2. Return the cached data (the full object)
        return NextResponse.json(cachedData);

    } catch (error) {
        console.error("Error reading charts cache:", error);
        
        // --- CHANGE 2: Ensure fallback matches the object structure ---
        return NextResponse.json(
            { 
                timestamp: '', // Empty timestamp for error state
                stats: [ // The stats array contains the error object
                    { source: "Cache Read Error", song: "Please trigger /api/cron/fetch-jennie-charts", count: "N/A" }
                ]
            }, 
            { status: 500 }
        );
    }
}