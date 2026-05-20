"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileCheck, 
  Send, 
  Signature, 
  CloudRain, 
  History, 
  ShieldCheck, 
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DigitalDealJacketProps {
  dealId: string;
  customerName: string;
}

export const DigitalDealJacket = ({ dealId, customerName }: DigitalDealJacketProps) => {
  const [status, setStatus] = useState<'Not Started' | 'Sent' | 'Signing' | 'Completed'>('Not Started');
  const [documents, setDocuments] = useState([
    { id: 'doc-1', name: 'Purchase Order', status: 'Approved', category: 'Sales' },
    { id: 'doc-2', name: 'Credit Application', status: 'Approved', category: 'Lender' },
    { id: 'doc-3', name: 'Odometer Statement', status: 'Pending', category: 'Compliance' },
    { id: 'doc-4', name: 'Privacy Notice', status: 'Pending', category: 'Compliance' },
    { id: 'doc-5', name: 'Truth in Lending (TIL)', status: 'Pending', category: 'Lender' },
  ]);

  const handleSendForSigning = () => {
    setStatus('Sent');
    setTimeout(() => {
      alert(`Deal Jacket ${dealId} has been securely transmitted to ${customerName}'s mobile portal.`);
    }, 1000);
  };

  const handleSimulateSigning = () => {
    setStatus('Signing');
    setTimeout(() => {
      setStatus('Completed');
      setDocuments(docs => docs.map(d => ({ ...d, status: 'Approved' })));
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Digital Deal Jacket</h3>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">DMSPilot eContracting Lifecycle</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge className={cn(
             "h-7 px-4 font-black text-[10px] uppercase tracking-widest",
             status === 'Not Started' ? "bg-slate-100 text-slate-500" :
             status === 'Sent' ? "bg-blue-100 text-blue-600" :
             status === 'Signing' ? "bg-amber-100 text-amber-600 animate-pulse" :
             "bg-emerald-100 text-emerald-600"
           )}>
             {status}
           </Badge>
        </div>
      </div>

      <div className="grid gap-3">
        {documents.map((doc, i) => (
          <motion.div 
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-700/50 bg-slate-800/50 hover:border-slate-600 group transition-all"
          >
            <div className="flex items-center gap-4">
               <div className={cn(
                 "w-10 h-10 rounded-lg flex items-center justify-center",
                 doc.status === 'Approved' ? "bg-emerald-50 text-emerald-600" : "bg-slate-700/50 text-slate-400"
               )}>
                  <FileCheck className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{doc.category}</span>
                     {doc.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                  </div>
               </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600">
                  <Eye className="w-4 h-4" />
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-emerald-600">
                  <Download className="w-4 h-4" />
               </Button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {status === 'Not Started' ? (
          <Button 
            onClick={handleSendForSigning}
            className="col-span-2 h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl"
          >
            <Send className="w-4 h-4 mr-2" /> Start Remote Signing
          </Button>
        ) : status === 'Sent' ? (
          <>
            <Button 
              variant="outline"
              className="h-14 border-slate-700 text-slate-500 font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              <History className="w-4 h-4 mr-2" /> Resend Link
            </Button>
            <Button 
              onClick={handleSimulateSigning}
              className="h-14 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl"
            >
              <Signature className="w-4 h-4 mr-2" /> Simulate Sign
            </Button>
          </>
        ) : status === 'Signing' ? (
          <Button disabled className="col-span-2 h-14 bg-amber-100 text-amber-600 border-none animate-pulse font-black text-xs uppercase tracking-widest rounded-2xl">
            <Clock className="w-4 h-4 mr-2" /> Customer is Signing...
          </Button>
        ) : (
          <div className="col-span-2 p-6 rounded-3xl bg-emerald-600 text-white text-center">
             <div className="w-12 h-12 bg-slate-800/50/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <h4 className="text-xl font-black mb-1">Deal Jacket Executed</h4>
             <p className="text-xs font-semibold text-emerald-100">All compliance checks passed. Pushed to funding queue.</p>
             <div className="flex items-center justify-center gap-2 mt-4">
                <Button variant="outline" className="bg-slate-800/50/10 border-white/20 text-white hover:bg-slate-800/50/20 border-none font-bold text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl">
                   <CloudRain className="w-3 h-3 mr-2" /> Accelerated Funding
                </Button>
                <Button variant="outline" className="bg-slate-800/50/10 border-white/20 text-white hover:bg-slate-800/50/20 border-none font-bold text-[10px] uppercase tracking-widest h-9 px-6 rounded-xl">
                   <ShieldCheck className="w-3 h-3 mr-2" /> Compliance Jacketed
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
