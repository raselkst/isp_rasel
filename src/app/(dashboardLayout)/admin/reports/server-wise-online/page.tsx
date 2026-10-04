"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Server,
  Users,
  UserCheck,
  Activity,
  LayoutGrid,
  List,
  ArrowUpDown,
  Eye,
  MoreVertical,
  Wifi,
  WifiOff,
  AlertTriangle,
  Cpu,
  HardDrive,
  Zap,
  TrendingUp,
  Filter,
} from "lucide-react";

// 🎯 সার্ভার ডেটা টাইপ
interface ServerData {
  id: number;
  name: string;
  total: number;
  active: number;
  linked: boolean;
  status: "online" | "warning" | "offline";
  uptime: string;
  cpu: number;
  ram: number;
}

// 🎯 ডামি ডেটা
const mockServers: ServerData[] = [
  { id: 1, name: "SERVER-1", total: 500, active: 420, linked: true, status: "online", uptime: "99.9%", cpu: 45, ram: 62 },
  { id: 2, name: "SERVER-2", total: 200, active: 500, linked: true, status: "online", uptime: "99.8%", cpu: 78, ram: 85 },
  { id: 3, name: "SERVER-3", total: 200, active: 500, linked: false, status: "warning", uptime: "98.5%", cpu: 92, ram: 88 },
  { id: 4, name: "SERVER-4", total: 350, active: 280, linked: false, status: "online", uptime: "99.7%", cpu: 38, ram: 55 },
  { id: 5, name: "SERVER-5", total: 420, active: 350, linked: false, status: "online", uptime: "99.9%", cpu: 52, ram: 68 },
  { id: 6, name: "SERVER-6", total: 180, active: 0, linked: false, status: "offline", uptime: "0%", cpu: 0, ram: 0 },
  { id: 7, name: "SERVER-7", total: 320, active: 290, linked: false, status: "online", uptime: "99.6%", cpu: 48, ram: 60 },
  { id: 8, name: "SERVER-8", total: 250, active: 180, linked: false, status: "warning", uptime: "97.2%", cpu: 88, ram: 79 },
  { id: 9, name: "SERVER-9", total: 400, active: 380, linked: false, status: "online", uptime: "99.9%", cpu: 42, ram: 58 },
  { id: 10, name: "SERVER-10", total: 150, active: 120, linked: false, status: "online", uptime: "99.5%", cpu: 35, ram: 48 },
  { id: 11, name: "SERVER-11", total: 280, active: 240, linked: false, status: "online", uptime: "99.8%", cpu: 55, ram: 70 },
  { id: 12, name: "SERVER-12", total: 320, active: 300, linked: false, status: "online", uptime: "99.9%", cpu: 40, ram: 52 },
];

