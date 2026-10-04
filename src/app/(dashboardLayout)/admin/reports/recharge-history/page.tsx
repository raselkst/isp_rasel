"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { SidePanelModal } from "@/components/billing/side-panel-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Printer,
  ArrowDownCircle,
  ArrowUpCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Calendar,
  FileSpreadsheet,
  Eye,
  MoreVertical,
} from "lucide-react";

// 🎯 ট্রানজেকশন ডেটা টাইপ
interface Transaction {
  id: number;
  ref: string;
  initiator: string;
  pop: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  time: string;
  desc: string;
}

// 🎯 ডামি ডেটা
const mockTransactions: Transaction[] = [
  { id: 1, ref: "4768467", initiator: "TNRSOFT-Refayetpur Network", pop: "Md Sumon Ali", debit: 250, credit: null, balance: 326, time: "2025-03-13", desc: "AC#862649 User#Sp00131 Renewal" },
  { id: 2, ref: "4768468", initiator: "TNRSOFT-Refayetpur Network", pop: "Md Sumon Ali", debit: null, credit: 500, balance: 826, time: "2025-03-12", desc: "Top-up via bKash" },
  { id: 3, ref: "4768469", initiator: "TNRSOFT-Refayetpur Network", pop: "Karim Hossain", debit: 300, credit: null, balance: 526, time: "2025-03-12", desc: "AC#862650 User#Sp00132 Renewal" },
  { id: 4, ref: "4768470", initiator: "TNRSOFT-Refayetpur Network", pop: "Jamal Uddin", debit: 150, credit: null, balance: 376, time: "2025-03-11", desc: "AC#862651 User#Sp00133 Renewal" },
  { id: 5, ref: "4768471", initiator: "TNRSOFT-Refayetpur Network", pop: "Md Sumon Ali", debit: null, credit: 1000, balance: 1376, time: "2025-03-10", desc: "Manual Top-up" },
  { id: 6, ref: "4768472", initiator: "TNRSOFT-Refayetpur Network", pop: "Rafiq Islam", debit: 200, credit: null, balance: 1176, time: "2025-03-10", desc: "AC#862652 User#Sp00134 Renewal" },
  { id: 7, ref: "4768473", initiator: "TNRSOFT-Refayetpur Network", pop: "Md Sumon Ali", debit: 400, credit: null, balance: 776, time: "2025-03-09", desc: "AC#862653 User#Sp00135 Renewal" },
  { id: 8, ref: "4768474", initiator: "TNRSOFT-Refayetpur Network", pop: "Nasir Ahmed", debit: null, credit: 750, balance: 1526, time: "2025-03-08", desc: "Top-up via Nagad" },
];

