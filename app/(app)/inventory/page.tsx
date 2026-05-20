"use client";

import { useAppStore, Vehicle } from "@/store/appStore";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Car, Plus, ArrowUpDown, MoreVertical, ShieldCheck,
  Package, DollarSign, Clock, Filter, X, Download
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { VehicleStatusBadge } from "@/components/VehicleStatusBadge";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const { inventory } = useAppStore();
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const [sortField, setSortField] = useState<keyof Vehicle | 'age'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filters
  const [filterMake, setFilterMake] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterYear, setFilterYear] = useState("all");
  const [filterPrice, setFilterPrice] = useState("all");

  useEffect(() => { setMounted(true); }, []);

  const makes = useMemo(() => [...new Set(inventory.map(v => v.make))].sort(), [inventory]);
  const years = useMemo(() => [...new Set(inventory.map(v => String(v.year)))].sort().reverse(), [inventory]);
  const statuses = useMemo(() => [...new Set(inventory.map(v => v.status))].sort(), [inventory]);

  const filtered = useMemo(() => {
    let result = inventory.filter(v =>
      `${v.year} ${v.make} ${v.model} ${v.trim}`.toLowerCase().includes(search.toLowerCase()) ||
      v.vin.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase())
    );

    if (filterMake !== "all") result = result.filter(v => v.make === filterMake);
    if (filterStatus !== "all") result = result.filter(v => v.status === filterStatus);
    if (filterType !== "all") result = result.filter(v => v.stockType === filterType);
    if (filterYear !== "all") result = result.filter(v => String(v.year) === filterYear);
    if (filterPrice === "under30") result = result.filter(v => v.msrp < 30000);
    if (filterPrice === "30to50") result = result.filter(v => v.msrp >= 30000 && v.msrp < 50000);
    if (filterPrice === "50to75") result = result.filter(v => v.msrp >= 50000 && v.msrp < 75000);
    if (filterPrice === "over75") result = result.filter(v => v.msrp >= 75000);

    result = [...result].sort((a, b) => {
      let valA: any = a[sortField as keyof Vehicle] ?? '';
      let valB: any = b[sortField as keyof Vehicle] ?? '';
      if (sortField === 'age') { valA = a.daysInStock || 0; valB = b.daysInStock || 0; }
      if (typeof valA === 'string') return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [inventory, search, filterMake, filterStatus, filterType, filterYear, filterPrice, sortField, sortOrder]);

  const activeFilters = [filterMake, filterStatus, filterType, filterYear, filterPrice].filter(f => f !== "all").length;

  const clearFilters = () => {
    setFilterMake("all"); setFilterStatus("all"); setFilterType("all"); setFilterYear("all"); setFilterPrice("all");
  };

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortOrder('asc'); }
  };

  if (!mounted) return null;

  // Summary stats
  const totalUnits = inventory.length;
  const availableUnits = inventory.filter(v => v.status === 'In Stock').length;
  const totalValue = inventory.reduce((sum, v) => sum + v.msrp, 0);
  const avgDays = Math.round(inventory.reduce((sum, v) => sum + (v.daysInStock || 0), 0) / totalUnits);

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Vehicle Inventory</h1>
          <p className="text-xs text-slate-500 mt-0.5">{totalUnits} total units • {availableUnits} available</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" className="text-xs h-8 rounded-lg gap-1.5 bg-indigo-600 hover:bg-indigo-700">
            <Plus className="w-3.5 h-3.5" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Total Units</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{totalUnits}</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Car className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Available</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{availableUnits}</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3.5 h-3.5 text-violet-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Total Value</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">${(totalValue / 1000000).toFixed(1)}M</p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Avg Days</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{avgDays}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <Card className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs rounded-lg border-slate-200 dark:border-slate-700"
              placeholder="Search by VIN, Stock #, Year Make Model..."
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <Select value={filterMake} onValueChange={setFilterMake}>
              <SelectTrigger className="h-8 w-[130px] text-xs rounded-lg">
                <SelectValue placeholder="Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Makes</SelectItem>
                {makes.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="h-8 w-[110px] text-xs rounded-lg">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="h-8 w-[110px] text-xs rounded-lg">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Used">Used</SelectItem>
                <SelectItem value="CPO">CPO</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="h-8 w-[120px] text-xs rounded-lg">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filterPrice} onValueChange={setFilterPrice}>
              <SelectTrigger className="h-8 w-[130px] text-xs rounded-lg">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under30">Under $30K</SelectItem>
                <SelectItem value="30to50">$30K – $50K</SelectItem>
                <SelectItem value="50to75">$50K – $75K</SelectItem>
                <SelectItem value="over75">$75K+</SelectItem>
              </SelectContent>
            </Select>

            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-50 gap-1 px-2 rounded-lg">
                <X className="w-3 h-3" /> Clear ({activeFilters})
              </Button>
            )}

            <div className="ml-auto text-[11px] text-slate-500">
              {filtered.length} vehicle{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/50">
                {[
                  { label: 'Stock #', field: 'id' as const },
                  { label: 'Vehicle', field: 'make' as const },
                  { label: 'MSRP', field: 'msrp' as const },
                  { label: 'Type', field: 'stockType' as const },
                  { label: 'Status', field: 'status' as const },
                  { label: 'Days', field: 'age' as const },
                ].map(col => (
                  <th
                    key={col.field}
                    className="px-4 py-3 text-[10px] font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-500 transition-colors"
                    onClick={() => toggleSort(col.field)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.field && <ArrowUpDown className="w-3 h-3 text-indigo-500" />}
                    </div>
                  </th>
                ))}
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((v, i) => (
                <motion.tr
                  key={v.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.015 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-indigo-600">{v.id}</span>
                    <p className="text-[9px] font-mono text-slate-500">{v.vin.slice(-8)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center shrink-0">
                        <Car className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-800 dark:text-slate-200 group-hover:text-indigo-700 transition-colors">{v.year} {v.make} {v.model}</p>
                        <p className="text-[10px] text-slate-500">{v.trim} • {v.color}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">${v.msrp.toLocaleString()}</p>
                    <p className="text-[9px] text-slate-500">Inv: ${v.invoice?.toLocaleString() || '—'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <Badge variant="outline" className={cn(
                        "text-[9px] h-4 px-1.5 w-fit",
                        v.stockType === 'New' ? "text-indigo-600 border-indigo-200" : v.stockType === 'CPO' ? "text-emerald-600 border-emerald-200" : "text-orange-600 border-orange-200"
                      )}>{v.stockType}</Badge>
                      <span className={cn("text-[9px] flex items-center gap-0.5",
                        v.carfaxStatus === 'Clean' ? 'text-emerald-500' : v.carfaxStatus === 'Minor' ? 'text-amber-500' : 'text-red-500'
                      )}>
                        <ShieldCheck className="w-2.5 h-2.5" />{v.carfaxStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <VehicleStatusBadge status={v.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("text-xs font-semibold", (v.daysInStock || 0) > 30 ? "text-red-600" : (v.daysInStock || 0) > 15 ? "text-amber-600" : "text-slate-800 dark:text-slate-200")}>
                      {v.daysInStock || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/desking?vehicleId=${v.id}`}>
                      <Button variant="outline" size="sm" className="h-7 px-2.5 text-[10px] rounded-lg hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all">
                        Desk
                      </Button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <Search className="w-8 h-8 text-slate-800 dark:text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-medium text-slate-500">No vehicles match your filters</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Try adjusting your search or clear filters</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
