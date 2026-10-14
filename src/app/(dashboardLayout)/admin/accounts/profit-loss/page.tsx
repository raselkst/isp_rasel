"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableToolbar, TablePagination } from "@/components/accounts/shared";
import {
  TrendingUp, TrendingDown, DollarSign, Percent, Calendar,
  RefreshCw, ArrowUpRight, ArrowDownRight, Info, BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockTransactions = [
  { id: 1, time: "2025-07-23", income: 12500, expense: 3200, description: "Daily Summary" },
  { id: 2, time: "2025-07-22", income: 18400, expense: 5100, description: "Daily Summary" },
  { id: 3, time: "2025-07-21", income: 9800, expense: 2800, description: "Daily Summary" },
  { id: 4, time: "2025-07-20", income: 15300, expense: 4500, description: "Daily Summary" },
  { id: 5, time: "2025-07-19", income: 21000, expense: 6200, description: "Daily Summary" },
  { id: 6, time: "2025-07-18", income: 11200, expense: 3100, description: "Daily Summary" },
  { id: 7, time: "2025-07-17", income: 16800, expense: 4900, description: "Daily Summary" },
  { id: 8, time: "2025-07-16", income: 13400, expense: 3800, description: "Daily Summary" },
  { id: 9, time: "2025-07-15", income: 19200, expense: 5500, description: "Daily Summary" },
  { id: 10, time: "2025-07-14", income: 14600, expense: 4100, description: "Daily Summary" },
];

const quickRanges = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "year", label: "This Year" },
];

