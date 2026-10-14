"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download, Search, ArrowUpDown, ChevronLeft, ChevronRight,
  AlertCircle, FileText, CheckCircle2, XCircle, TrendingUp,
  Filter, RefreshCw, CalendarDays, CreditCard, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "sl", label: "SL" },
  { key: "planName", label: "Ref Plan Name" },
  { key: "total", label: "Total" },
  { key: "valid", label: "Valid" },
  { key: "invalid", label: "Invalid" },
];

const initialReports = [
  { id: 1, planName: "1Hour-Unlimited", total: 500, valid: 480, invalid: 20 },
  { id: 2, planName: "1Day-5GB", total: 1250, valid: 1200, invalid: 50 },
  { id: 3, planName: "7Day-50GB", total: 850, valid: 820, invalid: 30 },
  { id: 4, planName: "30Day-500GB", total: 620, valid: 600, invalid: 20 },
  { id: 5, planName: "3Day-15GB", total: 340, valid: 320, invalid: 20 },
  { id: 6, planName: "15Day-200GB", total: 180, valid: 175, invalid: 5 },
  { id: 7, planName: "1Month-Unlimited", total: 400, valid: 390, invalid: 10 },
  { id: 8, planName: "2Hour-Unlimited", total: 720, valid: 700, invalid: 20 },
];

