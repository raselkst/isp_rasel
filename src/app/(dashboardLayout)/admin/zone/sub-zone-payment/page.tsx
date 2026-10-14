"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ListSubZoneTopbar } from "@/components/dashboard/list-sub-zone-topbar";
import { ZoneInfoModal } from "@/components/zone/zone-info-modal";
import { cn } from "@/lib/utils";
import {
  Search, ExternalLink, Copy, Printer, FileDown, FileSpreadsheet, FileJson,
  ChevronLeft, ChevronRight, Filter, Calendar, X, CheckCircle2, AlertTriangle,
  TrendingUp, DollarSign, Wallet, Users, Receipt, Activity, Download,
} from "lucide-react";

interface PaymentRow {
  id: number;
  custId: string;
  zone: string;
  name: string;
  payAmount: number;
  payType: string;
  payDate: string;
  receipt: string;
  paidBy: string;
  remarks: string;
  action: "Online Payment" | "Payment";
}

const initialRows: PaymentRow[] = [
  { id: 17, custId: "10283", zone: "ZS Cable Network (ZSCN)", name: "admin@zsc.net", payAmount: 4998.0, payType: "Cash", payDate: "2025-07-12 14:02", receipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 18, custId: "10284", zone: "Sixnet Communication (SIXNET)", name: "admin@sixnet.net", payAmount: 601.8, payType: "Cash", payDate: "2025-07-12 13:45", receipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 19, custId: "10285", zone: "ZS Cable Network (ZSCN)", name: "admin@zsc.net", payAmount: 4998.0, payType: "Cash", payDate: "2025-07-12 12:30", receipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 20, custId: "10286", zone: "Sixnet Communication (SIXNET)", name: "admin@sixnet.net", payAmount: 601.8, payType: "Cash", payDate: "2025-07-12 11:15", receipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 21, custId: "10287", zone: "ZS Cable Network (ZSCN)", name: "admin@zsc.net", payAmount: 4998.0, payType: "Cash", payDate: "2025-07-12 10:00", receipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 22, custId: "10288", zone: "Sixnet Communication (SIXNET)", name: "admin@sixnet.net", payAmount: 601.8, payType: "Cash", payDate: "2025-07-11 18:20", receipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 23, custId: "10289", zone: "ZS Cable Network (ZSCN)", name: "admin@zsc.net", payAmount: 4998.0, payType: "Cash", payDate: "2025-07-11 17:10", receipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 24, custId: "10290", zone: "Sixnet Communication (SIXNET)", name: "admin@sixnet.net", payAmount: 601.8, payType: "Cash", payDate: "2025-07-11 15:55", receipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Online Payment" },
  { id: 25, custId: "10291", zone: "ZS Cable Network (ZSCN)", name: "admin@zsc.net", payAmount: 4998.0, payType: "Cash", payDate: "2025-07-11 14:30", receipt: "Online Payment BKASH 5100 -102 :CGC3LOXI0R", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Payment" },
  { id: 26, custId: "10292", zone: "Sixnet Communication (SIXNET)", name: "admin@sixnet.net", payAmount: 601.8, payType: "Cash", payDate: "2025-07-11 12:00", receipt: "BKASH Payment 601.8 TrxID CGC2LIX46E", paidBy: "Bkash Merchants(0191526699)", remarks: "Bkash Merchants(0191526699) Cash/Bank", action: "Payment" },
];

const resellerOptions = ["All", "ZS Cable Network", "Sixnet Communication"];
const receivedByOptions = ["All", "Bkash Merchants", "Cash Counter", "Bank Transfer"];
const doneByOptions = ["All", "admin@zsc.net", "admin@sixnet.net"];
const payTypeOptions = ["All", "Cash", "Bkash", "Bank"];
const actionTypeOptions = ["All", "Online Payment", "Payment"];

export default function SubZonePaymentReportPage() {
  const [rows] = useState<PaymentRow[]>(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState("2025-07-11");
  const [toDate, setToDate] = useState("2025-07-12");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [filters, setFilters] = useState({
    reseller: "All",
    receivedBy: "All",
    doneBy: "All",
    payType: "All",
    actionType: "All",
  });
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const datePickerRef = useRef<HTMLDivElement>(null);

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

  const filteredRows = useMemo(() => {
    let result = rows;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.zone.toLowerCase().includes(q) ||
        r.name.toLowerCase().includes(q) ||
        r.receipt.toLowerCase().includes(q) ||
        r.custId.includes(q) ||
        r.paidBy.toLowerCase().includes(q)
      );
    }
    if (filters.payType !== "All") result = result.filter(r => r.payType === filters.payType);
    if (filters.actionType !== "All") result = result.filter(r => r.action === filters.actionType);
    if (filters.reseller !== "All") result = result.filter(r => r.zone.includes(filters.reseller.split(" ")[0]));
    if (filters.doneBy !== "All") result = result.filter(r => r.name === filters.doneBy);
    return result;
  }, [rows, searchTerm, filters]);

  const totalPages = Math.ceil(filteredRows.length / pageSize);
  const paginatedRows = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, filters, pageSize]);

  const summary = useMemo(() => {
    const totalPayment = filteredRows.reduce((acc, r) => acc + r.payAmount, 0);
    const onlineCount = filteredRows.filter(r => r.action === "Online Payment").length;
    const cashCount = filteredRows.filter(r => r.action === "Payment").length;
    return {
      totalPayment,
      onlineCount,
      cashCount,
      totalDeductions: 0,
      onlineCharge: 0,
      totalReturn: 0,
      totalPaymentCust: totalPayment,
      totalPaymentOwn: totalPayment * 0.17,
      totalPaymentAddition: 0,
      netPayment: totalPayment * 1.17,
      totalOTC: 0,
    };
  }, [filteredRows]);

  const resetFilters = () => {
    setFilters({ reseller: "All", receivedBy: "All", doneBy: "All", payType: "All", actionType: "All" });
    setSearchTerm("");
    setFromDate("2025-07-11");
    setToDate("2025-07-12");
    setToast({ message: "Filters reset!", type: "success" });
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

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>Sub-Zone Payment Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #066F6F; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
        th { background: #066F6F; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
      <h1>Sub-Zone Payment Report</h1>
      <p>Period: ${fromDate} to ${toDate} | Generated: ${new Date().toLocaleString()}</p>
      <table><thead><tr>
        <th>ID</th><th>Cust ID</th><th>Zone</th><th>Name</th><th>Amount</th>
        <th>Pay Type</th><th>Pay Date</th><th>Receipt</th><th>Action</th>
      </tr></thead><tbody>
      ${filteredRows.map(r => `<tr>
        <td>${r.id}</td><td>${r.custId}</td><td>${r.zone}</td><td>${r.name}</td>
        <td>৳${r.payAmount.toFixed(2)}</td><td>${r.payType}</td><td>${r.payDate}</td>
        <td>${r.receipt}</td><td>${r.action}</td>
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
    const headers = ["ID", "Cust ID", "Zone", "Name", "Amount", "Pay Type", "Pay Date", "Receipt", "Paid By", "Remarks", "Action"];
    const data = filteredRows.map(r => [r.id, r.custId, r.zone, r.name, r.payAmount, r.payType, r.payDate, r.receipt, r.paidBy, r.remarks, r.action]);
    const tsv = [headers, ...data].map(row => row.join("\t")).join("\n");
    downloadFile(tsv, `sub-zone-payment-${Date.now()}.xls`, "application/vnd.ms-excel");
    setToast({ message: "Excel downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportCSV = () => {
    const headers = ["ID", "Cust ID", "Zone", "Name", "Amount", "Pay Type", "Pay Date", "Receipt", "Paid By", "Remarks", "Action"];
    const data = filteredRows.map(r => [r.id, r.custId, r.zone, r.name, r.payAmount, r.payType, r.payDate, r.receipt, r.paidBy, r.remarks, r.action]);
    const csv = [headers, ...data].map(row => row.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `sub-zone-payment-${Date.now()}.csv`, "text/csv");
    setToast({ message: "CSV downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const exportJSON = () => {
    downloadFile(JSON.stringify(filteredRows, null, 2), `sub-zone-payment-${Date.now()}.json`, "application/json");
    setToast({ message: "JSON downloaded!", type: "success" });
    setExportMenuOpen(false);
  };

  const handlePrint = () => {
    window.print();
    setExportMenuOpen(false);
  };

  const handleCopy = () => {
    const text = filteredRows.map(r => `${r.id}\t${r.custId}\t${r.zone}\t${r.name}\t${r.payAmount}\t${r.payType}\t${r.payDate}`).join("\n");
    navigator.clipboard.writeText(text);
    setToast({ message: `${filteredRows.length} rows copied!`, type: "success" });
    setExportMenuOpen(false);
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
        <ListSubZoneTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Receipt className="h-3 w-3" /> Sub-Zone Reports
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
              Sub-Zone Payment Report
            </h1>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">৳{summary.totalPayment.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Online</p>
                <p className="text-lg font-heading font-bold text-signal">{summary.onlineCount}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Cash</p>
                <p className="text-lg font-heading font-bold text-signal">{summary.cashCount}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Net</p>
                <p className="text-lg font-heading font-bold text-signal">৳{summary.netPayment.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-signal">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-slate-500 hover:text-signal flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Reset All
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { label: "Reseller", key: "reseller", options: resellerOptions },
                { label: "Received By", key: "receivedBy", options: receivedByOptions },
                { label: "Done By", key: "doneBy", options: doneByOptions },
                { label: "Pay Type", key: "payType", options: payTypeOptions },
                { label: "Action Type", key: "actionType", options: actionTypeOptions },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">{f.label}</label>
                  <select
                    value={filters[f.key as keyof typeof filters]}
                    onChange={(e) => setFilters(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 text-signal"
                  >
                    {f.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Date Range Header */}
          <div className="mb-6">
            <div className="bg-signal rounded-2xl p-5 text-white shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest opacity-80 font-semibold flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" /> Report Period
                  </p>
                  <h2 className="font-heading text-xl font-bold mt-0.5">
                    Sub-Zone Report
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
                    <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <p className="text-xs font-bold flex items-center gap-1.5 text-signal">
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
                            className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 hover:bg-signal hover:text-white transition-colors"
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
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-signal/30 text-signal"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-500 uppercase">To Date</label>
                          <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-signal/30 text-signal"
                          />
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
                        <button
                          onClick={() => {
                            setShowDatePicker(false);
                            setToast({ message: `Report updated: ${fromDate} → ${toDate}`, type: "success" });
                          }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold bg-signal text-white shadow-md hover:bg-signal-hover transition-all"
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

          {/* Table Header + Search + Export */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="font-heading text-xl font-bold text-signal">
              Sub-Zone Payment
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  placeholder="Search by zone, ID, receipt…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
                />
              </div>

              <div className="relative" ref={exportMenuRef}>
                <button
                  onClick={() => setExportMenuOpen(!exportMenuOpen)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-signal text-white text-sm font-bold shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
                >
                  <Download className="h-4 w-4" /> Export
                </button>

                {exportMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                    {[
                      { label: "Export as PDF", icon: FileDown, action: exportPDF },
                      { label: "Export as Excel", icon: FileSpreadsheet, action: exportExcel },
                      { label: "Export as CSV", icon: FileDown, action: exportCSV },
                      { label: "Export as JSON", icon: FileJson, action: exportJSON },
                      { divider: true },
                      { label: "Print", icon: Printer, action: handlePrint },
                      { label: "Copy to Clipboard", icon: Copy, action: handleCopy },
                    ].map((item: any, idx) => {
                      if (item.divider) {
                        return <div key={idx} className="border-t border-slate-100 my-1" />;
                      }
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors text-left text-signal"
                        >
                          <Icon className="h-4 w-4" />
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
                <tr className="bg-signal text-white">
                  {["ID", "Cust ID", "Zone", "Name", "Pay Amount", "Pay Type", "Pay Date", "Receipt", "Paid By", "Remarks", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3.5 font-semibold text-[12px] whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length > 0 ? (
                  paginatedRows.map((r) => (
                    <tr key={r.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-3.5 font-mono font-bold text-signal">#{r.id}</td>
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-600">{r.custId}</td>
                      <td className="px-4 py-3.5 font-semibold text-signal">{r.zone}</td>
                      <td className="px-4 py-3.5 font-semibold text-signal">{r.name}</td>
                      <td className="px-4 py-3.5 font-mono font-bold text-signal">৳{r.payAmount.toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border border-signal/20 bg-signal-tint text-signal">
                          <Wallet className="h-3 w-3" />
                          {r.payType}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{r.payDate}</td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">{r.receipt}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-600">{r.paidBy}</td>
                      <td className="px-4 py-3.5 text-slate-500 whitespace-nowrap text-xs">{r.remarks}</td>
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => setInfoOpen(true)}
                          className="flex items-center gap-1.5 font-semibold text-xs whitespace-nowrap hover:underline text-signal"
                        >
                          {r.action}
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center">
                          <Receipt className="h-8 w-8 text-signal" />
                        </div>
                        <p className="font-semibold text-signal">No payments found</p>
                        <p className="text-xs text-slate-500">Try adjusting your filters or search term.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="border border-slate-200 rounded-md px-2 py-1 bg-white font-semibold text-signal"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>•</span>
                <span className="font-semibold text-signal">
                  {filteredRows.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredRows.length)}
                </span>
                <span>of</span>
                <span className="font-semibold text-signal">{filteredRows.length}</span>
                <span>items</span>
              </div>
              <div className="flex items-center gap-2">
                <span>Page {currentPage} of {totalPages || 1}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={cn(
                      "w-8 h-8 rounded-lg font-bold text-xs transition-all",
                      currentPage === p ? "bg-signal text-white shadow-md" : "border border-slate-200 bg-white hover:bg-slate-50 text-signal"
                    )}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
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
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-heading text-lg font-bold flex items-center gap-2 text-signal">
                <Activity className="h-5 w-5" />
                Summary
              </h3>
            </div>
            {[
              { label: "Total Deductions:", value: summary.totalDeductions },
              { label: "Online Charge:", value: summary.onlineCharge },
              { label: "Total Return:", value: summary.totalReturn },
              { label: "Total Payment (Cust):", value: summary.totalPaymentCust },
              { label: "Total Payment (Own):", value: summary.totalPaymentOwn },
              { label: "Total Payment Addition:", value: summary.totalPaymentAddition },
            ].map((item, i) => (
              <div
                key={item.label}
                className={cn("px-6 py-4 flex justify-between", i % 2 === 1 && "bg-slate-50")}
              >
                <span className="font-semibold text-sm text-slate-600">{item.label}</span>
                <span className="font-mono font-bold text-sm text-signal">
                  ৳{item.value.toLocaleString()}
                </span>
              </div>
            ))}
            <div className="px-6 py-4 flex justify-between font-heading font-bold text-white bg-signal">
              <span>Net Payment:</span>
              <span className="font-mono text-lg">৳{summary.netPayment.toLocaleString()}</span>
            </div>
            <div className="px-6 py-4 flex justify-between font-heading font-bold border-t border-signal/20 bg-signal-tint text-signal">
              <span>Total OTC:</span>
              <span className="font-mono text-lg">৳{summary.totalOTC.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-6 right-6 z-[100] flex items-center gap-2.5 px-5 py-3.5 rounded-xl shadow-2xl animate-in slide-in-from-bottom-2 duration-300 text-white",
          toast.type === "success" ? "bg-signal" : "bg-destructive"
        )}>
          {toast.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      )}

      <ZoneInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} entityLabel="Sub-Zone" />
    </div>
  );
}