"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  RotateCcw, Search, Filter, Calendar, X, CheckCircle2, AlertTriangle,
  Download, FileDown, FileSpreadsheet, FileJson, Printer, Copy,
  ChevronLeft, ChevronRight, Users, DollarSign, Receipt, TrendingUp,
  Wallet, Activity, Check, RefreshCw, Info,
} from "lucide-react";

// 🎯 পেমেন্ট ডেটা টাইপ
interface CustomerPayment {
  id: number;
  custId: string;
  name: string;
  ownerId: string;
  ownerName: string;
  payDate: string;
  receiveAmount: number;
  totalBill: number;
  payType: "Cash" | "Bkash" | "Bank";
  moneyReceipt: string;
  remarks: string;
  receivedBy: string;
  entryBy: string;
}

// 🎯 ডামি ডেটা
const initialRows: CustomerPayment[] = [
  { id: 1, custId: "4046", name: "24net.rockysheikh", ownerId: "23", ownerName: "Narikelbaria Cable Networks (NCN)", payDate: "2025-07-12 12:49", receiveAmount: 500, totalBill: 500, payType: "Cash", moneyReceipt: "", remarks: "Recharge: 10Mbps_Package @ 500 for 1 month : Bill=500", receivedBy: "ID-23 Narikelbaria Cable Networks (Cash/Bank)", entryBy: "ID-23 Narikelbaria Cable Networks" },
  { id: 2, custId: "300031", name: "24net.rockysheikh", ownerId: "24", ownerName: "Afi Cable Network (ACN)", payDate: "2025-07-12 12:48", receiveAmount: 500, totalBill: 500, payType: "Bkash", moneyReceipt: "BKASH-9821", remarks: "Recharge: 10Mbps_Package @ 500 for 1 month : Bill=500", receivedBy: "ID-24 Afi Cable Network (Cash/Bank)", entryBy: "ID-24 Afi Cable Network" },
  { id: 3, custId: "4046", name: "24net.rockysheikh", ownerId: "23", ownerName: "Narikelbaria Cable Networks (NCN)", payDate: "2025-07-12 12:47", receiveAmount: 500, totalBill: 500, payType: "Cash", moneyReceipt: "", remarks: "Recharge: 10Mbps_Package @ 500 for 1 month : Bill=500", receivedBy: "ID-23 Narikelbaria Cable Networks (Cash/Bank)", entryBy: "ID-23 Narikelbaria Cable Networks" },
  { id: 4, custId: "300031", name: "24net.rockysheikh", ownerId: "24", ownerName: "Afi Cable Network (ACN)", payDate: "2025-07-12 12:46", receiveAmount: 500, totalBill: 500, payType: "Bank", moneyReceipt: "BANK-7721", remarks: "Recharge: 10Mbps_Package @ 500 for 1 month : Bill=500", receivedBy: "ID-24 Afi Cable Network (Cash/Bank)", entryBy: "ID-24 Afi Cable Network" },
  { id: 5, custId: "4046", name: "24net.rockysheikh", ownerId: "23", ownerName: "Narikelbaria Cable Networks (NCN)", payDate: "2025-07-12 12:45", receiveAmount: 500, totalBill: 500, payType: "Cash", moneyReceipt: "", remarks: "Recharge: 10Mbps_Package @ 500 for 1 month : Bill=500", receivedBy: "ID-23 Narikelbaria Cable Networks (Cash/Bank)", entryBy: "ID-23 Narikelbaria Cable Networks" },
];

// 🎯 Filter Options
const resellerOptions = ["All", "Narikelbaria Cable Networks", "Afi Cable Network"];
const payTypeOptions = ["All", "Cash", "Bkash", "Bank"];
const actionTypeOptions = ["All", "Payment", "Recharge", "Refund"];

