'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/appStore';
import Markdown from 'react-markdown';

export function AiSummary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { deals, inventory, customers } = useAppStore();

  const generateSummary = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ 
            role: 'user', 
            content: "Provide a high-level executive summary of the current dealership performance based on the data. Highlight key trends, potential risks, and 3 actionable insights. Use bullet points and bold text for key metrics." 
          }],
          context: { deals, inventory, customers }
        })
      });

      const data = await response.json();
      setSummary(data.text);
    } catch (error) {
      console.error('Summary error:', error);
      setSummary("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modern-card overflow-hidden bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white border-none">
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Sara Insights</h3>
            <p className="text-indigo-200 text-sm">AI-powered analysis by DMS Pilot</p>
          </div>
        </div>
        <button
          onClick={generateSummary}
          disabled={isGenerating}
          className="px-4 py-2.5 bg-white text-indigo-700 font-medium text-sm rounded-lg hover:bg-indigo-50 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Generate Report
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 sm:px-6 pb-5 sm:pb-6"
          >
            <div className="p-5 bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 text-white">
              <div className="flex items-center gap-2 mb-3 text-indigo-200">
                <Lightbulb className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Executive Insights</span>
              </div>
              <div className="prose prose-sm max-w-none prose-invert prose-p:leading-relaxed prose-li:my-1">
                <Markdown>{summary}</Markdown>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-end">
                <button 
                  onClick={() => setSummary(null)}
                  className="text-xs text-white/50 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
