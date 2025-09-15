"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/types/Post";
import { ExternalLink, Heart, MessageCircle, Share, Calendar, User, Loader2, FileText } from "lucide-react";

type PostsSectionProps = {
  leadId: string;
  leadName: string;
  refreshTrigger?: number;
};

export default function PostsSection({ leadId, leadName, refreshTrigger = 0 }: PostsSectionProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching posts for lead:', leadId);
      const response = await fetch(`/api/posts/${leadId}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Posts fetched successfully:', data);
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [leadId, refreshTrigger]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Posts by {leadName}</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading posts...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Posts by {leadName}</h2>
        </div>
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">
            Error loading posts: {error}
          </p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-5 h-5 text-neutral-400" />
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Posts by {leadName}</h2>
        </div>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-neutral-500 dark:text-neutral-400">
            No posts found for this lead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-5 h-5 text-neutral-400" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          Posts by {leadName} ({posts.length})
        </h2>
      </div>
      
      <div className="space-y-4">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2 line-clamp-2">
                  {post.title || 'Untitled Post'}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-3 mb-3">
                  {post.content}
                </p>
              </div>
              {post.linkedinUrl && (
                <a
                  href={post.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-4 inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </a>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>{post.author || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </div>
              
              {post.engagement && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1 text-red-500">
                    <Heart className="w-3 h-3" />
                    <span>{post.engagement.likes}</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-500">
                    <MessageCircle className="w-3 h-3" />
                    <span>{post.engagement.comments}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-500">
                    <Share className="w-3 h-3" />
                    <span>{post.engagement.shares}</span>
                  </div>
                </div>
              )}
            </div>
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {post.tags.slice(0, 5).map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
                {post.tags.length > 5 && (
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">
                    +{post.tags.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
