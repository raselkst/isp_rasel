"use client";

import React, { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  PieChart, Calendar, RefreshCw, Wallet, TrendingUp, TrendingDown,
  AlertCircle, Info, ArrowUpRight, ArrowDownRight, DollarSign,
  Building2, CreditCard, Banknote, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "name", label: "Name" },
  { key: "opening", label: "Opening Balance" },
  { key: "inflow", label: "Inflow" },
  { key: "bbIn", label: "Bank-to-Bank In" },
  { key: "outflow", label: "Outflow" },
  { key: "bbOut", label: "Bank-to-Bank Out" },
  { key: "expense", label: "Expense" },
  { key: "closing", label: "Closing Balance" },
];

const mockData = [
  { id: 1, name: "Bkash Merchants (01919626699)", type: "Mobile Banking", opening: 2980866.58, inflow: 22238.20, bbIn: 0, outflow: 0, bbOut: 0, expense: 0, closing: 3003104.78 },
  { id: 2, name: "Network Service Provider (NSP)", type: "Service", opening: 1298475.00, inflow: 24950.00, bbIn: 0, outflow: 29500.00, bbOut: 0, expense: 0, closing: 1293925.00 },
  { id: 3, name: "BRAC Bank - Main Account", type: "Bank", opening: 125400.50, inflow: 50000.00, bbIn: 15000.00, outflow: 20000.00, bbOut: 5000.00, expense: 3200.00, closing: 162200.50 },
  { id: 4, name: "Dutch Bangla Bank", type: "Bank", opening: 285600.75, inflow: 75000.00, bbIn: 0, outflow: 45000.00, bbOut: 10000.00, expense: 5100.00, closing: 305500.75 },
  { id: 5, name: "Cash in Hand", type: "Cash", opening: 40100.00, inflow: 12000.00, bbIn: 0, outflow: 8500.00, bbOut: 0, expense: 1500.00, closing: 42100.00 },
  { id: 6, name: "Islami Bank", type: "Bank", opening: 42350.00, inflow: 18000.00, bbIn: 5000.00, outflow: 12000.00, bbOut: 0, expense: 800.00, closing: 52550.00 },
  { id: 7, name: "Nagad Merchants (01712345678)", type: "Mobile Banking", opening: 185600.00, inflow: 15200.00, bbIn: 0, outflow: 8000.00, bbOut: 0, expense: 0, closing: 192800.00 },
];

const quickRanges = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "year", label: "This Year" },
];

