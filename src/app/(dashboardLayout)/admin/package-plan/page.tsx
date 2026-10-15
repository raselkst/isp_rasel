"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Gauge, Users2, Search, Plus, LayoutGrid, List, Copy,
  Edit3, Trash2, Zap, TrendingUp, DollarSign, Package, Wifi,
  ArrowUpDown, ChevronLeft, ChevronRight, X, Save, Download,
  RefreshCw
} from "lucide-react";

interface PackageData {
  id: number;
  name: string;
  speed: number;
  type: "PPPoE Package" | "Hotspot Package" | "Static Package";
  profile: string;
  pool: string;
  monthly: number;
  base: number;
  rateType?: string;
}

const ownRates: PackageData[] = [
  { id: 1, name: "10Mbps_Package", speed: 10, type: "PPPoE Package", profile: "NO", pool: "10Mbps_Pool", monthly: 50.0, base: 50.0 },
  { id: 2, name: "12Mbps_Package", speed: 12, type: "PPPoE Package", profile: "NO", pool: "12Mbps_Pool", monthly: 50.0, base: 50.0 },
  { id: 3, name: "15Mbps_Package", speed: 15, type: "PPPoE Package", profile: "NO", pool: "15Mbps_Pool", monthly: 50.0, base: 50.0 },
  { id: 4, name: "20Mbps_Package", speed: 20, type: "PPPoE Package", profile: "NO", pool: "20Mbps_Pool", monthly: 50.0, base: 50.0 },
  { id: 5, name: "5Mbps_Package", speed: 5, type: "PPPoE Package", profile: "NO", pool: "5Mbps_Pool", monthly: 50.0, base: 50.0 },
  { id: 6, name: "8Mbps_Package", speed: 8, type: "PPPoE Package", profile: "NO", pool: "8Mbps_Pool", monthly: 50.0, base: 50.0 },
];

const customerRates: PackageData[] = [
  { id: 1, name: "10Mbps_Package", speed: 10, type: "PPPoE Package", profile: "NO", pool: "10Mbps_Pool", monthly: 490.0, base: 50.0, rateType: "Company Defined" },
  { id: 2, name: "12Mbps_Package", speed: 12, type: "PPPoE Package", profile: "NO", pool: "12Mbps_Pool", monthly: 588.0, base: 50.0, rateType: "Company Defined" },
  { id: 3, name: "15Mbps_Package", speed: 15, type: "PPPoE Package", profile: "NO", pool: "15Mbps_Pool", monthly: 490.0, base: 50.0, rateType: "Company Defined" },
  { id: 4, name: "20Mbps_Package", speed: 20, type: "PPPoE Package", profile: "NO", pool: "20Mbps_Pool", monthly: 588.0, base: 50.0, rateType: "Company Defined" },
  { id: 5, name: "5Mbps_Package", speed: 5, type: "PPPoE Package", profile: "NO", pool: "5Mbps_Pool", monthly: 490.0, base: 50.0, rateType: "Company Defined" },
  { id: 6, name: "8Mbps_Package", speed: 8, type: "PPPoE Package", profile: "NO", pool: "8Mbps_Pool", monthly: 588.0, base: 50.0, rateType: "Company Defined" },
];

// 🎯 থিম-ভিত্তিক Type Badge কালার
const typeColors: Record<string, string> = {
  "PPPoE Package": "bg-signal-tint text-signal border-signal/30",
  "Hotspot Package": "bg-success-tint text-success border-success/30",
  "Static Package": "bg-violet-accent-tint text-violet-accent border-violet-accent/30",
};

// 🎯 থিম-ভিত্তিক Speed color (সব Teal টোনে)
const getSpeedColor = (speed: number) => {
  if (speed >= 20) return "bg-signal";
  if (speed >= 15) return "bg-signal-light";
  if (speed >= 10) return "bg-signal";
  if (speed >= 8) return "bg-signal-light";
  return "bg-slate-400";
};

