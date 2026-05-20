"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Sparkles, DollarSign,
  Send, RotateCcw, Zap, TrendingUp,
  AlertOctagon, Lightbulb, Brain, Clock,
  BadgeCheck, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CheckStatus = 'pass' | 'fail' | 'warning';

interface ValidationCheck {
  id: string;
  category: string;
  label: string;
  status: CheckStatus;
  message: string;
  aiSuggestion?: string;
  savingsImpact?: string;
}

const VALIDATION_CHECKS: ValidationCheck[] = [
  {
    id: '1', category: 'Credit', label: 'Credit Score Minimum',
    status: 'pass',
    message: 'Equifax 752 exceeds minimum threshold (620) for Ford Motor Credit',
  },
  {
    id: '2', category: 'Credit', label: 'Debt-to-Income Ratio',
    status: 'warning',
    message: 'DTI at 43% — Ford Motor Credit auto-declines above 45%. Borderline risk.',
    aiSuggestion: 'Recommend extending term to 72mo to reduce payment by $87/mo, bringing DTI to 39%. Or add co-borrower to strengthen application.',
    savingsImpact: 'Saves $50 submission fee + avoids 48hr resubmission delay',
  },
  {
    id: '3', category: 'Income', label: 'Proof of Income',
    status: 'fail',
    message: 'Missing 2nd paystub — Ford Motor Credit requires 2 consecutive paystubs for income over $6,000/mo.',
    aiSuggestion: 'Request most recent paystub from customer. Alternatively, bank statements (last 3 months) are accepted as secondary verification for this lender.',
    savingsImpact: 'Guaranteed decline without this — saves $50 + prevents deal death',
  },
  {
    id: '4', category: 'Stipulations', label: 'Proof of Residence',
    status: 'pass',
    message: 'Utility bill uploaded and matches application address',
  },
  {
    id: '5', category: 'Vehicle', label: 'Book Value vs. Advance',
    status: 'warning',
    message: 'Selling price $52,480 is 118% of NADA clean retail ($44,475). Ford Credit max advance is 120%.',
    aiSuggestion: 'You\'re at the edge. Consider adding GAP to cap cost (lender favors GAP deals) or reduce selling price by $800 to create a 115% LTV buffer.',
    savingsImpact: 'Reduces conditional approval risk — saves 24-48hr rework',
  },
  {
    id: '6', category: 'Vehicle', label: 'Mileage Check',
    status: 'pass',
    message: 'New vehicle — 12 miles. No mileage concerns.',
  },
  {
    id: '7', category: 'Compliance', label: 'OFAC / SDN Screening',
    status: 'pass',
    message: 'All parties cleared against OFAC Specially Designated Nationals list',
  },
  {
    id: '8', category: 'Compliance', label: 'Privacy Notice Acknowledged',
    status: 'fail',
    message: 'Customer has NOT signed the Privacy Notice disclosure. Federal requirement before any credit pull.',
    aiSuggestion: 'Send Privacy Notice via e-sign immediately. This is a hard regulatory requirement — cannot submit without it. Auto-generate from deal jacket and push to customer\'s email on file.',
    savingsImpact: 'Prevents compliance violation + $50 wasted submission',
  },
  {
    id: '9', category: 'Structure', label: 'Payment-to-Income Ratio',
    status: 'pass',
    message: 'PTI at 12.8% — within Ford Credit guideline of 15% max',
  },
  {
    id: '10', category: 'Structure', label: 'Term vs. Vehicle Age',
    status: 'pass',
    message: 'New vehicle + 72mo term. Within all lender guidelines.',
  },
  {
    id: '11', category: 'History', label: 'Previous Submissions',
    status: 'warning',
    message: 'This customer was declined by Capital One 14 days ago. Re-submission within 30 days may trigger auto-decline at that lender.',
    aiSuggestion: 'Avoid Capital One for this deal. Route to Ally Financial or Westlake instead — both have softer re-app windows (7 days). Ford Motor Credit has no such restriction.',
    savingsImpact: 'Avoids guaranteed $50 loss on Capital One re-app',
  },
  {
    id: '12', category: 'Structure', label: 'Rate Markup Compliance',
    status: 'pass',
    message: 'Dealer reserve markup at 200bps — within 250bps CFPB safe harbor',
  },
];