export default function CashFlowPage() {
  const [dateFrom, setDateFrom] = useState("2025-07-01");
  const [dateTo, setDateTo] = useState("2025-07-23");
  const [activeRange, setActiveRange] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const filteredData = useMemo(() => {
    return mockData.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, r) => ({
        opening: acc.opening + r.opening,
        inflow: acc.inflow + r.inflow,
        bbIn: acc.bbIn + r.bbIn,
        outflow: acc.outflow + r.outflow,
        bbOut: acc.bbOut + r.bbOut,
        expense: acc.expense + r.expense,
        closing: acc.closing + r.closing,
      }),
      { opening: 0, inflow: 0, bbIn: 0, outflow: 0, bbOut: 0, expense: 0, closing: 0 }
    );
  }, [filteredData]);

  const netFlow = totals.inflow + totals.bbIn - totals.outflow - totals.bbOut - totals.expense;

  const handleQuickRange = (rangeId: string) => {
    setActiveRange(rangeId);
    setIsLoading(true);
    const today = new Date();
    const to = today.toISOString().split("T")[0];
    let from = to;

    switch (rangeId) {
      case "today":
        from = to;
        break;
      case "week": {
        const d = new Date(today);
        d.setDate(today.getDate() - 7);
        from = d.toISOString().split("T")[0];
        break;
      }
      case "month": {
        const d = new Date(today.getFullYear(), today.getMonth(), 1);
        from = d.toISOString().split("T")[0];
        break;
      }
      case "lastMonth": {
        const d = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const d2 = new Date(today.getFullYear(), today.getMonth(), 0);
        from = d.toISOString().split("T")[0];
        setDateTo(d2.toISOString().split("T")[0]);
        setDateFrom(from);
        setTimeout(() => setIsLoading(false), 400);
        return;
      }
      case "year": {
        const d = new Date(today.getFullYear(), 0, 1);
        from = d.toISOString().split("T")[0];
        break;
      }
    }
    setDateFrom(from);
    setDateTo(to);
    setTimeout(() => setIsLoading(false), 400);
  };

  const handleGo = () => {
    setIsLoading(true);
    setActiveRange("");
    setTimeout(() => setIsLoading(false), 400);
  };

  const exportToCSV = (filename: string) => {
    const headers = columns.map((c) => c.label).join(",");
    const csvRows = filteredData.map((r) =>
      columns.map((c) => `"${(r as any)[c.key]}"`).join(",")
    );
    const totalRow = `"Total",${totals.opening.toFixed(2)},${totals.inflow.toFixed(2)},${totals.bbIn.toFixed(2)},${totals.outflow.toFixed(2)},${totals.bbOut.toFixed(2)},${totals.expense.toFixed(2)},${totals.closing.toFixed(2)}`;
    const csv = [headers, ...csvRows, totalRow].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const text = filteredData
      .map((r) => `${r.name} | Opening: ৳${r.opening} | Closing: ৳${r.closing}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    alert(`Copied ${filteredData.length} record(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(`cash-flow-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };

  const handleCSV = () => {
    exportToCSV(`cash-flow-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };

  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const getTypeIcon = (type: string) => {
    if (type === "Bank") return Building2;
    if (type === "Cash") return Banknote;
    if (type === "Mobile Banking") return CreditCard;
    return Wallet;
  };

  // 🎯 Theme-connected Type Badge
  const getTypeBadge = (type: string) => {
    const map: Record<string, string> = {
      Bank: "bg-signal-tint text-signal border-signal/30",
      Cash: "bg-warning-tint text-warning border-warning/30",
      "Mobile Banking": "bg-violet-accent-tint text-violet-accent border-violet-accent/30",
      Service: "bg-success-tint text-success border-success/30",
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
                Cash Flow Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track all cash inflow, outflow, and closing balances across accounts.
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border",
              netFlow >= 0
                ? "bg-success-tint text-success border-success/30"
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}>
              {netFlow >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              Net Flow: {netFlow >= 0 ? "+" : "-"}৳{formatCurrency(Math.abs(netFlow))}
            </div>
          </div>

          {/* 🎯 Compact Stat Cards — Theme-Based Solid Colors */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* Opening — Teal */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-signal text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Opening</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.opening)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Inflow — Success */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-success text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Inflow</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.inflow + totals.bbIn)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Outflow — Destructive */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-destructive text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Outflow</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.outflow + totals.bbOut + totals.expense)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Closing — Violet */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-violet-accent text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Closing</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.closing)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-signal" />
                <span className="font-semibold text-sm text-signal">From Date:</span>
              </div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setActiveRange(""); }}
                className="rounded-xl w-44 border-slate-200 text-signal"
              />
              <span className="font-semibold text-sm text-signal">To Date:</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setActiveRange(""); }}
                className="rounded-xl w-44 border-slate-200 text-signal"
              />
              <Button
                onClick={handleGo}
                disabled={isLoading}
                className="rounded-xl bg-signal text-white hover:bg-signal-hover border-0 px-6 shadow-md"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading...
                  </>
                ) : (
                  "Go"
                )}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickRanges.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleQuickRange(r.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    activeRange === r.id
                      ? "bg-signal text-white border-signal shadow-md"
                      : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Flow Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <PieChart className="w-5 h-5 text-signal" />
              <h2 className="font-heading font-bold text-lg text-signal">Inflow vs Outflow</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-success flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3" /> Total Inflow
                  </span>
                  <span className="text-signal">৳{formatCurrency(totals.inflow + totals.bbIn)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totals.inflow + totals.bbIn + totals.outflow + totals.bbOut + totals.expense > 0
                          ? ((totals.inflow + totals.bbIn) /
                              (totals.inflow + totals.bbIn + totals.outflow + totals.bbOut + totals.expense)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-destructive flex items-center gap-1">
                    <ArrowDownRight className="w-3 h-3" /> Total Outflow
                  </span>
                  <span className="text-signal">৳{formatCurrency(totals.outflow + totals.bbOut + totals.expense)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full transition-all duration-500"
                    style={{
                      width: `${
                        totals.inflow + totals.bbIn + totals.outflow + totals.bbOut + totals.expense > 0
                          ? ((totals.outflow + totals.bbOut + totals.expense) /
                              (totals.inflow + totals.bbIn + totals.outflow + totals.bbOut + totals.expense)) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <TableToolbar
            title="Cash Flow List"
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
              <table className="w-full text-sm min-w-[1300px]">
                <thead>
                  <tr className="bg-signal text-white">
                    <th className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap w-10"></th>
                    {columns.map((c) => (
                      <th key={c.key} className="text-right px-4 py-4 font-semibold text-xs whitespace-nowrap first:text-left">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-slate-500">
                        <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-40 animate-spin text-signal" />
                        <p className="font-semibold text-signal">Loading cash flow data...</p>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((r) => {
                      const TypeIcon = getTypeIcon(r.type);
                      const isExpanded = expandedRow === r.id;
                      return (
                        <React.Fragment key={r.id}>
                          <tr
                            className={cn(
                              "border-t border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer",
                              isExpanded && "bg-signal-tint"
                            )}
                            onClick={() => setExpandedRow(isExpanded ? null : r.id)}
                          >
                            <td className="px-4 py-4">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-signal" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400" />
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center shrink-0">
                                  <TypeIcon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="font-semibold text-sm text-signal">{r.name}</p>
                                  <span className={cn(
                                    "inline-flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded border mt-0.5",
                                    getTypeBadge(r.type)
                                  )}>
                                    {r.type}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-right text-signal font-semibold">
                              ৳{formatCurrency(r.opening)}
                            </td>
                            <td className="px-4 py-4 text-right text-success font-semibold">
                              +৳{formatCurrency(r.inflow)}
                            </td>
                            <td className="px-4 py-4 text-right text-success">
                              {r.bbIn > 0 ? `+৳${formatCurrency(r.bbIn)}` : "—"}
                            </td>
                            <td className="px-4 py-4 text-right text-destructive font-semibold">
                              {r.outflow > 0 ? `-৳${formatCurrency(r.outflow)}` : "—"}
                            </td>
                            <td className="px-4 py-4 text-right text-destructive">
                              {r.bbOut > 0 ? `-৳${formatCurrency(r.bbOut)}` : "—"}
                            </td>
                            <td className="px-4 py-4 text-right text-destructive">
                              {r.expense > 0 ? `-৳${formatCurrency(r.expense)}` : "—"}
                            </td>
                            <td className="px-4 py-4 text-right font-bold text-signal">
                              ৳{formatCurrency(r.closing)}
                            </td>
                          </tr>

                          {isExpanded && (
                            <tr className="bg-slate-50 border-t border-slate-100">
                              <td colSpan={columns.length + 1} className="px-6 py-4">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <p className="text-slate-500 font-semibold uppercase mb-1">Net Flow</p>
                                    <p className={cn(
                                      "font-bold text-sm",
                                      r.inflow + r.bbIn - r.outflow - r.bbOut - r.expense >= 0
                                        ? "text-success"
                                        : "text-destructive"
                                    )}>
                                      ৳{formatCurrency(r.inflow + r.bbIn - r.outflow - r.bbOut - r.expense)}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <p className="text-slate-500 font-semibold uppercase mb-1">Total In</p>
                                    <p className="font-bold text-sm text-success">
                                      ৳{formatCurrency(r.inflow + r.bbIn)}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <p className="text-slate-500 font-semibold uppercase mb-1">Total Out</p>
                                    <p className="font-bold text-sm text-destructive">
                                      ৳{formatCurrency(r.outflow + r.bbOut + r.expense)}
                                    </p>
                                  </div>
                                  <div className="p-3 rounded-xl bg-white border border-slate-200">
                                    <p className="text-slate-500 font-semibold uppercase mb-1">Growth</p>
                                    <p className={cn(
                                      "font-bold text-sm",
                                      r.closing >= r.opening ? "text-success" : "text-destructive"
                                    )}>
                                      {r.opening > 0 ? (((r.closing - r.opening) / r.opening) * 100).toFixed(1) : "0"}%
                                    </p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-slate-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-signal">No cash flow records found</p>
                        <p className="text-xs mt-1">Try adjusting your date range or search</p>
                      </td>
                    </tr>
                  )}
                </tbody>
                {!isLoading && paginatedData.length > 0 && (
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                    <tr>
                      <td></td>
                      <td className="px-4 py-4 text-signal">Total ({filteredData.length})</td>
                      <td className="px-4 py-4 text-right text-signal">
                        ৳{formatCurrency(totals.opening)}
                      </td>
                      <td className="px-4 py-4 text-right text-success">
                        +৳{formatCurrency(totals.inflow)}
                      </td>
                      <td className="px-4 py-4 text-right text-success">
                        {totals.bbIn > 0 ? `+৳${formatCurrency(totals.bbIn)}` : "—"}
                      </td>
                      <td className="px-4 py-4 text-right text-destructive">
                        {totals.outflow > 0 ? `-৳${formatCurrency(totals.outflow)}` : "—"}
                      </td>
                      <td className="px-4 py-4 text-right text-destructive">
                        {totals.bbOut > 0 ? `-৳${formatCurrency(totals.bbOut)}` : "—"}
                      </td>
                      <td className="px-4 py-4 text-right text-destructive">
                        {totals.expense > 0 ? `-৳${formatCurrency(totals.expense)}` : "—"}
                      </td>
                      <td className="px-4 py-4 text-right text-signal">
                        ৳{formatCurrency(totals.closing)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(n) => { setRowsPerPage(n); setCurrentPage(1); }}
              onPageChange={setCurrentPage}
              totalItems={filteredData.length}
              startIndex={startIndex}
            />
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/20 mt-6">
            <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Tip:</span> Click on any row to see detailed breakdown including Net Flow,
              Total In, Total Out, and Growth percentage. Use date filters to narrow down specific periods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}