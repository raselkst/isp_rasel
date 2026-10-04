"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  Pencil, Trash2, Save, X, Upload, TrendingDown, Wallet,
  Calendar, AlertCircle, Info, Receipt, DollarSign
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = ["SL", "Name", "Head", "Payment Method", "Date", "Amount", "Action"];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: 1, name: "ZS Cable Network (ZSCN)", head: "ISP Bill", method: "Cash", date: "24-02-2025", amount: 25000.0, remarks: "Fiber lease payment", fileName: "" },
  { id: 2, name: "Poli Network Pop", head: "Maintenance", method: "bKash", date: "22-02-2025", head2: "", amount: 8500.0, remarks: "Equipment repair", fileName: "" },
  { id: 3, name: "AR Internet", head: "Rent", method: "Bank Transfer", date: "20-02-2025", amount: 15000.0, remarks: "Office rent", fileName: "" },
  { id: 4, name: "Online Network", head: "Salary", method: "Cash", date: "18-02-2025", amount: 45000.0, remarks: "Staff salary", fileName: "" },
  { id: 5, name: "Akas Cable Network", head: "Utility", method: "Nagad", date: "15-02-2025", amount: 3200.0, remarks: "Electricity bill", fileName: "" },
  { id: 6, name: "Poli Network Pop", head: "Transport", method: "Cash", date: "12-02-2025", amount: 1800.0, remarks: "Field visit fuel", fileName: "" },
];

const paymentMethods = ["Cash", "bKash", "Nagad", "Rocket", "Bank Transfer", "Card"];
const expenseHeads = ["ISP Bill", "Maintenance", "Rent", "Salary", "Utility", "Transport", "Office Supplies", "Marketing", "Other"];

