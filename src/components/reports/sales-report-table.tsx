"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Copy,
  Printer,
  FileDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  BarChart3,
  Trophy,
  Medal,
  Award,
  Calendar,
  ArrowUpDown,
  Eye,
  FileSpreadsheet,
  PieChart,
} from "lucide-react";

export interface SalesRow {
  year: string;
  month: string;
  sales: number;
  amount: number;
}

interface SalesReportTableProps {
  title: string;
  rows: SalesRow[];
}

// 🎯 মাস অনুযায়ী কালার (সব মাসের জন্য আলাদা রঙ)
const monthColors: Record<string, { bg: string; text: string; gradient: string }> = {
  January: { bg: "bg-blue-500/10", text: "text-blue-600", gradient: "from-blue-500 to-cyan-500" },
  February: { bg: "bg-pink-500/10", text: "text-pink-600", gradient: "from-pink-500 to-rose-500" },
  March: { bg: "bg-emerald-500/10", text: "text-emerald-600", gradient: "from-emerald-500 to-teal-500" },
  April: { bg: "bg-amber-500/10", text: "text-amber-600", gradient: "from-amber-500 to-orange-500" },
  May: { bg: "bg-violet-500/10", text: "text-violet-600", gradient: "from-violet-500 to-purple-500" },
  June: { bg: "bg-cyan-500/10", text: "text-cyan-600", gradient: "from-cyan-500 to-blue-500" },
  July: { bg: "bg-orange-500/10", text: "text-orange-600", gradient: "from-orange-500 to-red-500" },
  August: { bg: "bg-teal-500/10", text: "text-teal-600", gradient: "from-teal-500 to-emerald-500" },
  September: { bg: "bg-indigo-500/10", text: "text-indigo-600", gradient: "from-indigo-500 to-violet-500" },
  October: { bg: "bg-rose-500/10", text: "text-rose-600", gradient: "from-rose-500 to-pink-500" },
  November: { bg: "bg-lime-500/10", text: "text-lime-600", gradient: "from-lime-500 to-green-500" },
  December: { bg: "bg-red-500/10", text: "text-red-600", gradient: "from-red-500 to-rose-500" },
};

const getMonthColor = (month: string) => {
  return monthColors[month] || { bg: "bg-muted", text: "text-muted-foreground", gradient: "from-slate-500 to-gray-500" };
};

