"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader, gradientBtn, PremiumCard } from "@/components/config/shared";
import {
  Search, Pencil, Plus, Trash2, ArrowUpDown, ChevronLeft, ChevronRight,
  CheckCircle2, X, Save, Package, Percent, TrendingUp, Globe,
  Copy, AlertCircle, Layers, Clock, ShieldCheck, Wifi
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "name", label: "Plan Name" },
  { key: "rate", label: "Rate" },
  { key: "vat", label: "VAT" },
  { key: "total", label: "Total" },
  { key: "otc", label: "OTC" },
  { key: "staticIp", label: "Static IP" },
  { key: "pool", label: "Pool" },
  { key: "timeBarred", label: "Time Barred" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRates = [
  { id: 1, name: "10Mbps-Pkg", rate: 30, vat: 0, total: 300, otc: 0, staticIp: false, pool: "10Mbps-Pool", timeBarred: false },
  { id: 2, name: "20Mbps-Pkg", rate: 50, vat: 5, total: 800, otc: 100, staticIp: true, pool: "20Mbps-Pool", timeBarred: false },
  { id: 3, name: "30Mbps-Pkg", rate: 75, vat: 5, total: 1200, otc: 150, staticIp: true, pool: "30Mbps-Pool", timeBarred: true },
  { id: 4, name: "50Mbps-Pkg", rate: 120, vat: 10, total: 1800, otc: 200, staticIp: true, pool: "50Mbps-Pool", timeBarred: false },
  { id: 5, name: "5Mbps-Pkg", rate: 20, vat: 0, total: 300, otc: 0, staticIp: false, pool: "5Mbps-Pool", timeBarred: false },
  { id: 6, name: "15Mbps-Pkg", rate: 42, vat: 5, total: 650, otc: 50, staticIp: false, pool: "15Mbps-Pool", timeBarred: true },
  { id: 7, name: "25Mbps-Pkg", rate: 65, vat: 5, total: 1000, otc: 100, staticIp: true, pool: "25Mbps-Pool", timeBarred: false },
  { id: 8, name: "100Mbps-Pkg", rate: 250, vat: 10, total: 3500, otc: 500, staticIp: true, pool: "100Mbps-Pool", timeBarred: false },
  { id: 9, name: "40Mbps-Pkg", rate: 100, vat: 10, total: 1500, otc: 150, staticIp: false, pool: "40Mbps-Pool", timeBarred: true },
  { id: 10, name: "8Mbps-Pkg", rate: 25, vat: 0, total: 400, otc: 0, staticIp: false, pool: "8Mbps-Pool", timeBarred: false },
  { id: 11, name: "60Mbps-Pkg", rate: 150, vat: 10, total: 2200, otc: 300, staticIp: true, pool: "60Mbps-Pool", timeBarred: false },
];

interface Rate {
  id: number;
  name: string;
  rate: number;
  vat: number;
  total: number;
  otc: number;
  staticIp: boolean;
  pool: string;
  timeBarred: boolean;
}

const emptyRate: Rate = {
  id: 0,
  name: "",
  rate: 0,
  vat: 0,
  total: 0,
  otc: 0,
  staticIp: false,
  pool: "",
  timeBarred: false,
};

export default function RateListPage() {
  const [rates, setRates] = useState<Rate[]>(initialRates);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Rate>(emptyRate);

  // Stat Cards
  const stats = useMemo(() => {
    const avgRate = rates.length > 0 ? rates.reduce((s, r) => s + r.rate, 0) / rates.length : 0;
    const totalValue = rates.reduce((s, r) => s + r.total, 0);
    const withVat = rates.filter((r) => r.vat > 0).length;
    return { total: rates.length, avgRate, totalValue, withVat };
  }, [rates]);

  // ফিল্টার + সার্চ
  const filteredRates = useMemo(() => {
    return rates.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pool.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rates, searchTerm]);

  // সর্টিং
  const sortedRates = useMemo(() => {
    if (!sortKey) return filteredRates;
    return [...filteredRates].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRates, sortKey, sortOrder]);

  // পেজিনেশন
  const totalPages = Math.ceil(sortedRates.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRates = sortedRates.slice(startIndex, startIndex + rowsPerPage);

  // সিলেক্ট
  const allSelected =
    paginatedRates.length > 0 && paginatedRates.every((r) => selectedRows.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedRates.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedRates.map((r) => r.id)])]);
    }
  };
  const toggleSelectRow = (id: number) => {
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

  // Add New
  const handleAddNew = () => {
    setFormData(emptyRate);
    setEditingId(null);
    setShowForm(true);
  };

  // Edit
  const handleEdit = (rate: Rate) => {
    setFormData(rate);
    setEditingId(rate.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Form Change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  // Save
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Plan Name is required!");
      return;
    }
    if (formData.rate <= 0) {
      alert("Rate must be greater than 0!");
      return;
    }

    if (editingId) {
      setRates((prev) => prev.map((r) => (r.id === editingId ? { ...formData, id: editingId } : r)));
      alert(`Plan "${formData.name}" updated successfully!`);
    } else {
      const newId = Math.max(...rates.map((r) => r.id), 0) + 1;
      setRates((prev) => [...prev, { ...formData, id: newId }]);
      alert(`Plan "${formData.name}" added successfully!`);
    }
    setShowForm(false);
    setFormData(emptyRate);
    setEditingId(null);
  };

  // Delete Individual
  const handleDelete = (rate: Rate) => {
    if (confirm(`Delete plan "${rate.name}"? This cannot be undone.`)) {
      setRates((prev) => prev.filter((r) => r.id !== rate.id));
      setSelectedRows((prev) => prev.filter((id) => id !== rate.id));
      alert("Plan deleted successfully!");
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one plan.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} plan(s)? This cannot be undone.`)) {
      setRates((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} plan(s) deleted.`);
    }
  };

  // Copy
  const handleCopy = (rate: Rate) => {
    const newId = Math.max(...rates.map((r) => r.id), 0) + 1;
    const copied = { ...rate, id: newId, name: `${rate.name}-Copy` };
    setRates((prev) => [...prev, copied]);
    alert(`Plan copied as "${copied.name}"!`);
  };

  // Cancel Form
  const handleCancelForm = () => {
    setShowForm(false);
    setFormData(emptyRate);
    setEditingId(null);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Package & Rate" title="Rate List">
            <Button onClick={handleAddNew} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Rate
            </Button>
          </PageHeader>

          {/* Stat Cards - Compact Horizontal */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="font-heading text-xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Rate</p>
                <p className="font-heading text-xl font-bold text-amber-600">৳{stats.avgRate.toFixed(0)}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Total Value</p>
                <p className="font-heading text-xl font-bold text-violet-600">৳{stats.totalValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">With VAT</p>
                <p className="font-heading text-xl font-bold text-emerald-600">{stats.withVat}</p>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-card rounded-2xl border shadow-sm p-6 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between border-b pb-3 mb-5">
                <h2 className="font-heading font-bold text-lg">
                  {editingId ? `Edit Plan: ${formData.name}` : "Add New Rate"}
                </h2>
                <button
                  onClick={handleCancelForm}
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Plan Name *</label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. 10Mbps-Pkg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Rate (৳) *</label>
                  <Input
                    name="rate"
                    type="number"
                    value={formData.rate}
                    onChange={handleFormChange}
                    placeholder="30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">VAT (%)</label>
                  <Input
                    name="vat"
                    type="number"
                    value={formData.vat}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Total (৳)</label>
                  <Input
                    name="total"
                    type="number"
                    value={formData.total}
                    onChange={handleFormChange}
                    placeholder="300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">OTC (৳)</label>
                  <Input
                    name="otc"
                    type="number"
                    value={formData.otc}
                    onChange={handleFormChange}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Pool</label>
                  <Input
                    name="pool"
                    value={formData.pool}
                    onChange={handleFormChange}
                    placeholder="e.g. 10Mbps-Pool"
                  />
                </div>
                <div className="flex items-center gap-4 h-10 mt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="staticIp"
                      checked={formData.staticIp}
                      onChange={handleFormChange}
                      className="rounded accent-signal w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Static IP</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="timeBarred"
                      checked={formData.timeBarred}
                      onChange={handleFormChange}
                      className="rounded accent-signal w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Time Barred</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-6 pt-5 border-t">
                <Button onClick={handleSave} className={gradientBtn}>
                  <Save className="w-4 h-4 mr-2" /> {editingId ? "Update Plan" : "Save Plan"}
                </Button>
                <Button onClick={handleCancelForm} variant="outline" className="rounded-full font-semibold px-6">
                  Cancel
                </Button>
              </div>
            </div>
          )}

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

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search rates..."
                className="pl-9 rounded-full w-64 h-9"
              />
            </div>
          </div>

          {/* Table */}
          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1100px]">
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
                    <th className="text-right px-4 py-4 font-semibold text-xs whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRates.length > 0 ? (
                    paginatedRates.map((r) => {
                      const isSelected = selectedRows.includes(r.id);
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
                          <td className="px-4 py-4 font-semibold">{r.name}</td>
                          <td className="px-4 py-4 font-semibold text-signal">৳{r.rate}</td>
                          <td className="px-4 py-4">
                            {r.vat > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                                <Percent className="w-3 h-3" /> {r.vat}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">No VAT</span>
                            )}
                          </td>
                          <td className="px-4 py-4 font-semibold text-violet-600">৳{r.total}</td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">
                            {r.otc > 0 ? `৳${r.otc}` : "—"}
                          </td>
                          <td className="px-4 py-4">
                            {r.staticIp ? (
                              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                                <Globe className="w-3 h-3" /> Yes
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">No</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">{r.pool}</td>
                          <td className="px-4 py-4">
                            {r.timeBarred ? (
                              <span className="inline-flex items-center gap-1 bg-red-500/10 text-red-600 border border-red-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                                <Clock className="w-3 h-3" /> Yes
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">No</span>
                            )}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1 justify-end">
                              <button
                                onClick={() => handleCopy(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Duplicate"
                              >
                                <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => handleEdit(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Edit"
                              >
                                <Pencil className="w-3.5 h-3.5 text-signal" />
                              </button>
                              <button
                                onClick={() => handleDelete(r)}
                                className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-16 text-center text-muted-foreground">
                        <Wifi className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No rates found</p>
                        <p className="text-xs mt-1">Try adjusting your search or add a new rate</p>
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
                  Showing {sortedRates.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, sortedRates.length)} of {sortedRates.length}
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
    </div>
  );
}