"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  User, Mail, Phone, MapPin, Shield, Calendar, Clock,
  Award, TrendingUp, DollarSign, Target, BarChart3,
  Camera, Edit2, CheckCircle2, Star, Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-100">My Profile</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your account and view performance</p>
        </div>
        <Button
          variant={isEditing ? "default" : "outline"}
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
          className="text-xs h-8 rounded-lg gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </Button>
      </div>

      {/* Profile Card */}
      <Card className="border-slate-700/50 rounded-xl overflow-hidden">
        {/* Cover / Banner */}
        <div className="h-28 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZyIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIj48cGF0aCBkPSJNMCAwaDQwdjQwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNnKSIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiLz48L3N2Zz4=')] opacity-50"></div>
        </div>

        {/* Avatar + Basic Info */}
        <div className="px-5 pb-5 -mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-slate-800/50 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-indigo-600">MW</span>
                </div>
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-800/50 border-2 border-slate-700 rounded-lg flex items-center justify-center hover:bg-slate-700/50 transition-colors">
                <Camera className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 min-w-0 sm:pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-100">Marcus Williams</h2>
                <Badge className="text-[9px] h-4 bg-indigo-50 text-indigo-700 border-indigo-200">F&I Director</Badge>
                <Badge className="text-[9px] h-4 bg-emerald-50 text-emerald-700 border-emerald-200 gap-0.5"><CheckCircle2 className="w-2.5 h-2.5" />Verified</Badge>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">AutoNation Ford — North Richland Hills, TX</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* Left - Personal Info */}
        <div className="xl:col-span-5 space-y-4">
          <Card className="border-slate-700/50 rounded-xl">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-200">Personal Information</h3>
            </div>
            <CardContent className="p-4 space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">Full Name</label>
                <Input defaultValue="Marcus Williams" disabled={!isEditing} className="h-9 text-xs rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">Email</label>
                <Input defaultValue="mwilliams@autonationfordnrh.com" disabled={!isEditing} className="h-9 text-xs rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">Phone</label>
                <Input defaultValue="(817) 485-2100 ext. 204" disabled={!isEditing} className="h-9 text-xs rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">Role</label>
                <Input defaultValue="F&I Director" disabled className="h-9 text-xs rounded-lg bg-slate-800/40" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">Employee ID</label>
                <Input defaultValue="EMP-00214" disabled className="h-9 text-xs rounded-lg bg-slate-800/40" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-slate-500">Start Date</label>
                <Input defaultValue="March 15, 2019" disabled className="h-9 text-xs rounded-lg bg-slate-800/40" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-700/50 rounded-xl">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-200">Permissions & Access</h3>
            </div>
            <CardContent className="p-4 space-y-2">
              {[
                { label: 'Desking & Deal Structuring', granted: true },
                { label: 'F&I Menu Presentation', granted: true },
                { label: 'Credit Bureau Pulls', granted: true },
                { label: 'Lender Submission', granted: true },
                { label: 'E-Contracting', granted: true },
                { label: 'Inventory Pricing (Cost)', granted: true },
                { label: 'Reporting — Full P&L', granted: true },
                { label: 'User Administration', granted: false },
                { label: 'System Configuration', granted: false },
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-[11px] text-slate-300">{p.label}</span>
                  {p.granted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <span className="text-[10px] text-slate-400">Restricted</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right - Performance */}
        <div className="xl:col-span-7 space-y-4">
          {/* Performance KPIs */}
          <Card className="border-slate-700/50 rounded-xl">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-200">Performance — May 2026</h3>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Deals Closed', value: '48', target: '55 target', pct: 87, icon: Target },
                  { label: 'F&I PVR', value: '$2,847', target: '$2,500 target', pct: 100, icon: DollarSign },
                  { label: 'Products/Deal', value: '3.2', target: '3.0 target', pct: 100, icon: BarChart3 },
                  { label: 'CSI Score', value: '4.8', target: '4.5 target', pct: 100, icon: Star },
                ].map((k, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-100 text-center">
                    <k.icon className="w-4 h-4 text-indigo-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-100">{k.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{k.target}</p>
                    <div className="h-1 bg-slate-700/50 rounded-full mt-2 overflow-hidden">
                      <div className={cn("h-full rounded-full", k.pct >= 100 ? "bg-emerald-500" : "bg-amber-500")} style={{ width: `${Math.min(k.pct, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Certifications */}
          <Card className="border-slate-700/50 rounded-xl">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-200">Certifications & Training</h3>
            </div>
            <CardContent className="p-4 space-y-2.5">
              {[
                { name: 'AFIP Certified F&I Professional', date: 'Renewed Jan 2026', active: true },
                { name: 'FTC Safeguards Compliance Training', date: 'Completed Mar 2026', active: true },
                { name: 'EasyCare Product Certification', date: 'Completed Feb 2026', active: true },
                { name: 'RouteOne e-Contracting Certified', date: 'Completed Nov 2025', active: true },
                { name: 'Ford Credit Dealer Portal Training', date: 'Due Aug 2026', active: false },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", c.active ? "bg-emerald-50" : "bg-amber-50")}>
                      <Award className={cn("w-3.5 h-3.5", c.active ? "text-emerald-500" : "text-amber-500")} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-200">{c.name}</p>
                      <p className="text-[10px] text-slate-400">{c.date}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-[9px] h-4 px-1.5", c.active ? "text-emerald-600 border-emerald-200" : "text-amber-600 border-amber-200")}>
                    {c.active ? 'Active' : 'Due'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-slate-700/50 rounded-xl">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-200">Recent Activity</h3>
            </div>
            <CardContent className="p-4 space-y-2">
              {[
                { action: 'Funded deal D-24-0855 — Samantha Brooks (Toyota Highlander)', time: '2 hours ago' },
                { action: 'Submitted deal D-24-0847 to Ford Motor Credit', time: '4 hours ago' },
                { action: 'Added GAP + VSC to deal D-24-0851 (Tiffany Nguyen)', time: '5 hours ago' },
                { action: 'Approved by Capital One — deal D-24-0851 @ 3.9% / 60mo', time: '5 hours ago' },
                { action: 'Pulled credit bureau for William Foster (752 Equifax)', time: '6 hours ago' },
                { action: 'E-contract sent to Tiffany Nguyen via RouteOne', time: '7 hours ago' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2.5 py-2 border-b border-slate-50 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></div>
                  <div>
                    <p className="text-[11px] text-slate-300">{a.action}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
