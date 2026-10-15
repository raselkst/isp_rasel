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
  Sparkles,
  X,
} from "lucide-react";

// 🎯 Payment Options — Theme Connected (সলিড Teal টোন)
const paymentOptions = [
  {
    id: "bkash",
    label: "bKash",
    sublabel: "Mobile Banking",
    icon: Wallet,
  },
  {
    id: "nagad",
    label: "Nagad",
    sublabel: "Mobile Banking",
    icon: Wallet,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    sublabel: "Visa, Mastercard",
    icon: CreditCard,
  },
];

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
      console.log("Processing payment:", { amount, method: selected });
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
            Self Recharge
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Recharge your account instantly and securely.
          </p>
        </div>
      </div>

      {/* 🎯 Custom Payment Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => router.back()}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

            {/* Top Teal Bar */}
            <div className="h-1.5 bg-signal" />

            {/* Close Button */}
            <button
              onClick={() => router.back()}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-5">

              {/* 🎯 Left Column: User Summary */}
              <div className="md:col-span-2 bg-signal-tint p-6 sm:p-8 relative overflow-hidden">
                {/* Decorative Glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-signal/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-signal/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-signal flex items-center justify-center mb-4 shadow-lg shadow-signal/30">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>

                  <h2 className="font-heading text-xl font-bold mb-1 text-signal">
                    Recharge for a Better You
                  </h2>
                  <p className="text-xs text-slate-600 mb-6">
                    Your payment is safe and secure with us.
                  </p>

                  {/* User Info Card */}
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-3 border border-signal/20">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-3.5 w-3.5 text-signal" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Account Holder
                        </span>
                      </div>
                      <p className="font-bold text-sm text-signal">NRN Pappy (Admin)</p>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-signal/20">
                      <div className="flex items-center gap-2 mb-1">
                        <Receipt className="h-3.5 w-3.5 text-signal" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          User ID
                        </span>
                      </div>
                      <p className="font-mono font-bold text-sm text-signal">152030</p>
                    </div>

                    <div className="bg-white rounded-xl p-3 border border-success/30">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-3.5 w-3.5 text-success" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Previous Balance
                        </span>
                      </div>
                      <p className="font-bold text-lg text-success">৳ 0.00</p>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 flex items-center gap-2 text-[10px] text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-success" />
                    <span>256-bit SSL Encrypted Payment</span>
                  </div>
                </div>
              </div>

              {/* 🎯 Right Column: Payment Form */}
              <div className="md:col-span-3 p-6 sm:p-8">

                {/* Amount Section */}
                <div className="mb-6">
                  <Label htmlFor="amount" className="text-sm font-bold mb-2 block text-signal">
                    Recharge Amount
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-500">
                      ৳
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 h-14 text-2xl font-bold rounded-xl border-2 border-slate-200 text-signal focus:border-signal transition-all"
                    />
                  </div>

                  {/* Quick Amount Buttons */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt.toString())}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-bold transition-all border",
                          amount === amt.toString()
                            ? "bg-signal text-white border-signal shadow-md"
                            : "bg-white text-slate-500 border-slate-200 hover:bg-signal-tint hover:text-signal hover:border-signal/30"
                        )}
                      >
                        ৳{amt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method Section */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-signal">
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
                              ? "border-signal bg-signal-tint shadow-md shadow-signal/10"
                              : "border-slate-200 bg-white hover:border-signal/30"
                          )}
                        >
                          {/* Icon */}
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                              isSelected
                                ? "bg-signal text-white"
                                : "bg-signal-tint text-signal"
                            )}
                          >
                            <Icon className="h-6 w-6" />
                          </div>

                          {/* Label */}
                          <div className="flex-1 text-left">
                            <p className="font-bold text-sm text-signal">{opt.label}</p>
                            <p className="text-xs text-slate-500">{opt.sublabel}</p>
                          </div>

                          {/* Checkbox Indicator */}
                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                              isSelected
                                ? "border-signal bg-signal"
                                : "border-slate-300"
                            )}
                          >
                            {isSelected && <CheckCircle2 className="h-4 w-4 text-white" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <label className="flex items-start gap-3 text-xs mb-6 cursor-pointer p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => setAccepted(e.target.checked)}
                    className="accent-signal mt-0.5 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-slate-600 leading-relaxed">
                    By clicking{" "}
                    <span className="font-bold text-signal">Pay Now</span>, you accept our{" "}
                    <span className="text-signal underline font-semibold cursor-pointer">
                      terms of service
                    </span>{" "}
                    which is limited to facilitating your payment to{" "}
                    <span className="font-semibold text-signal">Poli Network</span>.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
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
                        ? "bg-signal text-white shadow-lg shadow-signal/30 hover:bg-signal-hover hover:scale-[1.02]"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    <Lock className="h-4 w-4" />
                    Pay Now {amount && `৳${amount}`}
                  </button>
                </div>

                {/* Footer Security Note */}
                <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-slate-500">
                  <ShieldCheck className="h-3 w-3 text-success" />
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