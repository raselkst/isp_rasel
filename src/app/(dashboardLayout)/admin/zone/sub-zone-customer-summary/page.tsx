"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListSubZoneTopbar } from "@/components/dashboard/list-sub-zone-topbar";
import { cn } from "@/lib/utils";
import {
  Search, Download, FileDown, FileSpreadsheet, FileJson, Printer, Copy,
  ChevronLeft, ChevronRight, Filter, X, CheckCircle2, AlertTriangle,
  Users, Wifi, WifiOff, TrendingUp, DollarSign, Activity, Eye,
  Lock, Ban, Zap, Gift, Crown, Clock, UserCheck, MapPin, Smartphone,
  Camera, IdCard, Layers, BarChart3,
} from "lucide-react";

// 🎯 ডেটা টাইপ
interface CustomerSummaryRow {
  id: number;
  owner: string;
  total: number;
  ok: number;
  online: number;
  offline: number;
  free: number;
  vip: number;
  expired: number;
  locked: number;
  grace: number;
  disabled: number;
  blocked: number;
  approxBill: number;
  nid: number;
  mobile: number;
  photo: number;
  location: number;
}

const initialRows: CustomerSummaryRow[] = Array.from({ length: 11 }).map((_, i) => ({
  id: i + 17,
  owner: "Kumerkhali Digital Network (KDN)",
  total: 763,
  ok: 675,
  online: 606,
  offline: 79,
  free: [0, 13, 9, 11, 1, 42, 5, 0, 23, 17, 21][i],
  vip: 0,
  expired: 66,
  locked: [0, 68, 0, 68, 0, 68, 0, 68, 0, 68, 0][i],
  grace: 0,
  disabled: [22, 0, 22, 0, 22, 0, 22, 0, 22, 0, 22][i],
  blocked: 0,
  approxBill: 76610,
  nid: 108,
  mobile: 223,
  photo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1][i],
  location: 0,
}));

