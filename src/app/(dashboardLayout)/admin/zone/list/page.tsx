"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListTopbar } from "@/components/dashboard/list-topbar";
import { ZoneSettingsModal } from "@/components/zone/zone-settings-modal";
import { ZoneInfoModal } from "@/components/zone/zone-info-modal";
import { cn } from "@/lib/utils";
import {
  Search, Wallet, Receipt, UserRoundPlus, FileBarChart, Filter, Plus,
  Download, Upload, MessageSquare, FileSpreadsheet, Settings, MoreHorizontal,
  Building2, Users, DollarSign, TrendingUp, CheckCircle2, XCircle, Calendar,
  Hash, ChevronLeft, ChevronRight, Eye, Edit3, Trash2, Activity, Zap, X,
  Copy, Archive, AlertTriangle, Send, FileText, Check,
} from "lucide-react";

// 🎯 জোন ডেটা টাইপ
interface Zone {
  id: number;
  name: string;
  mobile: string;
  balance: number;
  advBalance: number;
  creationDate: string;
  cidStart: string;
  billCycleChange: "Allowed" | "Disallowed";
  status: "Active" | "Inactive";
}

const initialZones: Zone[] = [
  { id: 52, name: "Hasan Cable Network [HCN]", mobile: "01713573422", balance: 490.0, advBalance: 0.0, creationDate: "2025-06-28", cidStart: "590001", billCycleChange: "Disallowed", status: "Active" },
  { id: 53, name: "Ujan Chor Internet [UCI]", mobile: "01713573423", balance: 1250.0, advBalance: 100.0, creationDate: "2025-06-28", cidStart: "590002", billCycleChange: "Allowed", status: "Inactive" },
  { id: 54, name: "Poli Network [PN]", mobile: "01713573424", balance: 780.0, advBalance: 50.0, creationDate: "2025-06-29", cidStart: "590003", billCycleChange: "Disallowed", status: "Active" },
  { id: 55, name: "AR Internet [ARI]", mobile: "01713573425", balance: 2100.0, advBalance: 200.0, creationDate: "2025-06-30", cidStart: "590004", billCycleChange: "Allowed", status: "Active" },
  { id: 56, name: "ZS Cable Network [ZSC]", mobile: "01713573426", balance: 340.0, advBalance: 0.0, creationDate: "2025-07-01", cidStart: "590005", billCycleChange: "Disallowed", status: "Inactive" },
  { id: 57, name: "Online Network [ON]", mobile: "01713573427", balance: 890.0, advBalance: 120.0, creationDate: "2025-07-02", cidStart: "590006", billCycleChange: "Allowed", status: "Active" },
  { id: 58, name: "Akas Cable Network [ACN]", mobile: "01713573428", balance: 450.0, advBalance: 30.0, creationDate: "2025-07-03", cidStart: "590007", billCycleChange: "Disallowed", status: "Active" },
  { id: 59, name: "Sky Net [SN]", mobile: "01713573429", balance: 1500.0, advBalance: 250.0, creationDate: "2025-07-04", cidStart: "590008", billCycleChange: "Allowed", status: "Active" },
  { id: 60, name: "Star Broadband [SB]", mobile: "01713573430", balance: 650.0, advBalance: 80.0, creationDate: "2025-07-05", cidStart: "590009", billCycleChange: "Disallowed", status: "Inactive" },
  { id: 61, name: "Metro Net [MN]", mobile: "01713573431", balance: 1100.0, advBalance: 150.0, creationDate: "2025-07-06", cidStart: "590010", billCycleChange: "Allowed", status: "Active" },
];

