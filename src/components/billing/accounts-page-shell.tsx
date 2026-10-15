"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { AllAccountsTopbar } from "@/components/dashboard/all-accounts-topbar";
import { SidePanelModal } from "@/components/billing/side-panel-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Filter, CheckSquare, MessageSquare, UserX, UserCheck, ArrowLeftRight,
  Server, Repeat, ChevronDown, Search, Download, MoreVertical, Link2,
  FileDown, CalendarCog, Trash2, Activity, TrendingUp,
  AlertCircle, Clock, Zap, X, CheckCircle2, AlertTriangle,
  FileSpreadsheet, FileJson, Printer, Copy, ChevronLeft, ChevronRight,
  Users, DollarSign, Send,
} from "lucide-react";

export type AccountsStatusFilter =
  | "all" | "active" | "today" | "expire3" | "expire7"
  | "expired" | "pending" | "suspend" | "left";

// 🎯 Theme-connected Status Badge Config
const statusBadgeConfig: Record<
  AccountsStatusFilter,
  { label: string; className: string; headerColor: string; showRenew?: boolean; icon: any }
> = {
  all: { label: "Expire", className: "bg-destructive/10 text-destructive border-destructive/20", headerColor: "bg-signal", showRenew: true, icon: AlertCircle },
  active: { label: "Active", className: "bg-success-tint text-success border-success/30", headerColor: "bg-signal", icon: Activity },
  today: { label: "New Today", className: "bg-violet-accent-tint text-violet-accent border-violet-accent/30", headerColor: "bg-signal", icon: TrendingUp },
  expire3: { label: "Expires in 3d", className: "bg-warning-tint text-warning border-warning/30", headerColor: "bg-signal", showRenew: true, icon: Clock },
  expire7: { label: "Expires in 7d", className: "bg-warning-tint text-warning border-warning/30", headerColor: "bg-signal", showRenew: true, icon: Clock },
  expired: { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/20", headerColor: "bg-signal", showRenew: true, icon: AlertCircle },
  pending: { label: "Pending", className: "bg-slate-100 text-slate-600 border-slate-200", headerColor: "bg-signal", icon: Clock },
  suspend: { label: "Suspended", className: "bg-warning-tint text-warning border-warning/30", headerColor: "bg-signal", icon: Zap },
  left: { label: "Left", className: "bg-destructive/10 text-destructive border-destructive/20", headerColor: "bg-signal", icon: UserX },
};

const filterFields = [
  { label: "Pop In-Charge", placeholder: "Choose Pop In-Charge", options: ["All", "Pop 1", "Pop 2"] },
  { label: "Protocol", placeholder: "Choose…", options: ["All", "PPPoE", "Hotspot", "Static"] },
  { label: "Server", placeholder: "Choose Server", options: ["All", "Server 1", "Server 2"] },
  { label: "Plan", placeholder: "Choose…", options: ["All", "Basic", "Standard", "Premium"] },
  { label: "Zone", placeholder: "Choose Zone", options: ["All", "Zone 1", "Zone 2"] },
  { label: "Choose Subzone", placeholder: "Choose…", options: ["All", "Sub 1", "Sub 2"] },
  { label: "Cycle Type", placeholder: "Choose…", options: ["All", "Monthly", "Yearly"] },
  { label: "Cycle Date", placeholder: "Choose Cycle", options: ["All", "1st", "15th", "30th"] },
  { label: "Category", placeholder: "Choose…", options: ["All", "Regular", "VIP", "Free"] },
  { label: "Extended", placeholder: "Choose…", options: ["All", "Yes", "No"] },
  { label: "Discounted", placeholder: "Choose…", options: ["All", "Yes", "No"] },
];

const dateFields = [
  "Expired Date From", "Expired Date To", "Join Date From", "Join Date To", "Payment Date From", "Payment Date To",
];

const actionPills = [
  { label: "Filter", icon: Filter, tone: "success" },
  { label: "Bulk Renew", icon: CheckSquare, tone: "warning" },
  { label: "Bulk SMS", icon: MessageSquare, tone: "signal" },
  { label: "Left", icon: UserX, tone: "destructive" },
  { label: "Activate", icon: UserCheck, tone: "violet" },
  { label: "Change Owner", icon: ArrowLeftRight, tone: "signal" },
  { label: "Change Zone", icon: ArrowLeftRight, tone: "signal" },
  { label: "Change Server", icon: Server, tone: "signal" },
  { label: "Change Plan", icon: Repeat, tone: "signal" },
];

const moreMenuItems = [
  { label: "BTRC Report Download", icon: FileDown },
  { label: "Set Bulk Date", icon: CalendarCog },
  { label: "Client Delete", icon: Trash2 },
];

// 🎯 Theme-connected pill tones
const pillTone: Record<string, string> = {
  success: "border-success/30 text-success hover:bg-success-tint",
  warning: "border-warning/30 text-warning hover:bg-warning-tint",
  signal: "border-signal/30 text-signal hover:bg-signal-tint",
  destructive: "border-destructive/30 text-destructive hover:bg-destructive/10",
  violet: "border-violet-accent/30 text-violet-accent hover:bg-violet-accent-tint",
};

const mockRows = Array.from({ length: 25 }).map((_, i) => ({
  id: `19726${i}`,
  cid: `0187857461${i}`,   // ← প্রতিটির জন্য ইউনিক
  name: i % 2 === 0 ? "Shorup Ahmed" : "Karim Uddin",
  mobile: "01878574612",
  pkg: i % 2 === 0 ? "150Tk@3Mb30Day" : "500Tk@10Mb30Day",
  protocol: i % 2 === 0 ? "Hotspot" : "PPPoE",
  bill: "150",
  balance: "00",
  exp: "07/09/23 18:29",
  lpay: "10/08/23",
  avatarColor: [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
  ][i % 4],
}));

interface AccountsPageShellProps {
  title: string;
  statusFilter: AccountsStatusFilter;
  topbar?: React.ReactNode;
}

export function AccountsPageShell({ title, statusFilter, topbar }: AccountsPageShellProps) {
  const badge = statusBadgeConfig[statusFilter];
  const BadgeIcon = badge.icon;
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [deleteAccepted, setDeleteAccepted] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [smsModal, setSmsModal] = useState(false);
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

  const filteredRows = useMemo(() => {
    let result = mockRows;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.id.includes(q) ||
        r.cid.includes(q) ||
        r.mobile.includes(q)
      );
    }
    return result;
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, pageSize]);

  const stats = useMemo(() => ({
    total: filteredRows.length,
    active: filteredRows.filter(r => r.protocol === "PPPoE").length,
    hotspot: filteredRows.filter(r => r.protocol === "Hotspot").length,
    totalBill: filteredRows.reduce((acc, r) => acc + Number(r.bill), 0),
  }), [filteredRows]);

  const toggleRow = (idx: number) => {
    setSelectedRows((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);
  };

  const toggleAll = () => {
    setSelectedRows((prev) => (prev.length === paginatedRows.length ? [] : paginatedRows.map((_, i) => i)));
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<html><head><title>${title}</title>
      <style>body{font-family:Arial;padding:20px;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid #ddd;padding:6px;font-size:11px;}th{background:#066F6F;color:#fff;}</style>
      </head><body><h1>${title}</h1><p>Generated: ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>ID</th><th>C.ID</th><th>Name</th><th>Mobile</th><th>Package</th><th>Protocol</th><th>Bill</th></tr></thead><tbody>
      ${filteredRows.map(r => `<tr><td>${r.id}</td><td>${r.cid}</td><td>${r.name}</td><td>${r.mobile}</td><td>${r.pkg}</td><td>${r.protocol}</td><td>${r.bill}</td></tr>`).join("")}
      </tbody></table></body></html>`);
    w.document.close();
    setTimeout(() => w.print(), 300);
    setToast({ message: "PDF opened!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportExcel = () => {
    const headers = ["ID", "C.ID", "Name", "Mobile", "Package", "Protocol", "Bill", "Balance"];
    const data = filteredRows.map(r => [r.id, r.cid, r.name, r.mobile, r.pkg, r.protocol, r.bill, r.balance]);
    const tsv = [headers, ...data].map(r => r.join("\t")).join("\n");
    downloadFile(tsv, `${title.toLowerCase().replace(/ /g, "-")}-${Date.now()}.xls`, "application/vnd.ms-excel");
    setToast({ message: "Excel downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportCSV = () => {
    const headers = ["ID", "C.ID", "Name", "Mobile", "Package", "Protocol", "Bill", "Balance"];
    const data = filteredRows.map(r => [r.id, r.cid, r.name, r.mobile, r.pkg, r.protocol, r.bill, r.balance]);
    const csv = [headers, ...data].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `${title.toLowerCase().replace(/ /g, "-")}-${Date.now()}.csv`, "text/csv");
    setToast({ message: "CSV downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(filteredRows, null, 2), `${title.toLowerCase().replace(/ /g, "-")}-${Date.now()}.json`, "application/json");
    setToast({ message: "JSON downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const handlePrint = () => { window.print(); setExportMenuOpen(false); };

  const handleCopy = () => {
    const text = filteredRows.map(r => `${r.id}\t${r.cid}\t${r.name}\t${r.mobile}`).join("\n");
    navigator.clipboard.writeText(text);
    setToast({ message: `${filteredRows.length} rows copied!`, type: "success" });
    setExportMenuOpen(false);
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) {
      setToast({ message: "Please select at least one client!", type: "error" });
      return;
    }
    if (action === "SMS") { setSmsModal(true); return; }
    if (action === "Renew") { setOpenModal("Bulk Renew"); return; }
    if (action === "Left") { setOpenModal("Left"); return; }
    setToast({ message: `${action} action triggered for ${selectedRows.length} clients!`, type: "success" });
  };

  const handleModalConfirm = () => {
    if (openModal === "Client Delete" && !deleteAccepted) {
      setToast({ message: "Please accept the terms first!", type: "error" });
      return;
    }
    setToast({ message: `${openModal} action applied to ${selectedRows.length || 1} client(s)!`, type: "success" });
    setOpenModal(null);
    setSelectedRows([]);
  };

  const handleSmsSubmit = (message: string) => {
    if (!message.trim()) {
      setToast({ message: "Please enter a message!", type: "error" });
      return;
    }
    setToast({ message: `SMS sent to ${selectedRows.length} clients!`, type: "success" });
    setSmsModal(false);
    setSelectedRows([]);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        {topbar || <AllAccountsTopbar />}

        <div className="px-4 sm:px-8 py-7">
          {/* Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Users className="h-3 w-3" /> Client Management
            </p>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                {title}
              </h1>
              <div className={cn("flex items-center gap-2 px-4 py-2.5 rounded-xl text-white shadow-lg", badge.headerColor)}>
                <BadgeIcon className="h-4 w-4" />
                <span className="text-sm font-bold">{badge.label}</span>
                <span className="text-xs opacity-80 border-l border-white/30 pl-2 ml-1">{filteredRows.length} records</span>
              </div>
            </div>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">PPPoE</p>
                <p className="text-lg font-heading font-bold text-success">{stats.active}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Hotspot</p>
                <p className="text-lg font-heading font-bold text-violet-accent">{stats.hotspot}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total Bill</p>
                <p className="text-lg font-heading font-bold text-warning">৳{stats.totalBill}</p>
              </div>
            </div>
          </div>

          {/* Action Pills */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {actionPills.map(({ label, icon: Icon, tone }) => (
                <button
                  key={label}
                  onClick={() => setOpenModal(label)}
                  className={cn("flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-bold bg-white whitespace-nowrap transition-all", pillTone[tone])}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
              <div className="ml-auto flex items-center gap-2">
                {moreMenuItems.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => setOpenModal(label)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 text-slate-500 px-3.5 py-2 text-xs font-bold bg-white whitespace-nowrap hover:border-signal hover:text-signal transition-all"
                  >
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Collapsible Filters */}
          <div className="bg-white rounded-2xl border border-slate-200 mb-4 overflow-hidden shadow-sm">
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-signal" />
                <span className="text-sm font-bold text-signal">Advanced Filters</span>
                <span className="text-xs text-slate-500">({filterFields.length + dateFields.length + 1} fields)</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-signal transition-transform", filtersExpanded && "rotate-180")} />
            </button>

            {filtersExpanded && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mt-4 mb-4">
                  {filterFields.map((f) => (
                    <div key={f.label} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{f.label}</label>
                      <select className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 text-signal">
                        {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-end">
                  {dateFields.map((label) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
                      <input type="date" className="w-full h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 text-signal" />
                    </div>
                  ))}
                  <button
                    onClick={() => setToast({ message: "Filters applied!", type: "success" })}
                    className="h-9 rounded-lg bg-signal text-white font-bold text-sm hover:bg-signal-hover transition-all shadow-md"
                  >
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Table Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search by name, ID, mobile…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white text-signal hover:bg-slate-50 transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { label: "PDF", icon: FileDown, action: exportPDF },
                    { label: "Excel", icon: FileSpreadsheet, action: exportExcel },
                    { label: "CSV", icon: FileDown, action: exportCSV },
                    { label: "JSON", icon: FileJson, action: exportJSON },
                    { divider: true },
                    { label: "Print", icon: Printer, action: handlePrint },
                    { label: "Copy", icon: Copy, action: handleCopy },
                  ].map((item: any, idx) => {
                    if (item.divider) return <div key={idx} className="border-t border-slate-100 my-1" />;
                    const Icon = item.icon;
                    return (
                      <button key={item.label} onClick={item.action} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors text-left text-signal">
                        <Icon className="h-4 w-4" /> {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1300px]">
                <thead>
                  <tr className="bg-signal text-white">
                    <th className="px-4 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === paginatedRows.length && paginatedRows.length > 0}
                        onChange={toggleAll}
                        className="accent-white w-4 h-4 cursor-pointer"
                      />
                    </th>
                    {["ID", "C.ID", "Name", "Mobile", "Package", "Protocol", "Bill", "Balance", "Exp Date", "L.Pay Date", "Status", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((r, i) => {
                      const isSelected = selectedRows.includes(i);
                      return (
                        <tr key={i} className={cn("border-t border-slate-100 transition-colors", isSelected ? "bg-signal-tint" : "hover:bg-slate-50")}>
                          <td className="px-4 py-3.5">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleRow(i)} className="accent-signal w-4 h-4 cursor-pointer" />
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-500">#{r.id}</td>
                          <td className="px-4 py-3.5">
                            <span className="flex items-center gap-1.5 text-signal font-bold text-xs">
                              <Link2 className="h-3 w-3" /> {r.cid}
                            </span>
                          </td>
                          <td className="px-4 py-3.5">
  {/* 🎯 নাম → View Information পেজে যাবে */}
  <Link
    href={`/admin/clients/view-information?clientId=${r.cid}`}
    className="flex items-center gap-2.5 group text-left"
  >
    <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-[10px] shadow-sm", r.avatarColor)}>
      {r.name.split(" ").map(n => n[0]).slice(0, 2).join("")}
    </div>
    <span className="font-semibold text-signal group-hover:underline">
      {r.name}
    </span>
  </Link>
</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{r.mobile}</td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex px-2 py-1 rounded-md bg-signal-tint text-signal text-[10px] font-bold">{r.pkg}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className={cn("inline-flex px-2 py-1 rounded-md text-[10px] font-bold",
                              r.protocol === "Hotspot" ? "bg-success-tint text-success" : "bg-signal-tint text-signal"
                            )}>
                              {r.protocol}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs text-signal font-bold">৳{r.bill}</td>
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-500">৳{r.balance}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">{r.exp}</td>
                          <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">{r.lpay}</td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap", badge.className)}>{badge.label}</span>
                              {badge.showRenew && (
                                <button
                                  onClick={() => setOpenModal("Bulk Renew")}
                                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-signal text-white shadow-sm hover:bg-signal-hover hover:scale-105 transition-all"
                                >
                                  Renew
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3.5">
                            <button className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center">
                            <Users className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold text-signal">No clients found</p>
                          <p className="text-xs text-slate-500">Try adjusting your search or filters.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold text-signal"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>•</span>
                <span className="font-semibold text-signal">
                  {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-signal">{filteredRows.length}</span>
                <span>items</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg font-bold text-xs transition-all",
                      currentPage === p ? "bg-signal text-white shadow-md" : "border border-slate-200 bg-white hover:bg-slate-50 text-signal"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedRows.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
            <span className="text-sm font-bold">{selectedRows.length} {selectedRows.length === 1 ? "client" : "clients"} selected</span>
            <div className="w-px h-6 bg-white/20" />
            <button onClick={() => handleBulkAction("Renew")} className="flex items-center gap-1.5 text-xs font-bold hover:text-signal transition-colors">
              <CheckSquare className="h-3.5 w-3.5" /> Renew
            </button>
            <button onClick={() => handleBulkAction("SMS")} className="flex items-center gap-1.5 text-xs font-bold hover:text-signal transition-colors">
              <MessageSquare className="h-3.5 w-3.5" /> SMS
            </button>
            <button onClick={() => handleBulkAction("Left")} className="flex items-center gap-1.5 text-xs font-bold hover:text-signal transition-colors">
              <UserX className="h-3.5 w-3.5" /> Left
            </button>
            <button onClick={() => setSelectedRows([])} className="ml-2 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {smsModal && (
        <SmsModal
          count={selectedRows.length}
          onClose={() => setSmsModal(false)}
          onSubmit={handleSmsSubmit}
        />
      )}

      {/* All Side Panels */}
      <SidePanelModal open={openModal === "Bulk Renew"} onClose={() => setOpenModal(null)} title="Bulk Renew" onConfirm={handleModalConfirm} confirmLabel="Renew">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Renewal</label>
          <Select defaultValue="full-month">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="full-month">Full Month</SelectItem>
              <SelectItem value="half-month">Half Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "Change Zone"} onClose={() => setOpenModal(null)} title="Change Zone" onConfirm={handleModalConfirm} confirmLabel="Update">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Zone</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select Zone" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="uci">ID: 53 - Ujan Chor Internet (UCI)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Sub-Zone</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose Server" /></SelectTrigger>
            <SelectContent><SelectItem value="none">None</SelectItem></SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "Change Owner"} onClose={() => setOpenModal(null)} title="Reseller Update" onConfirm={handleModalConfirm} confirmLabel="Update">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Reseller</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Change Pop In-Charge" /></SelectTrigger>
            <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal
        open={openModal === "Change Server"}
        onClose={() => setOpenModal(null)}
        title="Change Server"
        warning="After server change or plan change please sync Manually from Mikrotik."
        onConfirm={handleModalConfirm}
        confirmLabel="Update"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Server</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose Server" /></SelectTrigger>
            <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "Left"} onClose={() => setOpenModal(null)} title="Left" confirmLabel="Ok" exitLabel="Cancel" onConfirm={handleModalConfirm}>
        <div className="bg-slate-50 rounded-xl p-5 text-sm">
          <p className="font-semibold mb-1 text-signal">isp.name.com says</p>
          <p className="text-slate-500">Are you sure? Selected users will be deleted from Mikrotik.</p>
        </div>
      </SidePanelModal>

      <SidePanelModal
        open={openModal === "Change Plan"}
        onClose={() => setOpenModal(null)}
        title="Change Plan"
        warning="After bulk date change please sync Manually from Mikrotik."
        onConfirm={handleModalConfirm}
        confirmLabel="Update"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Plan</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent><SelectItem value="opt1">Plan 1 (Basic)</SelectItem></SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "BTRC Report Download"} onClose={() => setOpenModal(null)} title="BTRC Report Download" onConfirm={handleModalConfirm} confirmLabel="Download">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Protocol</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pppoe">PPPoE</SelectItem>
              <SelectItem value="hotspot">Hotspot</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Month</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="jan">January</SelectItem>
              <SelectItem value="feb">February</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal
        open={openModal === "Set Bulk Date"}
        onClose={() => setOpenModal(null)}
        title="Set Bulk Date"
        warning="After bulk date change please sync Manually from Mikrotik."
        onConfirm={handleModalConfirm}
        confirmLabel="Set Date"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Set Date</label>
          <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 text-signal" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Status</label>
          <Select defaultValue="active">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal
        open={openModal === "Client Delete"}
        onClose={() => setOpenModal(null)}
        title="Client Delete"
        warning="After delete, It can not be restored. All related sales will also be deleted."
        onConfirm={handleModalConfirm}
        confirmLabel="Delete"
        exitLabel="Cancel"
      >
        <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer text-signal">
          <input
            type="checkbox"
            checked={deleteAccepted}
            onChange={(e) => setDeleteAccepted(e.target.checked)}
            className="accent-destructive"
          />
          I Accept <span className="text-signal underline">Terms and Conditions</span>
        </label>
      </SidePanelModal>

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300 text-white",
          toast.type === "success" && "bg-signal",
          toast.type === "error" && "bg-destructive",
          toast.type === "info" && "bg-slate-600"
        )}>
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5" />}
          {toast.type === "error" && <AlertTriangle className="h-5 w-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// SMS Modal
function SmsModal({ count, onClose, onSubmit }: { count: number; onClose: () => void; onSubmit: (m: string) => void }) {
  const [message, setMessage] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-signal" />
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-signal flex items-center justify-center text-white shadow-md">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-signal">Send Bulk SMS</h3>
              <p className="text-xs text-slate-500">To {count} selected clients</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(message); }} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-signal">Message *</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your SMS message…"
              rows={4}
              maxLength={160}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none text-signal"
            />
            <p className="text-[10px] text-slate-500 text-right">{message.length}/160</p>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
              Cancel
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-signal text-white shadow-lg hover:bg-signal-hover transition-all">
              <Send className="h-4 w-4" /> Send SMS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}