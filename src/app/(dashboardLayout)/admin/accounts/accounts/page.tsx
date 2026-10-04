"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import {
  Wallet, TrendingUp, TrendingDown, DollarSign, Landmark,
  ArrowUpRight, ArrowDownRight, Building2, BookOpen, FileText,
  RefreshCw, Receipt, ArrowDownUp, Send, BarChart3, PieChart as PieIcon,
  Activity, Calendar, Banknote, CreditCard, PlusCircle, Download,
  ChevronRight, Users, Layers, Clock, CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { cn } from "@/lib/utils";

// মাসিক ডেটা
const monthlyData = [
  { month: "Jan", income: 125000, expense: 68000, profit: 57000 },
  { month: "Feb", income: 148000, expense: 72000, profit: 76000 },
  { month: "Mar", income: 132000, expense: 85000, profit: 47000 },
  { month: "Apr", income: 165000, expense: 78000, profit: 87000 },
  { month: "May", income: 178000, expense: 92000, profit: 86000 },
  { month: "Jun", income: 195000, expense: 88000, profit: 107000 },
  { month: "Jul", income: 168000, expense: 95000, profit: 73000 },
  { month: "Aug", income: 185000, expense: 82000, profit: 103000 },
  { month: "Sep", income: 210000, expense: 98000, profit: 112000 },
  { month: "Oct", income: 195000, expense: 105000, profit: 90000 },
  { month: "Nov", income: 220000, expense: 110000, profit: 110000 },
  { month: "Dec", income: 245000, expense: 115000, profit: 130000 },
];

// অ্যাকাউন্ট ডিস্ট্রিবিউশন
const accountDistribution = [
  { name: "Income", value: 45, color: "#10B981" },
  { name: "Expense", value: 30, color: "#EF4444" },
  { name: "Asset", value: 15, color: "#3B82F6" },
  { name: "Liability", value: 7, color: "#F59E0B" },
  { name: "Equity", value: 3, color: "#8B5CF6" },
];

// Top Income Heads
const topIncomeHeads = [
  { name: "Service Income", amount: 425000, percentage: 35 },
  { name: "Recharge Income", amount: 385000, percentage: 32 },
  { name: "Installation Fee", amount: 185000, percentage: 15 },
  { name: "Online Payment", amount: 125000, percentage: 10 },
  { name: "Late Fee", amount: 95000, percentage: 8 },
];

// Top Expense Heads
const topExpenseHeads = [
  { name: "ISP Bill", amount: 285000, percentage: 32 },
  { name: "Salary", amount: 245000, percentage: 28 },
  { name: "Rent", amount: 155000, percentage: 18 },
  { name: "Maintenance", amount: 105000, percentage: 12 },
  { name: "Utility", amount: 88000, percentage: 10 },
];

// Recent Transactions
const recentTransactions = [
  { id: 1, date: "24-09-2025", type: "Income", name: "ZS Cable Network", amount: 6000, status: "Completed" },
  { id: 2, date: "24-09-2025", type: "Expense", name: "ISP Bill Payment", amount: -25000, status: "Completed" },
  { id: 3, date: "23-09-2025", type: "Transfer", name: "BRAC → Cash", amount: 15000, status: "Completed" },
  { id: 4, date: "23-09-2025", type: "Income", name: "Recharge Income", amount: 45000, status: "Completed" },
  { id: 5, date: "22-09-2025", type: "Expense", name: "Staff Salary", amount: -45000, status: "Pending" },
  { id: 6, date: "22-09-2025", type: "Income", name: "Online Payment", amount: 3299, status: "Completed" },
];

// Bank Accounts
const bankAccounts = [
  { bank: "BRAC Bank", account: "1501203456789", balance: 125400.5, type: "Current" },
  { bank: "Dutch Bangla", account: "1021456789123", balance: 285600.75, type: "Savings" },
  { bank: "Islami Bank", account: "2050123456789", balance: 42350.0, type: "Salary" },
  { bank: "City Bank", account: "1401234567890", balance: 550000.0, type: "Fixed" },
];

