"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumCard, PageHeader, gradientBtn } from "@/components/config/shared";
import {
  Plus, Search, UserPlus, Pencil, Trash2, Copy, X, Save,
  ArrowUpDown, ChevronLeft, ChevronRight, Package, CheckCircle2,
  XCircle, Wifi, Activity, Zap, TrendingUp, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "sl", label: "SL" },
  { key: "server", label: "Server" },
  { key: "protocol", label: "Protocol" },
  { key: "name", label: "Name" },
  { key: "speed", label: "Speed" },
  { key: "price", label: "Price" },
  { key: "validity", label: "Validity" },
  { key: "volume", label: "Volume" },
  { key: "count", label: "Count" },
  { key: "privacy", label: "Privacy" },
  { key: "status", label: "Status" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: 1, sl: 335, server: "SERVER-2", protocol: "PPPoE", name: "500Tk@8Mb30Day", speed: "8 Mbps", price: 500, validity: "30d 0h", volume: "Unlimited", count: 122, privacy: "Public", active: true },
  { id: 2, sl: 336, server: "SERVER-2", protocol: "PPPoE", name: "600Tk@10Mb30Day", speed: "10 Mbps", price: 600, validity: "30d 0h", volume: "Unlimited", count: 88, privacy: "Public", active: true },
  { id: 3, sl: 337, server: "SERVER-3", protocol: "Hotspot", name: "100Tk@5Mb7Day", speed: "5 Mbps", price: 100, validity: "7d 0h", volume: "50 GB", count: 240, privacy: "Public", active: true },
  { id: 4, sl: 338, server: "SERVER-3", protocol: "Hotspot", name: "300Tk@8Mb15Day", speed: "8 Mbps", price: 300, validity: "15d 0h", volume: "100 GB", count: 165, privacy: "Public", active: false },
  { id: 5, sl: 339, server: "SERVER-4", protocol: "PPPoE", name: "1200Tk@20Mb30Day", speed: "20 Mbps", price: 1200, validity: "30d 0h", volume: "Unlimited", count: 45, privacy: "Private", active: true },
  { id: 6, sl: 340, server: "SERVER-2", protocol: "PPPoE", name: "800Tk@15Mb30Day", speed: "15 Mbps", price: 800, validity: "30d 0h", volume: "Unlimited", count: 72, privacy: "Public", active: true },
  { id: 7, sl: 341, server: "SERVER-3", protocol: "Hotspot", name: "50Tk@3Mb3Day", speed: "3 Mbps", price: 50, validity: "3d 0h", volume: "20 GB", count: 520, privacy: "Public", active: true },
  { id: 8, sl: 342, server: "SERVER-4", protocol: "PPPoE", name: "1000Tk@18Mb30Day", speed: "18 Mbps", price: 1000, validity: "30d 0h", volume: "Unlimited", count: 38, privacy: "Private", active: false },
  { id: 9, sl: 343, server: "SERVER-2", protocol: "PPPoE", name: "400Tk@5Mb30Day", speed: "5 Mbps", price: 400, validity: "30d 0h", volume: "Unlimited", count: 210, privacy: "Public", active: true },
  { id: 10, sl: 344, server: "SERVER-3", protocol: "Hotspot", name: "200Tk@6Mb10Day", speed: "6 Mbps", price: 200, validity: "10d 0h", volume: "80 GB", count: 178, privacy: "Public", active: true },
];

