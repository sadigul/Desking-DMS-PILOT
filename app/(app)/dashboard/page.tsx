"use client";

import { useAppStore } from "@/store/appStore";
import { useEffect, useState } from "react";
import {
  TrendingUp,
  Car,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ArrowRight,
  BarChart3,
  Target,
  Calendar,
  Zap
} from "lucide-react";
import { motion } from "motion/react";
import { StatusBadge } from "@/components/StatusBadge";
import { AiSummary } from "@/components/AiSummary";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ─── CHART DATA ──────────────────────────────────────────────────────────
const revenueData = [
  { month: 'Dec', gross: 312000, back: 284000, units: 142 },
  { month: 'Jan', gross: 289000, back: 261000, units: 128 },
  { month: 'Feb', gross: 304000, back: 278000, units: 135 },
  { month: 'Mar', gross: 358000, back: 312000, units: 158 },
  { month: 'Apr', gross: 372000, back: 341000, units: 164 },
  { month: 'May', gross: 198000, back: 176000, units: 89 },
];

const dailyDeals = [
  { day: 'Mon', deals: 8, gross: 18400 },
  { day: 'Tue', deals: 6, gross: 14200 },
  { day: 'Wed', deals: 9, gross: 21800 },
  { day: 'Thu', deals: 7, gross: 16500 },
  { day: 'Fri', deals: 11, gross: 28900 },
  { day: 'Sat', deals: 14, gross: 35200 },
  { day: 'Sun', deals: 3, gross: 7800 },
];

const lenderMix = [
  { name: 'Ford Motor Credit', value: 28, color: '#4f46e5' },
  { name: 'Toyota Motor Credit', value: 22, color: '#0891b2' },
  { name: 'Capital One Auto', value: 18, color: '#059669' },
  { name: 'Ally Financial', value: 14, color: '#d97706' },
  { name: 'Chase Auto', value: 10, color: '#7c3aed' },
  { name: 'Others', value: 8, color: '#94a3b8' },
];

const inventoryAging = [
  { range: '0-15d', count: 14, color: '#10b981' },
  { range: '16-30d', count: 11, color: '#f59e0b' },
  { range: '31-45d', count: 6, color: '#ef4444' },
  { range: '45d+', count: 3, color: '#991b1b' },
];

const fiPenetration = [
  { product: 'VSC', rate: 68 },
  { product: 'GAP', rate: 74 },
  { product: 'Maint', rate: 33 },
  { product: 'T&W', rate: 44 },
  { product: 'Appear', rate: 38 },
  { product: 'Theft', rate: 55 },
];

