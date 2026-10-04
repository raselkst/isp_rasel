"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Zap, Search, Wallet, CreditCard, Smartphone, Building2, X,
  CheckCircle2, AlertCircle, User, Calendar, DollarSign, TrendingUp,
  Activity, Clock, ArrowRight, RefreshCw, Receipt, Percent, Users,
  ChevronRight, Send, BadgeCheck
} from "lucide-react";

// ডামি ডেটা
const mockClients = [
  { id: "C-101", name: "Rahim Uddin", username: "rahim_101", mobile: "01711223344", package: "10Mbps_Package", price: 490, expiry: "01/05/2025", status: "Active" },
  { id: "C-102", name: "Karim Ali", username: "karim_102", mobile: "01711556677", package: "12Mbps_Package", price: 588, expiry: "15/05/2025", status: "Active" },
  { id: "C-103", name: "Jamal Hossain", username: "jamal_103", mobile: "01711889900", package: "15Mbps_Package", price: 700, expiry: "20/05/2025", status: "Active" },
];

const recentTransactions = [
  { id: "TXN-2401", client: "Rahim Uddin", amount: 490, method: "bKash", time: "2 mins ago", status: "success" },
  { id: "TXN-2400", client: "Karim Ali", amount: 588, method: "Cash", time: "15 mins ago", status: "success" },
  { id: "TXN-2399", client: "Jamal Hossain", amount: 700, method: "Nagad", time: "1 hour ago", status: "success" },
  { id: "TXN-2398", client: "Sultana Begum", amount: 490, method: "Rocket", time: "2 hours ago", status: "pending" },
  { id: "TXN-2397", client: "Rafiq Islam", amount: 588, method: "Cash", time: "3 hours ago", status: "success" },
];

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Wallet, color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20" },
  { id: "bkash", label: "bKash", icon: Smartphone, color: "text-pink-600 bg-pink-500/10 border-pink-500/20" },
  { id: "nagad", label: "Nagad", icon: Smartphone, color: "text-orange-600 bg-orange-500/10 border-orange-500/20" },
  { id: "rocket", label: "Rocket", icon: Smartphone, color: "text-purple-600 bg-purple-500/10 border-purple-500/20" },
  { id: "bank", label: "Bank", icon: Building2, color: "text-blue-600 bg-blue-500/10 border-blue-500/20" },
];

