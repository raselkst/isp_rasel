"use client";

import { useState, useMemo, useRef } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumCard, PageHeader, gradientBtn } from "@/components/config/shared";
import {
  Upload, Download, Plus, Link2, Pencil, Trash2, X, Save, Search,
  ArrowUpDown, ChevronLeft, ChevronRight, Server, Users, Wifi,
  CheckCircle2, XCircle, TrendingUp, Eye, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "sl", label: "SL" },
  { key: "serverName", label: "Server Name" },
  { key: "resellerName", label: "Reseller Name" },
  { key: "vlanNo", label: "VLAN No" },
  { key: "hotspotName", label: "Hotspot Name" },
  { key: "online", label: "Online" },
  { key: "supportName", label: "Support Name" },
  { key: "supportPhone", label: "Support Phone" },
  { key: "createdTime", label: "Created Time" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: 1, sl: 1, serverName: "SERVER-2", resellerName: "Poli Network", vlanNo: "100", hotspotName: "HS-Poli-01", online: 45, supportName: "RBN Bappy", supportPhone: "01716102651", createdTime: "2025-09-15 10:30 AM", active: true },
  { id: 2, sl: 2, serverName: "SERVER-2", resellerName: "AR Internet", vlanNo: "101", hotspotName: "HS-AR-01", online: 32, supportName: "Mogul Ali", supportPhone: "01716102652", createdTime: "2025-09-14 02:15 PM", active: true },
  { id: 3, sl: 3, serverName: "SERVER-3", resellerName: "ZS Cable Network", vlanNo: "102", hotspotName: "HS-ZS-01", online: 78, supportName: "Karim Hossain", supportPhone: "01716102653", createdTime: "2025-09-13 09:00 AM", active: true },
  { id: 4, sl: 4, serverName: "SERVER-3", resellerName: "Online Network", vlanNo: "103", hotspotName: "HS-ON-01", online: 0, supportName: "Sabbir Ahmed", supportPhone: "01716102654", createdTime: "2025-09-12 04:45 PM", active: false },
  { id: 5, sl: 5, serverName: "SERVER-4", resellerName: "Akas Cable Network", vlanNo: "104", hotspotName: "HS-AK-01", online: 56, supportName: "Nusrat Jahan", supportPhone: "01716102655", createdTime: "2025-09-11 11:20 AM", active: true },
  { id: 6, sl: 6, serverName: "SERVER-2", resellerName: "Poli Network Pop", vlanNo: "105", hotspotName: "HS-PNP-01", online: 22, supportName: "Arif Hossain", supportPhone: "01716102656", createdTime: "2025-09-10 03:30 PM", active: true },
  { id: 7, sl: 7, serverName: "SERVER-4", resellerName: "Sky Net", vlanNo: "106", hotspotName: "HS-SKY-01", online: 0, supportName: "Tasnim Akter", supportPhone: "01716102657", createdTime: "2025-09-09 08:15 AM", active: false },
  { id: 8, sl: 8, serverName: "SERVER-3", resellerName: "Digital ISP", vlanNo: "107", hotspotName: "HS-DIG-01", online: 91, supportName: "Shakib Khan", supportPhone: "01716102658", createdTime: "2025-09-08 06:45 PM", active: true },
];

