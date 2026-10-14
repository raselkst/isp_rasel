"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  ArrowRight, ArrowDownUp, Wallet, TrendingUp, TrendingDown,
  Trash2, Eye, CheckCircle2, AlertCircle, Info, DollarSign,
  Building2, RefreshCw, Send
} from "lucide-react";
import { cn } from "@/lib/utils";

// ডামি অ্যাকাউন্ট ডেটা
const accounts = [
  { id: "cash", label: "Cash", balance: 40100, icon: Wallet },
  { id: "brac", label: "BRAC Bank", balance: 125400.5, icon: Building2 },
  { id: "dbbl", label: "Dutch Bangla", balance: 285600.75, icon: Building2 },
  { id: "ibbl", label: "Islami Bank", balance: 42350.0, icon: Building2 },
  { id: "city", label: "City Bank", balance: 550000.0, icon: Building2 },
];

// ডামি ট্রান্সফার ডেটা
const initialTransfers = [
  { id: 1, date: "2025-09-24", purpose: "Office Rent Payment", amount: 15000, from: "brac", to: "cash", status: "Completed" },
  { id: 2, date: "2025-09-23", purpose: "Staff Salary", amount: 45000, from: "dbbl", to: "cash", status: "Completed" },
  { id: 3, date: "2025-09-22", purpose: "ISP Bill Payment", amount: 25000, from: "ibbl", to: "brac", status: "Completed" },
  { id: 4, date: "2025-09-20", purpose: "Cash Deposit", amount: 50000, from: "cash", to: "dbbl", status: "Completed" },
  { id: 5, date: "2025-09-18", purpose: "Equipment Purchase", amount: 8500, from: "city", to: "cash", status: "Pending" },
];

const columns = ["Date", "Purpose", "Amount", "From", "To", "Status", "Action"];

