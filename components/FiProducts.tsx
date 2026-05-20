"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Gavel, Cog, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  type: 'Warranty' | 'GAP' | 'Protection' | 'Maintenance';
  recommended: boolean;
}

interface FiProductsProps {
  activeProducts: string[];
  onToggleProduct: (productId: string) => void;
  creditTier: string;
  vehicleType: 'New' | 'Used';
}

const ALL_PRODUCTS: FiProduct[] = [
  {
    id: 'vsc-1',
    name: 'Platinum VSC',
    description: 'Bumper-to-bumper exclusionary coverage for 10 years or 100k miles.',
    price: 3200,
    cost: 1600,
    type: 'Warranty',
    recommended: true
  },
  {
    id: 'gap-1',
    name: 'GAP Protection',
    description: 'Covers the difference between loan balance and insurance payout in total loss.',
    price: 995,
    cost: 350,
    type: 'GAP',
    recommended: true
  },
  {
    id: 'tire-wheel-1',
    name: 'Road Hazard Tire & Wheel',
    description: 'Repair or replace tires and wheels damaged by road hazards.',
    price: 1200,
    cost: 450,
    type: 'Protection',
    recommended: true
  },
  {
    id: 'paint-fabric-1',
    name: 'Apex Protection Pack',
    description: 'Interior and exterior environmental protection with warranty.',
    price: 899,
    cost: 200,
    type: 'Protection',
    recommended: false
  },
  {
    id: 'maint-1',
    name: 'Prepaid Maintenance',
    description: 'Covers all factory recommended services for 3 years.',
    price: 750,
    cost: 400,
    type: 'Maintenance',
    recommended: false
  }
];

export const FiProducts = ({ activeProducts, onToggleProduct, creditTier, vehicleType }: FiProductsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">F&I Protection Suite</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Personalized Menu Selection</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
           <Info className="w-4 h-4 text-indigo-500" />
           <span className="text-xs font-bold text-indigo-700">Tier: {creditTier}</span>
        </div>
      </div>

      <div className="grid gap-4">
        {ALL_PRODUCTS.map((product) => {
          const isActive = activeProducts.includes(product.id);
          const Icon = product.type === 'Warranty' ? ShieldCheck : product.type === 'GAP' ? Gavel : product.type === 'Protection' ? CheckCircle2 : Cog;
          
          return (
            <motion.div 
              key={product.id}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "relative group p-4 rounded-2xl border-2 transition-all cursor-pointer",
                isActive 
                  ? "border-indigo-600 bg-indigo-50/50" 
                  : "border-slate-100 bg-white hover:border-slate-200"
              )}
              onClick={() => onToggleProduct(product.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                    isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-900">{product.name}</h4>
                      {product.recommended && (
                         <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[9px] h-4 py-0 font-black uppercase">Expert Choice</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-[280px]">
                      {product.description}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                   <div className="flex flex-col items-end">
                      <span className="text-lg font-black text-slate-900">${product.price.toLocaleString()}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">One-time Fee</span>
                   </div>
                   <Switch 
                     checked={isActive} 
                     onCheckedChange={() => onToggleProduct(product.id)}
                     className="data-[state=checked]:bg-indigo-600"
                   />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
               <AlertCircle className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Monthly Impact</p>
               <p className="text-xl font-black tracking-tightest">
                 +${((ALL_PRODUCTS.filter(p => activeProducts.includes(p.id)).reduce((acc, p) => acc + p.price, 0)) / 72).toFixed(2)} / mo
               </p>
            </div>
         </div>
         <Button className="h-10 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
            Review Policy
         </Button>
      </div>
    </div>
  );
};
