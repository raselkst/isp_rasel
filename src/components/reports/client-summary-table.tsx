"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Award,
  Medal,
  Trophy,
  ArrowUpDown,
  Filter,
  Eye,
  MoreVertical,
  BarChart3,
  Download,
  Printer,
  Copy,
  FileText,
  FileSpreadsheet,
  FileJson,
  X,
  Check,
  MapPin,
  Building2,
  Activity,
  Layers,
} from "lucide-react";

export interface ClientSummaryRow {
  entity: string;
  total: number;
  active: number;
  expired: number;
  left: number;
  pending: number;
  pppoe: number;
  hotspot: number;
  free: number;
  vip: number;
}

interface ClientSummaryTableProps {
  title: string;
  entityColumnLabel: string;
  rows: ClientSummaryRow[];
  linkFirstRow?: boolean;
}

// 🎯 র্যাঙ্কিং ব্যাজ
const getRankBadge = (index: number) => {
  if (index === 0) return { icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", label: "Top" };
  if (index === 1) return { icon: Medal, color: "text-slate-400", bg: "bg-slate-400/10", label: "2nd" };
  if (index === 2) return { icon: Award, color: "text-orange-600", bg: "bg-orange-600/10", label: "3rd" };
  return null;
};

// 🎯 হেলথ স্কোর
const getHealthScore = (row: ClientSummaryRow) => {
  if (row.total === 0) return 0;
  return Math.round((row.active / row.total) * 100);
};

// 🎯 হেলথ কালার
const getHealthColor = (score: number) => {
  if (score >= 75) return { text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500" };
  if (score >= 50) return { text: "text-amber-600", gradient: "from-amber-500 to-orange-500" };
  if (score >= 25) return { text: "text-orange-600", gradient: "from-orange-500 to-red-500" };
  return { text: "text-red-600", gradient: "from-red-500 to-rose-500" };
};

// 🎯 স্ট্যাটাস ব্যাজ
const StatusBadge = ({ value, type }: { value: number; type: "active" | "expired" | "left" | "pending" | "default" | "free" | "vip" }) => {
  const colorMap: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    expired: "bg-red-500/10 text-red-600 border-red-500/20",
    left: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    pending: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    free: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    vip: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    default: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={cn("inline-flex items-center justify-center min-w-[36px] px-2 py-1 rounded-lg text-xs font-bold border", colorMap[type])}>
      {value}
    </span>
  );
};

export function ClientSummaryTable({
  title,
  entityColumnLabel,
  rows,
  linkFirstRow = true,
}: ClientSummaryTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof ClientSummaryRow>("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired" | "pending" | "left">("all");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 স্ট্যাট
  const stats = useMemo(() => {
    const totalEntities = rows.length;
    const totalClients = rows.reduce((acc, r) => acc + r.total, 0);
    const totalActive = rows.reduce((acc, r) => acc + r.active, 0);
    const totalExpired = rows.reduce((acc, r) => acc + r.expired, 0);
    return { totalEntities, totalClients, totalActive, totalExpired };
  }, [rows]);

  // 🎯 ফিল্টার ও সর্ট
  const processedRows = useMemo(() => {
    let result = [...rows];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r => r.entity.toLowerCase().includes(q));
    }

    if (statusFilter !== "all") {
      result = result.filter(r => r[statusFilter as keyof ClientSummaryRow] as number > 0);
    }

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      }
      return sortOrder === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });

    return result;
  }, [rows, searchTerm, sortKey, sortOrder, statusFilter]);

  const handleSort = (key: keyof ClientSummaryRow) => {
    if (sortKey === key) setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortOrder("desc"); }
  };

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: keyof ClientSummaryRow }) => (
    <th
      className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn("h-3 w-3 opacity-50", sortKey === sortKeyName && "opacity-100")} />
      </div>
    </th>
  );

  // 🎯 Export Functions
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ["Rank", entityColumnLabel, "Total", "Active", "Expired", "Left", "Pending", "PPPOE", "Hotspot", "Free", "VIP", "Health"];
    const rowsData = processedRows.map((r, i) => [
      i + 1, r.entity, r.total, r.active, r.expired, r.left, r.pending, r.pppoe, r.hotspot, r.free, r.vip, `${getHealthScore(r)}%`
    ]);
    const csv = [headers, ...rowsData].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.csv`, "text/csv");
  };

  const exportAsJSON = () => {
    downloadFile(JSON.stringify(processedRows, null, 2), `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`, "application/json");
  };

  const exportAsExcel = () => {
    const headers = ["Rank", entityColumnLabel, "Total", "Active", "Expired", "Left", "Pending", "PPPOE", "Hotspot", "Free", "VIP", "Health"];
    const rowsData = processedRows.map((r, i) => [
      i + 1, r.entity, r.total, r.active, r.expired, r.left, r.pending, r.pppoe, r.hotspot, r.free, r.vip, `${getHealthScore(r)}%`
    ]);
    const tsv = [headers, ...rowsData].map(row => row.join("\t")).join("\n");
    downloadFile(tsv, `${title.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.xls`, "application/vnd.ms-excel");
  };

  const exportAsPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>${title} Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #0F8B8D; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
        th { background: #0F8B8D; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
        <h1>${title}</h1>
        <p>Generated: ${new Date().toLocaleString()} | Total: ${processedRows.length} entries</p>
        <table><thead><tr><th>Rank</th><th>${entityColumnLabel}</th><th>Total</th><th>Active</th><th>Expired</th><th>Left</th><th>Pending</th><th>Health</th></tr></thead>
        <tbody>${processedRows.map((r, i) => `<tr><td>${i + 1}</td><td>${r.entity}</td><td>${r.total}</td><td>${r.active}</td><td>${r.expired}</td><td>${r.left}</td><td>${r.pending}</td><td>${getHealthScore(r)}%</td></tr>`).join("")}</tbody></table>
      </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  const handleCopy = () => {
    const text = processedRows.map(r => `${r.entity}\t${r.total}\t${r.active}\t${r.expired}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <MapPin className="h-3 w-3" />
              Reports & Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive breakdown of {entityColumnLabel.toLowerCase()}-wise client statistics.
            </p>
          </div>

          {/* Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <Layers className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">
        {entityColumnLabel}s
      </p>
      <p className="text-lg font-heading font-bold">{stats.totalEntities.toLocaleString()}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
      <Users className="w-4 h-4 text-violet-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Clients</p>
      <p className="text-lg font-heading font-bold text-violet-600">{stats.totalClients.toLocaleString()}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <UserCheck className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Active</p>
      <p className="text-lg font-heading font-bold text-emerald-600">{stats.totalActive.toLocaleString()}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
      <UserX className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Expired</p>
      <p className="text-lg font-heading font-bold text-red-600">{stats.totalExpired.toLocaleString()}</p>
    </div>
  </div>
</div>

          {/* Search + Filter + Export Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              {[
                { key: "all", label: "All" },
                { key: "active", label: "Active" },
                { key: "expired", label: "Expired" },
                { key: "pending", label: "Pending" },
                { key: "left", label: "Left" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setStatusFilter(tab.key as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    statusFilter === tab.key ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder={`Search ${entityColumnLabel.toLowerCase()}…`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:shadow-md transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>
              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border rounded-xl shadow-xl overflow-hidden z-40">
                  {[
                    { label: "Export as PDF", icon: FileText, action: exportAsPDF, color: "text-red-500" },
                    { label: "Export as Excel", icon: FileSpreadsheet, action: exportAsExcel, color: "text-emerald-500" },
                    { label: "Export as CSV", icon: FileText, action: exportAsCSV, color: "text-blue-500" },
                    { label: "Export as JSON", icon: FileJson, action: exportAsJSON, color: "text-violet-500" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setExportMenuOpen(false); }}
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

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:shadow-md transition-all"
              title="Copy to clipboard"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>

            <button
              onClick={exportAsPDF}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:shadow-md transition-all"
              title="Print"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </button>
          </div>

          {/* Enhanced Table */}
          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                  <th className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap w-16">Rank</th>
                  <SortHeader label={entityColumnLabel} sortKeyName="entity" />
                  <SortHeader label="Total" sortKeyName="total" />
                  <SortHeader label="Active" sortKeyName="active" />
                  <SortHeader label="Expired" sortKeyName="expired" />
                  <SortHeader label="Left" sortKeyName="left" />
                  <SortHeader label="Pending" sortKeyName="pending" />
                  <SortHeader label="PPPOE" sortKeyName="pppoe" />
                  <SortHeader label="Hotspot" sortKeyName="hotspot" />
                  <SortHeader label="Free" sortKeyName="free" />
                  <SortHeader label="VIP" sortKeyName="vip" />
                  <th className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Health</th>
                  <th className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody>
                {processedRows.length > 0 ? (
                  processedRows.map((r, i) => {
                    const rank = getRankBadge(i);
                    const RankIcon = rank?.icon;
                    const healthScore = getHealthScore(r);
                    const healthColor = getHealthColor(healthScore);
                    const isTopReseller = i === 0 && linkFirstRow;

                    return (
                      <tr key={i} className="border-t hover:bg-signal-tint/30 transition-colors group">
                        <td className="px-4 py-4">
                          {rank && RankIcon ? (
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", rank.bg)}>
                              <RankIcon className={cn("h-4 w-4", rank.color)} />
                            </div>
                          ) : (
                            <span className="text-xs font-mono text-muted-foreground pl-2">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {isTopReseller ? (
                            <a href="#" className="flex items-center gap-2 text-signal font-bold hover:underline">
                              <Eye className="h-3.5 w-3.5" />
                              {r.entity}
                            </a>
                          ) : (
                            <span className="font-semibold">{r.entity}</span>
                          )}
                        </td>
                        <td className="px-4 py-4"><StatusBadge value={r.total} type="default" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.active} type="active" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.expired} type="expired" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.left} type="left" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.pending} type="pending" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.pppoe} type="default" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.hotspot} type="default" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.free} type="free" /></td>
                        <td className="px-4 py-4"><StatusBadge value={r.vip} type="vip" /></td>
                        <td className="px-4 py-4">
                          <div className="w-28">
                            <div className="flex items-center justify-between mb-1">
                              <span className={cn("text-[10px] font-bold", healthColor.text)}>{healthScore}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full rounded-full bg-gradient-to-r transition-all", healthColor.gradient)} style={{ width: `${healthScore}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors" title="View">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="More">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={13} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-signal/10 flex items-center justify-center mb-4">
                          <Building2 className="h-9 w-9 text-signal" />
                        </div>
                        <p className="font-heading font-bold text-lg">No data found</p>
                        <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters or search term.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{processedRows.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{processedRows.length}</span>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">1</button>
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}