export default function RechargeHistoryPage() {
  const router = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<"All" | "Debit" | "Credit">("All");
  const [transactions] = useState<Transaction[]>(mockTransactions);

  // 🎯 স্ট্যাট ক্যালকুলেশন
  const stats = useMemo(() => {
    const totalDebit = transactions.reduce((acc, t) => acc + (t.debit || 0), 0);
    const totalCredit = transactions.reduce((acc, t) => acc + (t.credit || 0), 0);
    const netBalance = totalCredit - totalDebit;
    const totalTxns = transactions.length;
    return { totalDebit, totalCredit, netBalance, totalTxns };
  }, [transactions]);

  // 🎯 ফিল্টার ও সার্চ
  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (typeFilter === "Debit") {
      result = result.filter(t => t.debit !== null);
    } else if (typeFilter === "Credit") {
      result = result.filter(t => t.credit !== null);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.ref.includes(q) ||
        t.initiator.toLowerCase().includes(q) ||
        t.pop.toLowerCase().includes(q) ||
        t.desc.toLowerCase().includes(q)
      );
    }

    return result;
  }, [transactions, typeFilter, searchTerm]);

  // 🎯 CSV এক্সপোর্ট
  const handleExportCSV = () => {
    const headers = ["SL", "Ref", "Initiator", "Pop In-charge", "Debit", "Credit", "Balance", "Time", "Description"];
    const csvData = filteredTransactions.map((t, i) => [
      i + 1,
      t.ref,
      t.initiator,
      t.pop,
      t.debit ?? "",
      t.credit ?? "",
      t.balance,
      t.time,
      `"${t.desc}"`,
    ]);

    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `recharge-history-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 🎯 প্রিন্ট
  const handlePrint = () => {
    window.print();
  };

  // 🎯 Debit/Credit অনুপাত
  const totalFlow = stats.totalDebit + stats.totalCredit;
  const debitPercent = totalFlow > 0 ? Math.round((stats.totalDebit / totalFlow) * 100) : 0;
  const creditPercent = totalFlow > 0 ? Math.round((stats.totalCredit / totalFlow) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* 🎯 Sticky Action Bar */}
        <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30 print:hidden">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all whitespace-nowrap"
              >
                <FileSpreadsheet className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all whitespace-nowrap"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
            </div>

            {/* Type Toggle */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              {(["All", "Debit", "Credit"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={cn(
                    "px-3.5 py-2 rounded-lg text-xs font-bold transition-all",
                    typeFilter === type
                      ? "bg-card shadow-sm text-signal"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6 print:mb-2">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 print:hidden">
              Financial Reports
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent print:text-black">
              Recharge History
            </h1>
          </div>

         {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 print:hidden">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
      <ArrowDownCircle className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Debit</p>
      <p className="text-lg font-heading font-bold text-red-600">৳{stats.totalDebit.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Credit</p>
      <p className="text-lg font-heading font-bold text-emerald-600">৳{stats.totalCredit.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
      <Wallet className="w-4 h-4 text-signal" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Net</p>
      <p className="text-lg font-heading font-bold text-signal">৳{stats.netBalance.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
      <Activity className="w-4 h-4 text-violet-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
      <p className="text-lg font-heading font-bold text-violet-600">{stats.totalTxns}</p>
    </div>
  </div>
</div>

          {/* 🎯 Flow Distribution Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 print:hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Debit vs Credit Flow</span>
              <span className="text-xs font-semibold text-muted-foreground">৳{totalFlow.toLocaleString()} Total Flow</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted">
              <div className="bg-red-500 transition-all" style={{ width: `${debitPercent}%` }} />
              <div className="bg-emerald-500 transition-all" style={{ width: `${creditPercent}%` }} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Debit ({debitPercent}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Credit ({creditPercent}%)</span>
            </div>
          </div>

          {/* 🎯 Search Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3 print:hidden">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by ref, initiator, pop or description…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-signal to-violet-accent text-white text-sm font-semibold hover:scale-105 transition-all shadow-md shadow-signal/20"
            >
              <Filter className="h-3.5 w-3.5" />
              Advanced Filter
            </button>
          </div>

          {/* 🎯 Transaction Table */}
          <div className="bg-card rounded-2xl border overflow-hidden print:border-0 print:shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1100px]">
                <thead>
                  <tr className="bg-gradient-to-r from-signal to-violet-accent text-white print:bg-slate-900">
                    {["SL", "Ref", "Initiator", "Pop In-charge", "Debit", "Credit", "Balance", "Time", "Description"].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 font-semibold text-[12px] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((t, i) => (
                      <tr key={t.id} className="border-t hover:bg-signal-tint/30 transition-colors group">
                        <td className="px-4 py-3.5 font-mono text-muted-foreground">
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold text-signal">#{t.ref}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs">{t.initiator}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold">{t.pop}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          {t.debit !== null ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/10 text-red-600 border border-red-500/20">
                              <TrendingDown className="h-3 w-3" />
                              ৳{t.debit}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          {t.credit !== null ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                              <TrendingUp className="h-3 w-3" />
                              ৳{t.credit}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono font-bold">৳{t.balance}</span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                          {t.time}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap max-w-[250px] truncate">
                          {t.desc}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center">
                            <Activity className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold">No transactions found</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your search or filter.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 🎯 Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground print:hidden">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{filteredTransactions.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredTransactions.length}</span>
                <span>transactions</span>
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

      {/* 🎯 Advanced Filter Modal */}
      <SidePanelModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        title="Advanced Filter"
        confirmLabel="Apply Filter"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Pop In-Charge</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choose Pop" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="sumon">Md Sumon Ali</SelectItem>
                <SelectItem value="karim">Karim Hossain</SelectItem>
                <SelectItem value="jamal">Jamal Uddin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Transaction Type</Label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choose Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label className="text-sm font-semibold">Initiator</Label>
            <Input placeholder="Search initiator..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Date From</Label>
            <div className="relative">
              <Input type="date" className="pr-9" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold">Date To</Label>
            <div className="relative">
              <Input type="date" className="pr-9" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label className="text-sm font-semibold">Description Contains</Label>
            <Input placeholder="AC#... User#..." />
          </div>
        </div>
      </SidePanelModal>
    </div>
  );
}