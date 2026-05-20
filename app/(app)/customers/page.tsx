"use client";

import { useAppStore, Customer } from "@/store/appStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, UserPlus, Phone, Mail, ExternalLink, Calculator,
  Star, Users, TrendingUp, Download, X, Filter, CreditCard
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CustomersPage() {
  const { customers } = useAppStore();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCredit, setFilterCredit] = useState("all");
  const [filterSource, setFilterSource] = useState("all");

  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => {
    let result = customers.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
    );

    if (filterStatus !== "all") result = result.filter(c => c.status === filterStatus);
    if (filterCredit === "excellent") result = result.filter(c => c.creditScore >= 750);
    if (filterCredit === "good") result = result.filter(c => c.creditScore >= 680 && c.creditScore < 750);
    if (filterCredit === "fair") result = result.filter(c => c.creditScore >= 600 && c.creditScore < 680);
    if (filterCredit === "subprime") result = result.filter(c => c.creditScore < 600);

    return result;
  }, [customers, search, filterStatus, filterCredit, filterSource]);

  const activeFilters = [filterStatus, filterCredit, filterSource].filter(f => f !== "all").length;
  const clearFilters = () => { setFilterStatus("all"); setFilterCredit("all"); setFilterSource("all"); };

  if (!mounted) return null;

  const avgCredit = Math.round(customers.reduce((s, c) => s + c.creditScore, 0) / customers.length);
  const activeLeads = customers.filter(c => c.status === 'Lead' || c.status === 'Active').length;

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Customers</h1>
          <p className="text-xs text-slate-500 mt-0.5">{customers.length} total • {activeLeads} active leads</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" className="text-xs h-8 rounded-lg gap-1.5 bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="w-3.5 h-3.5" /> New Customer
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Total</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{customers.length}</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Active Leads</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{activeLeads}</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Avg Credit</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{avgCredit}</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Prime+</span>
          </div>
          <p className="text-lg font-bold text-slate-100">{customers.filter(c => c.creditScore >= 700).length}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <Card className="border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-lg border-slate-700"
              placeholder="Search by name, email, or phone..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-[120px] text-xs rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Lead">Lead</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Past Customer">Past Customer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCredit} onValueChange={setFilterCredit}>
              <SelectTrigger className="h-8 w-[140px] text-xs rounded-lg">
                <SelectValue placeholder="Credit Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Credit</SelectItem>
                <SelectItem value="excellent">Excellent (750+)</SelectItem>
                <SelectItem value="good">Good (680-749)</SelectItem>
                <SelectItem value="fair">Fair (600-679)</SelectItem>
                <SelectItem value="subprime">Sub-Prime (&lt;600)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="h-8 w-[130px] text-xs rounded-lg">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="walkin">Walk-In</SelectItem>
                <SelectItem value="internet">Internet Lead</SelectItem>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="repeat">Repeat Buyer</SelectItem>
              </SelectContent>
            </Select>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1 px-2 rounded-lg">
                <X className="w-3 h-3" /> Clear ({activeFilters})
              </Button>
            )}

            <div className="ml-auto text-[11px] text-slate-500">
              {filtered.length} customer{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </Card>

      {/* Customer Table */}
      <Card className="border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/50">
                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Credit</th>
                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider">Last Visit</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="hover:bg-slate-700/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-indigo-600">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-200 group-hover:text-indigo-700 transition-colors">{customer.name}</p>
                        <p className="text-[9px] text-slate-500">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-300" />{customer.phone}</p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 truncate max-w-[180px]"><Mail className="w-3 h-3 text-slate-300" />{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        customer.creditScore >= 750 ? "bg-emerald-500" :
                        customer.creditScore >= 680 ? "bg-blue-500" :
                        customer.creditScore >= 600 ? "bg-amber-500" : "bg-red-500"
                      )} />
                      <span className={cn(
                        "text-xs font-semibold",
                        customer.creditScore >= 750 ? "text-emerald-700" :
                        customer.creditScore >= 680 ? "text-blue-700" :
                        customer.creditScore >= 600 ? "text-amber-700" : "text-red-700"
                      )}>{customer.creditScore}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">
                      {customer.creditScore >= 750 ? 'Excellent' :
                       customer.creditScore >= 680 ? 'Good' :
                       customer.creditScore >= 600 ? 'Fair' : 'Sub-Prime'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn(
                      "text-[9px] h-5 px-1.5",
                      customer.status === 'Active' ? "text-emerald-600 border-emerald-200 bg-emerald-50" :
                      customer.status === 'Lead' ? "text-blue-600 border-blue-200 bg-blue-50" :
                      customer.status === 'Past Customer' ? "text-violet-600 border-violet-200 bg-violet-50" :
                      "text-slate-500 border-slate-700"
                    )}>{customer.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] text-slate-500">{customer.lastVisit}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/desking?customerId=${customer.id}`}>
                        <Button size="sm" className="h-7 px-2.5 text-[10px] rounded-lg bg-indigo-600 hover:bg-indigo-700 gap-1">
                          <Calculator className="w-3 h-3" /> Deal
                        </Button>
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Search className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No customers match your filters</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
