"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ListFilter, FileText, Printer, Copy, Search, ChevronLeft, ChevronRight,
  ArrowUpDown, AlertCircle, CheckCircle2, AlertTriangle, Info, XCircle,
  Activity, Filter, X, RefreshCw, Server, Trash2, Eye, Download,
  Play, Pause
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "user", label: "User" },
  { key: "ip", label: "IP" },
  { key: "time", label: "Time" },
  { key: "server", label: "Server" },
  { key: "messages", label: "Messages" },
];

const messagesPool = [
  "Logged in successfully",
  "Session started",
  "Logged out",
  "Authentication failed - wrong password",
  "Connection timeout",
  "Reconnected after drop",
  "Bandwidth limit reached",
  "Package upgraded",
  "Package expired",
  "MAC address changed",
];

function generateLog(i: number) {
  const statuses = ["success", "success", "info", "warning", "error"];
  const status = statuses[i % statuses.length];
  const now = new Date();
  now.setMinutes(now.getMinutes() - i * 3);
  return {
    id: i + 1,
    user: ["jihad1019", "mogul_ali", "rahim_uddin", "karim_hossain", "nusrat_j", "sabbir_a"][i % 6],
    ip: `10.5.50.${100 + (i % 50)}`,
    time: now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    server: ["SERVER-2", "SERVER-3", "SERVER-4"][i % 3],
    messages: messagesPool[i % messagesPool.length],
    status,
  };
}

const initialRows = Array.from({ length: 25 }).map((_, i) => generateLog(i));

// 🎯 Theme-Connected Status Icon
function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "success": return <CheckCircle2 className="w-4 h-4 text-success" />;
    case "warning": return <AlertTriangle className="w-4 h-4 text-warning" />;
    case "error": return <XCircle className="w-4 h-4 text-destructive" />;
    case "info": return <Info className="w-4 h-4 text-signal" />;
    default: return <Info className="w-4 h-4 text-slate-400" />;
  }
}

