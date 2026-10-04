"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListTopbar } from "@/components/dashboard/list-topbar";
import { cn } from "@/lib/utils";
import {
  Search, Users, Wifi, WifiOff, Gift, Crown, AlertTriangle, Lock,
  Ban, DollarSign, Phone, MapPin, CreditCard, Camera, X,
  ChevronLeft, ChevronRight, Copy, Printer, FileText, FileSpreadsheet,
  Download, Filter, Eye, CheckCircle2, Building2, Hash,
} from "lucide-react";

// 🎯 ডেটা টাইপ
interface SummaryRow {
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

const initialRows: SummaryRow[] = [
  { id: 17, owner: "Kumerkhali Digital Network (KDN)", total: 763, ok: 675, online: 606, offline: 79, free: 0, vip: 0, expired: 66, locked: 0, grace: 0, disabled: 22, blocked: 0, approxBill: 76610, nid: 108, mobile: 223, photo: 0, location: 0 },
  { id: 18, owner: "Hasan Cable Network [HCN]", total: 490, ok: 450, online: 400, offline: 50, free: 13, vip: 5, expired: 40, locked: 68, grace: 2, disabled: 0, blocked: 1, approxBill: 49000, nid: 95, mobile: 180, photo: 0, location: 5 },
  { id: 19, owner: "Ujan Chor Internet [UCI]", total: 620, ok: 580, online: 520, offline: 60, free: 9, vip: 3, expired: 40, locked: 0, grace: 1, disabled: 22, blocked: 0, approxBill: 62000, nid: 110, mobile: 200, photo: 0, location: 0 },
  { id: 20, owner: "Poli Network [PN]", total: 850, ok: 780, online: 700, offline: 80, free: 11, vip: 8, expired: 70, locked: 68, grace: 3, disabled: 0, blocked: 2, approxBill: 85000, nid: 130, mobile: 250, photo: 1, location: 3 },
  { id: 21, owner: "AR Internet [ARI]", total: 340, ok: 310, online: 280, offline: 30, free: 1, vip: 2, expired: 30, locked: 0, grace: 0, disabled: 22, blocked: 0, approxBill: 34000, nid: 60, mobile: 120, photo: 0, location: 0 },
  { id: 22, owner: "ZS Cable Network [ZSC]", total: 720, ok: 660, online: 600, offline: 60, free: 42, vip: 12, expired: 60, locked: 68, grace: 5, disabled: 0, blocked: 3, approxBill: 72000, nid: 140, mobile: 270, photo: 0, location: 8 },
  { id: 23, owner: "Online Network [ON]", total: 560, ok: 520, online: 470, offline: 50, free: 5, vip: 4, expired: 40, locked: 0, grace: 2, disabled: 22, blocked: 0, approxBill: 56000, nid: 90, mobile: 180, photo: 0, location: 0 },
  { id: 24, owner: "Akas Cable Network [ACN]", total: 480, ok: 440, online: 400, offline: 40, free: 0, vip: 1, expired: 40, locked: 68, grace: 1, disabled: 0, blocked: 1, approxBill: 48000, nid: 85, mobile: 160, photo: 1, location: 2 },
  { id: 25, owner: "Sky Net [SN]", total: 640, ok: 590, online: 540, offline: 50, free: 23, vip: 6, expired: 50, locked: 0, grace: 3, disabled: 22, blocked: 0, approxBill: 64000, nid: 120, mobile: 240, photo: 0, location: 0 },
  { id: 26, owner: "Star Broadband [SB]", total: 380, ok: 350, online: 320, offline: 30, free: 17, vip: 2, expired: 30, locked: 68, grace: 0, disabled: 0, blocked: 2, approxBill: 38000, nid: 70, mobile: 140, photo: 0, location: 0 },
  { id: 27, owner: "Metro Net [MN]", total: 900, ok: 830, online: 750, offline: 80, free: 21, vip: 15, expired: 70, locked: 0, grace: 4, disabled: 22, blocked: 0, approxBill: 90000, nid: 160, mobile: 300, photo: 1, location: 5 },
];

// 🎯 মেট্রিক কনফিগ
const metricConfig = {
  online: { color: "text-emerald-600", bg: "bg-emerald-500/10", icon: Wifi, label: "Online" },
  offline: { color: "text-red-600", bg: "bg-red-500/10", icon: WifiOff, label: "Offline" },
  free: { color: "text-blue-600", bg: "bg-blue-500/10", icon: Gift, label: "Free" },
  vip: { color: "text-violet-600", bg: "bg-violet-500/10", icon: Crown, label: "VIP" },
  expired: { color: "text-amber-600", bg: "bg-amber-500/10", icon: AlertTriangle, label: "Expired" },
  locked: { color: "text-orange-600", bg: "bg-orange-500/10", icon: Lock, label: "Locked" },
  disabled: { color: "text-slate-600", bg: "bg-slate-500/10", icon: Ban, label: "Disabled" },
};

export default function ZoneCustomerSummaryPage() {
  const [rows] = useState<SummaryRow[]>(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTab, setFilterTab] = useState<"All" | "Online" | "Offline" | "Free" | "Locked" | "Disabled">("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModal, setDetailModal] = useState<{ open: boolean; owner: string | null; metric: string | null }>({ open: false, owner: null, metric: null });
  const [toast, setToast] = useState<string | null>(null);

  // 🎯 টোস্ট অটো হাইড
  useState(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  });

  // 🎯 স্ট্যাট
  const stats = useMemo(() => {
    const total = rows.reduce((a, r) => a + r.total, 0);
    const online = rows.reduce((a, r) => a + r.online, 0);
    const offline = rows.reduce((a, r) => a + r.offline, 0);
    const expired = rows.reduce((a, r) => a + r.expired, 0);
    const locked = rows.reduce((a, r) => a + r.locked, 0);
    const approxBill = rows.reduce((a, r) => a + r.approxBill, 0);
    return { total, online, offline, expired, locked, approxBill };
  }, [rows]);

  // 🎯 টোটালস
  const totals = useMemo(() => {
    return rows.reduce((acc, r) => ({
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
    }), { total: 0, ok: 0, online: 0, offline: 0, free: 0, vip: 0, expired: 0, locked: 0, grace: 0, disabled: 0, blocked: 0, approxBill: 0, nid: 0, mobile: 0, photo: 0, location: 0 });
  }, [rows]);

  // 🎯 ফিল্টার
  const filteredRows = useMemo(() => {
    let result = rows;
    if (filterTab !== "All") {
      const key = filterTab.toLowerCase() as keyof SummaryRow;
      result = result.filter(r => (r[key] as number) > 0);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => r.owner.toLowerCase().includes(q) || String(r.id).includes(q));
    }
    return result;
  }, [rows, searchTerm, filterTab]);

