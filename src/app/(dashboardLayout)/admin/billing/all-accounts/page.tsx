"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { AllAccountsTopbar } from "@/components/dashboard/all-accounts-topbar";
import { SidePanelModal } from "@/components/billing/side-panel-modal";
import { Input } from "@/components/ui/input";
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
  Calendar, FileDown, CalendarCog, Trash2, X, Users, Clock,
  AlertTriangle, DollarSign, Wallet, Eye, Copy, RefreshCw, Send, Pencil,
} from "lucide-react";

interface ClientData {
  id: string;
  cid: string;
  name: string;
  mobile: string;
  pkg: string;
  protocol: "PPPoE" | "Hotspot" | "Static";
  bill: number;
  balance: number;
  exp: string;
  lpay: string;
  status: "Active" | "Expired" | "Suspended";
}

const filterFields = [
  { label: "Pop In-Charge", placeholder: "Choose Pop In-Charge" },
  { label: "Protocol", placeholder: "Choose…" },
  { label: "Server", placeholder: "Choose Server" },
  { label: "Plan", placeholder: "Choose…" },
  { label: "Zone", placeholder: "Choose Zone" },
  { label: "Choose Subzone", placeholder: "Choose…" },
  { label: "Cycle Type", placeholder: "Choose…" },
  { label: "Cycle Date", placeholder: "Choose Cycle" },
  { label: "Category", placeholder: "Choose…" },
  { label: "Extended", placeholder: "Choose…" },
  { label: "Discounted", placeholder: "Choose…" },
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

const pillTone: Record<string, string> = {
  success: "border-success/30 text-success bg-success-tint",
  warning: "border-warning/30 text-warning bg-warning-tint",
  signal: "border-signal/30 text-signal bg-signal-tint",
  destructive: "border-destructive/30 text-destructive bg-destructive/10",
  violet: "border-violet-accent/30 text-violet-accent bg-violet-accent-tint",
};

const mockRows: ClientData[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `19726${i}`,
  cid: `0187857461${i}`,
  name: ["Shorup", "Karim Ali", "Jamal Uddin", "Sultana Begum", "Rafiq Islam", "Nasir Ahmed"][i % 6],
  mobile: `01878574${600 + i}`,
  pkg: ["150Tk@3Mb30Day0Hour", "500Tk@10Mb30Day", "300Tk@5Mb30Day"][i % 3],
  protocol: (["PPPoE", "Hotspot", "Static"] as const)[i % 3],
  bill: [150, 500, 300][i % 3],
  balance: i % 4 === 0 ? 0 : 100 + i * 10,
  exp: `0${(i % 9) + 1}/09/23 18:29`,
  lpay: `10/08/23`,
  status: (["Active", "Expired", "Suspended"] as const)[i % 3],
}));

