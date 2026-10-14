"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download, Printer, Search, Calendar, RefreshCw, Wallet,
  TrendingUp, DollarSign, Info, AlertCircle, Home, Building2, Users, Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

// POP ডেটা
const pops = [
  { id: "all", name: "All POPs" },
  { id: "pop1", name: "Poli Network Pop" },
  { id: "pop2", name: "Online Network Pop" },
  { id: "pop3", name: "ZS Cable Network Pop" },
];

const quickRanges = [
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "lastMonth", label: "Last Month" },
  { id: "year", label: "This Year" },
];

// 🎯 Section Table — Theme Connected
function SectionTable({
  title,
  icon: Icon,
  columns,
  rows,
  totalRow,
  searchTerm,
}: {
  title: string;
  icon: any;
  columns: string[];
  rows: string[][];
  totalRow?: string[];
  searchTerm: string;
}) {
  const filteredRows = rows.filter((r) =>
    r.some((cell) => cell.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const hasData = filteredRows.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
      <div className="bg-signal text-white px-6 py-4 flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <h2 className="font-heading font-bold text-lg">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
              {columns.map((c) => (
                <th
                  key={c}
                  className={cn(
                    "px-6 py-4 font-semibold text-xs uppercase tracking-wider whitespace-nowrap",
                    c === "Action Type" ? "text-left" : "text-right"
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              filteredRows.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  {r.map((cell, j) => (
                    <td
                      key={j}
                      className={cn(
                        "px-6 py-4",
                        j === 0 ? "text-left font-medium text-signal" : "text-right text-slate-600"
                      )}
                    >
                      {cell.startsWith("-") ? (
                        <span className="text-destructive font-semibold">{cell}</span>
                      ) : cell.startsWith("+") ? (
                        <span className="text-success font-semibold">{cell}</span>
                      ) : cell === "0" || cell === "0.00" || cell === ".00" ? (
                        <span className="text-slate-400">{cell}</span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-40" />
                  <p className="text-xs">No matching records</p>
                </td>
              </tr>
            )}
            {totalRow && totalRow.length > 0 && hasData && (
              <tr className="border-t-2 border-signal/20 bg-signal-tint font-bold">
                {totalRow.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "px-6 py-4",
                      j === 0 ? "text-left text-signal" : "text-right text-signal"
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CashFlowDetailsPage() {
  const [mounted, setMounted] = useState(false);
  const [pop, setPop] = useState("all");
  const [dateFrom, setDateFrom] = useState("2025-07-01");
  const [dateTo, setDateTo] = useState("2025-07-23");
  const [activeRange, setActiveRange] = useState("month");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const homeUserData = useMemo(() => ({
    columns: ["Action Type", "Transaction Count", "User Count", "Bill Amount", "Received Amount"],
    rows: [
      ["New Connection", "8", "8", "3,920.00", "3,920.00"],
      ["Recharge", "45", "32", "22,050.00", "21,500.00"],
      ["Payment", "12", "10", "5,880.00", "5,880.00"],
      ["Online Payment", "15", "12", "7,350.00", "7,350.00"],
    ],
    total: ["Total", "80", "62", "39,200.00", "38,650.00"],
  }), [pop]);

  const corporateUserData = useMemo(() => ({
    columns: ["Action Type", "Transaction Count", "User Count", "Bill Amount", "Received Amount"],
    rows: [
      ["New Connection", "3", "3", "4,500.00", "4,500.00"],
      ["Recharge", "18", "12", "45,000.00", "42,000.00"],
      ["Payment", "8", "6", "24,000.00", "24,000.00"],
    ],
    total: ["Total", "29", "21", "73,500.00", "70,500.00"],
  }), [pop]);

  const zoneData = useMemo(() => ({
    columns: ["Action Type", "Transaction Count", "Bill Amount"],
    rows: [
      ["Bill Cycle Change", "4", "-512.90"],
      ["New Connection", "10", "-216.00"],
      ["Online Charge", "3", "-55.90"],
      ["Online Payment", "5", "+3,299.00"],
      ["Payment", "7", "+4,471.00"],
      ["Recharge", "42", "-2,190.00"],
    ],
    total: ["Total", "71", "+4,796.10"],
  }), [pop]);

  const cashFlowSummary = useMemo(() => {
    const opening = 4235203.88;
    const inflow = 7770.00;
    const outflow = 0;
    const internal = 0;
    const expense = 0;
    const closing = opening + inflow - outflow - expense;
    return [
      { label: "Opening Balance", value: opening, isTotal: false },
      { label: "Total Inflow", value: inflow, isTotal: false, positive: true },
      { label: "Total Outflow", value: outflow, isTotal: false, negative: true },
      { label: "Total Internal", value: internal, isTotal: false },
      { label: "Total Expense", value: expense, isTotal: false, negative: true },
      { label: "Closing Balance", value: closing, isTotal: true },
    ];
  }, [pop]);

  const stats = useMemo(() => ({
    totalTransactions: 180,
    totalBill: 116620,
    totalReceived: 113250,
    netBalance: cashFlowSummary[5].value,
  }), [cashFlowSummary]);

  const handleQuickRange = (rangeId: string) => {
    setActiveRange(rangeId);
    setIsLoading(true);
    const today = new Date();
    const to = today.toISOString().split("T")[0];
    let from = to;

    switch (rangeId) {
      case "today": from = to; break;
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

  const handleSubmit = () => {
    setIsLoading(true);
    setActiveRange("");
    setTimeout(() => {
      setIsLoading(false);
      alert(`Report generated!\n\nPOP: ${pops.find((p) => p.id === pop)?.name}\nFrom: ${dateFrom}\nTo: ${dateTo}`);
    }, 500);
  };

  const handleExportCSV = () => {
    const rows: string[][] = [
      ["Cash Flow Details Report"],
      ["POP", pops.find((p) => p.id === pop)?.name || "All POPs"],
      ["From", dateFrom],
      ["To", dateTo],
      [],
      ["Home User"],
      homeUserData.columns,
      ...homeUserData.rows,
      homeUserData.total,
      [],
      ["Corporate User"],
      corporateUserData.columns,
      ...corporateUserData.rows,
      corporateUserData.total,
      [],
      ["Zone/Sub-Zone"],
      zoneData.columns,
      ...zoneData.rows,
      zoneData.total,
      [],
      ["Cash Flow Summary"],
      ...cashFlowSummary.map((c) => [c.label, c.value.toFixed(2)]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cash-flow-details-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert("CSV file downloaded!");
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <DashboardTopbar />
          <div className="px-4 sm:px-8 py-7">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
              <div className="h-32 bg-slate-200 rounded-2xl" />
              <div className="h-64 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Cash Flow Details
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Detailed breakdown of all transactions by POP, user type, and zone.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="pl-9 rounded-full w-56 h-9 border-slate-200 text-signal"
                />
              </div>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 h-9 hover:bg-signal-tint"
              >
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 h-9 hover:bg-signal-tint"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </Button>
            </div>
          </div>

          {/* 🎯 Compact Stat Cards — Theme-Based Solid Colors */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {/* Transactions — Teal */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-signal text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Txns</p>
                <p className="text-lg font-heading font-bold">{stats.totalTransactions}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Total Bill — Violet */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-violet-accent text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Bill</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(stats.totalBill)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Received — Success */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-success text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Received</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(stats.totalReceived)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            {/* Net Balance — Warning */}
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-warning text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Net</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(stats.netBalance)}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-signal" />
                <span className="font-semibold text-sm text-signal">POP:</span>
              </div>
              <select
                value={pop}
                onChange={(e) => setPop(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2 bg-white text-sm text-signal focus:ring-2 focus:ring-signal outline-none min-w-[200px]"
              >
                {pops.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-signal" />
                <span className="font-semibold text-sm text-signal">From:</span>
              </div>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setActiveRange(""); }}
                className="rounded-xl w-40 border-slate-200 text-signal"
              />
              <span className="font-semibold text-sm text-signal">To:</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => { setDateTo(e.target.value); setActiveRange(""); }}
                className="rounded-xl w-40 border-slate-200 text-signal"
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="rounded-xl bg-signal text-white hover:bg-signal-hover border-0 px-6 shadow-md"
              >
                {isLoading ? (
                  <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Loading...</>
                ) : ("Submit")}
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

          {/* Section Tables */}
          <SectionTable
            title="Home User"
            icon={Home}
            columns={homeUserData.columns}
            rows={homeUserData.rows}
            totalRow={homeUserData.total}
            searchTerm={searchTerm}
          />

          <SectionTable
            title="Corporate User (Pay Type: Cash)"
            icon={Building2}
            columns={corporateUserData.columns}
            rows={corporateUserData.rows}
            totalRow={corporateUserData.total}
            searchTerm={searchTerm}
          />

          <SectionTable
            title="Zone / Sub-Zone (Pay Type: Cash)"
            icon={Layers}
            columns={zoneData.columns}
            rows={zoneData.rows}
            totalRow={zoneData.total}
            searchTerm={searchTerm}
          />

          {/* Cash Flow Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-signal text-white px-6 py-4 flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <h2 className="font-heading font-bold text-lg">Cash Flow Summary</h2>
            </div>

            <div>
              {cashFlowSummary.map((item, i) => (
                <div
                  key={item.label}
                  className={cn(
                    "flex items-center justify-between px-8 py-4 border-t border-slate-100 transition-colors",
                    i === 0 && "border-t-0",
                    item.isTotal
                      ? "bg-signal-tint border-t-2 border-signal/20"
                      : i % 2 === 0 ? "bg-slate-50" : "bg-white"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm flex items-center gap-2",
                      item.isTotal ? "font-heading font-bold text-signal text-base" : "font-semibold text-slate-600"
                    )}
                  >
                    {item.isTotal && <DollarSign className="w-4 h-4" />}
                    {item.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      item.isTotal ? "font-heading font-bold text-signal text-base" : "text-slate-600",
                      item.positive ? "text-success" : "",
                      item.negative ? "text-destructive" : ""
                    )}
                  >
                    {item.positive ? "+" : item.negative ? "-" : ""}৳{formatCurrency(Math.abs(item.value))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/20 mt-6">
            <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Tip:</span> Use the POP filter to narrow down to a specific
              POP, and date range to view a particular period. Search works across all sections.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}