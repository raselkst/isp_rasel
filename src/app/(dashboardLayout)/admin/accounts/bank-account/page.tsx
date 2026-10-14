"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  Pencil, Trash2, Save, X, Plus, Building2, Wallet,
  RefreshCw, Landmark, TrendingUp, AlertCircle, Info, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = ["Bank Name", "Account Name", "Account No", "Type", "Opening Balance", "Current Balance", "Note", "Action"];

const initialRows = [
  { id: 1, bankName: "BRAC Bank", accountName: "SmartISP Operations", accountNo: "1501203456789", accountType: "Current", opening: 50000, current: 125400.5, note: "Main operational account" },
  { id: 2, bankName: "Dutch Bangla Bank", accountName: "SmartISP Savings", accountNo: "1021456789123", accountType: "Savings", opening: 100000, current: 285600.75, note: "Emergency fund" },
  { id: 3, bankName: "Islami Bank", accountName: "SmartISP Salary", accountNo: "2050123456789", accountType: "Salary", opening: 25000, current: 42350.0, note: "Staff salary account" },
  { id: 4, bankName: "City Bank", accountName: "SmartISP Fixed", accountNo: "1401234567890", accountType: "Fixed Deposit", opening: 500000, current: 550000.0, note: "1 year FDR" },
  { id: 5, bankName: "Sonali Bank", accountName: "SmartISP Reserve", accountNo: "3012345678901", accountType: "Current", opening: 75000, current: 89250.25, note: "Reserve fund" },
];

const accountTypes = ["Savings", "Current", "Fixed Deposit", "Salary"];