// 🎯 স্টেটাস কনফিগ
const statusConfig = {
  online: { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/30", icon: Wifi, dot: "bg-emerald-500", label: "Online", gradient: "from-emerald-500 to-teal-500" },
  warning: { color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", icon: AlertTriangle, dot: "bg-amber-500", label: "Warning", gradient: "from-amber-500 to-orange-500" },
  offline: { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30", icon: WifiOff, dot: "bg-red-500", label: "Offline", gradient: "from-red-500 to-rose-500" },
};

// 🎯 লোড লেভেল অনুযায়ী রঙ
const getLoadColor = (percent: number) => {
  if (percent >= 85) return { bar: "bg-red-500", text: "text-red-600", label: "Critical" };
  if (percent >= 70) return { bar: "bg-amber-500", text: "text-amber-600", label: "High" };
  if (percent >= 40) return { bar: "bg-blue-500", text: "text-blue-600", label: "Normal" };
  return { bar: "bg-emerald-500", text: "text-emerald-600", label: "Low" };
};

export default function ServerWiseOnlinePage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"total" | "active" | "name">("total");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [servers] = useState<ServerData[]>(mockServers);

  // 🎯 স্ট্যাট ক্যালকুলেশন
  const stats = useMemo(() => {
    const totalServers = servers.length;
    const totalClients = servers.reduce((acc, s) => acc + s.total, 0);
    const totalActive = servers.reduce((acc, s) => acc + s.active, 0);
    const avgLoad = Math.round(servers.reduce((acc, s) => acc + (s.total > 0 ? (s.active / s.total) * 100 : 0), 0) / totalServers);
    return { totalServers, totalClients, totalActive, avgLoad };
  }, [servers]);

  // 🎯 ফিল্টার ও সর্ট
  const processedServers = useMemo(() => {
    let result = [...servers];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      if (sortKey === "name") {
        return sortOrder === "desc" ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      }
      return sortOrder === "desc" ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey];
    });
    return result;
  }, [servers, searchTerm, sortKey, sortOrder]);

  const handleSort = (key: "total" | "active" | "name") => {
    if (sortKey === key) setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    else { setSortKey(key); setSortOrder("desc"); }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* 🎯 Sticky Action Bar */}
        <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-600">Live Monitoring</span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground")}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground")}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Reports & Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Server Wise Online Client
            </h1>
          </div>

          {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3 relative">
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <Server className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Servers</p>
      <p className="text-lg font-heading font-bold">{stats.totalServers}</p>
    </div>
    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <Activity className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Load</p>
      <p className="text-lg font-heading font-bold text-amber-600">{stats.avgLoad}%</p>
    </div>
  </div>
</div>

          {/* 🎯 Search Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search servers…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="total">Sort by Total</option>
              <option value="active">Sort by Active</option>
              <option value="name">Sort by Name</option>
            </select>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-signal text-white text-sm font-semibold hover:bg-signal/90 transition-all">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>
          </div>

          {/* 🎯 Grid View */}
          {viewMode === "grid" && processedServers.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {processedServers.map((server) => {
                const sc = statusConfig[server.status];
                const StatusIcon = sc.icon;
                const loadPercent = server.total > 0 ? Math.round((server.active / server.total) * 100) : 0;
                const loadColor = getLoadColor(loadPercent);
                return (
                  <div
                    key={server.id}
                    className={cn(
                      "group bg-card rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden relative",
                      sc.border
                    )}
                  >
                    {/* Status Dot */}
                    <div className={cn("absolute top-4 right-4 w-3 h-3 rounded-full", sc.dot)}>
                      {server.status === "online" && <div className={cn("absolute inset-0 rounded-full animate-ping opacity-75", sc.dot)} />}
                    </div>

                    {/* Server Icon & Name */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-lg", sc.gradient)}>
                        <Server className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base truncate">{server.name}</h3>
                        <p className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1", sc.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {sc.label}
                        </p>
                      </div>
                    </div>

                    {/* Client Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-muted/40 rounded-xl p-3">
                        <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Total</p>
                        <p className="text-xl font-heading font-bold">{server.total}</p>
                      </div>
                      <div className="bg-emerald-500/5 rounded-xl p-3 border border-emerald-500/20">
                        <p className="text-[10px] text-emerald-600 font-semibold uppercase mb-1">Active</p>
                        <p className="text-xl font-heading font-bold text-emerald-600">{server.active}</p>
                      </div>
                    </div>

                    {/* Load Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase">Load</span>
                        <span className={cn("text-[10px] font-bold", loadColor.text)}>{loadPercent}% • {loadColor.label}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", loadColor.bar)}
                          style={{ width: `${Math.min(100, loadPercent)}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-3 border-t text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span className="font-semibold">{server.uptime} uptime</span>
                      </div>
                      {server.linked && (
                        <span className="px-2 py-0.5 rounded-md bg-signal/10 text-signal text-[10px] font-bold">
                          PRIMARY
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🎯 List View (Table) */}
          {viewMode === "list" && processedServers.length > 0 && (
            <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[1000px]">
                <thead>
                  <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">SL</th>
                    <th
                      className="text-left px-5 py-4 font-semibold text-xs tracking-wide cursor-pointer hover:bg-white/10"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1">Server Name <ArrowUpDown className="h-3 w-3 opacity-50" /></div>
                    </th>
                    <th
                      className="text-left px-5 py-4 font-semibold text-xs tracking-wide cursor-pointer hover:bg-white/10"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center gap-1">Total <ArrowUpDown className="h-3 w-3 opacity-50" /></div>
                    </th>
                    <th
                      className="text-left px-5 py-4 font-semibold text-xs tracking-wide cursor-pointer hover:bg-white/10"
                      onClick={() => handleSort("active")}
                    >
                      <div className="flex items-center gap-1">Active <ArrowUpDown className="h-3 w-3 opacity-50" /></div>
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">Status</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">Load</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">Uptime</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processedServers.map((server, index) => {
                    const sc = statusConfig[server.status];
                    const StatusIcon = sc.icon;
                    const loadPercent = server.total > 0 ? Math.round((server.active / server.total) * 100) : 0;
                    const loadColor = getLoadColor(loadPercent);
                    return (
                      <tr key={server.id} className="border-t hover:bg-signal-tint/30 transition-colors group">
                        <td className="px-5 py-4 font-mono text-muted-foreground">{String(index + 1).padStart(2, "0")}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md", sc.gradient)}>
                              <Server className="h-4 w-4" />
                            </div>
                            <span className={cn("font-bold", server.linked && "text-signal")}>
                              {server.name}
                              {server.linked && <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-signal/10 text-signal">PRIMARY</span>}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-bold">{server.total}</td>
                        <td className="px-5 py-4 font-bold text-emerald-600">{server.active}</td>
                        <td className="px-5 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold", sc.bg, sc.color)}>
                            <StatusIcon className="h-3 w-3" />
                            {sc.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="w-28">
                            <div className="flex items-center justify-between mb-1">
                              <span className={cn("text-[10px] font-bold", loadColor.text)}>{loadPercent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                              <div className={cn("h-full rounded-full", loadColor.bar)} style={{ width: `${loadPercent}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs">{server.uptime}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors">
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 🎯 Empty State */}
          {processedServers.length === 0 && (
            <div className="bg-card rounded-2xl border border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center mb-4">
                <Server className="h-8 w-8 text-signal" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1">No servers found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchTerm ? "Try adjusting your search term." : "No server data available."}
              </p>
            </div>
          )}

          {/* 🎯 Pagination */}
          {processedServers.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{processedServers.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{processedServers.length}</span>
                <span>servers</span>
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
          )}
        </div>
      </div>
    </div>
  );
}