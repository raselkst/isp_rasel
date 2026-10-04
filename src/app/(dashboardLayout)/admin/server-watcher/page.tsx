"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Plus, Search, RadioTower, Wifi, WifiOff, AlertTriangle, Activity,
  Edit3, Trash2, RefreshCw, Signal, SignalHigh, SignalLow, SignalZero,
  Clock, X, Save, ChevronLeft, ChevronRight, ArrowUpDown, Download,
  CheckSquare, Filter, Server
} from "lucide-react";

interface DeviceData {
  id: number;
  name: string;
  status: "online" | "offline" | "warning";
  ip: string;
  port: string;
  apMac: string;
  onuMac: string;
  onuPower: number;
  lastChange: string;
  tmi: string;
}

const initialDevices: DeviceData[] = [
  { id: 1, name: "Router-Main-01", status: "online", ip: "192.168.1.1", port: "8291", apMac: "AA:BB:CC:11:22:33", onuMac: "DD:EE:FF:44:55:66", onuPower: -18.5, lastChange: "2 mins ago", tmi: "OK" },
  { id: 2, name: "ONU-Ward-5", status: "warning", ip: "192.168.1.45", port: "80", apMac: "AA:BB:CC:11:22:34", onuMac: "DD:EE:FF:44:55:67", onuPower: -28.2, lastChange: "15 mins ago", tmi: "WEAK" },
  { id: 3, name: "AP-Rooftop", status: "online", ip: "192.168.1.78", port: "22", apMac: "AA:BB:CC:11:22:35", onuMac: "DD:EE:FF:44:55:68", onuPower: -22.0, lastChange: "1 hour ago", tmi: "OK" },
  { id: 4, name: "ONU-Jamal-House", status: "offline", ip: "192.168.1.99", port: "80", apMac: "AA:BB:CC:11:22:36", onuMac: "DD:EE:FF:44:55:69", onuPower: -35.5, lastChange: "3 hours ago", tmi: "FAIL" },
  { id: 5, name: "Router-Backup", status: "online", ip: "192.168.1.2", port: "8291", apMac: "AA:BB:CC:11:22:37", onuMac: "DD:EE:FF:44:55:70", onuPower: -16.8, lastChange: "5 mins ago", tmi: "OK" },
];

const statusConfig = {
  online: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: Wifi, dot: "bg-emerald-500", label: "Online" },
  offline: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: WifiOff, dot: "bg-red-500", label: "Offline" },
  warning: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: AlertTriangle, dot: "bg-amber-500", label: "Warning" },
};

const getSignalStrength = (power: number) => {
  if (power >= -20) return { label: "Excellent", color: "text-emerald-500", bg: "bg-emerald-500", icon: SignalHigh };
  if (power >= -25) return { label: "Good", color: "text-blue-500", bg: "bg-blue-500", icon: Signal };
  if (power >= -30) return { label: "Weak", color: "text-amber-500", bg: "bg-amber-500", icon: SignalLow };
  return { label: "Critical", color: "text-red-500", bg: "bg-red-500", icon: SignalZero };
};

const emptyDevice: DeviceData = {
  id: 0, name: "", status: "online", ip: "", port: "",
  apMac: "", onuMac: "", onuPower: -20, lastChange: "Just now", tmi: "OK",
};

