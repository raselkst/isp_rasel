"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ListFilter, FileText, Printer, Copy, Search, RefreshCw,
  Play, Pause, ChevronLeft, ChevronRight, ArrowUpDown,
  AlertCircle, Wifi, MessageSquare, Server, Clock, CheckCircle2,
  Filter, X, Download, Trash2, CheckSquare, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "user", label: "User" },
  { key: "ip", label: "IP" },
  { key: "time", label: "Time" },
  { key: "server", label: "Server" },
  { key: "messages", label: "Messages" },
];

function generateLog(index: number) {
  const users = ["liton_hs", "mogul_ali", "rahim_ud", "karim_hs", "nusrat_j", "sabbir_a", "tania_k", "arif_h"];
  const servers = ["SERVER-2", "SERVER-3", "SERVER-4", "SERVER-5"];
  const messages = [
    "Login successful",
    "Session started",
    "Data quota reached 80%",
    "MAC address changed",
    "Reconnected after timeout",
    "Logged out by user",
    "Session expired",
    "Authentication failed",
  ];
  const statuses = ["online", "warning", "offline"];

  const now = new Date();
  now.setMinutes(now.getMinutes() - index * 3);

  return {
    id: index + 1,
    user: users[index % users.length],
    ip: `10.5.50.${100 + (index % 50)}`,
    time: now.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    server: servers[index % servers.length],
    messages: messages[index % messages.length],
    status: statuses[index % statuses.length],
  };
}

const initialLogs = Array.from({ length: 25 }).map((_, i) => generateLog(i));

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

