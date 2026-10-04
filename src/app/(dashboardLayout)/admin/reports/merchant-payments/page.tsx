"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Wallet,
  CheckCircle2,
  Flame,
  Send,
  Filter,
  Plus,
  PiggyBank,
  Search,
  Download,
  MoreVertical,
  Eye,
  Clock,
  XCircle,
  TrendingUp,
  CreditCard,
  Smartphone,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Receipt,
  Users,
  DollarSign,
  BarChart3,
  Zap,
  X,
  FileText,
  FileSpreadsheet,
  FileJson,
  Calendar,
} from "lucide-react";

// 🎯 পেমেন্ট ডেটা টাইপ
interface Payment {
  id: number;
  invoiceId: string;
  payeeName: string;
  payeeMobile: string;
  payType: "Nagad" | "Bkash" | "Card" | "Rocket";
  reqTime: string;
  payTime: string;
  status: "Success" | "Pending" | "Failed";
  total: number;
  bankTxn: string;
  gateway: string;
}

// 🎯 ডামি ডেটা
const initialPayments: Payment[] = [
  { id: 1, invoiceId: "INV-872193", payeeName: "Rahim Uddin", payeeMobile: "01710626699", payType: "Bkash", reqTime: "Jan 27, 10:15 AM", payTime: "Jan 27, 10:16 AM", status: "Success", total: 1000, bankTxn: "TXN-9921", gateway: "bKash Gateway" },
  { id: 2, invoiceId: "INV-872194", payeeName: "Karim Ali", payeeMobile: "01711223344", payType: "Nagad", reqTime: "Jan 26, 03:20 PM", payTime: "Jan 26, 03:21 PM", status: "Success", total: 1500, bankTxn: "TXN-9922", gateway: "Nagad Gateway" },
  { id: 3, invoiceId: "INV-872195", payeeName: "Jamal Hossain", payeeMobile: "01711556677", payType: "Card", reqTime: "Jan 25, 09:45 AM", payTime: "—", status: "Pending", total: 2000, bankTxn: "TXN-9923", gateway: "SSLCommerz" },
  { id: 4, invoiceId: "INV-872196", payeeName: "Sultana Begum", payeeMobile: "01711889900", payType: "Bkash", reqTime: "Jan 24, 05:30 PM", payTime: "—", status: "Failed", total: 800, bankTxn: "TXN-9924", gateway: "bKash Gateway" },
  { id: 5, invoiceId: "INV-872197", payeeName: "Rafiq Islam", payeeMobile: "01711334455", payType: "Nagad", reqTime: "Jan 23, 11:00 AM", payTime: "Jan 23, 11:01 AM", status: "Success", total: 1200, bankTxn: "TXN-9925", gateway: "Nagad Gateway" },
];

// 🎯 পেমেন্ট মেথড কনফিগ
const payTypeConfig: Record<string, { color: string; bg: string; icon: any; gradient: string }> = {
  Bkash: { color: "text-pink-600", bg: "bg-pink-500/10", icon: Smartphone, gradient: "from-pink-500 to-rose-500" },
  Nagad: { color: "text-orange-600", bg: "bg-orange-500/10", icon: Flame, gradient: "from-orange-500 to-amber-500" },
  Card: { color: "text-blue-600", bg: "bg-blue-500/10", icon: CreditCard, gradient: "from-blue-500 to-cyan-500" },
  Rocket: { color: "text-violet-600", bg: "bg-violet-500/10", icon: Zap, gradient: "from-violet-500 to-purple-500" },
};

// 🎯 স্টেটাস কনফিগ
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  Success: { color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 },
  Pending: { color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
  Failed: { color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle },
};

