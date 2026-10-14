"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListTopbar } from "@/components/dashboard/list-topbar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Search, ExternalLink, Calendar, Download, Printer, FileText,
  FileSpreadsheet, Filter, X, ChevronLeft, ChevronRight, Copy,
  CheckCircle2, AlertTriangle, TrendingUp, DollarSign, Users,
  Receipt, Eye, MoreHorizontal, Building2, Clock, RefreshCw,
  CreditCard, Banknote,
} from "lucide-react";

// 🎯 Color Palette: White + #066F6F
const TEAL = "#066F6F";
const TEAL_TINT = "rgba(6, 111, 111, 0.08)";
const TEAL_BORDER = "rgba(6, 111, 111, 0.15)";

// 🎯 ডেটা টাইপ
interface PaymentRow {
  id: number;
  zone: string;
  custId: string;
  custName: string;
  payDate: string;
  paidAmount: number;
  payType: "Cash" | "Bkash" | "Nagad" | "Bank";
  moneyReceipt: string;
  remarks: string;
  entryBy: string;
  action: "Online Payment" | "Payment";
}

const initialRows: PaymentRow[] = [
  { id: 17, zone: "ZS Cable Network (ZSCN)", custId: "10283", custName: "admin@zsc.net", payDate: "2025-07-12 14:02", paidAmount: 4998.0, payType: "Cash", moneyReceipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 18, zone: "Sixnet Communication (SIXNET)", custId: "10284", custName: "admin@sixnet.net", payDate: "2025-07-12 13:45", paidAmount: 601.8, payType: "Bkash", moneyReceipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 19, zone: "ZS Cable Network (ZSCN)", custId: "10285", custName: "admin@zsc.net", payDate: "2025-07-12 13:20", paidAmount: 4998.0, payType: "Cash", moneyReceipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 20, zone: "Sixnet Communication (SIXNET)", custId: "10286", custName: "admin@sixnet.net", payDate: "2025-07-12 12:15", paidAmount: 601.8, payType: "Bkash", moneyReceipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 21, zone: "ZS Cable Network (ZSCN)", custId: "10287", custName: "admin@zsc.net", payDate: "2025-07-12 11:50", paidAmount: 4998.0, payType: "Cash", moneyReceipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 22, zone: "Sixnet Communication (SIXNET)", custId: "10288", custName: "admin@sixnet.net", payDate: "2025-07-12 11:30", paidAmount: 601.8, payType: "Bkash", moneyReceipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 23, zone: "ZS Cable Network (ZSCN)", custId: "10289", custName: "admin@zsc.net", payDate: "2025-07-12 10:45", paidAmount: 4998.0, payType: "Cash", moneyReceipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 24, zone: "Sixnet Communication (SIXNET)", custId: "10290", custName: "admin@sixnet.net", payDate: "2025-07-12 09:30", paidAmount: 601.8, payType: "Bkash", moneyReceipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Online Payment" },
  { id: 25, zone: "ZS Cable Network (ZSCN)", custId: "10291", custName: "admin@zsc.net", payDate: "2025-07-11 16:15", paidAmount: 4998.0, payType: "Cash", moneyReceipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Payment" },
  { id: 26, zone: "Sixnet Communication (SIXNET)", custId: "10292", custName: "admin@sixnet.net", payDate: "2025-07-11 15:00", paidAmount: 601.8, payType: "Bkash", moneyReceipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", remarks: "Bkash Merchants(0191526699) Cash/Bank", entryBy: "Bkash Merchants(0191526699)", action: "Payment" },
];

// 🎯 পে টাইপ কনফিগ (White + Teal)
const payTypeConfig: Record<string, { color: string; bg: string; icon: any }> = {
  Cash: { color: "text-emerald-600", bg: "bg-emerald-50", icon: Banknote },
  Bkash: { color: "text-pink-600", bg: "bg-pink-50", icon: CreditCard },
  Nagad: { color: "text-orange-600", bg: "bg-orange-50", icon: CreditCard },
  Bank: { color: "text-blue-600", bg: "bg-blue-50", icon: Building2 },
};

export default function ZonePaymentReportPage() {
  const [rows] = useState<PaymentRow[]>(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("2025-07-11");
  const [toDate, setToDate] = useState("2025-07-12");
  const [resellerFilter, setResellerFilter] = useState("all");
  const [receivedByFilter, setReceivedByFilter] = useState("all");
  const [doneByFilter, setDoneByFilter] = useState("all");
  const [payTypeFilter, setPayTypeFilter] = useState("all");
  const [actionTypeFilter, setActionTypeFilter] = useState("payment-online");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailModal, setDetailModal] = useState<PaymentRow | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter((r) =>
        r.zone.toLowerCase().includes(q) ||
        r.custName.toLowerCase().includes(q) ||
        r.custId.includes(q) ||
        r.moneyReceipt.toLowerCase().includes(q)
      );
    }
    if (payTypeFilter !== "all") result = result.filter((r) => r.payType.toLowerCase() === payTypeFilter);
    if (actionTypeFilter !== "payment-online") result = result.filter((r) => r.action.toLowerCase().includes(actionTypeFilter));
    return result;
  }, [rows, searchTerm, payTypeFilter, actionTypeFilter]);

  const stats = useMemo(() => {
    const totalAmount = filteredRows.reduce((acc, r) => acc + r.paidAmount, 0);
    const online = filteredRows.filter((r) => r.action === "Online Payment").reduce((acc, r) => acc + r.paidAmount, 0);
    const cash = filteredRows.filter((r) => r.payType === "Cash").reduce((acc, r) => acc + r.paidAmount, 0);
    const totalCount = filteredRows.length;
    return { totalAmount, online, cash, totalCount };
  }, [filteredRows]);

  const summary = useMemo(() => {
    const totalPayment = filteredRows.reduce((acc, r) => acc + r.paidAmount, 0);
    return [
      { label: "Total Deductions:", value: "0.00" },
      { label: "Online Charge:", value: "0.00" },
      { label: "Total Return:", value: "0.00" },
      { label: "Total Payment (Cust):", value: totalPayment.toFixed(2) },
      { label: "Total Payment (Own):", value: (totalPayment * 0.17).toFixed(2) },
      { label: "Total Payment Addition:", value: "0.00" },
      { label: "Net Payment:", value: (totalPayment * 1.17).toFixed(2) },
      { label: "Total OTC:", value: "0.00" },
    ];
  }, [filteredRows]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  useEffect(() => { setCurrentPage(1); }, [searchTerm, pageSize]);

  const exportFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const headers = ["ID", "Zone Name", "Cust ID", "Cust Name", "Pay Date", "Paid Amount", "Pay Type", "Money Receipt", "Remarks", "Entry By", "Action"];
    const rows = filteredRows.map((r) => [
      r.id, r.zone, r.custId, r.custName, r.payDate, r.paidAmount, r.payType, r.moneyReceipt, r.remarks, r.entryBy, r.action,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
    exportFile(csv, `zone-payment-${Date.now()}.csv`, "text/csv");
    setToast({ message: "CSV downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportExcel = () => {
    const headers = ["ID", "Zone Name", "Cust ID", "Cust Name", "Pay Date", "Paid Amount", "Pay Type", "Money Receipt", "Remarks", "Entry By", "Action"];
    const rows = filteredRows.map((r) => [
      r.id, r.zone, r.custId, r.custName, r.payDate, r.paidAmount, r.payType, r.moneyReceipt, r.remarks, r.entryBy, r.action,
    ]);
    const tsv = [headers, ...rows].map((r) => r.join("\t")).join("\n");
    exportFile(tsv, `zone-payment-${Date.now()}.xls`, "application/vnd.ms-excel");
    setToast({ message: "Excel downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportJSON = () => {
    const json = JSON.stringify(filteredRows, null, 2);
    exportFile(json, `zone-payment-${Date.now()}.json`, "application/json");
    setToast({ message: "JSON downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>Zone Payment Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #066F6F; } table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #066F6F; color: white; } tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
      <h1>Zone Payment Report</h1>
      <p>Period: ${fromDate} to ${toDate} | Generated: ${new Date().toLocaleString()}</p>
      <table><thead><tr><th>ID</th><th>Zone</th><th>Cust ID</th><th>Amount</th><th>Pay Type</th><th>Action</th></tr></thead>
      <tbody>${filteredRows.map((r) => `<tr><td>${r.id}</td><td>${r.zone}</td><td>${r.custId}</td><td>৳${r.paidAmount}</td><td>${r.payType}</td><td>${r.action}</td></tr>`).join("")}</tbody>
      </table></body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
    setToast({ message: "Print dialog opened!", type: "success" });
    setExportMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setToast({ message: "Print dialog opened!", type: "success" });
  };

  const resetFilters = () => {
    setSearchTerm("");
    setResellerFilter("all");
    setReceivedByFilter("all");
    setDoneByFilter("all");
    setPayTypeFilter("all");
    setActionTypeFilter("payment-online");
    setFromDate("2025-07-11");
    setToDate("2025-07-12");
    setToast({ message: "Filters reset!", type: "success" });
  };

  const today = new Date().toISOString().split("T")[0];
  const quickRanges = [
    { label: "Today", from: today, to: today },
    { label: "Last 7 Days", from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], to: today },
    { label: "This Month", from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0], to: today },
    { label: "Last Month", from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split("T")[0], to: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split("T")[0] },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ListTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Hero Header */}
          <div className="mb-6">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-1 flex items-center gap-1.5"
              style={{ color: TEAL }}
            >
              <DollarSign className="h-3 w-3" /> Payment Report
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight" style={{ color: TEAL }}>
              Zone Payment
            </h1>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: TEAL_TINT }}>
                <Receipt className="w-4 h-4" style={{ color: TEAL }} />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold" style={{ color: TEAL }}>{stats.totalCount}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: TEAL_TINT }}>
                <DollarSign className="w-4 h-4" style={{ color: TEAL }} />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Amount</p>
                <p className="text-lg font-heading font-bold" style={{ color: TEAL }}>৳{stats.totalAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: TEAL_TINT }}>
                <CreditCard className="w-4 h-4" style={{ color: TEAL }} />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Online</p>
                <p className="text-lg font-heading font-bold" style={{ color: TEAL }}>৳{stats.online.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: TEAL_TINT }}>
                <Banknote className="w-4 h-4" style={{ color: TEAL }} />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Cash</p>
                <p className="text-lg font-heading font-bold" style={{ color: TEAL }}>৳{stats.cash.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Advanced Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: TEAL }}>
                <Filter className="h-4 w-4" /> Advanced Filters
              </h3>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Reset All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-300"
                    style={{ color: TEAL }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-300"
                    style={{ color: TEAL }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Reseller</label>
                <Select value={resellerFilter} onValueChange={setResellerFilter}>
                  <SelectTrigger className="h-9 bg-white text-xs border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="zscn">ZS Cable Network</SelectItem>
                    <SelectItem value="sixnet">Sixnet Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Received By</label>
                <Select value={receivedByFilter} onValueChange={setReceivedByFilter}>
                  <SelectTrigger className="h-9 bg-white text-xs border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="merchant">Merchant</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Done By</label>
                <Select value={doneByFilter} onValueChange={setDoneByFilter}>
                  <SelectTrigger className="h-9 bg-white text-xs border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Pay Type</label>
                <Select value={payTypeFilter} onValueChange={setPayTypeFilter}>
                  <SelectTrigger className="h-9 bg-white text-xs border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bkash">Bkash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Action Type</label>
                <Select value={actionTypeFilter} onValueChange={setActionTypeFilter}>
                  <SelectTrigger className="h-9 bg-white text-xs border-slate-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment-online">Payment + Online</SelectItem>
                    <SelectItem value="payment">Payment Only</SelectItem>
                    <SelectItem value="online">Online Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Dynamic Date Range Header */}
          <div className="mb-6">
            <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: TEAL }}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Report Period
                  </p>
                  <h2 className="font-heading text-xl font-bold mt-0.5">
                    Zone Report
                  </h2>
                </div>

                <div className="relative" ref={datePickerRef}>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2.5 rounded-xl transition-all border border-white/20"
                  >
                    <Calendar className="h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{fromDate}</span>
                      <span className="text-xs opacity-70">→</span>
                      <span className="text-sm font-bold">{toDate}</span>
                    </div>
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", showDatePicker ? "rotate-90" : "-rotate-90")} />
                  </button>

                  {showDatePicker && (
                    <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-foreground animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: TEAL }}>
                          <Calendar className="h-3.5 w-3.5" /> Select Date Range
                        </p>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="w-6 h-6 rounded-full hover:bg-slate-100 flex items-center justify-center"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
                        {quickRanges.map((quick) => (
                          <button
                            key={quick.label}
                            onClick={() => {
                              setFromDate(quick.from);
                              setToDate(quick.to);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors border border-slate-200 hover:text-white"
                            style={{ color: TEAL }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = TEAL)}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {quick.label}
                          </button>
                        ))}
                      </div>

                      <div className="px-4 py-3 space-y-3 border-t border-slate-100">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">From Date</label>
                          <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-300"
                            style={{ color: TEAL }}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
                          <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-slate-300"
                            style={{ color: TEAL }}
                          />
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                        <button
                          onClick={() => {
                            setShowDatePicker(false);
                            setToast({ message: `Report updated: ${fromDate} → ${toDate}`, type: "success" });
                          }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all"
                          style={{ background: TEAL }}
                        >
                          Apply Date Range
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-heading text-sm font-semibold">
                    Summary <span className="opacity-90">Report-1</span> & <span className="opacity-90">Report-2</span>
                  </p>
                  <p className="text-[10px] opacity-70 mt-0.5">
                    {filteredRows.length} records found
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search + Export Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h3 className="font-heading text-xl font-bold" style={{ color: TEAL }}>
              Payment List
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search by zone, customer, receipt…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-slate-300"
                  style={{ color: TEAL }}
                />
              </div>

              <div className="relative" ref={exportRef}>
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-sm font-bold shadow-md hover:scale-105 transition-all"
                  style={{ background: TEAL }}
                >
                  <Download className="h-3.5 w-3.5" /> Export
                </button>
                {exportMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { label: "Export as PDF", icon: FileText, action: exportPDF, color: "text-red-500" },
                      { label: "Print", icon: Printer, action: handlePrint, color: "text-slate-600" },
                      { label: "Export as Excel", icon: FileSpreadsheet, action: exportExcel, color: "text-emerald-500" },
                      { label: "Export as CSV", icon: FileText, action: exportCSV, color: "text-blue-500" },
                      { label: "Export as JSON", icon: FileText, action: exportJSON, color: "text-violet-500" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors text-left"
                          style={{ color: TEAL }}
                        >
                          <Icon className={cn("h-4 w-4", item.color)} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[1400px]">
              <thead>
                <tr className="text-white" style={{ background: TEAL }}>
                  {[
                    { label: "ID", icon: MoreHorizontal },
                    { label: "Zone Name", icon: Building2 },
                    { label: "Cust ID", icon: Users },
                    { label: "Cust Name", icon: Users },
                    { label: "Pay Date", icon: Clock },
                    { label: "Paid Amount", icon: DollarSign },
                    { label: "Pay Type", icon: CreditCard },
                    { label: "Money Receipt", icon: Receipt },
                    { label: "Remarks", icon: FileText },
                    { label: "Entry By", icon: Users },
                    { label: "Action", icon: Eye },
                  ].map((h) => {
                    const Icon = h.icon;
                    return (
                      <th key={h.label} className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Icon className="h-3.5 w-3.5 opacity-70" /> {h.label}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r, i) => {
                    const pc = payTypeConfig[r.payType] || payTypeConfig.Cash;
                    const PayIcon = pc.icon;
                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-4">
                          <span className="font-mono font-bold" style={{ color: TEAL }}>#{r.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-sm" style={{ color: TEAL }}>{r.zone}</span>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-slate-600">{r.custId}</td>
                        <td className="px-4 py-4">
                          <span className="font-semibold text-xs" style={{ color: TEAL }}>{r.custName}</span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">{r.payDate}</td>
                        <td className="px-4 py-4">
                          <span className="font-mono font-bold text-emerald-600">৳{r.paidAmount.toFixed(2)}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border border-slate-200", pc.bg, pc.color)}>
                            <PayIcon className="h-3 w-3" />
                            {r.payType}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 max-w-xs truncate" title={r.moneyReceipt}>
                          {r.moneyReceipt}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 max-w-xs truncate" title={r.remarks}>
                          {r.remarks}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">{r.entryBy}</td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setDetailModal(r)}
                            className="flex items-center gap-1.5 font-semibold text-xs whitespace-nowrap hover:underline"
                            style={{ color: TEAL }}
                          >
                            {r.action}
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: TEAL_TINT }}>
                          <Receipt className="h-8 w-8" style={{ color: TEAL }} />
                        </div>
                        <p className="font-semibold" style={{ color: TEAL }}>No payments found</p>
                        <p className="text-xs text-slate-500">Try adjusting your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-slate-200 rounded-md px-2 py-1 bg-white font-semibold"
                  style={{ color: TEAL }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>•</span>
                <span className="font-semibold" style={{ color: TEAL }}>
                  {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)}
                </span>
                <span>of</span>
                <span className="font-semibold" style={{ color: TEAL }}>{filteredRows.length}</span>
                <span>items</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs">Page <span className="font-bold" style={{ color: TEAL }}>{currentPage}</span> of <span className="font-bold" style={{ color: TEAL }}>{totalPages || 1}</span></span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mt-6 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" style={{ color: TEAL }} />
              <h3 className="font-heading text-lg font-bold" style={{ color: TEAL }}>Payment Summary</h3>
            </div>
            {summary.map((s, i) => {
              const isLast = i === summary.length - 1;
              return (
                <div
                  key={s.label}
                  className={cn(
                    "px-6 py-4 flex justify-between items-center transition-colors",
                    isLast ? "text-white font-bold" : i % 2 === 1 ? "bg-slate-50/50" : ""
                  )}
                  style={isLast ? { background: TEAL } : {}}
                >
                  <span className={cn("font-heading", isLast ? "font-bold text-base" : "font-semibold")} style={!isLast ? { color: TEAL } : {}}>
                    {s.label}
                  </span>
                  <span className={cn("font-mono", isLast ? "font-bold text-lg" : "")} style={!isLast ? { color: TEAL } : {}}>
                    ৳{s.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDetailModal(null)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="h-1.5" style={{ background: TEAL }} />
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                  style={{ background: TEAL }}
                >
                  <Receipt className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold" style={{ color: TEAL }}>Payment Details</h3>
                  <p className="text-xs text-slate-500">ID #{detailModal.id}</p>
                </div>
              </div>
              <button onClick={() => setDetailModal(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: "Zone", value: detailModal.zone },
                { label: "Customer ID", value: detailModal.custId },
                { label: "Customer Name", value: detailModal.custName },
                { label: "Pay Date", value: detailModal.payDate },
                { label: "Paid Amount", value: `৳${detailModal.paidAmount.toFixed(2)}`, highlight: true },
                { label: "Pay Type", value: detailModal.payType },
                { label: "Money Receipt", value: detailModal.moneyReceipt },
                { label: "Remarks", value: detailModal.remarks },
                { label: "Entry By", value: detailModal.entryBy },
              ].map((item) => (
                <div key={item.label} className={cn("flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100", item.highlight ? "" : "bg-slate-50")} style={item.highlight ? { background: TEAL_TINT, borderColor: TEAL_BORDER } : {}}>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</span>
                  <span className={cn("text-xs font-bold text-right break-all max-w-[60%]", item.highlight ? "text-sm" : "")} style={{ color: TEAL }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setDetailModal(null)} className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200">
                Close
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(JSON.stringify(detailModal, null, 2)); setToast({ message: "Copied to clipboard!", type: "success" }); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white shadow-lg"
                style={{ background: TEAL }}
              >
                <Copy className="h-4 w-4" /> Copy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300 text-white",
          toast.type === "success" ? "" : "bg-red-500"
        )} style={toast.type === "success" ? { background: TEAL } : {}}>
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}