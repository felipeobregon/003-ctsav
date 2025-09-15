import LeadsTable, { Lead } from "@/components/LeadsTable";
import Link from "next/link";

async function getLeads(): Promise<Lead[]> {
  console.log('=== DEBUG: getLeads function called ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  console.log('VERCEL_REGION:', process.env.VERCEL_REGION);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    console.log('Constructed baseUrl:', baseUrl);
    const apiUrl = `${baseUrl}/api/leads`;
    console.log('Full API URL:', apiUrl);
    
    console.log('Making fetch request...');
    const response = await fetch(apiUrl, {
      cache: 'no-store', // Always fetch fresh data
    });

    console.log('Response received:');
    console.log('- Status:', response.status);
    console.log('- StatusText:', response.statusText);
    console.log('- Headers:', Object.fromEntries(response.headers.entries()));
    console.log('- URL:', response.url);

    if (!response.ok) {
      console.error('❌ Failed to fetch leads:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return [];
    }

    const data = await response.json();
    console.log('✅ Successfully fetched leads:', data.length, 'records');
    console.log('Sample lead data:', data[0]);
    return data;
  } catch (error) {
    console.error('❌ Error fetching leads:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return [];
  }
}

export default async function Home() {
  const leads = await getLeads();
  return (
    <div className="font-sans min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-neutral-900 dark:bg-white" />
            <span className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-100">CRM Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <Link 
              href="/posts"
              className="rounded-md border border-black/10 dark:border-white/20 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              LinkedIn Posts
            </Link>
            <button className="rounded-md border border-black/10 dark:border-white/20 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">New Lead</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Leads</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">All captured leads across channels.</p>
        </div>
        <LeadsTable leads={leads} />
      </main>
    </div>
  );
}
