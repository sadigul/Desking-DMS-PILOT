"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Calculator, Printer, Save, Search, Car, X,
  CheckCircle2, UserPlus, ArrowRight,
  Check, Send, Sparkles, DollarSign, FileText,
  TrendingUp, AlertTriangle, Clock, CreditCard,
  Building2, Percent, Eye,
  Zap, Target, Shield, Lock, Users, Package, History,
  ArrowUpRight, Activity, CircleDot
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, Vehicle, Deal, Customer } from "@/store/appStore";
import { cn } from "@/lib/utils";

export default function DeskingModule() {
  return (
    <Suspense fallback={<div className="p-20 text-center text-slate-400 text-sm">Loading deal workbench...</div>}>
      <DeskingContent />
    </Suspense>
  );
}

// ─── TYPES ──────────────────────────────────────────────────────────────
type Rebate = { id: string; name: string; amount: number; type: string; stackable: boolean; };
type FeeItem = { id: string; name: string; amount: number; taxable: boolean; };
type LenderProgram = { id: string; name: string; buyRate: number; maxAdvance: number; maxTerm: number; minScore: number; flatFee: number; tier: string; hasReserve: boolean; };
type Stip = { id: string; label: string; status: 'Pending' | 'Received' | 'Waived'; };
type DealLog = { id: string; action: string; timestamp: string; user: string; };

