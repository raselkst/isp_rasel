"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import {
  Search, ChevronLeft, ChevronRight, ArrowUpDown, Copy, Printer,
  FileText, FileSpreadsheet, Plus, Edit3, Trash2, X, Save,
  Building2, DollarSign, TrendingUp, BarChart3, RefreshCw,
  Download, CheckCircle2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportRow {
  id: number;
  year: string;
  month: string;
  reseller: string;
  count: number;
  amount: number;
}

const initialData: ReportRow[] = [
  { id: 1, year: "2026", month: "September", reseller: "Poli Network Pop", count: 152, amount: 75453.33 },
  { id: 2, year: "2026", month: "September", reseller: "Poli Network", count: 2, amount: 698.0 },
  { id: 3, year: "2026", month: "August", reseller: "Poli Network Pop", count: 134, amount: 64993.34 },
  { id: 4, year: "2026", month: "August", reseller: "ZS Cable Network", count: 110, amount: 53970.0 },
  { id: 5, year: "2026", month: "August", reseller: "Poli Network", count: 6, amount: 3049.0 },
  { id: 6, year: "2026", month: "July", reseller: "Poli Network Pop", count: 128, amount: 63500.0 },
  { id: 7, year: "2026", month: "July", reseller: "ZS Cable Network", count: 103, amount: 50113.0 },
  { id: 8, year: "2026", month: "July", reseller: "Poli Network", count: 7, amount: 3300.0 },
  { id: 9, year: "2026", month: "June", reseller: "Poli Network Pop", count: 123, amount: 60500.0 },
  { id: 10, year: "2026", month: "June", reseller: "ZS Cable Network", count: 115, amount: 55307.0 },
  { id: 11, year: "2025", month: "December", reseller: "Poli Network Pop", count: 98, amount: 48250.0 },
  { id: 12, year: "2025", month: "December", reseller: "ZS Cable Network", count: 87, amount: 41520.0 },
];

const emptyRow: ReportRow = {
  id: 0,
  year: new Date().getFullYear().toString(),
  month: "",
  reseller: "",
  count: 0,
  amount: 0,
};

const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const resellersList = ["Poli Network Pop", "Poli Network", "ZS Cable Network", "AR Internet", "Online Network"];
const yearsList = ["2026", "2025", "2024"];

