"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListTopbar } from "@/components/dashboard/list-topbar";
import { cn } from "@/lib/utils";
import {
  Search, Pencil, Save, Check, X, AlertTriangle, TrendingUp, TrendingDown,
  Percent, DollarSign, Package, Copy, Download, Settings2, Sparkles,
  CheckCircle2, Info, RefreshCw, Calculator, FileSpreadsheet, Layers,
  Zap, Eye,
} from "lucide-react";

interface RateRow {
  id: number;
  pkg: string;
  base: number;
  zoneRate: number;
  commission: number;
}

const initialRates: RateRow[] = [
  { id: 1, pkg: "Plan 1 (Basic)", base: 1000, zoneRate: 950, commission: 5 },
  { id: 2, pkg: "Plan 2 (Standard)", base: 1500, zoneRate: 1420, commission: 5.3 },
  { id: 3, pkg: "Plan 3 (Premium)", base: 2000, zoneRate: 1900, commission: 5 },
  { id: 4, pkg: "Plan 4 (Ultimate)", base: 2500, zoneRate: 2350, commission: 6 },
];

export default function ZoneRatePage() {
  const [rates, setRates] = useState<RateRow[]>(initialRates);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "warning" } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [bulkDiscount, setBulkDiscount] = useState("");

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const calculateCommission = (base: number, zoneRate: number) => {
    if (base === 0) return 0;
    return Number((((base - zoneRate) / base) * 100).toFixed(2));
  };

  const filteredRates = useMemo(() => {
    if (!searchTerm.trim()) return rates;
    const q = searchTerm.toLowerCase();
    return rates.filter((r) =>
      r.pkg.toLowerCase().includes(q) ||
      String(r.base).includes(q) ||
      String(r.zoneRate).includes(q)
    );
  }, [rates, searchTerm]);

  const stats = useMemo(() => {
    const totalPkgs = rates.length;
    const avgCommission = rates.length
      ? rates.reduce((acc, r) => acc + r.commission, 0) / rates.length
      : 0;
    const bestRate = rates.length
      ? rates.reduce((best, r) => (r.commission > best.commission ? r : best), rates[0])
      : null;
    const totalSavings = rates.reduce((acc, r) => acc + (r.base - r.zoneRate), 0);
    return { totalPkgs, avgCommission, bestRate, totalSavings };
  }, [rates]);

  const startEdit = (row: RateRow) => {
    setEditingId(row.id);
    setEditValue(String(row.zoneRate));
  };

  const confirmEdit = (id: number) => {
    const num = Number(editValue);
    if (!num || num < 0) {
      setToast({ message: "Invalid rate value!", type: "error" });
      return;
    }
    setRates((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          if (num > r.base) {
            setToast({ message: "Zone rate cannot exceed base price!", type: "error" });
            return r;
          }
          return { ...r, zoneRate: num, commission: calculateCommission(r.base, num) };
        }
        return r;
      })
    );
    setEditingId(null);
    setDirty(true);
    setToast({ message: "Rate updated!", type: "success" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveAll = () => {
    setDirty(false);
    setToast({ message: "All rates saved successfully!", type: "success" });
  };

  const applyBulkDiscount = () => {
    const pct = Number(bulkDiscount);
    if (!pct || pct <= 0 || pct >= 100) {
      setToast({ message: "Enter discount between 1-99%", type: "error" });
      return;
    }
    setRates((prev) =>
      prev.map((r) => {
        const newRate = Number((r.base - (r.base * pct) / 100).toFixed(2));
        return { ...r, zoneRate: newRate, commission: calculateCommission(r.base, newRate) };
      })
    );
    setDirty(true);
    setToast({ message: `Applied ${pct}% discount to all packages!`, type: "success" });
    setBulkDiscount("");
    setAdvancedOpen(false);
  };

  const copyRates = () => {
    const text = rates
      .map((r) => `${r.pkg}: Base ৳${r.base} → Zone ৳${r.zoneRate} (${r.commission}%)`)
      .join("\n");
    navigator.clipboard.writeText(text);
    setToast({ message: "Rates copied to clipboard!", type: "success" });
  };

  const exportCSV = () => {
    const headers = ["Package", "Base Price", "Zone Rate", "Commission %"];
    const rows = rates.map((r) => [r.pkg, r.base, r.zoneRate, r.commission]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zone-rates-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "CSV exported successfully!", type: "success" });
  };

  const resetAll = () => {
    if (confirm("Reset all rates to default?")) {
      setRates(initialRates);
      setDirty(false);
      setToast({ message: "Rates reset to default!", type: "success" });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ListTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Percent className="h-3 w-3" /> Commission Management
            </p>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                  Zone Rate
                </h1>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-signal" />
                  Zone <span className="font-semibold text-signal">ID: 53 - Ujan Chor Internet (UCI)</span>
                </p>
              </div>

              {dirty && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-warning-tint border border-warning/30 animate-in fade-in slide-in-from-top-2">
                  <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                  <span className="text-xs font-bold text-warning">Unsaved changes</span>
                </div>
              )}
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
                <p className="text-lg font-heading font-bold text-signal">{stats.totalPkgs}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Avg Comm.</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.avgCommission.toFixed(2)}%</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Best</p>
                <p className="text-lg font-heading font-bold text-signal">
                  {stats.bestRate ? `${stats.bestRate.commission}%` : "N/A"}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-signal" />
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
                placeholder="Search package or rate…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <button
              onClick={copyRates}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-signal hover:shadow-md transition-all"
            >
              <Copy className="h-3.5 w-3.5" /> Copy
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-signal hover:shadow-md transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export
            </button>

            <button
              onClick={() => setAdvancedOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-signal hover:shadow-md transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" /> Bulk Discount
            </button>

            <button
              onClick={resetAll}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>

            <button
              onClick={saveAll}
              disabled={!dirty}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all",
                dirty
                  ? "bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              )}
            >
              <Save className="h-3.5 w-3.5" /> Save Rates
            </button>
          </div>

          {/* Info Banner */}
          <div className="rounded-2xl border border-signal/20 bg-signal-tint p-4 mb-6 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 mt-0.5">
              <Calculator className="h-4 w-4 text-signal" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5 text-signal">How Commission is Calculated</p>
              <p className="text-xs text-slate-600">
                Commission = ((Base Price − Zone Rate) ÷ Base Price) × 100. The difference
                between base price and zone rate is the zone&apos;s earnings.
              </p>
            </div>
          </div>

          {/* Rate Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-signal text-white">
                  <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 opacity-70" /> Package
                    </div>
                  </th>
                  <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 opacity-70" /> Base Price
                    </div>
                  </th>
                  <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Zap className="h-3.5 w-3.5 opacity-70" /> Zone Rate
                    </div>
                  </th>
                  <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">
                    <div className="flex items-center gap-1.5">
                      <Percent className="h-3.5 w-3.5 opacity-70" /> Commission
                    </div>
                  </th>
                  <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRates.length > 0 ? (
                  filteredRates.map((r) => {
                    const isEditing = editingId === r.id;
                    const isHighCommission = r.commission >= 6;
                    const isLowCommission = r.commission <= 3;
                    return (
                      <tr
                        key={r.id}
                        className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                              <Package className="h-4 w-4 text-signal" />
                            </div>
                            <span className="font-semibold text-signal">{r.pkg}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-slate-500">
                          ৳{r.base.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") confirmEdit(r.id);
                                  if (e.key === "Escape") cancelEdit();
                                }}
                                className="h-9 w-28 rounded-lg border-2 bg-white px-3 text-sm font-mono outline-none focus:ring-2 focus:ring-signal/30 border-signal text-signal"
                              />
                              <button
                                onClick={() => confirmEdit(r.id)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-success-tint text-success hover:bg-success/20"
                                title="Confirm"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-destructive/10 text-destructive hover:bg-destructive/20"
                                title="Cancel"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="font-mono font-bold text-signal">
                              ৳{r.zoneRate.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold border",
                              isHighCommission
                                ? "bg-success-tint text-success border-success/30"
                                : isLowCommission
                                ? "bg-destructive/10 text-destructive border-destructive/30"
                                : "bg-signal-tint text-signal border-signal/30"
                            )}
                          >
                            {isHighCommission ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : isLowCommission ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {r.commission}%
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {!isEditing && (
                            <button
                              onClick={() => startEdit(r)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors bg-signal-tint text-signal hover:bg-signal/15"
                              title="Edit Rate"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center">
                          <Layers className="h-8 w-8 text-signal" />
                        </div>
                        <p className="font-semibold text-signal">No packages found</p>
                        <p className="text-xs text-slate-500">
                          Try adjusting your search term.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Footer Summary */}
            {filteredRates.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 bg-slate-50 text-sm">
                <div className="flex items-center gap-4">
                  <span className="text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-signal">{filteredRates.length}</span> of{" "}
                    <span className="font-semibold text-signal">{rates.length}</span> packages
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Avg. Commission:</span>
                  <span className="font-bold text-signal">{stats.avgCommission.toFixed(2)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Discount Modal */}
      {advancedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setAdvancedOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="h-1.5 bg-signal" />
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-signal">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-signal">Bulk Discount</h3>
                  <p className="text-xs text-slate-500">Apply to all packages at once</p>
                </div>
              </div>
              <button
                onClick={() => setAdvancedOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-signal">
                  Discount Percentage *
                </label>
                <input
                  type="number"
                  value={bulkDiscount}
                  onChange={(e) => setBulkDiscount(e.target.value)}
                  placeholder="e.g. 5"
                  min="1"
                  max="99"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-lg font-bold outline-none focus:ring-2 focus:ring-signal/30 text-signal"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {[3, 5, 7, 10].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setBulkDiscount(String(pct))}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 hover:bg-signal-tint hover:text-signal transition-all border border-slate-200"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
              <div className="rounded-xl p-3 border border-signal/20 bg-signal-tint">
                <p className="text-xs flex items-start gap-2 text-signal">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  This will replace all zone rates with base price minus the discount.
                </p>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setAdvancedOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={applyBulkDiscount}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg bg-signal hover:bg-signal-hover transition-all"
                >
                  <Sparkles className="h-4 w-4" /> Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300 text-white",
            toast.type === "success" && "bg-signal",
            toast.type === "warning" && "bg-warning",
            toast.type === "error" && "bg-destructive"
          )}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : toast.type === "warning" ? (
            <AlertTriangle className="h-5 w-5" />
          ) : (
            <X className="h-5 w-5" />
          )}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}