// প্ল্যান ফর্ম মডাল
function PlanFormModal({
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
      server: "SERVER-2",
      protocol: "PPPoE",
      name: "",
      speed: "",
      price: 0,
      validity: "30d 0h",
      volume: "Unlimited",
      privacy: "Public",
      active: true,
    }
  );

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev: any) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: name === "price" ? Number(value) : value,
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
            {isEdit ? "Edit Package Plan" : "Add New Package Plan"}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold">Server</label>
            <select
              name="server"
              value={formData.server}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm focus:ring-2 focus:ring-signal outline-none"
            >
              <option value="SERVER-2">SERVER-2</option>
              <option value="SERVER-3">SERVER-3</option>
              <option value="SERVER-4">SERVER-4</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Protocol</label>
            <select
              name="protocol"
              value={formData.protocol}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm focus:ring-2 focus:ring-signal outline-none"
            >
              <option value="PPPoE">PPPoE</option>
              <option value="Hotspot">Hotspot</option>
              <option value="Static">Static</option>
            </select>
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-semibold">Plan Name <span className="text-signal">*</span></label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. 500Tk@8Mb30Day"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Speed</label>
            <Input
              name="speed"
              value={formData.speed}
              onChange={handleChange}
              placeholder="e.g. 8 Mbps"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Price (৳)</label>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Validity</label>
            <Input
              name="validity"
              value={formData.validity}
              onChange={handleChange}
              placeholder="e.g. 30d 0h"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Volume</label>
            <Input
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              placeholder="e.g. Unlimited or 50 GB"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Privacy</label>
            <select
              name="privacy"
              value={formData.privacy}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm focus:ring-2 focus:ring-signal outline-none"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Status</label>
            <select
              name="active"
              value={formData.active ? "true" : "false"}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, active: e.target.value === "true" }))}
              className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm focus:ring-2 focus:ring-signal outline-none"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={onClose} variant="outline" className="flex-1 rounded-xl font-semibold h-12">
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(formData)}
            className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
          >
            <Save className="w-4 h-4 mr-2" /> {isEdit ? "Update Plan" : "Save Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ConfigPackagePlanPage() {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [protocolFilter, setProtocolFilter] = useState<"all" | "PPPoE" | "Hotspot" | "Static">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);

  // Stat Cards
  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.active).length;
    const inactive = total - active;
    const totalUsers = rows.reduce((a, b) => a + b.count, 0);
    return { total, active, inactive, totalUsers };
  }, [rows]);

  // ফিল্টার + সার্চ
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.server.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.speed.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProtocol = protocolFilter === "all" || r.protocol === protocolFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && r.active) ||
        (statusFilter === "inactive" && !r.active);
      return matchesSearch && matchesProtocol && matchesStatus;
    });
  }, [rows, searchTerm, protocolFilter, statusFilter]);

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

  const handleOpenAdd = () => {
    setEditingPlan(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (plan: any) => {
    setEditingPlan(plan);
    setModalOpen(true);
  };

  const handleSubmitPlan = (data: any) => {
    if (editingPlan) {
      setRows((prev) => prev.map((r) => (r.id === editingPlan.id ? { ...r, ...data } : r)));
      alert(`Plan "${data.name}" updated successfully!`);
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      const newSl = Math.max(...rows.map((r) => r.sl), 0) + 1;
      setRows((prev) => [...prev, { ...data, id: newId, sl: newSl, count: 0 }]);
      alert(`Plan "${data.name}" added successfully!`);
    }
    setModalOpen(false);
  };

  const handleDelete = (row: any) => {
    if (confirm(`Delete plan "${row.name}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
      alert("Plan deleted successfully!");
    }
  };

  const handleToggleStatus = (row: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r))
    );
  };

  const handleAssignUser = (row: any) => {
    alert(`Assigning user to plan: ${row.name}\n\nIn real app, this would open a user selection modal.`);
  };

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name);
    alert(`Copied: ${name}`);
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one plan.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} plan(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} plan(s) deleted.`);
    }
  };

  const handleBulkActivate = () => {
    if (selectedRows.length === 0) return;
    setRows((prev) =>
      prev.map((r) => (selectedRows.includes(r.id) ? { ...r, active: true } : r))
    );
    alert(`${selectedRows.length} plan(s) activated.`);
    setSelectedRows([]);
  };

  const handleBulkDeactivate = () => {
    if (selectedRows.length === 0) return;
    setRows((prev) =>
      prev.map((r) => (selectedRows.includes(r.id) ? { ...r, active: false } : r))
    );
    alert(`${selectedRows.length} plan(s) deactivated.`);
    setSelectedRows([]);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Config" title="Package Plan List">
            <Button onClick={handleOpenAdd} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Plan
            </Button>
          </PageHeader>

          {/* Stat Cards - Compact Horizontal */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
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

            <button
              type="button"
              onClick={() => { setStatusFilter("active"); setCurrentPage(1); }}
              className={cn(
                "bg-card rounded-xl border-l-4 border-l-emerald-500 border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
                statusFilter === "active" && "ring-2 ring-emerald-500/30"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Active</p>
                <p className="font-heading text-xl font-bold text-emerald-600">{stats.active}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setStatusFilter("inactive"); setCurrentPage(1); }}
              className={cn(
                "bg-card rounded-xl border-l-4 border-l-red-500 border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
                statusFilter === "inactive" && "ring-2 ring-red-500/30"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Inactive</p>
                <p className="font-heading text-xl font-bold text-red-600">{stats.inactive}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => { setSortKey("count"); setSortOrder("desc"); }}
              className={cn(
                "bg-card rounded-xl border-l-4 border-l-violet-accent border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
                sortKey === "count" && "ring-2 ring-violet-accent/30"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-violet-accent/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Users</p>
                <p className="font-heading text-xl font-bold text-violet-accent">{stats.totalUsers}</p>
              </div>
            </button>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2 flex-wrap">
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
                    onClick={handleBulkActivate}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/5"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Activate
                  </Button>
                  <Button
                    onClick={handleBulkDeactivate}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-amber-600 border-amber-500/30 hover:bg-amber-500/5"
                  >
                    <XCircle className="w-3 h-3 mr-1" /> Deactivate
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
              {/* Protocol Filter */}
              <div className="flex items-center bg-muted/50 rounded-full p-1 border">
                {(["all", "PPPoE", "Hotspot", "Static"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => { setProtocolFilter(p); setCurrentPage(1); }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap",
                      protocolFilter === p
                        ? "bg-signal text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {p === "all" ? "All" : p}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search plan..."
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
                    <th className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">Action</th>
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
                          <td className="px-4 py-4 font-medium">{r.sl}</td>
                          <td className="px-4 py-4">
                            <span className="bg-signal/10 text-signal text-xs font-semibold px-2.5 py-1 rounded-md border border-signal/20">
                              {r.server}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={cn(
                              "text-xs font-semibold px-2.5 py-1 rounded-md border",
                              r.protocol === "PPPoE"
                                ? "bg-violet-accent/10 text-violet-accent border-violet-accent/20"
                                : r.protocol === "Hotspot"
                                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            )}>
                              {r.protocol}
                            </span>
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
                          </td>
                          <td className="px-4 py-4">
                            <span className="flex items-center gap-1.5 text-xs font-semibold">
                              <Wifi className="w-3.5 h-3.5 text-signal" />
                              {r.speed}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-semibold text-signal">৳{r.price}</td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">{r.validity}</td>
                          <td className="px-4 py-4 text-muted-foreground text-xs">{r.volume}</td>
                          <td className="px-4 py-4">
                            <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2 py-1 rounded-md border border-violet-accent/20">
                              {r.count}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={cn(
                              "text-xs font-semibold px-2.5 py-1 rounded-md border",
                              r.privacy === "Public"
                                ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            )}>
                              {r.privacy}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleToggleStatus(r)}
                              className={cn(
                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border transition-all",
                                r.active
                                  ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25"
                                  : "bg-red-500/15 text-red-600 border-red-500/20 hover:bg-red-500/25"
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", r.active ? "bg-emerald-500" : "bg-red-500")} />
                              {r.active ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleAssignUser(r)}
                                className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center hover:bg-signal/20 transition-colors"
                                title="Assign User"
                              >
                                <UserPlus className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleOpenEdit(r)}
                                className="w-8 h-8 rounded-full bg-violet-accent-tint text-violet-accent flex items-center justify-center hover:bg-violet-accent/20 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(r)}
                                className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 2} className="px-4 py-16 text-center text-muted-foreground">
                        <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No package plans found</p>
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
      <PlanFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitPlan}
        initialData={editingPlan}
      />
    </div>
  );
}