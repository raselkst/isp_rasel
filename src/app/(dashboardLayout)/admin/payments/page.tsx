"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Wallet, CreditCard, Smartphone, Building2, X, CheckCircle2,
  AlertCircle, Search, Download, RefreshCw, TrendingUp, TrendingDown,
  Clock, DollarSign, Receipt, Filter, ArrowUpDown, ChevronLeft,
  ChevronRight, ArrowRight, User, Calendar, Percent, Send, BadgeCheck, Hash,
  Plus, Eye, RotateCcw
} from "lucide-react";

// 🎯 ডামি পেমেন্ট ডেটা
interface PaymentData {
  id: string;
  client: string;
  clientId: string;
  amount: number;
  method: "Cash" | "bKash" | "Nagad" | "Rocket" | "Bank";
  status: "Success" | "Pending" | "Failed";
  date: string;
  reference: string;
  collectedBy: string;
}

const initialPayments: PaymentData[] = [
  { id: "PAY-5001", client: "Rahim Uddin", clientId: "C-101", amount: 490, method: "bKash", status: "Success", date: "2025-09-27 10:30", reference: "TRX8H9K2L", collectedBy: "Admin" },
  { id: "PAY-5002", client: "Karim Ali", clientId: "C-102", amount: 588, method: "Cash", status: "Success", date: "2025-09-27 10:15", reference: "CASH-001", collectedBy: "NSP" },
  { id: "PAY-5003", client: "Jamal Hossain", clientId: "C-103", amount: 700, method: "Nagad", status: "Success", date: "2025-09-27 09:55", reference: "NGD7M3P1Q", collectedBy: "Admin" },
  { id: "PAY-5004", client: "Sultana Begum", clientId: "C-104", amount: 490, method: "Rocket", status: "Pending", date: "2025-09-27 09:40", reference: "RKT2X8Y4Z", collectedBy: "Support A" },
  { id: "PAY-5005", client: "Rafiq Islam", clientId: "C-105", amount: 588, method: "Cash", status: "Success", date: "2025-09-27 09:20", reference: "CASH-002", collectedBy: "Admin" },
  { id: "PAY-5006", client: "Nasir Ahmed", clientId: "C-106", amount: 1200, method: "Bank", status: "Failed", date: "2025-09-27 08:50", reference: "BNK5J6K7L", collectedBy: "NSP" },
  { id: "PAY-5007", client: "Tariqul Islam", clientId: "C-107", amount: 2500, method: "bKash", status: "Success", date: "2025-09-27 08:30", reference: "TRX9L0M1N", collectedBy: "Admin" },
  { id: "PAY-5008", client: "Sabbir Ahmed", clientId: "C-108", amount: 490, method: "Nagad", status: "Success", date: "2025-09-26 22:10", reference: "NGD3P4Q5R", collectedBy: "Support B" },
];

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Wallet, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { id: "bkash", label: "bKash", icon: Smartphone, color: "text-pink-600 bg-pink-500/10 border-pink-500/20" },
  { id: "nagad", label: "Nagad", icon: Smartphone, color: "text-orange-600 bg-orange-500/10 border-orange-500/20" },
  { id: "rocket", label: "Rocket", icon: Smartphone, color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
  { id: "bank", label: "Bank", icon: Building2, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
];

const statusColors: Record<string, string> = {
  Success: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Failed: "bg-red-500/10 text-red-600 border-red-500/20",
};

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState(initialPayments);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"select-method" | "details" | "confirm" | "success">("select-method");
  const [method, setMethod] = useState("cash");
  const [formData, setFormData] = useState({
    client: "",
    clientId: "",
    amount: 0,
    reference: "",
    remarks: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Stat Cards
  const stats = useMemo(() => {
    const total = payments.filter(p => p.status === "Success").reduce((a, b) => a + b.amount, 0);
    const today = payments
      .filter(p => p.status === "Success" && p.date.startsWith("2025-09-27"))
      .reduce((a, b) => a + b.amount, 0);
    const pending = payments.filter(p => p.status === "Pending").length;
    const failed = payments.filter(p => p.status === "Failed").length;
    return { total, today, pending, failed };
  }, [payments]);

  // Filter + Search + Sort
  const filteredPayments = useMemo(() => {
    let filtered = payments.filter(p => {
      const matchesSearch =
        p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.reference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      const matchesMethod = methodFilter === "All" || p.method === methodFilter;
      return matchesSearch && matchesStatus && matchesMethod;
    });

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
  }, [payments, searchTerm, statusFilter, methodFilter, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  // Payment Flow
  const handleOpen = () => {
    setStep("select-method");
    setMethod("cash");
    setFormData({ client: "", clientId: "", amount: 0, reference: "", remarks: "" });
    setOpen(true);
  };

  const handleSelectMethod = (m: string) => {
    setMethod(m);
    setStep("details");
  };

  const handleConfirmDetails = () => {
    if (!formData.client.trim() || formData.amount <= 0) {
      alert("Please fill in client name and amount.");
      return;
    }
    setStep("confirm");
  };

  const handleSubmitPayment = () => {
    const newPayment: PaymentData = {
      id: `PAY-${5009 + payments.length}`,
      client: formData.client,
      clientId: formData.clientId || "N/A",
      amount: formData.amount,
      method: paymentMethods.find(p => p.id === method)?.label as any || "Cash",
      status: "Success",
      date: new Date().toISOString().slice(0, 16).replace("T", " "),
      reference: formData.reference || `REF-${Date.now()}`,
      collectedBy: "Admin",
    };
    setPayments(prev => [newPayment, ...prev]);
    setStep("success");
  };

  const handleClose = () => {
    setOpen(false);
    setStep("select-method");
  };

  // Refund
  const handleRefund = (id: string) => {
    if (confirm(`Refund payment ${id}? This will mark the transaction as refunded.`)) {
      setPayments(prev =>
        prev.map(p => p.id === id ? { ...p, status: "Failed", remarks: "Refunded" } as any : p)
      );
      alert("Refund processed successfully!");
    }
  };

  // View Details
  const handleView = (p: PaymentData) => {
    alert(
      `Payment Details:\n\nID: ${p.id}\nClient: ${p.client} (${p.clientId})\nAmount: ৳${p.amount}\nMethod: ${p.method}\nStatus: ${p.status}\nReference: ${p.reference}\nDate: ${p.date}\nCollected By: ${p.collectedBy}`
    );
  };

  // Export
  const handleExport = () => {
    const headers = "ID,Client,Client ID,Amount,Method,Status,Date,Reference,Collected By";
    const csvRows = filteredPayments.map(p =>
      `"${p.id}","${p.client}","${p.clientId}",${p.amount},"${p.method}","${p.status}","${p.date}","${p.reference}","${p.collectedBy}"`
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${filteredPayments.length} payment(s) to CSV.`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setMethodFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
                Finance
              </p>
              <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Payments
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track all incoming payments and manage transactions.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
              >
                <Download className="h-4 w-4" /> Export
              </button>
              <button
                onClick={handleOpen}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> New Payment
              </button>
            </div>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">
                  ৳{stats.total.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Today</p>
                <p className="text-lg font-heading font-bold text-emerald-600">
                  ৳{stats.today.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Pending</p>
                <p className="text-lg font-heading font-bold text-amber-600">{stats.pending}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Failed</p>
                <p className="text-lg font-heading font-bold text-red-600">{stats.failed}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by client, payment ID or reference…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm font-semibold focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => { setMethodFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm font-semibold focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="All">All Methods</option>
              <option value="Cash">Cash</option>
              <option value="bKash">bKash</option>
              <option value="Nagad">Nagad</option>
              <option value="Rocket">Rocket</option>
              <option value="Bank">Bank</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-background text-muted-foreground text-sm font-semibold hover:bg-muted transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Sort Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border rounded-lg px-2 py-1 bg-background text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {filteredPayments.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, filteredPayments.length)} of {filteredPayments.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Sort:</span>
              {[
                { key: "date", label: "Date" },
                { key: "amount", label: "Amount" },
                { key: "client", label: "Client" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key
                      ? "bg-signal text-white border-signal"
                      : "bg-background text-muted-foreground border-border hover:border-signal/50"
                  )}
                >
                  {s.label}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          {filteredPayments.length > 0 ? (
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1100px]">
                  <thead>
                    <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                      {["Payment ID", "Client", "Amount", "Method", "Status", "Reference", "Date", "Collected By", "Actions"].map((c) => (
                        <th key={c} className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((p) => (
                      <tr key={p.id} className="border-t hover:bg-muted/40 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs font-semibold">{p.id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold">{p.client}</p>
                            <p className="text-[10px] text-muted-foreground">{p.clientId}</p>
                          </div>
                        </td>
                        <td className="px-5 py-4 font-heading font-bold text-signal">
                          ৳{p.amount.toLocaleString()}
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                            {p.method === "Cash" && <Wallet className="w-3 h-3 text-emerald-600" />}
                            {p.method === "bKash" && <Smartphone className="w-3 h-3 text-pink-600" />}
                            {p.method === "Nagad" && <Smartphone className="w-3 h-3 text-orange-600" />}
                            {p.method === "Rocket" && <Smartphone className="w-3 h-3 text-purple-600" />}
                            {p.method === "Bank" && <Building2 className="w-3 h-3 text-blue-600" />}
                            {p.method}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border",
                            statusColors[p.status]
                          )}>
                            {p.status === "Success" && <CheckCircle2 className="w-3 h-3" />}
                            {p.status === "Pending" && <Clock className="w-3 h-3" />}
                            {p.status === "Failed" && <AlertCircle className="w-3 h-3" />}
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{p.reference}</td>
                        <td className="px-5 py-4 text-xs text-muted-foreground whitespace-nowrap">{p.date}</td>
                        <td className="px-5 py-4 text-xs">{p.collectedBy}</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleView(p)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {p.status === "Success" && (
                              <button
                                onClick={() => handleRefund(p.id)}
                                className="p-2 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-colors"
                                title="Refund"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
                <div className="text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all",
                          currentPage === page
                            ? "bg-signal text-white shadow-md"
                            : "border bg-card hover:bg-muted"
                        )}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-dashed p-16 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center mb-4">
                <Receipt className="h-8 w-8 text-signal" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1">No payments found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-5">
                {searchTerm || statusFilter !== "All" || methodFilter !== "All"
                  ? "Try adjusting your search or filters."
                  : "Create your first payment to get started."}
              </p>
              <button
                onClick={handleOpen}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> New Payment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============ PAYMENT MODAL ============ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={handleClose} />
          <div className="relative bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading font-bold text-sm">PAYMENTS</span>
                </div>
                <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                  {step === "select-method" && "Select Payment Method"}
                  {step === "details" && "Payment Details"}
                  {step === "confirm" && "Confirm Payment"}
                  {step === "success" && "Payment Successful"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {step === "select-method" && "Choose how you want to receive the payment."}
                  {step === "details" && "Enter client and payment information."}
                  {step === "confirm" && "Review the details before submitting."}
                  {step === "success" && "Transaction completed successfully!"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step Indicator */}
            {step !== "success" && (
              <div className="flex items-center gap-2 mb-6">
                {["Method", "Details", "Confirm"].map((s, i) => {
                  const stepMap = { "select-method": 0, "details": 1, "confirm": 2, "success": 3 };
                  const currentIdx = stepMap[step];
                  const isActive = i === currentIdx;
                  const isDone = i < currentIdx;
                  return (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                        isDone ? "bg-emerald-500 text-white" :
                        isActive ? "bg-signal text-white shadow-md" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={cn(
                        "text-xs font-semibold whitespace-nowrap",
                        isActive ? "text-signal" : "text-muted-foreground"
                      )}>{s}</span>
                      {i < 2 && <div className={cn("flex-1 h-0.5", isDone ? "bg-emerald-500" : "bg-muted")} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 1: Select Method */}
            {step === "select-method" && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Select the payment method used by the client:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {paymentMethods.map((m) => {
                    const Icon = m.icon;
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMethod(m.id)}
                        className={cn(
                          "flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all hover:shadow-lg hover:-translate-y-0.5",
                          "bg-card border-border hover:border-signal/50"
                        )}
                      >
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", m.color)}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-sm">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Details */}
            {step === "details" && (
              <div className="space-y-5">
                <div className="bg-signal/5 rounded-xl p-3 flex items-center gap-2 border border-signal/20">
                  {(() => {
                    const m = paymentMethods.find(pm => pm.id === method);
                    const Icon = m?.icon || Wallet;
                    return (
                      <>
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", m?.color)}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-sm">
                          Payment via <span className="text-signal">{m?.label}</span>
                        </span>
                      </>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block">
                      Client Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        placeholder="e.g. Rahim Uddin"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block">Client ID</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        value={formData.clientId}
                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                        placeholder="e.g. C-101"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block">
                      Amount (৳) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-signal/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block">Reference / TrxID</label>
                    <input
                      value={formData.reference}
                      onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                      placeholder="e.g. TRX8H9K2L"
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    rows={2}
                    placeholder="Optional notes..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep("select-method")}
                    className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirmDetails}
                    className="flex-[2] rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Review <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Confirm */}
            {step === "confirm" && (
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-signal-tint/60 to-violet-accent-tint/60 rounded-2xl border border-signal/20 p-5">
                  <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-3">Payment Summary</p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Client</span>
                      <span className="font-semibold">{formData.client}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Method</span>
                      <span className="font-semibold capitalize">{paymentMethods.find(pm => pm.id === method)?.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reference</span>
                      <span className="font-mono text-sm">{formData.reference || "Auto-generated"}</span>
                    </div>
                    <div className="border-t border-signal/20 pt-3 flex justify-between items-baseline">
                      <span className="font-semibold">Total Amount</span>
                      <span className="font-heading text-2xl font-bold text-signal">৳{formData.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setStep("details")}
                    className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    className="flex-[2] rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <BadgeCheck className="w-4 h-4" /> Confirm Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Success */}
            {step === "success" && (
              <div className="text-center py-4">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="relative w-full h-full rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold mb-1">Payment Received!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Transaction has been saved to the payment history.
                </p>

                <div className="bg-gradient-to-br from-signal-tint/60 to-violet-accent-tint/60 rounded-2xl border border-signal/20 p-5 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Client</p>
                      <p className="font-semibold">{formData.client}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Amount</p>
                      <p className="font-bold text-signal">৳{formData.amount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Method</p>
                      <p className="font-semibold capitalize">{paymentMethods.find(pm => pm.id === method)?.label}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Reference</p>
                      <p className="font-mono text-xs">{formData.reference || "Auto-generated"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setStep("select-method");
                      setMethod("cash");
                      setFormData({ client: "", clientId: "", amount: 0, reference: "", remarks: "" });
                    }}
                    className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> New Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}