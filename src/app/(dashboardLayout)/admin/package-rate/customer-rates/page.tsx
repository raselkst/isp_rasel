"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PageHeader, gradientBtn, PremiumCard } from "@/components/config/shared";
import {
  Search, Pencil, Plus, Trash2, ArrowUpDown, ChevronLeft, ChevronRight,
  CheckCircle2, X, Save, DollarSign, Package, TrendingUp, Percent,
  Copy, AlertCircle, BadgeDollarSign, Layers, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "name", label: "Plan Name" },
  { key: "pool", label: "Pool" },
  { key: "profile", label: "PPP Profile" },
  { key: "queue", label: "Queue" },
  { key: "bill", label: "Bill" },
  { key: "vat", label: "VAT" },
  { key: "base", label: "Base Rate" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRates = [
  { id: 1, name: "10Mbps-Pkg", pool: "10Mbps-Pool", profile: "10Mbps-Profile", queue: "10M-Q", bill: 500, vat: 0, base: 500, isActive: true },
  { id: 2, name: "20Mbps-Pkg", pool: "20Mbps-Pool", profile: "20Mbps-Profile", queue: "20M-Q", bill: 800, vat: 5, base: 760, isActive: true },
  { id: 3, name: "30Mbps-Pkg", pool: "30Mbps-Pool", profile: "30Mbps-Profile", queue: "30M-Q", bill: 1200, vat: 5, base: 1140, isActive: true },
  { id: 4, name: "50Mbps-Pkg", pool: "50Mbps-Pool", profile: "50Mbps-Profile", queue: "50M-Q", bill: 1800, vat: 10, base: 1620, isActive: true },
  { id: 5, name: "5Mbps-Pkg", pool: "5Mbps-Pool", profile: "5Mbps-Profile", queue: "5M-Q", bill: 300, vat: 0, base: 300, isActive: false },
  { id: 6, name: "15Mbps-Pkg", pool: "15Mbps-Pool", profile: "15Mbps-Profile", queue: "15M-Q", bill: 650, vat: 5, base: 617, isActive: true },
  { id: 7, name: "25Mbps-Pkg", pool: "25Mbps-Pool", profile: "25Mbps-Profile", queue: "25M-Q", bill: 1000, vat: 5, base: 950, isActive: true },
  { id: 8, name: "100Mbps-Pkg", pool: "100Mbps-Pool", profile: "100Mbps-Profile", queue: "100M-Q", bill: 3500, vat: 10, base: 3150, isActive: true },
  { id: 9, name: "40Mbps-Pkg", pool: "40Mbps-Pool", profile: "40Mbps-Profile", queue: "40M-Q", bill: 1500, vat: 10, base: 1350, isActive: false },
  { id: 10, name: "8Mbps-Pkg", pool: "8Mbps-Pool", profile: "8Mbps-Profile", queue: "8M-Q", bill: 400, vat: 0, base: 400, isActive: true },
  { id: 11, name: "60Mbps-Pkg", pool: "60Mbps-Pool", profile: "60Mbps-Profile", queue: "60M-Q", bill: 2200, vat: 10, base: 1980, isActive: true },
];

interface Rate {
  id: number;
  name: string;
  pool: string;
  profile: string;
  queue: string;
  bill: number;
  vat: number;
  base: number;
  isActive: boolean;
}

const emptyRate: Rate = {
  id: 0,
  name: "",
  pool: "",
  profile: "",
  queue: "",
  bill: 0,
  vat: 0,
  base: 0,
  isActive: true,
};

export default function CustomerRatesPage() {
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
    const active = rates.filter((r) => r.isActive).length;
    const totalRevenue = rates.reduce((sum, r) => sum + r.bill, 0);
    const avgBill = rates.length > 0 ? totalRevenue / rates.length : 0;
    return { total: rates.length, active, avgBill, totalRevenue };
  }, [rates]);

  // ফিল্টার + সার্চ
  const filteredRates = useMemo(() => {
    return rates.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.profile.toLowerCase().includes(searchTerm.toLowerCase())
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
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (formData.bill <= 0) {
      alert("Bill amount must be greater than 0!");
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

  // Toggle Active
  const handleToggleActive = (id: number) => {
    setRates((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)));
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
          <PageHeader eyebrow="Package & Rate" title="Customer Rates">
            <Button onClick={handleAddNew} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Rate
            </Button>
          </PageHeader>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Total Plans</p>
                <p className="font-heading text-xl font-bold text-foreground">{stats.total}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Active</p>
                <p className="font-heading text-xl font-bold text-emerald-600">{stats.active}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Bill</p>
                <p className="font-heading text-xl font-bold text-amber-600">৳{stats.avgBill.toFixed(0)}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Revenue</p>
                <p className="font-heading text-xl font-bold text-violet-600">৳{stats.totalRevenue.toLocaleString()}</p>
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Pool</label>
                  <Input
                    name="pool"
                    value={formData.pool}
                    onChange={handleFormChange}
                    placeholder="e.g. 10Mbps-Pool"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">PPP Profile</label>
                  <Input
                    name="profile"
                    value={formData.profile}
                    onChange={handleFormChange}
                    placeholder="e.g. 10Mbps-Profile"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Queue</label>
                  <Input
                    name="queue"
                    value={formData.queue}
                    onChange={handleFormChange}
                    placeholder="e.g. 10M-Q"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Bill (৳) *</label>
                  <Input
                    name="bill"
                    type="number"
                    value={formData.bill}
                    onChange={handleFormChange}
                    placeholder="500"
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
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Base Rate (৳)</label>
                  <Input
                    name="base"
                    type="number"
                    value={formData.base}
                    onChange={handleFormChange}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer h-10">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleFormChange}
                      className="rounded accent-signal w-4 h-4"
                    />
                    <span className="text-sm font-semibold">Active</span>
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
                placeholder="Search plans..."
                className="pl-9 rounded-full w-64 h-9"
              />
            </div>
          </div>

          {/* Table */}
          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1000px]">
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
                    <th className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">Status</th>
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
                          <td className="px-4 py-4 text-muted-foreground text-xs">{r.pool}</td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">{r.profile}</td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">{r.queue}</td>
                          <td className="px-4 py-4 font-semibold text-signal">৳{r.bill}</td>
                          <td className="px-4 py-4">
                            {r.vat > 0 ? (
                              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-semibold">
                                <Percent className="w-3 h-3" /> {r.vat}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground text-xs">No VAT</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">৳{r.base}</td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleToggleActive(r.id)}
                              className={cn(
                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-colors",
                                r.isActive
                                  ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25"
                                  : "bg-slate-500/15 text-slate-600 border-slate-500/20 hover:bg-slate-500/25"
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", r.isActive ? "bg-emerald-500" : "bg-slate-500")} />
                              {r.isActive ? "Active" : "Inactive"}
                            </button>
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
                      <td colSpan={columns.length + 3} className="px-4 py-16 text-center text-muted-foreground">
                        <BadgeDollarSign className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No plans found</p>
                        <p className="text-xs mt-1">Try adjusting your search or add a new plan</p>
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