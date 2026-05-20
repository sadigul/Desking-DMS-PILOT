"use client";

import { Badge } from "@/components/ui/badge";
import { Vehicle } from "@/store/appStore";
import { 
  CheckCircle2, 
  Truck, 
  DollarSign,
  PackageCheck
} from "lucide-react";

export const VehicleStatusBadge = ({ status }: { status: Vehicle['status'] }) => {
  const configs: Record<Vehicle['status'], { icon: any; gradient: string; text: string; border: string; ring: string }> = {
    'In Stock': { icon: CheckCircle2, gradient: 'bg-gradient-to-r from-emerald-50 to-teal-50', text: 'text-emerald-700', border: 'border-emerald-200/60', ring: 'ring-emerald-500/10' },
    'In Transit': { icon: Truck, gradient: 'bg-gradient-to-r from-blue-50 to-indigo-50', text: 'text-blue-700', border: 'border-blue-200/60', ring: 'ring-blue-500/10' },
    'Sold': { icon: PackageCheck, gradient: 'bg-gradient-to-r from-rose-50 to-red-50', text: 'text-rose-700', border: 'border-rose-200/60', ring: 'ring-rose-500/10' },
  };

  const config = configs[status] || configs['In Stock'];
  const Icon = config.icon;

  return (
    <Badge className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider transition-all px-2 py-0.5 border ring-1 ${config.gradient} ${config.text} ${config.border} ${config.ring}`}>
      <Icon className="w-3 h-3 stroke-[2.5px]" />
      {status}
    </Badge>
  );
};
