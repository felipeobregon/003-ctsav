import LeadsTable, { Lead } from "@/components/LeadsTable";

async function getLeads(): Promise<Lead[]> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/leads`, {
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      console.error('Failed to fetch leads:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching leads:', error);
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
