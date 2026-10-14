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

const accountDistribution = [
  { name: "Income", value: 45, color: "#10B981" },
  { name: "Expense", value: 30, color: "#EF4444" },
  { name: "Asset", value: 15, color: "#066F6F" },
  { name: "Liability", value: 7, color: "#F59E0B" },
  { name: "Equity", value: 3, color: "#8B5CF6" },
];

const topIncomeHeads = [
  { name: "Service Income", amount: 425000, percentage: 35 },
  { name: "Recharge Income", amount: 385000, percentage: 32 },
  { name: "Installation Fee", amount: 185000, percentage: 15 },
  { name: "Online Payment", amount: 125000, percentage: 10 },
  { name: "Late Fee", amount: 95000, percentage: 8 },
];

const topExpenseHeads = [
  { name: "ISP Bill", amount: 285000, percentage: 32 },
  { name: "Salary", amount: 245000, percentage: 28 },
  { name: "Rent", amount: 155000, percentage: 18 },
  { name: "Maintenance", amount: 105000, percentage: 12 },
  { name: "Utility", amount: 88000, percentage: 10 },
];

const recentTransactions = [
  { id: 1, date: "24-09-2025", type: "Income", name: "ZS Cable Network", amount: 6000, status: "Completed" },
  { id: 2, date: "24-09-2025", type: "Expense", name: "ISP Bill Payment", amount: -25000, status: "Completed" },
  { id: 3, date: "23-09-2025", type: "Transfer", name: "BRAC → Cash", amount: 15000, status: "Completed" },
  { id: 4, date: "23-09-2025", type: "Income", name: "Recharge Income", amount: 45000, status: "Completed" },
  { id: 5, date: "22-09-2025", type: "Expense", name: "Staff Salary", amount: -45000, status: "Pending" },
  { id: 6, date: "22-09-2025", type: "Income", name: "Online Payment", amount: 3299, status: "Completed" },
];

const bankAccounts = [
  { bank: "BRAC Bank", account: "1501203456789", balance: 125400.5, type: "Current" },
  { bank: "Dutch Bangla", account: "1021456789123", balance: 285600.75, type: "Savings" },
  { bank: "Islami Bank", account: "2050123456789", balance: 42350.0, type: "Salary" },
  { bank: "City Bank", account: "1401234567890", balance: 550000.0, type: "Fixed" },
];

const quickLinks = [
  { name: "Income", href: "/admin/accounts/income", icon: TrendingUp },
  { name: "Expense", href: "/admin/accounts/expense", icon: TrendingDown },
  { name: "Profit & Loss", href: "/admin/accounts/profit-loss", icon: BarChart3 },
  { name: "Chart of Account", href: "/admin/accounts/chart-of-account", icon: BookOpen },
  { name: "Bank Account", href: "/admin/accounts/bank-account", icon: Landmark },
  { name: "Fund Transfer", href: "/admin/accounts/fund-transfer", icon: ArrowDownUp },
  { name: "Bill Entry", href: "/admin/accounts/bill-entry", icon: Receipt },
  { name: "Voucher Entry", href: "/admin/accounts/voucher-entry", icon: FileText },
  { name: "Cash Flow", href: "/admin/accounts/cash-flow", icon: Wallet },
  { name: "Cash Flow Details", href: "/admin/accounts/cash-flow-details", icon: PieIcon },
];

