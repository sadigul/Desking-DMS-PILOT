'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import Markdown from 'react-markdown';

export function AiSummary() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const generateSummary = async () => {
    setIsGenerating(true);
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSummary(`**Executive Summary — May 2026**

• **Total Gross MTD:** $32,160 across 89 units delivered (+12.5% vs Apr)
• **F&I PVR:** $2,984 — up $220 from last month, strong VSC/GAP attach rates
• **Inventory Health:** 32 units in stock, avg age 19 days — 6 units past 30-day threshold

**⚠️ Risks:**
• Ford F-150 XLT at 42 days — consider markdown or incentivized push
• Maintenance product penetration at 33% — well below 50% target

**💡 Actions:**
1. Bundle maintenance with VSC for combo pricing — could lift penetration by 15-20%
2. Run a weekend push event on aged units (30+ days) with $500 bonus spiff
3. Pre-validate 2 pending apps with Capital One to accelerate funding`);
    setIsGenerating(false);
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
