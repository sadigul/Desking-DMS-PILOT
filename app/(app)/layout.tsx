"use client";

import { ReactNode, useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CarFront, Calculator, FileSignature, Users, BarChart3, Bell, UserCircle, Search, Menu, X, ArrowRight, ShieldCheck, ChevronRight, Settings, Gauge, Wallet, UserCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/appStore";
import { AiChat } from "@/components/AiChat";
import { motion, AnimatePresence } from "motion/react";

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { deals } = useAppStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return deals.filter(d => 
      d.customer.toLowerCase().includes(query) || 
      d.vehicle.toLowerCase().includes(query) || 
      d.id.toLowerCase().includes(query)
    ).slice(0, 5);
  }, [deals, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { label: "Command Center", href: "/dashboard", icon: Gauge },
    { label: "Deal Desk", href: "/desking", icon: Calculator },
    { label: "Inventory", href: "/inventory", icon: CarFront },
    { label: "Customers", href: "/customers", icon: Users },
    { label: "Pre-Validation", href: "/lenders", icon: ShieldCheck },
  ];

  const adminItems = [
    { label: "Deal Pipeline", href: "/pipeline", icon: FileSignature },
    { label: "F&I Menu", href: "/fi-menu", icon: ShieldCheck },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,16%,96%)] flex flex-col lg:flex-row font-sans text-slate-900 overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 flex items-center justify-between h-14 px-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <img src="https://www.dmspilot.com/logo.svg" alt="DMSPilot" className="h-8 w-auto" />
          <span className="font-display font-extrabold text-base tracking-tight text-slate-900">DMSPilot</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-14 bottom-0 z-50 w-[260px] bg-white border-r border-slate-200/40 overflow-y-auto"
            >
              <nav className="p-3 space-y-1">
                <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Sales Floor</p>
                {menuItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive 
                          ? "bg-indigo-50 text-indigo-700" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-indigo-600" : "text-slate-400")} />
                      {item.label}
                    </Link>
                  );
                })}
                <p className="px-3 py-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Operations</p>
                {adminItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                        isActive 
                          ? "bg-indigo-50 text-indigo-700" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-indigo-600" : "text-slate-400")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-shrink-0 flex-col fixed inset-y-0 left-0 z-30 glass-sidebar">
        <div className="h-16 flex items-center px-6 border-b border-slate-100/60">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <img src="https://www.dmspilot.com/logo.svg" alt="DMSPilot" className="h-9 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-[15px] tracking-tight leading-none text-slate-900">DMSPilot</span>
              <span className="text-[9px] font-semibold text-indigo-600 tracking-[0.15em] uppercase mt-0.5">Workbench</span>
            </div>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Sales Floor</p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-indigo-50/80 text-indigo-700 font-semibold" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                  isActive ? "bg-indigo-100" : "bg-transparent group-hover:bg-slate-100"
                )}>
                  <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                </div>
                <span className="text-[13px] font-medium">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </Link>
            );
          })}
          
          <div className="pt-6">
            <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Operations</p>
            {adminItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                    isActive 
                      ? "bg-indigo-50/80 text-indigo-700 font-semibold" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-indigo-100" : "bg-transparent group-hover:bg-slate-100"
                  )}>
                    <item.icon className={cn("w-[18px] h-[18px]", isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
                  </div>
                  <span className="text-[13px] font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-indigo-600 rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100/60">
          <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm">MW</div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate">Marcus Williams</p>
              <p className="text-[11px] text-slate-400 truncate">F&I Director</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[260px]">
        {/* Top Header - Desktop */}
        <header className="glass-header h-16 hidden lg:flex items-center justify-between px-6 xl:px-8">
          <div className="relative w-full max-w-md" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search deals, clients, VINs..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200/60 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/10 focus:bg-white focus:border-indigo-200 transition-all outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 p-0.5 hover:bg-slate-200 rounded-md transition-colors">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                </button>
              )}
            </div>

            <AnimatePresence>
              {isSearchOpen && searchQuery && (
                <motion.div 
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-200/60 rounded-xl shadow-lg shadow-slate-200/50 overflow-hidden z-[100]"
                >
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Results</span>
                    <LocalBadge variant="outline">AI Powered</LocalBadge>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {filteredResults.map(deal => (
                      <Link 
                        key={deal.id} 
                        href="/pipeline" 
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center font-semibold text-slate-600 text-sm">
                            {deal.customer[0]}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{deal.customer}</p>
                            <p className="text-[11px] text-slate-400">{deal.id} · {deal.vehicle}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </Link>
                    ))}
                    {filteredResults.length === 0 && (
                      <div className="p-8 text-center text-slate-400">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">No results for &ldquo;{searchQuery}&rdquo;</p>
                      </div>
                    )}
                  </div>
                  {filteredResults.length > 0 && (
                    <Link 
                      href="/pipeline" 
                      className="block px-4 py-3 text-center text-xs font-medium text-indigo-600 hover:bg-indigo-50/50 transition-colors border-t border-slate-100"
                    >
                      View all results →
                    </Link>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200/60"></div>
            <div className="flex items-center gap-3 pl-1 cursor-pointer group">
              <div className="text-right hidden xl:block">
                <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors leading-tight">Marcus Williams</p>
                <p className="text-[11px] text-slate-400">F&I Director</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center overflow-hidden group-hover:border-indigo-200 transition-all">
                <UserCircle className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto responsive-padding scroll-smooth">
          <div className="w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <AiChat />
      </div>
    </div>
  );
}

const LocalBadge = ({ children, variant = 'default', className }: { children: ReactNode, variant?: 'default' | 'outline', className?: string }) => {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-md text-[10px] font-medium",
      variant === 'default' ? "bg-indigo-600 text-white" : "border border-slate-200 text-slate-500",
      className
    )}>
      {children}
    </span>
  );
};