export default function CardReportPage() {
  const [reports, setReports] = useState(initialReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Stat Calculations
  const stats = useMemo(() => {
    const total = reports.reduce((sum, r) => sum + r.total, 0);
    const valid = reports.reduce((sum, r) => sum + r.valid, 0);
    const invalid = reports.reduce((sum, r) => sum + r.invalid, 0);
    const validityRate = total > 0 ? ((valid / total) * 100).toFixed(1) : "0.0";
    return { total, valid, invalid, validityRate };
  }, [reports]);

  // Search Filter
  const filteredReports = useMemo(() => {
    return reports.filter((r) =>
      r.planName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [reports, searchTerm]);

  // Sort
  const sortedReports = useMemo(() => {
    if (!sortKey) return filteredReports;
    return [...filteredReports].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredReports, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedReports.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedReports = sortedReports.slice(startIndex, startIndex + rowsPerPage);

  // Sort Handler
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Export CSV
  const handleExport = () => {
    const headers = [...columns.map((c) => c.label), "Validity Rate"].join(",");
    const csvRows = sortedReports.map((r) => {
      const rate = ((r.valid / r.total) * 100).toFixed(1);
      return [...columns.map((col) => `"${(r as any)[col.key]}"`), `"${rate}%"`].join(",");
    });
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `card-report-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${sortedReports.length} report(s) to CSV.`);
  };

  // Refresh
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setReports(initialReports);
      setSearchTerm("");
      setDateFrom("");
      setDateTo("");
      setCurrentPage(1);
      setSortKey(null);
      setIsLoading(false);
      alert("Report refreshed successfully!");
    }, 800);
  };

  // Apply Date Filter
  const handleApplyFilter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`Filtered by date range.\nFrom: ${dateFrom || "Any"}\nTo: ${dateTo || "Any"}`);
    }, 600);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
    setSortKey(null);
    alert("Filters reset!");
  };

  // Validity Rate
  const getValidityRate = (valid: number, total: number) => {
    return total > 0 ? (valid / total) * 100 : 0;
  };

  // Validity Label
  const getValidityLabel = (rate: number) => {
    if (rate >= 95) return { label: "Excellent", color: "text-success", bg: "bg-success-tint" };
    if (rate >= 85) return { label: "Good", color: "text-warning", bg: "bg-warning-tint" };
    return { label: "Poor", color: "text-destructive", bg: "bg-destructive/10" };
  };

  const hasActiveFilters = searchTerm || dateFrom || dateTo || sortKey;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
                <CreditCard className="h-3 w-3" /> Card Analytics
              </p>
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
                Card Report Analytics
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 hover:bg-signal-tint"
              >
                <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} /> Refresh
              </Button>
              <Button
                onClick={handleExport}
                className="rounded-full gap-1.5 font-semibold bg-signal hover:bg-signal-hover text-white border-0 shadow-md"
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
            </div>
          </div>

          {/* Compact Stat Cards - এক লাইনে */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* Total */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-signal text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total.toLocaleString()}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Valid */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-success text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Valid</p>
                <p className="text-lg font-heading font-bold">{stats.valid.toLocaleString()}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Invalid */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-destructive text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Invalid</p>
                <p className="text-lg font-heading font-bold">{stats.invalid.toLocaleString()}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Rate */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-signal-light text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Rate</p>
                <p className="text-lg font-heading font-bold">{stats.validityRate}%</p>
              </div>
              <div className="w-12 h-1.5 rounded-full bg-white/25 overflow-hidden shrink-0">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${stats.validityRate}%` }}
                />
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Filter Panel */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-5 shadow-sm">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px] space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <Search className="w-3 h-3" /> Search Plan
                </label>
                <Input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search by plan name..."
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Date From
                </label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-xl w-44 border-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" /> Date To
                </label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-xl w-44 border-slate-200"
                />
              </div>

              <Button
                onClick={handleApplyFilter}
                className="rounded-xl font-semibold h-10 px-6 bg-signal hover:bg-signal-hover text-white border-0 shadow-md"
              >
                <Filter className="h-4 w-4 mr-2" /> Apply Filter
              </Button>

              {hasActiveFilters && (
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="rounded-xl font-semibold h-10 px-6 text-destructive border-destructive/30 hover:bg-destructive/5"
                >
                  <X className="h-4 w-4 mr-2" /> Reset
                </Button>
              )}
            </div>
          </div>

          {/* Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            {/* Rows per page */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>Show</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-sm text-signal"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>
              <div className="text-sm text-slate-500">
                Found <span className="font-semibold text-signal">{sortedReports.length}</span> plan(s)
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-signal text-white">
                    {columns.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleSort(c.key)}
                        className={cn(
                          "text-left px-6 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer transition-colors select-none",
                          sortKey === c.key ? "bg-signal-active" : "hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {c.label}
                          <ArrowUpDown className={cn("w-3 h-3", sortKey === c.key ? "opacity-100" : "opacity-60")} />
                        </div>
                      </th>
                    ))}
                    <th className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">
                      Validity Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <RefreshCw className="w-8 h-8 text-signal animate-spin" />
                          <p className="text-sm text-slate-500">Loading report...</p>
                        </div>
                      </td>
                    </tr>
                  ) : paginatedReports.length > 0 ? (
                    paginatedReports.map((r, index) => {
                      const rate = getValidityRate(r.valid, r.total);
                      const validityLabel = getValidityLabel(rate);
                      return (
                        <tr
                          key={r.id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-slate-500">{startIndex + index + 1}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-signal-tint flex items-center justify-center">
                                <FileText className="w-4 h-4 text-signal" />
                              </div>
                              <span className="font-semibold text-signal">{r.planName}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-signal">{r.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-success font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {r.valid.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 text-destructive font-semibold">
                              <XCircle className="w-3.5 h-3.5" />
                              {r.invalid.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-6 py-4 w-52">
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-semibold text-signal">{rate.toFixed(1)}%</span>
                                <span className={cn(
                                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                                  validityLabel.bg,
                                  validityLabel.color
                                )}>
                                  {validityLabel.label}
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                <div
                                  className={cn(
                                    "h-full transition-all duration-500",
                                    rate >= 95 ? "bg-success" : rate >= 85 ? "bg-warning" : "bg-destructive"
                                  )}
                                  style={{ width: `${rate}%` }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-16 text-center text-slate-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-signal">No report available in table</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                        {hasActiveFilters && (
                          <button
                            onClick={handleResetFilters}
                            className="mt-3 text-xs font-semibold text-signal hover:underline"
                          >
                            Reset Filters
                          </button>
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 text-sm">
              <div className="text-slate-500">
                Showing {sortedReports.length > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + rowsPerPage, sortedReports.length)} of {sortedReports.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-full h-8 w-8 border-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "rounded-full h-8 w-8 text-xs font-semibold",
                        currentPage === page
                          ? "bg-signal text-white"
                          : "border-slate-200 text-signal"
                      )}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && <span className="text-slate-500 px-1">...</span>}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-full h-8 w-8 border-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}