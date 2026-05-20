'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Loader2, Check, RefreshCw, TrendingUp, Shield, Percent, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vehicle, Deal } from '@/store/appStore';

interface DeskingAiAssistantProps {
  vehicle: Vehicle | null;
  creditTier: Deal['creditTier'];
  currentPrice: number;
  onApplySuggestion: (suggestion: {
    price?: number;
    term?: number;
    sellRate?: number;
    activeProductIds?: string[];
  }) => void;
}

export function DeskingAiAssistant({ vehicle, creditTier, currentPrice, onApplySuggestion }: DeskingAiAssistantProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<any | null>(null);

  const generateSuggestion = async () => {
    if (!vehicle) return;
    setIsGenerating(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ 
            role: 'user', 
            content: `Act as a senior Automotive F&I Director. Analyze the current deal and provide optimal structure recommendations.
            
            VEHICLE: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}
            STOCK TYPE: ${vehicle.stockType}
            MSRP: $${vehicle.msrp}
            INVOICE: $${vehicle.invoice}
            CUSTOMER CREDIT: ${creditTier}
            CURRENT ATTEMPTED PRICE: $${currentPrice}

            Objective: Maximize PVR (Profit per Vehicle Retailed) while maintaining high approval odds.
            
            Focus on personalized product recommendations:
            - Platinum VSC (id: vsc-1) for high mileage/used or long term deals.
            - GAP Protection (id: gap-1) if down payment is < 20%.
            - Tire & Wheel (id: tire-wheel-1) for premium vehicles or low profile tires.
            - Maintenance (id: maint-1) for loyalty.

            Return a RAW JSON object:
            {
              "price": number,
              "term": number,
              "sellRate": number,
              "activeProductIds": string[],
              "rationale": string,
              "pros": string[]
            }` 
          }],
          context: { deals: [], inventory: [], customers: [] }
        })
      });

      const data = await response.json();
      const jsonStr = data.text.match(/\{[\s\S]*\}/)?.[0] || data.text;
      const parsed = JSON.parse(jsonStr);
      setSuggestion(parsed);
    } catch (error) {
      console.error('Logic AI error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-indigo-500/30 bg-slate-800/50 overflow-hidden">
      <CardHeader className="bg-slate-800/40 border-b border-slate-700/50 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-sm font-black tracking-tight uppercase">Sara Deal Strategist</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={generateSuggestion} 
            disabled={isGenerating || !vehicle}
            className="h-8 text-[10px] font-black uppercase text-indigo-600 gap-1.5 hover:bg-indigo-50"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
            {suggestion ? 'Regenerate' : 'Analyze Deal'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {!vehicle ? (
          <div className="text-center py-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Select a vehicle to activate<br/>AI strategic analysis
            </p>
          </div>
        ) : !suggestion && !isGenerating ? (
          <div className="text-center py-6">
             <div className="mb-3 inline-flex p-3 rounded-2xl bg-indigo-50">
               <TrendingUp className="w-6 h-6 text-indigo-400" />
             </div>
             <p className="text-sm font-bold text-slate-300 mb-1">Waiting for data...</p>
             <p className="text-xs text-slate-500 font-medium max-w-[200px] mx-auto">Click analyze for personalized F&I products and pricing structure.</p>
          </div>
        ) : isGenerating ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
             <div className="relative">
               <div className="w-12 h-12 rounded-full border-4 border-slate-700/50 border-t-indigo-600 animate-spin" />
               <Sparkles className="w-4 h-4 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <p className="text-xs font-black text-indigo-600 uppercase tracking-widest animate-pulse">Computing Matrix...</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
               <p className="text-xs font-bold text-indigo-700 mb-1 flex items-center gap-1.5">
                 <Shield className="w-3.5 h-3.5" /> F&I Strategy Report
               </p>
               <p className="text-xs text-indigo-900 leading-relaxed font-medium">{suggestion.rationale}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Rec. Price</p>
                  <p className="text-sm font-black text-slate-100">${suggestion.price?.toLocaleString()}</p>
               </div>
               <div className="bg-slate-800/40 p-2.5 rounded-xl border border-slate-700/50">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Rec. APR</p>
                  <p className="text-sm font-black text-slate-100">{suggestion.sellRate}%</p>
               </div>
            </div>

            <div className="space-y-2">
               <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Product Selection</p>
               <div className="flex flex-wrap gap-2">
                  {suggestion.activeProductIds?.map((id: string) => (
                    <Badge key={id} className="bg-indigo-600 text-[9px] font-bold py-0.5 uppercase">
                      {id.replace(/-/g, ' ').replace(/[0-9]/g, '')}
                    </Badge>
                  ))}
               </div>
            </div>

            <div className="space-y-1.5 border-t border-slate-700/50 pt-3">
               {suggestion.pros?.map((pro: string, i: number) => (
                 <div key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-600">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {pro}
                 </div>
               ))}
            </div>

            <Button 
              onClick={() => onApplySuggestion(suggestion)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase py-5 rounded-xl ring-2 ring-indigo-500/10 active:scale-95 transition-all"
            >
              Apply Strategy to Workbench
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