// 🎯 Theme-Connected Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    success: "bg-success-tint text-success border-success/30",
    warning: "bg-warning-tint text-warning border-warning/30",
    error: "bg-destructive/10 text-destructive border-destructive/30",
    info: "bg-signal-tint text-signal border-signal/30",
  };
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase border",
      styles[status] || styles.info
    )}>
      {status}
    </span>
  );
}

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="rounded-full gap-1.5 font-semibold text-xs h-9 text-signal border-signal/30 hover:bg-signal/5"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export default function HotspotLogPage() {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "success" | "warning" | "error" | "info">("all");
  const [serverFilter, setServerFilter] = useState<"all" | string>("all");
  const [showServerFilter, setShowServerFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setRows((prev) => {
        const newLog = { ...generateLog(0), id: Date.now() };
        return [newLog, ...prev.slice(0, 24)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const serverOptions = useMemo(() => Array.from(new Set(rows.map((r) => r.server))), [rows]);

  const stats = useMemo(() => ({
    total: rows.length,
    success: rows.filter((r) => r.status === "success").length,
    warning: rows.filter((r) => r.status === "warning").length,
    error: rows.filter((r) => r.status === "error").length,
  }), [rows]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ip.includes(searchTerm) ||
        r.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.messages.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesServer = serverFilter === "all" || r.server === serverFilter;
      return matchesSearch && matchesStatus && matchesServer;
    });
  }, [rows, searchTerm, statusFilter, serverFilter]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);

  const allSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selectedRows.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedRows.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedRows.map((r) => r.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServerFilter("all");
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setRows(Array.from({ length: 25 }).map((_, i) => generateLog(i)));
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0
      ? sortedRows.filter((r) => selectedRows.includes(r.id))
      : sortedRows;
    const headers = ["SL", "User", "IP", "Time", "Server", "Messages", "Status"].join(",");
    const csvRows = dataToExport.map((r, i) =>
      [i + 1, `"${r.user}"`, `"${r.ip}"`, `"${r.time}"`, `"${r.server}"`, `"${r.messages}"`, r.status].join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hotspot-log-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} log entries to CSV.`);
  };

  const handleCopy = () => {
    const dataToCopy = selectedRows.length > 0
      ? sortedRows.filter((r) => selectedRows.includes(r.id))
      : sortedRows;
    const headers = columns.map((c) => c.label).join("\t");
    const body = dataToCopy.map((r) => [r.user, r.ip, r.time, r.server, r.messages].join("\t")).join("\n");
    navigator.clipboard.writeText(`${headers}\n${body}`);
    alert(`Copied ${dataToCopy.length} log entries to clipboard.`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const dataToPrint = selectedRows.length > 0
      ? sortedRows.filter((r) => selectedRows.includes(r.id))
      : sortedRows;
    const rowsHtml = dataToPrint.map((r) => `
      <tr>
        <td>${r.user}</td>
        <td>${r.ip}</td>
        <td>${r.time}</td>
        <td>${r.server}</td>
        <td>${r.messages}</td>
        <td>${r.status}</td>
      </tr>`).join("");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hotspot Log Report</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #1e293b; }
            h1 { font-size: 20px; margin-bottom: 4px; color: #066F6F; }
            p { color: #64748b; font-size: 12px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
            th { background: #066F6F; color: white; font-weight: 600; }
            tr:nth-child(even) td { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Hotspot Log Report</h1>
          <p>Generated on ${new Date().toLocaleString()} · Total: ${dataToPrint.length} entries</p>
          <table>
            <thead>
              <tr><th>User</th><th>IP</th><th>Time</th><th>Server</th><th>Messages</th><th>Status</th></tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  const handleView = (r: any) => {
    alert(`Log Details:\n\nUser: ${r.user}\nIP: ${r.ip}\nTime: ${r.time}\nServer: ${r.server}\nMessage: ${r.messages}\nStatus: ${r.status}`);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one log entry.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} log(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} log(s) deleted.`);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
                Hotspot Log Monitor
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track all user activities and system events.
              </p>
            </div>
            {isLive && (
              <span className="flex items-center gap-2 bg-success-tint text-success px-3 py-1.5 rounded-full text-xs font-bold border border-success/30">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                LIVE STREAMING
              </span>
            )}
          </div>

          {/* Compact Theme Stat Cards - এক লাইনে */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 shadow-md text-white bg-gradient-to-br from-signal to-signal-light">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 shadow-md text-white bg-gradient-to-br from-success to-success/80">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Success</p>
                <p className="text-lg font-heading font-bold">{stats.success}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 shadow-md text-white bg-gradient-to-br from-warning to-warning/80">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Warning</p>
                <p className="text-lg font-heading font-bold">{stats.warning}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 shadow-md text-white bg-gradient-to-br from-destructive to-destructive/80">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Errors</p>
                <p className="text-lg font-heading font-bold">{stats.error}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-signal">Log List</h2>
              {selectedRows.length > 0 && (
                <span className="bg-signal-tint text-signal text-xs font-semibold px-3 py-1 rounded-full border border-signal/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {selectedRows.length} selected
                  <button onClick={() => setSelectedRows([])} className="ml-1 hover:bg-signal/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search logs..."
                  className="pl-9 rounded-full w-64 h-9 border-slate-200"
                />
              </div>

              {/* Live Toggle */}
              <Button
                variant={isLive ? "default" : "outline"}
                onClick={() => setIsLive(!isLive)}
                className={cn(
                  "rounded-full gap-2 font-semibold h-9",
                  isLive
                    ? "bg-success hover:bg-success/90 text-white"
                    : "border-slate-200 text-signal"
                )}
              >
                {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isLive ? "Live" : "Go Live"}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                className="rounded-full h-9 w-9 border-slate-200 text-signal"
                title="Refresh"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>

              <ToolbarButton icon={FileText} label="CSV" onClick={handleExportCSV} />
              <ToolbarButton icon={Printer} label="Print" onClick={handlePrint} />
              <ToolbarButton icon={Copy} label="Copy" onClick={handleCopy} />
              <ToolbarButton icon={Download} label="PDF" onClick={handlePDF} />

              {/* Server Filter */}
              <div className="relative">
                <ToolbarButton
                  icon={Server}
                  label={serverFilter === "all" ? "Server" : serverFilter}
                  onClick={() => setShowServerFilter(!showServerFilter)}
                />
                {showServerFilter && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    <button
                      onClick={() => { setServerFilter("all"); setShowServerFilter(false); setCurrentPage(1); }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                        serverFilter === "all" && "bg-signal-tint text-signal font-semibold"
                      )}
                    >
                      All Servers
                    </button>
                    {serverOptions.map((srv) => (
                      <button
                        key={srv}
                        onClick={() => { setServerFilter(srv); setShowServerFilter(false); setCurrentPage(1); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors",
                          serverFilter === srv && "bg-signal-tint text-signal font-semibold"
                        )}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(searchTerm || statusFilter !== "all" || serverFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                  className="rounded-full gap-1.5 font-semibold text-xs h-9 text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  <X className="h-3.5 w-3.5" /> Reset
                </Button>
              )}

              {selectedRows.length > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBulkDelete}
                  className="rounded-full gap-1.5 font-semibold text-xs h-9 text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete {selectedRows.length}
                </Button>
              )}
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(["all", "success", "info", "warning", "error"] as const).map((s) => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all capitalize",
                  statusFilter === s
                    ? "bg-signal text-white border-signal shadow-md"
                    : "bg-white text-slate-500 border-slate-200 hover:border-signal/50 hover:text-signal"
                )}
              >
                {s === "all" ? "All Logs" : s}
                {s !== "all" && (
                  <span className="ml-1.5 opacity-70">
                    ({rows.filter((r) => r.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Rows per page */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-sm text-signal"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {sortedRows.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, sortedRows.length)} of {sortedRows.length}
              </span>
            </div>
            <Button variant="outline" className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 h-9">
              <ListFilter className="h-3.5 w-3.5" />
              Show {rowsPerPage} rows
            </Button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[1000px]">
              <thead>
                <tr className="bg-signal text-white">
                  <th className="px-4 py-4 w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="rounded cursor-pointer accent-white"
                    />
                  </th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => handleSort(c.key)}
                      className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        {c.label}
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                  ))}
                  <th className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r) => {
                    const isSelected = selectedRows.includes(r.id);
                    return (
                      <tr
                        key={r.id}
                        className={cn(
                          "border-t border-slate-100 hover:bg-slate-50 transition-colors",
                          isSelected && "bg-signal-tint"
                        )}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(r.id)}
                            className="rounded cursor-pointer accent-signal"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon status={r.status} />
                            <span className="font-semibold text-signal">{r.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-600">{r.ip}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{r.time}</td>
                        <td className="px-6 py-4">
                          <span className="bg-signal-tint text-signal text-xs font-semibold px-2 py-1 rounded-md border border-signal/30">
                            {r.server}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-600">{r.messages}</span>
                            <StatusBadge status={r.status} />
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleView(r)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                            title="View"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={columns.length + 2} className="px-6 py-16 text-center text-slate-500">
                      <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                      <p className="font-semibold text-signal">No log entries found</p>
                      <p className="text-xs mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 text-sm">
              <div className="text-slate-500">
                Showing {sortedRows.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, sortedRows.length)} of {sortedRows.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full h-8 w-8 border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "rounded-full h-8 w-8 text-xs font-semibold",
                        currentPage === page ? "bg-signal text-white" : "border-slate-200 text-signal"
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="text-slate-500 px-1">...</span>}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-8 w-8 border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}