export default function MerchantPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [activeTab, setActiveTab] = useState<"All" | "Success" | "Pending" | "Failed">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // 🎯 Export মেনু বাইরে ক্লিক করলে বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎯 স্ট্যাট ক্যালকুলেশন
  const stats = useMemo(() => {
    const total = payments.reduce((acc, p) => acc + p.total, 0);
    const success = payments.filter(p => p.status === "Success").reduce((acc, p) => acc + p.total, 0);
    const nagad = payments.filter(p => p.payType === "Nagad").reduce((acc, p) => acc + p.total, 0);
    const bkash = payments.filter(p => p.payType === "Bkash").reduce((acc, p) => acc + p.total, 0);
    const successCount = payments.filter(p => p.status === "Success").length;
    const pendingCount = payments.filter(p => p.status === "Pending").length;
    const failedCount = payments.filter(p => p.status === "Failed").length;
    return { total, success, nagad, bkash, successCount, pendingCount, failedCount };
  }, [payments]);

  // 🎯 ফিল্টার
  const filteredPayments = useMemo(() => {
    let result = payments;
    if (activeTab !== "All") result = result.filter(p => p.status === activeTab);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.invoiceId.toLowerCase().includes(q) ||
        p.payeeName.toLowerCase().includes(q) ||
        p.payeeMobile.includes(q) ||
        p.payType.toLowerCase().includes(q)
      );
    }
    return result;
  }, [payments, activeTab, searchTerm]);

  // 🎯 ডিস্ট্রিবিউশন
  const totalForBar = stats.bkash + stats.nagad + (stats.total - stats.bkash - stats.nagad) || 1;
  const bkashPercent = Math.round((stats.bkash / totalForBar) * 100);
  const nagadPercent = Math.round((stats.nagad / totalForBar) * 100);
  const otherPercent = 100 - bkashPercent - nagadPercent;

  // 🎯 Tabs
  const tabs = [
    { key: "All", label: "All", count: payments.length },
    { key: "Success", label: "Success", count: stats.successCount },
    { key: "Pending", label: "Pending", count: stats.pendingCount },
    { key: "Failed", label: "Failed", count: stats.failedCount },
  ];

  // 🎯 ================== Export Functions ==================
  const exportAsCSV = () => {
    const headers = ["Invoice ID", "Payee Name", "Payee Mobile", "Pay Type", "Req. Time", "Pay Time", "Status", "Total", "Bank Txn", "Gateway"];
    const csvRows = filteredPayments.map(p => [
      p.invoiceId, p.payeeName, p.payeeMobile, p.payType, p.reqTime, p.payTime, p.status, p.total, p.bankTxn, p.gateway
    ]);
    const csv = [headers, ...csvRows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    downloadFile(csv, `merchant-payments-${Date.now()}.csv`, "text/csv");
  };

  const exportAsJSON = () => {
    const json = JSON.stringify(filteredPayments, null, 2);
    downloadFile(json, `merchant-payments-${Date.now()}.json`, "application/json");
  };

  const exportAsExcel = () => {
    // Excel-friendly tab-separated format
    const headers = ["Invoice ID", "Payee Name", "Payee Mobile", "Pay Type", "Req. Time", "Pay Time", "Status", "Total", "Bank Txn", "Gateway"];
    const tsvRows = filteredPayments.map(p => [
      p.invoiceId, p.payeeName, p.payeeMobile, p.payType, p.reqTime, p.payTime, p.status, p.total, p.bankTxn, p.gateway
    ]);
    const tsv = [headers, ...tsvRows].map(row => row.join("\t")).join("\n");
    downloadFile(tsv, `merchant-payments-${Date.now()}.xls`, "application/vnd.ms-excel");
  };

  const exportAsPDF = () => {
    // Simple print-to-PDF approach
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html>
        <head>
          <title>Merchant Payments Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #0F8B8D; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
            th { background: #0F8B8D; color: white; }
            tr:nth-child(even) { background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Merchant Payments Report</h1>
          <p>Generated: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr><th>Invoice ID</th><th>Payee</th><th>Mobile</th><th>Type</th><th>Status</th><th>Total</th><th>Gateway</th></tr>
            </thead>
            <tbody>
              ${filteredPayments.map(p => `<tr><td>${p.invoiceId}</td><td>${p.payeeName}</td><td>${p.payeeMobile}</td><td>${p.payType}</td><td>${p.status}</td><td>৳${p.total}</td><td>${p.gateway}</td></tr>`).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🎯 Add Payment Handler
  const handleAddPayment = (newPayment: Omit<Payment, "id">) => {
    const payment: Payment = {
      ...newPayment,
      id: Math.max(...payments.map(p => p.id), 0) + 1,
    };
    setPayments([payment, ...payments]);
    setAddModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <DollarSign className="h-3 w-3" />
              Financial Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Merchant Payments
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track all your merchant transactions in real-time.
            </p>
          </div>

         {/* Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
      <Wallet className="w-4 h-4 text-signal" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Today</p>
      <p className="text-lg font-heading font-bold text-signal">৳{stats.total.toLocaleString()}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Success</p>
      <p className="text-lg font-heading font-bold text-emerald-600">৳{stats.success.toLocaleString()}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
      <Flame className="w-4 h-4 text-orange-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Nagad</p>
      <p className="text-lg font-heading font-bold text-orange-600">৳{stats.nagad.toLocaleString()}</p>
    </div>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-pink-500/10 flex items-center justify-center shrink-0">
      <Send className="w-4 h-4 text-pink-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Bkash</p>
      <p className="text-lg font-heading font-bold text-pink-600">৳{stats.bkash.toLocaleString()}</p>
    </div>
  </div>
</div>

          {/* Gateway Distribution Bar */}
          <div className="bg-card rounded-2xl border p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-signal" />
                Gateway Distribution
              </h3>
              <span className="text-xs text-muted-foreground">{payments.length} transactions</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted">
              <div className="bg-gradient-to-r from-pink-500 to-rose-500 transition-all" style={{ width: `${bkashPercent}%` }} />
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 transition-all" style={{ width: `${nagadPercent}%` }} />
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 transition-all" style={{ width: `${otherPercent}%` }} />
            </div>
            <div className="flex items-center gap-5 mt-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-pink-500" /> bKash ({bkashPercent}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" /> Nagad ({nagadPercent}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Others ({otherPercent}%)</span>
            </div>
          </div>

          {/* Filter Tabs + Search + Actions */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.key ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px]",
                    activeTab === tab.key ? "bg-signal/10 text-signal" : "bg-muted text-muted-foreground"
                  )}>{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by invoice, name, mobile…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* 🎯 Export Dropdown */}
            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:shadow-md transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                  {[
                    { label: "Export as PDF", icon: FileText, action: exportAsPDF, color: "text-red-500" },
                    { label: "Export as Excel", icon: FileSpreadsheet, action: exportAsExcel, color: "text-emerald-500" },
                    { label: "Export as CSV", icon: FileText, action: exportAsCSV, color: "text-blue-500" },
                    { label: "Export as JSON", icon: FileJson, action: exportAsJSON, color: "text-violet-500" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setExportMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-muted transition-colors text-left"
                      >
                        <Icon className={cn("h-4 w-4", item.color)} />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 🎯 Add Payment Button */}
            <button
              onClick={() => setAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-signal to-violet-accent text-white text-sm font-semibold hover:scale-105 transition-all shadow-md shadow-signal/20"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Payment
            </button>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[1200px]">
              <thead>
                <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                  {["Invoice ID", "Payee Name", "Payee Mobile", "Pay Type", "Req. Time", "Pay Time", "Status", "Total", "Bank Txn", "Gateway", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length > 0 ? (
                  filteredPayments.map((p) => {
                    const pc = payTypeConfig[p.payType] || payTypeConfig.Card;
                    const sc = statusConfig[p.status];
                    const PayIcon = pc.icon;
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={p.id} className="border-t hover:bg-signal-tint/30 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sc.bg)}>
                              <Receipt className={cn("h-4 w-4", sc.color)} />
                            </div>
                            <span className="font-mono font-bold text-signal">{p.invoiceId}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold">{p.payeeName}</td>
                        <td className="px-4 py-4 font-mono text-xs">{p.payeeMobile}</td>
                        <td className="px-4 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold", pc.bg, pc.color)}>
                            <PayIcon className="h-3.5 w-3.5" />
                            {p.payType}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground text-xs whitespace-nowrap">{p.reqTime}</td>
                        <td className="px-4 py-4 text-muted-foreground text-xs whitespace-nowrap">{p.payTime}</td>
                        <td className="px-4 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border", sc.bg, sc.color, sc.border)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {p.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-base text-signal">৳{p.total.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{p.bankTxn}</td>
                        <td className="px-4 py-4 text-xs text-muted-foreground">{p.gateway}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors" title="View">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="More">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-signal/10 flex items-center justify-center mb-4">
                          <PiggyBank className="h-9 w-9 text-signal" />
                        </div>
                        <p className="font-heading font-bold text-lg">No merchant payments found</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {searchTerm || activeTab !== "All" ? "Try adjusting your filters or search term." : "Add your first payment to see it here."}
                        </p>
                        <button
                          onClick={() => setAddModalOpen(true)}
                          className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-signal to-violet-accent text-white text-xs font-bold shadow-md shadow-signal/20 hover:scale-105 transition-all"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{filteredPayments.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredPayments.length}</span>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled><ChevronLeft className="h-4 w-4" /></button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">1</button>
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Add Payment Modal */}
      {addModalOpen && (
        <AddPaymentModal
          onClose={() => setAddModalOpen(false)}
          onSubmit={handleAddPayment}
        />
      )}
    </div>
  );
}

// 🎯 ================== Add Payment Modal ==================
function AddPaymentModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (payment: Omit<Payment, "id">) => void;
}) {
  const [form, setForm] = useState({
    invoiceId: "",
    payeeName: "",
    payeeMobile: "",
    payType: "Bkash" as Payment["payType"],
    status: "Success" as Payment["status"],
    total: "",
    bankTxn: "",
    gateway: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date();
    const timeStr = now.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

    onSubmit({
      invoiceId: form.invoiceId || `INV-${Math.floor(Math.random() * 900000 + 100000)}`,
      payeeName: form.payeeName,
      payeeMobile: form.payeeMobile,
      payType: form.payType,
      reqTime: timeStr,
      payTime: form.status === "Success" ? timeStr : "—",
      status: form.status,
      total: Number(form.total) || 0,
      bankTxn: form.bankTxn || `TXN-${Math.floor(Math.random() * 9000 + 1000)}`,
      gateway: form.gateway || `${form.payType} Gateway`,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Top Gradient Bar */}
        <div className="h-1.5 bg-gradient-to-r from-signal via-violet-accent to-signal" />

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shadow-md">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold">Add Payment</h3>
              <p className="text-xs text-muted-foreground">Record a new merchant transaction</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold">Invoice ID</label>
              <input
                type="text"
                value={form.invoiceId}
                onChange={(e) => setForm({ ...form, invoiceId: e.target.value })}
                placeholder="Auto-generated if empty"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Payee Name *</label>
              <input
                type="text"
                required
                value={form.payeeName}
                onChange={(e) => setForm({ ...form, payeeName: e.target.value })}
                placeholder="Enter payee name"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Payee Mobile *</label>
              <input
                type="text"
                required
                value={form.payeeMobile}
                onChange={(e) => setForm({ ...form, payeeMobile: e.target.value })}
                placeholder="01XXXXXXXXX"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Pay Type *</label>
              <select
                value={form.payType}
                onChange={(e) => setForm({ ...form, payType: e.target.value as Payment["payType"] })}
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              >
                <option value="Bkash">Bkash</option>
                <option value="Nagad">Nagad</option>
                <option value="Card">Card</option>
                <option value="Rocket">Rocket</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Status *</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Payment["status"] })}
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              >
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Total Amount *</label>
              <input
                type="number"
                required
                value={form.total}
                onChange={(e) => setForm({ ...form, total: e.target.value })}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Bank Txn</label>
              <input
                type="text"
                value={form.bankTxn}
                onChange={(e) => setForm({ ...form, bankTxn: e.target.value })}
                placeholder="Auto-generated"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 font-mono"
              />
            </div>

            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-semibold">Gateway</label>
              <input
                type="text"
                value={form.gateway}
                onChange={(e) => setForm({ ...form, gateway: e.target.value })}
                placeholder="Auto-generated"
                className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-[1.02] transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}