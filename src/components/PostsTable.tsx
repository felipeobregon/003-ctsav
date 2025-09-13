"use client";

import React from "react";
import { Post } from "@/types/Post";
import { ExternalLink, Heart, MessageCircle, Share, Calendar, User } from "lucide-react";

type PostsTableProps = {
  posts: Post[];
};

export default function PostsTable({ posts }: PostsTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-black/10 dark:border-white/15 bg-white dark:bg-neutral-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300 text-xs uppercase tracking-wider">
          <tr>
            <th className="px-4 py-3">Post</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Published</th>
            <th className="px-4 py-3">Engagement</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-t border-black/5 dark:border-white/10 hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40">
              <td className="px-4 py-3">
                <div className="flex flex-col max-w-md">
                  <span className="font-medium text-neutral-900 dark:text-neutral-100 mb-1 line-clamp-2">
                    {post.title || 'Untitled Post'}
                  </span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-xs line-clamp-3">
                    {post.content}
                  </span>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-neutral-400 dark:text-neutral-500">
                          +{post.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-700 dark:text-neutral-300">{post.author || 'Unknown'}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{formatDate(post.publishedAt)}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                {post.engagement ? (
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
                ) : (
                  <span className="text-neutral-400 dark:text-neutral-500 text-sm">No data</span>
                )}
              </td>
              <td className="px-4 py-3">
                {post.linkedinUrl ? (
                  <a
                    href={post.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View
                  </a>
                ) : (
                  <span className="text-neutral-400 dark:text-neutral-500 text-sm">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
