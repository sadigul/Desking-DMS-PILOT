"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { MOCK_DEALS } from "@/data/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MoreHorizontal, Clock, DollarSign, User, Building2, ChevronDown, ChevronUp, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pipeline() {
  const columns = ["Pending", "Submitted", "Approved", "Declined", "Funded"];
  const [expandedCols, setExpandedCols] = useState<Record<string, boolean>>(
    Object.fromEntries(columns.map(c => [c, true]))
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const toggleCol = (col: string) => setExpandedCols(prev => ({ ...prev, [col]: !prev[col] }));

  const statusColor: Record<string, string> = {
    Pending: "bg-amber-50 border-amber-200 text-amber-700",
    Submitted: "bg-blue-50 border-blue-200 text-blue-700",
    Approved: "bg-emerald-50 border-emerald-200 text-emerald-700",
    Declined: "bg-red-50 border-red-200 text-red-700",
    Funded: "bg-indigo-50 border-indigo-200 text-indigo-700",
  };

  const displayColumns = filterStatus === "all" ? columns : columns.filter(c => c === filterStatus);

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Deal Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">Track deals from submission to funding</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="h-8 w-[140px] text-xs rounded-lg border-slate-700">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {columns.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {columns.map(col => {
          const deals = MOCK_DEALS.filter(d => d.status === col);
          const total = deals.reduce((s, d) => s + d.amount, 0);
          return (
            <div key={col} className={cn("p-2.5 rounded-xl border text-center", statusColor[col])}>
              <p className="text-[10px] font-medium opacity-70">{col}</p>
              <p className="text-base font-bold mt-0.5">{deals.length}</p>
              <p className="text-[10px] opacity-60">${(total / 1000).toFixed(0)}k</p>
            </div>
          );
        })}
      </div>

      {/* Pipeline Columns - Stacked Vertically */}
      <div className="space-y-3">
        {displayColumns.map(col => {
          const deals = MOCK_DEALS.filter(d => d.status === col);
          const expanded = expandedCols[col];

          return (
            <Card key={col} className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
              {/* Column Header */}
              <button onClick={() => toggleCol(col)} className="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className={cn("w-2.5 h-2.5 rounded-full", col === 'Pending' && "bg-amber-400", col === 'Submitted' && "bg-blue-400", col === 'Approved' && "bg-emerald-400", col === 'Declined' && "bg-red-400", col === 'Funded' && "bg-indigo-500")} />
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">{col}</h3>
                  <Badge variant="secondary" className="text-[10px] h-5 px-1.5 bg-slate-200 dark:bg-slate-700/50">{deals.length} deals</Badge>
                  <span className="text-[11px] text-slate-500 hidden sm:inline">${deals.reduce((s, d) => s + d.amount, 0).toLocaleString()} total</span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>

              {/* Deal Cards */}
              {expanded && deals.length > 0 && (
                <div className="px-3.5 pb-3.5 grid sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {deals.map(deal => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-sm transition-all cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-xs truncate">{deal.customer}</p>
                          <p className="text-[10px] text-slate-500 truncate mt-0.5">{deal.vehicle}</p>
                        </div>
                        <button className="text-slate-300 hover:text-slate-500 transition-colors shrink-0 ml-2">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-slate-500" />
                          <span className="text-xs font-semibold text-indigo-600">{deal.amount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-500 truncate max-w-[80px]">{deal.lender}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-700/50 flex items-center justify-center text-[9px] font-medium text-slate-500">
                            {deal.fiManager.charAt(0)}
                          </div>
                          <span className="text-[10px] text-slate-500 truncate max-w-[60px]">{deal.fiManager}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-[10px] text-slate-500">{deal.daysOpen}d</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {expanded && deals.length === 0 && (
                <div className="px-3.5 pb-3.5">
                  <p className="text-xs text-slate-500 text-center py-4">No deals in this stage</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