  // 🎯 পেজিনেশন
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 🎯 Export Functions
  const exportCSV = () => {
    const headers = ["ID", "Owner", "Total", "OK", "Online", "Offline", "Free", "VIP", "Expired", "Locked", "Grace", "Disabled", "NO-NID Blocked", "Approx Bill", "NID", "Mobile", "Photo", "Location"];
    const csvRows = filteredRows.map(r => [r.id, r.owner, r.total, r.ok, r.online, r.offline, r.free, r.vip, r.expired, r.locked, r.grace, r.disabled, r.blocked, r.approxBill, r.nid, r.mobile, r.photo, r.location]);
    const csv = [headers, ...csvRows].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `zone-customer-summary-${Date.now()}.csv`, "text/csv");
    setToast("CSV downloaded!");
  };

  const exportExcel = () => {
    const headers = ["ID", "Owner", "Total", "OK", "Online", "Offline", "Free", "VIP", "Expired", "Locked", "Grace", "Disabled", "NO-NID Blocked", "Approx Bill", "NID", "Mobile", "Photo", "Location"];
    const tsvRows = filteredRows.map(r => [r.id, r.owner, r.total, r.ok, r.online, r.offline, r.free, r.vip, r.expired, r.locked, r.grace, r.disabled, r.blocked, r.approxBill, r.nid, r.mobile, r.photo, r.location]);
    const tsv = [headers, ...tsvRows].map(r => r.join("\t")).join("\n");
    downloadFile(tsv, `zone-customer-summary-${Date.now()}.xls`, "application/vnd.ms-excel");
    setToast("Excel downloaded!");
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Zone Customer Summary</title>
      <style>body{font-family:Arial;padding:20px}h1{color:#0F8B8D}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #ddd;padding:6px;font-size:11px}th{background:#0F8B8D;color:white}tr:nth-child(even){background:#f9f9f9}</style>
      </head><body>
      <h1>Zone Customer Summary</h1><p>Generated: ${new Date().toLocaleString()}</p>
      <table><thead><tr>${["ID","Owner","Total","OK","Online","Offline","Free","VIP","Expired","Locked","Disabled","Approx Bill"].map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${filteredRows.map(r => `<tr><td>${r.id}</td><td>${r.owner}</td><td>${r.total}</td><td>${r.ok}</td><td>${r.online}</td><td>${r.offline}</td><td>${r.free}</td><td>${r.vip}</td><td>${r.expired}</td><td>${r.locked}</td><td>${r.disabled}</td><td>${r.approxBill}</td></tr>`).join("")}</tbody></table>
      </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
    setToast("PDF ready!");
  };

  const handleCopy = () => {
    const headers = ["ID", "Owner", "Total", "OK", "Online", "Offline", "Free", "VIP", "Expired", "Locked", "Disabled", "Approx Bill"];
    const tsv = [headers, ...filteredRows.map(r => [r.id, r.owner, r.total, r.ok, r.online, r.offline, r.free, r.vip, r.expired, r.locked, r.disabled, r.approxBill])].map(r => r.join("\t")).join("\n");
    navigator.clipboard.writeText(tsv);
    setToast("Copied to clipboard!");
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // 🎯 মেট্রিক ক্লিক
  const handleMetricClick = (owner: string, metric: string) => {
    setDetailModal({ open: true, owner, metric });
  };

  // 🎯 কলাম ডেফিনিশন
  const columns = [
    { key: "id", label: "ID", icon: Hash, sticky: false },
    { key: "owner", label: "Owner", icon: Building2, sticky: true },
    { key: "total", label: "Total", icon: Users, clickable: false },
    { key: "ok", label: "OK", icon: CheckCircle2, clickable: true },
    { key: "online", label: "Online", icon: Wifi, clickable: true, metric: "online" },
    { key: "offline", label: "Off-line", icon: WifiOff, clickable: true, metric: "offline" },
    { key: "free", label: "Free", icon: Gift, clickable: true, metric: "free" },
    { key: "vip", label: "VIP", icon: Crown, clickable: true, metric: "vip" },
    { key: "expired", label: "Expired", icon: AlertTriangle, clickable: true, metric: "expired" },
    { key: "locked", label: "Locked", icon: Lock, clickable: true, metric: "locked" },
    { key: "grace", label: "Grace", icon: AlertTriangle, clickable: true },
    { key: "disabled", label: "Disabled", icon: Ban, clickable: true, metric: "disabled" },
    { key: "blocked", label: "NO-NID Blocked", icon: Ban, clickable: true },
    { key: "approxBill", label: "Approx Bill", icon: DollarSign },
    { key: "nid", label: "NID", icon: CreditCard },
    { key: "mobile", label: "Mobile", icon: Phone },
    { key: "photo", label: "Photo", icon: Camera },
    { key: "location", label: "Location", icon: MapPin },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ListTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* 🎯 Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Users className="h-3 w-3" /> Zone Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Zone Customer Summary
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete breakdown of customers across all zones.
            </p>
          </div>

          {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <Users className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
      <p className="text-lg font-heading font-bold">{stats.total.toLocaleString()}</p>
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
      <WifiOff className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Offline</p>
      <p className="text-lg font-heading font-bold text-red-600">{stats.offline.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <AlertTriangle className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Expired</p>
      <p className="text-lg font-heading font-bold text-amber-600">{stats.expired.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
      <Lock className="w-4 h-4 text-orange-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Locked</p>
      <p className="text-lg font-heading font-bold text-orange-600">{stats.locked.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
      <DollarSign className="w-4 h-4 text-violet-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Bill</p>
      <p className="text-lg font-heading font-bold text-violet-600">৳{stats.approxBill.toLocaleString()}</p>
    </div>
  </div>
</div>

          {/* 🎯 Filter Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl flex-wrap">
              {(["All", "Online", "Offline", "Free", "Locked", "Disabled"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterTab(tab)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all",
                    filterTab === tab ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by owner or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all">
                <Copy className="h-3.5 w-3.5" /> Copy
              </button>
              <button onClick={exportPDF} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all">
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button onClick={exportExcel} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all">
                <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
              </button>
              <button onClick={exportCSV} className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all">
                <FileText className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
          </div>

          {/* 🎯 Table */}
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1600px]">
                <thead>
                  <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                    {columns.map((c) => {
                      const Icon = c.icon;
                      return (
                        <th
                          key={c.key}
                          className={cn(
                            "text-left px-3.5 py-4 font-semibold text-[11px] uppercase tracking-wider whitespace-nowrap",
                            c.sticky && "sticky left-0 bg-gradient-to-r from-signal to-signal z-10"
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            <Icon className="h-3.5 w-3.5 opacity-70" />
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
                      <tr key={r.id} className="border-t hover:bg-signal-tint/20 transition-colors">
                        <td className="px-3.5 py-3 font-mono font-bold text-signal">#{r.id}</td>
                        <td className="px-3.5 py-3 whitespace-nowrap sticky left-0 bg-card z-10">
                          <span className="font-semibold">{r.owner}</span>
                        </td>
                        <td className="px-3.5 py-3 font-mono font-bold">{r.total}</td>
                        <td className="px-3.5 py-3">
                          <button className="font-mono font-bold text-signal hover:underline">{r.ok}</button>
                        </td>

                        {/* Online */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "online")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.online.bg, metricConfig.online.color)}
                          >
                            <Wifi className="h-3 w-3" /> {r.online}
                          </button>
                        </td>

                        {/* Offline */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "offline")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.offline.bg, metricConfig.offline.color)}
                          >
                            <WifiOff className="h-3 w-3" /> {r.offline}
                          </button>
                        </td>

                        {/* Free */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "free")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.free.bg, metricConfig.free.color)}
                          >
                            <Gift className="h-3 w-3" /> {r.free}
                          </button>
                        </td>

                        {/* VIP */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "vip")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.vip.bg, metricConfig.vip.color)}
                          >
                            <Crown className="h-3 w-3" /> {r.vip}
                          </button>
                        </td>

                        {/* Expired */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "expired")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.expired.bg, metricConfig.expired.color)}
                          >
                            <AlertTriangle className="h-3 w-3" /> {r.expired}
                          </button>
                        </td>

                        {/* Locked */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "locked")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.locked.bg, metricConfig.locked.color)}
                          >
                            <Lock className="h-3 w-3" /> {r.locked}
                          </button>
                        </td>

                        <td className="px-3.5 py-3 font-mono text-muted-foreground">{r.grace}</td>

                        {/* Disabled */}
                        <td className="px-3.5 py-3">
                          <button
                            onClick={() => handleMetricClick(r.owner, "disabled")}
                            className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all hover:scale-105", metricConfig.disabled.bg, metricConfig.disabled.color)}
                          >
                            <Ban className="h-3 w-3" /> {r.disabled}
                          </button>
                        </td>

                        <td className="px-3.5 py-3 font-mono text-muted-foreground">{r.blocked}</td>
                        <td className="px-3.5 py-3 font-mono font-bold text-signal">৳{r.approxBill.toLocaleString()}</td>
                        <td className="px-3.5 py-3 font-mono">{r.nid}</td>
                        <td className="px-3.5 py-3 font-mono">{r.mobile}</td>
                        <td className="px-3.5 py-3 font-mono">{r.photo}</td>
                        <td className="px-3.5 py-3 font-mono">{r.location}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={18} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center">
                            <Users className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold">No records found</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>

                {/* Totals Footer */}
                <tfoot>
                  <tr className="bg-gradient-to-r from-signal/10 to-violet-accent/10 font-heading font-bold border-t-2 border-signal/30">
                    <td className="px-3.5 py-4" colSpan={2}>
                      <span className="text-signal">TOTAL</span>
                    </td>
                    <td className="px-3.5 py-4 font-mono">{totals.total.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.ok.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono text-emerald-600">{totals.online.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono text-red-600">{totals.offline.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono text-blue-600">{totals.free.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono text-violet-600">{totals.vip.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono text-amber-600">{totals.expired.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono text-orange-600">{totals.locked.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.grace}</td>
                    <td className="px-3.5 py-4 font-mono text-slate-600">{totals.disabled.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.blocked}</td>
                    <td className="px-3.5 py-4 font-mono text-signal">৳{totals.approxBill.toLocaleString()}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.nid}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.mobile}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.photo}</td>
                    <td className="px-3.5 py-4 font-mono">{totals.location}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 🎯 Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Show Entities</span>
                <select
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
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
                      currentPage === p ? "bg-signal text-white shadow-md" : "border bg-card hover:bg-muted"
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
      {detailModal.open && (
        <DetailModal
          owner={detailModal.owner!}
          metric={detailModal.metric!}
          onClose={() => setDetailModal({ open: false, owner: null, metric: null })}
        />
      )}

      {/* 🎯 Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl bg-emerald-500 text-white animate-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-bold">{toast}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Detail Modal
// ═══════════════════════════════════════════════════════════════
function DetailModal({ owner, metric, onClose }: { owner: string; metric: string; onClose: () => void }) {
  const metricLabels: Record<string, string> = {
    online: "Online Customers",
    offline: "Offline Customers",
    free: "Free Customers",
    vip: "VIP Customers",
    expired: "Expired Customers",
    locked: "Locked Customers",
    disabled: "Disabled Customers",
  };

  // ডেমো ডেটা
  const mockCustomers = Array.from({ length: 5 }).map((_, i) => ({
    id: `C-${String(1000 + i).padStart(4, "0")}`,
    name: ["Rahim Uddin", "Karim Ali", "Jamal Hossain", "Sultana Begum", "Rafiq Islam"][i],
    mobile: `017${String(10000000 + i * 111111).slice(0, 8)}`,
    package: ["10Mbps", "15Mbps", "20Mbps", "10Mbps", "8Mbps"][i],
    status: metricLabels[metric]?.replace(" Customers", "") || "Active",
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-gradient-to-r from-signal to-violet-accent" />
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-white shadow-md">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">{metricLabels[metric] || "Customers"}</h3>
              <p className="text-xs text-muted-foreground">{owner}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="text-left px-4 py-3 text-xs font-bold">ID</th>
                <th className="text-left px-4 py-3 text-xs font-bold">Customer</th>
                <th className="text-left px-4 py-3 text-xs font-bold">Mobile</th>
                <th className="text-left px-4 py-3 text-xs font-bold">Package</th>
                <th className="text-left px-4 py-3 text-xs font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCustomers.map((c, i) => (
                <tr key={i} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs text-signal font-bold">{c.id}</td>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs">{c.mobile}</td>
                  <td className="px-4 py-3 text-xs">{c.package}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-signal/10 text-signal">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted-foreground text-center mt-4">Showing first 5 of many customers…</p>
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80">
            Close
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg">
            View All
          </button>
        </div>
      </div>
    </div>
  );
}