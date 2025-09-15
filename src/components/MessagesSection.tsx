'use client';

import { useState, useEffect } from 'react';
import { Message } from '@/types/Message';
import { MessageCircle, Clock, User, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface MessagesSectionProps {
  leadId: string;
  leadName: string;
  refreshTrigger?: number; // This will trigger a refresh when it changes
}

export default function MessagesSection({ leadId, leadName, refreshTrigger }: MessagesSectionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    async function fetchMessages() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/messages?recipient=${encodeURIComponent(leadId)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    }

    fetchMessages();
  }, [leadId, refreshTrigger]); // Added refreshTrigger as dependency

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-neutral-500 dark:text-neutral-400">Loading messages...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
        </h2>
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500 dark:text-red-400 text-center">
            <div className="font-medium">Error loading messages</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Messages
          <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">
            ({messages.length})
          </span>
        </h2>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          title={isMinimized ? 'Expand messages' : 'Minimize messages'}
        >
          {isMinimized ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {!isMinimized && (
        <>
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
              <div className="text-neutral-500 dark:text-neutral-400">
                No messages found for {leadName}
              </div>
              <div className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                Messages will appear here when they are sent to this lead
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        To: {message.recipient}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                        <Clock className="w-3 h-3" />
                        {new Date(message.createdAt).toLocaleDateString()} at{' '}
                        {new Date(message.createdAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                      <button
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        title={copiedMessageId === message.id ? 'Copied!' : 'Copy message'}
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
