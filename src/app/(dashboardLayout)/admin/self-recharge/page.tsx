"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CreditCard,
  Wallet,
  User,
  Receipt,
  Zap,
  Sparkles,
  X,
} from "lucide-react";

// 🎯 পেমেন্ট অপশন (লোগো সহ)
const paymentOptions = [
  { 
    id: "bkash", 
    label: "bKash", 
    sublabel: "Mobile Banking",
    color: "from-pink-500 to-rose-500",
    icon: Wallet,
  },
  { 
    id: "nagad", 
    label: "Nagad", 
    sublabel: "Mobile Banking",
    color: "from-orange-500 to-amber-500",
    icon: Wallet,
  },
  { 
    id: "card", 
    label: "Credit / Debit Card", 
    sublabel: "Visa, Mastercard",
    color: "from-blue-500 to-cyan-500",
    icon: CreditCard,
  },
];

// 🎯 কুইক অ্যামাউন্ট
const quickAmounts = [500, 1000, 2000, 5000];

export default function SelfRechargePage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("bkash");
  const [amount, setAmount] = useState("");
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    setOpen(true);
  }, []);

  const handlePay = () => {
    if (accepted && amount) {
      // পেমেন্ট সাবমিট লজিক
      console.log("Processing payment:", { amount, method: selected });
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
            Self Recharge
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Recharge your account instantly and securely.
          </p>
        </div>
      </div>

      {/* 🎯 Custom Payment Modal (Overlay) */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => router.back()}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-card rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
            
            {/* Top Gradient Bar */}
            <div className="h-1.5 bg-gradient-to-r from-signal via-violet-accent to-signal" />

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5">
              
              {/* 🎯 Left Column: User Summary (2/5 width) */}
              <div className="md:col-span-2 bg-gradient-to-br from-signal/10 via-card to-violet-accent/10 p-6 sm:p-8 relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-signal/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-accent/20 rounded-full blur-3xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center mb-4 shadow-lg shadow-signal/30">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>

                  <h2 className="font-heading text-xl font-bold mb-1">
                    Recharge for a Better You
                  </h2>
                  <p className="text-xs text-muted-foreground mb-6">
                    Your payment is safe and secure with us.
                  </p>

                  {/* User Info Card */}
                  <div className="space-y-3">
                    <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3.5 w-3.5 text-signal" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Account Holder</span>
                      </div>
                      <p className="font-bold text-sm">NRN Pappy (Admin)</p>
                    </div>

                    <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="h-3.5 w-3.5 text-violet-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">User ID</span>
                      </div>
                      <p className="font-mono font-bold text-sm">152030</p>
                    </div>

                    <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Previous Balance</span>
                      </div>
                      <p className="font-bold text-lg text-emerald-500">৳ 0.00</p>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>256-bit SSL Encrypted Payment</span>
                  </div>
                </div>
              </div>

              {/* 🎯 Right Column: Payment Form (3/5 width) */}
              <div className="md:col-span-3 p-6 sm:p-8">
                
                {/* Amount Section */}
                <div className="mb-6">
                  <Label htmlFor="amount" className="text-sm font-bold mb-2 block">
                    Recharge Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">৳</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 h-14 text-2xl font-bold rounded-xl border-2 focus:border-signal transition-all"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-bold transition-all",
                          amount === amt.toString()
                            ? "bg-signal text-white shadow-md shadow-signal/30"
                            : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-signal" />
                    Choose Payment Method
                  </h3>

                  <div className="space-y-2.5">
                    {paymentOptions.map((opt) => {
                      const Icon = opt.icon;
                      const isSelected = selected === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => setSelected(opt.id)}
                          className={cn(
                            "group w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300",
                            isSelected
                              ? "border-signal bg-signal/5 shadow-md shadow-signal/10"
                              : "border-border bg-card hover:border-muted-foreground/30"
                          )}
                        >
                          {/* Icon */}
                          <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shrink-0 transition-transform group-hover:scale-105",
                            opt.color
                          )}>
                            <Icon className="h-6 w-6" />
                          </div>

                          {/* Label */}
                          <div className="flex-1 text-left">
                            <p className="font-bold text-sm">{opt.label}</p>
                            <p className="text-xs text-muted-foreground">{opt.sublabel}</p>
                          </div>

                          {/* Checkbox Indicator */}
                          <div className={cn(
                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                            isSelected ? "border-signal bg-signal" : "border-muted-foreground/30"
                          )}>
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-start gap-3 text-xs mb-6 cursor-pointer p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="accent-signal mt-0.5 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-muted-foreground leading-relaxed">
                    By clicking <span className="font-bold text-foreground">Pay Now</span>, you accept our{" "}
                    <span className="text-signal underline font-semibold cursor-pointer">terms of service</span>{" "}
                    which is limited to facilitating your payment to{" "}
                    <span className="font-semibold text-foreground">Poli Network</span>.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handlePay}
                    disabled={!accepted || !amount}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300",
                      accepted && amount
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-[1.02]"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    <Lock className="h-4 w-4" />
                    Pay Now {amount && `৳${amount}`}
                  </button>
                </div>

                {/* Footer Security Note */}
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-emerald-500" />
                  <span>Secured by SmartISP Payment Gateway</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}