// 🎯 র‍্যাঙ্কিং ব্যাজ
const getRankBadge = (index: number) => {
  if (index === 0) return { icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10", label: "Top" };
  if (index === 1) return { icon: Medal, color: "text-slate-400", bg: "bg-slate-400/10", label: "2nd" };
  if (index === 2) return { icon: Award, color: "text-orange-600", bg: "bg-orange-600/10", label: "3rd" };
  return null;
};

export function SalesReportTable({ title, rows }: SalesReportTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<keyof SalesRow>("amount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [yearFilter, setYearFilter] = useState("All");

  // 🎯 ইউনিক ইয়ার লিস্ট
  const years = useMemo(() => ["All", ...Array.from(new Set(rows.map(r => r.year)))], [rows]);

  // 🎯 স্ট্যাট ক্যালকুলেশন
  const stats = useMemo(() => {
    const totalSales = rows.reduce((acc, r) => acc + r.sales, 0);
    const totalAmount = rows.reduce((acc, r) => acc + r.amount, 0);
    const avgSales = Math.round(totalSales / rows.length) || 0;
    const bestRow = [...rows].sort((a, b) => b.amount - a.amount)[0];
    return { totalSales, totalAmount, avgSales, bestRow };
  }, [rows]);

  // 🎯 ফিল্টার ও সর্ট
  const processedRows = useMemo(() => {
    let result = [...rows];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(r =>
        r.month.toLowerCase().includes(q) ||
        r.year.includes(q) ||
        String(r.sales).includes(q) ||
        String(r.amount).includes(q)
      );
    }

    if (yearFilter !== "All") {
      result = result.filter(r => r.year === yearFilter);
    }

    result.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
      }
      return sortOrder === "desc"
        ? String(bVal).localeCompare(String(aVal))
        : String(aVal).localeCompare(String(bVal));
    });

    return result;
  }, [rows, searchTerm, sortKey, sortOrder, yearFilter]);

  const handleSort = (key: keyof SalesRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const SortHeader = ({ label, sortKeyName }: { label: string; sortKeyName: keyof SalesRow }) => (
    <th
      className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap cursor-pointer hover:bg-white/10 transition-colors"
      onClick={() => handleSort(sortKeyName)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={cn("h-3 w-3 opacity-50", sortKey === sortKeyName && "opacity-100")} />
      </div>
    </th>
  );

  // 🎯 সর্বোচ্চ অ্যামাউন্ট (চার্টের জন্য)
  const maxAmount = Math.max(...rows.map(r => r.amount), 1);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* 🎯 Hero Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3" />
              Sales Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive breakdown of sales performance across months.
            </p>
          </div>

          {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <BarChart3 className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total Sales</p>
      <p className="text-lg font-heading font-bold">{stats.totalSales.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <DollarSign className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Amount</p>
      <p className="text-lg font-heading font-bold text-emerald-600">৳{stats.totalAmount.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
      <TrendingUp className="w-4 h-4 text-violet-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Sales</p>
      <p className="text-lg font-heading font-bold text-violet-600">{stats.avgSales.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <Trophy className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Best</p>
      <p className="text-lg font-heading font-bold text-amber-600 truncate">{stats.bestRow?.month || "N/A"}</p>
    </div>
  </div>
</div>

          {/* 🎯 Mini Sales Trend Chart */}
          <div className="bg-card rounded-2xl border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-sm font-bold flex items-center gap-2">
                <PieChart className="h-4 w-4 text-signal" />
                Sales Trend
              </h3>
              <span className="text-xs text-muted-foreground">{rows.length} entries</span>
            </div>
            <div className="flex items-end gap-1.5 h-20">
              {rows.slice(0, 12).map((r, i) => {
                const height = (r.amount / maxAmount) * 100;
                const mc = getMonthColor(r.month);
                return (
                  <div
                    key={i}
                    className="flex-1 group relative"
                    title={`${r.month}: ৳${r.amount.toLocaleString()}`}
                  >
                    <div
                      className={cn("w-full rounded-t-md bg-gradient-to-t transition-all group-hover:opacity-80", mc.gradient)}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {r.month.slice(0, 3)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🎯 Actions + Search Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by month, year or amount…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* Year Filter */}
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-signal/30 outline-none"
            >
              {years.map(y => <option key={y} value={y}>{y === "All" ? "All Years" : y}</option>)}
            </select>

            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-signal text-white text-sm font-semibold hover:bg-signal/90 transition-all">
              <Filter className="h-3.5 w-3.5" />
              Filter
            </button>

            {/* Export Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <button className="flex items-center gap-1.5 border rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-card hover:shadow-md transition-all">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <button className="flex items-center gap-1.5 border rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-card hover:shadow-md transition-all">
                <Printer className="h-3.5 w-3.5" />
                Print
              </button>
              <button className="flex items-center gap-1.5 border rounded-xl px-3.5 py-2.5 text-xs font-semibold bg-card hover:shadow-md transition-all">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Excel
              </button>
              <button className="flex items-center gap-1.5 bg-gradient-to-r from-signal to-violet-accent text-white rounded-xl px-3.5 py-2.5 text-xs font-semibold shadow-md shadow-signal/20 hover:scale-105 transition-all">
                <FileDown className="h-3.5 w-3.5" />
                PDF
              </button>
            </div>
          </div>

          {/* 🎯 Enhanced Table */}
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap w-16">Rank</th>
                    <SortHeader label="Year" sortKeyName="year" />
                    <SortHeader label="Month" sortKeyName="month" />
                    <SortHeader label="Sales" sortKeyName="sales" />
                    <SortHeader label="Amount" sortKeyName="amount" />
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Performance</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {processedRows.length > 0 ? (
                    processedRows.map((r, i) => {
                      const rank = getRankBadge(i);
                      const RankIcon = rank?.icon;
                      const mc = getMonthColor(r.month);
                      const percent = Math.round((r.amount / maxAmount) * 100);

                      return (
                        <tr key={i} className="border-t hover:bg-signal-tint/30 transition-colors group">
                          <td className="px-5 py-4">
                            {rank && RankIcon ? (
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", rank.bg)}>
                                <RankIcon className={cn("h-4 w-4", rank.color)} />
                              </div>
                            ) : (
                              <span className="text-xs font-mono text-muted-foreground pl-2">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                              {r.year}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn("inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold", mc.bg, mc.text)}>
                              {r.month}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-mono font-semibold">{r.sales.toLocaleString()}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-base text-signal">৳{r.amount.toLocaleString()}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="w-28">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground">{percent}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn("h-full rounded-full bg-gradient-to-r", mc.gradient)}
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors" title="View">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center">
                            <BarChart3 className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold">No sales data found</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{processedRows.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{processedRows.length}</span>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">1</button>
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}