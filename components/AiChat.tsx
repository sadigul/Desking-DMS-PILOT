'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User, Minimize2, Maximize2, Loader2, MessageSquare, Zap, BarChart3, Car, DollarSign, RefreshCw } from 'lucide-react';
import Markdown from 'react-markdown';
import { useAppStore } from '@/store/appStore';
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
  const { deals, inventory, customers } = useAppStore();

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

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          context: { deals, inventory, customers }
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I couldn't connect to the AI service. Please check your API configuration and try again.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([{ role: 'assistant', content: "Conversation cleared. How can I help?", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    setShowSuggestions(true);
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
            className="mb-3 rounded-2xl border border-slate-200/80 shadow-2xl shadow-slate-900/10 overflow-hidden flex flex-col max-w-[calc(100vw-2rem)] bg-white"
            style={{ width: 400, height: isMinimized ? 'auto' : 520 }}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-white border-b border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 p-1.5">
                  <img src="https://www.dmspilot.com/logo.svg" alt="DMS Pilot" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-slate-900">Sara</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <p className="text-[10px] text-slate-500">AI Assistant at DMS Pilot</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={handleClear} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors" title="Clear chat">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button onClick={() => setIsMinimized(!isMinimized)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> : <Minimize2 className="w-3.5 h-3.5 text-slate-400" />}
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
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
                        m.role === 'user' ? 'bg-indigo-100' : 'bg-indigo-50 border border-indigo-100'
                      )}>
                        {m.role === 'user'
                          ? <User className="w-3.5 h-3.5 text-indigo-600" />
                          : <img src="https://www.dmspilot.com/logo.svg" alt="Sara" className="w-3.5 h-3.5 object-contain" />
                        }
                      </div>
                      <div className={cn("max-w-[80%] flex flex-col", m.role === 'user' ? 'items-end' : 'items-start')}>
                        <div className={cn(
                          "rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed",
                          m.role === 'user'
                            ? 'bg-indigo-600 text-white rounded-tr-md'
                            : 'bg-white text-slate-700 border border-slate-200/60 shadow-sm rounded-tl-md'
                        )}>
                          <div className={cn("prose prose-sm max-w-none", m.role === 'user' ? 'prose-invert' : 'prose-slate')}>
                            <Markdown>{m.content}</Markdown>
                          </div>
                        </div>
                        {m.timestamp && <span className="text-[9px] text-slate-300 mt-1 px-1">{m.timestamp}</span>}
                      </div>
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="https://www.dmspilot.com/logo.svg" alt="Sara" className="w-3.5 h-3.5 object-contain" />
                      </div>
                      <div className="bg-white border border-slate-200/60 shadow-sm rounded-2xl rounded-tl-md px-4 py-3">
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
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl border border-slate-200/60 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group"
                          >
                            <s.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors shrink-0" />
                            <span className="text-[12px] text-slate-600 group-hover:text-indigo-700 transition-colors">{s.text}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <div className="p-3 bg-white border-t border-slate-100">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your dealership..."
                        className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className={cn(
                        "p-2.5 rounded-xl transition-all shrink-0",
                        input.trim() && !isLoading
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[9px] text-slate-300 text-center mt-2">Sara may produce inaccurate info. Verify critical data.</p>
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
          "relative p-3.5 rounded-2xl flex items-center gap-2.5 transition-all shadow-lg",
          isOpen
            ? "bg-slate-800 text-white shadow-slate-800/20"
            : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-600/30 hover:shadow-indigo-600/40"
        )}
      >
        <div className="relative">
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
          {!isOpen && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse"></span>}
        </div>
        {!isOpen && <span className="font-medium text-sm pr-0.5">Sara</span>}
      </motion.button>
    </div>
  );
}
