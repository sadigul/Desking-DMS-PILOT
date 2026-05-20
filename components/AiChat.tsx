'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, Minimize2, Maximize2, MessageSquare, Zap, BarChart3, Car, DollarSign, ArrowUp } from 'lucide-react';
import Markdown from 'react-markdown';
import { cn } from '@/lib/utils';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
};

const suggestions = [
  { icon: BarChart3, text: "Show MTD gross profit breakdown" },
  { icon: Car, text: "Which units have 30+ days in stock?" },
  { icon: DollarSign, text: "What's our F&I PVR this month?" },
  { icon: Zap, text: "Summarize today's pipeline activity" },
];

const dummyResponses: Record<string, string> = {
  "Show MTD gross profit breakdown": "**MTD Gross Profit Breakdown:**\n\n• **Front Gross:** $18,420 (avg $2,225/unit)\n• **Back Gross (F&I):** $13,740 (avg $2,984/unit)\n• **Total Gross:** $32,160\n• **Units Delivered:** 89 of 164 target\n\n📈 Front gross is up **+12.5%** vs last month. Back end PVR improved by $220.",
  "Which units have 30+ days in stock?": "**Units Over 30 Days in Stock:**\n\n| # | Vehicle | Days | Price |\n|---|---------|------|-------|\n| 1 | 2024 Ford F-150 XLT | 42 days | $48,500 |\n| 2 | 2023 BMW X3 M40i | 38 days | $52,900 |\n| 3 | 2024 Toyota Camry SE | 35 days | $28,700 |\n| 4 | 2023 Chevy Tahoe LT | 33 days | $56,200 |\n| 5 | 2024 Honda Accord Sport | 31 days | $32,400 |\n| 6 | 2023 Jeep Wrangler | 31 days | $44,800 |\n\n⚠️ **6 units** aging past 30 days. Consider price adjustments on the F-150 and X3.",
  "What's our F&I PVR this month?": "**F&I PVR Performance — May 2026:**\n\n• **Current PVR:** $2,984\n• **Last Month:** $2,764\n• **Change:** +$220 (+8%)\n\n**Product Penetration Rates:**\n• VSC: 68% ✅\n• GAP: 74% ✅\n• Maintenance: 33% ⚠️\n• Tire & Wheel: 44%\n• Appearance: 38%\n• Theft: 55%\n\n💡 Maintenance penetration is below target. Consider bundling with VSC for a combo discount.",
  "Summarize today's pipeline activity": "**Today's Pipeline Summary:**\n\n• **New Deals Created:** 3\n• **Moved to F&I:** 2\n• **Funded:** 1 (Sarah Chen — 2024 RAV4)\n• **Pending Lender Decision:** 2\n\n**Hot Deals:**\n1. Marcus Johnson — Pre-approved, waiting on trade appraisal\n2. David Kim — Submitted to Ally, strong app (720+ FICO)\n\n**Action Needed:**\n• Follow up with Capital One on the Rodriguez deal (48hrs pending)",
};

function getDummyResponse(input: string): string {
  // Check for exact match first
  if (dummyResponses[input]) return dummyResponses[input];
  
  // Keyword matching
  const lower = input.toLowerCase();
  if (lower.includes('gross') || lower.includes('profit') || lower.includes('revenue')) {
    return dummyResponses["Show MTD gross profit breakdown"];
  }
  if (lower.includes('aging') || lower.includes('days') || lower.includes('stock') || lower.includes('old')) {
    return dummyResponses["Which units have 30+ days in stock?"];
  }
  if (lower.includes('f&i') || lower.includes('pvr') || lower.includes('back end') || lower.includes('product')) {
    return dummyResponses["What's our F&I PVR this month?"];
  }
  if (lower.includes('pipeline') || lower.includes('today') || lower.includes('deal') || lower.includes('activity')) {
    return dummyResponses["Summarize today's pipeline activity"];
  }
  
  return "**Here's what I can help you with:**\n\n• Gross profit analysis & breakdowns\n• Inventory aging & stock alerts\n• F&I performance & penetration rates\n• Pipeline status & deal tracking\n• Lender approvals & rate comparisons\n• Sales team performance metrics\n\nTry asking about any of these topics!";
}

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm **Sara** — your AI assistant at DMS Pilot. Ask me about deals, inventory aging, lender approvals, F&I performance, or anything else.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || isLoading) return;

    const userMessage: Message = { role: 'user', content: msg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1200 + Math.random() * 800));

    const response = getDummyResponse(msg);
    setMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="mb-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 overflow-hidden flex flex-col max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900"
            style={{ width: 400, height: isMinimized ? 'auto' : 520 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1.5">
                  <img src="https://www.dmspilot.com/logo.svg" alt="DMS Pilot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-slate-900 dark:text-white">Sara</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">AI Assistant at DMS Pilot</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> : <Minimize2 className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900 dark:to-slate-900">
                  {messages.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className={cn("flex gap-2.5", m.role === 'user' ? 'flex-row-reverse' : '')}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 overflow-hidden",
                        m.role === 'user' ? 'bg-indigo-100 dark:bg-indigo-500/20' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                      )}>
                        {m.role === 'user'
                          ? <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          : <img src="https://www.dmspilot.com/logo.svg" alt="Sara" className="w-3.5 h-3.5 object-contain" />
                        }
                      </div>
                      <div className={cn("max-w-[80%] flex flex-col", m.role === 'user' ? 'items-end' : 'items-start')}>
                        <div className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-md'
                            : 'bg-white dark:bg-slate-800/60 text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/50 rounded-tl-md'
                        )}>
                          <div className={cn("prose prose-sm max-w-none [&>p]:mb-1.5 [&>p:last-child]:mb-0", m.role === 'user' ? 'prose-invert' : 'prose-slate dark:prose-invert')}>
                            <Markdown>{m.content}</Markdown>
                          </div>
                        </div>
                        {m.timestamp && <span className="text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-1">{m.timestamp}</span>}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="https://www.dmspilot.com/logo.svg" alt="Sara" className="w-3.5 h-3.5 object-contain" />
                      </div>
                      <div className="bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Suggestions */}
                  {showSuggestions && messages.length <= 1 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="pt-2 space-y-2">
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider px-1">Quick prompts</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {suggestions.map((s, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(s.text)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200/60 dark:border-slate-700/50 bg-white dark:bg-slate-800/40 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/10 transition-all text-left group"
                          >
                            <s.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                            <span className="text-[12px] text-slate-600 dark:text-slate-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">{s.text}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your dealership..."
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 dark:focus:border-indigo-500/40 focus:bg-white dark:focus:bg-slate-800 transition-all outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        "p-2.5 rounded-xl transition-all shrink-0",
                        input.trim() && !isLoading
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-3 rounded-2xl flex items-center gap-2.5 transition-all border",
          isOpen
            ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-indigo-300 dark:hover:border-indigo-500/40"
        )}
      >
        <div className="relative w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
          {isOpen ? <X className="w-5 h-5" /> : <img src="https://www.dmspilot.com/logo.svg" alt="Sara" className="w-6 h-6 object-contain" />}
          {!isOpen && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>}
        </div>
        {!isOpen && <span className="font-medium text-sm pr-0.5">Sara</span>}
      </motion.button>
    </div>
  );
}