export default function ExpensePage() {
  const [rows, setRows] = useState(initialRows);
  const [formData, setFormData] = useState({
    name: "",
    head: "",
    method: "",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    remarks: "",
    fileName: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // টুলবার ও পেজিনেশন স্টেট
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // ফিল্টার
  const filteredRows = useMemo(() => {
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.method.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  // পেজিনেশন
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // টোটাল
  const totalExpense = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.amount, 0),
    [filteredRows]
  );

  const thisMonthExpense = useMemo(
    () =>
      rows
        .filter((r) => r.date.includes("02-2025"))
        .reduce((sum, r) => sum + r.amount, 0),
    [rows]
  );

  // হ্যান্ডেল চেঞ্জ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ফাইল হ্যান্ডেল
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, fileName: file.name }));
    }
  };

  // সেভ
  const handleSave = () => {
    if (!formData.name.trim()) return alert("Name is required!");
    if (!formData.head) return alert("Expense Head is required!");
    if (!formData.method) return alert("Payment Method is required!");
    if (!formData.amount || Number(formData.amount) <= 0) return alert("Valid amount is required!");

    if (editingId) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? { ...r, ...formData, amount: Number(formData.amount) }
            : r
        )
      );
      alert("Expense updated successfully!");
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      setRows((prev) => [
        { id: newId, ...formData, amount: Number(formData.amount) },
        ...prev,
      ]);
      alert("Expense added successfully!");
    }

    // রিসেট
    setFormData({
      name: "",
      head: "",
      method: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      remarks: "",
      fileName: "",
    });
    setEditingId(null);
    setCurrentPage(1);
  };

  // এডিট
  const handleEdit = (row: any) => {
    setFormData({
      name: row.name,
      head: row.head,
      method: row.method,
      date: row.date,
      amount: String(row.amount),
      remarks: row.remarks || "",
      fileName: row.fileName || "",
    });
    setEditingId(row.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ডিলিট
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense record?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) handleCancel();
      alert("Expense deleted successfully!");
    }
  };

  // ক্যান্সেল
  const handleCancel = () => {
    setFormData({
      name: "",
      head: "",
      method: "",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      remarks: "",
      fileName: "",
    });
    setEditingId(null);
  };

  // ============ EXPORT ACTIONS ============

  const exportToCSV = (data: any[], filename: string) => {
    const headers = columns.filter((c) => c !== "Action").join(",");
    const csvRows = data.map((r, i) =>
      [i + 1, r.name, r.head, r.method, r.date, r.amount].map((v) => `"${v}"`).join(",")
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
      .map((r, i) => `${i + 1}. ${r.name} | ${r.head} | ${r.method} | ${r.date} | ৳${r.amount}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert(`Copied ${filteredRows.length} record(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(filteredRows, `expense-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };

  const handleCSV = () => {
    exportToCSV(filteredRows, `expense-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };

  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
  };

  // Head Badge Color
  const getHeadBadge = (head: string) => {
    const map: Record<string, string> = {
      "ISP Bill": "bg-red-500/10 text-red-600 border-red-500/20",
      "Maintenance": "bg-amber-500/10 text-amber-600 border-amber-500/20",
      "Rent": "bg-purple-500/10 text-purple-600 border-purple-500/20",
      "Salary": "bg-blue-500/10 text-blue-600 border-blue-500/20",
      "Utility": "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
      "Transport": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      "Office Supplies": "bg-pink-500/10 text-pink-600 border-pink-500/20",
      "Marketing": "bg-orange-500/10 text-orange-600 border-orange-500/20",
    };
    return map[head] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Expense Management
            </h1>
            <div className="flex items-center gap-2 bg-red-500/10 text-red-600 px-4 py-2 rounded-full text-xs font-semibold border border-red-500/20">
              <Receipt className="w-3.5 h-3.5" />
              Total: ৳{totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Total Expense</p>
              </div>
              <p className="font-heading text-2xl font-bold">
                ৳{totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Total Records</p>
              </div>
              <p className="font-heading text-2xl font-bold">{rows.length}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">This Month</p>
              </div>
              <p className="font-heading text-2xl font-bold">
                ৳{thisMonthExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Add / Edit Form */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-red-500 to-amber-500 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <TrendingDown className="w-5 h-5" />
                {editingId ? "Edit Expense" : "Add Expense"}
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
                <Field label="Name" required>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. ZS Cable Network"
                    className="rounded-xl"
                  />
                </Field>
                <Field label="Expense Head" required>
                  <select
                    name="head"
                    value={formData.head}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="">Select Head</option>
                    {expenseHeads.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Payment Method" required>
                  <select
                    name="method"
                    value={formData.method}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="">Select Method</option>
                    {paymentMethods.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <Field label="Date">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                  />
                </Field>
                <Field label="Amount" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="rounded-xl pl-8"
                    />
                  </div>
                </Field>
                <Field label="Attachment">
                  <div className="relative">
                    <input
                      type="file"
                      id="expense-file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    <label
                      htmlFor="expense-file"
                      className="flex items-center gap-2 w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm cursor-pointer hover:bg-muted/60 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-signal" />
                      <span className={cn("truncate", formData.fileName ? "text-foreground font-semibold" : "text-muted-foreground")}>
                        {formData.fileName || "Choose file..."}
                      </span>
                    </label>
                  </div>
                  <p className="text-xs text-signal font-medium mt-1">
                    (PDF, DOC, DOCX, JPG, JPEG, PNG, TXT are allowed)
                  </p>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-5 items-end">
                <Field label="Remarks">
                  <Input
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional note..."
                    className="rounded-xl"
                  />
                </Field>
                <div className="flex gap-3">
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
                    className="rounded-xl font-semibold h-11 px-8 bg-gradient-to-r from-red-500 to-amber-500 border-0"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update Expense" : "Save Expense"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Expense List */}
          <TableToolbar
            title="Expense List"
            searchTerm={searchTerm}
            onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
            onCopy={handleCopy}
            onExcel={handleExcel}
            onCSV={handleCSV}
            onPDF={handlePDF}
          />

          <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    {columns.map((c) => (
                      <th key={c} className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.length > 0 ? (
                    paginatedRows.map((r, i) => (
                      <tr
                        key={r.id}
                        className={cn(
                          "border-t transition-colors",
                          editingId === r.id ? "bg-signal/5" : "hover:bg-muted/30"
                        )}
                      >
                        <td className="px-6 py-4 font-medium">{startIndex + i + 1}</td>
                        <td className="px-6 py-4 font-semibold">{r.name}</td>
                        <td className="px-6 py-4">
                          <span className={cn(
                            "text-xs font-semibold px-2.5 py-1 rounded-md border",
                            getHeadBadge(r.head)
                          )}>
                            {r.head}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2.5 py-1 rounded-md border border-violet-accent/20">
                            {r.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                        <td className="px-6 py-4 font-bold text-red-600">
                          ৳{r.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-16 text-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No expense records found</p>
                        <p className="text-xs mt-1">Try adjusting your search or add a new expense</p>
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
              <span className="font-bold">Tip:</span> Categorize expenses properly (ISP Bill, Salary,
              Rent, etc.) to get accurate financial reports. Upload receipts as attachments for audit
              purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}