const getAvatarColor = (name: string) => {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const statusConfig = {
  Active: { bg: "bg-success-tint", color: "text-success", dot: "bg-success" },
  Expired: { bg: "bg-destructive/10", color: "text-destructive", dot: "bg-destructive" },
  Suspended: { bg: "bg-warning-tint", color: "text-warning", dot: "bg-warning" },
};

// 🎯 Three Dot Menu Actions
const threeDotActions = [
  { label: "Recharge Balance", icon: Wallet },
  { label: "Renew", icon: RefreshCw },
  { label: "Show Password", icon: Eye },
  { label: "Send Info", icon: Send },
  { label: "Edit", icon: Pencil },
  { label: "Copy Payment Link", icon: Copy },
];

function formatNumber(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function AllAccountsPage() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const [deleteAccepted, setDeleteAccepted] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [rows] = useState<ClientData[]>(mockRows);

  // 🎯 Three-dot dropdown state
  const [threeDotOpen, setThreeDotOpen] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter(r => r.status === "Active").length;
    const expired = rows.filter(r => r.status === "Expired").length;
    const revenue = rows.reduce((acc, r) => acc + r.bill, 0);
    return { total, active, expired, revenue };
  }, [rows]);

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return rows;
    const q = searchTerm.toLowerCase();
    return rows.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.cid.includes(q) ||
      r.mobile.includes(q) ||
      r.id.includes(q)
    );
  }, [rows, searchTerm]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRows.map(r => r.id));
    }
  };

  const handleThreeDotClick = (id: string) => {
    setThreeDotOpen(threeDotOpen === id ? null : id);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <AllAccountsTopbar />

        <div className="px-4 sm:px-8 py-7 pb-24">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
                Billing Management
              </p>
              <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                All Accounts
              </h1>
            </div>
            <button className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold bg-white text-signal hover:shadow-md transition-all">
              <Download className="h-4 w-4" />
              Export Data
            </button>
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
                <UserCheck className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Active</p>
                <p className="text-lg font-heading font-bold text-success">{stats.active}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Expired</p>
                <p className="text-lg font-heading font-bold text-destructive">{stats.expired}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total Bill</p>
                <p className="text-lg font-heading font-bold text-warning">৳{formatNumber(stats.revenue)}</p>
              </div>
            </div>
          </div>

          {/* Action Pills */}
          <div className="flex flex-wrap gap-2.5 mb-4">
            {actionPills.map(({ label, icon: Icon, tone }) => (
              <button
                key={label}
                onClick={() => setOpenModal(label)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold bg-white whitespace-nowrap hover:shadow-md transition-all",
                  pillTone[tone]
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
            <button className="flex items-center gap-1.5 rounded-full border border-slate-300 text-slate-500 px-4 py-2 text-xs font-bold bg-white whitespace-nowrap hover:border-signal hover:text-signal ml-auto transition-all">
              More
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* More Menu Items */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {moreMenuItems.map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setOpenModal(label)}
                className="flex items-center gap-1.5 rounded-full border border-dashed border-slate-300 text-slate-500 px-4 py-1.5 text-[11px] font-semibold bg-white whitespace-nowrap hover:border-signal hover:text-signal transition-all"
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Collapsible Filter Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 mb-6 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-bold text-signal">
                <Filter className="h-4 w-4" />
                Advanced Filters
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-signal-tint text-signal">
                  {filterFields.length + dateFields.length + 1} Fields
                </span>
              </span>
              <ChevronDown className={cn("h-4 w-4 text-signal transition-transform", showFilters && "rotate-180")} />
            </button>

            {showFilters && (
              <div className="px-5 pb-5 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-4 mb-3">
                  {filterFields.map((f) => (
                    <div key={f.label} className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{f.label}</label>
                      <Select>
                        <SelectTrigger className="h-9 text-xs">
                          <SelectValue placeholder={f.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="opt1">Option 1</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-end">
                  {dateFields.map((label) => (
                    <div key={label} className="space-y-1">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</label>
                      <div className="relative">
                        <Input placeholder="dd/mm/yyyy" className="pr-9 h-9 text-xs" />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>
                  ))}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Balance</label>
                    <Select>
                      <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Choose…" /></SelectTrigger>
                      <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <button className="h-9 rounded-lg bg-signal text-white font-bold text-xs hover:bg-signal-hover transition-all flex items-center justify-center gap-1.5">
                    <Search className="h-3.5 w-3.5" />
                    Search
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search by name, C.ID, mobile…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {filteredRows.length} of {rows.length} results
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[1300px]">
              <thead>
                <tr className="bg-signal text-white">
                  <th className="px-4 py-3.5 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === filteredRows.length && filteredRows.length > 0}
                      onChange={toggleSelectAll}
                      className="accent-white w-4 h-4 cursor-pointer"
                    />
                  </th>
                  {["ID", "C.ID", "Name", "Mobile", "Package", "Protocol", "Bill", "Balance", "Exp Date", "L.Pay Date", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 font-bold text-[11px] tracking-wider uppercase whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => {
                  const isSelected = selectedIds.includes(r.id);
                  const sc = statusConfig[r.status];
                  const initials = r.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
                  return (
                    <tr
                      key={r.id}
                      className={cn(
                        "border-t border-slate-100 transition-colors",
                        isSelected ? "bg-signal-tint" : "hover:bg-slate-50"
                      )}
                    >
                      <td className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(r.id)}
                          className="accent-signal w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">{r.id}</td>
                      <td className="px-4 py-3.5">
                        <span className="flex items-center gap-1.5 text-signal font-bold text-xs">
                          <Link2 className="h-3 w-3" />
                          {r.cid}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        {/* 🎯 Name → View Information Page */}
                        <Link
                          href={`/admin/clients/view-information?clientId=${r.cid}`}
                          className="flex items-center gap-2.5 group text-left"
                        >
                          <div className={cn("w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-[10px] shadow-sm", getAvatarColor(r.name))}>
                            {initials}
                          </div>
                          <span className="font-semibold text-xs text-signal group-hover:underline">
                            {r.name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{r.mobile}</td>
                      <td className="px-4 py-3.5">
                        <span className="font-mono text-[11px] px-2 py-1 rounded-md bg-slate-100 text-slate-600">
                          {r.pkg}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-md",
                          r.protocol === "PPPoE" ? "bg-signal-tint text-signal" :
                          r.protocol === "Hotspot" ? "bg-success-tint text-success" :
                          "bg-violet-accent-tint text-violet-accent"
                        )}>
                          {r.protocol}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-signal text-xs">৳{r.bill}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{r.balance}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">{r.exp}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-500">{r.lpay}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold", sc.bg, sc.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setOpenModal("Bulk Renew")}
                            className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-signal text-white hover:bg-signal-hover transition-colors"
                          >
                            Renew
                          </button>
                          {/* 🎯 Three Dot Menu */}
                          <div className="relative">
                            <button
                              onClick={() => handleThreeDotClick(r.id)}
                              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                            {threeDotOpen === r.id && (
                              <>
                                {/* Backdrop */}
                                <div
                                  className="fixed inset-0 z-30"
                                  onClick={() => setThreeDotOpen(null)}
                                />
                                {/* Dropdown */}
                                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden">
                                  {threeDotActions.map((action) => {
                                    const Icon = action.icon;
                                    return (
                                      <button
                                        key={action.label}
                                        onClick={() => {
                                          alert(`${action.label} for ${r.name}`);
                                          setThreeDotOpen(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-signal transition-colors text-left"
                                      >
                                        <Icon className="h-3.5 w-3.5" />
                                        {action.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2 text-xs">
                Items per page:
                <select className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs text-signal">
                  <option>25</option>
                  <option>50</option>
                  <option>100</option>
                </select>
                <span>1-{filteredRows.length} of {filteredRows.length} items</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Previous</button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">1</button>
                <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center gap-3 bg-white border-2 border-signal/30 rounded-2xl shadow-2xl px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2 pr-3 border-r border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center">
                {selectedIds.length}
              </div>
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Selected</span>
            </div>
            <button
              onClick={() => setOpenModal("Bulk Renew")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-warning-tint text-warning hover:bg-warning/20 transition-colors"
            >
              <CheckSquare className="h-3.5 w-3.5" /> Renew
            </button>
            <button
              onClick={() => setOpenModal("Bulk SMS")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-signal-tint text-signal hover:bg-signal/20 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" /> SMS
            </button>
            <button
              onClick={() => setOpenModal("Change Plan")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-violet-accent-tint text-violet-accent hover:bg-violet-accent/20 transition-colors"
            >
              <Repeat className="h-3.5 w-3.5" /> Change Plan
            </button>
            <button
              onClick={() => setOpenModal("Client Delete")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals (unchanged) */}
      <SidePanelModal open={openModal === "Bulk Renew"} onClose={() => setOpenModal(null)} title="Bulk Renew">
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

      <SidePanelModal open={openModal === "Bulk SMS"} onClose={() => setOpenModal(null)} title="Bulk SMS">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Message</label>
          <textarea
            placeholder="Type your SMS message…"
            className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none text-signal"
          />
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "Change Zone"} onClose={() => setOpenModal(null)} title="Change Zone">
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

      <SidePanelModal open={openModal === "Change Owner"} onClose={() => setOpenModal(null)} title="Reseller Update">
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
        warning="After server change or plan change please sync Manually from Mikrotik. Otherwise, User can not be connected to Mikrotik."
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Server</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose Server" /></SelectTrigger>
            <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "Left"} onClose={() => setOpenModal(null)} title="Left" confirmLabel="Ok" exitLabel="Cancel">
        <div className="bg-slate-50 rounded-xl p-5 text-sm">
          <p className="font-semibold mb-1 text-signal">isp.name.com says</p>
          <p className="text-slate-500">Are you sure? Selected users will be deleted from Mikrotik.</p>
        </div>
      </SidePanelModal>

      <SidePanelModal
        open={openModal === "Change Plan"}
        onClose={() => setOpenModal(null)}
        title="Change Plan"
        warning="After bulk date change please sync Manually from Mikrotik. Otherwise, User can not be connected to Mikrotik."
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Server</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose Server" /></SelectTrigger>
            <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Plan</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Choose…" /></SelectTrigger>
            <SelectContent><SelectItem value="opt1">Plan 1 (Basic)</SelectItem></SelectContent>
          </Select>
        </div>
      </SidePanelModal>

      <SidePanelModal open={openModal === "BTRC Report Download"} onClose={() => setOpenModal(null)} title="BTRC Report Download">
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
        warning="After bulk date change please sync Manually from Mikrotik. Otherwise, User can not be connected to Mikrotik."
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-signal">Set Date</label>
          <div className="relative">
            <Input placeholder="mm/dd/yyyy" className="pr-9" />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
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
        warning="After delete, It can not be restored. All related sales and other activities will also be deleted."
        onConfirm={() => {
          if (deleteAccepted) {
            setOpenModal(null);
            setSelectedIds([]);
          }
        }}
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
    </div>
  );
}