export default function HotspotMacLogPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>("time");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLive, setIsLive] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "warning" | "offline">("all");
  const [serverFilter, setServerFilter] = useState<"all" | string>("all");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showServerFilter, setShowServerFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = generateLog(0);
        return [{ ...newLog, id: Date.now() }, ...prev.slice(0, 24)];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const serverOptions = useMemo(() => Array.from(new Set(logs.map((l) => l.server))), [logs]);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch =
        l.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.messages.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || l.status === statusFilter;
      const matchesServer = serverFilter === "all" || l.server === serverFilter;
      return matchesSearch && matchesStatus && matchesServer;
    });
  }, [logs, searchTerm, statusFilter, serverFilter]);

  const sortedLogs = useMemo(() => {
    if (!sortKey) return filteredLogs;
    return [...filteredLogs].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredLogs, sortKey, sortOrder]);

  const totalPages = Math.ceil(sortedLogs.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLogs = sortedLogs.slice(startIndex, startIndex + rowsPerPage);

  const allSelected =
    paginatedLogs.length > 0 && paginatedLogs.every((l) => selectedRows.includes(l.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedLogs.find((l) => l.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedLogs.map((l) => l.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "warning": return "bg-warning";
      case "offline": return "bg-destructive";
      default: return "bg-slate-400";
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setServerFilter("all");
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const dataToExport = selectedRows.length > 0
      ? sortedLogs.filter((l) => selectedRows.includes(l.id))
      : sortedLogs;
    const headers = ["SL", ...columns.map((c) => c.label), "Status"].join(",");
    const csvRows = dataToExport.map((l, i) =>
      [i + 1, ...columns.map((c) => `"${(l as any)[c.key]}"`), l.status].join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hotspot-mac-log-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} log entries to CSV.`);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const dataToPrint = selectedRows.length > 0
      ? sortedLogs.filter((l) => selectedRows.includes(l.id))
      : sortedLogs;
    printWindow.document.write(`
      <html>
        <head>
          <title>Hotspot Mac Log</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #066F6F; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #066F6F; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Hotspot Mac Log</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr><th>SL</th>${columns.map((c) => `<th>${c.label}</th>`).join("")}<th>Status</th></tr>
            </thead>
            <tbody>
              ${dataToPrint.map((l, i) => `<tr><td>${i + 1}</td>${columns.map((c) => `<td>${(l as any)[c.key]}</td>`).join("")}<td>${l.status}</td></tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleCopy = () => {
    const dataToCopy = selectedRows.length > 0
      ? sortedLogs.filter((l) => selectedRows.includes(l.id))
      : sortedLogs;
    const text = dataToCopy
      .map((l) => `${l.user}\t${l.ip}\t${l.time}\t${l.server}\t${l.messages}\t${l.status}`)
      .join("\n");
    navigator.clipboard.writeText(text).then(() => {
      alert(`Copied ${dataToCopy.length} entries to clipboard!`);
    });
  };

  const handleRefresh = () => {
    setLogs(Array.from({ length: 25 }).map((_, i) => generateLog(i)));
    setCurrentPage(1);
    setSelectedRows([]);
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one log entry.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} log(s)? This cannot be undone.`)) {
      setLogs((prev) => prev.filter((l) => !selectedRows.includes(l.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} log(s) deleted.`);
    }
  };

  const handleView = (log: any) => {
    alert(`Log Details:\n\nUser: ${log.user}\nIP: ${log.ip}\nTime: ${log.time}\nServer: ${log.server}\nMessage: ${log.messages}\nStatus: ${log.status}`);
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
                Hotspot Mac Log
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Live log stream from all hotspot servers.
              </p>
            </div>
            {isLive && (
              <span className="flex items-center gap-2 bg-success-tint text-success px-3 py-1.5 rounded-full text-xs font-bold border border-success/30">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                LIVE STREAMING
              </span>
            )}
          </div>

          {/* Compact Stat Cards - Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-signal to-signal-light shadow-md text-white">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{logs.length}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-success to-success/80 shadow-md text-white">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Online</p>
                <p className="text-lg font-heading font-bold">{logs.filter((l) => l.status === "online").length}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-warning to-warning/80 shadow-md text-white">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Warning</p>
                <p className="text-lg font-heading font-bold">{logs.filter((l) => l.status === "warning").length}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-violet-accent to-violet-accent/80 shadow-md text-white">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Server className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Servers</p>
                <p className="text-lg font-heading font-bold">{new Set(logs.map((l) => l.server)).size}</p>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Header with Search & Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold text-signal">Live Log</h2>
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
                  placeholder="Search user, IP, server..."
                  className="pl-9 rounded-full w-64 h-9 border-slate-200"
                />
              </div>

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

              {/* Status Filter */}
              <div className="relative">
                <ToolbarButton
                  icon={Filter}
                  label={statusFilter === "all" ? "Status" : `Status: ${statusFilter}`}
                  onClick={() => { setShowStatusFilter(!showStatusFilter); setShowServerFilter(false); }}
                />
                {showStatusFilter && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    {(["all", "online", "warning", "offline"] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setStatusFilter(s); setShowStatusFilter(false); setCurrentPage(1); }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors capitalize flex items-center gap-2",
                          statusFilter === s && "bg-signal-tint text-signal font-semibold"
                        )}
                      >
                        <span className={cn("w-2 h-2 rounded-full", getStatusDot(s === "all" ? "default" : s))} />
                        {s === "all" ? "All Status" : s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Server Filter */}
              <div className="relative">
                <ToolbarButton
                  icon={Server}
                  label={serverFilter === "all" ? "Server" : serverFilter}
                  onClick={() => { setShowServerFilter(!showServerFilter); setShowStatusFilter(false); }}
                />
                {showServerFilter && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden">
                    <button
                      onClick={() => { setServerFilter("all"); setShowServerFilter(false); setCurrentPage(1); }}
                      className={cn(
                        "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2",
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
                          "w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2",
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
                Showing {sortedLogs.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, sortedLogs.length)} of {sortedLogs.length}
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
                  <th className="px-4 py-4 font-semibold text-xs whitespace-nowrap text-left w-12">SL</th>
                  {columns.map((c) => (
                    <th
                      key={c.key}
                      onClick={() => handleSort(c.key)}
                      className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors select-none"
                    >
                      <div className="flex items-center gap-1">
                        {c.label}
                        <ArrowUpDown className="w-3 h-3 opacity-60" />
                      </div>
                    </th>
                  ))}
                  <th className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap">Status</th>
                  <th className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((l, idx) => {
                    const isSelected = selectedRows.includes(l.id);
                    return (
                      <tr
                        key={l.id}
                        className={cn(
                          "border-t border-slate-100 hover:bg-slate-50 transition-colors",
                          isSelected && "bg-signal-tint"
                        )}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(l.id)}
                            className="rounded cursor-pointer accent-signal"
                          />
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 font-mono">
                          {startIndex + idx + 1}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-signal font-semibold">
                            <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(l.status))} />
                            {l.user}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-600">{l.ip}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {l.time}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="bg-signal-tint text-signal text-xs font-semibold px-2 py-1 rounded-md border border-signal/30">
                            {l.server}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{l.messages}</td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "text-xs font-semibold px-2 py-1 rounded-full capitalize border",
                              l.status === "online" && "bg-success-tint text-success border-success/30",
                              l.status === "warning" && "bg-warning-tint text-warning border-warning/30",
                              l.status === "offline" && "bg-destructive/10 text-destructive border-destructive/30"
                            )}
                          >
                            {l.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => handleView(l)}
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
                    <td colSpan={columns.length + 4} className="px-5 py-16 text-center text-slate-500">
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
                Showing {sortedLogs.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, sortedLogs.length)} of {sortedLogs.length} entries
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