export default function FundTransferPage() {
  const [transfers, setTransfers] = useState(initialTransfers);
  const [formData, setFormData] = useState({
    amount: "",
    from: "cash",
    to: "brac",
    purpose: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTransfers = useMemo(() => {
    return transfers.filter(
      (t) =>
        t.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAccountLabel(t.from).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAccountLabel(t.to).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transfers, searchTerm]);

  const totalPages = Math.ceil(filteredTransfers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTransfers = filteredTransfers.slice(startIndex, startIndex + rowsPerPage);

  const stats = useMemo(() => {
    const totalAmount = transfers.reduce((s, t) => s + t.amount, 0);
    const cashIn = transfers.filter((t) => t.to === "cash").reduce((s, t) => s + t.amount, 0);
    const cashOut = transfers.filter((t) => t.from === "cash").reduce((s, t) => s + t.amount, 0);
    return { total: transfers.length, totalAmount, cashIn, cashOut };
  }, [transfers]);

  function getAccountLabel(id: string) {
    return accounts.find((a) => a.id === id)?.label || id;
  }
  function getAccountBalance(id: string) {
    return accounts.find((a) => a.id === id)?.balance || 0;
  }
  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validation = useMemo(() => {
    const amount = Number(formData.amount) || 0;
    const fromBalance = getAccountBalance(formData.from);
    return {
      isSameAccount: formData.from === formData.to,
      insufficientBalance: amount > fromBalance,
      isValid: amount > 0 && formData.from !== formData.to && amount <= fromBalance,
      fromBalance,
      amount,
      afterBalance: fromBalance - amount,
    };
  }, [formData]);

  const handleSave = () => {
    if (!formData.purpose.trim()) return alert("Purpose is required!");
    if (!formData.amount || Number(formData.amount) <= 0) return alert("Valid amount is required!");
    if (formData.from === formData.to) return alert("From and To accounts cannot be the same!");

    const amount = Number(formData.amount);
    const fromBalance = getAccountBalance(formData.from);

    if (amount > fromBalance) {
      return alert(
        `Insufficient balance!\n\nAccount: ${getAccountLabel(formData.from)}\nAvailable: ৳${formatCurrency(fromBalance)}\nRequired: ৳${formatCurrency(amount)}`
      );
    }

    const newId = Math.max(...transfers.map((t) => t.id), 0) + 1;
    const newTransfer = {
      id: newId,
      date: formData.date,
      purpose: formData.purpose,
      amount,
      from: formData.from,
      to: formData.to,
      status: "Completed",
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    alert(
      `Transfer Successful!\n\nFrom: ${getAccountLabel(formData.from)}\nTo: ${getAccountLabel(formData.to)}\nAmount: ৳${formatCurrency(amount)}\nPurpose: ${formData.purpose}`
    );

    setFormData({
      amount: "",
      from: "cash",
      to: "brac",
      purpose: "",
      date: new Date().toISOString().split("T")[0],
    });
    setCurrentPage(1);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this transfer record? This cannot be undone.")) {
      setTransfers((prev) => prev.filter((t) => t.id !== id));
      alert("Transfer record deleted.");
    }
  };

  const handleView = (t: any) => {
    alert(
      `Transfer Details:\n\nDate: ${t.date}\nPurpose: ${t.purpose}\nAmount: ৳${formatCurrency(t.amount)}\nFrom: ${getAccountLabel(t.from)}\nTo: ${getAccountLabel(t.to)}\nStatus: ${t.status}`
    );
  };

  const exportToCSV = (filename: string) => {
    const headers = "Date,Purpose,Amount,From,To,Status";
    const rows = filteredTransfers.map(
      (t) =>
        `"${t.date}","${t.purpose}",${t.amount},"${getAccountLabel(t.from)}","${getAccountLabel(t.to)}","${t.status}"`
    );
    const csv = [headers, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = filteredTransfers
      .map((t) => `${t.date} | ${t.purpose} | ৳${t.amount} | ${getAccountLabel(t.from)} → ${getAccountLabel(t.to)}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert(`Copied ${filteredTransfers.length} record(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(`fund-transfers-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };
  const handleCSV = () => {
    exportToCSV(`fund-transfers-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };
  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
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
                Fund Transfer
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Move money between cash and bank accounts securely.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-signal-tint text-signal px-4 py-2 rounded-full text-xs font-semibold border border-signal/20">
              <ArrowDownUp className="w-3.5 h-3.5" />
              {stats.total} Transfers
            </div>
          </div>

          {/* Compact Stat Cards — Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <ArrowDownUp className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Transfers</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Amount</p>
                <p className="text-lg font-heading font-bold text-violet-accent">৳{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Cash In</p>
                <p className="text-lg font-heading font-bold text-success">৳{formatCurrency(stats.cashIn)}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Cash Out</p>
                <p className="text-lg font-heading font-bold text-destructive">৳{formatCurrency(stats.cashOut)}</p>
              </div>
            </div>
          </div>

          {/* Transfer Form */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
            <div className="bg-signal text-white px-6 py-4 flex items-center gap-2">
              <Send className="w-5 h-5" />
              <h2 className="font-heading font-bold text-lg">New Transfer</h2>
            </div>

            <div className="p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                <Field label="Date">
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </Field>
                <Field label="Amount" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">৳</span>
                    <Input
                      name="amount"
                      type="number"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="rounded-xl pl-8 border-slate-200 text-signal"
                    />
                  </div>
                </Field>
                <Field label="Purpose" required>
                  <Input
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    placeholder="e.g. Office Rent Payment"
                    className="rounded-xl border-slate-200 text-signal"
                  />
                </Field>
                <div />
              </div>

              {/* From / To */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-end">
                <Field label="From (Source)" required>
                  <select
                    name="from"
                    value={formData.from}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — ৳{formatCurrency(a.balance)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Available: <span className="font-semibold text-success">
                      ৳{formatCurrency(validation.fromBalance)}
                    </span>
                  </p>
                </Field>

                <div className="flex justify-center pb-6">
                  <div className="w-12 h-12 rounded-full bg-signal text-white flex items-center justify-center shadow-lg">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>

                <Field label="To (Destination)" required>
                  <select
                    name="to"
                    value={formData.to}
                    onChange={handleChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.label} — ৳{formatCurrency(a.balance)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Will receive: <span className="font-semibold text-signal">
                      ৳{formatCurrency(validation.amount)}
                    </span>
                  </p>
                </Field>
              </div>

              {/* Live Preview */}
              {formData.amount && Number(formData.amount) > 0 && (
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-2xl border animate-in fade-in slide-in-from-top-2 duration-300",
                    validation.isValid
                      ? "bg-success-tint border-success/30"
                      : "bg-destructive/10 border-destructive/30"
                  )}
                >
                  {validation.isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 text-sm">
                    {validation.isSameAccount ? (
                      <p className="text-destructive font-semibold">
                        ❌ From and To accounts cannot be the same!
                      </p>
                    ) : validation.insufficientBalance ? (
                      <p className="text-destructive font-semibold">
                        ❌ Insufficient balance! Available: ৳{formatCurrency(validation.fromBalance)}
                      </p>
                    ) : (
                      <div className="text-success">
                        <p className="font-semibold">✓ Transfer is valid</p>
                        <p className="text-xs mt-0.5">
                          {getAccountLabel(formData.from)} balance after transfer:{" "}
                          <span className="font-bold">৳{formatCurrency(validation.afterBalance)}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({
                    amount: "", from: "cash", to: "brac", purpose: "",
                    date: new Date().toISOString().split("T")[0],
                  })}
                  className="rounded-xl font-semibold h-11 px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!validation.isValid && formData.amount !== ""}
                  className="rounded-xl font-semibold h-11 px-8 bg-signal text-white hover:bg-signal-hover border-0 disabled:opacity-50 shadow-md"
                >
                  <Send className="w-4 h-4 mr-2" /> Confirm Transfer
                </Button>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <TableToolbar
            title="Transfer History"
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
              <table className="w-full text-sm min-w-[900px]">
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
                  {paginatedTransfers.length > 0 ? (
                    paginatedTransfers.map((t) => (
                      <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{t.date}</td>
                        <td className="px-5 py-4 font-semibold text-signal">{t.purpose}</td>
                        <td className="px-5 py-4 font-bold text-signal">
                          ৳{formatCurrency(t.amount)}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-destructive/10 text-destructive text-xs font-semibold px-2.5 py-1 rounded-md border border-destructive/30">
                            <TrendingDown className="w-3 h-3" />
                            {getAccountLabel(t.from)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 bg-success-tint text-success text-xs font-semibold px-2.5 py-1 rounded-md border border-success/30">
                            <TrendingUp className="w-3 h-3" />
                            {getAccountLabel(t.to)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
                              t.status === "Completed"
                                ? "bg-success-tint text-success border-success/30"
                                : "bg-warning-tint text-warning border-warning/30"
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", t.status === "Completed" ? "bg-success" : "bg-warning")} />
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(t)}
                              className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center hover:bg-signal/20 transition-colors"
                              title="View"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(t.id)}
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
                        <p className="font-semibold text-signal">No transfer records found</p>
                        <p className="text-xs mt-1">Try adjusting your search</p>
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
              totalItems={filteredTransfers.length}
              startIndex={startIndex}
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/20 mt-6">
            <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Tip:</span> Transfers are instant. The system validates that
              the source account has sufficient balance and that From/To accounts are different before
              processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}