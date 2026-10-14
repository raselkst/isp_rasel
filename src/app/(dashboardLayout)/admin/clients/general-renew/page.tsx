"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  RefreshCw, ArrowRight, CalendarClock, CreditCard,
  Percent, UserCheck, ShieldCheck, Zap, Gift,
  Wallet, Receipt, CheckCircle2, AlertCircle, Info
} from "lucide-react";

export default function GeneralRenewPage() {
  const [formData, setFormData] = useState({
    months: 1,
    paymentMethod: "CASH",
    amountReceived: 490,
    discount: 0,
    receivedBy: "Al Jaami Technologies",
    remarks: "",
    autoRenew: false,
    sendSMS: true,
    applyVAT: false,
  });

  const packageDetails = {
    name: "10Mbps_Package",
    price: 490,
    billingCycle: "Day 1",
    balance: 0,
    oldExpiry: "01/05/2025",
    newExpiry: "03/09/2025",
  };

  const calculations = useMemo(() => {
    const subTotal = packageDetails.price * formData.months;
    const discountAmount = (subTotal * formData.discount) / 100;
    const vatAmount = formData.applyVAT ? (subTotal - discountAmount) * 0.05 : 0;
    const grandTotal = subTotal - discountAmount + vatAmount;
    const dueAmount = grandTotal - formData.amountReceived;
    return { subTotal, discountAmount, vatAmount, grandTotal, dueAmount };
  }, [formData.months, formData.discount, formData.amountReceived, formData.applyVAT, packageDetails.price]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Renewal Submitted:", { ...formData, calculations });
    alert(`Renewal Confirmed! Total: ৳${calculations.grandTotal}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <RefreshCw className="h-3 w-3" /> Clients · General Renew
            </p>
            <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal mb-2">
              Renew Connection
            </h1>
            <p className="text-sm text-slate-500">Quickly renew client package and process payment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Client Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                <div className="w-14 h-14 rounded-2xl bg-signal text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-md">
                  L
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-bold text-lg text-signal">Liton</h2>
                  <p className="text-xs text-slate-500">Customer ID: 2550 · mb@liton.crs</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-success-tint text-success px-3 py-1.5 rounded-full text-xs font-semibold border border-success/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Package</p>
                  <p className="font-semibold text-signal">{packageDetails.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Billing Cycle</p>
                  <p className="font-semibold text-signal">{packageDetails.billingCycle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Current Balance</p>
                  <p className={`font-semibold ${packageDetails.balance === 0 ? "text-success" : "text-destructive"}`}>
                    ৳{packageDetails.balance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Expiry Date Transition */}
              <div className="flex items-center gap-4 mt-6 p-4 rounded-2xl bg-signal-tint border border-signal/20">
                <CalendarClock className="h-5 w-5 text-signal shrink-0" />
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Old Expiry</p>
                    <span className="text-slate-500 line-through">{packageDetails.oldExpiry}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-signal" />
                  <div>
                    <p className="text-[10px] text-signal uppercase font-semibold">New Expiry</p>
                    <span className="font-bold text-signal">{packageDetails.newExpiry}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rate & Duration Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
                <Zap className="w-5 h-5 text-signal" />
                <h2 className="font-heading text-lg font-bold text-signal">Rate & Duration</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Package Price</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-signal">
                    ৳{packageDetails.price}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Bill for 1 Month</label>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-signal">
                    ৳{packageDetails.price}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">No of Months</label>
                  <select
                    name="months"
                    value={formData.months}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
                  >
                    {[1, 2, 3, 6, 12].map((m) => (
                      <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add-ons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-signal-tint cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="applyVAT"
                    checked={formData.applyVAT}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-signal focus:ring-signal cursor-pointer accent-signal"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5 text-signal">
                      <Percent className="w-3.5 h-3.5" /> Apply VAT (5%)
                    </p>
                    <p className="text-xs text-slate-500">Add government VAT to the invoice</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-violet-accent-tint cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    checked={formData.autoRenew}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-violet-accent focus:ring-violet-accent cursor-pointer accent-violet-accent"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5 text-violet-accent">
                      <Gift className="w-3.5 h-3.5" /> Auto Renew
                    </p>
                    <p className="text-xs text-slate-500">Automatically renew on expiry</p>
                  </div>
                </label>
              </div>

              {/* Grand Total Card */}
              <div className="mt-6 p-5 rounded-2xl bg-signal text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs opacity-90 font-semibold uppercase tracking-wider">Grand Total</p>
                  <p className="text-[10px] opacity-75 mt-0.5">
                    {formData.months} month{formData.months > 1 ? "s" : ""} {formData.applyVAT && "· incl. VAT"}
                  </p>
                </div>
                <span className="font-heading text-2xl font-bold">৳{calculations.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-6">
                <Wallet className="w-5 h-5 text-signal" />
                <h2 className="font-heading text-lg font-bold text-signal">Payment Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Payment Method</label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal/30 outline-none"
                  >
                    <option value="CASH">CASH</option>
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="ROCKET">Rocket</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">৳</span>
                    <Input
                      name="amountReceived"
                      type="number"
                      value={formData.amountReceived}
                      onChange={handleChange}
                      className="pl-8 text-signal"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Discount (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      name="discount"
                      type="number"
                      value={formData.discount}
                      onChange={handleChange}
                      className="pl-9 text-signal"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Received By</label>
                  <select
                    name="receivedBy"
                    value={formData.receivedBy}
                    onChange={handleChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal/30 outline-none"
                  >
                    <option>Al Jaami Technologies</option>
                    <option>Admin</option>
                    <option>Reseller</option>
                  </select>
                </div>
              </div>

              {/* Due Amount Display */}
              <div className={`mt-5 p-4 rounded-xl flex items-center gap-3 border ${
                calculations.dueAmount > 0
                  ? "bg-warning-tint border-warning/30"
                  : "bg-success-tint border-success/30"
              }`}>
                {calculations.dueAmount > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-warning font-semibold uppercase">Due Amount</p>
                      <p className="text-sm font-bold text-warning">৳{calculations.dueAmount.toFixed(2)} will be added to balance</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-success font-semibold uppercase">Payment Complete</p>
                      <p className="text-sm font-bold text-success">No due amount. Change: ৳{Math.abs(calculations.dueAmount).toFixed(2)}</p>
                    </div>
                  </>
                )}
              </div>

              {/* SMS & Remarks */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sendSMS"
                    checked={formData.sendSMS}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-signal focus:ring-signal cursor-pointer accent-signal"
                  />
                  <div>
                    <p className="text-sm font-semibold text-signal">Send SMS Notification</p>
                    <p className="text-xs text-slate-500">Notify client about successful renewal</p>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional note about this renewal..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal/30 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl font-semibold h-12 px-8 order-2 sm:order-1 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-2xl font-semibold h-12 px-8 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all order-1 sm:order-2"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Renewal
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}