// সার্ভার বাইন্ড ফর্ম মডাল
function BindFormModal({
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
      serverName: "SERVER-2",
      resellerName: "",
      vlanNo: "",
      hotspotName: "",
      supportName: "",
      supportPhone: "",
      active: true,
    }
  );

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
            {isEdit ? "Edit Server Bind" : "Add New Server Bind"}
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
            <label className="text-sm font-semibold">Server Name <span className="text-signal">*</span></label>
            <select
              name="serverName"
              value={formData.serverName}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm focus:ring-2 focus:ring-signal outline-none"
            >
              <option value="SERVER-2">SERVER-2</option>
              <option value="SERVER-3">SERVER-3</option>
              <option value="SERVER-4">SERVER-4</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Reseller Name <span className="text-signal">*</span></label>
            <Input
              name="resellerName"
              value={formData.resellerName}
              onChange={handleChange}
              placeholder="e.g. Poli Network"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">VLAN No</label>
            <Input
              name="vlanNo"
              value={formData.vlanNo}
              onChange={handleChange}
              placeholder="e.g. 100"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Hotspot Name</label>
            <Input
              name="hotspotName"
              value={formData.hotspotName}
              onChange={handleChange}
              placeholder="e.g. HS-Poli-01"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Support Name</label>
            <Input
              name="supportName"
              value={formData.supportName}
              onChange={handleChange}
              placeholder="e.g. RBN Bappy"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">Support Phone</label>
            <Input
              name="supportPhone"
              value={formData.supportPhone}
              onChange={handleChange}
              placeholder="e.g. 01716102651"
              className="rounded-xl"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
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
            <Save className="w-4 h-4 mr-2" /> {isEdit ? "Update Bind" : "Save Bind"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Empty State Graphic
function BindGraphic() {
  return (
    <svg viewBox="0 0 260 180" className="w-full max-w-xs mx-auto">
      <defs>
        <radialGradient id="bindGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="var(--violet-accent)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--violet-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="130" cy="90" r="80" fill="url(#bindGlow)" />
      <rect x="55" y="55" width="60" height="70" rx="14" fill="var(--card)" stroke="var(--signal)" strokeWidth="2.5" />
      <rect x="145" y="55" width="60" height="70" rx="14" fill="var(--card)" stroke="var(--violet-accent)" strokeWidth="2.5" />
      <path
        d="M115 90 H145"
        stroke="var(--signal)"
        strokeWidth="2.5"
        strokeDasharray="6 6"
        strokeLinecap="round"
      />
      <circle cx="130" cy="90" r="7" fill="var(--signal)" />
      <circle cx="85" cy="80" r="4" fill="var(--signal)" opacity="0.7" />
      <circle cx="175" cy="80" r="4" fill="var(--violet-accent)" opacity="0.7" />
    </svg>
  );
}

export default function ServerBindPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBind, setEditingBind] = useState<any>(null);

  // Stat Cards
  const stats = useMemo(() => {
    const total = rows.length;
    const active = rows.filter((r) => r.active).length;
    const inactive = total - active;
    const totalOnline = rows.reduce((a, b) => a + b.online, 0);
    return { total, active, inactive, totalOnline };
  }, [rows]);

  // ফিল্টার + সার্চ
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.serverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.resellerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.hotspotName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.supportName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && r.active) ||
        (statusFilter === "inactive" && !r.active);
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
    setEditingBind(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (bind: any) => {
    setEditingBind(bind);
    setModalOpen(true);
  };

  const handleSubmitBind = (data: any) => {
    if (editingBind) {
      setRows((prev) => prev.map((r) => (r.id === editingBind.id ? { ...r, ...data } : r)));
      alert(`Server Bind "${data.serverName} - ${data.resellerName}" updated successfully!`);
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      const newSl = Math.max(...rows.map((r) => r.sl), 0) + 1;
      setRows((prev) => [
        ...prev,
        { ...data, id: newId, sl: newSl, online: 0, createdTime: new Date().toLocaleString("en-GB") },
      ]);
      alert(`Server Bind "${data.serverName} - ${data.resellerName}" added successfully!`);
    }
    setModalOpen(false);
  };

  const handleDelete = (row: any) => {
    if (confirm(`Delete bind "${row.serverName} → ${row.resellerName}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
      alert("Server bind deleted successfully!");
    }
  };

  const handleToggleStatus = (row: any) => {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, active: !r.active } : r))
    );
  };

  // Import / Export
  const handleImport = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.match(/\.(csv|xlsx|xls)$/i)) {
      alert("Please select a valid CSV or Excel file.");
      return;
    }
    alert(`Imported file: ${file.name}\n\nIn real app, this would parse and add binds.`);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExport = () => {
    const dataToExport = selectedRows.length > 0 ? rows.filter((r) => selectedRows.includes(r.id)) : sortedRows;
    const headers = columns.map((c) => c.label).join(",");
    const csvRows = dataToExport.map((r) => columns.map((c) => `"${(r as any)[c.key]}"`).join(","));
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `server-binds-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} bind(s) to CSV.`);
  };

  // Bulk Actions
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one bind.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} bind(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} bind(s) deleted.`);
    }
  };

  const handleBulkActivate = () => {
    if (selectedRows.length === 0) return;
    setRows((prev) => prev.map((r) => (selectedRows.includes(r.id) ? { ...r, active: true } : r)));
    alert(`${selectedRows.length} bind(s) activated.`);
    setSelectedRows([]);
  };

  const handleBulkDeactivate = () => {
    if (selectedRows.length === 0) return;
    setRows((prev) => prev.map((r) => (selectedRows.includes(r.id) ? { ...r, active: false } : r)));
    alert(`${selectedRows.length} bind(s) deactivated.`);
    setSelectedRows([]);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Config" title="Service Server Bind">
            <Button
              onClick={handleImport}
              variant="outline"
              className="rounded-full gap-1.5 font-semibold h-11 px-5"
            >
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button
              onClick={handleExport}
              variant="outline"
              className="rounded-full gap-1.5 font-semibold h-11 px-5"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={handleOpenAdd} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Bind
            </Button>
          </PageHeader>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <button
              type="button"
              onClick={() => { setSortKey("serverName"); setSortOrder("asc"); }}
              className={cn(
                "bg-card rounded-xl border-l-4 border-l-signal border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
                sortKey === "serverName" && "ring-2 ring-signal/30"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <Link2 className="w-4 h-4 text-signal" />
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
              onClick={() => { setSortKey("online"); setSortOrder("desc"); }}
              className={cn(
                "bg-card rounded-xl border-l-4 border-l-violet-accent border border-border p-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all text-left",
                sortKey === "online" && "ring-2 ring-violet-accent/30"
              )}
            >
              <div className="w-9 h-9 rounded-lg bg-violet-accent/10 flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Online</p>
                <p className="font-heading text-xl font-bold text-violet-accent">{stats.totalOnline}</p>
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
              {/* Status Filter */}
              <div className="flex items-center bg-muted/50 rounded-full p-1 border">
                {(["all", "active", "inactive"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setCurrentPage(1); }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap capitalize",
                      statusFilter === s
                        ? "bg-signal text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search bind..."
                  className="pl-9 rounded-full w-56 h-9"
                />
              </div>
            </div>
          </div>

          {/* Table / Empty State */}
          <PremiumCard>
            {paginatedRows.length > 0 ? (
              <>
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
                      {paginatedRows.map((r) => {
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
                                {r.serverName}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-semibold">{r.resellerName}</td>
                            <td className="px-4 py-4">
                              <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2 py-1 rounded-md border border-violet-accent/20">
                                {r.vlanNo}
                              </span>
                            </td>
                            <td className="px-4 py-4 font-mono text-xs">{r.hotspotName}</td>
                            <td className="px-4 py-4">
                              <span className={cn(
                                "inline-flex items-center gap-1.5 text-xs font-semibold",
                                r.online > 0 ? "text-emerald-600" : "text-muted-foreground"
                              )}>
                                <span className={cn("w-1.5 h-1.5 rounded-full", r.online > 0 ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                                {r.online} users
                              </span>
                            </td>
                            <td className="px-4 py-4">{r.supportName}</td>
                            <td className="px-4 py-4 font-mono text-xs">{r.supportPhone}</td>
                            <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{r.createdTime}</td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleToggleStatus(r)}
                                  className={cn(
                                    "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all mr-1",
                                    r.active
                                      ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25"
                                      : "bg-red-500/15 text-red-600 border-red-500/20 hover:bg-red-500/25"
                                  )}
                                >
                                  <span className={cn("w-1.5 h-1.5 rounded-full", r.active ? "bg-emerald-500" : "bg-red-500")} />
                                  {r.active ? "Active" : "Inactive"}
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
                      })}
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <BindGraphic />
                <div className="text-center space-y-1.5">
                  <p className="font-heading text-xl font-bold flex items-center justify-center gap-2">
                    <Link2 className="h-5 w-5 text-signal" />
                    No servers bound yet
                  </p>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Bind a Mikrotik server to a reseller or hotspot to route sessions through it.
                  </p>
                </div>
                <Button onClick={handleOpenAdd} className={gradientBtn}>
                  <Plus className="h-4 w-4" /> Add your first bind
                </Button>
              </div>
            )}
          </PremiumCard>
        </div>
      </div>

      {/* Modal */}
      <BindFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitBind}
        initialData={editingBind}
      />
    </div>
  );
}