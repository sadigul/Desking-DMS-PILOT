"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Building2, Bell, Shield, CreditCard, Globe, Users, FileText,
  Mail, Phone, MapPin, Clock, Lock, Eye, Zap, Database, Printer,
  CheckCircle2, AlertTriangle, Webhook, Key, Search, Save,
  Layers, Monitor, Smartphone, Palette, BarChart3, HardDrive,
  RefreshCw, Download, Upload, Trash2, Plus, ExternalLink,
  Activity, Fingerprint, ShieldCheck, Server, Cpu, CloudUpload,
  ChevronRight, Circle, UserPlus, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";

type SettingsSection = 'general' | 'notifications' | 'compliance' | 'integrations' | 'billing' | 'security' | 'team' | 'data';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { id: 'general' as const, label: 'General', icon: Building2, desc: 'Dealership info & defaults' },
    { id: 'team' as const, label: 'Team & Roles', icon: Users, desc: 'User management' },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell, desc: 'Alerts & channels' },
    { id: 'integrations' as const, label: 'Integrations', icon: Webhook, desc: 'Connected services' },
    { id: 'compliance' as const, label: 'Compliance', icon: Shield, desc: 'Regulatory & audit' },
    { id: 'security' as const, label: 'Security', icon: Lock, desc: 'Access & encryption' },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard, desc: 'Plan & invoices' },
    { id: 'data' as const, label: 'Data & Backup', icon: Database, desc: 'Storage & exports' },
  ];

  return (
    <div className="space-y-5 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage your dealership platform configuration</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <Input
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-48 text-xs pl-8 rounded-lg"
            />
          </div>
          <Button size="sm" className="text-xs h-8 rounded-lg bg-indigo-600 hover:bg-indigo-700 gap-1.5">
            <Save className="w-3.5 h-3.5" />
            Save All
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Nav */}
        <div className="lg:w-56 shrink-0">
          <nav className="space-y-0.5 sticky top-4">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-left w-full transition-all group",
                  activeSection === s.id
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-700/30"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                  activeSection === s.id ? "bg-slate-800/50/10" : "bg-slate-700/50 group-hover:bg-slate-200/70"
                )}>
                  <s.icon className={cn("w-4 h-4", activeSection === s.id ? "text-white" : "text-slate-500")} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{s.label}</p>
                  <p className={cn("text-[10px] truncate", activeSection === s.id ? "text-white/60" : "text-slate-500")}>{s.desc}</p>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {/* GENERAL */}
            {activeSection === 'general' && (
              <motion.div key="general" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Dealership Information</h3>
                        <p className="text-[10px] text-slate-500">Primary business details & rooftop identifiers</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">Dealership Name <span className="text-red-400">*</span></label>
                        <Input defaultValue="AutoNation Ford North Richland Hills" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">DBA / Trade Name</label>
                        <Input defaultValue="AutoNation Ford NRH" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500 flex items-center gap-1">Dealer License # <span className="text-red-400">*</span></label>
                        <Input defaultValue="P124589" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Tax ID (EIN)</label>
                        <Input defaultValue="75-2845901" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Primary Phone</label>
                        <Input defaultValue="(817) 485-2100" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">GM Email</label>
                        <Input defaultValue="gm@autonationfordnrh.com" className="h-9 text-xs rounded-lg" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-500">Street Address</label>
                      <Input defaultValue="7805 Boulevard 26, North Richland Hills, TX 76180" className="h-9 text-xs rounded-lg" />
                    </div>
                    <div className="grid sm:grid-cols-4 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">State</label>
                        <Select defaultValue="TX"><SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TX">Texas</SelectItem><SelectItem value="OK">Oklahoma</SelectItem><SelectItem value="AR">Arkansas</SelectItem><SelectItem value="LA">Louisiana</SelectItem></SelectContent></Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">ZIP</label>
                        <Input defaultValue="76180" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Sales Tax</label>
                        <Input defaultValue="6.25%" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Doc Fee</label>
                        <Input defaultValue="$150.00" className="h-9 text-xs rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Layers className="w-3.5 h-3.5 text-violet-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Deal Configuration</h3>
                        <p className="text-[10px] text-slate-500">Default behaviors for new deals & workflows</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-0">
                    {[
                      { label: 'Auto-calculate TTL', desc: 'Compute tax, title, license on every deal automatically', on: true },
                      { label: 'Auto-pull credit bureau', desc: 'Pull credit on new finance application submission', on: false },
                      { label: 'Require co-signer for Sub-Prime', desc: 'Force co-buyer field when credit score < 600', on: true },
                      { label: 'Default 72-month term', desc: 'Pre-select 72mo on retail finance deals', on: true },
                      { label: 'E-contracting enabled', desc: 'Send contracts electronically via RouteOne / DealerTrack', on: true },
                      { label: 'Compliance waterfall', desc: 'Enforce OFAC → Red Flags → Privacy Notice sequence', on: true },
                      { label: 'Auto-submit to DMS on funding', desc: 'Push funded deals to accounting system automatically', on: true },
                      { label: 'Menu presentation required', desc: 'Block deal save until F&I menu is presented', on: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3.5 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-slate-200">{item.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.on} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Regional & Locale</h3>
                        <p className="text-[10px] text-slate-500">Time zone, currency, and formatting preferences</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Timezone</label>
                        <Select defaultValue="CST"><SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CST">Central (CST/CDT)</SelectItem><SelectItem value="EST">Eastern (EST/EDT)</SelectItem><SelectItem value="PST">Pacific (PST/PDT)</SelectItem><SelectItem value="MST">Mountain (MST/MDT)</SelectItem></SelectContent></Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Currency</label>
                        <Select defaultValue="USD"><SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="USD">USD ($)</SelectItem><SelectItem value="CAD">CAD (C$)</SelectItem></SelectContent></Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Date Format</label>
                        <Select defaultValue="MM/DD/YYYY"><SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem><SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem><SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem></SelectContent></Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* TEAM & ROLES */}
            {activeSection === 'team' && (
              <motion.div key="team" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Users className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Team Members</h3>
                        <p className="text-[10px] text-slate-500">12 of 25 seats used</p>
                      </div>
                    </div>
                    <Button size="sm" className="text-xs h-7 rounded-lg gap-1 bg-indigo-600 hover:bg-indigo-700">
                      <UserPlus className="w-3 h-3" /> Invite
                    </Button>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                      {[
                        { name: 'Marcus Williams', email: 'mwilliams@autonationfordnrh.com', role: 'F&I Director', avatar: 'MW' },
                        { name: 'Sarah Chen', email: 'schen@autonationfordnrh.com', role: 'F&I Manager', avatar: 'SC' },
                        { name: 'Derek Patterson', email: 'dpatterson@autonationfordnrh.com', role: 'Sales Manager', avatar: 'DP' },
                        { name: 'Jennifer Rodriguez', email: 'jrodriguez@autonationfordnrh.com', role: 'Sales Consultant', avatar: 'JR' },
                        { name: 'Ahmad Hassan', email: 'ahassan@autonationfordnrh.com', role: 'Sales Consultant', avatar: 'AH' },
                        { name: 'Brian Kowalski', email: 'bkowalski@autonationfordnrh.com', role: 'BDC Manager', avatar: 'BK' },
                        { name: 'Lisa Tran', email: 'ltran@autonationfordnrh.com', role: 'Title Clerk', avatar: 'LT' },
                        { name: 'Mike Donovan', email: 'mdonovan@autonationfordnrh.com', role: 'General Manager', avatar: 'MD' },
                      ].map((u, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-700/30/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center">
                              <span className="text-[10px] font-bold text-indigo-600">{u.avatar}</span>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-200">{u.name}</p>
                              <p className="text-[10px] text-slate-500">{u.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-[9px] h-5 px-2 rounded-md">{u.role}</Badge>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Crown className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Role Permissions Matrix</h3>
                        <p className="text-[10px] text-slate-500">Configure access levels by role</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4 overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-700/50">
                          <th className="text-left py-2 font-medium text-slate-500 pr-4">Permission</th>
                          <th className="text-center py-2 font-medium text-slate-500 px-2">GM</th>
                          <th className="text-center py-2 font-medium text-slate-500 px-2">F&I Dir</th>
                          <th className="text-center py-2 font-medium text-slate-500 px-2">F&I Mgr</th>
                          <th className="text-center py-2 font-medium text-slate-500 px-2">Sales Mgr</th>
                          <th className="text-center py-2 font-medium text-slate-500 px-2">Sales</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { perm: 'Desking & Pencil', gm: true, fid: true, fi: true, sm: true, s: false },
                          { perm: 'Credit Bureau Pull', gm: true, fid: true, fi: true, sm: false, s: false },
                          { perm: 'Lender Submission', gm: true, fid: true, fi: true, sm: false, s: false },
                          { perm: 'F&I Menu Present', gm: true, fid: true, fi: true, sm: false, s: false },
                          { perm: 'E-Contracting', gm: true, fid: true, fi: true, sm: false, s: false },
                          { perm: 'Inventory Pricing', gm: true, fid: true, fi: false, sm: true, s: false },
                          { perm: 'Reporting (P&L)', gm: true, fid: true, fi: false, sm: false, s: false },
                          { perm: 'User Admin', gm: true, fid: false, fi: false, sm: false, s: false },
                        ].map((r, i) => (
                          <tr key={i} className="border-b border-slate-50 last:border-0">
                            <td className="py-2.5 text-slate-300 font-medium pr-4">{r.perm}</td>
                            {[r.gm, r.fid, r.fi, r.sm, r.s].map((v, j) => (
                              <td key={j} className="text-center py-2.5 px-2">
                                {v ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <Circle className="w-3.5 h-3.5 text-slate-200 mx-auto" />}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center">
                        <Bell className="w-3.5 h-3.5 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Notification Channels</h3>
                        <p className="text-[10px] text-slate-500">Configure how you receive alerts by event type</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    {/* Channel headers */}
                    <div className="flex items-center justify-end gap-5 mb-3 pr-1">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Email</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Monitor className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">Push</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3 h-3 text-slate-500" />
                        <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">SMS</span>
                      </div>
                    </div>
                    <div className="space-y-0">
                      {[
                        { label: 'Deal Approved by Lender', desc: 'Immediate notification when a lender approves', email: true, push: true, sms: false },
                        { label: 'Deal Funded', desc: 'When funding hits the dealer reserve account', email: true, push: true, sms: true },
                        { label: 'Stipulation Received', desc: 'Customer uploads proof of income / residence', email: false, push: true, sms: false },
                        { label: 'Deal Declined / Conditioned Out', desc: 'Lender declines or requests re-structure', email: true, push: true, sms: true },
                        { label: 'Inventory Aged 30+ Days', desc: 'Vehicle hits 30 days on lot without sale', email: true, push: false, sms: false },
                        { label: 'New Lead Assigned', desc: 'CRM assigns a fresh internet lead to you', email: false, push: true, sms: true },
                        { label: 'E-Contract Signed', desc: 'All parties have signed the retail contract', email: true, push: true, sms: false },
                        { label: 'Compliance Alert', desc: 'OFAC hit, expired license, or regulatory flag', email: true, push: true, sms: true },
                        { label: 'Rate Lock Expiring', desc: 'Buy-rate approval expires within 24 hours', email: true, push: true, sms: false },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-200">{item.label}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                          </div>
                          <div className="flex items-center gap-6 shrink-0 ml-6">
                            <Switch defaultChecked={item.email} className="scale-[0.8]" />
                            <Switch defaultChecked={item.push} className="scale-[0.8]" />
                            <Switch defaultChecked={item.sms} className="scale-[0.8]" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Quiet Hours</h3>
                        <p className="text-[10px] text-slate-500">Suppress non-urgent notifications outside business hours</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xs font-medium text-slate-200">Enable quiet hours</p>
                        <p className="text-[10px] text-slate-500">Only critical alerts will come through</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">Start</label>
                        <Input defaultValue="9:00 PM" className="h-9 text-xs rounded-lg" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-slate-500">End</label>
                        <Input defaultValue="7:00 AM" className="h-9 text-xs rounded-lg" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* INTEGRATIONS */}
            {activeSection === 'integrations' && (
              <motion.div key="integrations" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 flex items-center justify-center">
                        <Webhook className="w-3.5 h-3.5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Connected Services</h3>
                        <p className="text-[10px] text-slate-500">5 of 11 integrations active</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    {[
                      { name: 'RouteOne', desc: 'Credit app submission & e-contracting', status: 'connected', lastSync: '2 min ago' },
                      { name: 'DealerTrack', desc: 'Multi-lender credit decisioning platform', status: 'connected', lastSync: '5 min ago' },
                      { name: '700Credit', desc: 'Bureau pulls — Equifax, TransUnion, Experian', status: 'connected', lastSync: '12 min ago' },
                      { name: 'vAuto / Provision', desc: 'Market-based pricing & inventory analytics', status: 'connected', lastSync: '1 hr ago' },
                      { name: 'Carfax Dealer', desc: 'Vehicle history reports & Carfax Advantage', status: 'connected', lastSync: '30 min ago' },
                      { name: 'DocuSign', desc: 'Electronic signature & remote delivery', status: 'available', lastSync: '' },
                      { name: 'CDK Global', desc: 'DMS accounting & legacy system bridge', status: 'available', lastSync: '' },
                      { name: 'Tekion CRM', desc: 'Cloud-native DMS data synchronization', status: 'available', lastSync: '' },
                      { name: 'KBB / Autotrader', desc: 'Leads & trade-in valuations', status: 'available', lastSync: '' },
                      { name: 'Cars.com', desc: 'Listing syndication & lead routing', status: 'available', lastSync: '' },
                      { name: 'TrueCar', desc: 'Certified pricing & lead generation', status: 'available', lastSync: '' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-700/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                            item.status === 'connected' ? "bg-emerald-50" : "bg-slate-800/40"
                          )}>
                            <Zap className={cn("w-4 h-4", item.status === 'connected' ? "text-emerald-500" : "text-slate-300")} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-medium text-slate-200">{item.name}</p>
                              {item.status === 'connected' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                            </div>
                            <p className="text-[10px] text-slate-500 truncate">{item.desc}</p>
                            {item.lastSync && <p className="text-[9px] text-emerald-500 mt-0.5">Last sync: {item.lastSync}</p>}
                          </div>
                        </div>
                        <div className="shrink-0 ml-3">
                          {item.status === 'connected' ? (
                            <Badge className="text-[9px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200 gap-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Live
                            </Badge>
                          ) : (
                            <Button variant="outline" size="sm" className="text-[10px] h-7 px-3 rounded-lg gap-1">
                              <Plus className="w-3 h-3" /> Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
                        <Key className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">API Access</h3>
                        <p className="text-[10px] text-slate-500">Programmatic access keys for custom integrations</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    {[
                      { label: 'Production Key', key: 'dms_live_••••••••••4f8a', created: 'Jan 15, 2026', lastUsed: '2 min ago' },
                      { label: 'Staging Key', key: 'dms_test_••••••••••7b2c', created: 'Mar 1, 2026', lastUsed: '3 days ago' },
                    ].map((k, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <Key className="w-4 h-4 text-slate-500" />
                          <div>
                            <p className="text-xs font-medium text-slate-200">{k.label}</p>
                            <p className="text-[10px] text-slate-500 font-mono">{k.key}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">Created {k.created} • Last used {k.lastUsed}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 rounded-md gap-1"><Eye className="w-3 h-3" />Reveal</Button>
                          <Button variant="outline" size="sm" className="text-[10px] h-6 px-2 rounded-md gap-1"><RefreshCw className="w-3 h-3" />Rotate</Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5 w-full mt-2">
                      <Plus className="w-3.5 h-3.5" /> Generate New Key
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* COMPLIANCE */}
            {activeSection === 'compliance' && (
              <motion.div key="compliance" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                        <Shield className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Regulatory Status</h3>
                        <p className="text-[10px] text-slate-500">CFPB, FTC Safeguards, OFAC, Red Flags Rule, GLBA</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        { label: 'OFAC / SDN Check', status: 'Active', severity: 'ok', lastAudit: 'May 19, 2026' },
                        { label: 'Red Flags Rule', status: 'Active', severity: 'ok', lastAudit: 'May 18, 2026' },
                        { label: 'FTC Safeguards Rule', status: 'Active', severity: 'ok', lastAudit: 'May 15, 2026' },
                        { label: 'Privacy Notice (GLBA)', status: 'Active', severity: 'ok', lastAudit: 'May 10, 2026' },
                        { label: 'Risk-Based Pricing', status: 'Review Due', severity: 'warn', lastAudit: 'Apr 20, 2026' },
                        { label: 'Adverse Action Notices', status: 'Active', severity: 'ok', lastAudit: 'May 17, 2026' },
                        { label: 'Equal Credit Opportunity', status: 'Active', severity: 'ok', lastAudit: 'May 12, 2026' },
                        { label: 'TCPA / DNC Compliance', status: 'Active', severity: 'ok', lastAudit: 'May 8, 2026' },
                      ].map((c, i) => (
                        <div key={i} className="p-3.5 rounded-xl border border-slate-700/50 hover:border-slate-700 transition-colors">
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              {c.severity === 'ok'
                                ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                : <AlertTriangle className="w-4 h-4 text-amber-500" />
                              }
                              <span className="text-xs font-medium text-slate-200">{c.label}</span>
                            </div>
                            <Badge variant="outline" className={cn(
                              "text-[9px] h-4 px-1.5",
                              c.severity === 'ok' ? "text-emerald-600 border-emerald-200" : "text-amber-600 border-amber-200"
                            )}>{c.status}</Badge>
                          </div>
                          <p className="text-[9px] text-slate-500 ml-6">Last audit: {c.lastAudit}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Compliance Rules Engine</h3>
                        <p className="text-[10px] text-slate-500">Automated enforcement policies</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-0">
                    {[
                      { label: 'Rate markup cap enforcement', desc: 'Auto-cap dealer reserve based on configured bps', on: true },
                      { label: 'Adverse action auto-generate', desc: 'Create & send notices within 30 days of decline', on: true },
                      { label: 'Deal jacket audit trail', desc: 'Immutable log of all changes with user + timestamp', on: true },
                      { label: 'OFAC screening on every deal', desc: 'Check all parties against SDN list at submission', on: true },
                      { label: 'Privacy notice before credit pull', desc: 'Force privacy notice acknowledgment first', on: true },
                      { label: 'Disparate impact monitoring', desc: 'Flag potential fair-lending violations in real-time', on: false },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-slate-200">{item.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.on} />
                      </div>
                    ))}
                    <div className="pt-4 space-y-1.5">
                      <label className="text-[11px] font-medium text-slate-500">Maximum Rate Spread (basis points)</label>
                      <Input defaultValue="250" className="h-9 text-xs rounded-lg w-36" />
                      <p className="text-[9px] text-slate-500">CFPB safe harbor recommendation: ≤ 250 bps over buy rate</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* SECURITY */}
            {activeSection === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                        <Fingerprint className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Authentication & Access Control</h3>
                        <p className="text-[10px] text-slate-500">Multi-factor authentication & session policies</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-0">
                    {[
                      { label: 'Two-factor authentication (TOTP)', desc: 'Require authenticator app on every login', on: true },
                      { label: 'SMS fallback for 2FA', desc: 'Allow SMS codes when authenticator unavailable', on: true },
                      { label: 'Session timeout (15 min)', desc: 'Auto-logout after 15 minutes of inactivity', on: true },
                      { label: 'IP allowlist restriction', desc: 'Only allow access from dealership network IPs', on: false },
                      { label: 'SSO via Microsoft Entra ID', desc: 'Single sign-on with Azure Active Directory', on: false },
                      { label: 'Forced password rotation (90 days)', desc: 'Require password change every 90 days', on: true },
                      { label: 'PCI-DSS mode', desc: 'Mask credit card fields, encrypt at rest, TLS 1.3', on: true },
                      { label: 'Audit log retention (365 days)', desc: 'Keep all user activity logs for 1 year', on: true },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-xs font-medium text-slate-200">{item.label}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Switch defaultChecked={item.on} />
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-100 flex items-center justify-center">
                        <Monitor className="w-3.5 h-3.5 text-cyan-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Active Sessions</h3>
                        <p className="text-[10px] text-slate-500">Devices currently signed in to your account</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-2.5">
                    {[
                      { device: 'Chrome 125 — Windows 11', ip: '192.168.1.45', location: 'Fort Worth, TX', time: 'Active now', current: true },
                      { device: 'Safari 18 — iPhone 15 Pro', ip: '172.16.0.88', location: 'Arlington, TX', time: '2 hours ago', current: false },
                      { device: 'Edge 124 — Windows 11', ip: '10.0.0.12', location: 'Dallas, TX', time: '1 day ago', current: false },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", s.current ? "bg-emerald-50" : "bg-slate-800/40")}>
                            <Monitor className={cn("w-4 h-4", s.current ? "text-emerald-500" : "text-slate-500")} />
                          </div>
                          <div>
                            <p className="text-xs font-medium text-slate-200">{s.device}</p>
                            <p className="text-[10px] text-slate-500">{s.location} • {s.ip} • {s.time}</p>
                          </div>
                        </div>
                        {s.current ? (
                          <Badge className="text-[9px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200 gap-0.5">
                            <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" /> Current
                          </Badge>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-[10px] h-6 text-red-500 hover:text-red-600 hover:bg-red-50">Revoke</Button>
                        )}
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg w-full mt-3 text-red-600 border-red-200 hover:bg-red-50">
                      Revoke All Other Sessions
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* BILLING */}
            {activeSection === 'billing' && (
              <motion.div key="billing" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Current Plan</h3>
                        <p className="text-[10px] text-slate-500">Active since January 2024</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                      <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                      <div className="relative flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Crown className="w-4 h-4 text-amber-400" />
                            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-400">Enterprise Plan</span>
                          </div>
                          <p className="text-lg font-bold">DMSPilot Enterprise</p>
                          <p className="text-[11px] text-white/60 mt-1">Unlimited users • All modules • Priority support • SLA 99.9%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold">$2,499</p>
                          <p className="text-[11px] text-white/50">/month</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 space-y-0">
                      {[
                        { label: 'Billing cycle', value: 'Monthly (auto-renew)' },
                        { label: 'Next invoice date', value: 'June 1, 2026' },
                        { label: 'Payment method', value: 'Visa •••• 4242 (exp. 08/28)' },
                        { label: 'Account status', value: 'Active', badge: true },
                        { label: 'Contract term', value: '36 months (ends Dec 2026)' },
                        { label: 'Annual value', value: '$29,988' },
                      ].map((r, i) => (
                        <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                          <span className="text-xs text-slate-500">{r.label}</span>
                          {r.badge
                            ? <Badge className="text-[9px] h-5 bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                            : <span className="text-xs font-medium text-slate-200">{r.value}</span>
                          }
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Recent Invoices</h3>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-50">
                      {[
                        { id: 'INV-2026-005', date: 'May 1, 2026', amount: '$2,499.00', status: 'Paid' },
                        { id: 'INV-2026-004', date: 'Apr 1, 2026', amount: '$2,499.00', status: 'Paid' },
                        { id: 'INV-2026-003', date: 'Mar 1, 2026', amount: '$2,499.00', status: 'Paid' },
                        { id: 'INV-2026-002', date: 'Feb 1, 2026', amount: '$2,499.00', status: 'Paid' },
                        { id: 'INV-2026-001', date: 'Jan 1, 2026', amount: '$2,499.00', status: 'Paid' },
                      ].map((inv, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-slate-300" />
                            <div>
                              <p className="text-xs font-medium text-slate-200">{inv.id}</p>
                              <p className="text-[10px] text-slate-500">{inv.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-200">{inv.amount}</span>
                            <Badge className="text-[9px] h-4 bg-emerald-50 text-emerald-700 border-emerald-200">{inv.status}</Badge>
                            <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 gap-1"><Download className="w-3 h-3" />PDF</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* DATA & BACKUP */}
            {activeSection === 'data' && (
              <motion.div key="data" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }} className="space-y-4">
                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center">
                        <HardDrive className="w-3.5 h-3.5 text-sky-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Storage & Usage</h3>
                        <p className="text-[10px] text-slate-500">Current data consumption across modules</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-slate-300">Total Storage</span>
                          <span className="text-xs text-slate-500">47.2 GB / 100 GB</span>
                        </div>
                        <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: '47%' }}></div>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {[
                          { label: 'Deal Jackets & Documents', size: '22.8 GB', pct: 48, color: 'from-indigo-500 to-indigo-600' },
                          { label: 'Vehicle Photos', size: '14.1 GB', pct: 30, color: 'from-violet-500 to-violet-600' },
                          { label: 'Audit Logs', size: '6.4 GB', pct: 14, color: 'from-emerald-500 to-emerald-600' },
                          { label: 'System Data', size: '3.9 GB', pct: 8, color: 'from-amber-500 to-amber-600' },
                        ].map((s, i) => (
                          <div key={i} className="p-3 rounded-xl border border-slate-700/50">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-medium text-slate-300">{s.label}</span>
                              <span className="text-[10px] text-slate-500">{s.size}</span>
                            </div>
                            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                              <div className={cn("h-full rounded-full bg-gradient-to-r", s.color)} style={{ width: `${s.pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-700/50 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                        <CloudUpload className="w-3.5 h-3.5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-200">Backups</h3>
                        <p className="text-[10px] text-slate-500">Automated daily backups with 90-day retention</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-xs font-medium text-slate-200">Automatic daily backup</p>
                        <p className="text-[10px] text-slate-500">Runs every night at 2:00 AM CST</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="space-y-2">
                      {[
                        { date: 'May 20, 2026 — 2:00 AM', size: '2.3 GB', status: 'Complete' },
                        { date: 'May 19, 2026 — 2:00 AM', size: '2.3 GB', status: 'Complete' },
                        { date: 'May 18, 2026 — 2:00 AM', size: '2.2 GB', status: 'Complete' },
                      ].map((b, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-700/50">
                          <div className="flex items-center gap-2.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <div>
                              <p className="text-[11px] font-medium text-slate-300">{b.date}</p>
                              <p className="text-[9px] text-slate-500">{b.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[10px] h-6 px-2 gap-1"><Download className="w-3 h-3" />Restore</Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5 flex-1">
                        <Download className="w-3.5 h-3.5" /> Export All Data
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs h-8 rounded-lg gap-1.5 flex-1">
                        <Upload className="w-3.5 h-3.5" /> Import Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-100 rounded-xl overflow-hidden">
                  <div className="p-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-red-800">Danger Zone</h3>
                        <p className="text-[10px] text-red-400">Irreversible actions — proceed with caution</p>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-200">Purge test data</p>
                        <p className="text-[10px] text-slate-500">Remove all demo / sandbox deals from production</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-[10px] h-7 rounded-lg text-red-600 border-red-200 hover:bg-red-50">Purge</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-200">Delete all data & close account</p>
                        <p className="text-[10px] text-slate-500">Permanently delete all dealership data</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-[10px] h-7 rounded-lg text-red-600 border-red-200 hover:bg-red-50">Delete</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
