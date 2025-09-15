import PostsTable from "@/components/PostsTable";
import { Post } from "@/types/Post";
import Link from "next/link";
import { ArrowLeft, Plus, BarChart3 } from "lucide-react";

async function getPosts(): Promise<Post[]> {
  console.log('=== DEBUG: getPosts function called ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('VERCEL_URL:', process.env.VERCEL_URL);
  console.log('VERCEL_REGION:', process.env.VERCEL_REGION);
  console.log('VERCEL_ENV:', process.env.VERCEL_ENV);
  
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    console.log('Constructed baseUrl:', baseUrl);
    const apiUrl = `${baseUrl}/api/posts`;
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
      console.error('❌ Failed to fetch posts:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      return [];
    }

    const data = await response.json();
    console.log('✅ Successfully fetched posts:', data.length, 'records');
    console.log('Sample post data:', data[0]);
    return data;
  } catch (error) {
    console.error('❌ Error fetching posts:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return [];
  }
}

export default async function PostsPage() {
  const posts = await getPosts();

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
              href="/"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Leads
            </Link>
            <button className="rounded-md border border-black/10 dark:border-white/20 px-3 py-1.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">LinkedIn Posts</h1>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">All LinkedIn posts from your leads and team.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{posts.length}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Posts</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No posts found</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">Start by adding some LinkedIn posts to your Airtable database.</p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
              <Plus className="w-4 h-4" />
              Add First Post
            </button>
          </div>
        ) : (
          <PostsTable posts={posts} />
        )}
      </main>
    </div>
  );
}