// Quick Navigation
const quickLinks = [
  { name: "Income", href: "/admin/accounts/income", icon: TrendingUp, color: "emerald" },
  { name: "Expense", href: "/admin/accounts/expense", icon: TrendingDown, color: "red" },
  { name: "Profit & Loss", href: "/admin/accounts/profit-loss", icon: BarChart3, color: "violet" },
  { name: "Chart of Account", href: "/admin/accounts/chart-of-account", icon: BookOpen, color: "blue" },
  { name: "Bank Account", href: "/admin/accounts/bank-account", icon: Landmark, color: "amber" },
  { name: "Fund Transfer", href: "/admin/accounts/fund-transfer", icon: ArrowDownUp, color: "cyan" },
  { name: "Bill Entry", href: "/admin/accounts/bill-entry", icon: Receipt, color: "pink" },
  { name: "Voucher Entry", href: "/admin/accounts/voucher-entry", icon: FileText, color: "purple" },
  { name: "Cash Flow", href: "/admin/accounts/cash-flow", icon: Wallet, color: "teal" },
  { name: "Cash Flow Details", href: "/admin/accounts/cash-flow-details", icon: PieIcon, color: "orange" },
];

export default function AccountsDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // টোটাল সামারি
  const summary = useMemo(() => {
    const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
    const totalExpense = monthlyData.reduce((s, m) => s + m.expense, 0);
    const netProfit = totalIncome - totalExpense;
    const profitMargin = (netProfit / totalIncome) * 100;
    const totalBankBalance = bankAccounts.reduce((s, b) => s + b.balance, 0);

    return {
      totalIncome,
      totalExpense,
      netProfit,
      profitMargin,
      totalBankBalance,
      cashInHand: 42100,
      totalTransactions: 1842,
    };
  }, []);

  const formatCurrency = (n: number) =>
    n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (!mounted) {
    return (
      <div className="flex min-h-screen bg-muted/30">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <DashboardTopbar />
          <div className="px-4 sm:px-8 py-7">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-muted rounded-xl w-1/3" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
              </div>
              <div className="h-80 bg-muted rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Accounts Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Complete financial overview of your business — income, expense, profit, and accounts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
              >
                <Download className="w-3.5 h-3.5" /> Export Report
              </Button>
              <Link href="/admin/accounts/income">
                <Button className="rounded-full gap-1.5 font-semibold bg-gradient-to-r from-signal to-violet-accent border-0">
                  <PlusCircle className="w-3.5 h-3.5" /> Add Income
                </Button>
              </Link>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-4 border-white/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-full">
                    +12.5%
                  </span>
                </div>
                <p className="text-xs font-semibold opacity-90 uppercase">Total Income</p>
                <p className="font-heading text-2xl font-bold">৳{formatCurrency(summary.totalIncome)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-4 border-white/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-full">
                    +8.3%
                  </span>
                </div>
                <p className="text-xs font-semibold opacity-90 uppercase">Total Expense</p>
                <p className="font-heading text-2xl font-bold">৳{formatCurrency(summary.totalExpense)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-4 border-white/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-full">
                    {summary.profitMargin.toFixed(1)}%
                  </span>
                </div>
                <p className="text-xs font-semibold opacity-90 uppercase">Net Profit</p>
                <p className="font-heading text-2xl font-bold">৳{formatCurrency(summary.netProfit)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full border-4 border-white/10" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Landmark className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-1 rounded-full">
                    {bankAccounts.length} Banks
                  </span>
                </div>
                <p className="text-xs font-semibold opacity-90 uppercase">Bank Balance</p>
                <p className="font-heading text-2xl font-bold">৳{formatCurrency(summary.totalBankBalance)}</p>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Income vs Expense Bar Chart */}
            <div className="lg:col-span-2 bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-signal" />
                  <h2 className="font-heading font-bold text-lg">Income vs Expense</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" /> Income
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-500" /> Expense
                  </span>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      width={50}
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        backgroundColor: "var(--card)",
                      }}
                      formatter={(v: any) => `৳${Number(v).toLocaleString()}`}
                    />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Account Distribution Pie */}
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <PieIcon className="w-5 h-5 text-signal" />
                <h2 className="font-heading font-bold text-lg">Account Types</h2>
              </div>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accountDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {accountDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        fontSize: 12,
                        backgroundColor: "var(--card)",
                      }}
                      formatter={(v: any) => `${v}%`} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {accountDistribution.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                      {a.name}
                    </span>
                    <span className="font-semibold">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profit Trend Line */}
          <div className="bg-card rounded-2xl border shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-signal" />
              <h2 className="font-heading font-bold text-lg">Profit Trend (12 Months)</h2>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0F8B8D" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={50}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      fontSize: 12,
                      backgroundColor: "var(--card)",
                    }}
                    formatter={(v: any) => `৳${Number(v).toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="url(#profitGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#0F8B8D", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Heads Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Top Income Heads */}
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h2 className="font-heading font-bold text-lg">Top Income Heads</h2>
                </div>
                <Link href="/admin/accounts/income">
                  <button className="text-xs text-signal font-semibold flex items-center gap-1 hover:underline">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
              <div className="space-y-3">
                {topIncomeHeads.map((h, i) => (
                  <div key={h.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold truncate">{h.name}</p>
                        <p className="text-xs font-bold text-emerald-600">
                          ৳{formatCurrency(h.amount)}
                        </p>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                          style={{ width: `${h.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Expense Heads */}
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h2 className="font-heading font-bold text-lg">Top Expense Heads</h2>
                </div>
                <Link href="/admin/accounts/expense">
                  <button className="text-xs text-signal font-semibold flex items-center gap-1 hover:underline">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
              <div className="space-y-3">
                {topExpenseHeads.map((h, i) => (
                  <div key={h.name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold truncate">{h.name}</p>
                        <p className="text-xs font-bold text-red-600">
                          ৳{formatCurrency(h.amount)}
                        </p>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
                          style={{ width: `${h.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Transactions & Bank Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Recent Transactions */}
            <div className="lg:col-span-2 bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-signal" />
                  <h2 className="font-heading font-bold text-lg">Recent Transactions</h2>
                </div>
                <Link href="/admin/accounts/cash-flow">
                  <button className="text-xs text-signal font-semibold flex items-center gap-1 hover:underline">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
              <div className="space-y-2">
                {recentTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                        t.type === "Income" && "bg-emerald-500/10 text-emerald-600",
                        t.type === "Expense" && "bg-red-500/10 text-red-600",
                        t.type === "Transfer" && "bg-blue-500/10 text-blue-600"
                      )}
                    >
                      {t.type === "Income" && <ArrowUpRight className="w-4 h-4" />}
                      {t.type === "Expense" && <ArrowDownRight className="w-4 h-4" />}
                      {t.type === "Transfer" && <ArrowDownUp className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.date} · {t.type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          t.amount > 0 ? "text-emerald-600" : "text-red-600"
                        )}
                      >
                        {t.amount > 0 ? "+" : ""}৳{formatCurrency(Math.abs(t.amount))}
                      </p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                          t.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-amber-500/10 text-amber-600"
                        )}
                      >
                        {t.status === "Completed" && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-signal" />
                  <h2 className="font-heading font-bold text-lg">Bank Accounts</h2>
                </div>
                <Link href="/admin/accounts/bank-account">
                  <button className="text-xs text-signal font-semibold flex items-center gap-1 hover:underline">
                    View All <ChevronRight className="w-3 h-3" />
                  </button>
                </Link>
              </div>
              <div className="space-y-3">
                {bankAccounts.map((b) => (
                  <div
                    key={b.bank}
                    className="p-3 rounded-xl bg-gradient-to-br from-signal-tint/40 to-violet-accent-tint/40 border border-signal/10 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-signal" />
                      <p className="text-xs font-bold text-signal uppercase">{b.type}</p>
                    </div>
                    <p className="text-sm font-bold">{b.bank}</p>
                    <p className="text-[10px] text-muted-foreground font-mono mb-2">
                      {b.account}
                    </p>
                    <p className="font-heading text-lg font-bold text-emerald-600">
                      ৳{formatCurrency(b.balance)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-2xl border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Layers className="w-5 h-5 text-signal" />
              <h2 className="font-heading font-bold text-lg">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href}>
                    <div className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-border hover:border-signal hover:shadow-md transition-all cursor-pointer text-center">
                      <div className="w-11 h-11 rounded-full bg-signal/10 text-signal flex items-center justify-center group-hover:bg-signal group-hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold">{link.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20 mt-6">
            <Activity className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Live Dashboard:</span> All numbers on this page update in
              real-time. Click any card to navigate to its detailed page. Use the Quick Actions grid
              for fast access to any Accounts module.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}