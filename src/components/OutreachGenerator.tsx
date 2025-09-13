'use client';

import { useState } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';

interface OutreachGeneratorProps {
  leadId: string;
  leadName: string;
  leadEmail?: string;
  leadCompany?: string;
}

export default function OutreachGenerator({ leadId, leadName, leadEmail, leadCompany }: OutreachGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateOutreach = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedMessage(null);

    try {
      const response = await fetch('https://faos.app.n8n.cloud/webhook/generate-outreach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: leadId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate outreach: ${response.statusText}`);
      }

      const data = await response.json();
      setGeneratedMessage(data.message || data.text || data.content || 'Outreach message generated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate outreach message');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGenerateOutreach}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <MessageSquare className="w-4 h-4" />
            Generate Outreach
          </>
        )}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      )}

      {generatedMessage && (
        <div className="bg-white dark:bg-neutral-900 rounded-xl border border-black/10 dark:border-white/15 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Generated Outreach Message
          </h3>
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
            <p className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
              {generatedMessage}
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(generatedMessage)}
              className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setGeneratedMessage(null)}
              className="px-3 py-1 text-sm border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