export default function AccountsDashboardPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
      <div className="flex min-h-screen bg-slate-50">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">
          <DashboardTopbar />
          <div className="px-4 sm:px-8 py-7">
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-200 rounded-2xl" />)}
              </div>
              <div className="h-80 bg-slate-200 rounded-2xl" />
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
                Accounts Dashboard
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Complete financial overview of your business — income, expense, profit, and accounts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 hover:bg-signal-tint"
              >
                <Download className="w-3.5 h-3.5" /> Export Report
              </Button>
              <Link href="/admin/accounts/income">
                <Button className="rounded-full gap-1.5 font-semibold bg-signal text-white hover:bg-signal-hover border-0 shadow-md">
                  <PlusCircle className="w-3.5 h-3.5" /> Add Income
                </Button>
              </Link>
            </div>
          </div>

          {/* 🎯 Compact Stat Cards — Theme Connected (এক লাইনে) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-success text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Income</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(summary.totalIncome)}</p>
              </div>
              <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-md shrink-0">
                +12.5%
              </span>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-destructive text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <TrendingDown className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Expense</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(summary.totalExpense)}</p>
              </div>
              <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-md shrink-0">
                +8.3%
              </span>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-signal text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Net Profit</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(summary.netProfit)}</p>
              </div>
              <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-md shrink-0">
                {summary.profitMargin.toFixed(1)}%
              </span>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-violet-accent text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Bank</p>
                <p className="text-lg font-heading font-bold">৳{formatCurrency(summary.totalBankBalance)}</p>
              </div>
              <span className="text-[10px] font-bold bg-white/25 px-1.5 py-0.5 rounded-md shrink-0">
                {bankAccounts.length}
              </span>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-signal" />
                  <h2 className="font-heading font-bold text-lg text-signal">Income vs Expense</h2>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-success" /> Income
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-3 h-3 rounded-full bg-destructive" /> Expense
                  </span>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      width={50}
                      stroke="#94a3b8"
                      tickFormatter={(v) => `${v / 1000}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                        backgroundColor: "#ffffff",
                      }}
                      formatter={(v: any) => `৳${Number(v).toLocaleString()}`}
                    />
                    <Bar dataKey="income" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={20} />
                    <Bar dataKey="expense" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-5">
                <PieIcon className="w-5 h-5 text-signal" />
                <h2 className="font-heading font-bold text-lg text-signal">Account Types</h2>
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
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                        backgroundColor: "#ffffff",
                      }}
                      formatter={(v: any) => `${v}%`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-1.5 mt-2">
                {accountDistribution.map((a) => (
                  <div key={a.name} className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-2 text-slate-600">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                      {a.name}
                    </span>
                    <span className="font-semibold text-signal">{a.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Profit Trend Line */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-2 mb-5">
              <Activity className="w-5 h-5 text-signal" />
              <h2 className="font-heading font-bold text-lg text-signal">Profit Trend (12 Months)</h2>
            </div>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <defs>
                    <linearGradient id="profitGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#066F6F" />
                      <stop offset="100%" stopColor="#0A8F8F" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} stroke="#94a3b8" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={50}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                      backgroundColor: "#ffffff",
                    }}
                    formatter={(v: any) => `৳${Number(v).toLocaleString()}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="url(#profitGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#066F6F", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Heads Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <h2 className="font-heading font-bold text-lg text-signal">Top Income Heads</h2>
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
                    <div className="w-6 h-6 rounded-full bg-success-tint text-success flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold truncate text-signal">{h.name}</p>
                        <p className="text-xs font-bold text-success">
                          ৳{formatCurrency(h.amount)}
                        </p>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-success rounded-full"
                          style={{ width: `${h.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  <h2 className="font-heading font-bold text-lg text-signal">Top Expense Heads</h2>
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
                    <div className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm font-semibold truncate text-signal">{h.name}</p>
                        <p className="text-xs font-bold text-destructive">
                          ৳{formatCurrency(h.amount)}
                        </p>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-destructive rounded-full"
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
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-signal" />
                  <h2 className="font-heading font-bold text-lg text-signal">Recent Transactions</h2>
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
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                        t.type === "Income" && "bg-success-tint text-success",
                        t.type === "Expense" && "bg-destructive/10 text-destructive",
                        t.type === "Transfer" && "bg-signal-tint text-signal"
                      )}
                    >
                      {t.type === "Income" && <ArrowUpRight className="w-4 h-4" />}
                      {t.type === "Expense" && <ArrowDownRight className="w-4 h-4" />}
                      {t.type === "Transfer" && <ArrowDownUp className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate text-signal">{t.name}</p>
                      <p className="text-xs text-slate-500">
                        {t.date} · {t.type}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          t.amount > 0 ? "text-success" : "text-destructive"
                        )}
                      >
                        {t.amount > 0 ? "+" : ""}৳{formatCurrency(Math.abs(t.amount))}
                      </p>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full",
                          t.status === "Completed"
                            ? "bg-success-tint text-success"
                            : "bg-warning-tint text-warning"
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

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-signal" />
                  <h2 className="font-heading font-bold text-lg text-signal">Bank Accounts</h2>
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
                    className="p-3 rounded-xl bg-signal-tint border border-signal/20 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-3.5 h-3.5 text-signal" />
                      <p className="text-xs font-bold text-signal uppercase">{b.type}</p>
                    </div>
                    <p className="text-sm font-bold text-signal">{b.bank}</p>
                    <p className="text-[10px] text-slate-500 font-mono mb-2">
                      {b.account}
                    </p>
                    <p className="font-heading text-lg font-bold text-success">
                      ৳{formatCurrency(b.balance)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Layers className="w-5 h-5 text-signal" />
              <h2 className="font-heading font-bold text-lg text-signal">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link key={link.name} href={link.href}>
                    <div className="group flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-slate-200 hover:border-signal hover:shadow-md transition-all cursor-pointer text-center bg-white">
                      <div className="w-11 h-11 rounded-full bg-signal-tint text-signal flex items-center justify-center group-hover:bg-signal group-hover:text-white transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-signal">{link.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/20 mt-6">
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