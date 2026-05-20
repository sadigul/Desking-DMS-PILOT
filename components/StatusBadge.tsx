"use client";

import { Badge } from "@/components/ui/badge";
import { Deal } from "@/store/appStore";
import { 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText 
} from "lucide-react";

export const StatusBadge = ({ status }: { status: Deal['status'] }) => {
  const configs: Record<Deal['status'], { icon: any; gradient: string; text: string; border: string; ring: string }> = {
    'Pending': { icon: Clock, gradient: 'bg-gradient-to-r from-amber-50 to-orange-50', text: 'text-amber-700', border: 'border-amber-200/60', ring: 'ring-amber-500/10' },
    'Approved': { icon: ShieldCheck, gradient: 'bg-gradient-to-r from-blue-50 to-indigo-50', text: 'text-blue-700', border: 'border-blue-200/60', ring: 'ring-blue-500/10' },
    'Funded': { icon: CheckCircle2, gradient: 'bg-gradient-to-r from-emerald-50 to-teal-50', text: 'text-emerald-700', border: 'border-emerald-200/60', ring: 'ring-emerald-500/10' },
    'Draft': { icon: FileText, gradient: 'bg-gradient-to-r from-slate-50 to-slate-100', text: 'text-slate-700', border: 'border-slate-200/60', ring: 'ring-slate-500/10' },
    'Stuck': { icon: AlertCircle, gradient: 'bg-gradient-to-r from-red-50 to-rose-50', text: 'text-red-700', border: 'border-red-200/60', ring: 'ring-red-500/10' },
  };

  const config = configs[status] || configs['Pending'];
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1 text-[10px] font-medium transition-all px-2 py-0.5 border ${config.gradient} ${config.text} ${config.border}`}>
      <Icon className="w-3 h-3" />
      {status}
    </Badge>
  );
};
