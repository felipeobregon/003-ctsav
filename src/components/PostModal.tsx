"use client";

import React, { useEffect } from "react";
import { Post } from "@/types/Post";
import { X, ExternalLink, Heart, MessageCircle, Share, Calendar, User } from "lucide-react";

type PostModalProps = {
  post: Post;
  onClose: () => void;
};

export default function PostModal({ post, onClose }: PostModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Dimmed background */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal content */}
      <div 
        className="relative bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            {post.title || 'Untitled Post'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-neutral-500 dark:text-neutral-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Post metadata */}
          <div className="flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-4">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author || 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
          </div>

          {/* Post content */}
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="text-neutral-900 dark:text-neutral-100 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>

          {/* Engagement stats */}
          {post.engagement && (
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-1 text-red-500">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">{post.engagement.likes}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-500">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm font-medium">{post.engagement.comments}</span>
              </div>
              <div className="flex items-center gap-1 text-green-500">
                <Share className="w-4 h-4" />
                <span className="text-sm font-medium">{post.engagement.shares}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* External link */}
          {post.linkedinUrl && (
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <a
                href={post.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on LinkedIn</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