export default function DashboardPage() {
  const { deals, inventory, customers } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalGross = deals.reduce((acc, deal) => acc + (deal.frontGross || 0) + (deal.backGross || 0), 0);
  const totalBack = deals.reduce((acc, deal) => acc + (deal.backGross || 0), 0);
  const activeDeals = deals.filter(d => d.status !== 'Funded').length;
  const inStockCount = inventory.filter(v => v.status === 'In Stock').length;
  const avgDaysInStock = Math.round(inventory.filter(v => v.status === 'In Stock').reduce((s, v) => s + v.daysInStock, 0) / inStockCount);

  const stats = [
    {
      title: "MTD Gross Profit",
      value: `$${totalGross.toLocaleString()}`,
      change: "+12.5%",
      trend: "up" as const,
      icon: DollarSign,
      color: "text-emerald-600",
      iconBg: "bg-emerald-100"
    },
    {
      title: "Active Pipeline",
      value: activeDeals.toString(),
      change: "+2 today",
      trend: "up" as const,
      icon: TrendingUp,
      color: "text-indigo-600",
      iconBg: "bg-indigo-100"
    },
    {
      title: "In Stock Units",
      value: inStockCount.toString(),
      change: `${avgDaysInStock}d avg age`,
      trend: "up" as const,
      icon: Car,
      color: "text-blue-600",
      iconBg: "bg-blue-100"
    },
    {
      title: "F&I PVR",
      value: `$${totalBack > 0 ? Math.round(totalBack / deals.filter(d => d.status === 'Funded').length).toLocaleString() : '0'}`,
      change: "+8% MTD",
      trend: "up" as const,
      icon: Target,
      color: "text-violet-600",
      iconBg: "bg-violet-100"
    }
  ];

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden pb-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Command Center</h1>
          <p className="text-xs text-slate-500 mt-0.5">Real-time dealership performance — May 2026</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700 font-medium">Live</span>
          </div>
          <Clock className="w-3.5 h-3.5" />
          <span>Updated just now</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            className="p-3.5 rounded-xl bg-white border border-slate-200/60 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className={`${stat.iconBg} w-8 h-8 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <ArrowUpRight className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-600 font-medium">{stat.change}</span>
              </div>
            </div>
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{stat.title}</p>
            <p className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Revenue Trend - Area Chart */}
        <div className="xl:col-span-8 bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Gross Profit Trend</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Front & Back gross — 6 month rolling</p>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>Front</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>Back (F&I)</div>
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradFront" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradBack" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="gross" stroke="#6366f1" strokeWidth={2} fill="url(#gradFront)" name="Front Gross" />
                <Area type="monotone" dataKey="back" stroke="#10b981" strokeWidth={2} fill="url(#gradBack)" name="Back Gross" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lender Mix - Pie Chart */}
        <div className="xl:col-span-4 bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Lender Mix</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Deals by lender (MTD)</p>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={lenderMix}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {lenderMix.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }} formatter={(value: number) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {lenderMix.map(l => (
              <div key={l.name} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: l.color }}></span>
                  <span className="text-slate-600 truncate">{l.name}</span>
                </div>
                <span className="font-medium text-slate-800">{l.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Daily Deals - Bar Chart */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-800">This Week</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Deals closed per day</p>
          </div>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyDeals} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
                <Bar dataKey="deals" fill="#6366f1" radius={[4, 4, 0, 0]} name="Deals" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* F&I Penetration - Horizontal Bars */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-800">F&I Penetration</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Product attachment rates</p>
          </div>
          <div className="space-y-2.5 mt-4">
            {fiPenetration.map(p => (
              <div key={p.product} className="flex items-center gap-2.5">
                <span className="text-[11px] text-slate-600 w-12 shrink-0">{p.product}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${p.rate}%` }}
                    transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    className={cn("h-full rounded-full", p.rate >= 70 ? "bg-emerald-500" : p.rate >= 50 ? "bg-indigo-500" : p.rate >= 35 ? "bg-amber-500" : "bg-slate-400")}
                  />
                </div>
                <span className="text-[11px] font-semibold text-slate-700 w-8 text-right">{p.rate}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Aging */}
        <div className="bg-white rounded-xl border border-slate-200/60 p-4">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-slate-800">Inventory Aging</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Days in stock distribution</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {inventoryAging.map(a => (
              <div key={a.range} className="p-3 rounded-lg border border-slate-100 text-center">
                <div className="w-8 h-8 rounded-lg mx-auto mb-1.5 flex items-center justify-center" style={{ backgroundColor: `${a.color}15` }}>
                  <span className="text-sm font-bold" style={{ color: a.color }}>{a.count}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{a.range}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Total In Stock</span>
            <span className="font-semibold text-slate-800">{inStockCount} units</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-500">Avg Days</span>
            <span className="font-semibold text-slate-800">{avgDaysInStock} days</span>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Deals + Inventory */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Recent Deals */}
        <div className="xl:col-span-7 bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Recent Deals</h3>
            <button className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {deals.slice(0, 5).map((deal, i) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-semibold text-slate-600 text-[11px] shrink-0">
                    {deal.customer.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800 text-xs truncate">{deal.customer}</p>
                    <p className="text-[10px] text-slate-400 truncate">{deal.id} · {deal.vehicle}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="font-semibold text-slate-800 text-xs">${deal.amount.toLocaleString()}</p>
                  <StatusBadge status={deal.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="xl:col-span-5 space-y-4">
          {/* Sales Team Leaderboard */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">F&I Manager Scoreboard</h3>
            <div className="space-y-2.5">
              {[
                { name: 'Marcus Williams', deals: 48, pvr: 2847, rank: 1 },
                { name: 'Amanda Chen', deals: 44, pvr: 3120, rank: 2 },
              ].map(m => (
                <div key={m.name} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100">
                  <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white", m.rank === 1 ? "bg-amber-500" : "bg-slate-400")}>
                    #{m.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-800 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.deals} deals MTD</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-emerald-600">${m.pvr.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400">PVR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">MTD Snapshot</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'Units Sold', value: '89', sub: '164 target' },
                { label: 'Avg Front', value: '$2,225', sub: '+$180 vs LM' },
                { label: 'Avg Back', value: '$2,984', sub: '+$220 vs LM' },
                { label: 'Avg Deal Time', value: '2.8 hrs', sub: '-0.4 vs LM' },
                { label: 'Close Rate', value: '22.4%', sub: '+1.2% vs LM' },
                { label: 'CSI Score', value: '4.7/5', sub: 'Zone avg 4.3' },
              ].map(m => (
                <div key={m.label} className="p-2.5 rounded-lg bg-slate-50/80 border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium">{m.label}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{m.value}</p>
                  <p className="text-[10px] text-slate-400">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <AiSummary />
    </div>
  );
}
