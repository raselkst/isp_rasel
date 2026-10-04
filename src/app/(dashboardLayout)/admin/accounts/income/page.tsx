"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  Pencil, Trash2, Plus, X, Save, Upload, FileText, TrendingUp,
  Wallet, DollarSign, Calendar, AlertCircle, CheckCircle2, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = ["SL", "Name", "Payment Method", "Date", "A/C Head", "Amount", "Action"];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRows = [
  { id: 1, name: "ZS Cable Network (ZSCN)", method: "Cash", date: "24-02-2025", acHead: "Service Income", amount: 6000.0, remarks: "Monthly subscription", fileName: "" },
  { id: 2, name: "Poli Network Pop", method: "bKash", date: "22-02-2025", acHead: "Recharge Income", amount: 45000.0, remarks: "Bulk recharge", fileName: "" },
  { id: 3, name: "AR Internet", method: "Bank Transfer", date: "20-02-2025", acHead: "Installation Fee", amount: 3500.0, remarks: "New connection", fileName: "" },
  { id: 4, name: "Online Network", method: "Cash", date: "18-02-2025", acHead: "Service Income", amount: 12000.0, remarks: "Quarterly payment", fileName: "" },
  { id: 5, name: "Akas Cable Network", method: "Nagad", date: "15-02-2025", acHead: "Late Fee", amount: 850.0, remarks: "Late payment penalty", fileName: "" },
];

const paymentMethods = ["Cash", "bKash", "Nagad", "Rocket", "Bank Transfer", "Card"];
const acHeads = ["Service Income", "Recharge Income", "Installation Fee", "Late Fee", "Other Income"];

export default function IncomePage() {
  const [rows, setRows] = useState(initialRows);
  const [formData, setFormData] = useState({
    name: "",
    acHead: "",
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
        r.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.acHead.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rows, searchTerm]);

  // পেজিনেশন
  const totalPages = Math.ceil(filteredRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = filteredRows.slice(startIndex, startIndex + rowsPerPage);

  // টোটাল
  const totalIncome = useMemo(
    () => filteredRows.reduce((sum, r) => sum + r.amount, 0),
    [filteredRows]
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
    if (!formData.acHead) return alert("A/C Head is required!");
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
      alert("Income updated successfully!");
    } else {
      const newId = Math.max(...rows.map((r) => r.id), 0) + 1;
      setRows((prev) => [
        { id: newId, ...formData, amount: Number(formData.amount) },
        ...prev,
      ]);
      alert("Income added successfully!");
    }

    // রিসেট
    setFormData({
      name: "",
      acHead: "",
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
      acHead: row.acHead,
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
    if (confirm("Are you sure you want to delete this income record?")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (editingId === id) handleCancel();
      alert("Income deleted successfully!");
    }
  };

  // ক্যান্সেল
  const handleCancel = () => {
    setFormData({
      name: "",
      acHead: "",
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
      [i + 1, r.name, r.method, r.date, r.acHead, r.amount].map((v) => `"${v}"`).join(",")
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
      .map((r, i) => `${i + 1}. ${r.name} | ${r.method} | ${r.date} | ${r.acHead} | ৳${r.amount}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert(`Copied ${filteredRows.length} record(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(filteredRows, `income-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };

  const handleCSV = () => {
    exportToCSV(filteredRows, `income-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };

  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Income Management
            </h1>
            <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-full text-xs font-semibold border border-emerald-500/20">
              <Wallet className="w-3.5 h-3.5" />
              Total: ৳{totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5" />
                <p className="text-xs font-semibold uppercase opacity-90">Total Income</p>
              </div>
              <p className="font-heading text-2xl font-bold">
                ৳{totalIncome.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
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
                ৳{rows
                  .filter((r) => r.date.includes("02-2025"))
                  .reduce((s, r) => s + r.amount, 0)
                  .toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Add / Edit Form */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-signal to-violet-accent text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-heading font-bold text-lg">
                {editingId ? "Edit Income" : "Add Income"}
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
                <Field label="A/C Head" required>
                  <select
                    name="acHead"
                    value={formData.acHead}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="">Select A/C Head</option>
                    {acHeads.map((h) => (
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
                      id="income-file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                    />
                    <label
                      htmlFor="income-file"
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
                    className="rounded-xl font-semibold h-11 px-8 bg-gradient-to-r from-signal to-violet-accent border-0"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? "Update Income" : "Save Income"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Income List */}
          <TableToolbar
            title="Income List"
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
                          <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2.5 py-1 rounded-md border border-violet-accent/20">
                            {r.method}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                        <td className="px-6 py-4">
                          <span className="bg-signal/10 text-signal text-xs font-semibold px-2.5 py-1 rounded-md border border-signal/20">
                            {r.acHead}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-600">
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
                        <p className="font-semibold">No income records found</p>
                        <p className="text-xs mt-1">Try adjusting your search or add a new income</p>
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
              <span className="font-bold">Tip:</span> Use the attachment field to upload invoices or
              receipts. Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, TXT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}