export default function BankAccountPage() {
  const [rows, setRows] = useState(initialRows);
  const [formData, setFormData] = useState({
    bankName: "",
    accountName: "",
    accountNo: "",
    accountType: "",
    opening: "",
    note: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.accountNo.includes(searchTerm) ||
        r.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "All" || r.accountType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [rows, searchTerm, typeFilter]);

  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  const stats = useMemo(() => {
    const totalBalance = rows.reduce((sum, r) => sum + r.current, 0);
    const totalOpening = rows.reduce((sum, r) => sum + r.opening, 0);
    return {
      totalBanks: new Set(rows.map((r) => r.bankName)).size,
      totalBalance,
      totalAccounts: rows.length,
      growth: totalBalance - totalOpening,
    };
  }, [rows]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.bankName.trim()) return alert("Bank Name is required!");
    if (!formData.accountName.trim()) return alert("Account Name is required!");
    if (!formData.accountNo.trim()) return alert("Account Number is required!");
    if (!formData.accountType) return alert("Account Type is required!");
    if (!formData.opening || Number(formData.opening) < 0) return alert("Valid opening balance is required!");

    const duplicate = rows.find(
      (r) => r.accountNo === formData.accountNo && r.id !== editingId
    );
    if (duplicate) {
      alert(`Account Number "${formData.accountNo}" already exists!`);
      return;
    }

    const opening = Number(formData.opening);

    if (editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, ...formData, opening, note: formData.note }
            : r
        )
      );
      alert(`Bank account "${formData.bankName}" updated successfully!`);
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      setRows((prev) => [
        { id: newId, ...formData, opening, current: opening, note: formData.note },
        ...prev,
      ]);
      alert(`Bank account "${formData.bankName}" added successfully!`);
    }

    handleCancel();
    setCurrentPage(1);
  };

  const handleEdit = (row: any) => {
    setFormData({
      bankName: row.bankName,
      accountName: row.accountName,
      accountNo: row.accountNo,
      accountType: row.accountType,
      opening: String(row.opening),
      note: row.note || "",
    });
    setEditingId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (confirm(`Delete bank account "${row.bankName} - ${row.accountName}"?`)) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) handleCancel();
      alert("Bank account deleted successfully!");
    }
  };

  const handleRefresh = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (confirm(`Fetch latest balance for "${row.bankName}"?`)) {
      const newBalance = row.current + (Math.random() * 10000 - 2000);
      setRows((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, current: Math.max(0, newBalance) } : r
        )
      );
      alert(`Balance refreshed for "${row.bankName}"!`);
    }
  };

  const handleCancel = () => {
    setFormData({
      bankName: "",
      accountName: "",
      accountNo: "",
      accountType: "",
      opening: "",
      note: "",
    });
    setEditingId(null);
  };

  const exportToCSV = (filename: string) => {
    const headers = "Bank Name,Account Name,Account No,Type,Opening Balance,Current Balance,Note";
    const csvRows = filteredRows.map((r) =>
      `"${r.bankName}","${r.accountName}","${r.accountNo}","${r.accountType}",${r.opening},${r.current},"${r.note || ""}"`
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
    const text = filteredRows
      .map((r) => `${r.bankName} | ${r.accountName} | ${r.accountNo} | ৳${r.current}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert(`Copied ${filteredRows.length} account(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(`bank-accounts-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };

  const handleCSV = () => {
    exportToCSV(`bank-accounts-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };

  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // 🎯 Theme-connected Type Badge
  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      Savings: "bg-success-tint text-success border-success/30",
      Current: "bg-signal-tint text-signal border-signal/30",
      "Fixed Deposit": "bg-violet-accent-tint text-violet-accent border-violet-accent/30",
      Salary: "bg-warning-tint text-warning border-warning/30",
    };
    return map[type] || "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
                Bank Accounts
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Manage all your bank accounts in one place.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-success-tint text-success px-4 py-2 rounded-full text-xs font-semibold border border-success/30">
              <Wallet className="w-3.5 h-3.5" />
              Total: ৳{formatCurrency(stats.totalBalance)}
            </div>
          </div>

          {/* 🎯 Compact Stat Cards — Theme-Based Colorful Backgrounds */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* Total Banks — Teal Theme */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-signal text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Banks</p>
                <p className="text-lg font-heading font-bold">{stats.totalBanks}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Total Balance — Success Theme */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-success text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Balance</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(stats.totalBalance)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Total Accounts — Violet Theme */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-violet-accent text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Accounts</p>
                <p className="text-lg font-heading font-bold">{stats.totalAccounts}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Net Growth — Warning or Destructive Theme */}
            <div className={cn(
              "relative overflow-hidden rounded-xl p-3 flex items-center gap-3 text-white shadow-md",
              stats.growth >= 0 ? "bg-warning" : "bg-destructive"
            )}>
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Growth</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(stats.growth)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Add / Edit Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-signal text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {editingId ? "Edit Bank Account" : "Add Bank Account"}
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
                <Field label="Bank Name" required>
                  <Input
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. BRAC Bank"
                    className="rounded-xl border-slate-200 text-signal"
                  />
                </Field>
                <Field label="Account Name" required>
                  <Input
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="e.g. SmartISP Operations"
                    className="rounded-xl border-slate-200 text-signal"
                  />
                </Field>
                <Field label="Account Number" required>
                  <Input
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    placeholder="e.g. 1501203456789"
                    className="rounded-xl border-slate-200 font-mono text-signal"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Account Type" required>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="">Select Type</option>
                    {accountTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Opening Balance" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">৳</span>
                    <Input
                      name="opening"
                      type="number"
                      value={formData.opening}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="rounded-xl pl-8 border-slate-200 text-signal"
                    />
                  </div>
                </Field>
                <Field label="Note">
                  <Input
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Optional note..."
                    className="rounded-xl border-slate-200 text-signal"
                  />
                </Field>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="rounded-xl font-semibold h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  className="rounded-xl font-semibold h-11 px-8 bg-signal text-white hover:bg-signal-hover border-0 shadow-md"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update Account" : "Save Account"}
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => { setTypeFilter("All"); setCurrentPage(1); }}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                typeFilter === "All"
                  ? "bg-signal text-white border-signal shadow-md"
                  : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
              )}
            >
              All ({rows.length})
            </button>
            {accountTypes.map((t) => {
              const count = rows.filter((r) => r.accountType === t).length;
              return (
                <button
                  key={t}
                  onClick={() => { setTypeFilter(t); setCurrentPage(1); }}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    typeFilter === t
                      ? "bg-signal text-white border-signal shadow-md"
                      : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                  )}
                >
                  {t} ({count})
                </button>
              );
            })}
          </div>

          {/* Toolbar */}
          <TableToolbar
            title="Bank Account List"
            searchTerm={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
            onCopy={handleCopy}
            onExcel={handleExcel}
            onCSV={handleCSV}
            onPDF={handlePDF}
          />

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1100px]">
                <thead>
                  <tr className="bg-signal text-white">
                    {columns.map((c) => (
                      <th key={c} className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((r) => (
                      <tr
                        key={r.id}
                        className={cn(
                          "border-t border-slate-100 transition-colors",
                          editingId === r.id ? "bg-signal-tint" : "hover:bg-slate-50"
                        )}
                      >
                        <td className="px-5 py-4 font-semibold text-signal">{r.bankName}</td>
                        <td className="px-5 py-4 text-slate-500">{r.accountName}</td>
                        <td className="px-5 py-4 font-mono text-xs text-slate-600">{r.accountNo}</td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border",
                            getTypeBadge(r.accountType)
                          )}>
                            {r.accountType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-medium text-slate-600">
                          ৳{formatCurrency(r.opening)}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-success">
                          ৳{formatCurrency(r.current)}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500 max-w-[200px] truncate">
                          {r.note || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRefresh(r.id)}
                              className="w-8 h-8 rounded-full bg-success-tint text-success flex items-center justify-center hover:bg-success/20 transition-colors"
                              title="Refresh Balance"
                            >
                              <RefreshCw className="h-3.5 w-3.5" />
                            </button>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-5 py-16 text-center text-slate-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-signal">No bank accounts found</p>
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
              totalItems={filteredRows.length}
              startIndex={startIndex}
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/20 mt-6">
            <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Tip:</span> Click the refresh icon <RefreshCw className="w-3 h-3 inline" /> next
              to any account to fetch its latest balance from the bank API. Opening balance remains fixed,
              while current balance updates periodically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}