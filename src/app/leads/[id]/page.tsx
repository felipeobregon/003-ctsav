'use client';

import { Lead } from '@/components/LeadsTable';
import MessagesSection from '@/components/MessagesSection';
import PostsSection from '@/components/PostsSection';
import Link from 'next/link';
import { ArrowLeft, Mail, Building, User, Calendar, Tag, Linkedin, MessageSquare, Loader2, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

async function getLead(id: string): Promise<Lead | null> {
  console.log('=== DEBUG: getLead function called ===');
  console.log('Lead ID:', id);
  
  try {
    // Use relative URL - this will work in both development and production
    const apiUrl = `/api/leads/${id}`;
    console.log('API URL:', apiUrl);
    
    console.log('Making fetch request...');
    const response = await fetch(apiUrl, {
      cache: 'no-store',
    });

    console.log('Response received:');
    console.log('- Status:', response.status);
    console.log('- StatusText:', response.statusText);
    console.log('- Headers:', Object.fromEntries(response.headers.entries()));
    console.log('- URL:', response.url);

    if (!response.ok) {
      console.error('❌ Failed to fetch lead:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return null;
    }

    const data = await response.json();
    console.log('✅ Successfully fetched lead:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching lead:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return null;
  }
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generateSuccess, setGenerateSuccess] = useState(false);
  const [messagesRefreshTrigger, setMessagesRefreshTrigger] = useState(0);
  const [isRetrievingPosts, setIsRetrievingPosts] = useState(false);
  const [retrievePostsError, setRetrievePostsError] = useState<string | null>(null);
  const [retrievePostsSuccess, setRetrievePostsSuccess] = useState(false);
  const [postsRefreshTrigger, setPostsRefreshTrigger] = useState(0);

  useEffect(() => {
    async function fetchLead() {
      try {
        setLoading(true);
        setError(null);
        const { id } = await params;
        const leadData = await getLead(id);
        setLead(leadData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lead');
      } finally {
        setLoading(false);
      }
    }

    fetchLead();
  }, [params]);

  const handleGenerateOutreach = async () => {
    if (!lead) return;
    
    setIsGenerating(true);
    setGenerateError(null);
    setGenerateSuccess(false);

    try {
      const response = await fetch('https://faos.app.n8n.cloud/webhook/generate-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lead.customId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate message: ${response.statusText}`);
      }

      setGenerateSuccess(true);
      // Trigger messages refresh to show the new message
      setMessagesRefreshTrigger(prev => prev + 1);
      // Reset success message after 3 seconds
      setTimeout(() => setGenerateSuccess(false), 3000);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate message');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetrievePosts = async () => {
    if (!lead) return;
    
    setIsRetrievingPosts(true);
    setRetrievePostsError(null);
    setRetrievePostsSuccess(false);

    try {
      const response = await fetch('https://faos.app.n8n.cloud/webhook/pull-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lead.customId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to retrieve posts: ${response.statusText}`);
      }

      setRetrievePostsSuccess(true);
      // Trigger posts refresh to show the new posts
      setPostsRefreshTrigger(prev => prev + 1);
      // Reset success message after 3 seconds
      setTimeout(() => setRetrievePostsSuccess(false), 3000);
    } catch (err) {
      setRetrievePostsError(err instanceof Error ? err.message : 'Failed to retrieve posts');
    } finally {
      setIsRetrievingPosts(false);
    }
  };

  if (loading) {
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
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Loading Lead...</h1>
            <p className="text-neutral-600 dark:text-neutral-400">Please wait while we fetch the lead details.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !lead) {
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
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              {error || "The lead you're looking for doesn't exist or has been deleted."}
            </p>
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
            <div className="flex items-start gap-4">
              {lead.profilePic ? (
                <img
                  src={lead.profilePic}
                  alt={`${lead.name || 'Lead'} profile picture`}
                  className="w-24 h-24 rounded-lg object-cover border-2 border-neutral-200 dark:border-neutral-700"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-24 h-24 rounded-lg bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center border-2 border-neutral-300 dark:border-neutral-600">
                  <User className="w-12 h-12 text-neutral-500 dark:text-neutral-400" />
                </div>
              )}
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

        {/* Action Buttons */}
        <div className="mt-8 space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleGenerateOutreach}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Message...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  Generate Outreach
                </>
              )}
            </button>
            
            <button
              onClick={handleRetrievePosts}
              disabled={isRetrievingPosts}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isRetrievingPosts ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Retrieving Posts...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Retrieve Posts
                </>
              )}
            </button>
          </div>

          {generateError && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{generateError}</p>
            </div>
          )}

          {generateSuccess && (
            <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-300 text-sm">
                Message generated successfully! Check the messages section below to see the new message.
              </p>
            </div>
          )}

          {retrievePostsError && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-300 text-sm">{retrievePostsError}</p>
            </div>
          )}

          {retrievePostsSuccess && (
            <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-900 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-300 text-sm">
                Posts retrieved successfully! Check the posts section below to see the new posts.
              </p>
            </div>
          )}
        </div>

        {/* Posts Section */}
        <div className="mt-8">
          <PostsSection 
            leadId={lead.customId}
            leadName={lead.name || 'Unnamed Lead'}
            defaultMinimized={true}
            refreshTrigger={postsRefreshTrigger}
          />
        </div>

        {/* Messages Section */}
        <div className="mt-8">
          <MessagesSection 
            leadId={lead.customId}
            leadName={lead.name || 'Unnamed Lead'}
            refreshTrigger={messagesRefreshTrigger}
            defaultMinimized={true}
          />
        </div>
      </main>
    </div>
  );
}
