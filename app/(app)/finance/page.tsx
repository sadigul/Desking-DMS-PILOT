"use client";

import { useAppStore, Deal } from "@/store/appStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  ShieldCheck,
  Ban,
  DollarSign,
  Clock,
  ArrowUpDown,
  Download
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import { StatusBadge } from "@/components/StatusBadge";

export default function FinancePage() {
  const { deals, updateDealStatus, removeDeal } = useAppStore();
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Funded'>('All');
  const [sortBy, setSortBy] = useState<'status' | 'amount' | 'id'>('status');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredDeals = useMemo(() => {
    let result = deals;
    if (filter !== 'All') {
      result = result.filter(d => d.status === filter);
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'status') {
        const order: Record<string, number> = { 'Pending': 0, 'Approved': 1, 'Funded': 2, 'Draft': 3, 'Stuck': 4 };
        return (order[a.status] ?? 99) - (order[b.status] ?? 99);
      }
      if (sortBy === 'amount') return b.amount - a.amount;
      return b.id.localeCompare(a.id);
    });
  }, [deals, filter, sortBy]);

  const handleExport = () => {
    const headers = ['Deal ID', 'Customer', 'Vehicle', 'Status', 'Amount', 'Lender', 'Front Gross', 'Back Gross', 'Doc Status'];
    const rows = filteredDeals.map(d => [
      d.id,
      d.customer,
      d.vehicle,
      d.status,
      d.amount,
      d.lender,
      d.frontGross || 0,
      d.backGross || 0,
      d.docStatus
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `finance_deals_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!mounted) return null;

  const stats = [
    { label: 'Pending', value: deals.filter(d => d.status === 'Pending').length, color: 'text-amber-600', bg: 'bg-amber-50', icon: Clock },
    { label: 'Approved', value: deals.filter(d => d.status === 'Approved').length, color: 'text-blue-600', bg: 'bg-blue-50', icon: ShieldCheck },
    { label: 'Funded', value: deals.filter(d => d.status === 'Funded').length, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: DollarSign },
  ];

  const totalFundedGross = deals
    .filter(d => d.status === 'Funded')
    .reduce((acc, d) => acc + (d.frontGross || 0) + (d.backGross || 0), 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-slate-100">Finance Pipeline</h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">Track deals from submission to funding.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 p-1 bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700/50">
            {(['All', 'Pending', 'Approved', 'Funded'] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-slate-800/50 shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="h-9 px-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-lg shadow-sm flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium text-slate-500 bg-transparent outline-none cursor-pointer"
            >
              <option value="status">By Status</option>
              <option value="amount">By Amount</option>
              <option value="id">By ID</option>
            </select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="h-9 px-3 text-xs font-medium gap-2 border-slate-700 rounded-lg"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="modern-card p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{s.label}</span>
              <div className={`p-1.5 ${s.bg} rounded-lg`}>
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
        <div className="modern-card p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 border-none text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-emerald-100 uppercase tracking-wider">Total Funded</span>
            <div className="p-1.5 bg-slate-800/50/20 rounded-lg">
              <DollarSign className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">${totalFundedGross.toLocaleString()}</p>
        </div>
      </div>

      {/* Deal Cards */}
      <div className="space-y-3">
        {filteredDeals.map((deal, i) => (
          <motion.div
            key={deal.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <div className="modern-card overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all">
              <div className="flex flex-col lg:flex-row items-stretch">
                {/* Status indicator bar */}
                <div className={`w-full h-1 lg:w-1 lg:h-auto shrink-0 ${
                  deal.status === 'Funded' ? 'bg-emerald-500' : 
                  deal.status === 'Approved' ? 'bg-indigo-500' : 
                  deal.status === 'Pending' ? 'bg-amber-400' :
                  'bg-slate-300'
                }`} />
                
                <div className="flex-1 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {/* Customer */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="text-[11px] font-mono text-slate-500">{deal.id}</span>
                       <StatusBadge status={deal.status} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center font-semibold text-slate-500 text-sm">
                        {deal.customer[0]}
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-800 dark:text-slate-200 text-sm">{deal.customer}</h3>
                        <p className="text-[11px] text-slate-500">{deal.vehicle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Lender & Docs */}
                  <div className="flex flex-col justify-center space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Lender</p>
                    <p className="text-sm font-medium text-slate-300">{deal.lender}</p>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border w-fit ${
                      deal.docStatus === 'Signed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      deal.docStatus === 'Ready' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                      'bg-slate-800/40 text-slate-500 border-slate-200 dark:border-slate-700/50'
                    }`}>
                      {deal.docStatus}
                    </span>
                  </div>

                  {/* Profit */}
                  <div className="flex flex-col justify-center space-y-1">
                    <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Gross Profit</p>
                    <div className="flex items-center gap-4">
                       <div>
                         <p className="text-[10px] text-slate-500">Front</p>
                         <p className="text-sm font-semibold text-emerald-600">+${deal.frontGross?.toLocaleString()}</p>
                       </div>
                       <div>
                         <p className="text-[10px] text-slate-500">Back</p>
                         <p className="text-sm font-semibold text-emerald-600">+${deal.backGross?.toLocaleString()}</p>
                       </div>
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 border-t lg:border-t-0 border-slate-50 pt-3 lg:pt-0">
                    <div className="text-right">
                       <p className="text-[11px] text-slate-500 mb-0.5">Amount</p>
                       <p className="text-xl font-bold text-slate-900 dark:text-slate-100">${deal.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {deal.status !== 'Funded' && (
                        <button 
                          onClick={() => updateDealStatus(deal.id, deal.status === 'Pending' ? 'Approved' : 'Funded')}
                          className="h-8 px-3 font-medium text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm active:scale-[0.98] transition-all"
                        >
                          {deal.status === 'Pending' ? 'Approve' : 'Fund'}
                        </button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => removeDeal(deal.id)} className="h-8 w-8 text-slate-300 hover:text-red-500 transition-colors rounded-lg">
                        <Ban className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {filteredDeals.length === 0 && (
           <div className="p-16 text-center border border-dashed border-slate-700 rounded-xl bg-slate-800/40/50">
             <Search className="w-8 h-8 text-slate-300 mx-auto mb-3" />
             <p className="font-medium text-slate-300 text-sm">No deals in this stage</p>
             <p className="text-xs text-slate-500 mt-1">Try a different filter or create a new deal.</p>
           </div>
        )}
      </div>
    </div>
  );
}
