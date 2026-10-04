"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, gradientBtn, PremiumCard } from "@/components/config/shared";
import { AddServerModal } from "@/components/config/add-server-modal";
import { ServerActionsModal } from "@/components/config/server-actions-modal";
import {
  Plus, Pencil, Trash2, Search, RefreshCw, Eye, Activity,
  Server, Wifi, WifiOff, AlertTriangle, ArrowUpDown, ChevronLeft,
  ChevronRight, CheckCircle2, X, MoreVertical, Copy, Power, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "ip", label: "IP" },
  { key: "dns", label: "DNS Name" },
  { key: "port", label: "Port" },
  { key: "winPort", label: "WinPort" },
  { key: "webPort", label: "WebPort" },
  { key: "username", label: "Username" },
  { key: "password", label: "Password" },
  { key: "status", label: "Status" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: "248", name: "SERVER-1", ping: "11.15ms", ip: "103.191.240.213", dns: "wifi.login", port: "7201", winPort: "00", webPort: "00", username: "billing", status: "online" },
  { id: "2008", name: "SERVER-2", ping: "23.42ms", ip: "103.191.240.214", dns: "wifi2.login", port: "7202", winPort: "00", webPort: "00", username: "admin", status: "online" },
  { id: "3012", name: "SERVER-3", ping: "45.80ms", ip: "103.191.240.215", dns: "wifi3.login", port: "7203", winPort: "00", webPort: "00", username: "admin", status: "warning" },
  { id: "4015", name: "SERVER-4", ping: "—", ip: "103.191.240.216", dns: "wifi4.login", port: "7204", winPort: "00", webPort: "00", username: "admin", status: "offline" },
  { id: "5020", name: "SERVER-5", ping: "18.30ms", ip: "103.191.240.217", dns: "wifi5.login", port: "7205", winPort: "00", webPort: "00", username: "billing", status: "online" },
  { id: "6021", name: "SERVER-6", ping: "31.10ms", ip: "103.191.240.218", dns: "wifi6.login", port: "7206", winPort: "00", webPort: "00", username: "admin", status: "online" },
  { id: "7022", name: "SERVER-7", ping: "67.25ms", ip: "103.191.240.219", dns: "wifi7.login", port: "7207", winPort: "00", webPort: "00", username: "admin", status: "warning" },
  { id: "8023", name: "SERVER-8", ping: "12.05ms", ip: "103.191.240.220", dns: "wifi8.login", port: "7208", winPort: "00", webPort: "00", username: "billing", status: "online" },
  { id: "9024", name: "SERVER-9", ping: "—", ip: "103.191.240.221", dns: "wifi9.login", port: "7209", winPort: "00", webPort: "00", username: "admin", status: "offline" },
  { id: "1025", name: "SERVER-10", ping: "14.55ms", ip: "103.191.240.222", dns: "wifi10.login", port: "7210", winPort: "00", webPort: "00", username: "admin", status: "online" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "online":
      return { dot: "bg-emerald-500", label: "Online", badge: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" };
    case "warning":
      return { dot: "bg-amber-500", label: "Warning", badge: "bg-amber-500/15 text-amber-600 border-amber-500/20" };
    case "offline":
      return { dot: "bg-red-500", label: "Offline", badge: "bg-red-500/15 text-red-600 border-red-500/20" };
    default:
      return { dot: "bg-slate-400", label: "Unknown", badge: "bg-slate-500/15 text-slate-600 border-slate-500/20" };
  }
};