export default function InstantPayPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<"search" | "renew" | "success">("search");
  const [searchTerm, setSearchTerm] = useState("");
  const [foundClient, setFoundClient] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [amount, setAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [months, setMonths] = useState(1);
  const [remarks, setRemarks] = useState("");
  const [transactions, setTransactions] = useState(recentTransactions);

  // Stat Cards
  const stats = useMemo(() => {
    const todayCollection = transactions.filter(t => t.status === "success").reduce((acc, t) => acc + t.amount, 0);
    const successCount = transactions.filter(t => t.status === "success").length;
    const pendingCount = transactions.filter(t => t.status === "pending").length;
    const successRate = transactions.length > 0 ? (successCount / transactions.length) * 100 : 0;
    return {
      todayCollection,
      totalTxns: transactions.length,
      successRate: Math.round(successRate),
      pending: pendingCount,
    };
  }, [transactions]);

  // Search Client
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Please enter Client ID, Username or Mobile.");
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      const q = searchTerm.toLowerCase();
      const client = mockClients.find(
        c =>
          c.id.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.mobile.includes(q) ||
          c.name.toLowerCase().includes(q)
      );
      if (client) {
        setFoundClient(client);
        setAmount(client.price);
        setStep("renew");
      } else {
        setFoundClient(null);
        alert("No client found. Try a different search term.");
      }
      setIsSearching(false);
    }, 800);
  };

  // Calculations
  const calculations = useMemo(() => {
    const subtotal = foundClient ? foundClient.price * months : 0;
    const discountAmt = (subtotal * discount) / 100;
    const grandTotal = subtotal - discountAmt;
    const due = grandTotal - amount;
    return { subtotal, discountAmt, grandTotal, due };
  }, [foundClient, months, discount, amount]);

  // Renew Submit
  const handleRenew = () => {
    if (!foundClient) return;
    if (amount < calculations.grandTotal) {
      alert(`Amount is less than total. Due: ৳${calculations.due}`);
      return;
    }
    const txn = {
      id: `TXN-${2402 + transactions.length}`,
      client: foundClient.name,
      amount: calculations.grandTotal,
      method: paymentMethods.find(p => p.id === paymentMethod)?.label || "Cash",
      time: "Just now",
      status: "success",
    };
    setTransactions(prev => [txn, ...prev]);
    setStep("success");
  };

  const handleCloseModal = () => {
    setOpen(false);
    setStep("search");
    setSearchTerm("");
    setFoundClient(null);
    setAmount(0);
    setDiscount(0);
    setMonths(1);
    setRemarks("");
    setPaymentMethod("cash");
  };

  const handleReset = () => {
    setStep("search");
    setSearchTerm("");
    setFoundClient(null);
    setAmount(0);
    setDiscount(0);
    setMonths(1);
    setRemarks("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
                Quick Payment
              </p>
              <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Instant Pay
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Search a client and process instant renewal in seconds.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all"
            >
              <Zap className="h-4 w-4" /> New Payment
            </button>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Today</p>
                <p className="text-lg font-heading font-bold text-emerald-600">৳{stats.todayCollection}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Txns</p>
                <p className="text-lg font-heading font-bold text-blue-600">{stats.totalTxns}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Success</p>
                <p className="text-lg font-heading font-bold text-violet-600">{stats.successRate}%</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Pending</p>
                <p className="text-lg font-heading font-bold text-amber-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
            {/* Left: Recent Transactions */}
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-signal" /> Recent Transactions
                </h2>
                <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
                  Last 5
                </span>
              </div>

              <div className="space-y-2">
                {transactions.slice(0, 5).map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      txn.status === "success" ? "bg-emerald-500/10" : "bg-amber-500/10"
                    )}>
                      {txn.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{txn.client}</p>
                      <p className="text-xs text-muted-foreground">
                        {txn.method} · {txn.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-signal">৳{txn.amount}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{txn.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: How It Works */}
            <div className="bg-gradient-to-br from-signal-tint/60 to-violet-accent-tint/60 rounded-2xl border border-signal/20 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-signal" />
                <h2 className="font-heading font-bold text-lg">How Instant Pay Works</h2>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { num: 1, title: "Search Client", desc: "Enter Client ID, Username, or Mobile No.", icon: Search },
                  { num: 2, title: "Verify Details", desc: "Check package, price, and expiry date.", icon: BadgeCheck },
                  { num: 3, title: "Select Payment", desc: "Choose from Cash, bKash, Nagad, or Bank.", icon: Wallet },
                  { num: 4, title: "Confirm Renewal", desc: "Instant renewal with SMS notification.", icon: Send },
                ].map((s) => (
                  <div key={s.num} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center shrink-0 shadow-sm">
                      <s.icon className="w-4 h-4 text-signal" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">
                        <span className="text-signal mr-1.5">{s.num}.</span>
                        {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpen(true)}
                className="w-full mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-[1.02] transition-all"
              >
                <Zap className="h-4 w-4" /> Start New Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ INSTANT PAY MODAL ============ */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={handleCloseModal} />
          <div className="relative bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading font-bold text-sm">INSTANT PAY</span>
                </div>
                <h3 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                  {step === "search" && "Search Client"}
                  {step === "renew" && "Confirm Renewal"}
                  {step === "success" && "Payment Successful"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {step === "search" && "Enter client credentials to proceed."}
                  {step === "renew" && "Verify details and choose payment method."}
                  {step === "success" && "Transaction completed successfully!"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Step Indicator */}
            {step !== "success" && (
              <div className="flex items-center gap-2 mb-6">
                {["Search", "Renew"].map((s, i) => {
                  const stepIndex = step === "search" ? 0 : 1;
                  const isActive = i === stepIndex;
                  const isDone = i < stepIndex;
                  return (
                    <div key={s} className="flex items-center gap-2 flex-1">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isDone ? "bg-emerald-500 text-white" :
                        isActive ? "bg-signal text-white shadow-md" :
                        "bg-muted text-muted-foreground"
                      )}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={cn(
                        "text-xs font-semibold",
                        isActive ? "text-signal" : "text-muted-foreground"
                      )}>{s}</span>
                      {i < 1 && <div className={cn("flex-1 h-0.5", isDone ? "bg-emerald-500" : "bg-muted")} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 1: Search */}
            {step === "search" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">
                    Client ID / Username / Mobile <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. C-101 or rahim_101 or 01711223344"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Try: <button onClick={() => setSearchTerm("C-101")} className="text-signal font-semibold hover:underline">C-101</button>, <button onClick={() => setSearchTerm("karim_102")} className="text-signal font-semibold hover:underline">karim_102</button>, or <button onClick={() => setSearchTerm("01711889900")} className="text-signal font-semibold hover:underline">01711889900</button>
                  </p>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" /> Search Client
                    </>
                  )}
                </button>
              </div>
            )}

            {/* STEP 2: Renew */}
            {step === "renew" && foundClient && (
              <div className="space-y-5">
                {/* Client Info */}
                <div className="bg-gradient-to-br from-signal-tint/60 to-violet-accent-tint/60 rounded-2xl border border-signal/20 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {foundClient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{foundClient.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {foundClient.id} · @{foundClient.username}</p>
                    </div>
                    <span className="bg-emerald-500/15 text-emerald-600 text-[10px] font-bold px-2 py-1 rounded-md border border-emerald-500/20">
                      {foundClient.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase text-[10px] mb-1">Package</p>
                      <p className="font-semibold">{foundClient.package}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase text-[10px] mb-1">Price</p>
                      <p className="font-semibold text-signal">৳{foundClient.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-semibold uppercase text-[10px] mb-1">Expiry</p>
                      <p className="font-semibold">{foundClient.expiry}</p>
                    </div>
                  </div>
                </div>

                {/* Duration & Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block">Duration</label>
                    <select
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-signal/30"
                    >
                      {[1, 2, 3, 6, 12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block">Discount (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm font-semibold outline-none focus:ring-2 focus:ring-signal/30"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Payment Method</label>
                  <div className="grid grid-cols-5 gap-2">
                    {paymentMethods.map((m) => {
                      const Icon = m.icon;
                      const isActive = paymentMethod === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPaymentMethod(m.id)}
                          className={cn(
                            "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                            isActive ? "border-signal bg-signal/5 shadow-md" : "border-border hover:border-signal/50"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-signal" : "text-muted-foreground")} />
                          <span className={cn("text-[10px] font-bold", isActive ? "text-signal" : "text-muted-foreground")}>
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Amount Received (৳)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border bg-background text-lg font-bold outline-none focus:ring-2 focus:ring-signal/30"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setAmount(amt)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                          amount === amt ? "bg-signal text-white border-signal" : "bg-background text-muted-foreground border-border hover:border-signal/50"
                        )}
                      >
                        ৳{amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAmount(calculations.grandTotal)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-signal text-signal hover:bg-signal/5 transition-all"
                    >
                      Exact ৳{calculations.grandTotal}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-muted/30 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({months} month{months > 1 ? "s" : ""})</span>
                    <span className="font-semibold">৳{calculations.subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount ({discount}%)</span>
                      <span className="font-semibold">−৳{calculations.discountAmt}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Grand Total</span>
                    <span className="font-heading font-bold text-signal text-lg">৳{calculations.grandTotal}</span>
                  </div>
                </div>

                {/* Due Alert */}
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  calculations.due > 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-emerald-500/10 border-emerald-500/20"
                )}>
                  {calculations.due > 0 ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                      <p className="text-xs text-amber-700 font-semibold">
                        Due: ৳{calculations.due} — Please collect the full amount.
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <p className="text-xs text-emerald-700 font-semibold">
                        Change: ৳{Math.abs(calculations.due)} — Payment complete.
                      </p>
                    </>
                  )}
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Remarks (Optional)</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={2}
                    placeholder="Additional notes..."
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                  >
                    Back to Search
                  </button>
                  <button
                    onClick={handleRenew}
                    className="flex-[2] rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm & Renew
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Success */}
            {step === "success" && foundClient && (
              <div className="text-center py-4">
                <div className="relative w-20 h-20 mx-auto mb-5">
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                  <div className="relative w-full h-full rounded-full bg-emerald-500 flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold mb-1">Payment Successful!</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Renewal completed for <span className="font-semibold text-foreground">{foundClient.name}</span>
                </p>

                <div className="bg-gradient-to-br from-signal-tint/60 to-violet-accent-tint/60 rounded-2xl border border-signal/20 p-5 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Client</p>
                      <p className="font-semibold">{foundClient.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Amount Paid</p>
                      <p className="font-bold text-signal">৳{calculations.grandTotal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Payment Method</p>
                      <p className="font-semibold capitalize">{paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-semibold uppercase mb-1">Duration</p>
                      <p className="font-semibold">{months} Month{months > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> New Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}