export default function SubZoneCustomerSummaryPage() {
  const [rows] = useState<CustomerSummaryRow[]>(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [detailModal, setDetailModal] = useState<{ open: boolean; row: CustomerSummaryRow | null; field: string }>({ open: false, row: null, field: "" });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // 🎯 ফিল্টার
  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter(r =>
      r.owner.toLowerCase().includes(q) ||
      String(r.id).includes(q)
    );
  }, [rows, searchTerm]);

  // 🎯 পেজিনেশন
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, pageSize]);

  // 🎯 Auto Total
  const totals = useMemo(() => {
    return filteredRows.reduce((acc, r) => ({
      total: acc.total + r.total,
      ok: acc.ok + r.ok,
      online: acc.online + r.online,
      offline: acc.offline + r.offline,
      free: acc.free + r.free,
      vip: acc.vip + r.vip,
      expired: acc.expired + r.expired,
      locked: acc.locked + r.locked,
      grace: acc.grace + r.grace,
      disabled: acc.disabled + r.disabled,
      blocked: acc.blocked + r.blocked,
      approxBill: acc.approxBill + r.approxBill,
      nid: acc.nid + r.nid,
      mobile: acc.mobile + r.mobile,
      photo: acc.photo + r.photo,
      location: acc.location + r.location,
    }), {
      total: 0, ok: 0, online: 0, offline: 0, free: 0, vip: 0, expired: 0,
      locked: 0, grace: 0, disabled: 0, blocked: 0, approxBill: 0,
      nid: 0, mobile: 0, photo: 0, location: 0,
    });
  }, [filteredRows]);

  // 🎯 Stat Cards
  const stats = useMemo(() => ({
    totalZones: filteredRows.length,
    totalCustomers: totals.total,
    online: totals.online,
    expired: totals.expired,
  }), [filteredRows, totals]);

  // 🎯 এক্সপোর্ট
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>Sub-Zone Customer Summary</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #F97316; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
        th { background: #F97316; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
      <h1>Sub-Zone Customer Summary</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <table><thead><tr>
        <th>ID</th><th>Owner</th><th>Total</th><th>OK</th><th>Online</th><th>Offline</th>
        <th>Free</th><th>VIP</th><th>Expired</th><th>Locked</th><th>Disabled</th>
        <th>Approx Bill</th><th>NID</th><th>Mobile</th>
      </tr></thead><tbody>
      ${filteredRows.map(r => `<tr>
        <td>${r.id}</td><td>${r.owner}</td><td>${r.total}</td><td>${r.ok}</td>
        <td>${r.online}</td><td>${r.offline}</td><td>${r.free}</td><td>${r.vip}</td>
        <td>${r.expired}</td><td>${r.locked}</td><td>${r.disabled}</td>
        <td>৳${r.approxBill.toLocaleString()}</td><td>${r.nid}</td><td>${r.mobile}</td>
      </tr>`).join("")}
      </tbody></table></body></html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
    setToast({ message: "PDF export opened!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportExcel = () => {
    const headers = ["ID", "Owner", "Total", "OK", "Online", "Offline", "Free", "VIP", "Expired", "Locked", "Grace", "Disabled", "Blocked", "Approx Bill", "NID", "Mobile", "Photo", "Location"];
    const data = filteredRows.map(r => [r.id, r.owner, r.total, r.ok, r.online, r.offline, r.free, r.vip, r.expired, r.locked, r.grace, r.disabled, r.blocked, r.approxBill, r.nid, r.mobile, r.photo, r.location]);
    const tsv = [headers, ...data].map(row => row.join("\t")).join("\n");
    downloadFile(tsv, `sub-zone-customer-summary-${Date.now()}.xls`, "application/vnd.ms-excel");
    setToast({ message: "Excel downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportCSV = () => {
    const headers = ["ID", "Owner", "Total", "OK", "Online", "Offline", "Free", "VIP", "Expired", "Locked", "Grace", "Disabled", "Blocked", "Approx Bill", "NID", "Mobile", "Photo", "Location"];
    const data = filteredRows.map(r => [r.id, r.owner, r.total, r.ok, r.online, r.offline, r.free, r.vip, r.expired, r.locked, r.grace, r.disabled, r.blocked, r.approxBill, r.nid, r.mobile, r.photo, r.location]);
    const csv = [headers, ...data].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `sub-zone-customer-summary-${Date.now()}.csv`, "text/csv");
    setToast({ message: "CSV downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(filteredRows, null, 2), `sub-zone-customer-summary-${Date.now()}.json`, "application/json");
    setToast({ message: "JSON downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const handlePrint = () => { window.print(); setExportMenuOpen(false); };

  const handleCopy = () => {
    const text = filteredRows.map(r => `${r.id}\t${r.owner}\t${r.total}\t${r.ok}\t${r.online}\t${r.offline}\t${r.expired}`).join("\n");
    navigator.clipboard.writeText(text);
    setToast({ message: `${filteredRows.length} rows copied!`, type: "success" });
    setExportMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ListSubZoneTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* 🎯 Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1 flex items-center gap-1.5">
              <BarChart3 className="h-3 w-3" /> Analytics Dashboard
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Sub-Zone Customer Summary
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive breakdown of customer statistics across all sub-zones.
            </p>
          </div>

         {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
      <Layers className="w-4 h-4 text-orange-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Sub-Zones</p>
      <p className="text-lg font-heading font-bold text-orange-600">{stats.totalZones}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <Users className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Customers</p>
      <p className="text-lg font-heading font-bold text-blue-600">{stats.totalCustomers.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <Wifi className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Online</p>
      <p className="text-lg font-heading font-bold text-emerald-600">{stats.online.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
      <Clock className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Expired</p>
      <p className="text-lg font-heading font-bold text-red-600">{stats.expired.toLocaleString()}</p>
    </div>
  </div>
</div>

          {/* 🎯 Search + Export Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by sub-zone name or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border bg-card text-xs font-semibold hover:bg-muted transition-all"
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}

            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all"
              >
                <Download className="h-4 w-4" /> Export
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { label: "Export as PDF", icon: FileDown, action: exportPDF, color: "text-red-500" },
                    { label: "Export as Excel", icon: FileSpreadsheet, action: exportExcel, color: "text-emerald-500" },
                    { label: "Export as CSV", icon: FileDown, action: exportCSV, color: "text-blue-500" },
                    { label: "Export as JSON", icon: FileJson, action: exportJSON, color: "text-violet-500" },
                    { divider: true },
                    { label: "Print", icon: Printer, action: handlePrint, color: "text-slate-500" },
                    { label: "Copy to Clipboard", icon: Copy, action: handleCopy, color: "text-amber-500" },
                  ].map((item, idx) => {
                    if ("divider" in item) return <div key={idx} className="border-t my-1" />;
                    const Icon = item.icon!;
                    return (
                      <button
                        key={item.label}
                        onClick={item.action}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted transition-colors text-left"
                      >
                        <Icon className={cn("h-4 w-4", item.color)} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 🎯 Table */}
          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[1600px]">
              <thead>
                {/* Group Header Row */}
                <tr className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  <th colSpan={2} className="text-left px-3.5 py-3 font-semibold text-[11px] uppercase tracking-wider border-r border-white/20">
                    Owner Info
                  </th>
                  <th colSpan={4} className="text-center px-3.5 py-3 font-semibold text-[11px] uppercase tracking-wider border-r border-white/20">
                    Status Overview
                  </th>
                  <th colSpan={7} className="text-center px-3.5 py-3 font-semibold text-[11px] uppercase tracking-wider border-r border-white/20">
                    Customer Categories
                  </th>
                  <th colSpan={1} className="text-center px-3.5 py-3 font-semibold text-[11px] uppercase tracking-wider border-r border-white/20">
                    Billing
                  </th>
                  <th colSpan={4} className="text-center px-3.5 py-3 font-semibold text-[11px] uppercase tracking-wider">
                    KYC Data
                  </th>
                </tr>
                <tr className="bg-orange-500/90 text-white">
                  {[
                    { label: "ID", icon: Layers },
                    { label: "Owner", icon: Users },
                    { label: "Total", icon: Users },
                    { label: "OK", icon: CheckCircle2 },
                    { label: "Online", icon: Wifi },
                    { label: "Off-line", icon: WifiOff },
                    { label: "Free", icon: Gift },
                    { label: "VIP", icon: Crown },
                    { label: "Expired", icon: Clock },
                    { label: "Locked", icon: Lock },
                    { label: "Grace", icon: Zap },
                    { label: "Disabled", icon: Ban },
                    { label: "NO-NID Blocked", icon: Ban },
                    { label: "Approx Bill", icon: DollarSign },
                    { label: "NID", icon: IdCard },
                    { label: "Mobile", icon: Smartphone },
                    { label: "Photo", icon: Camera },
                    { label: "Location", icon: MapPin },
                  ].map((c) => {
                    const Icon = c.icon;
                    return (
                      <th key={c.label} className="text-left px-3.5 py-3 font-semibold text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3 w-3 opacity-70" />
                          {c.label}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-orange-500/5 transition-colors">
                      <td className="px-3.5 py-3 font-mono font-bold text-orange-500">#{r.id}</td>
                      <td className="px-3.5 py-3 font-semibold whitespace-nowrap">{r.owner}</td>
                      <td className="px-3.5 py-3 font-mono font-bold">{r.total}</td>
                      <td className="px-3.5 py-3">
                        <button
                          onClick={() => setDetailModal({ open: true, row: r, field: "OK" })}
                          className="font-mono font-bold text-emerald-600 hover:underline"
                        >
                          {r.ok}
                        </button>
                      </td>
                      <td className="px-3.5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-600">{r.online}</span>
                          <div className="w-12 h-1 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${(r.online / r.total) * 100}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-3.5 py-3 font-mono text-red-500">{r.offline}</td>
                      <td className="px-3.5 py-3">
                        <button
                          onClick={() => setDetailModal({ open: true, row: r, field: "Free" })}
                          className="font-mono font-bold text-cyan-600 hover:underline"
                        >
                          {r.free}
                        </button>
                      </td>
                      <td className="px-3.5 py-3">
                        <button
                          onClick={() => setDetailModal({ open: true, row: r, field: "VIP" })}
                          className="font-mono font-bold text-violet-600 hover:underline"
                        >
                          {r.vip}
                        </button>
                      </td>
                      <td className="px-3.5 py-3">
                        <button
                          onClick={() => setDetailModal({ open: true, row: r, field: "Expired" })}
                          className="font-mono font-bold text-red-600 hover:underline"
                        >
                          {r.expired}
                        </button>
                      </td>
                      <td className="px-3.5 py-3">
                        <button
                          onClick={() => setDetailModal({ open: true, row: r, field: "Locked" })}
                          className="font-mono font-bold text-amber-600 hover:underline"
                        >
                          {r.locked}
                        </button>
                      </td>
                      <td className="px-3.5 py-3 font-mono">{r.grace}</td>
                      <td className="px-3.5 py-3">
                        <button
                          onClick={() => setDetailModal({ open: true, row: r, field: "Disabled" })}
                          className="font-mono font-bold text-slate-600 hover:underline"
                        >
                          {r.disabled}
                        </button>
                      </td>
                      <td className="px-3.5 py-3 font-mono">{r.blocked}</td>
                      <td className="px-3.5 py-3 font-mono font-bold text-orange-500">৳{r.approxBill.toLocaleString()}</td>
                      <td className="px-3.5 py-3 font-mono">{r.nid}</td>
                      <td className="px-3.5 py-3 font-mono">{r.mobile}</td>
                      <td className="px-3.5 py-3">
                        <span className={cn(
                          "inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-bold",
                          r.photo > 0 ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                        )}>
                          {r.photo}
                        </span>
                      </td>
                      <td className="px-3.5 py-3 font-mono">{r.location}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={18} className="px-3.5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Users className="h-8 w-8 text-orange-500" />
                        </div>
                        <p className="font-semibold">No sub-zones found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your search term.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
              {/* 🎯 Total Footer */}
              <tfoot>
                <tr className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold">
                  <td className="px-3.5 py-3.5" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Total
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.total}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.ok}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.online}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.offline}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.free}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.vip}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.expired}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.locked}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.grace}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.disabled}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.blocked}</td>
                  <td className="px-3.5 py-3.5 font-mono">৳{totals.approxBill.toLocaleString()}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.nid}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.mobile}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.photo}</td>
                  <td className="px-3.5 py-3.5 font-mono">{totals.location}</td>
                </tr>
              </tfoot>
            </table>

            {/* 🎯 Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Show Entities</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 bg-background font-semibold"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredRows.length}</span>
                <span>items</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg font-bold text-xs transition-all",
                      currentPage === p ? "bg-orange-500 text-white shadow-md" : "border bg-card hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Detail Modal */}
      {detailModal.open && detailModal.row && (
        <DetailModal
          row={detailModal.row}
          field={detailModal.field}
          onClose={() => setDetailModal({ open: false, row: null, field: "" })}
        />
      )}

      {/* 🎯 Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300",
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}>
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Detail Modal
// ═══════════════════════════════════════════════════════════════
function DetailModal({
  row, field, onClose,
}: {
  row: CustomerSummaryRow;
  field: string;
  onClose: () => void;
}) {
  const value = (row as any)[field.toLowerCase().replace(/\s+/g, "")] || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-gradient-to-r from-orange-500 to-pink-500" />
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">{field} Customers</h3>
              <p className="text-xs text-muted-foreground">{row.owner}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider">Total {field}</p>
            <p className="text-4xl font-heading font-bold text-orange-700 mt-1">{value}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Sub-Zone ID</p>
              <p className="font-mono font-bold text-sm mt-1">#{row.id}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Users</p>
              <p className="font-mono font-bold text-sm mt-1">{row.total}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 text-center">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">Online</p>
              <p className="font-mono font-bold text-sm mt-1 text-emerald-600">{row.online}</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Available Actions</p>
            <div className="flex flex-wrap gap-2">
              {["View List", "Export", "Send SMS", "Tag Users"].map((action) => (
                <button
                  key={action}
                  className="px-3.5 py-2 rounded-lg text-xs font-bold bg-card border border-border hover:border-orange-500/40 hover:text-orange-500 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <button onClick={onClose} className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}