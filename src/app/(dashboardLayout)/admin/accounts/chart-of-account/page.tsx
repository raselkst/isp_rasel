"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  Pencil, Trash2, Save, X, Plus, BookOpen, TrendingUp,
  TrendingDown, Wallet, Layers, AlertCircle, Info, Search,
  ArrowUpDown, CheckSquare, CheckCircle2, Copy
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "code", label: "Code" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
  { key: "actions", label: "Action" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: 1, code: "1001", name: "Service Income", type: "Income", description: "Income from ISP service" },
  { id: 2, code: "1002", name: "Recharge Income", type: "Income", description: "Income from recharges" },
  { id: 3, code: "1003", name: "Installation Fee", type: "Income", description: "New connection fees" },
  { id: 4, code: "2001", name: "ISP Bill", type: "Expense", description: "Internet lease line payment" },
  { id: 5, code: "2002", name: "Salary", type: "Expense", description: "Staff salary" },
  { id: 6, code: "2003", name: "Rent", type: "Expense", description: "Office rent" },
  { id: 7, code: "3001", name: "Cash in Hand", type: "Asset", description: "Cash balance" },
  { id: 8, code: "3002", name: "Bank Account", type: "Asset", description: "Bank balance" },
  { id: 9, code: "4001", name: "Accounts Payable", type: "Liability", description: "Vendor payable" },
  { id: 10, code: "5001", name: "Owner's Equity", type: "Equity", description: "Owner's capital" },
];

const accountTypes = ["Income", "Expense", "Asset", "Liability", "Equity"];

