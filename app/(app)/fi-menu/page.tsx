"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck, Car, Check, X, DollarSign, TrendingUp,
  BarChart3, Clock, Printer, Send, ArrowRight, ArrowLeft,
  Package, Zap, Target, Eye, Percent, CheckCircle2, XCircle, Shield,
  FileText, Users, Calculator, AlertTriangle, History
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

// ─── TYPES ──────────────────────────────────────────────────────────────
type FIProduct = {
  id: string;
  name: string;
  category: 'VSC' | 'GAP' | 'Appearance' | 'Theft' | 'Maintenance' | 'Ancillary';
  provider: string;
  retailPrice: number;
  dealerCost: number;
  term: string;
  description: string;
  coverageDetails: string[];
  deductible?: number;
  penetrationRate: number;
};

type MenuPackage = {
  id: string;
  name: string;
  color: string;
  products: string[];
  discount: number;
};

// ─── DATA ───────────────────────────────────────────────────────────────
const products: FIProduct[] = [
  {
    id: 'vsc-plat', name: 'Platinum Wrap VSC', category: 'VSC', provider: 'EasyCare',
    retailPrice: 3295, dealerCost: 1250, term: '8yr / 100,000mi', deductible: 100,
    description: 'Bumper-to-bumper mechanical breakdown protection with roadside & rental.',
    coverageDetails: ['Engine & Transmission', 'A/C & Heating', 'Electrical Systems', 'Suspension & Steering', 'Seals & Gaskets', 'Rental Car ($50/day)', '24/7 Roadside Assist', 'Trip Interruption ($150/day)'],
    penetrationRate: 62
  },
  {
    id: 'vsc-power', name: 'Powertrain Plus VSC', category: 'VSC', provider: 'EasyCare',
    retailPrice: 1895, dealerCost: 750, term: '7yr / 100,000mi', deductible: 200,
    description: 'Essential powertrain coverage with added A/C and electrical protection.',
    coverageDetails: ['Engine', 'Transmission', 'Drive Axle', 'A/C Compressor', 'Alternator/Starter', 'Roadside Assistance'],
    penetrationRate: 28
  },
  {
    id: 'gap-1', name: 'GAP Waiver', category: 'GAP', provider: 'Protective Asset Protection',
    retailPrice: 995, dealerCost: 295, term: 'Loan Term',
    description: 'Covers the gap between insurance payout and loan balance in a total loss event.',
    coverageDetails: ['Up to $50,000 gap coverage', 'Deductible coverage up to $1,000', 'No mileage restriction', 'New & Used vehicles', 'Includes lease walk-away'],
    penetrationRate: 71
  },
  {
    id: 'tw-1', name: 'Road Hazard Tire & Wheel', category: 'Appearance', provider: 'Road Vantage',
    retailPrice: 899, dealerCost: 320, term: '5yr / 60,000mi',
    description: 'Full tire & wheel repair/replacement from road hazards — no deductible.',
    coverageDetails: ['All 4 tires covered', 'Alloy wheel repair/replace', 'No deductible', 'Cosmetic wheel damage', 'Mount & balance included'],
    penetrationRate: 44
  },
  {
    id: 'paint-1', name: 'Exterior & Interior Protection', category: 'Appearance', provider: 'Perma-Plate',
    retailPrice: 799, dealerCost: 175, term: '7yr',
    description: 'Professional paint sealant, interior fabric/leather guard, and windshield coverage.',
    coverageDetails: ['Ceramic paint sealant', 'UV fade protection', 'Fabric/leather guard', 'Odor removal treatment', 'Windshield chip repair (3 per year)'],
    penetrationRate: 38
  },
  {
    id: 'theft-1', name: 'VIN Etch + Theft Recovery', category: 'Theft', provider: 'Etch Master',
    retailPrice: 399, dealerCost: 75, term: 'Lifetime',
    description: 'VIN etching on all glass with $5,000 theft deductible benefit.',
    coverageDetails: ['VIN etched all windows', '$5,000 theft benefit', 'Insurance deductible coverage', 'National recovery network'],
    penetrationRate: 55
  },
  {
    id: 'maint-1', name: 'Prepaid Maintenance', category: 'Maintenance', provider: 'Dealer-Owned',
    retailPrice: 1495, dealerCost: 700, term: '3yr / 36,000mi',
    description: 'All factory-scheduled maintenance at locked-in pricing. Keeps customer returning.',
    coverageDetails: ['Synthetic oil changes', 'Tire rotations', 'Multi-point inspections', 'Brake inspections', 'Fluid top-offs', 'Filter replacements', 'Battery test'],
    penetrationRate: 33
  },
  {
    id: 'key-1', name: 'Key Replacement Program', category: 'Ancillary', provider: 'Protective',
    retailPrice: 499, dealerCost: 110, term: '5yr',
    description: 'Covers replacement of lost, stolen, or damaged smart keys and fobs.',
    coverageDetails: ['Up to $800/occurrence', '2 claims allowed', 'Lockout assistance', 'Key programming included', 'Towing to dealership'],
    penetrationRate: 29
  },
  {
    id: 'dent-1', name: 'Paintless Dent Repair', category: 'Appearance', provider: 'Dent Wizard',
    retailPrice: 599, dealerCost: 160, term: '5yr / unlimited',
    description: 'Removes door dings & minor dents without repainting — unlimited claims.',
    coverageDetails: ['Unlimited claims', 'No deductible', 'Mobile service option', 'Hail damage (up to baseball)', 'Same-day service'],
    penetrationRate: 22
  },
  {
    id: 'windshield-1', name: 'Windshield Protection', category: 'Appearance', provider: 'Safelite Solutions',
    retailPrice: 349, dealerCost: 85, term: '3yr',
    description: 'Windshield crack and chip repair/replacement — zero deductible.',
    coverageDetails: ['Chip repair unlimited', 'Full replacement (1 per year)', 'Zero deductible', 'Mobile service', 'OEM glass'],
    penetrationRate: 18
  },
];

