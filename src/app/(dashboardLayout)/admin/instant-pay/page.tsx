"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Zap, Search, Wallet, Smartphone, Building2, X,
  CheckCircle2, AlertCircle, Calendar, DollarSign, TrendingUp,
  Activity, Clock, RefreshCw, Receipt, Percent, Send, BadgeCheck
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

// 🎯 সব payment method এখন থিম-ভিত্তিক (Signal/Violet/Success টোন)
const paymentMethods = [
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "rocket", label: "Rocket", icon: Smartphone },
  { id: "bank", label: "Bank", icon: Building2 },
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

  const calculations = useMemo(() => {
    const subtotal = foundClient ? foundClient.price * months : 0;
    const discountAmt = (subtotal * discount) / 100;
    const grandTotal = subtotal - discountAmt;
    const due = grandTotal - amount;
    return { subtotal, discountAmt, grandTotal, due };
  }, [foundClient, months, discount, amount]);

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
    <div className="flex min-h-screen bg-slate-50">
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
              <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                Instant Pay
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Search a client and process instant renewal in seconds.
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
            >
              <Zap className="h-4 w-4" /> New Payment
            </button>
          </div>

          {/* Compact Stat Cards — Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Today</p>
                <p className="text-lg font-heading font-bold text-success">৳{stats.todayCollection}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Txns</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.totalTxns}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Success</p>
                <p className="text-lg font-heading font-bold text-violet-accent">{stats.successRate}%</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Pending</p>
                <p className="text-lg font-heading font-bold text-warning">{stats.pending}</p>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">
            {/* Left: Recent Transactions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-lg flex items-center gap-2 text-signal">
                  <Activity className="w-5 h-5 text-signal" /> Recent Transactions
                </h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Last 5
                </span>
              </div>

              <div className="space-y-2">
                {transactions.slice(0, 5).map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      txn.status === "success" ? "bg-success-tint" : "bg-warning-tint"
                    )}>
                      {txn.status === "success" ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-warning" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate text-signal">{txn.client}</p>
                      <p className="text-xs text-slate-500">
                        {txn.method} · {txn.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading font-bold text-signal">৳{txn.amount}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{txn.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: How It Works */}
            <div className="bg-signal-tint rounded-2xl border border-signal/20 p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-5 h-5 text-signal" />
                <h2 className="font-heading font-bold text-lg text-signal">How Instant Pay Works</h2>
              </div>

              <div className="space-y-4 flex-1">
                {[
                  { num: 1, title: "Search Client", desc: "Enter Client ID, Username, or Mobile No.", icon: Search },
                  { num: 2, title: "Verify Details", desc: "Check package, price, and expiry date.", icon: BadgeCheck },
                  { num: 3, title: "Select Payment", desc: "Choose from Cash, bKash, Nagad, or Bank.", icon: Wallet },
                  { num: 4, title: "Confirm Renewal", desc: "Instant renewal with SMS notification.", icon: Send },
                ].map((s) => (
                  <div key={s.num} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <s.icon className="w-4 h-4 text-signal" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-signal">
                        <span className="text-signal mr-1.5">{s.num}.</span>
                        {s.title}
                      </p>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setOpen(true)}
                className="w-full mt-5 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-[1.02] transition-all"
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
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={handleCloseModal} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-signal flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-heading font-bold text-sm text-signal">INSTANT PAY</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  {step === "search" && "Search Client"}
                  {step === "renew" && "Confirm Renewal"}
                  {step === "success" && "Payment Successful"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {step === "search" && "Enter client credentials to proceed."}
                  {step === "renew" && "Verify details and choose payment method."}
                  {step === "success" && "Transaction completed successfully!"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
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
                        isDone ? "bg-success text-white" :
                        isActive ? "bg-signal text-white shadow-md" :
                        "bg-slate-100 text-slate-500"
                      )}>
                        {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                      </div>
                      <span className={cn(
                        "text-xs font-semibold",
                        isActive ? "text-signal" : "text-slate-500"
                      )}>{s}</span>
                      {i < 1 && <div className={cn("flex-1 h-0.5", isDone ? "bg-success" : "bg-slate-100")} />}
                    </div>
                  );
                })}
              </div>
            )}

            {/* STEP 1: Search */}
            {step === "search" && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">
                    Client ID / Username / Mobile <span className="text-destructive">*</span>
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder="e.g. C-101 or rahim_101 or 01711223344"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-signal outline-none focus:ring-2 focus:ring-signal/30"
                      autoFocus
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    Try: <button onClick={() => setSearchTerm("C-101")} className="text-signal font-semibold hover:underline">C-101</button>, <button onClick={() => setSearchTerm("karim_102")} className="text-signal font-semibold hover:underline">karim_102</button>, or <button onClick={() => setSearchTerm("01711889900")} className="text-signal font-semibold hover:underline">01711889900</button>
                  </p>
                </div>

                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full rounded-xl font-semibold h-12 bg-signal text-white shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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
                <div className="bg-signal-tint rounded-2xl border border-signal/20 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-signal flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {foundClient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-signal">{foundClient.name}</p>
                      <p className="text-xs text-slate-500">ID: {foundClient.id} · @{foundClient.username}</p>
                    </div>
                    <span className="bg-success-tint text-success text-[10px] font-bold px-2 py-1 rounded-md border border-success/30">
                      {foundClient.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <p className="text-slate-500 font-semibold uppercase text-[10px] mb-1">Package</p>
                      <p className="font-semibold text-signal">{foundClient.package}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold uppercase text-[10px] mb-1">Price</p>
                      <p className="font-semibold text-signal">৳{foundClient.price}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold uppercase text-[10px] mb-1">Expiry</p>
                      <p className="font-semibold text-signal">{foundClient.expiry}</p>
                    </div>
                  </div>
                </div>

                {/* Duration & Discount */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block text-signal">Duration</label>
                    <select
                      value={months}
                      onChange={(e) => setMonths(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal outline-none focus:ring-2 focus:ring-signal/30"
                    >
                      {[1, 2, 3, 6, 12].map(m => <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="font-semibold text-sm block text-signal">Discount (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal outline-none focus:ring-2 focus:ring-signal/30"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Payment Method</label>
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
                            isActive ? "border-signal bg-signal-tint shadow-md" : "border-slate-200 hover:border-signal/50"
                          )}
                        >
                          <Icon className={cn("w-4 h-4", isActive ? "text-signal" : "text-slate-500")} />
                          <span className={cn("text-[10px] font-bold", isActive ? "text-signal" : "text-slate-500")}>
                            {m.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Amount Received (৳)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">৳</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-lg font-bold text-signal outline-none focus:ring-2 focus:ring-signal/30"
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
                          amount === amt ? "bg-signal text-white border-signal" : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                        )}
                      >
                        ৳{amt}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setAmount(calculations.grandTotal)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border border-signal text-signal hover:bg-signal-tint transition-all"
                    >
                      Exact ৳{calculations.grandTotal}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Subtotal ({months} month{months > 1 ? "s" : ""})</span>
                    <span className="font-semibold text-signal">৳{calculations.subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({discount}%)</span>
                      <span className="font-semibold">−৳{calculations.discountAmt}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2">
                    <span className="font-semibold text-signal">Grand Total</span>
                    <span className="font-heading font-bold text-signal text-lg">৳{calculations.grandTotal}</span>
                  </div>
                </div>

                {/* Due Alert */}
                <div className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border",
                  calculations.due > 0 ? "bg-warning-tint border-warning/30" : "bg-success-tint border-success/30"
                )}>
                  {calculations.due > 0 ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                      <p className="text-xs text-warning font-semibold">
                        Due: ৳{calculations.due} — Please collect the full amount.
                      </p>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                      <p className="text-xs text-success font-semibold">
                        Change: ৳{Math.abs(calculations.due)} — Payment complete.
                      </p>
                    </>
                  )}
                </div>

                {/* Remarks */}
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Remarks (Optional)</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={2}
                    placeholder="Additional notes..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal outline-none focus:ring-2 focus:ring-signal/30 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Back to Search
                  </button>
                  <button
                    onClick={handleRenew}
                    className="flex-[2] rounded-xl font-semibold h-12 bg-signal text-white shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
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
                  <div className="absolute inset-0 rounded-full bg-success/20 animate-ping" />
                  <div className="relative w-full h-full rounded-full bg-success flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold mb-1 text-signal">Payment Successful!</h3>
                <p className="text-sm text-slate-500 mb-6">
                  Renewal completed for <span className="font-semibold text-signal">{foundClient.name}</span>
                </p>

                <div className="bg-signal-tint rounded-2xl border border-signal/20 p-5 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Client</p>
                      <p className="font-semibold text-signal">{foundClient.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Amount Paid</p>
                      <p className="font-bold text-signal">৳{calculations.grandTotal}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Payment Method</p>
                      <p className="font-semibold capitalize text-signal">{paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Duration</p>
                      <p className="font-semibold text-signal">{months} Month{months > 1 ? "s" : ""}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
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