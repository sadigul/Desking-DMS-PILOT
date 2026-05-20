"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart3, TrendingUp, DollarSign, Users, Car, FileText,
  Download, Calendar, ArrowUpRight, ArrowDownRight, Target,
  Award, Clock, CreditCard, ShieldCheck, Percent
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const monthlyData = [
  { month: 'Jan', gross: 142000, units: 38, fni: 89000 },
  { month: 'Feb', gross: 156000, units: 42, fni: 94000 },
  { month: 'Mar', gross: 168000, units: 45, fni: 102000 },
  { month: 'Apr', gross: 149000, units: 40, fni: 87000 },
  { month: 'May', gross: 178000, units: 48, fni: 112000 },
];

const lenderMix = [
  { name: 'Ford Motor Credit', value: 32, color: '#4f46e5' },
  { name: 'Ally Financial', value: 22, color: '#7c3aed' },
  { name: 'Capital One', value: 18, color: '#0891b2' },
  { name: 'Chase Auto', value: 14, color: '#059669' },
  { name: 'Other', value: 14, color: '#94a3b8' },
];

const weeklyDeals = [
  { day: 'Mon', deals: 4 },
  { day: 'Tue', deals: 6 },
  { day: 'Wed', deals: 5 },
  { day: 'Thu', deals: 8 },
  { day: 'Fri', deals: 11 },
  { day: 'Sat', deals: 14 },
  { day: 'Sun', deals: 2 },
];

const salespeople = [
  { name: 'Derek Patterson', units: 14, gross: 42800, pvr: 3057 },
  { name: 'Jennifer Rodriguez', units: 12, gross: 38400, pvr: 3200 },
  { name: 'Ahmad Hassan', units: 11, gross: 33000, pvr: 3000 },
  { name: 'Brian Kowalski', units: 8, gross: 24800, pvr: 3100 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("mtd");
  const [reportType, setReportType] = useState("all");
  const { theme } = useTheme();
  const gridStroke = theme === 'dark' ? '#1e293b' : '#e2e8f0';

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-0.5">Performance tracking, financial reporting, and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="h-8 w-[130px] text-xs rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="wtd">Week to Date</SelectItem>
              <SelectItem value="mtd">Month to Date</SelectItem>
              <SelectItem value="qtd">Quarter to Date</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="h-8 w-[130px] text-xs rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="fni">F&I</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="lender">Lender</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </Button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Gross Profit', value: '$178,400', change: '+12.4%', up: true, icon: DollarSign, color: 'text-emerald-500' },
          { label: 'Units Sold', value: '48', change: '+6 vs last mo', up: true, icon: Car, color: 'text-indigo-500' },
          { label: 'F&I PVR', value: '$2,847', change: '+$347', up: true, icon: ShieldCheck, color: 'text-violet-500' },
          { label: 'Avg Days to Sell', value: '18', change: '-3 days', up: true, icon: Clock, color: 'text-amber-500' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50"
          >
            <div className="flex items-center justify-between mb-2">
              <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              <div className={cn("flex items-center gap-0.5 text-[10px] font-medium", kpi.up ? "text-emerald-600" : "text-red-600")}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{kpi.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Gross Profit Trend */}
        <Card className="xl:col-span-8 border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Gross Profit Trend</h3>
              <p className="text-[10px] text-slate-500">Monthly front + back gross combined</p>
            </div>
            <Badge variant="outline" className="text-[9px] h-5 gap-1"><TrendingUp className="w-3 h-3 text-emerald-500" />+12% MoM</Badge>
          </div>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="fniGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="gross" stroke="#4f46e5" strokeWidth={2} fill="url(#grossGrad)" name="Total Gross" />
                <Area type="monotone" dataKey="fni" stroke="#7c3aed" strokeWidth={2} fill="url(#fniGrad)" name="F&I Income" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lender Mix */}
        <Card className="xl:col-span-4 border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Lender Mix</h3>
            <p className="text-[10px] text-slate-500">Distribution by funded lender</p>
          </div>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={lenderMix} cx="50%" cy="50%" innerRadius={35} outerRadius={60} dataKey="value" strokeWidth={2} stroke="#fff">
                  {lenderMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {lenderMix.map((l, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span className="text-[10px] text-slate-500">{l.name}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-slate-800 dark:text-slate-200">{l.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Weekly Deals */}
        <Card className="xl:col-span-5 border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Deals by Day</h3>
            <p className="text-[10px] text-slate-500">This week&apos;s deal volume</p>
          </div>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyDeals}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Bar dataKey="deals" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sales Leaderboard */}
        <Card className="xl:col-span-7 border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sales Leaderboard</h3>
              <p className="text-[10px] text-slate-500">Top performers this month</p>
            </div>
            <Badge variant="outline" className="text-[9px] h-5">MTD</Badge>
          </div>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {salespeople.map((sp, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold",
                      i === 0 ? "bg-amber-100 text-amber-700" :
                      i === 1 ? "bg-slate-200 dark:bg-slate-700/50 text-slate-500" :
                      i === 2 ? "bg-orange-100 text-orange-700" : "bg-slate-200 dark:bg-slate-800/40 text-slate-500"
                    )}>#{i + 1}</div>
                    <div>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200">{sp.name}</p>
                      <p className="text-[10px] text-slate-500">{sp.units} units</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">${sp.gross.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500">Total Gross</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-indigo-600">${sp.pvr.toLocaleString()}</p>
                      <p className="text-[9px] text-slate-500">PVR</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* F&I Performance */}
      <Card className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">F&I Product Penetration</h3>
          <p className="text-[10px] text-slate-500">Attachment rates by product category</p>
        </div>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { product: 'VSC (Extended Warranty)', rate: 72, target: 65, revenue: '$68,400' },
              { product: 'GAP Insurance', rate: 58, target: 55, revenue: '$32,100' },
              { product: 'Paint & Fabric', rate: 41, target: 50, revenue: '$14,200' },
              { product: 'Tire & Wheel', rate: 34, target: 40, revenue: '$11,800' },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50">
                <p className="text-[11px] font-medium text-slate-300 mb-2">{p.product}</p>
                <div className="flex items-end justify-between mb-1.5">
                  <span className={cn("text-lg font-bold", p.rate >= p.target ? "text-emerald-700" : "text-amber-700")}>{p.rate}%</span>
                  <span className="text-[9px] text-slate-500">Target: {p.target}%</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", p.rate >= p.target ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${Math.min(p.rate, 100)}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5">Revenue: {p.revenue}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Export */}
      <Card className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Quick Reports</h3>
          <p className="text-[10px] text-slate-500">Generate and download standard dealership reports</p>
        </div>
        <CardContent className="p-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {[
              { name: 'Daily Sales Log', desc: 'All deals closed today with gross breakdown' },
              { name: 'Inventory Aging Report', desc: 'Vehicles sorted by days in stock' },
              { name: 'F&I Income Summary', desc: 'Product income by manager and deal' },
              { name: 'Lender Performance', desc: 'Approval rates, funding times, reserve' },
              { name: 'Salesperson Commission', desc: 'Units, gross, and commission due' },
              { name: 'Compliance Audit Log', desc: 'OFAC, privacy notice, adverse action trail' },
            ].map((r, i) => (
              <button key={i} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/40 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-700 transition-colors">{r.name}</p>
                  <p className="text-[9px] text-slate-500">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
