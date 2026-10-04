"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, gradientBtn, PremiumCard } from "@/components/config/shared";
import {
  Search, Pencil, Plus, Trash2, Copy, CheckCircle2, X, Save,
  ArrowUpDown, ChevronLeft, ChevronRight, Package, TrendingUp,
  TrendingDown, DollarSign, Percent, Filter, Eye, XCircle
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
const initialRows = [
  { id: 1, name: "10Mbps_Package", pool: "10Mbps_Pool", profile: "10Mbps_Profile", queue: "—", bill: 500, vat: 0, base: 500, speed: "10 Mbps" },
  { id: 2, name: "12Mbps_Package", pool: "12Mbps_Pool", profile: "12Mbps_Profile", queue: "—", bill: 600, vat: 0, base: 600, speed: "12 Mbps" },
  { id: 3, name: "15Mbps_Package", pool: "15Mbps_Pool", profile: "15Mbps_Profile", queue: "—", bill: 500, vat: 0, base: 500, speed: "15 Mbps" },
  { id: 4, name: "20Mbps_Package", pool: "20Mbps_Pool", profile: "20Mbps_Profile", queue: "—", bill: 600, vat: 0, base: 600, speed: "20 Mbps" },
  { id: 5, name: "25Mbps_Package", pool: "25Mbps_Pool", profile: "25Mbps_Profile", queue: "—", bill: 700, vat: 0, base: 700, speed: "25 Mbps" },
  { id: 6, name: "30Mbps_Package", pool: "30Mbps_Pool", profile: "30Mbps_Profile", queue: "—", bill: 800, vat: 0, base: 800, speed: "30 Mbps" },
  { id: 7, name: "5Mbps_Package", pool: "5Mbps_Pool", profile: "5Mbps_Profile", queue: "—", bill: 400, vat: 0, base: 400, speed: "5 Mbps" },
  { id: 8, name: "8Mbps_Package", pool: "8Mbps_Pool", profile: "8Mbps_Profile", queue: "—", bill: 500, vat: 0, base: 500, speed: "8 Mbps" },
  { id: 9, name: "40Mbps_Package", pool: "40Mbps_Pool", profile: "40Mbps_Profile", queue: "—", bill: 1000, vat: 0, base: 1000, speed: "40 Mbps" },
  { id: 10, name: "50Mbps_Package", pool: "50Mbps_Pool", profile: "50Mbps_Profile", queue: "—", bill: 1200, vat: 0, base: 1200, speed: "50 Mbps" },
];

// মডাল (Add / Edit Package)
function PackageFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}) {
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      pool: "",
      profile: "",
      queue: "",
      bill: 0,
      vat: 0,
      base: 0,
      speed: "",
    }
  );

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: ["bill", "vat", "base"].includes(name) ? Number(value) : value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
            {isEdit ? "Edit Package" : "Add New Package"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {[
            { name: "name", label: "Package Name", placeholder: "10Mbps_Package" },
            { name: "speed", label: "Speed", placeholder: "10 Mbps" },
            { name: "pool", label: "Pool", placeholder: "10Mbps_Pool" },
            { name: "profile", label: "PPP Profile", placeholder: "10Mbps_Profile" },
            { name: "queue", label: "Queue", placeholder: "—" },
          ].map((f) => (
            <div key={f.name} className="space-y-2">
              <label className="text-sm font-semibold">{f.label}</label>
              <Input
                name={f.name}
                value={(formData as any)[f.name] || ""}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="rounded-xl"
              />
            </div>
          ))}
          {[
            { name: "bill", label: "Bill (৳)" },
            { name: "vat", label: "VAT (%)" },
            { name: "base", label: "Base Rate (৳)" },
          ].map((f) => (
            <div key={f.name} className="space-y-2">
              <label className="text-sm font-semibold">{f.label}</label>
              <Input
                name={f.name}
                type="number"
                value={(formData as any)[f.name] || 0}
                onChange={handleChange}
                className="rounded-xl"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl font-semibold h-12">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(formData)}
            className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
          >
            <Save className="w-4 h-4 mr-2" /> {isEdit ? "Update" : "Save Package"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PackagesRatesPage() {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [rateFilter, setRateFilter] = useState<"all" | "low" | "mid" | "high">("all");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editRateId, setEditRateId] = useState<number | null>(null);
  const [editRateValue, setEditRateValue] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);

  // Stat Cards
  const stats = useMemo(() => {
    const total = rows.length;
    const avgRate = total > 0 ? Math.round(rows.reduce((a, b) => a + b.bill, 0) / total) : 0;
    const highest = total > 0 ? Math.max(...rows.map((r) => r.bill)) : 0;
    const lowest = total > 0 ? Math.min(...rows.map((r) => r.bill)) : 0;
    return { total, avgRate, highest, lowest };
  }, [rows]);

  // ফিল্টার + সার্চ
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.pool.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.profile.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesRate = true;
      if (rateFilter === "low") matchesRate = r.bill < 500;
      else if (rateFilter === "mid") matchesRate = r.bill >= 500 && r.bill < 800;
      else if (rateFilter === "high") matchesRate = r.bill >= 800;
      return matchesSearch && matchesRate;
    });
  }, [rows, searchTerm, rateFilter]);

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

  // ============ ACTIONS ============

  // Add/Edit Package
  const handleOpenAdd = () => {
    setEditingPackage(null);
    setModalOpen(true);
  };
  const handleOpenEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setModalOpen(true);
  };
  const handleSubmitPackage = (data: any) => {
    if (editingPackage) {
      setRows((prev) => prev.map((r) => (r.id === editingPackage.id ? { ...r, ...data } : r)));
      alert(`Package "${data.name}" updated successfully!`);
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      setRows((prev) => [...prev, { ...data, id: newId }]);
      alert(`Package "${data.name}" added successfully!`);
    }
    setModalOpen(false);
  };

  // Inline Edit Rate
  const startEditRate = (row: any) => {
    setEditRateId(row.id);
    setEditRateValue(row.bill);
  };
  const saveEditRate = (id: number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, bill: editRateValue, base: editRateValue } : r)));
    setEditRateId(null);
    alert("Rate updated successfully!");
  };
  const cancelEditRate = () => setEditRateId(null);

  // Delete Individual
  const handleDelete = (row: any) => {
    if (confirm(`Delete package "${row.name}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
      alert("Package deleted successfully!");
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one package.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} package(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} package(s) deleted.`);
    }
  };

  // Bulk Update Rate
  const handleBulkUpdateRate = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one package.");
      return;
    }
    const newRate = prompt(`Enter new Bill rate for ${selectedRows.length} selected package(s):`);
    if (newRate && !isNaN(Number(newRate))) {
      setRows((prev) =>
        prev.map((r) =>
          selectedRows.includes(r.id) ? { ...r, bill: Number(newRate), base: Number(newRate) } : r
        )
      );
      alert(`Updated ${selectedRows.length} package(s) with new rate ৳${newRate}.`);
      setSelectedRows([]);
    }
  };

  // Copy Package Name
  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    alert(`Copied: ${name}`);
  };

  // View
  const handleView = (row: any) => {
    alert(
      `Package Details:\n\nName: ${row.name}\nSpeed: ${row.speed || "N/A"}\nPool: ${row.pool}\nPPP Profile: ${row.profile}\nQueue: ${row.queue}\nBill: ৳${row.bill}\nVAT: ${row.vat}%\nBase Rate: ৳${row.base}`
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Config" title="Packages & Rates">
            <Button onClick={handleOpenAdd} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Package
            </Button>
          </PageHeader>

          {/* Stat Cards - Compact Horizontal */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  {/* Total Packages */}
  <button
    type="button"
    onClick={() => { setSortKey("name"); setSortOrder("asc"); }}
    className={cn(
      "bg-card rounded-xl border-l-4 border-l-signal border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
      sortKey === "name" && "ring-2 ring-signal/30"
    )}
  >
    <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
      <Package className="w-4 h-4 text-signal" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
      <p className="font-heading text-xl font-bold text-foreground">{stats.total}</p>
    </div>
  </button>

  {/* Avg Rate */}
  <button
    type="button"
    onClick={() => { setSortKey("bill"); setSortOrder("asc"); }}
    className={cn(
      "bg-card rounded-xl border-l-4 border-l-blue-500 border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
      sortKey === "bill" && sortOrder === "asc" && "ring-2 ring-blue-500/30"
    )}
  >
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <DollarSign className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg</p>
      <p className="font-heading text-xl font-bold text-blue-600">৳{stats.avgRate}</p>
    </div>
  </button>

  {/* Highest Rate */}
  <button
    type="button"
    onClick={() => { setSortKey("bill"); setSortOrder("desc"); }}
    className={cn(
      "bg-card rounded-xl border-l-4 border-l-emerald-500 border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
      sortKey === "bill" && sortOrder === "desc" && "ring-2 ring-emerald-500/30"
    )}
  >
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <TrendingUp className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Highest</p>
      <p className="font-heading text-xl font-bold text-emerald-600">৳{stats.highest}</p>
    </div>
  </button>

  {/* Lowest Rate */}
  <button
    type="button"
    onClick={() => { setSortKey("bill"); setSortOrder("asc"); }}
    className={cn(
      "bg-card rounded-xl border-l-4 border-l-amber-500 border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
      sortKey === "bill" && sortOrder === "asc" && "ring-2 ring-amber-500/30"
    )}
  >
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <TrendingDown className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Lowest</p>
      <p className="font-heading text-xl font-bold text-amber-600">৳{stats.lowest}</p>
    </div>
  </button>
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
                    onClick={handleBulkUpdateRate}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-signal border-signal/30 hover:bg-signal/5"
                  >
                    <Pencil className="w-3 h-3 mr-1" /> Bulk Update Rate
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
              {/* Rate Filter */}
              <div className="flex items-center bg-muted/50 rounded-full p-1 border">
                {[
                  { id: "all", label: "All" },
                  { id: "low", label: "Low (<500)" },
                  { id: "mid", label: "Mid (500-800)" },
                  { id: "high", label: "High (800+)" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { setRateFilter(f.id as any); setCurrentPage(1); }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap",
                      rateFilter === f.id
                        ? "bg-signal text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search package..."
                  className="pl-9 rounded-full w-56 h-9"
                />
              </div>
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
                    <th className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">Actions</th>
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
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{r.name}</p>
                              <button
                                onClick={() => handleCopy(r.name)}
                                className="p-1 rounded hover:bg-muted transition-colors"
                                title="Copy Name"
                              >
                                <Copy className="w-3 h-3 text-muted-foreground" />
                              </button>
                            </div>
                            {r.speed && (
                              <p className="text-[10px] text-muted-foreground mt-0.5">{r.speed}</p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-muted-foreground">{r.pool}</td>
                          <td className="px-4 py-4 text-muted-foreground">{r.profile}</td>
                          <td className="px-4 py-4 text-muted-foreground">{r.queue}</td>
                          <td className="px-4 py-4 font-semibold text-signal">৳{r.bill.toFixed(2)}</td>
                          <td className="px-4 py-4 text-muted-foreground">{r.vat}%</td>
                          <td className="px-4 py-4 text-muted-foreground">৳{r.base.toFixed(2)}</td>
                          <td className="px-4 py-4">
                            {editRateId === r.id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={editRateValue}
                                  onChange={(e) => setEditRateValue(Number(e.target.value))}
                                  className="w-24 h-8 text-xs rounded-lg"
                                  autoFocus
                                />
                                <button
                                  onClick={() => saveEditRate(r.id)}
                                  className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                                  title="Save"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={cancelEditRate}
                                  className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => startEditRate(r)}
                                  className="flex items-center gap-1.5 text-signal font-semibold text-xs hover:underline"
                                >
                                  <Pencil className="h-3.5 w-3.5" /> Edit Rate
                                </button>
                                <button
                                  onClick={() => handleView(r)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button
                                  onClick={() => handleOpenEdit(r)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                  title="Full Edit"
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
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-16 text-center text-muted-foreground">
                        <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No packages found</p>
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
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
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

      {/* Modal */}
      <PackageFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitPackage}
        initialData={editingPackage}
      />
    </div>
  );
}