export default function MikrotikPage() {
  const [rows, setRows] = useState(initialRows);
  const [addOpen, setAddOpen] = useState(false);
  const [actionsFor, setActionsFor] = useState<{ name: string; id: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "warning" | "offline">("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stat Cards ক্যালকুলেশন
  const stats = useMemo(() => {
    const online = rows.filter((r) => r.status === "online").length;
    const warning = rows.filter((r) => r.status === "warning").length;
    const offline = rows.filter((r) => r.status === "offline").length;
    return { total: rows.length, online, warning, offline };
  }, [rows]);

  // ফিল্টার + সার্চ
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.ip.includes(searchTerm) ||
        r.dns.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchTerm, statusFilter]);

  // সর্টিং
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

  // পেজিনেশন
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);

  // সিলেক্ট
  const allSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selectedRows.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedRows.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedRows.map((r) => r.id)])]);
    }
  };
  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // সর্ট হ্যান্ডলার
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Refresh — পিং আপডেট মক
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRows((prev) =>
        prev.map((r) => {
          if (r.status === "offline") return r;
          const newPing = (Math.random() * 40 + 8).toFixed(2) + "ms";
          return { ...r, ping: newPing };
        })
      );
      setIsRefreshing(false);
      alert("All server pings refreshed!");
    }, 1200);
  };

  // Ping Test individual
  const handlePingTest = (row: any) => {
    if (row.status === "offline") {
      alert(`${row.name} is offline. Cannot ping.`);
      return;
    }
    alert(`Pinging ${row.name} (${row.ip})...\n\nResponse: ${row.ping}\nStatus: Online`);
  };

  // Copy IP
  const handleCopyIP = (ip: string) => {
    navigator.clipboard.writeText(ip);
    alert(`Copied IP: ${ip}`);
  };

  // Edit
  const handleEdit = (row: any) => {
    alert(`Editing server: ${row.name}\n\nIn real app, this opens edit form.`);
  };

  // Delete individual
  const handleDelete = (row: any) => {
    if (confirm(`Delete server "${row.name}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
      alert("Server deleted successfully!");
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one server.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} server(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} server(s) deleted.`);
    }
  };

  // Bulk Restart
  const handleBulkRestart = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one server.");
      return;
    }
    alert(`Restarting ${selectedRows.length} server(s)...`);
  };

  // Bulk Toggle Status
  const handleToggleStatus = (row: any) => {
    const newStatus = row.status === "offline" ? "online" : "offline";
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, status: newStatus, ping: newStatus === "online" ? "10.00ms" : "—" } : r))
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Config" title="Server Mikrotik">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
              disabled={isRefreshing}
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              {isRefreshing ? "Pinging..." : "Refresh"}
            </Button>
            <Button onClick={() => setAddOpen(true)} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Server
            </Button>
          </PageHeader>

          {/* Stat Cards - Compact Horizontal */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
      <Server className="w-4 h-4 text-signal" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
      <p className="font-heading text-xl font-bold text-foreground">{stats.total}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <Wifi className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Online</p>
      <p className="font-heading text-xl font-bold text-emerald-600">{stats.online}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <AlertTriangle className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Warning</p>
      <p className="font-heading text-xl font-bold text-amber-600">{stats.warning}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
      <WifiOff className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Offline</p>
      <p className="font-heading text-xl font-bold text-red-600">{stats.offline}</p>
    </div>
  </div>
</div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <>
                  <span className="bg-signal/10 text-signal text-xs font-semibold px-3 py-1.5 rounded-full border border-signal/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {selectedRows.length} selected
                    <button onClick={() => setSelectedRows([])} className="ml-1 hover:bg-signal/20 rounded-full p-0.5">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                  <Button
                    onClick={handleBulkRestart}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-amber-600 border-amber-500/30 hover:bg-amber-500/5"
                  >
                    <Power className="w-3 h-3 mr-1" /> Restart
                  </Button>
                  <Button
                    onClick={handleBulkDelete}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-destructive border-destructive/30 hover:bg-destructive/5"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Status Filter */}
              <div className="flex items-center bg-muted/50 rounded-full p-1 border">
                {(["all", "online", "warning", "offline"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize",
                      statusFilter === status
                        ? "bg-signal text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {status === "all" ? "All" : status}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search server..."
                  className="pl-9 rounded-full w-56 h-9"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1300px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    <th className="px-4 py-4 w-12">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    {columns.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleSort(c.key)}
                        className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-signal/90 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          {c.label}
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                    ))}
                    <th className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((r) => {
                      const isSelected = selectedRows.includes(r.id);
                      const statusConfig = getStatusConfig(r.status);
                      return (
                        <tr
                          key={r.id}
                          className={cn(
                            "border-t transition-colors",
                            isSelected ? "bg-signal/5" : "hover:bg-signal-tint/30"
                          )}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(r.id)}
                              className="rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-4 font-medium">{r.id}</td>
                          <td className="px-4 py-4">
                            <p className="font-semibold">{r.name}</p>
                            <p
                              className={cn(
                                "text-xs flex items-center gap-1.5 mt-0.5",
                                r.status === "online" ? "text-emerald-600" : r.status === "warning" ? "text-amber-600" : "text-red-600"
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot, r.status === "online" && "animate-pulse")} />
                              {r.status === "offline" ? "Offline" : `Ping: ${r.ping}`}
                            </p>
                          </td>
                          <td className="px-4 py-4 font-mono text-xs">
                            <div className="flex items-center gap-2">
                              {r.ip}
                              <button
                                onClick={() => handleCopyIP(r.ip)}
                                className="p-1 rounded hover:bg-muted transition-colors"
                                title="Copy IP"
                              >
                                <Copy className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-xs font-mono">{r.dns}</td>
                          <td className="px-4 py-4">{r.port}</td>
                          <td className="px-4 py-4 text-muted-foreground">{r.winPort}</td>
                          <td className="px-4 py-4 text-muted-foreground">{r.webPort}</td>
                          <td className="px-4 py-4">{r.username}</td>
                          <td className="px-4 py-4 font-mono text-xs text-muted-foreground">••••••</td>
                          <td className="px-4 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border",
                              statusConfig.badge
                            )}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", statusConfig.dot)} />
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handlePingTest(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Ping Test"
                              >
                                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleToggleStatus(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title={r.status === "offline" ? "Bring Online" : "Take Offline"}
                              >
                                <Power className={cn("w-3.5 h-3.5", r.status === "offline" ? "text-emerald-500" : "text-amber-500")} />
                              </button>
                              <button
                                onClick={() => handleEdit(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleDelete(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                              <button
                                onClick={() => setActionsFor({ name: r.name, id: r.id })}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="More"
                              >
                                <MoreVertical className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-16 text-center text-muted-foreground">
                        <Server className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No servers found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Show</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="border rounded-lg px-2 py-1 bg-background text-sm"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
                <span className="mx-2">·</span>
                <span>
                  Showing {sortedRows.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, sortedRows.length)} of {sortedRows.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full h-8 w-8"
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
                        currentPage === page && "bg-signal text-white"
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="text-muted-foreground px-1">...</span>}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-8 w-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>

      <AddServerModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={() => setAddOpen(false)} />
      {actionsFor && (
        <ServerActionsModal
          open={!!actionsFor}
          onClose={() => setActionsFor(null)}
          serverName={actionsFor.name}
          serverId={actionsFor.id}
        />
      )}
    </div>
  );
}