"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListSubZoneTopbar } from "@/components/dashboard/list-sub-zone-topbar";
import { cn } from "@/lib/utils";
import {
  Search, Pencil, Save, RotateCcw, Check, AlertTriangle, CheckCircle2,
  Percent, DollarSign, TrendingUp, Package, Zap, Calculator, X,
  FileSpreadsheet, Info, Layers,
} from "lucide-react";

interface RateRow {
  id: number;
  pkg: string;
  basePrice: number;
  zoneRate: number;
  originalRate: number;
}

const initialRows: RateRow[] = [
  { id: 1, pkg: "Plan 1 (Basic)", basePrice: 1000, zoneRate: 950, originalRate: 950 },
  { id: 2, pkg: "Plan 2 (Standard)", basePrice: 1500, zoneRate: 1420, originalRate: 1420 },
  { id: 3, pkg: "Plan 3 (Premium)", basePrice: 2000, zoneRate: 1900, originalRate: 1900 },
  { id: 4, pkg: "Plan 4 (Ultimate)", basePrice: 2500, zoneRate: 2350, originalRate: 2350 },
];

const calcCommission = (base: number, rate: number) => {
  if (base === 0) return 0;
  return ((base - rate) / base) * 100;
};

const getCommissionColor = (pct: number) => {
  if (pct >= 6) return { bg: "bg-success-tint", text: "text-success", border: "border-success/30", bar: "bg-success", label: "Excellent" };
  if (pct >= 5) return { bg: "bg-signal-tint", text: "text-signal", border: "border-signal/30", bar: "bg-signal", label: "Good" };
  if (pct >= 3) return { bg: "bg-warning-tint", text: "text-warning", border: "border-warning/30", bar: "bg-warning", label: "Average" };
  return { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", bar: "bg-destructive", label: "Low" };
};

export default function SubZoneRatePage() {
  const [rows, setRows] = useState<RateRow[]>(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [editModal, setEditModal] = useState<{ open: boolean; row: RateRow | null }>({ open: false, row: null });

  const hasChanges = useMemo(() => rows.some(r => r.zoneRate !== r.originalRate), [rows]);

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter(r => r.pkg.toLowerCase().includes(q));
  }, [rows, searchTerm]);

  const stats = useMemo(() => {
    const totalPackages = rows.length;
    const avgRate = rows.reduce((acc, r) => acc + r.zoneRate, 0) / rows.length || 0;
    const avgCommission = rows.reduce((acc, r) => acc + calcCommission(r.basePrice, r.zoneRate), 0) / rows.length || 0;
    const totalSavings = rows.reduce((acc, r) => acc + (r.basePrice - r.zoneRate), 0);
    return { totalPackages, avgRate, avgCommission, totalSavings };
  }, [rows]);

  const handleRateChange = (id: number, value: string) => {
    const num = Number(value) || 0;
    setRows(prev => prev.map(r => r.id === id ? { ...r, zoneRate: num } : r));
  };

  const handleReset = () => {
    if (!hasChanges) return;
    if (confirm("Are you sure you want to discard all changes?")) {
      setRows(prev => prev.map(r => ({ ...r, zoneRate: r.originalRate })));
      setToast({ message: "All changes discarded!", type: "info" });
    }
  };

  const handleBulkSet = (commissionPct: number) => {
    setRows(prev => prev.map(r => ({
      ...r,
      zoneRate: Math.round(r.basePrice * (1 - commissionPct / 100)),
    })));
    setToast({ message: `Bulk set to ${commissionPct}% commission for all packages!`, type: "success" });
  };

  const handleSave = () => {
    if (!hasChanges) {
      setToast({ message: "No changes to save!", type: "info" });
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setRows(prev => prev.map(r => ({ ...r, originalRate: r.zoneRate })));
      setSaving(false);
      setToast({ message: "Rates saved successfully!", type: "success" });
    }, 800);
  };

  const handleRowReset = (id: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, zoneRate: r.originalRate } : r));
    setToast({ message: "Row reset to original rate!", type: "info" });
  };

  const handleEditSave = (id: number, newRate: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, zoneRate: newRate } : r));
    setEditModal({ open: false, row: null });
    setToast({ message: `Rate updated for ${editModal.row?.pkg}!`, type: "success" });
  };

  const exportExcel = () => {
    const headers = ["Package", "Base Price", "Sub-Zone Rate", "Commission (%)"];
    const data = filteredRows.map(r => [
      r.pkg,
      r.basePrice,
      r.zoneRate,
      calcCommission(r.basePrice, r.zoneRate).toFixed(2),
    ]);
    const tsv = [headers, ...data].map(row => row.join("\t")).join("\n");
    const blob = new Blob([tsv], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sub-zone-rates-${Date.now()}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "Excel downloaded!", type: "success" });
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ListSubZoneTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Percent className="h-3 w-3" /> Rate Configuration
            </p>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                  Sub-Zone Rate
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Set the rate this sub-zone pays per package. The difference between base price and zone rate is the commission.
                </p>
              </div>

              {hasChanges && (
                <div className="bg-warning-tint border border-warning/30 rounded-xl px-4 py-2.5 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-xs font-bold text-warning">Unsaved Changes</span>
                </div>
              )}
            </div>
          </div>

          {/* Sub-Zone Info Banner */}
          <div className="rounded-2xl p-5 mb-6 flex items-center gap-4 border border-signal/20 bg-signal-tint">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 bg-signal">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Editing Rates For</p>
              <p className="text-sm font-bold text-signal">
                Sub-Zone <span>ID: 53 — Ujan Chor Internet (UCI)</span>
              </p>
            </div>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Packages</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.totalPackages}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Avg Rate</p>
                <p className="text-lg font-heading font-bold text-signal">৳{stats.avgRate.toFixed(0)}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Commission</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.avgCommission.toFixed(2)}%</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Savings</p>
                <p className="text-lg font-heading font-bold text-signal">৳{stats.totalSavings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search package…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">Bulk Set:</span>
              {[5, 5.5, 6].map((pct) => (
                <button
                  key={pct}
                  onClick={() => handleBulkSet(pct)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-white hover:text-signal transition-all"
                >
                  {pct}%
                </button>
              ))}
            </div>

            <button
              onClick={handleReset}
              disabled={!hasChanges}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                hasChanges
                  ? "bg-white border-slate-200 text-slate-500 hover:text-destructive hover:border-destructive/30"
                  : "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-200"
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset All
            </button>

            <button
              onClick={exportExcel}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-500 hover:text-signal transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export
            </button>

            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className={cn(
                "flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md",
                saving
                  ? "bg-slate-100 text-slate-400 cursor-wait"
                  : hasChanges
                  ? "bg-signal text-white hover:bg-signal-hover hover:scale-105"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Rates
                </>
              )}
            </button>
          </div>

          {/* Info Alert */}
          <div className="rounded-2xl p-4 mb-6 flex items-start gap-3 border border-signal/20 bg-signal-tint">
            <Info className="h-5 w-5 shrink-0 mt-0.5 text-signal" />
            <div className="text-xs leading-relaxed text-slate-600">
              <p className="font-bold mb-0.5 text-signal">How Commission Works:</p>
              <p>
                Commission = (Base Price − Sub-Zone Rate) ÷ Base Price × 100.
                Higher commission means lower rate for the sub-zone, benefiting both parties.
              </p>
            </div>
          </div>

          {/* Rate Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-signal text-white">
                    {[
                      { label: "Package", icon: Package },
                      { label: "Base Price", icon: DollarSign },
                      { label: "Sub-Zone Rate", icon: Pencil },
                      { label: "Commission", icon: Percent },
                      { label: "Savings", icon: TrendingUp },
                      { label: "Action", icon: Zap },
                    ].map((h) => {
                      const Icon = h.icon;
                      return (
                        <th key={h.label} className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 opacity-70" />
                            {h.label}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((r) => {
                      const commission = calcCommission(r.basePrice, r.zoneRate);
                      const cc = getCommissionColor(commission);
                      const savings = r.basePrice - r.zoneRate;
                      const isChanged = r.zoneRate !== r.originalRate;

                      return (
                        <tr
                          key={r.id}
                          className={cn(
                            "border-t border-slate-100 transition-colors group",
                            isChanged ? "bg-warning-tint hover:bg-warning/10" : "hover:bg-slate-50"
                          )}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {isChanged && (
                                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" title="Modified" />
                              )}
                              <span className="font-semibold text-signal">{r.pkg}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-500">৳{r.basePrice.toLocaleString()}</td>
                          <td className="px-5 py-4">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">৳</span>
                              <input
                                type="number"
                                value={r.zoneRate}
                                onChange={(e) => handleRateChange(r.id, e.target.value)}
                                className={cn(
                                  "h-10 w-32 rounded-xl border-2 bg-white pl-7 pr-3 text-sm font-mono font-bold outline-none transition-all",
                                  isChanged
                                    ? "border-warning/50 focus:border-warning focus:ring-2 focus:ring-warning/20 text-warning"
                                    : "border-slate-200 focus:border-signal focus:ring-2 focus:ring-signal/20 text-signal"
                                )}
                              />
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="space-y-1.5 min-w-[140px]">
                              <div className="flex items-center justify-between">
                                <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border", cc.bg, cc.text, cc.border)}>
                                  <Percent className="h-3 w-3" />
                                  {commission.toFixed(2)}%
                                </span>
                                <span className={cn("text-[10px] font-bold uppercase", cc.text)}>{cc.label}</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full transition-all duration-500", cc.bar)}
                                  style={{ width: `${Math.min(100, (commission / 10) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border",
                              savings > 0 ? "bg-success-tint text-success border-success/30" : "bg-slate-50 text-slate-500 border-slate-200"
                            )}>
                              <TrendingUp className="h-3 w-3" />
                              ৳{savings.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              {isChanged && (
                                <button
                                  onClick={() => handleRowReset(r.id)}
                                  className="w-8 h-8 rounded-lg bg-warning-tint text-warning flex items-center justify-center hover:bg-warning/20 transition-colors border border-warning/30"
                                  title="Reset this row"
                                >
                                  <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => setEditModal({ open: true, row: r })}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors border border-signal/20 bg-signal-tint text-signal hover:bg-signal/15"
                                title="Quick edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center">
                            <Package className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold text-signal">No packages found</p>
                          <p className="text-xs text-slate-500">Try adjusting your search term.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2 text-sm">
                <Calculator className="h-4 w-4 text-signal" />
                <span className="font-semibold text-signal">Total:</span>
                <span className="text-slate-500">
                  {filteredRows.length} packages • Avg Commission{" "}
                  <span className="font-bold text-signal">
                    {(filteredRows.reduce((acc, r) => acc + calcCommission(r.basePrice, r.zoneRate), 0) / (filteredRows.length || 1)).toFixed(2)}%
                  </span>
                </span>
              </div>
              {hasChanges && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-warning">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Don't forget to save your changes!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && editModal.row && (
        <EditRateModal
          row={editModal.row}
          onClose={() => setEditModal({ open: false, row: null })}
          onSave={handleEditSave}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300 text-white",
            toast.type === "success" && "bg-signal",
            toast.type === "error" && "bg-destructive",
            toast.type === "info" && "bg-slate-600"
          )}
        >
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5" />}
          {toast.type === "error" && <AlertTriangle className="h-5 w-5" />}
          {toast.type === "info" && <Info className="h-5 w-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// Edit Rate Modal
// ═══════════════════════════════════════════════════════════════
function EditRateModal({
  row,
  onClose,
  onSave,
}: {
  row: RateRow;
  onClose: () => void;
  onSave: (id: number, newRate: number) => void;
}) {
  const [newRate, setNewRate] = useState(String(row.zoneRate));

  const commission = calcCommission(row.basePrice, Number(newRate) || 0);
  const cc = getCommissionColor(commission);
  const savings = row.basePrice - (Number(newRate) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(newRate);
    if (isNaN(num) || num <= 0) return;
    if (num > row.basePrice) {
      alert("Zone Rate cannot exceed Base Price!");
      return;
    }
    onSave(row.id, num);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-signal" />

        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-signal">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-signal">Edit Zone Rate</h3>
              <p className="text-xs text-slate-500">{row.pkg}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="rounded-xl p-3 flex items-center justify-between border border-signal/20 bg-signal-tint">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-signal" />
              <span className="text-xs font-semibold text-signal">Base Price</span>
            </div>
            <span className="font-mono font-bold text-sm text-signal">৳{row.basePrice.toLocaleString()}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold flex items-center gap-1.5 text-signal">
              <Pencil className="h-3.5 w-3.5" />
              New Sub-Zone Rate *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-signal">৳</span>
              <input
                type="number"
                required
                autoFocus
                value={newRate}
                onChange={(e) => setNewRate(e.target.value)}
                placeholder="0"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-white text-xl font-mono font-bold outline-none transition-all border-signal/30 text-signal"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500">Quick Commission Preset</label>
            <div className="flex flex-wrap gap-2">
              {[4, 5, 5.5, 6, 7].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setNewRate(String(Math.round(row.basePrice * (1 - pct / 100))))}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-signal-tint hover:text-signal transition-all border border-slate-200"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-4 space-y-3 border border-signal/20 bg-signal-tint">
            <p className="text-[10px] font-bold uppercase tracking-wider text-signal">Live Preview</p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Percent className="h-3.5 w-3.5" /> Commission
              </span>
              <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border", cc.bg, cc.text, cc.border)}>
                {commission.toFixed(2)}%
                <span className="opacity-70">•</span>
                {cc.label}
              </span>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-300", cc.bar)}
                style={{ width: `${Math.min(100, (commission / 10) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-signal/20">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Savings per package
              </span>
              <span className={cn(
                "font-mono font-bold text-sm",
                savings > 0 ? "text-success" : "text-slate-500"
              )}>
                ৳{savings.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg bg-signal hover:bg-signal-hover transition-all"
            >
              <Check className="h-4 w-4" />
              Save Rate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}