export default function LendersPage() {
  const [selectedDeal, setSelectedDeal] = useState('DL-24-0847');
  const [selectedLender, setSelectedLender] = useState('ford-motor-credit');
  const [isValidating, setIsValidating] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [aiOptimizing, setAiOptimizing] = useState<string | null>(null);
  const [resolvedChecks, setResolvedChecks] = useState<Set<string>>(new Set());

  const criticalFails = VALIDATION_CHECKS.filter(c => c.status === 'fail');
  const warnings = VALIDATION_CHECKS.filter(c => c.status === 'warning');
  const passes = VALIDATION_CHECKS.filter(c => c.status === 'pass');

  const unresolvedCritical = criticalFails.filter(c => !resolvedChecks.has(c.id));
  const canSubmit = unresolvedCritical.length === 0;

  const totalSavings = criticalFails.length * 50 + warnings.length * 25;

  const handleAiOptimize = (checkId: string) => {
    setAiOptimizing(checkId);
    setTimeout(() => setAiOptimizing(null), 2000);
  };

  const handleResolve = (checkId: string) => {
    setResolvedChecks(prev => new Set([...prev, checkId]));
  };

  const runValidation = () => {
    setIsValidating(true);
    setShowResults(false);
    setTimeout(() => {
      setIsValidating(false);
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="space-y-4 max-w-full overflow-x-hidden pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Lender Pre-Validation</h1>
          <p className="text-xs text-slate-500 mt-0.5">Catch red flags before submission — save $50 per rejected request</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-semibold text-emerald-700">Saved this month: $450</span>
          </div>
        </div>
      </div>

      {/* Deal + Lender Selection */}
      <Card className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 dark:border-slate-700/50">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="flex-1 grid sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Deal</label>
                <Select value={selectedDeal} onValueChange={setSelectedDeal}>
                  <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DL-24-0847">DL-24-0847 — Marcus Johnson (F-150)</SelectItem>
                    <SelectItem value="DL-24-0851">DL-24-0851 — Tiffany Nguyen (Highlander)</SelectItem>
                    <SelectItem value="DL-24-0855">DL-24-0855 — Samantha Brooks (Camry)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Target Lender</label>
                <Select value={selectedLender} onValueChange={setSelectedLender}>
                  <SelectTrigger className="h-9 text-xs rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ford-motor-credit">Ford Motor Credit</SelectItem>
                    <SelectItem value="ally-financial">Ally Financial</SelectItem>
                    <SelectItem value="capital-one">Capital One Auto</SelectItem>
                    <SelectItem value="chase-auto">Chase Auto Finance</SelectItem>
                    <SelectItem value="wells-fargo">Wells Fargo Dealer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={runValidation}
                  disabled={isValidating}
                  className="h-9 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 gap-1.5 w-full"
                >
                  {isValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Shield className="w-3.5 h-3.5" />}
                  {isValidating ? 'Validating...' : 'Run Pre-Validation'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Results */}
      <AnimatePresence>
        {showResults && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl border border-red-100 bg-red-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  <span className="text-[10px] font-medium text-red-600 uppercase tracking-wider">Critical</span>
                </div>
                <p className="text-2xl font-bold text-red-700">{criticalFails.length}</p>
                <p className="text-[10px] text-red-500 mt-0.5">Must fix before submit</p>
              </div>
              <div className="p-3.5 rounded-xl border border-amber-100 bg-amber-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span className="text-[10px] font-medium text-amber-600 uppercase tracking-wider">Warnings</span>
                </div>
                <p className="text-2xl font-bold text-amber-700">{warnings.length}</p>
                <p className="text-[10px] text-amber-500 mt-0.5">Risk of conditional</p>
              </div>
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-medium text-emerald-600 uppercase tracking-wider">Passed</span>
                </div>
                <p className="text-2xl font-bold text-emerald-700">{passes.length}</p>
                <p className="text-[10px] text-emerald-500 mt-0.5">Lender-ready</p>
              </div>
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-indigo-500" />
                  <span className="text-[10px] font-medium text-indigo-600 uppercase tracking-wider">Savings</span>
                </div>
                <p className="text-2xl font-bold text-indigo-700">${totalSavings}</p>
                <p className="text-[10px] text-indigo-500 mt-0.5">Potential saved</p>
              </div>
            </div>

            {/* Critical Issues */}
            {criticalFails.length > 0 && (
              <Card className="border-red-200/60 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center">
                      <AlertOctagon className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-red-800">Critical — Submission Blocked</h3>
                      <p className="text-[10px] text-red-500">These MUST be resolved. Submitting now guarantees rejection ($50 wasted per attempt).</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  {criticalFails.map((check) => (
                    <motion.div
                      key={check.id}
                      layout
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        resolvedChecks.has(check.id)
                          ? "border-emerald-200 bg-emerald-50/30"
                          : "border-red-200 bg-red-50/30"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          {resolvedChecks.has(check.id) ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{check.label}</span>
                              <Badge variant="outline" className="text-[8px] h-4 px-1.5 text-red-600 border-red-200">{check.category}</Badge>
                              {resolvedChecks.has(check.id) && (
                                <Badge className="text-[8px] h-4 px-1.5 bg-emerald-100 text-emerald-700 border-emerald-200">Resolved</Badge>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{check.message}</p>

                            {/* AI Suggestion */}
                            {check.aiSuggestion && !resolvedChecks.has(check.id) && (
                              <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <Sparkles className="w-3 h-3 text-indigo-500" />
                                  <span className="text-[10px] font-semibold text-indigo-700">Sara's Recommendation</span>
                                </div>
                                <p className="text-[11px] text-indigo-800 leading-relaxed">{check.aiSuggestion}</p>
                                {check.savingsImpact && (
                                  <div className="flex items-center gap-1 mt-2">
                                    <DollarSign className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] font-medium text-emerald-700">{check.savingsImpact}</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                        {!resolvedChecks.has(check.id) && (
                          <div className="flex flex-col gap-1.5 shrink-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAiOptimize(check.id)}
                              disabled={aiOptimizing === check.id}
                              className="text-[10px] h-7 px-2.5 rounded-lg gap-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                            >
                              {aiOptimizing === check.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                              Sara Fix
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleResolve(check.id)}
                              className="text-[10px] h-7 px-2.5 rounded-lg gap-1 bg-emerald-600 hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Resolve
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <Card className="border-amber-200/60 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-amber-800">Warnings — High Risk of Conditional Approval</h3>
                      <p className="text-[10px] text-amber-600">Won&apos;t block submission, but may delay funding or require re-work</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  {warnings.map((check) => (
                    <div key={check.id} className="p-4 rounded-xl border border-amber-100 bg-amber-50/20">
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{check.label}</span>
                            <Badge variant="outline" className="text-[8px] h-4 px-1.5 text-amber-600 border-amber-200">{check.category}</Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{check.message}</p>

                          {check.aiSuggestion && (
                            <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Sparkles className="w-3 h-3 text-indigo-500" />
                                <span className="text-[10px] font-semibold text-indigo-700">Sara's Recommendation</span>
                              </div>
                              <p className="text-[11px] text-indigo-800 leading-relaxed">{check.aiSuggestion}</p>
                              {check.savingsImpact && (
                                <div className="flex items-center gap-1 mt-2">
                                  <DollarSign className="w-3 h-3 text-emerald-500" />
                                  <span className="text-[10px] font-medium text-emerald-700">{check.savingsImpact}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAiOptimize(check.id)}
                          disabled={aiOptimizing === check.id}
                          className="text-[10px] h-7 px-2.5 rounded-lg gap-1 border-indigo-200 text-indigo-600 hover:bg-indigo-50 shrink-0"
                        >
                          {aiOptimizing === check.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Brain className="w-3 h-3" />}
                          Optimize
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Passed Checks */}
            <Card className="border-slate-200 dark:border-slate-700/50 rounded-xl overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-gradient-to-r from-emerald-50/50 to-white">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Passed Checks ({passes.length})</h3>
                    <p className="text-[10px] text-slate-500">These meet lender requirements — no action needed</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid sm:grid-cols-2 gap-2">
                  {passes.map((check) => (
                    <div key={check.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/50 hover:border-emerald-200 transition-colors">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium text-slate-300 truncate">{check.label}</p>
                        <p className="text-[9px] text-slate-500 truncate">{check.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Global Optimization */}
            <Card className="border-indigo-200/60 rounded-xl overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-indigo-50 via-violet-50 to-indigo-50 border-b border-indigo-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Sara Deal Optimizer</h3>
                      <p className="text-[10px] text-slate-500">Let Sara restructure this deal for maximum approval probability</p>
                    </div>
                  </div>
                  <Button size="sm" className="text-xs h-8 rounded-lg gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> Run Sara Optimization
                  </Button>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="grid sm:grid-cols-3 gap-3 mb-4">
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
                    <TrendingUp className="w-4 h-4 text-indigo-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">87%</p>
                    <p className="text-[10px] text-slate-500">Current approval odds</p>
                  </div>
                  <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/30 text-center">
                    <Zap className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-emerald-700">96%</p>
                    <p className="text-[10px] text-emerald-500">After AI optimization</p>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700/50 text-center">
                    <Clock className="w-4 h-4 text-violet-500 mx-auto mb-1.5" />
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">~4 hrs</p>
                    <p className="text-[10px] text-slate-500">Estimated funding time</p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50">
                  <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5">AI would restructure:</p>
                  <ul className="space-y-2">
                    {[
                      'Extend term from 60mo → 72mo (reduces PTI from 15.2% to 12.8%)',
                      'Add GAP insurance to cap cost (improves LTV for lender, adds $2.10/mo)',
                      'Route to Ford Credit instead of Capital One (no 30-day re-app block)',
                      'Request customer provide 2nd paystub before submission',
                      'Reduce selling price by $800 to create 115% LTV safety buffer',
                      'Pre-fill Privacy Notice for e-sign — auto-send to customer',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Lightbulb className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                        <span className="text-[11px] text-slate-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Submit Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm">
              <div className="flex items-center gap-3">
                {canSubmit ? (
                  <>
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-emerald-800">Ready to Submit</p>
                      <p className="text-[10px] text-slate-500">All critical checks resolved — safe to send to lender</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-800">Submission Blocked</p>
                      <p className="text-[10px] text-slate-500">{unresolvedCritical.length} critical issue{unresolvedCritical.length > 1 ? 's' : ''} remaining — resolve to unlock submit</p>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={runValidation} className="text-xs h-9 rounded-lg gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5" /> Re-validate
                </Button>
                <Button
                  size="sm"
                  disabled={!canSubmit}
                  className={cn(
                    "text-xs h-9 rounded-lg gap-1.5 px-5",
                    canSubmit
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-slate-300 cursor-not-allowed"
                  )}
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Lender ($50)
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
