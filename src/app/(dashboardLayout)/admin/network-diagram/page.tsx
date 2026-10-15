"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Upload, Download, Plus, Waypoints, Search, LayoutGrid, List,
  Edit3, Trash2, Server, Router, Network, Box, ChevronLeft,
  ChevronRight, ArrowUpDown, X, Save, Boxes, WifiOff, AlertTriangle,
  RefreshCw
} from "lucide-react";

// ডামি ডেটা
const initialDiagrams = [
  { id: 1, name: "Chorpara", type: "ONU", description: "", status: "active" },
  { id: 2, name: "Chorpara", type: "ONU", description: "", status: "active" },
  { id: 3, name: "Chorpara", type: "ONU", description: "AVC", status: "active" },
  { id: 4, name: "Chorpara", type: "ONU", description: "AVC", status: "warning" },
  { id: 5, name: "Chorpara", type: "ONU", description: "AVC", status: "active" },
  { id: 6, name: "Chorpara", type: "ONU", description: "AVC", status: "active" },
  { id: 7, name: "Chorpara", type: "ONU", description: "AVC", status: "active" },
  { id: 8, name: "Chorpara", type: "ONU", description: "AVC", status: "active" },
  { id: 9, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 10, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 11, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 12, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 13, name: "PON-03", type: "Router", description: "", status: "offline" },
  { id: 14, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 15, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 16, name: "PON-03", type: "Router", description: "", status: "active" },
  { id: 17, name: "Poli Network OLT", type: "OLT", description: "Mikrotik to OLT", status: "active" },
];

// 🎯 Theme-connected type config
const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  ONU: { icon: Box, color: "text-signal", bg: "bg-signal-tint" },
  Router: { icon: Router, color: "text-violet-accent", bg: "bg-violet-accent-tint" },
  OLT: { icon: Server, color: "text-caution", bg: "bg-caution-tint" },
  Default: { icon: Network, color: "text-slate-500", bg: "bg-slate-100" },
};

// 🎯 Theme-connected status config
const statusConfig: Record<string, { dot: string; label: string; badge: string }> = {
  active: { dot: "bg-success", label: "Active", badge: "bg-success-tint text-success border-success/30" },
  warning: { dot: "bg-warning", label: "Warning", badge: "bg-warning-tint text-warning border-warning/30" },
  offline: { dot: "bg-destructive", label: "Offline", badge: "bg-destructive/10 text-destructive border-destructive/30" },
};

const emptyDiagram = { id: 0, name: "", type: "ONU", description: "", status: "active" };