export default function ServerWatcherPage() {
  const [devices, setDevices] = useState(initialDevices);
  const [addOpen, setAddOpen] = useState(false);
  const [editModal, setEditModal] = useState<DeviceData | null>(null);
  const [newDevice, setNewDevice] = useState<DeviceData>({ ...emptyDevice });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Stat Cards
  const stats = useMemo(() => {
    return {
      online: devices.filter(d => d.status === "online").length,
      offline: devices.filter(d => d.status === "offline").length,
      warning: devices.filter(d => d.status === "warning").length,
      total: devices.length,
    };
  }, [devices]);

  // Filter + Search + Sort
  const filteredDevices = useMemo(() => {
    let filtered = devices.filter(d => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.ip.includes(searchTerm) ||
        d.apMac.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.onuMac.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || statusConfig[d.status].label === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortKey) {
      filtered = [...filtered].sort((a: any, b: any) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [devices, searchTerm, statusFilter, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredDevices.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedDevices = filteredDevices.slice(startIndex, startIndex + rowsPerPage);

  // Select
  const allSelected =
    paginatedDevices.length > 0 && paginatedDevices.every(d => selectedRows.includes(d.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(prev => prev.filter(id => !paginatedDevices.find(d => d.id === id)));
    } else {
      setSelectedRows(prev => [...new Set([...prev, ...paginatedDevices.map(d => d.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  // Refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setDevices(prev =>
        prev.map(d => {
          if (d.status === "offline") return d;
          const newPower = -(15 + Math.random() * 20);
          const newStatus = newPower > -25 ? "online" : newPower > -30 ? "warning" : "online";
          return { ...d, onuPower: parseFloat(newPower.toFixed(1)), status: newStatus as any, lastChange: "Just now" };
        })
      );
      setIsRefreshing(false);
      alert("All devices refreshed!");
    }, 1200);
  };

  // Add Device
  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDevice.name.trim() || !newDevice.ip.trim()) {
      alert("Name and IP are required!");
      return;
    }
    const newId = Math.max(...devices.map(d => d.id), 0) + 1;
    const toAdd = { ...newDevice, id: newId };
    setDevices(prev => [toAdd, ...prev]);
    setNewDevice({ ...emptyDevice });
    setAddOpen(false);
    alert(`✅ Device "${toAdd.name}" added successfully!`);
  };

  // Edit Save
  const handleSaveEdit = () => {
    if (!editModal || !editModal.name.trim()) {
      alert("Name is required!");
      return;
    }
    setDevices(prev => prev.map(d => (d.id === editModal.id ? editModal : d)));
    setEditModal(null);
    alert("Device updated successfully!");
  };

  // Delete
  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete device "${name}"? This cannot be undone.`)) {
      setDevices(prev => prev.filter(d => d.id !== id));
      setSelectedRows(prev => prev.filter(i => i !== id));
      alert("Device deleted successfully!");
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one device.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} device(s)?`)) {
      setDevices(prev => prev.filter(d => !selectedRows.includes(d.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} device(s) deleted.`);
    }
  };

  // Export
  const handleExport = () => {
    const dataToExport = selectedRows.length > 0
      ? devices.filter(d => selectedRows.includes(d.id))
      : filteredDevices;
    const headers = "Name,Status,IP,Port,AP Mac,ONU Mac,ONU Power,Last Change,TM.I";
    const csvRows = dataToExport.map(d =>
      `"${d.name}","${d.status}","${d.ip}","${d.port}","${d.apMac}","${d.onuMac}",${d.onuPower},"${d.lastChange}","${d.tmi}"`
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `devices-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} device(s) to CSV.`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* Sticky Action Bar */}
        <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" /> Add Device
              </button>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all whitespace-nowrap"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all whitespace-nowrap"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Infrastructure Monitor
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Device Watcher
            </h1>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0 relative">
                <Wifi className="w-4 h-4 text-emerald-600" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Online</p>
                <p className="text-lg font-heading font-bold text-emerald-600">{stats.online}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <WifiOff className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Offline</p>
                <p className="text-lg font-heading font-bold text-red-600">{stats.offline}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Warning</p>
                <p className="text-lg font-heading font-bold text-amber-600">{stats.warning}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <RadioTower className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-blue-600">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by name, IP or MAC address…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm font-semibold focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option>All Status</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Warning</option>
            </select>

            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete {selectedRows.length}
              </button>
            )}
          </div>

          {/* Sort Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border rounded-lg px-2 py-1 bg-background text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {filteredDevices.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, filteredDevices.length)} of {filteredDevices.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Sort:</span>
              {[
                { key: "name", label: "Name" },
                { key: "ip", label: "IP" },
                { key: "onuPower", label: "Power" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key
                      ? "bg-signal text-white border-signal"
                      : "bg-background text-muted-foreground border-border hover:border-signal/50"
                  )}
                >
                  {s.label}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Table (List View only) */}
          {filteredDevices.length > 0 ? (
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1200px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                      <th className="px-4 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="rounded cursor-pointer"
                        />
                      </th>
                      {["SL", "Name", "Status", "IP", "Port", "AP Mac", "ONU Mac", "ONU Power", "Last Change", "TM.I", "Action"].map((c) => (
                        <th key={c} className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                          <div
                            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              const map: any = { Name: "name", IP: "ip", "ONU Power": "onuPower" };
                              if (map[c]) handleSort(map[c]);
                            }}
                          >
                            {c}
                            {["Name", "IP", "ONU Power"].includes(c) && (
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDevices.map((device, index) => {
                      const sc = statusConfig[device.status];
                      const StatusIcon = sc.icon;
                      const signal = getSignalStrength(device.onuPower);
                      const SignalIcon = signal.icon;
                      const isSelected = selectedRows.includes(device.id);
                      return (
                        <tr
                          key={device.id}
                          className={cn(
                            "border-t hover:bg-muted/40 transition-colors",
                            isSelected && "bg-signal/5"
                          )}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(device.id)}
                              className="rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-4 font-mono text-muted-foreground">{startIndex + index + 1}</td>
                          <td className="px-5 py-4 font-semibold">{device.name}</td>
                          <td className="px-5 py-4">
                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold", sc.bg, sc.color)}>
                              <StatusIcon className="h-3 w-3" />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 font-mono">{device.ip}</td>
                          <td className="px-5 py-4 font-mono">{device.port}</td>
                          <td className="px-5 py-4 font-mono text-[10px]">{device.apMac}</td>
                          <td className="px-5 py-4 font-mono text-[10px]">{device.onuMac}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5">
                              <SignalIcon className={cn("h-3.5 w-3.5", signal.color)} />
                              <span className={cn("font-bold text-xs", signal.color)}>{device.onuPower} dBm</span>
                            </div>
                            <div className="w-20 h-1 rounded-full bg-muted overflow-hidden mt-1">
                              <div
                                className={cn("h-full rounded-full", signal.bg)}
                                style={{ width: `${Math.min(100, Math.max(0, ((device.onuPower + 40) / 25) * 100))}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground whitespace-nowrap text-xs">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {device.lastChange}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-md",
                              device.tmi === "OK" ? "bg-emerald-500/10 text-emerald-600" :
                              device.tmi === "WEAK" ? "bg-amber-500/10 text-amber-600" :
                              "bg-red-500/10 text-red-600"
                            )}>
                              {device.tmi}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditModal({ ...device })}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(device.id, device.name)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
                <div className="text-muted-foreground">
                  Showing {filteredDevices.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredDevices.length)} of {filteredDevices.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all",
                          currentPage === page
                            ? "bg-signal text-white shadow-md"
                            : "border bg-card hover:bg-muted"
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="relative w-20 h-20 mb-5">
                <div className="absolute inset-0 rounded-full border-2 border-signal/20" />
                <div className="absolute inset-3 rounded-full border-2 border-signal/30" />
                <div className="absolute inset-6 rounded-full border-2 border-signal/40" />
                <div className="absolute inset-0 rounded-full bg-signal/5 animate-ping" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <RadioTower className="h-7 w-7 text-signal" />
                </div>
              </div>
              <h3 className="font-heading text-lg font-bold mb-1 flex items-center gap-2">
                <Activity className="h-5 w-5 text-signal" />
                No devices being watched yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-5">
                {searchTerm || statusFilter !== "All Status"
                  ? "Try adjusting your search or filters."
                  : "Add a router, ONU, or access point to start monitoring its uptime and status in real time."}
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> Add your first device
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Device Modal (WORKING) */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setAddOpen(false)} />
          <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-signal to-violet-accent" />
                  <span className="font-heading font-bold text-sm">LOGO ICON ONLY</span>
                </div>
                <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                  Add New Device
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Register a new device to start monitoring.
                </p>
              </div>
              <button
                onClick={() => setAddOpen(false)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block">
                  Device Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={newDevice.name}
                  onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                  placeholder="e.g. Router-Main-02"
                  className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">
                    IP Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    value={newDevice.ip}
                    onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })}
                    placeholder="192.168.1.100"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Port</label>
                  <input
                    value={newDevice.port}
                    onChange={(e) => setNewDevice({ ...newDevice, port: e.target.value })}
                    placeholder="80"
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">AP Mac</label>
                  <input
                    value={newDevice.apMac}
                    onChange={(e) => setNewDevice({ ...newDevice, apMac: e.target.value })}
                    placeholder="AA:BB:CC:..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">ONU Mac</label>
                  <input
                    value={newDevice.onuMac}
                    onChange={(e) => setNewDevice({ ...newDevice, onuMac: e.target.value })}
                    placeholder="DD:EE:FF:..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">ONU Power (dBm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newDevice.onuPower}
                    onChange={(e) => setNewDevice({ ...newDevice, onuPower: Number(e.target.value) })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">TM.I Status</label>
                  <select
                    value={newDevice.tmi}
                    onChange={(e) => setNewDevice({ ...newDevice, tmi: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option>OK</option>
                    <option>WEAK</option>
                    <option>FAIL</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white border-0 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Device
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Device Modal (WORKING) */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                  Edit Device
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Update device details.
                </p>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block">Device Name</label>
                <input
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Status</label>
                  <select
                    value={editModal.status}
                    onChange={(e) => setEditModal({ ...editModal, status: e.target.value as any })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="online">Online</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">IP Address</label>
                  <input
                    value={editModal.ip}
                    onChange={(e) => setEditModal({ ...editModal, ip: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Port</label>
                  <input
                    value={editModal.port}
                    onChange={(e) => setEditModal({ ...editModal, port: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">AP Mac</label>
                  <input
                    value={editModal.apMac}
                    onChange={(e) => setEditModal({ ...editModal, apMac: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">ONU Mac</label>
                  <input
                    value={editModal.onuMac}
                    onChange={(e) => setEditModal({ ...editModal, onuMac: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">ONU Power (dBm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editModal.onuPower}
                    onChange={(e) => setEditModal({ ...editModal, onuPower: Number(e.target.value) })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">TM.I</label>
                  <select
                    value={editModal.tmi}
                    onChange={(e) => setEditModal({ ...editModal, tmi: e.target.value })}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option>OK</option>
                    <option>WEAK</option>
                    <option>FAIL</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white border-0 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}