export default function MerchantMonthlyReportPage() {
  const [data, setData] = useState<ReportRow[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("All Years");
  const [monthFilter, setMonthFilter] = useState("All Months");
  const [resellerFilter, setResellerFilter] = useState("All Resellers");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState<ReportRow | null>(null);
  const [newRow, setNewRow] = useState<ReportRow>({ ...emptyRow });

  const filteredData = useMemo(() => {
    let filtered = data.filter((item) => {
      const matchesSearch =
        item.reseller.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.year.includes(searchTerm);
      const matchesYear = yearFilter === "All Years" || item.year === yearFilter;
      const matchesMonth = monthFilter === "All Months" || item.month === monthFilter;
      const matchesReseller = resellerFilter === "All Resellers" || item.reseller === resellerFilter;
      return matchesSearch && matchesYear && matchesMonth && matchesReseller;
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
  }, [data, searchTerm, yearFilter, monthFilter, resellerFilter, sortKey, sortOrder]);

  const stats = useMemo(() => {
    const totalAmount = filteredData.reduce((acc, r) => acc + r.amount, 0);
    const totalCount = filteredData.reduce((acc, r) => acc + r.count, 0);
    const totalMerchants = new Set(filteredData.map((r) => r.reseller)).size;
    const avgAmount = filteredData.length > 0 ? totalAmount / filteredData.length : 0;
    return { totalAmount, totalCount, totalMerchants, avgAmount, totalRecords: filteredData.length };
  }, [filteredData]);

  const totalEntries = filteredData.length;
  const totalPages = Math.ceil(totalEntries / entriesPerPage) || 1;
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  const allSelected = paginatedData.length > 0 && paginatedData.every((r) => selectedRows.includes(r.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedData.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedData.map((r) => r.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setYearFilter("All Years");
    setMonthFilter("All Months");
    setResellerFilter("All Resellers");
    setCurrentPage(1);
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRow.month || !newRow.reseller) {
      alert("Month and Reseller are required!");
      return;
    }
    const newId = Math.max(...data.map((r) => r.id), 0) + 1;
    setData((prev) => [{ ...newRow, id: newId }, ...prev]);
    setNewRow({ ...emptyRow });
    setAddModal(false);
    alert(`✅ Record added successfully!`);
  };

  const handleSaveEdit = () => {
    if (!editModal) return;
    setData((prev) => prev.map((r) => (r.id === editModal.id ? editModal : r)));
    setEditModal(null);
    alert("Record updated successfully!");
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this record? This cannot be undone.")) {
      setData((prev) => prev.filter((r) => r.id !== id));
      setSelectedRows((prev) => prev.filter((i) => i !== id));
      alert("Record deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one record.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} record(s)?`)) {
      setData((prev) => prev.filter((r) => !selectedRows.includes(r.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} record(s) deleted.`);
    }
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    const headers = "SL\tYear\tMonth\tReseller\tCount\tAmount";
    const rows = filteredData.map((r, i) => `${i + 1}\t${r.year}\t${r.month}\t${r.reseller}\t${r.count}\t${r.amount}`);
    const text = [headers, ...rows].join("\n");
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Merchant Monthly Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #066F6F; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #066F6F; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
      <h1>Merchant Monthly Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <table>
        <thead><tr><th>SL</th><th>Year</th><th>Month</th><th>Reseller</th><th>Count</th><th>Amount</th></tr></thead>
        <tbody>
          ${filteredData.map((r, i) => `<tr><td>${i + 1}</td><td>${r.year}</td><td>${r.month}</td><td>${r.reseller}</td><td>${r.count}</td><td>${r.amount.toFixed(2)}</td></tr>`).join("")}
        </tbody>
      </table>
      <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); }</script>
      </body></html>
    `);
    printWindow.document.close();
  };

  const handleExportCSV = () => {
    const headers = ["SL", "Year", "Month", "Reseller", "Count", "Amount"];
    const rows = filteredData.map((r, i) => [i + 1, r.year, r.month, r.reseller, r.count, r.amount.toFixed(2)]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${c}"`).join(",")).join("\n");
    triggerDownload(new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }), `merchant-monthly-report-${Date.now()}.csv`);
    alert("CSV exported!");
  };

  const handleExportExcel = () => {
    const headers = ["SL", "Year", "Month", "Reseller", "Count", "Amount"];
    const rows = filteredData.map((r, i) => [i + 1, r.year, r.month, r.reseller, r.count, r.amount.toFixed(2)]);
    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head><body>
      <table border="1">
        <thead><tr style="background:#066F6F;color:#fff;">${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></body></html>`;
    triggerDownload(new Blob([tableHTML], { type: "application/vnd.ms-excel" }), `merchant-monthly-report-${Date.now()}.xls`);
    alert("Excel exported!");
  };

  const handleExportPDF = () => {
    handlePrint();
  };

  const formatNumber = (num: number) => num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
                Reports · Merchant Analytics
              </p>
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
                Merchant Monthly Report
              </h1>
            </div>
            <button
              onClick={() => setAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" /> Add Record
            </button>
          </div>

          {/* Compact Stat Cards - Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Records</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.totalRecords}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Amount</p>
                <p className="text-lg font-heading font-bold text-success">৳{formatNumber(stats.totalAmount)}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Merchants</p>
                <p className="text-lg font-heading font-bold text-violet-accent">{stats.totalMerchants}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Avg</p>
                <p className="text-lg font-heading font-bold text-warning">৳{formatNumber(stats.avgAmount)}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search by reseller, month, year…"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option>All Years</option>
              {yearsList.map((y) => <option key={y}>{y}</option>)}
            </select>
            <select
              value={monthFilter}
              onChange={(e) => { setMonthFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option>All Months</option>
              {monthsList.map((m) => <option key={m}>{m}</option>)}
            </select>
            <select
              value={resellerFilter}
              onChange={(e) => { setResellerFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option>All Resellers</option>
              {resellersList.map((r) => <option key={r}>{r}</option>)}
            </select>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>

            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete {selectedRows.length}
              </button>
            )}
          </div>

          {/* Export Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-signal hover:bg-slate-50 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-signal hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-signal hover:bg-slate-50 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-signal hover:bg-slate-50 transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-signal hover:bg-slate-50 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs text-signal"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-signal text-white">
                  <tr>
                    <th className="px-4 py-3.5 w-12">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleSelectAll}
                        className="rounded cursor-pointer"
                      />
                    </th>
                    {[
                      { label: "SL", key: "id" },
                      { label: "Year", key: "year" },
                      { label: "Month", key: "month" },
                      { label: "Reseller", key: "reseller" },
                      { label: "Count", key: "count" },
                      { label: "Amount", key: "amount" },
                    ].map((col) => (
                      <th
                        key={col.key}
                        className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors select-none"
                        onClick={() => handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          <ArrowUpDown className="w-3 h-3 opacity-70" />
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-3.5 font-semibold text-xs uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row, index) => {
                      const isSelected = selectedRows.includes(row.id);
                      return (
                        <tr
                          key={row.id}
                          className={cn(
                            "hover:bg-slate-50 transition-colors",
                            isSelected && "bg-signal-tint"
                          )}
                        >
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(row.id)}
                              className="rounded cursor-pointer accent-signal"
                            />
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-500">{startIndex + index + 1}</td>
                          <td className="px-4 py-3">
                            <span className="bg-signal-tint text-signal text-xs font-bold px-2 py-1 rounded-md border border-signal/30">
                              {row.year}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-signal">{row.month}</td>
                          <td className="px-4 py-3 font-semibold text-signal">{row.reseller}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="bg-violet-accent-tint text-violet-accent text-xs font-bold px-2 py-1 rounded-md border border-violet-accent/30">
                              {row.count}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-bold text-signal">৳{formatNumber(row.amount)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditModal({ ...row })}
                                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                                title="Edit"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(row.id)}
                                className="p-1.5 rounded-lg hover:bg-destructive/10 text-slate-500 hover:text-destructive transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-16 text-center text-slate-500">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold text-signal">No data available in table</p>
                        <p className="text-xs mt-1">Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-slate-100 gap-4 text-sm">
              <div className="text-slate-500">
                Showing {totalEntries > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || totalEntries === 0}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-semibold text-xs transition-all",
                        currentPage === page
                          ? "bg-signal text-white shadow-md"
                          : "border border-slate-200 bg-white hover:bg-slate-50 text-signal"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalEntries === 0}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {addModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Add Record
                </h3>
                <p className="text-xs text-slate-500 mt-1">Add new merchant monthly record.</p>
              </div>
              <button
                onClick={() => setAddModal(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Year</label>
                  <select
                    value={newRow.year}
                    onChange={(e) => setNewRow({ ...newRow, year: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  >
                    {yearsList.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">
                    Month <span className="text-destructive">*</span>
                  </label>
                  <select
                    value={newRow.month}
                    onChange={(e) => setNewRow({ ...newRow, month: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  >
                    <option value="">Select Month</option>
                    {monthsList.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">
                  Reseller <span className="text-destructive">*</span>
                </label>
                <select
                  value={newRow.reseller}
                  onChange={(e) => setNewRow({ ...newRow, reseller: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                >
                  <option value="">Select Reseller</option>
                  {resellersList.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Count</label>
                  <input
                    type="number"
                    value={newRow.count}
                    onChange={(e) => setNewRow({ ...newRow, count: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Amount (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRow.amount}
                    onChange={(e) => setNewRow({ ...newRow, amount: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Record Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <h3 className="font-heading text-2xl font-bold text-signal">
                Edit Record
              </h3>
              <button
                onClick={() => setEditModal(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Year</label>
                  <select
                    value={editModal.year}
                    onChange={(e) => setEditModal({ ...editModal, year: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  >
                    {yearsList.map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Month</label>
                  <select
                    value={editModal.month}
                    onChange={(e) => setEditModal({ ...editModal, month: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  >
                    {monthsList.map((m) => <option key={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Reseller</label>
                <select
                  value={editModal.reseller}
                  onChange={(e) => setEditModal({ ...editModal, reseller: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                >
                  {resellersList.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Count</label>
                  <input
                    type="number"
                    value={editModal.count}
                    onChange={(e) => setEditModal({ ...editModal, count: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Amount (৳)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editModal.amount}
                    onChange={(e) => setEditModal({ ...editModal, amount: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none text-signal"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}