export default function ProfitLossPage() {
  const [dateFrom, setDateFrom] = useState("2025-07-01");
  const [dateTo, setDateTo] = useState("2025-07-23");
  const [activeRange, setActiveRange] = useState<string>("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = useMemo(() => {
    return mockTransactions.filter((t) => {
      const tDate = new Date(t.time);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      const inRange = tDate >= from && tDate <= to;
      const matchesSearch =
        !searchTerm ||
        t.time.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase());
      return inRange && matchesSearch;
    });
  }, [dateFrom, dateTo, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const totals = useMemo(() => {
    const income = filteredData.reduce((sum, t) => sum + t.income, 0);
    const expense = filteredData.reduce((sum, t) => sum + t.expense, 0);
    const profit = income - expense;
    const margin = income > 0 ? (profit / income) * 100 : 0;
    return { income, expense, profit, margin };
  }, [filteredData]);

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
    const headers = "Time,Income,Expense,Profit/Loss";
    const rows = filteredData
      .map((t) => `"${t.time}",${t.income},${t.expense},${t.income - t.expense}`)
      .join("\n");
    const csv = `${headers}\n${rows}\n"Total",${totals.income},${totals.expense},${totals.profit}`;
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
      .map((t) => `${t.time} | Income: ৳${t.income} | Expense: ৳${t.expense} | P/L: ৳${t.income - t.expense}`)
      .join("\n");
    navigator.clipboard.writeText(`${text}\n\nTotal Income: ৳${totals.income}\nTotal Expense: ৳${totals.expense}\nNet Profit: ৳${totals.profit}`);
    alert(`Copied ${filteredData.length} record(s) to clipboard!`);
  };

  const handleExcel = () => {
    exportToCSV(`profit-loss-${Date.now()}.xls`);
    alert("Excel file downloaded!");
  };

  const handleCSV = () => {
    exportToCSV(`profit-loss-${Date.now()}.csv`);
    alert("CSV file downloaded!");
  };

  const handlePDF = () => {
    window.print();
    alert("Print dialog opened. Save as PDF to export.");
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                Profit &amp; Loss Report
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Track your income, expenses, and net profitability.
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border",
              totals.profit >= 0
                ? "bg-success-tint text-success border-success/30"
                : "bg-destructive/10 text-destructive border-destructive/30"
            )}>
              {totals.profit >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              {totals.profit >= 0 ? "Profitable" : "In Loss"}
            </div>
          </div>

          {/* 🎯 Compact Stat Cards — Theme-Based Solid Colors */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* Total Income — Success */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-success text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Income</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.income)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Total Expense — Destructive */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-destructive text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ArrowDownRight className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Expense</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.expense)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Net Profit/Loss — Teal or Destructive */}
            <div className={cn(
              "relative overflow-hidden rounded-xl p-3 flex items-center gap-3 text-white shadow-md",
              totals.profit >= 0 ? "bg-signal" : "bg-destructive"
            )}>
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Net P/L</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(totals.profit)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Profit Margin — Warning */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-warning text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Margin</p>
                <p className="text-lg font-heading font-bold">{totals.margin.toFixed(1)}%</p>
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

            {/* Quick Range Buttons */}
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

          {/* Visual Bar Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="w-5 h-5 text-signal" />
              <h2 className="font-heading font-bold text-lg text-signal">Income vs Expense Overview</h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-success">Income</span>
                  <span className="text-signal">৳{formatCurrency(totals.income)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-success rounded-full transition-all duration-500"
                    style={{
                      width: `${totals.income + totals.expense > 0
                        ? (totals.income / (totals.income + totals.expense)) * 100
                        : 0}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span className="text-destructive">Expense</span>
                  <span className="text-signal">৳{formatCurrency(totals.expense)}</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-destructive rounded-full transition-all duration-500"
                    style={{
                      width: `${totals.income + totals.expense > 0
                        ? (totals.expense / (totals.income + totals.expense)) * 100
                        : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
              <span className="text-sm font-semibold text-signal">Net Result</span>
              <span className={cn(
                "font-heading text-xl font-bold",
                totals.profit >= 0 ? "text-success" : "text-destructive"
              )}>
                ৳{formatCurrency(totals.profit)}
              </span>
            </div>
          </div>

          {/* Table Toolbar */}
          <TableToolbar
            title="Detailed Breakdown"
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
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-signal text-white">
                    <th className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">Time</th>
                    <th className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">Description</th>
                    <th className="text-right px-6 py-4 font-semibold text-xs whitespace-nowrap">Income</th>
                    <th className="text-right px-6 py-4 font-semibold text-xs whitespace-nowrap">Expense</th>
                    <th className="text-right px-6 py-4 font-semibold text-xs whitespace-nowrap">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        <RefreshCw className="w-8 h-8 mx-auto mb-3 opacity-40 animate-spin" />
                        <p className="font-semibold">Loading data...</p>
                      </td>
                    </tr>
                  ) : paginatedData.length > 0 ? (
                    paginatedData.map((t) => {
                      const pl = t.income - t.expense;
                      return (
                        <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-signal">{t.time}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs">{t.description}</td>
                          <td className="px-6 py-4 text-right text-success font-semibold">
                            ৳{formatCurrency(t.income)}
                          </td>
                          <td className="px-6 py-4 text-right text-destructive font-semibold">
                            ৳{formatCurrency(t.expense)}
                          </td>
                          <td className={cn(
                            "px-6 py-4 text-right font-bold",
                            pl >= 0 ? "text-success" : "text-destructive"
                          )}>
                            {pl >= 0 ? "+" : "-"}৳{formatCurrency(Math.abs(pl))}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                        <Info className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-signal">No records found</p>
                        <p className="text-xs mt-1">Try adjusting your date range or search</p>
                      </td>
                    </tr>
                  )}
                </tbody>
                {!isLoading && paginatedData.length > 0 && (
                  <tfoot className="bg-slate-50 font-bold border-t-2 border-slate-200">
                    <tr>
                      <td className="px-6 py-4 text-signal" colSpan={2}>Total</td>
                      <td className="px-6 py-4 text-right text-success">
                        ৳{formatCurrency(totals.income)}
                      </td>
                      <td className="px-6 py-4 text-right text-destructive">
                        ৳{formatCurrency(totals.expense)}
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-right font-bold",
                        totals.profit >= 0 ? "text-success" : "text-destructive"
                      )}>
                        {totals.profit >= 0 ? "+" : "-"}৳{formatCurrency(Math.abs(totals.profit))}
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
              <span className="font-bold">Tip:</span> Use quick range buttons or custom dates to filter
              the report. Export your data as CSV, Excel, or PDF for accounting purposes. Negative values
              indicate a loss for that period.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}