export default function ChartOfAccountPage() {
  const [rows, setRows] = useState(initialRows);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // ফিল্টার
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.includes(searchTerm) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All" || r.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [rows, searchTerm, typeFilter]);

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

  // সিলেক্ট অল
  const allSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selectedRows.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedRows.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedRows.map((r) => r.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // Stat counts
  const stats = useMemo(() => {
    return {
      total: rows.length,
      income: rows.filter((r) => r.type === "Income").length,
      expense: rows.filter((r) => r.type === "Expense").length,
      other: rows.filter((r) => !["Income", "Expense"].includes(r.type)).length,
    };
  }, [rows]);

  // Sort হ্যান্ডলার
  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  // Auto Code Generation
  const generateCode = (type: string) => {
    const prefixes: Record<string, string> = {
      Income: "1",
      Expense: "2",
      Asset: "3",
      Liability: "4",
      Equity: "5",
    };
    const prefix = prefixes[type] || "9";
    const sameType = rows.filter((r) => r.code.startsWith(prefix));
    const maxNum = sameType.reduce((max, r) => {
      const num = parseInt(r.code.slice(1), 10);
      return num > max ? num : max;
    }, 0);
    return `${prefix}${String(maxNum + 1).padStart(3, "0")}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "type" && value && !editingId) {
      setFormData((prev) => ({ ...prev, code: generateCode(value) }));
    }
  };

  // Save
  const handleSave = () => {
    if (!formData.name.trim()) return alert("Account Name is required!");
    if (!formData.type) return alert("Account Type is required!");
    if (!formData.code.trim()) return alert("Account Code is required!");

    const duplicate = rows.find(
      (r) => r.code === formData.code && r.id !== editingId
    );
    if (duplicate) {
      alert(`Code "${formData.code}" already exists! Please use a different code.`);
      return;
    }

    if (editingId) {
      setRows((prev) =>
        prev.map((r) => (r.id === editingId ? { ...r, ...formData } : r))
      );
      alert(`Account "${formData.name}" updated successfully!`);
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      setRows((prev) => [{ id: newId, ...formData }, ...prev]);
      alert(`Account "${formData.name}" added successfully!`);
    }

    handleCancel();
    setCurrentPage(1);
  };

  const handleEdit = (row: any) => {
    setFormData({
      code: row.code,
      name: row.name,
      type: row.type,
      description: row.description || "",
    });
    setEditingId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (confirm(`Delete account "${row.name}"? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      setSelectedRows((prev) => prev.filter((i) => i !== id));
      if (editingId === id) handleCancel();
      alert("Account deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one account.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} account head(s)? This cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} account(s) deleted.`);
    }
  };

  const handleCancel = () => {
    setFormData({ code: "", name: "", type: "", description: "" });
    setEditingId(null);
  };

  // Export Actions
  const exportToCSV = (filename: string) => {
    const headers = "Code,Name,Type,Description";
    const csvRows = sortedRows.map((r) =>
      `"${r.code}","${r.name}","${r.type}","${r.description || ""}"`
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = sortedRows
      .map((r) => `${r.code} | ${r.name} | ${r.type}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert(`Copied ${sortedRows.length} account(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(`chart-of-accounts-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };

  const handleCSV = () => {
    exportToCSV(`chart-of-accounts-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };

  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
  };

  // Type ব্যাজ
  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      Income: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      Expense: "bg-red-500/10 text-red-600 border-red-500/20",
      Asset: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      Liability: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      Equity: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    };
    return map[type] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Chart of Accounts
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage all income, expense, asset, liability, and equity heads.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-signal/10 text-signal px-4 py-2 rounded-full text-xs font-semibold border border-signal/20">
              <BookOpen className="w-3.5 h-3.5" />
              {stats.total} Total Accounts
            </div>
          </div>

          {/* 🎯 Compact Colorful Stat Cards - এক লাইনে */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-signal to-violet-accent text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Income</p>
                <p className="text-lg font-heading font-bold">{stats.income}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Expense</p>
                <p className="text-lg font-heading font-bold">{stats.expense}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Others</p>
                <p className="text-lg font-heading font-bold">{stats.other}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Add / Edit Form */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-signal to-violet-accent text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingId ? "Edit Account Head" : "Add Account Head"}
              </h2>
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Type" required>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="">Select Type</option>
                    {accountTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Code" required>
                  <Input
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="Auto-generated"
                    className="rounded-xl bg-signal/5 border-signal/30 font-mono font-semibold"
                  />
                  <p className="text-xs text-signal font-medium mt-1">
                    * Code auto-generates when you select a Type
                  </p>
                </Field>
                <Field label="Name" required>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Service Income"
                    className="rounded-xl"
                  />
                </Field>
              </div>

              <Field label="Description">
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description about this account head..."
                  className="rounded-xl"
                />
              </Field>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl font-semibold h-11 px-6"
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl font-semibold h-11 px-8 bg-gradient-to-r from-signal to-violet-accent border-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update Head" : "Save Head"}
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setTypeFilter("All")}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                typeFilter === "All"
                  ? "bg-signal text-white border-signal"
                  : "bg-background text-muted-foreground border-border hover:border-signal/50"
              )}
            >
              All ({stats.total})
            </button>
            {accountTypes.map((t) => {
              const count = rows.filter((r) => r.type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setCurrentPage(1); }}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    typeFilter === t
                      ? "bg-signal text-white border-signal"
                      : "bg-background text-muted-foreground border-border hover:border-signal/50"
                  )}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <TableToolbar
            title="Account Heads"
            searchTerm={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
            onCopy={handleCopy}
            onExcel={handleExcel}
            onCSV={handleCSV}
            onPDF={handlePDF}
          />

          {/* Selected Rows + Bulk Delete */}
          {selectedRows.length > 0 && (
            <div className="flex items-center gap-3 mb-3">
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
            </div>
          )}

          {/* Table */}
          <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
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
                        onClick={() => c.key !== "actions" && handleSort(c.key)}
                        className={cn(
                          "text-left px-6 py-4 font-semibold text-xs whitespace-nowrap",
                          c.key !== "actions" && "cursor-pointer hover:bg-signal/90 transition-colors select-none"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {c.label}
                          {c.key !== "actions" && (
                            <ArrowUpDown className={cn("w-3 h-3", sortKey === c.key ? "opacity-100" : "opacity-60")} />
                          )}
                        </div>
                      </th>
                    ))}
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
                            editingId === r.id ? "bg-signal/5" : isSelected ? "bg-signal/5" : "hover:bg-muted/30"
                          )}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(r.id)}
                              className="rounded cursor-pointer"
                            />
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-signal">
                            {r.code}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold">{r.name}</p>
                              {r.description && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {r.description}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                              getTypeBadge(r.type)
                            )}>
                              {r.type}
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
                                onClick={() => handleDelete(r.id)}
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
                      <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No account heads found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(n) => { setRowsPerPage(n); setCurrentPage(1); }}
              onPageChange={setCurrentPage}
              totalItems={sortedRows.length}
              startIndex={startIndex}
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20 mt-6">
            <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Tip:</span> Each account head has a unique code with a
              prefix indicating its type (1xxx = Income, 2xxx = Expense, 3xxx = Asset, 4xxx = Liability,
              5xxx = Equity). This ensures clean accounting separation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}