// ─── MAIN ───────────────────────────────────────────────────────────────
function DeskingContent() {
  const router = useRouter();
  const { inventory, addDeal, customers, deals, updateVehicleStatus } = useAppStore();
  const searchParams = useSearchParams();

  // State
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isCustomerOpen, setIsCustomerOpen] = useState(false);
  const [dealType, setDealType] = useState<'Finance' | 'Lease' | 'Cash'>('Finance');
  const [searchQuery, setSearchQuery] = useState("");
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterMake, setFilterMake] = useState("");
  const [filterModel, setFilterModel] = useState("");
  const [filterTrim, setFilterTrim] = useState("");
  const [activeTab, setActiveTab] = useState("pricing");

  // Pricing
  const [sellingPrice, setSellingPrice] = useState(0);
  const [invoice, setInvoice] = useState(0);
  const [holdback, setHoldback] = useState(0);
  const [pack, setPack] = useState(500);

  // Trade
  const [tradeYear, setTradeYear] = useState("");
  const [tradeMake, setTradeMake] = useState("");
  const [tradeModel, setTradeModel] = useState("");
  const [tradeVin, setTradeVin] = useState("");
  const [tradeMileage, setTradeMileage] = useState(0);
  const [tradeAcv, setTradeAcv] = useState(0);
  const [tradeAllowance, setTradeAllowance] = useState(0);
  const [tradePayoff, setTradePayoff] = useState(0);
  const [tradePayoffLender, setTradePayoffLender] = useState("");
  const [tradePayoffGoodThru, setTradePayoffGoodThru] = useState("");
  const [tradeCondition, setTradeCondition] = useState<'Excellent' | 'Good' | 'Fair' | 'Poor'>('Good');

  // Down Payment
  const [cashDown, setCashDown] = useState(2000);
  const [deferredDown, setDeferredDown] = useState(0);
  const [deferredDueDate, setDeferredDueDate] = useState("");

  // Finance
  const [term, setTerm] = useState(72);
  const [sellRate, setSellRate] = useState(6.49);
  const [buyRate, setBuyRate] = useState(4.29);
  const [selectedLender, setSelectedLender] = useState("");
  const [creditTier, setCreditTier] = useState<Deal['creditTier']>("Prime");
  const [approvalNumber, setApprovalNumber] = useState("");
  const [approvalAmount, setApprovalAmount] = useState(0);

  // Lease
  const [residualPct, setResidualPct] = useState(58);
  const [moneyFactor, setMoneyFactor] = useState(0.00225);
  const [mileageLimit, setMileageLimit] = useState(12000);
  const [acqFee, setAcqFee] = useState(695);

  // Fees
  const [fees, setFees] = useState<FeeItem[]>([
    { id: 'doc', name: 'Doc Fee', amount: 899, taxable: false },
    { id: 'title', name: 'Title & Registration', amount: 425, taxable: false },
    { id: 'electronic', name: 'Electronic Filing', amount: 199, taxable: false },
    { id: 'inspection', name: 'State Inspection', amount: 89, taxable: false },
    { id: 'plate', name: 'Plate Transfer', amount: 0, taxable: false },
    { id: 'emissions', name: 'Emissions Test', amount: 35, taxable: false },
  ]);
  const [taxRate, setTaxRate] = useState(7.25);
  const [taxOnTrade, setTaxOnTrade] = useState(true);

  // Rebates
  const [rebates] = useState<Rebate[]>([
    { id: 'r1', name: 'Customer Cash', amount: 1500, type: 'Manufacturer', stackable: true },
    { id: 'r2', name: 'Loyalty Bonus', amount: 750, type: 'Loyalty', stackable: true },
    { id: 'r3', name: 'Military Discount', amount: 500, type: 'Military', stackable: true },
    { id: 'r4', name: 'College Grad', amount: 400, type: 'College Grad', stackable: true },
    { id: 'r5', name: 'Conquest Bonus', amount: 1000, type: 'Manufacturer', stackable: false },
  ]);
  const [activeRebateIds, setActiveRebateIds] = useState<string[]>([]);

  // Products
  const [activeProductIds, setActiveProductIds] = useState<string[]>(['vsc-1', 'gap-1']);
  const fiProducts = [
    { id: 'vsc-1', name: 'Vehicle Service Contract', price: 2895, cost: 1200, term: '7yr/100k', provider: 'EasyCare' },
    { id: 'gap-1', name: 'GAP Waiver', price: 995, cost: 295, term: 'Loan Term', provider: 'Protective' },
    { id: 'tw-1', name: 'Tire & Wheel', price: 899, cost: 320, term: '5yr/60k', provider: 'Road Vantage' },
    { id: 'paint-1', name: 'Paint Protection', price: 699, cost: 150, term: '7yr', provider: 'Perma-Plate' },
    { id: 'maint-1', name: 'Prepaid Maintenance', price: 1295, cost: 650, term: '3yr/36k', provider: 'Dealer-Owned' },
    { id: 'theft-1', name: 'Theft Deterrent', price: 399, cost: 95, term: 'Lifetime', provider: 'Etch Master' },
    { id: 'key-1', name: 'Key Replacement', price: 499, cost: 110, term: '5yr', provider: 'Protective' },
    { id: 'dent-1', name: 'Dent & Ding', price: 599, cost: 180, term: '5yr', provider: 'Dent Wizard' },
  ];

  // Lenders
  const lenderPrograms: LenderProgram[] = [
    { id: 'l1', name: 'Chase Auto', buyRate: 4.29, maxAdvance: 130, maxTerm: 84, minScore: 680, flatFee: 150, tier: 'A+/A', hasReserve: false },
    { id: 'l2', name: 'Ally Financial', buyRate: 4.99, maxAdvance: 140, maxTerm: 84, minScore: 640, flatFee: 0, tier: 'A/B', hasReserve: true },
    { id: 'l3', name: 'Capital One', buyRate: 3.99, maxAdvance: 125, maxTerm: 72, minScore: 720, flatFee: 75, tier: 'A+', hasReserve: false },
    { id: 'l4', name: 'Ford Motor Credit', buyRate: 5.49, maxAdvance: 150, maxTerm: 84, minScore: 600, flatFee: 0, tier: 'A/B/C', hasReserve: true },
    { id: 'l5', name: 'Westlake Financial', buyRate: 9.99, maxAdvance: 120, maxTerm: 72, minScore: 500, flatFee: 595, tier: 'C/D', hasReserve: false },
    { id: 'l6', name: 'Credit Union Direct', buyRate: 3.49, maxAdvance: 110, maxTerm: 72, minScore: 740, flatFee: 0, tier: 'A+', hasReserve: false },
    { id: 'l7', name: 'US Bank', buyRate: 4.49, maxAdvance: 135, maxTerm: 84, minScore: 700, flatFee: 100, tier: 'A+/A', hasReserve: true },
    { id: 'l8', name: 'TD Auto Finance', buyRate: 5.19, maxAdvance: 145, maxTerm: 84, minScore: 620, flatFee: 0, tier: 'A/B/C', hasReserve: false },
  ];

  // Stips
  const [stips, setStips] = useState<Stip[]>([
    { id: 'st1', label: 'Proof of Income (2 recent paystubs)', status: 'Pending' },
    { id: 'st2', label: 'Proof of Residence (utility bill)', status: 'Pending' },
    { id: 'st3', label: 'Valid Driver License (front & back)', status: 'Received' },
    { id: 'st4', label: 'Insurance Binder', status: 'Pending' },
    { id: 'st5', label: 'References (3 personal)', status: 'Pending' },
  ]);

  // Activity
  const [dealLog, setDealLog] = useState<DealLog[]>([
    { id: 'log1', action: 'Deal created', timestamp: new Date().toLocaleString(), user: 'System' },
  ]);
  const [dealNotes, setDealNotes] = useState("");
  const [dealStatus, setDealStatus] = useState<'Draft' | 'Desking' | 'Submitted' | 'Approved' | 'Contracting'>('Desking');
  const [cobuyer, setCobuyer] = useState("");

  // ═══ CALCULATIONS ══════════════════════════════════════════════════════
  const totalRebates = activeRebateIds.reduce((s, id) => s + (rebates.find(r => r.id === id)?.amount || 0), 0);
  const totalFees = fees.reduce((s, f) => s + f.amount, 0);
  const fiProductTotal = activeProductIds.reduce((s, id) => s + (fiProducts.find(p => p.id === id)?.price || 0), 0);
  const fiProfit = activeProductIds.reduce((s, id) => { const p = fiProducts.find(x => x.id === id); return s + ((p?.price || 0) - (p?.cost || 0)); }, 0);
  const netTrade = tradeAllowance - tradePayoff;
  const taxableAmount = taxOnTrade ? Math.max(0, sellingPrice - tradeAllowance) : sellingPrice;
  const salesTax = taxableAmount * (taxRate / 100);
  const taxableFees = fees.filter(f => f.taxable).reduce((s, f) => s + f.amount, 0);
  const totalTax = salesTax + taxableFees * (taxRate / 100);
  const totalDue = sellingPrice + totalFees + totalTax + fiProductTotal - totalRebates - netTrade;
  const amountFinanced = totalDue - cashDown - deferredDown;

  const calcPayment = (principal: number, rate: number, months: number) => {
    if (principal <= 0) return 0;
    const r = rate / 100 / 12;
    if (r === 0) return principal / months;
    return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  };

  const monthlyPayment = calcPayment(amountFinanced, sellRate, term);
  const bankPayment = calcPayment(amountFinanced, buyRate, term);
  const residualAmount = (selectedVehicle?.msrp || sellingPrice) * (residualPct / 100);
  const leasePayment = ((amountFinanced - residualAmount + acqFee) / term) + ((amountFinanced + residualAmount) * moneyFactor);
  const displayPayment = dealType === 'Finance' ? monthlyPayment : dealType === 'Lease' ? leasePayment : 0;

  const frontGross = sellingPrice - invoice - pack + totalRebates - (tradeAllowance - tradeAcv);
  const reserveProfit = dealType === 'Finance' ? Math.max(0, (monthlyPayment - bankPayment) * term) : 0;
  const backGross = fiProfit + reserveProfit;
  const totalGross = frontGross + backGross;

  const ltv = sellingPrice > 0 ? ((amountFinanced / (selectedVehicle?.msrp || sellingPrice)) * 100) : 0;
  const pti = monthlyPayment > 0 ? ((monthlyPayment / 5500) * 100) : 0;
  const maxMarkup = creditTier === 'Elite' || creditTier === 'Prime' ? 2.5 : 2.0;
  const actualMarkup = sellRate - buyRate;
  const markupCompliant = actualMarkup <= maxMarkup;

  const customerDeals = useMemo(() => {
    if (!selectedCustomer) return [];
    return deals.filter(d => d.customer === selectedCustomer.name);
  }, [selectedCustomer, deals]);

  // ═══ FILTERS ═══════════════════════════════════════════════════════════
  const availableYears = useMemo(() => [...new Set(inventory.map(v => v.year))].sort((a, b) => b - a), [inventory]);
  const availableMakes = useMemo(() => {
    const f = filterYear ? inventory.filter(v => v.year === Number(filterYear)) : inventory;
    return [...new Set(f.map(v => v.make))].sort();
  }, [inventory, filterYear]);
  const availableModels = useMemo(() => {
    let f = inventory;
    if (filterYear) f = f.filter(v => v.year === Number(filterYear));
    if (filterMake) f = f.filter(v => v.make === filterMake);
    return [...new Set(f.map(v => v.model))].sort();
  }, [inventory, filterYear, filterMake]);
  const availableTrims = useMemo(() => {
    let f = inventory;
    if (filterYear) f = f.filter(v => v.year === Number(filterYear));
    if (filterMake) f = f.filter(v => v.make === filterMake);
    if (filterModel) f = f.filter(v => v.model === filterModel);
    return [...new Set(f.map(v => v.trim))].sort();
  }, [inventory, filterYear, filterMake, filterModel]);

  const filteredInventory = useMemo(() => {
    let r = inventory.filter(v => v.status === 'In Stock');
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      r = r.filter(v => v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) || v.vin.toLowerCase().includes(q) || v.trim.toLowerCase().includes(q) || String(v.year).includes(q));
    }
    if (filterYear) r = r.filter(v => v.year === Number(filterYear));
    if (filterMake) r = r.filter(v => v.make === filterMake);
    if (filterModel) r = r.filter(v => v.model === filterModel);
    if (filterTrim) r = r.filter(v => v.trim === filterTrim);
    return r;
  }, [inventory, searchQuery, filterYear, filterMake, filterModel, filterTrim]);

  const filteredCustomers = useMemo(() => customers.filter(c =>
    c.name.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(customerSearchQuery.toLowerCase()) ||
    c.phone.includes(customerSearchQuery)
  ), [customers, customerSearchQuery]);

  const qualifiedLenders = useMemo(() => {
    const score = selectedCustomer?.creditScore || 700;
    return lenderPrograms.filter(l => score >= l.minScore);
  }, [selectedCustomer]);

  // ═══ HANDLERS ═══════════════════════════════════════════════════════════
  const addLog = (action: string) => setDealLog(prev => [{ id: `log-${Date.now()}`, action, timestamp: new Date().toLocaleString(), user: 'F&I Manager' }, ...prev]);

  const handleSelectVehicle = (v: Vehicle) => {
    setSelectedVehicle(v);
    setSellingPrice(v.msrp);
    setInvoice(v.invoice);
    setHoldback(Math.floor(v.msrp * 0.03));
    setPack(v.pack);
    setIsInventoryOpen(false);
    addLog(`Vehicle: ${v.year} ${v.make} ${v.model} (${v.vin.slice(-8)})`);
  };

  const handleSelectCustomer = (c: Customer) => {
    setSelectedCustomer(c);
    setCreditTier(c.creditScore >= 740 ? "Elite" : c.creditScore >= 680 ? "Prime" : c.creditScore >= 600 ? "Sub-Prime" : "Deep-Sub");
    setIsCustomerOpen(false);
    addLog(`Customer: ${c.name} (${c.creditScore} FICO)`);
  };

  const handleSaveDeal = () => {
    if (!selectedVehicle || !selectedCustomer) return;
    const newDeal: Deal = {
      id: `D-${Date.now().toString().slice(-5)}`,
      customer: selectedCustomer.name,
      vehicle: `${selectedVehicle.year} ${selectedVehicle.make} ${selectedVehicle.model}`,
      amount: amountFinanced, status: 'Pending', lender: selectedLender || 'Unassigned',
      daysOpen: 0, fiManager: 'Current User', frontGross, backGross, creditTier,
      docStatus: 'Incomplete', type: dealType, term, apr: sellRate, downPayment: cashDown,
      tradeInValue: tradeAllowance, tradeInPayoff: tradePayoff, rebates: totalRebates,
      residualValue: dealType === 'Lease' ? residualPct / 100 : undefined,
      moneyFactor: dealType === 'Lease' ? moneyFactor : undefined,
      products: activeProductIds.map(id => { const p = fiProducts.find(x => x.id === id)!; return { id, name: p.name, price: p.price, cost: p.cost, type: 'Protection' as const, active: true }; }),
      eContractingStatus: 'Not Started', digitalDealJackets: []
    };
    addDeal(newDeal);
    updateVehicleStatus(selectedVehicle.id, 'Sold');
    addLog('Deal saved to pipeline');
    setDealStatus('Submitted');
  };

  useEffect(() => {
    const vid = searchParams.get('vehicleId');
    const cid = searchParams.get('customerId');
    if (vid) { const v = inventory.find(i => i.id === vid); if (v) handleSelectVehicle(v); }
    if (cid) { const c = customers.find(i => i.id === cid); if (c) handleSelectCustomer(c); }
  }, []);

  const daysColor = (d: number) => d > 60 ? 'text-red-600' : d > 30 ? 'text-amber-600' : 'text-emerald-600';

  // ═══ RENDER ═════════════════════════════════════════════════════════════
  return (
    <div className="space-y-4 pb-20 max-w-full overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Deal Workbench</h1>
            <p className="text-xs text-slate-500 mt-0.5">End-to-end deal structuring & lifecycle management</p>
          </div>
          <Badge className={cn("text-[10px] h-5", dealStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : dealStatus === 'Submitted' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600')}>{dealStatus}</Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 p-0.5 rounded-lg flex border border-slate-200/60">
            {['Finance', 'Lease', 'Cash'].map(t => (
              <button key={t} onClick={() => { setDealType(t as any); addLog(`Type → ${t}`); }} className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-all", dealType === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}>{t}</button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/fi-menu')} className="text-xs h-8 rounded-lg gap-1.5"><Package className="w-3.5 h-3.5" />F&I Menu</Button>
          <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5"><Printer className="w-3.5 h-3.5" />Print</Button>
          <Button size="sm" onClick={handleSaveDeal} disabled={!selectedVehicle || !selectedCustomer} className="text-xs h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 gap-1.5 disabled:opacity-50"><Save className="w-3.5 h-3.5" />Save Deal</Button>
        </div>
      </div>

      {/* COMPLIANCE */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
        <CBar icon={<TrendingUp className="w-3.5 h-3.5" />} label={`LTV ${ltv.toFixed(0)}%`} status={ltv > 120 ? 'danger' : ltv > 100 ? 'warn' : 'ok'} />
        <CBar icon={<Percent className="w-3.5 h-3.5" />} label={`PTI ${pti.toFixed(1)}%`} status={pti > 20 ? 'danger' : pti > 15 ? 'warn' : 'ok'} />
        <CBar icon={<Shield className="w-3.5 h-3.5" />} label={`Rate Spread ${actualMarkup.toFixed(2)}%`} status={!markupCompliant ? 'danger' : 'ok'} />
        <CBar icon={<FileText className="w-3.5 h-3.5" />} label={`Stips ${stips.filter(s => s.status === 'Received').length}/${stips.length}`} status={stips.every(s => s.status !== 'Pending') ? 'ok' : 'warn'} />
        <CBar icon={<Activity className="w-3.5 h-3.5" />} label={`Products ${activeProductIds.length}`} status="ok" />
      </div>

      {/* MAIN */}
      <div className="grid xl:grid-cols-12 gap-4">
        {/* LEFT 8 */}
        <div className="xl:col-span-8 space-y-4 min-w-0 overflow-hidden">
          {/* CUSTOMER + VEHICLE */}
          <div className="grid lg:grid-cols-2 gap-3">
            {/* Customer */}
            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
              <div className="p-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-400" />Customer</span>
                <Button variant="ghost" size="sm" onClick={() => setIsCustomerOpen(!isCustomerOpen)} className="text-[11px] h-6 px-2">{selectedCustomer ? 'Change' : 'Select'}</Button>
              </div>
              <AnimatePresence>
                {isCustomerOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-b border-slate-100">
                    <div className="p-2.5 space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input placeholder="Name, email, phone..." value={customerSearchQuery} onChange={(e) => setCustomerSearchQuery(e.target.value)} className="h-8 pl-8 text-xs rounded-lg" />
                      </div>
                      <div className="max-h-36 overflow-y-auto divide-y divide-slate-50 rounded-lg border border-slate-100">
                        {filteredCustomers.map(c => (
                          <div key={c.id} onClick={() => handleSelectCustomer(c)} className="px-2.5 py-2 flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer text-xs">
                            <div className="min-w-0 truncate"><span className="font-medium text-slate-800">{c.name}</span><span className="text-slate-400 ml-2">{c.phone}</span></div>
                            <Badge variant="outline" className="text-[10px] h-5 shrink-0 ml-2">{c.creditScore}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {selectedCustomer ? (
                <div className="p-2.5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white text-[11px] font-semibold shrink-0">{selectedCustomer.name.split(' ').map((n: string) => n[0]).join('')}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{selectedCustomer.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{selectedCustomer.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={cn("text-[10px]", creditTier === 'Elite' ? 'bg-emerald-100 text-emerald-700' : creditTier === 'Prime' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700')}>{creditTier}</Badge>
                      <p className="text-[10px] text-slate-400 mt-0.5">{selectedCustomer.creditScore}</p>
                    </div>
                  </div>
                  {customerDeals.length > 0 && (
                    <div className="p-1.5 rounded-md bg-blue-50 border border-blue-100 text-[10px] text-blue-700 flex items-center gap-1.5">
                      <History className="w-3 h-3 shrink-0" />{customerDeals.length} prior deal(s) — Last: {customerDeals[0]?.vehicle}
                    </div>
                  )}
                  <Input placeholder="Co-Buyer (optional)" value={cobuyer} onChange={(e) => setCobuyer(e.target.value)} className="h-7 text-[11px] rounded-md" />
                </div>
              ) : (
                <div className="p-5 text-center"><UserPlus className="w-5 h-5 text-slate-300 mx-auto mb-1" /><p className="text-xs text-slate-400">Select customer</p></div>
              )}
            </Card>

            {/* Vehicle */}
            <Card className="border-slate-200/60 rounded-xl overflow-hidden">
              <div className="p-2.5 flex items-center justify-between border-b border-slate-100 bg-slate-50/50">
                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-slate-400" />Vehicle</span>
                <Button variant="ghost" size="sm" onClick={() => setIsInventoryOpen(!isInventoryOpen)} className="text-[11px] h-6 px-2">{selectedVehicle ? 'Change' : 'Search'}</Button>
              </div>
              <AnimatePresence>
                {isInventoryOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden border-b border-slate-100">
                    <div className="p-2.5 space-y-2">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <Input placeholder="VIN, year, make, model..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 pl-8 text-xs rounded-lg" />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <Select value={filterYear} onValueChange={(v) => { setFilterYear(v === 'all' ? '' : v); setFilterMake(''); setFilterModel(''); setFilterTrim(''); }}>
                          <SelectTrigger className="h-7 text-[11px] rounded-md"><SelectValue placeholder="Year" /></SelectTrigger>
                          <SelectContent><SelectItem value="all">All Years</SelectItem>{availableYears.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={filterMake} onValueChange={(v) => { setFilterMake(v === 'all' ? '' : v); setFilterModel(''); setFilterTrim(''); }}>
                          <SelectTrigger className="h-7 text-[11px] rounded-md"><SelectValue placeholder="Make" /></SelectTrigger>
                          <SelectContent><SelectItem value="all">All Makes</SelectItem>{availableMakes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={filterModel} onValueChange={(v) => { setFilterModel(v === 'all' ? '' : v); setFilterTrim(''); }}>
                          <SelectTrigger className="h-7 text-[11px] rounded-md"><SelectValue placeholder="Model" /></SelectTrigger>
                          <SelectContent><SelectItem value="all">All Models</SelectItem>{availableModels.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                        </Select>
                        <Select value={filterTrim} onValueChange={(v) => setFilterTrim(v === 'all' ? '' : v)}>
                          <SelectTrigger className="h-7 text-[11px] rounded-md"><SelectValue placeholder="Trim" /></SelectTrigger>
                          <SelectContent><SelectItem value="all">All Trims</SelectItem>{availableTrims.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      {(filterYear || filterMake || filterModel || filterTrim) && (
                        <button onClick={() => { setFilterYear(''); setFilterMake(''); setFilterModel(''); setFilterTrim(''); }} className="text-[10px] text-indigo-600 font-medium">Clear filters</button>
                      )}
                      <div className="max-h-36 overflow-y-auto divide-y divide-slate-50 rounded-lg border border-slate-100">
                        {filteredInventory.length === 0 && <div className="px-3 py-3 text-center text-[11px] text-slate-400">No vehicles match</div>}
                        {filteredInventory.slice(0, 10).map(v => (
                          <div key={v.id} onClick={() => handleSelectVehicle(v)} className="px-2.5 py-2 flex items-center justify-between hover:bg-indigo-50/50 cursor-pointer text-xs">
                            <div className="min-w-0 truncate"><span className="font-medium text-slate-800">{v.year} {v.make} {v.model}</span><span className="text-slate-400 ml-1">{v.trim}</span></div>
                            <div className="shrink-0 ml-2 text-right">
                              <span className="font-semibold text-slate-700">${v.msrp.toLocaleString()}</span>
                              <span className={cn("ml-1.5 text-[10px]", daysColor(v.daysInStock))}>{v.daysInStock}d</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400">{filteredInventory.length} in stock</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {selectedVehicle ? (
                <div className="p-2.5 space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0"><Car className="w-4 h-4 text-indigo-600" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}</p>
                      <p className="text-[11px] text-slate-400 truncate">{selectedVehicle.trim} • {selectedVehicle.color} • {selectedVehicle.stockType} • ...{selectedVehicle.vin.slice(-8)}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">${selectedVehicle.msrp.toLocaleString()}</p>
                      <p className={cn("text-[10px]", daysColor(selectedVehicle.daysInStock))}>{selectedVehicle.daysInStock}d lot</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    <MiniStat label="MSRP" val={`$${(selectedVehicle.msrp / 1000).toFixed(0)}k`} />
                    <MiniStat label="Invoice" val={`$${(selectedVehicle.invoice / 1000).toFixed(0)}k`} />
                    <MiniStat label="Pack" val={`$${selectedVehicle.pack}`} />
                    <MiniStat label="Miles" val={selectedVehicle.mileage ? `${(selectedVehicle.mileage / 1000).toFixed(0)}k` : 'New'} />
                  </div>
                </div>
              ) : (
                <div className="p-5 text-center"><Car className="w-5 h-5 text-slate-300 mx-auto mb-1" /><p className="text-xs text-slate-400">Select vehicle</p></div>
              )}
            </Card>
          </div>

          {/* TABS */}
          <Card className="border-slate-200/60 rounded-xl overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b border-slate-100 bg-slate-50/50 px-2.5 py-2">
                <div className="flex gap-1 flex-wrap">
                  {[
                    { v: 'pricing', l: 'Pricing' }, { v: 'trade', l: 'Trade-In' },
                    { v: 'rates', l: 'Rates' }, { v: 'fees', l: 'Fees' },
                    { v: 'products', l: 'Products' }, { v: 'stips', l: 'Stips' }, { v: 'log', l: 'Activity' },
                  ].map(t => (
                    <button key={t.v} onClick={() => setActiveTab(t.v)} className={cn("px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-all whitespace-nowrap", activeTab === t.v ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100")}>{t.l}</button>
                  ))}
                </div>
              </div>

              {/* PRICING */}
              <TabsContent value="pricing" className="m-0 p-4 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <NumInput label="Selling Price" prefix="$" value={sellingPrice} onChange={setSellingPrice} highlight />
                  <NumInput label="Invoice" prefix="$" value={invoice} onChange={setInvoice} />
                  <NumInput label="Holdback" prefix="$" value={holdback} onChange={setHoldback} />
                  <NumInput label="Pack" prefix="$" value={pack} onChange={setPack} />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <NumInput label="Cash Down" prefix="$" value={cashDown} onChange={setCashDown} />
                  <NumInput label="Deferred Down" prefix="$" value={deferredDown} onChange={setDeferredDown} />
                  {deferredDown > 0 && (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-500">Due Date</label>
                      <Input type="date" value={deferredDueDate} onChange={(e) => setDeferredDueDate(e.target.value)} className="h-9 text-xs rounded-lg" />
                    </div>
                  )}
                </div>

                {/* Rebates */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center gap-1.5"><Zap className="w-3 h-3 text-amber-500" />Rebates & Incentives ({activeRebateIds.length} active = -${totalRebates.toLocaleString()})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {rebates.map(r => {
                      const active = activeRebateIds.includes(r.id);
                      return (
                        <div key={r.id} onClick={() => setActiveRebateIds(prev => active ? prev.filter(x => x !== r.id) : [...prev, r.id])} className={cn("p-2 rounded-lg border cursor-pointer transition-all text-xs", active ? "border-emerald-300 bg-emerald-50" : "border-slate-200/60 hover:border-slate-300")}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-slate-800 truncate">{r.name}</span>
                            <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0", active ? "bg-emerald-600 border-emerald-600" : "border-slate-300")}>{active && <Check className="w-2.5 h-2.5 text-white" />}</div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-[10px] text-slate-400">{r.type}{!r.stackable ? ' • Non-stack' : ''}</span>
                            <span className="font-semibold text-emerald-600">-${r.amount.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Scenarios */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-600 mb-2 flex items-center gap-1.5"><Target className="w-3 h-3 text-indigo-500" />Payment Scenarios</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { label: 'Aggressive', term: 60, rate: 5.49, down: 3000 },
                      { label: 'Standard', term: 72, rate: 6.49, down: 2000 },
                      { label: 'Stretched', term: 84, rate: 7.49, down: 1000 },
                    ].map(s => {
                      const pmt = calcPayment(amountFinanced - s.down + cashDown, s.rate, s.term);
                      return (
                        <div key={s.label} onClick={() => { setTerm(s.term); setSellRate(s.rate); setCashDown(s.down); addLog(`Scenario: ${s.label}`); }} className="p-3 rounded-lg border border-slate-200/60 hover:border-indigo-300 cursor-pointer group">
                          <p className="text-[10px] font-medium text-slate-400">{s.label}</p>
                          <p className="text-lg font-bold text-slate-900 group-hover:text-indigo-600">${pmt.toFixed(0)}<span className="text-xs font-normal text-slate-400">/mo</span></p>
                          <p className="text-[10px] text-slate-400">{s.term}mo • {s.rate}% • ${s.down.toLocaleString()} dn</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              {/* TRADE */}
              <TabsContent value="trade" className="m-0 p-4 space-y-4">
                <p className="text-[11px] font-semibold text-slate-600">Trade-In Vehicle</p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">Year</label><Input value={tradeYear} onChange={(e) => setTradeYear(e.target.value)} className="h-9 text-xs rounded-lg" placeholder="2020" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">Make</label><Input value={tradeMake} onChange={(e) => setTradeMake(e.target.value)} className="h-9 text-xs rounded-lg" placeholder="Toyota" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">Model</label><Input value={tradeModel} onChange={(e) => setTradeModel(e.target.value)} className="h-9 text-xs rounded-lg" placeholder="Camry" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">VIN</label><Input value={tradeVin} onChange={(e) => setTradeVin(e.target.value)} className="h-9 text-xs rounded-lg" placeholder="1HGCM..." /></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <NumInput label="Mileage" value={tradeMileage} onChange={setTradeMileage} suffix="mi" />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-500">Condition</label>
                    <Select value={tradeCondition} onValueChange={(v) => setTradeCondition(v as any)}>
                      <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Excellent">Excellent</SelectItem><SelectItem value="Good">Good</SelectItem><SelectItem value="Fair">Fair</SelectItem><SelectItem value="Poor">Poor</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <NumInput label="ACV" prefix="$" value={tradeAcv} onChange={setTradeAcv} />
                  <NumInput label="Allowance" prefix="$" value={tradeAllowance} onChange={setTradeAllowance} />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <NumInput label="Payoff" prefix="$" value={tradePayoff} onChange={setTradePayoff} />
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">Payoff Lender</label><Input value={tradePayoffLender} onChange={(e) => setTradePayoffLender(e.target.value)} className="h-9 text-xs rounded-lg" placeholder="Chase" /></div>
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">Good Through</label><Input type="date" value={tradePayoffGoodThru} onChange={(e) => setTradePayoffGoodThru(e.target.value)} className="h-9 text-xs rounded-lg" /></div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 pt-3 border-t border-slate-100">
                  <StatBox label="Net Trade" value={netTrade} colored />
                  <StatBox label="Equity" value={tradeAcv - tradePayoff} colored />
                  <StatBox label="Over-Allow" value={tradeAllowance - tradeAcv} colored reverse />
                  <StatBox label="Tax Savings" value={Math.floor(tradeAllowance * taxRate / 100)} green />
                </div>
              </TabsContent>

              {/* RATES */}
              <TabsContent value="rates" className="m-0 p-4 space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <NumInput label="Sell Rate" suffix="%" value={sellRate} onChange={setSellRate} step={0.01} />
                  <NumInput label="Buy Rate" suffix="%" value={buyRate} onChange={setBuyRate} step={0.01} />
                  <NumInput label="Term" suffix="mo" value={term} onChange={setTerm} />
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-slate-500">Credit Tier</label>
                    <Select value={creditTier} onValueChange={(v) => setCreditTier(v as Deal['creditTier'])}>
                      <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Elite">Elite (740+)</SelectItem><SelectItem value="Prime">Prime (680-739)</SelectItem><SelectItem value="Sub-Prime">Sub-Prime (600-679)</SelectItem><SelectItem value="Deep-Sub">Deep Sub (&lt;600)</SelectItem></SelectContent>
                    </Select>
                  </div>
                </div>
                {dealType === 'Lease' && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-3 rounded-lg bg-indigo-50 border border-indigo-100">
                    <NumInput label="Residual %" suffix="%" value={residualPct} onChange={setResidualPct} />
                    <NumInput label="Money Factor" value={moneyFactor} onChange={setMoneyFactor} step={0.0001} />
                    <NumInput label="Miles/Year" value={mileageLimit} onChange={setMileageLimit} />
                    <NumInput label="Acq Fee" prefix="$" value={acqFee} onChange={setAcqFee} />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><label className="text-[11px] font-medium text-slate-500">Approval #</label><Input value={approvalNumber} onChange={(e) => setApprovalNumber(e.target.value)} className="h-9 text-xs rounded-lg" placeholder="Auto-populated" /></div>
                  <NumInput label="Approved Amount" prefix="$" value={approvalAmount} onChange={setApprovalAmount} />
                </div>

                {/* Lenders */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5"><Building2 className="w-3 h-3" />Lenders ({qualifiedLenders.length} qualified)</p>
                  {lenderPrograms.map(l => {
                    const qualified = (selectedCustomer?.creditScore || 700) >= l.minScore;
                    const selected = selectedLender === l.name;
                    return (
                      <div key={l.id} className={cn("p-2.5 rounded-lg border flex items-center gap-2 text-xs transition-all", !qualified && "opacity-35", selected ? "border-indigo-300 bg-indigo-50/50" : "border-slate-200/60")}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-medium text-slate-800">{l.name}</span>
                            {l.hasReserve && <Badge className="text-[9px] h-4 bg-amber-100 text-amber-700 border-0">Reserve</Badge>}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{l.tier} • Buy {l.buyRate}% • Max {l.maxAdvance}%/{l.maxTerm}mo • Min {l.minScore}</p>
                        </div>
                        <Button size="sm" variant={selected ? "default" : "outline"} disabled={!qualified} onClick={() => { setSelectedLender(l.name); setBuyRate(l.buyRate); addLog(`Lender: ${l.name}`); }} className="h-6 text-[10px] px-2 rounded shrink-0">{selected ? 'Active' : 'Select'}</Button>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* FEES */}
              <TabsContent value="fees" className="m-0 p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <NumInput label="Tax Rate" suffix="%" value={taxRate} onChange={setTaxRate} step={0.01} />
                  <div className="flex items-end pb-2">
                    <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={taxOnTrade} onChange={(e) => setTaxOnTrade(e.target.checked)} className="rounded border-slate-300" />Tax credit on trade
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  {fees.map((f, i) => (
                    <div key={f.id} className="flex items-center gap-3 text-xs">
                      <span className="w-32 font-medium text-slate-700 truncate">{f.name}</span>
                      <Input type="number" value={f.amount} onChange={(e) => { const nf = [...fees]; nf[i].amount = Number(e.target.value); setFees(nf); }} className="h-7 w-20 text-xs rounded-md" />
                      <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer whitespace-nowrap">
                        <input type="checkbox" checked={f.taxable} onChange={(e) => { const nf = [...fees]; nf[i].taxable = e.target.checked; setFees(nf); }} className="rounded border-slate-300 w-3.5 h-3.5" />Taxable
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold text-slate-700">
                  <span>Total Fees: ${totalFees.toLocaleString()}</span>
                  <span>Tax: ${totalTax.toFixed(2)}</span>
                </div>
              </TabsContent>

              {/* PRODUCTS */}
              <TabsContent value="products" className="m-0 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-600">{activeProductIds.length} products • Retail: ${fiProductTotal.toLocaleString()} • GP: ${fiProfit.toLocaleString()}</p>
                  <Button size="sm" variant="outline" onClick={() => router.push('/fi-menu')} className="h-6 text-[10px] px-2 gap-1"><ArrowUpRight className="w-3 h-3" />Full Menu</Button>
                </div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {fiProducts.map(p => {
                    const active = activeProductIds.includes(p.id);
                    const impact = calcPayment(p.price, sellRate, term);
                    return (
                      <div key={p.id} onClick={() => setActiveProductIds(prev => active ? prev.filter(x => x !== p.id) : [...prev, p.id])} className={cn("p-2.5 rounded-lg border cursor-pointer transition-all", active ? "border-indigo-300 bg-indigo-50/30" : "border-slate-200/60 hover:border-slate-300")}>
                        <div className="flex items-start justify-between text-xs">
                          <div className="min-w-0"><p className="font-semibold text-slate-800 truncate">{p.name}</p><p className="text-[10px] text-slate-400">{p.provider} • {p.term}</p></div>
                          <div className={cn("w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2", active ? "bg-indigo-600 border-indigo-600" : "border-slate-300")}>{active && <Check className="w-2.5 h-2.5 text-white" />}</div>
                        </div>
                        <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-100 text-[11px]">
                          <span className="font-medium text-slate-700">${p.price.toLocaleString()}</span>
                          <span className="text-slate-400">+${impact.toFixed(0)}/mo</span>
                          <span className="text-emerald-600">GP ${(p.price - p.cost).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              {/* STIPS */}
              <TabsContent value="stips" className="m-0 p-4 space-y-3">
                <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5"><FileText className="w-3 h-3" />Stipulations</p>
                <div className="space-y-1.5">
                  {stips.map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-200/60 text-xs gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={cn("w-4 h-4 rounded-full flex items-center justify-center shrink-0", s.status === 'Received' ? "bg-emerald-100" : s.status === 'Waived' ? "bg-slate-100" : "bg-amber-100")}>
                          {s.status === 'Received' ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : s.status === 'Waived' ? <X className="w-2.5 h-2.5 text-slate-400" /> : <Clock className="w-2.5 h-2.5 text-amber-600" />}
                        </div>
                        <span className="text-slate-700 truncate">{s.label}</span>
                      </div>
                      <Select value={s.status} onValueChange={(v) => { const ns = [...stips]; ns[i].status = v as any; setStips(ns); addLog(`Stip: ${s.label} → ${v}`); }}>
                        <SelectTrigger className="h-6 w-20 text-[10px] rounded shrink-0"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="Pending">Pending</SelectItem><SelectItem value="Received">Received</SelectItem><SelectItem value="Waived">Waived</SelectItem></SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <Textarea placeholder="Deal notes..." value={dealNotes} onChange={(e) => setDealNotes(e.target.value)} className="min-h-[70px] text-xs rounded-lg resize-none" />
                </div>
              </TabsContent>

              {/* ACTIVITY */}
              <TabsContent value="log" className="m-0 p-4 space-y-2">
                <p className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5"><History className="w-3 h-3" />Activity ({dealLog.length})</p>
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {dealLog.map(l => (
                    <div key={l.id} className="flex items-start gap-2 text-[11px] p-1.5 rounded-md bg-slate-50">
                      <CircleDot className="w-3 h-3 text-indigo-400 mt-0.5 shrink-0" />
                      <div className="min-w-0"><p className="text-slate-700 truncate">{l.action}</p><p className="text-[10px] text-slate-400">{l.timestamp}</p></div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* RIGHT SIDEBAR 4 cols */}
        <div className="xl:col-span-4 min-w-0 overflow-hidden">
          <Card className="border-slate-200/60 rounded-xl overflow-hidden bg-slate-900 xl:sticky xl:top-4">
            <div className="p-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Calculator className="w-4 h-4 text-indigo-400" />Calculator</h3>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]">Live</Badge>
            </div>
            <div className="p-3 space-y-3">
              {/* Hero */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-center">
                <p className="text-[11px] text-indigo-200">{dealType === 'Cash' ? 'Total Due' : 'Monthly Payment'}</p>
                <p className="text-3xl font-bold text-white tabular-nums mt-1">${dealType === 'Cash' ? totalDue.toLocaleString(undefined, { maximumFractionDigits: 0 }) : displayPayment.toFixed(2)}</p>
                {dealType !== 'Cash' && <p className="text-[11px] text-indigo-200 mt-1">{term}mo @ {sellRate}% • ${cashDown.toLocaleString()} dn</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-1.5 text-xs">
                <SRow label="Selling Price" val={sellingPrice} />
                {totalRebates > 0 && <SRow label="Rebates" val={-totalRebates} green />}
                {netTrade !== 0 && <SRow label="Trade Equity" val={-netTrade} green={netTrade > 0} red={netTrade < 0} />}
                <SRow label="Fees" val={totalFees} />
                <SRow label="Tax" val={totalTax} />
                {fiProductTotal > 0 && <SRow label="F&I Products" val={fiProductTotal} />}
                <div className="border-t border-slate-700 pt-1.5 flex justify-between"><span className="text-slate-300 font-medium">Total Due</span><span className="font-semibold text-white">${totalDue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
                <SRow label="Down Payment" val={-(cashDown + deferredDown)} green />
                <div className="border-t border-slate-700 pt-1.5 flex justify-between"><span className="text-slate-300 font-medium">Amt Financed</span><span className="font-bold text-white">${amountFinanced.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              </div>

              {/* Profit */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5 text-xs">
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Profit</p>
                <div className="flex justify-between"><span className="text-slate-400">Front</span><span className={cn("font-medium tabular-nums", frontGross >= 0 ? "text-white" : "text-red-400")}>${frontGross.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Back (F&I)</span><span className="text-white font-medium tabular-nums">${fiProfit.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Reserve</span><span className="text-white font-medium tabular-nums">${reserveProfit.toFixed(0)}</span></div>
                <div className="flex justify-between pt-1.5 border-t border-slate-700"><span className="font-semibold text-emerald-400">Total Gross</span><span className="text-lg font-bold text-emerald-400 tabular-nums">${totalGross.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>
              </div>

              {/* PVR */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-1.5 text-center">
                <div className="p-1.5 rounded-lg bg-slate-800"><p className="text-[9px] text-slate-500">Front</p><p className="text-xs font-bold text-white">${frontGross.toLocaleString()}</p></div>
                <div className="p-1.5 rounded-lg bg-slate-800"><p className="text-[9px] text-slate-500">Back</p><p className="text-xs font-bold text-white">${backGross.toFixed(0)}</p></div>
                <div className="p-1.5 rounded-lg bg-slate-800"><p className="text-[9px] text-slate-500">Total</p><p className="text-xs font-bold text-emerald-400">${totalGross.toFixed(0)}</p></div>
              </div>

              {/* Lender info */}
              {selectedLender && (
                <div className="pt-2 border-t border-slate-800 text-xs">
                  <p className="text-[10px] text-slate-500">Lender</p>
                  <p className="text-white font-medium">{selectedLender}</p>
                  {approvalNumber && <p className="text-[10px] text-slate-400">#{approvalNumber}</p>}
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                <Button size="sm" variant="outline" className="h-8 text-[11px] border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg gap-1"><Send className="w-3 h-3" />Submit</Button>
                <Button size="sm" className="h-8 text-[11px] bg-indigo-600 hover:bg-indigo-700 rounded-lg gap-1"><Printer className="w-3 h-3" />Print WS</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ──────────────────────────────────────────────────
function CBar({ icon, label, status }: { icon: React.ReactNode; label: string; status: 'ok' | 'warn' | 'danger' }) {
  const c = { ok: "bg-emerald-50 border-emerald-200 text-emerald-700", warn: "bg-amber-50 border-amber-200 text-amber-700", danger: "bg-red-50 border-red-200 text-red-700" };
  return <div className={cn("flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs", c[status])}>{icon}<span className="font-medium truncate">{label}</span></div>;
}

function MiniStat({ label, val }: { label: string; val: string }) {
  return <div className="p-1 rounded-md bg-slate-50 border border-slate-100 text-center"><p className="text-[9px] text-slate-400">{label}</p><p className="text-[11px] font-semibold text-slate-800">{val}</p></div>;
}

function StatBox({ label, value, colored, green, reverse }: { label: string; value: number; colored?: boolean; green?: boolean; reverse?: boolean }) {
  const pos = reverse ? value <= 0 : value >= 0;
  const clr = green ? "text-emerald-600" : colored ? (pos ? "text-emerald-600" : "text-red-600") : "text-slate-900";
  return <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-center"><p className="text-[10px] text-slate-400">{label}</p><p className={cn("text-sm font-bold", clr)}>{value >= 0 ? '' : '-'}${Math.abs(value).toLocaleString()}</p></div>;
}

function NumInput({ label, prefix, suffix, value, onChange, step, highlight }: { label: string; prefix?: string; suffix?: string; value: number; onChange: (v: number) => void; step?: number; highlight?: boolean; }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-medium text-slate-500">{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{prefix}</span>}
        <Input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className={cn("h-9 text-xs font-medium rounded-lg", prefix && "pl-6", suffix && "pr-8", highlight && "border-indigo-200 bg-indigo-50/30 font-semibold")} />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>}
      </div>
    </div>
  );
}

function SRow({ label, val, green, red }: { label: string; val: number; green?: boolean; red?: boolean }) {
  const neg = val < 0;
  const clr = green || neg ? "text-emerald-400" : red ? "text-red-400" : "text-white";
  return <div className="flex justify-between items-center"><span className="text-slate-400 truncate">{label}</span><span className={cn("font-medium tabular-nums shrink-0 ml-2", clr)}>{neg ? '-' : ''}${Math.abs(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span></div>;
}
