"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PremiumCard, PageHeader, gradientBtn } from "@/components/config/shared";
import {
  Search, Trash2, Plus, Pencil, Download, ArrowUpDown, X, Save,
  Calendar, CalendarDays, Clock, TrendingUp, AlertCircle, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "name", label: "Name" },
  { key: "day", label: "Day of Month" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: 1, name: "Day 1", day: 1 },
  { id: 2, name: "Day 5", day: 5 },
  { id: 3, name: "Day 10", day: 10 },
  { id: 4, name: "Day 15", day: 15 },
  { id: 5, name: "Day 20", day: 20 },
  { id: 6, name: "Day 25", day: 25 },
  { id: 7, name: "Day 30", day: 30 },
  { id: 8, name: "Day 28", day: 28 },
  { id: 9, name: "Day 3", day: 3 },
  { id: 10, name: "Day 12", day: 12 },
  { id: 11, name: "Day 18", day: 18 },
  { id: 12, name: "Day 22", day: 22 },
];

const dayPresets = [1, 5, 10, 15, 20, 25, 28, 30];

const emptyRow = { id: 0, name: "", day: 1 };

export default function PackageRateBillCyclePage() {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editModal, setEditModal] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Stat Calculations
  const stats = useMemo(() => {
    const total = rows.length;
    const days = rows.map((r) => r.day);
    const avg = total > 0 ? Math.round(days.reduce((a, b) => a + b, 0) / total) : 0;
    const earliest = total > 0 ? Math.min(...days) : 0;
    const latest = total > 0 ? Math.max(...days) : 0;
    return { total, avg, earliest, latest };
  }, [rows]);

  // Filter + Sort
  const filteredRows = useMemo(() => {
    let filtered = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r.day).includes(searchTerm)
    );
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
  }, [rows, searchTerm, sortKey, sortOrder]);

  // Select Handlers
  const allSelected = filteredRows.length > 0 && filteredRows.every((r) => selectedRows.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedRows([]);
    else setSelectedRows(filteredRows.map((r) => r.id));
  };
  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Sort Handler
  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  // Edit / Add / Save / Delete
  const handleEdit = (row: any) => {
    setEditModal({ ...row });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditModal({ ...emptyRow, id: Math.max(...rows.map((r) => r.id), 0) + 1 });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    if (!editModal.name.trim()) {
      alert("Bill Cycle Name is required!");
      return;
    }
    if (editModal.day < 1 || editModal.day > 31) {
      alert("Day must be between 1 and 31!");
      return;
    }
    if (isAddingNew) {
      setRows((prev) => [...prev, editModal]);
      alert(`New bill cycle "${editModal.name}" added successfully!`);
    } else {
      setRows((prev) => prev.map((r) => (r.id === editModal.id ? editModal : r)));
      alert(`Bill cycle "${editModal.name}" updated successfully!`);
    }
    setEditModal(null);
    setIsAddingNew(false);
  };

  const handleDelete = (row: any) => {
    if (confirm(`Delete bill cycle "${row.name}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
      alert("Bill cycle deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one bill cycle.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} bill cycle(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} bill cycle(s) deleted.`);
    }
  };

  const handleExport = () => {
    const headers = columns.map((c) => c.label).join(",");
    const csvRows = filteredRows.map((r: any) =>
      columns.map((c) => `"${r[c.key]}"`).join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bill-cycle-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${filteredRows.length} bill cycle(s) to CSV.`);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Package & Rate · ID-45-Sky Next Sent" title="Bill Cycle List">
            <Button
              onClick={handleExport}
              variant="outline"
              className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={handleAddNew} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Bill Cycle
            </Button>
          </PageHeader>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Total Cycles</p>
                <p className="font-heading text-xl font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Day</p>
                <p className="font-heading text-xl font-bold text-emerald-600">{stats.avg}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <CalendarDays className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Earliest</p>
                <p className="font-heading text-xl font-bold text-amber-600">Day {stats.earliest}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-accent/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Latest</p>
                <p className="font-heading text-xl font-bold text-violet-accent">Day {stats.latest}</p>
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
                    onClick={handleBulkDelete}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs font-semibold text-destructive border-destructive/30 hover:bg-destructive/5"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete Selected
                  </Button>
                </>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bill cycle..."
                className="pl-9 rounded-full w-64 h-9"
              />
            </div>
          </div>

          {/* Table */}
          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    <th className="px-6 py-4 w-12">
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
                        className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-signal/90 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          {c.label}
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                    ))}
                    <th className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length > 0 ? (
                    filteredRows.map((r) => {
                      const isSelected = selectedRows.includes(r.id);
                      return (
                        <tr
                          key={r.id}
                          className={cn(
                            "border-t transition-colors",
                            isSelected ? "bg-signal/5" : "hover:bg-signal-tint/30"
                          )}
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRow(r.id)}
                              className="rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2 font-semibold">
                              <span className="w-8 h-8 rounded-lg bg-signal/10 text-signal flex items-center justify-center text-xs font-bold">
                                {r.day}
                              </span>
                              {r.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal bg-signal/10 px-3 py-1 rounded-full border border-signal/20">
                              <Calendar className="w-3.5 h-3.5" /> Day {r.day}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(r)}
                                className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center hover:bg-signal/20 transition-colors"
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
                      <td colSpan={columns.length + 2} className="px-6 py-16 text-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No bill cycles found</p>
                        <p className="text-xs mt-1">Try adjusting your search or add a new bill cycle</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PremiumCard>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                {isAddingNew ? "Add New Bill Cycle" : "Edit Bill Cycle"}
              </h3>
              <button
                onClick={() => setEditModal(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 mb-8">
              <div className="space-y-2">
                <label className="font-semibold text-sm block">Bill Cycle Name <span className="text-red-500">*</span></label>
                <Input
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  placeholder="e.g. Day 1"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block">Day of Month <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min={1}
                    max={31}
                    value={editModal.day}
                    onChange={(e) => setEditModal({ ...editModal, day: Number(e.target.value) })}
                    className="rounded-xl pl-9"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Enter a day between 1 and 31</p>
              </div>

              {/* Quick Presets */}
              <div className="space-y-2">
                <label className="font-semibold text-sm block">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {dayPresets.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setEditModal({ ...editModal, day: d, name: `Day ${d}` })}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                        editModal.day === d
                          ? "bg-signal text-white border-signal shadow-sm"
                          : "bg-background text-muted-foreground border-border hover:border-signal/50"
                      )}
                    >
                      Day {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setEditModal(null)}
                variant="outline"
                className="flex-1 rounded-xl font-semibold h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAddingNew ? "Add Bill Cycle" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}