export default function NetworkDiagramPage() {
  const [diagrams, setDiagrams] = useState(initialDiagrams);
  const [open, setOpen] = useState(false);
  const [editModal, setEditModal] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [newDiagram, setNewDiagram] = useState({ ...emptyDiagram });

  const stats = useMemo(() => ({
    total: diagrams.length,
    onu: diagrams.filter((d) => d.type === "ONU").length,
    router: diagrams.filter((d) => d.type === "Router").length,
    olt: diagrams.filter((d) => d.type === "OLT").length,
    warning: diagrams.filter((d) => d.status === "warning").length,
    offline: diagrams.filter((d) => d.status === "offline").length,
  }), [diagrams]);

  const filteredData = useMemo(() => {
    let filtered = diagrams.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All" || item.type === typeFilter;
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
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
  }, [diagrams, searchTerm, typeFilter, statusFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((d) => selectedRows.includes(d.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedData.find((d) => d.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedData.map((d) => d.id)])]);
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
    setTypeFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  const handleAddDiagram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDiagram.name.trim()) {
      alert("Please enter a name.");
      return;
    }
    const newId = Math.max(...diagrams.map((d) => d.id), 0) + 1;
    const toAdd = { ...newDiagram, id: newId };
    setDiagrams((prev) => [toAdd, ...prev]);
    setNewDiagram({ ...emptyDiagram });
    setOpen(false);
    alert(`✅ Diagram "${toAdd.name}" added successfully!`);
  };

  const handleSaveEdit = () => {
    if (!editModal.name.trim()) {
      alert("Name is required.");
      return;
    }
    setDiagrams((prev) => prev.map((d) => (d.id === editModal.id ? editModal : d)));
    setEditModal(null);
    alert("Diagram updated successfully!");
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete diagram "${name}"? This cannot be undone.`)) {
      setDiagrams((prev) => prev.filter((d) => d.id !== id));
      setSelectedRows((prev) => prev.filter((i) => i !== id));
      alert("Diagram deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one diagram.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} diagram(s)?`)) {
      setDiagrams((prev) => prev.filter((d) => !selectedRows.includes(d.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} diagram(s) deleted.`);
    }
  };

  const handleExport = () => {
    const dataToExport = selectedRows.length > 0
      ? diagrams.filter((d) => selectedRows.includes(d.id))
      : filteredData;
    const headers = "ID,Name,Type,Description,Status";
    const csvRows = dataToExport.map((d) => `${d.id},"${d.name}","${d.type}","${d.description}","${d.status}"`);
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `network-diagrams-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} diagram(s) to CSV.`);
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".csv,.json";
    fileInput.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(`Imported file: ${file.name}\n\nIn real app, this would parse the file and add diagrams.`);
      }
    };
    fileInput.click();
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* Sticky Quick Actions Bar */}
        <div className="border-b border-slate-200 sticky top-[64px] z-30 bg-white/85 backdrop-blur-md">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105"
              >
                <Plus className="h-4 w-4" /> Add Diagram
              </button>
              <button
                onClick={handleImport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-white border border-slate-200 text-slate-600 hover:text-signal hover:border-signal/30 hover:shadow-md"
              >
                <Upload className="h-4 w-4" /> Import
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap bg-white border border-slate-200 text-slate-600 hover:text-signal hover:border-signal/30 hover:shadow-md"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid" ? "bg-white shadow-sm text-signal" : "text-slate-500 hover:text-signal"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list" ? "bg-white shadow-sm text-signal" : "text-slate-500 hover:text-signal"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
                Infrastructure
              </p>
              <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                Network Diagram List
              </h1>
            </div>
          </div>

          {/* Compact Stat Cards — Theme Connected */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Boxes className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Box className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">ONU</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.onu}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                <Router className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Router</p>
                <p className="text-lg font-heading font-bold text-violet-accent">{stats.router}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-caution-tint flex items-center justify-center shrink-0">
                <Server className="w-4 h-4 text-caution" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">OLT</p>
                <p className="text-lg font-heading font-bold text-caution">{stats.olt}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Warning</p>
                <p className="text-lg font-heading font-bold text-warning">{stats.warning}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <WifiOff className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Offline</p>
                <p className="text-lg font-heading font-bold text-destructive">{stats.offline}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search diagrams by name, type or description…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="All">All Types</option>
              <option value="ONU">ONU</option>
              <option value="Router">Router</option>
              <option value="OLT">OLT</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="warning">Warning</option>
              <option value="offline">Offline</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>

            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete {selectedRows.length}
              </button>
            )}
          </div>

          {/* Sort Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {filteredData.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, filteredData.length)} of {filteredData.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">Sort:</span>
              {[
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "status", label: "Status" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key
                      ? "bg-signal text-white border-signal"
                      : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                  )}
                >
                  {s.label}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center mb-4">
                <Waypoints className="h-8 w-8 text-signal" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1 text-signal">No diagrams found</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                {searchTerm || typeFilter !== "All" || statusFilter !== "All"
                  ? "Try adjusting your search or filters."
                  : "Add your first network node to start visualizing your infrastructure."}
              </p>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> Add Diagram
              </button>
            </div>
          )}

          {paginatedData.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="rounded cursor-pointer accent-signal"
              />
              <span className="font-semibold">Select All on this page</span>
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && paginatedData.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {paginatedData.map((item) => {
                const config = typeConfig[item.type] || typeConfig.Default;
                const Icon = config.icon;
                const statusCfg = statusConfig[item.status];
                const isSelected = selectedRows.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden",
                      isSelected && "border-signal/50 bg-signal-tint"
                    )}
                  >
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                        className="rounded cursor-pointer accent-signal"
                      />
                    </div>

                    <div className={cn("absolute top-4 right-4 w-2.5 h-2.5 rounded-full animate-pulse", statusCfg.dot)} />

                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 mt-6 transition-transform group-hover:scale-110", config.bg)}>
                      <Icon className={cn("h-6 w-6", config.color)} />
                    </div>

                    <h3 className="font-bold text-base mb-1 truncate text-signal">{item.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 truncate">
                      {item.description || "No description"}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider", config.bg, config.color)}>
                        {item.type}
                      </span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setEditModal({ ...item })}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-slate-500 hover:text-destructive transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === "list" && paginatedData.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
              <table className="w-full text-sm min-w-[900px]">
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
                    {["SL", "Name", "Type", "Description", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left px-6 py-4 font-semibold text-xs tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const config = typeConfig[item.type] || typeConfig.Default;
                    const Icon = config.icon;
                    const statusCfg = statusConfig[item.status];
                    const isSelected = selectedRows.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "border-t border-slate-100 hover:bg-slate-50 transition-colors",
                          isSelected && "bg-signal-tint"
                        )}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(item.id)}
                            className="rounded cursor-pointer accent-signal"
                          />
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">{startIndex + index + 1}</td>
                        <td className="px-6 py-4 font-semibold text-signal">{item.name}</td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-md", config.bg, config.color)}>
                            <Icon className="h-3 w-3" />
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{item.description || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", statusCfg.badge)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", statusCfg.dot)} />
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setEditModal({ ...item })}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.name)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-slate-500 hover:text-destructive transition-colors"
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
          )}

          {/* Pagination */}
          {filteredData.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Page</span>
                <span className="font-semibold text-signal">{currentPage}</span>
                <span>of {totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1"
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
                          : "border border-slate-200 bg-white hover:bg-slate-50 text-signal"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Diagram Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-signal" />
                  <span className="font-heading font-bold text-sm text-signal">LOGO ICON ONLY</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Add Diagram
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add a new network node to your infrastructure.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddDiagram} className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">
                  Name <span className="text-destructive">*</span>
                </label>
                <input
                  value={newDiagram.name}
                  onChange={(e) => setNewDiagram({ ...newDiagram, name: e.target.value })}
                  placeholder="e.g. Chorpara"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Type</label>
                  <select
                    value={newDiagram.type}
                    onChange={(e) => setNewDiagram({ ...newDiagram, type: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="ONU">ONU</option>
                    <option value="Router">Router</option>
                    <option value="OLT">OLT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Status</label>
                  <select
                    value={newDiagram.status}
                    onChange={(e) => setNewDiagram({ ...newDiagram, status: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Description</label>
                <textarea
                  value={newDiagram.description}
                  onChange={(e) => setNewDiagram({ ...newDiagram, description: e.target.value })}
                  placeholder="Optional description..."
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Diagram
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Edit Diagram
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update the diagram details.
                </p>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Name</label>
                <input
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Type</label>
                  <select
                    value={editModal.type}
                    onChange={(e) => setEditModal({ ...editModal, type: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="ONU">ONU</option>
                    <option value="Router">Router</option>
                    <option value="OLT">OLT</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Status</label>
                  <select
                    value={editModal.status}
                    onChange={(e) => setEditModal({ ...editModal, status: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="warning">Warning</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Description</label>
                <textarea
                  value={editModal.description}
                  onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
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