const emptyPkg: PackageData = {
  id: 0,
  name: "",
  speed: 10,
  type: "PPPoE Package",
  profile: "NO",
  pool: "",
  monthly: 0,
  base: 0,
  rateType: "Company Defined",
};

export default function PackagePlanPage() {
  const [activeTab, setActiveTab] = useState<"own" | "customer">("own");
  const [ownData, setOwnData] = useState(ownRates);
  const [customerData, setCustomerData] = useState(customerRates);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<PackageData | null>(null);
  const [newPkg, setNewPkg] = useState<PackageData>({ ...emptyPkg });

  const currentData = activeTab === "own" ? ownData : customerData;
  const setCurrentData = activeTab === "own" ? setOwnData : setCustomerData;

  const filteredData = useMemo(() => {
    let filtered = currentData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.pool.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All Types" || item.type === typeFilter;
      return matchesSearch && matchesType;
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
  }, [currentData, searchTerm, typeFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const allSelected =
    paginatedData.length > 0 && paginatedData.every((p) => selectedRows.includes(p.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedData.find((p) => p.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedData.map((p) => p.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const stats = useMemo(() => {
    const total = currentData.length;
    const avgBill = total > 0 ? currentData.reduce((acc, c) => acc + c.monthly, 0) / total : 0;
    const maxSpeed = Math.max(...currentData.map((c) => c.speed), 0);
    const activePlans = currentData.filter((c) => c.monthly > 0).length;
    return { total, avgBill, maxSpeed, activePlans };
  }, [currentData]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setTypeFilter("All Types");
    setCurrentPage(1);
  };

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkg.name.trim()) {
      alert("Package name is required!");
      return;
    }
    if (!newPkg.pool.trim()) {
      alert("Pool name is required!");
      return;
    }
    const newId = Math.max(...currentData.map((p) => p.id), 0) + 1;
    const toAdd = { ...newPkg, id: newId };
    setCurrentData((prev) => [toAdd, ...prev]);
    setNewPkg({ ...emptyPkg });
    setAddModal(false);
    alert(`✅ Package "${toAdd.name}" added successfully!`);
  };

  const handleSaveEdit = () => {
    if (!editModal || !editModal.name.trim()) {
      alert("Package name is required!");
      return;
    }
    setCurrentData((prev) => prev.map((p) => (p.id === editModal.id ? editModal : p)));
    setEditModal(null);
    alert("Package updated successfully!");
  };

  const handleCopy = (pkg: PackageData) => {
    const newId = Math.max(...currentData.map((p) => p.id), 0) + 1;
    const copied = { ...pkg, id: newId, name: `${pkg.name}_copy` };
    setCurrentData((prev) => [copied, ...prev]);
    alert(`Package copied as "${copied.name}"`);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete package "${name}"? This cannot be undone.`)) {
      setCurrentData((prev) => prev.filter((p) => p.id !== id));
      setSelectedRows((prev) => prev.filter((i) => i !== id));
      alert("Package deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one package.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} package(s)?`)) {
      setCurrentData((prev) => prev.filter((p) => !selectedRows.includes(p.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} package(s) deleted.`);
    }
  };

  const handleExport = () => {
    const dataToExport =
      selectedRows.length > 0 ? currentData.filter((p) => selectedRows.includes(p.id)) : filteredData;
    const headers = "Name,Speed,Type,Profile,Pool,Monthly,Base";
    const csvRows = dataToExport.map(
      (p) => `"${p.name}",${p.speed},"${p.type}","${p.profile}","${p.pool}",${p.monthly},${p.base}`
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `packages-${activeTab}-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} package(s) to CSV.`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* Sticky Header Bar */}
        <div className="border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab("own"); setCurrentPage(1); setSelectedRows([]); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                  activeTab === "own"
                    ? "bg-signal text-white border-signal shadow-md scale-105"
                    : "bg-white border-slate-200 text-slate-500 hover:text-signal hover:border-signal/50"
                )}
              >
                <Gauge className="h-4 w-4" /> Own Rates
              </button>
              <button
                onClick={() => { setActiveTab("customer"); setCurrentPage(1); setSelectedRows([]); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border",
                  activeTab === "customer"
                    ? "bg-signal text-white border-signal shadow-md scale-105"
                    : "bg-white border-slate-200 text-slate-500 hover:text-signal hover:border-signal/50"
                )}
              >
                <Users2 className="h-4 w-4" /> Customer Rate
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === "grid" ? "bg-white shadow-sm text-signal" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-lg transition-all",
                    viewMode === "list" ? "bg-white shadow-sm text-signal" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:text-signal transition-all"
              >
                <Download className="h-4 w-4" /> Export
              </button>
              <button
                onClick={() => setAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> Add Package
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Pricing & Plans
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
              Package Plan
            </h1>
          </div>

          {/* 🎯 Compact Stat Cards - Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Avg Bill</p>
                <p className="text-lg font-heading font-bold text-success">৳{stats.avgBill.toFixed(0)}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Max Speed</p>
                <p className="text-lg font-heading font-bold text-violet-accent">{stats.maxSpeed}M</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Active</p>
                <p className="text-lg font-heading font-bold text-warning">{stats.activePlans}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search packages by name, type or pool…"
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
              <option>All Types</option>
              <option>PPPoE Package</option>
              <option>Hotspot Package</option>
              <option>Static Package</option>
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
                <Trash2 className="h-3.5 w-3.5" /> Delete {selectedRows.length}
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
                { key: "speed", label: "Speed" },
                { key: "monthly", label: "Price" },
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
              {paginatedData.map((pkg) => {
                const isSelected = selectedRows.includes(pkg.id);
                return (
                  <div
                    key={pkg.id}
                    className={cn(
                      "group relative bg-white rounded-2xl border border-slate-200 p-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden",
                      isSelected && "border-signal/50 bg-signal-tint"
                    )}
                  >
                    <div className="absolute top-3 left-3 z-10">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(pkg.id)}
                        className="rounded cursor-pointer accent-signal"
                      />
                    </div>

                    <div className="flex items-start justify-between mb-4 mt-6">
                      <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110", getSpeedColor(pkg.speed))}>
                        <span className="text-lg font-bold">{pkg.speed}</span>
                      </div>
                      <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md border", typeColors[pkg.type] || "bg-slate-100 text-slate-600")}>
                        {pkg.type.split(" ")[0]}
                      </span>
                    </div>

                    <h3 className="font-bold text-base mb-1 truncate text-signal">{pkg.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 truncate">
                      Pool: {pkg.pool} • Profile: {pkg.profile}
                    </p>

                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-heading font-bold text-signal">৳{pkg.monthly}</span>
                      <span className="text-xs text-slate-500">/month</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                      <span>Base: ৳{pkg.base}</span>
                      {pkg.rateType && (
                        <span className="px-2 py-0.5 rounded-md bg-violet-accent-tint text-violet-accent font-bold">
                          {pkg.rateType}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => setEditModal({ ...pkg })}
                        className="p-1.5 rounded-lg bg-white shadow-sm hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                        title="Edit"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(pkg)}
                        className="p-1.5 rounded-lg bg-white shadow-sm hover:bg-slate-100 text-slate-500 hover:text-violet-accent transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id, pkg.name)}
                        className="p-1.5 rounded-lg bg-white shadow-sm hover:bg-destructive/10 text-slate-500 hover:text-destructive transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
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
                    {["Package", "Type", "PPP Profile", "Pool", "Monthly Bill", "Base Rate", ...(activeTab === "customer" ? ["Rate Type"] : []), "Actions"].map((h) => (
                      <th key={h} className="text-left px-6 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          {h}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((pkg) => {
                    const isSelected = selectedRows.includes(pkg.id);
                    return (
                      <tr
                        key={pkg.id}
                        className={cn(
                          "border-t border-slate-100 hover:bg-slate-50 transition-colors",
                          isSelected && "bg-signal-tint"
                        )}
                      >
                        <td className="px-4 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(pkg.id)}
                            className="rounded cursor-pointer accent-signal"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-md", getSpeedColor(pkg.speed))}>
                              {pkg.speed}
                            </div>
                            <span className="font-semibold text-signal">{pkg.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={cn("text-[10px] font-bold px-2 py-1 rounded-md border", typeColors[pkg.type] || "bg-slate-100")}>
                            {pkg.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{pkg.profile}</td>
                        <td className="px-6 py-4 text-slate-500 font-mono text-xs">{pkg.pool}</td>
                        <td className="px-6 py-4 font-bold text-signal">৳{pkg.monthly}</td>
                        <td className="px-6 py-4 text-slate-500">৳{pkg.base}</td>
                        {activeTab === "customer" && (
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 rounded-full bg-violet-accent-tint text-violet-accent text-xs font-bold">
                              {pkg.rateType}
                            </span>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditModal({ ...pkg })}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleCopy(pkg)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-violet-accent transition-colors"
                              title="Copy"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(pkg.id, pkg.name)}
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

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center mb-4">
                <Wifi className="h-8 w-8 text-signal" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1 text-signal">No packages found</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">
                {searchTerm || typeFilter !== "All Types"
                  ? "Try adjusting your search or filters."
                  : "Add your first package to get started."}
              </p>
              <button
                onClick={() => setAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> Add Package
              </button>
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

      {/* Add Package Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-signal" />
                  <span className="font-heading font-bold text-sm text-signal">LOGO ICON ONLY</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Add New Package
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Create a new {activeTab === "own" ? "Own Rate" : "Customer Rate"} package.
                </p>
              </div>
              <button
                onClick={() => setAddModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddPackage} className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">
                  Package Name <span className="text-destructive">*</span>
                </label>
                <input
                  value={newPkg.name}
                  onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                  placeholder="e.g. 25Mbps_Package"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Speed (Mbps)</label>
                  <input
                    type="number"
                    value={newPkg.speed}
                    onChange={(e) => setNewPkg({ ...newPkg, speed: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Type</label>
                  <select
                    value={newPkg.type}
                    onChange={(e) => setNewPkg({ ...newPkg, type: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option>PPPoE Package</option>
                    <option>Hotspot Package</option>
                    <option>Static Package</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">
                    Pool <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={newPkg.pool}
                    onChange={(e) => setNewPkg({ ...newPkg, pool: e.target.value })}
                    placeholder="e.g. 25Mbps_Pool"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">PPP Profile</label>
                  <input
                    value={newPkg.profile}
                    onChange={(e) => setNewPkg({ ...newPkg, profile: e.target.value })}
                    placeholder="e.g. NO"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Monthly Bill (৳)</label>
                  <input
                    type="number"
                    value={newPkg.monthly}
                    onChange={(e) => setNewPkg({ ...newPkg, monthly: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Base Rate (৳)</label>
                  <input
                    type="number"
                    value={newPkg.base}
                    onChange={(e) => setNewPkg({ ...newPkg, base: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Package Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Edit Package
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Update the package details.
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
                <label className="font-semibold text-sm block text-signal">Package Name</label>
                <input
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Speed (Mbps)</label>
                  <input
                    type="number"
                    value={editModal.speed}
                    onChange={(e) => setEditModal({ ...editModal, speed: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Type</label>
                  <select
                    value={editModal.type}
                    onChange={(e) => setEditModal({ ...editModal, type: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option>PPPoE Package</option>
                    <option>Hotspot Package</option>
                    <option>Static Package</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Pool</label>
                  <input
                    value={editModal.pool}
                    onChange={(e) => setEditModal({ ...editModal, pool: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">PPP Profile</label>
                  <input
                    value={editModal.profile}
                    onChange={(e) => setEditModal({ ...editModal, profile: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Monthly Bill (৳)</label>
                  <input
                    type="number"
                    value={editModal.monthly}
                    onChange={(e) => setEditModal({ ...editModal, monthly: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Base Rate (৳)</label>
                  <input
                    type="number"
                    value={editModal.base}
                    onChange={(e) => setEditModal({ ...editModal, base: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
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