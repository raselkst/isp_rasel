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

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
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

  // ফিল্টার
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

  // পেজিনেশন
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // Stat Cards
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

  // হ্যান্ডেল চেঞ্জ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save
  const handleSave = () => {
    if (!formData.bankName.trim()) return alert("Bank Name is required!");
    if (!formData.accountName.trim()) return alert("Account Name is required!");
    if (!formData.accountNo.trim()) return alert("Account Number is required!");
    if (!formData.accountType) return alert("Account Type is required!");
    if (!formData.opening || Number(formData.opening) < 0) return alert("Valid opening balance is required!");

    // ডুপ্লিকেট Account No চেক
    const duplicate = rows.find(
      (r) => r.accountNo === formData.accountNo && r.id !== editingId
    );
    if (duplicate) {
      alert(`Account Number "${formData.accountNo}" already exists!`);
      return;
    }

    const opening = Number(formData.opening);

    if (editingId) {
      // এডিট - current ব্যালেন্স অপরিবর্তিত রাখা হবে
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, ...formData, opening, note: formData.note }
            : r
        )
      );
      alert(`Bank account "${formData.bankName}" updated successfully!`);
    } else {
      // নতুন - current = opening
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

  // এডিট
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

  // ডিলিট
  const handleDelete = (id: number) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    if (confirm(`Delete bank account "${row.bankName} - ${row.accountName}"?`)) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) handleCancel();
      alert("Bank account deleted successfully!");
    }
  };

  // রিফ্রেশ কারেন্ট ব্যালেন্স (মক)
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

  // ক্যান্সেল
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

  // Export Actions
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

  // ফরম্যাটিং
  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Type Badge
  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      Savings: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      Current: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Fixed Deposit": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      Salary: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    };
    return map[type] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Bank Accounts
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage all your bank accounts in one place.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-xs font-semibold border border-emerald-500/20">
              <Wallet className="w-3.5 h-3.5" />
              Total: ৳{formatCurrency(stats.totalBalance)}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Landmark className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Total Banks</p>
              </div>
              <p className="font-heading text-2xl font-bold">{stats.totalBanks}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Total Balance</p>
              </div>
              <p className="font-heading text-xl font-bold">৳{formatCurrency(stats.totalBalance)}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Total Accounts</p>
              </div>
              <p className="font-heading text-2xl font-bold">{stats.totalAccounts}</p>
            </div>
            <div className={cn(
              "rounded-2xl p-5 text-white shadow-lg bg-gradient-to-br",
              stats.growth >= 0 ? "from-amber-500 to-amber-600" : "from-red-500 to-red-600"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Net Growth</p>
              </div>
              <p className="font-heading text-xl font-bold">৳{formatCurrency(stats.growth)}</p>
            </div>
          </div>

          {/* Add / Edit Form */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-signal to-violet-accent text-white px-6 py-4 flex items-center justify-between">
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
                    className="rounded-xl"
                  />
                </Field>
                <Field label="Account Name" required>
                  <Input
                    name="accountName"
                    value={formData.accountName}
                    onChange={handleChange}
                    placeholder="e.g. SmartISP Operations"
                    className="rounded-xl"
                  />
                </Field>
                <Field label="Account Number" required>
                  <Input
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleChange}
                    placeholder="e.g. 1501203456789"
                    className="rounded-xl font-mono"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Account Type" required>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="">Select Type</option>
                    {accountTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Opening Balance" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      name="opening"
                      type="number"
                      value={formData.opening}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="rounded-xl pl-8"
                    />
                  </div>
                </Field>
                <Field label="Note">
                  <Input
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Optional note..."
                    className="rounded-xl"
                  />
                </Field>
              </div>

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
                  ? "bg-signal text-white border-signal"
                  : "bg-background text-muted-foreground border-border hover:border-signal/50"
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
            title="Bank Account List"
            searchTerm={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
            onCopy={handleCopy}
            onExcel={handleExcel}
            onCSV={handleCSV}
            onPDF={handlePDF}
          />

          {/* Table */}
          <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1100px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
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
                          "border-t transition-colors",
                          editingId === r.id ? "bg-signal/5" : "hover:bg-muted/30"
                        )}
                      >
                        <td className="px-5 py-4 font-semibold">{r.bankName}</td>
                        <td className="px-5 py-4 text-muted-foreground">{r.accountName}</td>
                        <td className="px-5 py-4 font-mono text-xs">{r.accountNo}</td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border",
                            getTypeBadge(r.accountType)
                          )}>
                            {r.accountType}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right font-medium">
                          ৳{formatCurrency(r.opening)}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-emerald-600">
                          ৳{formatCurrency(r.current)}
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground max-w-[200px] truncate">
                          {r.note || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRefresh(r.id)}
                              className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
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
                      <td colSpan={columns.length} className="px-5 py-16 text-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No bank accounts found</p>
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
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20 mt-6">
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