export default function ListZonePage() {
  const router = useRouter();
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Inactive">("All");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [moreMenuOpen, setMoreMenuOpen] = useState<number | null>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // 🎯 Modal States
  const [paymentModal, setPaymentModal] = useState<{ open: boolean; zone: Zone | null; type: "add" | "advance" }>({ open: false, zone: null, type: "add" });
  const [smsModal, setSmsModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; zone: Zone | null }>({ open: false, zone: null });
  const [advanceReportModal, setAdvanceReportModal] = useState<{ open: boolean; zone: Zone | null }>({ open: false, zone: null });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🎯 ক্লিক আউটসাইড
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // 🎯 টোস্ট অটো হাইড
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // 🎯 স্ট্যাট
  const stats = useMemo(() => {
    const total = zones.length;
    const active = zones.filter(z => z.status === "Active").length;
    const inactive = zones.filter(z => z.status === "Inactive").length;
    const totalBalance = zones.reduce((acc, z) => acc + z.balance, 0);
    return { total, active, inactive, totalBalance };
  }, [zones]);

  // 🎯 ফিল্টার
  const filteredZones = useMemo(() => {
    let result = zones;
    if (statusFilter !== "All") result = result.filter(z => z.status === statusFilter);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(z =>
        z.name.toLowerCase().includes(q) || z.mobile.includes(q) || String(z.id).includes(q)
      );
    }
    return result;
  }, [zones, searchTerm, statusFilter]);

  // 🎯 পেজিনেশন
  const totalPages = Math.ceil(filteredZones.length / pageSize);
  const paginatedZones = filteredZones.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, statusFilter, pageSize]);

  // 🎯 Excel Export
  const exportExcel = () => {
    const headers = ["ID", "Zone Name", "Mobile", "Balance", "Adv. Balance", "Creation Date", "C.ID Start", "Bill Cycle", "Status"];
    const rows = filteredZones.map(z => [z.id, z.name, z.mobile, z.balance, z.advBalance, z.creationDate, z.cidStart, z.billCycleChange, z.status]);
    const tsv = [headers, ...rows].map(r => r.join("\t")).join("\n");
    const blob = new Blob([tsv], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zones-${Date.now()}.xls`;
    a.click();
    URL.revokeObjectURL(url);
    setToast({ message: "Excel file downloaded!", type: "success" });
  };

  // 🎯 Import CSV
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").slice(1); // skip header
      const imported: Zone[] = lines
        .filter(l => l.trim())
        .map((line, i) => {
          const [name, mobile, balance, advBalance] = line.split(",").map(s => s.trim());
          return {
            id: Math.max(...zones.map(z => z.id), 0) + i + 1,
            name: name || "Imported Zone",
            mobile: mobile || "01700000000",
            balance: Number(balance) || 0,
            advBalance: Number(advBalance) || 0,
            creationDate: new Date().toISOString().split("T")[0],
            cidStart: String(600000 + i),
            billCycleChange: "Disallowed" as const,
            status: "Active" as const,
          };
        });
      setZones(prev => [...imported, ...prev]);
      setToast({ message: `${imported.length} zones imported!`, type: "success" });
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // 🎯 Add/Advance Payment
  const handlePaymentSubmit = (amount: number, remark: string, type: "add" | "advance") => {
    if (!paymentModal.zone) return;
    setZones(prev => prev.map(z => {
      if (z.id === paymentModal.zone!.id) {
        return type === "add"
          ? { ...z, balance: z.balance + amount }
          : { ...z, advBalance: z.advBalance + amount };
      }
      return z;
    }));
    setToast({
      message: `৳${amount} ${type === "add" ? "added to balance" : "added to advance balance"} for ${paymentModal.zone.name}!`,
      type: "success",
    });
    setPaymentModal({ open: false, zone: null, type: "add" });
  };

  // 🎯 Delete
  const handleDelete = () => {
    if (!deleteModal.zone) return;
    setZones(prev => prev.filter(z => z.id !== deleteModal.zone!.id));
    setToast({ message: `${deleteModal.zone.name} deleted!`, type: "success" });
    setDeleteModal({ open: false, zone: null });
  };

  // 🎯 SMS
  const handleSendSms = (message: string, recipients: string) => {
    setToast({ message: `SMS sent to ${recipients}!`, type: "success" });
    setSmsModal(false);
  };

  // 🎯 Copy ID
  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(String(id));
    setToast({ message: `Zone ID #${id} copied!`, type: "success" });
    setMoreMenuOpen(null);
  };

  // 🎯 Duplicate
  const handleDuplicate = (zone: Zone) => {
    const newZone: Zone = {
      ...zone,
      id: Math.max(...zones.map(z => z.id), 0) + 1,
      name: `${zone.name} (Copy)`,
      status: "Inactive",
    };
    setZones(prev => [newZone, ...prev]);
    setToast({ message: "Zone duplicated!", type: "success" });
    setMoreMenuOpen(null);
  };

  // 🎯 Archive (set inactive)
  const handleArchive = (zone: Zone) => {
    setZones(prev => prev.map(z => z.id === zone.id ? { ...z, status: "Inactive" as const } : z));
    setToast({ message: `${zone.name} archived!`, type: "success" });
    setMoreMenuOpen(null);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ListTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Building2 className="h-3 w-3" /> Zone Management
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              List Zone
            </h1>
          </div>

          {/* Compact Stat Cards - এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  {[
    { label: "Total Zones", value: stats.total, icon: Building2, bg: "bg-blue-500/10", color: "text-blue-600" },
    { label: "Active", value: stats.active, icon: CheckCircle2, bg: "bg-emerald-500/10", color: "text-emerald-600" },
    { label: "Inactive", value: stats.inactive, icon: XCircle, bg: "bg-red-500/10", color: "text-red-600" },
    { label: "Total Balance", value: `৳${stats.totalBalance.toLocaleString()}`, icon: DollarSign, bg: "bg-amber-500/10", color: "text-amber-600" },
  ].map((s) => (
    <div key={s.label} className="bg-card rounded-xl border p-3 flex items-center gap-3 hover:shadow-md transition-all">
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", s.bg)}>
        <s.icon className={cn("h-4 w-4", s.color)} />
      </div>
      <div className="flex items-baseline gap-2 min-w-0">
        <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">{s.label}</p>
        <p className={cn("text-lg font-heading font-bold", s.color)}>{s.value}</p>
      </div>
    </div>
  ))}
</div>

          {/* Filter Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              {(["All", "Active", "Inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all",
                    statusFilter === s ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                  <span className={cn("px-1.5 py-0.5 rounded-md text-[10px]", statusFilter === s ? "bg-signal/10 text-signal" : "bg-muted")}>
                    {s === "All" ? zones.length : zones.filter(z => z.status === s).length}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by name, mobile or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* Import */}
            <label className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all cursor-pointer">
              <Upload className="h-3.5 w-3.5" /> Import
              <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </label>

            {/* Send SMS */}
            <button
              onClick={() => setSmsModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all"
            >
              <MessageSquare className="h-3.5 w-3.5" /> Send SMS
            </button>

            {/* Excel */}
            <button
              onClick={exportExcel}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" /> Excel
            </button>

            {/* Settings */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold hover:shadow-md transition-all"
            >
              <Settings className="h-3.5 w-3.5" /> Settings
            </button>

            {/* Add New */}
            <button
              onClick={() => router.push("/admin/zone/create")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-signal to-violet-accent text-white text-xs font-bold shadow-md shadow-signal/20 hover:scale-105 transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Add Zone
            </button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                  {[
                    { label: "ID", icon: Hash }, { label: "Zone Name", icon: Building2 },
                    { label: "Mobile No.", icon: Users }, { label: "Balance", icon: Wallet },
                    { label: "Advance Balance", icon: TrendingUp }, { label: "Creation Date", icon: Calendar },
                    { label: "C.ID Start", icon: Hash }, { label: "Bill Cycle Change", icon: Activity },
                    { label: "Status", icon: Zap }, { label: "Actions", icon: MoreHorizontal },
                  ].map((h) => {
                    const Icon = h.icon;
                    return (
                      <th key={h.label} className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 opacity-70" /> {h.label}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedZones.length > 0 ? (
                  paginatedZones.map((z) => (
                    <tr key={z.id} className="border-t hover:bg-signal-tint/20 transition-colors group">
                      <td className="px-4 py-4">
                        <span className="font-mono font-bold text-signal">#{z.id}</span>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => setInfoOpen(true)}
                          className="flex items-center gap-2 text-signal font-semibold hover:underline text-left"
                        >
                          <div className="w-8 h-8 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                            <Building2 className="h-4 w-4 text-signal" />
                          </div>
                          {z.name}
                        </button>
                      </td>
                      <td className="px-4 py-4 font-mono text-xs">{z.mobile}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm">৳{z.balance.toFixed(2)}</span>
                          <button
                            title="Add Payment"
                            onClick={() => setPaymentModal({ open: true, zone: z, type: "add" })}
                            className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
                          >
                            <Wallet className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Pay Report"
                            onClick={() => router.push(`/admin/zone/zone-payment?zone=${z.id}`)}
                            className="w-7 h-7 rounded-lg bg-violet-500/10 text-violet-600 flex items-center justify-center hover:bg-violet-500/20 transition-colors"
                          >
                            <Receipt className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm">৳{z.advBalance.toFixed(2)}</span>
                          <button
                            title="Adv. Balance"
                            onClick={() => setPaymentModal({ open: true, zone: z, type: "advance" })}
                            className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center hover:bg-amber-500/20 transition-colors"
                          >
                            <UserRoundPlus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            title="Adv. Report"
                            onClick={() => setAdvanceReportModal({ open: true, zone: z })}
                            className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                          >
                            <FileBarChart className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{z.creationDate}</td>
                      <td className="px-4 py-4 font-mono text-xs">{z.cidStart}</td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                          z.billCycleChange === "Allowed" ? "bg-red-500/10 text-red-600" : "bg-slate-500/10 text-slate-600"
                        )}>
                          {z.billCycleChange}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold",
                          z.status === "Active" ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", z.status === "Active" ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
                          {z.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setInfoOpen(true)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal" title="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button onClick={() => router.push(`/admin/zone/edit/${z.id}`)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-violet-500" title="Edit">
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button onClick={() => setDeleteModal({ open: true, zone: z })} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="relative">
                            <button
                              onClick={() => setMoreMenuOpen(moreMenuOpen === z.id ? null : z.id)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                              title="More"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                            {moreMenuOpen === z.id && (
                              <div ref={moreMenuRef} className="absolute right-0 top-full mt-1 w-44 bg-card border rounded-xl shadow-xl overflow-hidden z-40">
                                <button onClick={() => handleCopyId(z.id)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-muted text-left">
                                  <Copy className="h-3.5 w-3.5 text-blue-500" /> Copy ID
                                </button>
                                <button onClick={() => handleDuplicate(z)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-muted text-left">
                                  <Copy className="h-3.5 w-3.5 text-violet-500" /> Duplicate
                                </button>
                                <button onClick={() => handleArchive(z)} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-semibold hover:bg-muted text-left">
                                  <Archive className="h-3.5 w-3.5 text-amber-500" /> Archive
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-signal" />
                        </div>
                        <p className="font-semibold">No zones found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
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
                  {filteredZones.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredZones.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredZones.length}</span>
                <span>items</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Page</span>
                <span className="font-semibold text-foreground">{currentPage}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{totalPages || 1}</span>
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

      {/* 🎯 Payment Modal */}
      {paymentModal.open && paymentModal.zone && (
        <PaymentModal
          zone={paymentModal.zone}
          type={paymentModal.type}
          onClose={() => setPaymentModal({ open: false, zone: null, type: "add" })}
          onSubmit={handlePaymentSubmit}
        />
      )}

      {/* 🎯 SMS Modal */}
      {smsModal && (
        <SmsModal
          zones={filteredZones}
          onClose={() => setSmsModal(false)}
          onSubmit={handleSendSms}
        />
      )}

      {/* 🎯 Delete Confirm Modal */}
      {deleteModal.open && deleteModal.zone && (
        <ConfirmModal
          title="Delete Zone"
          message={`Are you sure you want to delete "${deleteModal.zone.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onClose={() => setDeleteModal({ open: false, zone: null })}
          onConfirm={handleDelete}
          danger
        />
      )}

      {/* 🎯 Advance Report Modal */}
      {advanceReportModal.open && advanceReportModal.zone && (
        <AdvanceReportModal
          zone={advanceReportModal.zone}
          onClose={() => setAdvanceReportModal({ open: false, zone: null })}
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

      <ZoneSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <ZoneInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Payment Modal Component
// ═══════════════════════════════════════════════════════════════
function PaymentModal({
  zone,
  type,
  onClose,
  onSubmit,
}: {
  zone: Zone;
  type: "add" | "advance";
  onClose: () => void;
  onSubmit: (amount: number, remark: string, type: "add" | "advance") => void;
}) {
  const [amount, setAmount] = useState("");
  const [remark, setRemark] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(amount);
    if (!num || num <= 0) return;
    onSubmit(num, remark, type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className={cn("h-1.5 bg-gradient-to-r", type === "add" ? "from-emerald-500 to-teal-500" : "from-amber-500 to-orange-500")} />
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md bg-gradient-to-br", type === "add" ? "from-emerald-500 to-teal-500" : "from-amber-500 to-orange-500")}>
              {type === "add" ? <Wallet className="h-5 w-5" /> : <UserRoundPlus className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">
                {type === "add" ? "Add Payment" : "Add Advance Balance"}
              </h3>
              <p className="text-xs text-muted-foreground">{zone.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-muted/40 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Current {type === "add" ? "Balance" : "Adv. Balance"}
            </span>
            <span className="font-mono font-bold text-sm">
              ৳{type === "add" ? zone.balance.toFixed(2) : zone.advBalance.toFixed(2)}
            </span>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Amount *</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full px-4 py-3 rounded-xl border bg-background text-lg font-bold outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {[500, 1000, 2000, 5000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setAmount(String(amt))}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-muted/50 text-muted-foreground hover:bg-signal/10 hover:text-signal transition-all"
              >
                ৳{amt}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Remark (Optional)</label>
            <input
              type="text"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Payment note…"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80">
              Cancel
            </button>
            <button type="submit" className={cn("flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg transition-all", type === "add" ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gradient-to-r from-amber-500 to-orange-500")}>
              <Check className="h-4 w-4" /> Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 SMS Modal
// ═══════════════════════════════════════════════════════════════
function SmsModal({
  zones,
  onClose,
  onSubmit,
}: {
  zones: Zone[];
  onClose: () => void;
  onSubmit: (message: string, recipients: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState<"all" | "active" | "inactive">("all");

  const count = recipient === "all" ? zones.length : zones.filter(z => z.status.toLowerCase() === recipient).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message, `${count} zones (${recipient})`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-gradient-to-r from-signal to-violet-accent" />
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-white shadow-md">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">Send Bulk SMS</h3>
              <p className="text-xs text-muted-foreground">Notify zone owners via SMS</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Recipients</label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
            >
              <option value="all">All Zones ({zones.length})</option>
              <option value="active">Active Zones ({zones.filter(z => z.status === "Active").length})</option>
              <option value="inactive">Inactive Zones ({zones.filter(z => z.status === "Inactive").length})</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Message *</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your SMS message…"
              rows={4}
              maxLength={160}
              className="w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none"
            />
            <p className="text-[10px] text-muted-foreground text-right">{message.length}/160</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80">
              Cancel
            </button>
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg">
              <Send className="h-4 w-4" /> Send to {count}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Confirm Modal
// ═══════════════════════════════════════════════════════════════
function ConfirmModal({
  title, message, confirmLabel, onClose, onConfirm, danger,
}: {
  title: string; message: string; confirmLabel: string;
  onClose: () => void; onConfirm: () => void; danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className={cn("h-1.5 bg-gradient-to-r", danger ? "from-red-500 to-rose-500" : "from-signal to-violet-accent")} />
        <div className="p-6 text-center">
          <div className={cn("w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4", danger ? "bg-red-500/10" : "bg-signal/10")}>
            <AlertTriangle className={cn("h-7 w-7", danger ? "text-red-500" : "text-signal")} />
          </div>
          <h3 className="font-heading text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-6">{message}</p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80">
              Cancel
            </button>
            <button onClick={onConfirm} className={cn("flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg", danger ? "bg-gradient-to-r from-red-500 to-rose-500" : "bg-gradient-to-r from-signal to-violet-accent")}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// 🎯 Advance Report Modal
// ═══════════════════════════════════════════════════════════════
function AdvanceReportModal({ zone, onClose }: { zone: Zone; onClose: () => void }) {
  const mockHistory = [
    { date: "2025-09-15", amount: 100, type: "Credit", remark: "Monthly top-up" },
    { date: "2025-08-10", amount: 50, type: "Credit", remark: "Adjustment" },
    { date: "2025-07-05", amount: 25, type: "Debit", remark: "Usage deduction" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-500" />
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <FileBarChart className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold">Advance Balance Report</h3>
              <p className="text-xs text-muted-foreground">{zone.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-blue-700">Current Advance Balance</span>
            <span className="font-mono font-bold text-lg text-blue-700">৳{zone.advBalance.toFixed(2)}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Transaction History</p>
            <div className="space-y-2">
              {mockHistory.map((h, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
                  <div>
                    <p className="text-xs font-semibold">{h.remark}</p>
                    <p className="text-[10px] text-muted-foreground">{h.date}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-bold", h.type === "Credit" ? "text-emerald-600" : "text-red-600")}>
                      {h.type === "Credit" ? "+" : "-"}৳{h.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{h.type}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-full px-4 py-3 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}