export default function CustomerPaymentReportPage() {
  const [rows] = useState<CustomerPayment[]>(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    reseller: "All",
    payType: "All",
    actionType: "All",
  });
  const [dateFrom, setDateFrom] = useState("2025-07-12");
  const [dateTo, setDateTo] = useState("2025-07-12");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [rechargeModal, setRechargeModal] = useState<CustomerPayment | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // 🎯 Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
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

  // 🎯 Filter
  const filteredRows = useMemo(() => {
    let result = rows;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.custId.includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.ownerName.toLowerCase().includes(q) ||
        r.remarks.toLowerCase().includes(q)
      );
    }

    if (filters.payType !== "All") result = result.filter(r => r.payType === filters.payType);
    if (filters.reseller !== "All") result = result.filter(r => r.ownerName.includes(filters.reseller.split(" ")[0]));
    if (filters.actionType !== "All") result = result.filter(r => r.remarks.toLowerCase().includes(filters.actionType.toLowerCase()));

    return result;
  }, [rows, searchTerm, filters]);

  // 🎯 Pagination
  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filters, pageSize]);

  // 🎯 Totals
  const totals = useMemo(() => {
    const totalTransaction = filteredRows.length;
    const totalBillAmount = filteredRows.reduce((acc, r) => acc + r.totalBill, 0);
    const totalReceived = filteredRows.reduce((acc, r) => acc + r.receiveAmount, 0);
    return { totalTransaction, totalBillAmount, totalReceived };
  }, [filteredRows]);

  // 🎯 Reset Filters
  const resetFilters = () => {
    setFilters({ reseller: "All", payType: "All", actionType: "All" });
    setSearchTerm("");
    setDateFrom("2025-07-12");
    setDateTo("2025-07-12");
    setToast({ message: "Filters reset!", type: "info" });
  };

  // 🎯 Export Functions
  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>Customer Payment Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #F97316; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 10px; }
        th { background: #F97316; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
      <h1>Customer Payment Report</h1>
      <p>Period: ${dateFrom} to ${dateTo} | Generated: ${new Date().toLocaleString()}</p>
      <p>Total: ${totals.totalTransaction} transactions, ৳${totals.totalReceived.toLocaleString()} received</p>
      <table><thead><tr>
        <th>Cust ID</th><th>Name</th><th>Owner</th><th>Pay Date</th>
        <th>Received</th><th>Bill</th><th>Pay Type</th><th>Remarks</th>
      </tr></thead><tbody>
      ${filteredRows.map(r => `<tr>
        <td>${r.custId}</td><td>${r.name}</td><td>${r.ownerName}</td><td>${r.payDate}</td>
        <td>৳${r.receiveAmount}</td><td>৳${r.totalBill}</td><td>${r.payType}</td><td>${r.remarks}</td>
      </tr>`).join("")}
      </tbody></table></body></html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
    setToast({ message: "PDF export opened!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportExcel = () => {
    const headers = ["Cust ID", "Name", "Owner ID", "Owner Name", "Pay Date", "Received", "Bill", "Pay Type", "Money Receipt", "Remarks", "Received By", "Entry By"];
    const data = filteredRows.map(r => [r.custId, r.name, r.ownerId, r.ownerName, r.payDate, r.receiveAmount, r.totalBill, r.payType, r.moneyReceipt, r.remarks, r.receivedBy, r.entryBy]);
    const tsv = [headers, ...data].map(row => row.join("\t")).join("\n");
    downloadFile(tsv, `customer-payment-${Date.now()}.xls`, "application/vnd.ms-excel");
    setToast({ message: "Excel downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportCSV = () => {
    const headers = ["Cust ID", "Name", "Owner ID", "Owner Name", "Pay Date", "Received", "Bill", "Pay Type", "Money Receipt", "Remarks"];
    const data = filteredRows.map(r => [r.custId, r.name, r.ownerId, r.ownerName, r.payDate, r.receiveAmount, r.totalBill, r.payType, r.moneyReceipt, r.remarks]);
    const csv = [headers, ...data].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `customer-payment-${Date.now()}.csv`, "text/csv");
    setToast({ message: "CSV downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(filteredRows, null, 2), `customer-payment-${Date.now()}.json`, "application/json");
    setToast({ message: "JSON downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setExportMenuOpen(false);
  };

  const handleCopy = () => {
    const text = filteredRows.map(r => `${r.custId}\t${r.name}\t${r.ownerName}\t${r.payDate}\t${r.receiveAmount}\t${r.payType}`).join("\n");
    navigator.clipboard.writeText(text);
    setToast({ message: `${filteredRows.length} rows copied!`, type: "success" });
    setExportMenuOpen(false);
  };

  // 🎯 Recharge Handler
  const handleRecharge = (row: CustomerPayment) => {
    setRechargeModal(row);
  };

  const confirmRecharge = () => {
    if (!rechargeModal) return;
    setToast({ message: `Recharge initiated for ${rechargeModal.name} (${rechargeModal.custId})!`, type: "success" });
    setRechargeModal(null);
  };

  // 🎯 Quick Date Ranges
  const today = new Date().toISOString().split("T")[0];
  const quickRanges = [
    { label: "Today", from: today, to: today },
    { label: "Last 7 Days", from: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], to: today },
    { label: "This Month", from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0], to: today },
    { label: "Last Month", from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split("T")[0], to: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split("T")[0] },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* 🎯 Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1 flex items-center gap-1.5">
              <Wallet className="h-3 w-3" /> Customer Reports
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Customer Payment Report
            </h1>
          </div>

          {/* 🎯 Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Txns</p>
                <p className="text-lg font-heading font-bold text-orange-500">{totals.totalTransaction}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Bill</p>
                <p className="text-lg font-heading font-bold text-blue-600">৳{totals.totalBillAmount.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Received</p>
                <p className="text-lg font-heading font-bold text-emerald-600">৳{totals.totalReceived.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Unique</p>
                <p className="text-lg font-heading font-bold text-violet-600">{new Set(filteredRows.map(r => r.custId)).size}</p>
              </div>
            </div>
          </div>

          {/* 🎯 Filter Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Filter className="h-4 w-4 text-orange-500" /> Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-muted-foreground hover:text-orange-500 flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Reset All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Reseller</label>
                <select
                  value={filters.reseller}
                  onChange={(e) => setFilters(prev => ({ ...prev, reseller: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  {resellerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Pay Type</label>
                <select
                  value={filters.payType}
                  onChange={(e) => setFilters(prev => ({ ...prev, payType: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  {payTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Action Type</label>
                <select
                  value={filters.actionType}
                  onChange={(e) => setFilters(prev => ({ ...prev, actionType: e.target.value }))}
                  className="w-full px-3 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  {actionTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* 🎯 Dynamic Date Range Header */}
          <div className="mb-6">
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">

                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Report Period
                  </p>
                  <h2 className="font-heading text-xl font-bold mt-0.5">
                    Customer Payment Report
                  </h2>
                </div>

                {/* Date Range Picker */}
                <div className="relative" ref={datePickerRef}>
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center gap-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm px-4 py-2.5 rounded-xl transition-all border border-white/20"
                  >
                    <Calendar className="h-4 w-4" />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{dateFrom}</span>
                      <span className="text-xs opacity-70">→</span>
                      <span className="text-sm font-bold">{dateTo}</span>
                    </div>
                    <ChevronLeft className={cn("h-4 w-4 transition-transform", showDatePicker ? "rotate-90" : "-rotate-90")} />
                  </button>

                  {showDatePicker && (
                    <div className="absolute right-0 top-full mt-2 w-[340px] bg-card border rounded-2xl shadow-2xl overflow-hidden z-50 text-foreground animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b bg-muted/30 flex items-center justify-between">
                        <p className="text-xs font-bold flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-orange-500" /> Select Date Range
                        </p>
                        <button
                          onClick={() => setShowDatePicker(false)}
                          className="w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Quick Ranges */}
                      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5">
                        {quickRanges.map((quick) => (
                          <button
                            key={quick.label}
                            onClick={() => {
                              setDateFrom(quick.from);
                              setDateTo(quick.to);
                            }}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-muted/50 hover:bg-orange-500 hover:text-white transition-colors"
                          >
                            {quick.label}
                          </button>
                        ))}
                      </div>

                      {/* Date Inputs */}
                      <div className="px-4 py-3 space-y-3 border-t">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">From Date</label>
                          <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => setDateFrom(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border bg-background text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500/30"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted-foreground uppercase">To Date</label>
                          <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => setDateTo(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border bg-background text-xs font-semibold outline-none focus:ring-2 focus:ring-orange-500/30"
                          />
                        </div>
                      </div>

                      {/* Apply */}
                      <div className="px-4 py-3 border-t bg-muted/30">
                        <button
                          onClick={() => {
                            setShowDatePicker(false);
                            setToast({ message: `Report updated: ${dateFrom} → ${dateTo}`, type: "success" });
                          }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-md hover:shadow-lg transition-all"
                        >
                          Apply Date Range
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end">
                  <p className="font-heading text-sm font-semibold">
                    {totals.totalTransaction} transactions
                  </p>
                  <p className="text-[10px] opacity-70 mt-0.5">
                    ৳{totals.totalReceived.toLocaleString()} received
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 🎯 Table Header + Search + Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-heading text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Customer Payment
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  placeholder="Search by ID, name, owner…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-full border bg-card text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
                />
              </div>

              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white text-sm font-bold shadow-md shadow-orange-500/20 hover:scale-105 transition-all"
                >
                  <Download className="h-4 w-4" /> Export
                </button>

                {exportMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-card border rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { label: "Export as PDF", icon: FileDown, action: exportPDF, color: "text-red-500" },
                      { label: "Export as Excel", icon: FileSpreadsheet, action: exportExcel, color: "text-emerald-500" },
                      { label: "Export as CSV", icon: FileDown, action: exportCSV, color: "text-blue-500" },
                      { label: "Export as JSON", icon: FileJson, action: exportJSON, color: "text-violet-500" },
                      { divider: true },
                      { label: "Print", icon: Printer, action: handlePrint, color: "text-slate-500" },
                      { label: "Copy to Clipboard", icon: Copy, action: handleCopy, color: "text-amber-500" },
                    ].map((item, idx) => {
                      if ("divider" in item) return <div key={idx} className="border-t my-1" />;
                      const Icon = item.icon!;
                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
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
            </div>
          </div>

          {/* 🎯 Table */}
          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[1300px]">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                  {["Cust. ID", "Cust. Name", "Owner ID", "Owner Name", "Pay Date", "Receive Amount", "Total Bill", "Pay Type", "Money Receipt", "Remarks", "Received By", "Entry By", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-4 font-semibold text-[12px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r) => (
                    <tr key={r.id} className="border-t hover:bg-orange-500/5 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-orange-500">#{r.custId}</td>
                      <td className="px-4 py-3.5 text-orange-500 font-semibold">{r.name}</td>
                      <td className="px-4 py-3.5 font-mono text-xs">{r.ownerId}</td>
                      <td className="px-4 py-3.5 text-sm">{r.ownerName}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs">{r.payDate}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-emerald-600">৳{r.receiveAmount.toLocaleString()}</td>
                      <td className="px-4 py-3.5 font-mono">৳{r.totalBill.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold",
                          r.payType === "Cash" && "bg-emerald-500/10 text-emerald-600",
                          r.payType === "Bkash" && "bg-pink-500/10 text-pink-600",
                          r.payType === "Bank" && "bg-blue-500/10 text-blue-600"
                        )}>
                          <Wallet className="h-3 w-3" />
                          {r.payType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{r.moneyReceipt || "—"}</td>
                      <td className="px-4 py-3.5 text-muted-foreground max-w-[220px] text-xs">{r.remarks}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs">{r.receivedBy}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs">{r.entryBy}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleRecharge(r)}
                          className="flex items-center gap-1.5 text-orange-500 font-semibold text-xs hover:underline whitespace-nowrap"
                        >
                          Recharge <RotateCcw className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center">
                          <Receipt className="h-8 w-8 text-orange-500" />
                        </div>
                        <p className="font-semibold">No payments found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* 🎯 Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border rounded-md px-2 py-1 bg-background font-semibold"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredRows.length}</span>
                <span>items</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg font-bold text-xs transition-all",
                      currentPage === p ? "bg-orange-500 text-white shadow-md" : "border bg-card hover:bg-muted"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 🎯 Totals Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x border-t bg-gradient-to-r from-orange-500/5 to-pink-500/5">
              <div className="px-6 py-4 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Transaction</p>
                <p className="font-heading font-bold text-lg text-orange-500">{totals.totalTransaction}</p>
              </div>
              <div className="px-6 py-4 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Bill Amount</p>
                <p className="font-mono font-bold text-lg text-blue-600">৳{totals.totalBillAmount.toLocaleString()}</p>
              </div>
              <div className="px-6 py-4 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Received</p>
                <p className="font-mono font-bold text-lg text-emerald-600">৳{totals.totalReceived.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Recharge Confirm Modal */}
      {rechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setRechargeModal(null)} />
          <div className="relative w-full max-w-md bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            <div className="h-1.5 bg-gradient-to-r from-orange-500 to-pink-500" />
            <div className="p-6 text-center">
              <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-4 bg-orange-500/10">
                <RefreshCw className="h-7 w-7 text-orange-500" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-2">Confirm Recharge</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Do you want to recharge <span className="font-bold text-orange-500">{rechargeModal.name}</span> (ID: {rechargeModal.custId})?
              </p>
              <div className="bg-muted/40 rounded-xl p-3 mb-6 text-left space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-semibold">{rechargeModal.ownerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-mono font-bold text-emerald-600">৳{rechargeModal.receiveAmount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Package:</span>
                  <span className="font-semibold text-[10px]">{rechargeModal.remarks}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setRechargeModal(null)}
                  className="flex-1 px-4 py-3 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRecharge}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg"
                >
                  <Check className="h-4 w-4" /> Confirm Recharge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300",
          toast.type === "success" && "bg-emerald-500 text-white",
          toast.type === "error" && "bg-red-500 text-white",
          toast.type === "info" && "bg-blue-500 text-white"
        )}>
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5" />}
          {toast.type === "error" && <AlertTriangle className="h-5 w-5" />}
          {toast.type === "info" && <Info className="h-5 w-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}