const menuPackages: MenuPackage[] = [
  { id: 'platinum', name: 'Platinum', color: 'from-indigo-600 to-indigo-700', products: ['vsc-plat', 'gap-1', 'tw-1', 'paint-1', 'maint-1', 'key-1', 'theft-1', 'dent-1', 'windshield-1'], discount: 12 },
  { id: 'gold', name: 'Gold', color: 'from-amber-500 to-amber-600', products: ['vsc-plat', 'gap-1', 'tw-1', 'paint-1', 'maint-1'], discount: 8 },
  { id: 'silver', name: 'Silver', color: 'from-slate-500 to-slate-600', products: ['vsc-power', 'gap-1', 'tw-1', 'theft-1'], discount: 5 },
  { id: 'bronze', name: 'Essential', color: 'from-orange-500 to-orange-600', products: ['gap-1', 'theft-1'], discount: 0 },
];

// ─── PAGE ───────────────────────────────────────────────────────────────
export default function FIMenuPage() {
  const router = useRouter();
  const { deals } = useAppStore();

  const [activeProducts, setActiveProducts] = useState<string[]>(['vsc-plat', 'gap-1']);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [presentationMode, setPresentationMode] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState("packages");

  // Deal context (simulated or from latest deal)
  const latestDeal = deals[0];
  const dealTerm = latestDeal?.term || 72;
  const dealApr = latestDeal?.apr || 5.9;

  const calcMonthly = (price: number) => {
    const r = dealApr / 100 / 12;
    if (r === 0) return price / dealTerm;
    return (price * r * Math.pow(1 + r, dealTerm)) / (Math.pow(1 + r, dealTerm) - 1);
  };

  const totalRetail = activeProducts.reduce((s, id) => s + (products.find(p => p.id === id)?.retailPrice || 0), 0);
  const totalCost = activeProducts.reduce((s, id) => s + (products.find(p => p.id === id)?.dealerCost || 0), 0);
  const totalProfit = totalRetail - totalCost;
  const totalMonthly = activeProducts.reduce((s, id) => s + calcMonthly(products.find(p => p.id === id)?.retailPrice || 0), 0);

  const handleSelectPackage = (pkg: MenuPackage) => {
    setSelectedPackage(pkg.id);
    setActiveProducts(pkg.products);
  };

  const handleToggle = (id: string) => {
    setSelectedPackage(null);
    setActiveProducts(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const filteredProducts = filterCategory === 'all' ? products : products.filter(p => p.category === filterCategory);
  const categories = ['all', 'VSC', 'GAP', 'Appearance', 'Theft', 'Maintenance', 'Ancillary'];

  // ─── RENDER ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 pb-20 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => router.push('/desking')} className="h-8 w-8 p-0 rounded-lg"><ArrowLeft className="w-4 h-4" /></Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">F&I Product Menu</h1>
            <p className="text-xs text-slate-500 mt-0.5">Protection packages & product selection with profit tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant={presentationMode ? "default" : "outline"} size="sm" onClick={() => setPresentationMode(!presentationMode)} className="text-xs h-8 rounded-lg gap-1.5">
            <Eye className="w-3.5 h-3.5" />{presentationMode ? 'Exit Customer View' : 'Customer View'}
          </Button>
          <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5"><Printer className="w-3.5 h-3.5" />Print</Button>
          <Button size="sm" onClick={() => router.push('/desking')} className="text-xs h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 gap-1.5"><Send className="w-3.5 h-3.5" />Add to Deal</Button>
        </div>
      </div>

      {/* KPIs (hidden in presentation) */}
      {!presentationMode && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {[
            { label: 'Products', value: `${activeProducts.length}`, sub: `of ${products.length}` },
            { label: 'Retail Total', value: `$${totalRetail.toLocaleString()}`, sub: 'customer price' },
            { label: 'Back Gross', value: `$${totalProfit.toLocaleString()}`, sub: 'F&I profit', hl: true },
            { label: 'Monthly +', value: `$${totalMonthly.toFixed(0)}`, sub: '/mo impact' },
            { label: 'PVR', value: `$${totalProfit.toLocaleString()}`, sub: 'per vehicle' },
          ].map((k, i) => (
            <div key={i} className={cn("p-2.5 rounded-xl border text-center", k.hl ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200/60")}>
              <p className="text-[10px] text-slate-400 font-medium">{k.label}</p>
              <p className={cn("text-base font-bold mt-0.5", k.hl ? "text-emerald-700" : "text-slate-900")}>{k.value}</p>
              <p className="text-[10px] text-slate-400">{k.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex gap-1 flex-wrap mb-4">
          {[
            { v: 'packages', l: 'Packages' },
            { v: 'menu', l: 'Full Menu' },
            { v: 'compare', l: 'Comparison' },
            ...(!presentationMode ? [{ v: 'analytics', l: 'Analytics' }] : []),
          ].map(t => (
            <button key={t.v} onClick={() => setActiveTab(t.v)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", activeTab === t.v ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}>{t.l}</button>
          ))}
        </div>

        {/* PACKAGES */}
        <TabsContent value="packages" className="mt-0 space-y-4">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {menuPackages.map((pkg) => {
              const pkgProducts = pkg.products.map(id => products.find(p => p.id === id)!).filter(Boolean);
              const pkgRetail = pkgProducts.reduce((s, p) => s + p.retailPrice, 0);
              const discountAmt = Math.floor(pkgRetail * (pkg.discount / 100));
              const finalPrice = pkgRetail - discountAmt;
              const monthly = calcMonthly(finalPrice);
              const isActive = selectedPackage === pkg.id;

              return (
                <motion.div key={pkg.id} whileHover={{ y: -2 }} onClick={() => handleSelectPackage(pkg)} className="cursor-pointer">
                  <Card className={cn("h-full border-2 rounded-xl overflow-hidden transition-all", isActive ? "border-indigo-400 shadow-lg shadow-indigo-100/50" : "border-slate-200/60 hover:border-slate-300")}>
                    <div className={cn("p-3.5 bg-gradient-to-br text-white", pkg.color)}>
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-sm font-bold">{pkg.name}</h3>
                        {isActive && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <p className="text-2xl font-bold">${monthly.toFixed(0)}<span className="text-xs font-normal opacity-80">/mo</span></p>
                      {pkg.discount > 0 && <p className="text-[10px] opacity-80 mt-0.5">{pkg.discount}% bundle savings (-${discountAmt.toLocaleString()})</p>}
                    </div>
                    <CardContent className="p-3 space-y-1.5">
                      {pkgProducts.map(p => (
                        <div key={p.id} className="flex items-center gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="text-slate-700 truncate">{p.name}</span>
                        </div>
                      ))}
                      {products.filter(p => !pkg.products.includes(p.id)).slice(0, 2).map(p => (
                        <div key={p.id} className="flex items-center gap-1.5 text-[11px] opacity-40">
                          <XCircle className="w-3 h-3 shrink-0" />
                          <span className="text-slate-400 line-through truncate">{p.name}</span>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-100 mt-2 flex justify-between text-xs">
                        <span className="text-slate-400">Total</span>
                        <div>
                          {pkg.discount > 0 && <span className="text-slate-400 line-through mr-1.5 text-[11px]">${pkgRetail.toLocaleString()}</span>}
                          <span className="font-semibold text-slate-900">${finalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      {!presentationMode && (
                        <div className="flex justify-between text-[10px] text-emerald-600 font-medium">
                          <span>GP</span>
                          <span>${(pkgProducts.reduce((s, p) => s + p.retailPrice - p.dealerCost, 0) - discountAmt).toLocaleString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        {/* FULL MENU */}
        <TabsContent value="menu" className="mt-0 space-y-4">
          <div className="flex items-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilterCategory(cat)} className={cn("px-2.5 py-1 rounded-md text-[11px] font-medium transition-all border", filterCategory === cat ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300")}>
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filteredProducts.map(p => {
              const active = activeProducts.includes(p.id);
              const monthly = calcMonthly(p.retailPrice);
              const profit = p.retailPrice - p.dealerCost;

              return (
                <Card key={p.id} className={cn("border-2 rounded-xl overflow-hidden transition-all cursor-pointer", active ? "border-indigo-400 bg-indigo-50/20" : "border-slate-200/60 hover:border-slate-300")} onClick={() => handleToggle(p.id)}>
                  <CardContent className="p-3.5">
                    <div className="flex items-start justify-between mb-1.5">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-semibold text-slate-900">{p.name}</h4>
                          <Badge variant="outline" className="text-[9px] h-4 px-1">{p.category}</Badge>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">{p.provider} • {p.term}</p>
                      </div>
                      <div className={cn("w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ml-2", active ? "bg-indigo-600 border-indigo-600" : "border-slate-300")}>
                        {active && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mb-2 line-clamp-2">{p.description}</p>

                    <div className="space-y-0.5 mb-2.5">
                      {p.coverageDetails.slice(0, 4).map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-600">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{c}</span>
                        </div>
                      ))}
                      {p.coverageDetails.length > 4 && <p className="text-[10px] text-slate-400 pl-4">+{p.coverageDetails.length - 4} more</p>}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <p className="text-sm font-bold text-slate-900">${p.retailPrice.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">+${monthly.toFixed(0)}/mo</p>
                      </div>
                      {!presentationMode && (
                        <div className="text-right">
                          <p className="text-xs font-semibold text-emerald-600">GP ${profit.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400">{p.penetrationRate}% pen</p>
                        </div>
                      )}
                    </div>
                    {p.deductible !== undefined && <p className="text-[10px] text-slate-400 mt-1">${p.deductible} deductible</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* COMPARISON */}
        <TabsContent value="compare" className="mt-0">
          <Card className="border-slate-200/60 rounded-xl overflow-hidden">
            <div className="overflow-x-hidden">
              <div className="space-y-1 p-3">
                {/* Header row */}
                <div className="grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-500 pb-2 border-b border-slate-100 px-2">
                  <div className="col-span-4">Product</div>
                  <div className="col-span-2">Term</div>
                  <div className="col-span-2 text-right">Price</div>
                  {!presentationMode && <div className="col-span-2 text-right">Profit</div>}
                  {!presentationMode && <div className="col-span-1 text-right">Pen%</div>}
                  <div className={cn("text-center", presentationMode ? "col-span-4" : "col-span-1")}>Inc</div>
                </div>
                {/* Rows */}
                {products.map(p => {
                  const active = activeProducts.includes(p.id);
                  return (
                    <div key={p.id} className={cn("grid grid-cols-12 gap-2 items-center py-2 px-2 rounded-lg text-xs", active && "bg-indigo-50/40")}>
                      <div className="col-span-4 min-w-0">
                        <p className="font-medium text-slate-800 truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-400 truncate">{p.provider}</p>
                      </div>
                      <div className="col-span-2 text-slate-500 truncate text-[11px]">{p.term}</div>
                      <div className="col-span-2 text-right">
                        <p className="font-medium text-slate-800">${p.retailPrice.toLocaleString()}</p>
                        <p className="text-[10px] text-slate-400">+${calcMonthly(p.retailPrice).toFixed(0)}/mo</p>
                      </div>
                      {!presentationMode && <div className="col-span-2 text-right font-medium text-emerald-600">${(p.retailPrice - p.dealerCost).toLocaleString()}</div>}
                      {!presentationMode && <div className="col-span-1 text-right text-slate-500">{p.penetrationRate}%</div>}
                      <div className={cn("text-center", presentationMode ? "col-span-4" : "col-span-1")}>
                        <button onClick={() => handleToggle(p.id)} className={cn("w-5 h-5 rounded border-2 flex items-center justify-center mx-auto", active ? "bg-indigo-600 border-indigo-600" : "border-slate-300 hover:border-indigo-400")}>
                          {active && <Check className="w-3 h-3 text-white" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
                {/* Footer */}
                <div className="grid grid-cols-12 gap-2 items-center pt-2 border-t border-slate-200 px-2 font-semibold text-xs">
                  <div className="col-span-4 text-slate-700">{activeProducts.length} Selected</div>
                  <div className="col-span-2"></div>
                  <div className="col-span-2 text-right text-slate-900">${totalRetail.toLocaleString()}</div>
                  {!presentationMode && <div className="col-span-2 text-right text-emerald-600">${totalProfit.toLocaleString()}</div>}
                  {!presentationMode && <div className="col-span-1"></div>}
                  <div className={cn(presentationMode ? "col-span-4" : "col-span-1")}></div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ANALYTICS (internal) */}
        {!presentationMode && (
          <TabsContent value="analytics" className="mt-0 space-y-4">
            <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {[
                { label: 'Avg F&I PVR (MTD)', value: '$2,847', change: '+12%', up: true },
                { label: 'VSC Penetration', value: '68%', change: '+4%', up: true },
                { label: 'GAP Penetration', value: '74%', change: '-2%', up: false },
                { label: 'Products/Deal', value: '3.2', change: '+0.3', up: true },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-200/60 bg-white">
                  <p className="text-[10px] text-slate-400 font-medium">{s.label}</p>
                  <div className="flex items-end gap-2 mt-1">
                    <p className="text-xl font-bold text-slate-900">{s.value}</p>
                    <span className={cn("text-[11px] font-medium mb-0.5", s.up ? "text-emerald-600" : "text-red-500")}>{s.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Penetration Chart */}
            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
              <div className="p-3.5 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-800">Product Penetration (30 Days)</h3>
              </div>
              <div className="p-3.5 space-y-2.5">
                {products.sort((a, b) => b.penetrationRate - a.penetrationRate).map(p => (
                  <div key={p.id} className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-600 w-32 truncate">{p.name}</span>
                    <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${p.penetrationRate}%` }} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-700 w-10 text-right">{p.penetrationRate}%</span>
                    <span className="text-[11px] text-emerald-600 w-14 text-right">${(p.retailPrice - p.dealerCost).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Chargebacks & Reserve */}
            <div className="grid sm:grid-cols-2 gap-3">
              <Card className="border-slate-200/60 rounded-xl p-3.5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Chargebacks (MTD)</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">VSC Cancellations</span><span className="text-red-600 font-medium">2 ($1,450)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">GAP Cancellations</span><span className="text-red-600 font-medium">1 ($295)</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Flat Cancel Refunds</span><span className="text-red-600 font-medium">$0</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-100"><span className="font-medium text-slate-700">Total</span><span className="font-semibold text-red-600">$1,745</span></div>
                </div>
              </Card>
              <Card className="border-slate-200/60 rounded-xl p-3.5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Reserve Income (MTD)</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-slate-500">Deals with Reserve</span><span className="font-medium text-slate-800">18 / 24</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Avg Reserve/Deal</span><span className="font-medium text-slate-800">$412</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Avg Markup (bps)</span><span className="font-medium text-slate-800">180 bps</span></div>
                  <div className="flex justify-between pt-2 border-t border-slate-100"><span className="font-medium text-slate-700">Total Reserve</span><span className="font-semibold text-emerald-600">$7,416</span></div>
                </div>
              </Card>
            </div>

            {/* Deal-level tracking */}
            <Card className="border-slate-200/60 rounded-xl p-3.5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Deals — F&I Performance</h3>
              <div className="space-y-2">
                {deals.slice(0, 5).map(d => (
                  <div key={d.id} className="flex items-center justify-between text-xs p-2 rounded-lg border border-slate-100">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{d.customer} — {d.vehicle}</p>
                      <p className="text-[10px] text-slate-400">{d.lender} • {d.type} • {d.status}</p>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <p className="font-semibold text-emerald-600">${(d.backGross || 0).toLocaleString()}</p>
                      <p className="text-[10px] text-slate-400">back gross</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
