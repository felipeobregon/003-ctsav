import { Lead } from '@/components/LeadsTable';
import Link from 'next/link';
import { ArrowLeft, Mail, Building, User, Calendar, Tag, Linkedin } from 'lucide-react';

async function getLead(id: string): Promise<Lead | null> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    const response = await fetch(`${baseUrl}/api/leads/${id}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch lead:', response.statusText);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching lead:', error);
    return null;
  }
}

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await getLead(id);

  if (!lead) {
    return (
      <div className="font-sans min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
          <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-neutral-900 dark:bg-white" />
              <span className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-100">CRM Dashboard</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Lead Not Found</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">The lead you're looking for doesn't exist or has been deleted.</p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Leads
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-neutral-900/60 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-neutral-900 dark:bg-white" />
            <span className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-100">CRM Dashboard</span>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Back Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Leads
        </Link>

        {/* Lead Header */}
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {lead.name || 'Unnamed Lead'}
              </h1>
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Created {new Date(lead.createdAt).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  ID: {lead.id}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${
                lead.status === 'New' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900' :
                lead.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900' :
                lead.status === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900' :
                lead.status === 'Customer' ? 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900' :
                'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
              }`}>
                {lead.status}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Email</div>
                  <div className="text-neutral-900 dark:text-neutral-100">
                    {lead.email || 'Not provided'}
                  </div>
                </div>
              </div>
              
              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">Company</div>
                    <div className="text-neutral-900 dark:text-neutral-100">{lead.company}</div>
                  </div>
                </div>
              )}
              
              {lead.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="w-5 h-5 text-neutral-400" />
                  <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">LinkedIn</div>
                    <a 
                      href={lead.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assignment Information */}
          <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Assignment</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-neutral-400" />
                <div>
                  <div className="text-sm text-neutral-500 dark:text-neutral-400">Owner</div>
                  <div className="text-neutral-900 dark:text-neutral-100">
                    {lead.owner || 'Unassigned'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button className="px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
            Edit Lead
          </button>
          <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Add Note
          </button>
          <button className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            Send Email
          </button>
        </div>
      </main>
    </div>
  );
}
