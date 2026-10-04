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
  // স্টেট ম্যানেজমেন্ট (সব ফিল্ড অ্যাক্টিভ)
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

  // প্যাকেজ ডিটেইলস (রিয়েল অ্যাপে API থেকে আসবে)
  const packageDetails = {
    name: "10Mbps_Package",
    price: 490,
    billingCycle: "Day 1",
    balance: 0,
    oldExpiry: "01/05/2025",
    newExpiry: "03/09/2025",
  };

  // ডাইনামিক ক্যালকুলেশন
  const calculations = useMemo(() => {
    const subTotal = packageDetails.price * formData.months;
    const discountAmount = (subTotal * formData.discount) / 100;
    const vatAmount = formData.applyVAT ? (subTotal - discountAmount) * 0.05 : 0; // ৫% ভ্যাট
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
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-2">
              Renew Connection
            </h1>
            <p className="text-sm text-muted-foreground">Quickly renew client package and process payment.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Client Info Card */}
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-signal to-violet-accent text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-lg">
                  L
                </div>
                <div className="flex-1">
                  <h2 className="font-heading font-bold text-lg">Liton</h2>
                  <p className="text-xs text-muted-foreground">Customer ID: 2550 · mb@liton.crs</p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Package</p>
                  <p className="font-semibold text-foreground">{packageDetails.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Billing Cycle</p>
                  <p className="font-semibold text-foreground">{packageDetails.billingCycle}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground font-medium">Current Balance</p>
                  <p className={`font-semibold ${packageDetails.balance === 0 ? "text-emerald-600" : "text-red-600"}`}>
                    ৳{packageDetails.balance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Expiry Date Transition */}
              <div className="flex items-center gap-4 mt-6 p-4 rounded-2xl bg-gradient-to-r from-signal-tint/60 to-violet-accent-tint/60 border border-signal/10">
                <CalendarClock className="h-5 w-5 text-signal shrink-0" />
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Old Expiry</p>
                    <span className="text-muted-foreground line-through">{packageDetails.oldExpiry}</span>
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
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-6">
                <Zap className="w-5 h-5 text-signal" />
                <h2 className="font-heading text-lg font-bold">Rate & Duration</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Package Price</label>
                  <div className="bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm font-semibold">
                    ৳{packageDetails.price}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Bill for 1 Month</label>
                  <div className="bg-muted/50 border border-input rounded-xl px-4 py-2.5 text-sm font-semibold">
                    ৳{packageDetails.price}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">No of Months</label>
                  <select 
                    name="months" 
                    value={formData.months} 
                    onChange={handleChange}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-signal outline-none"
                  >
                    {[1, 2, 3, 6, 12].map((m) => (
                      <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Add-ons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="applyVAT" 
                    checked={formData.applyVAT} 
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5"><Percent className="w-3.5 h-3.5 text-signal" /> Apply VAT (5%)</p>
                    <p className="text-xs text-muted-foreground">Add government VAT to the invoice</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    name="autoRenew" 
                    checked={formData.autoRenew} 
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-violet-accent" /> Auto Renew</p>
                    <p className="text-xs text-muted-foreground">Automatically renew on expiry</p>
                  </div>
                </label>
              </div>

              {/* Grand Total Card */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-signal to-violet-accent text-white flex items-center justify-between shadow-lg">
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
            <div className="bg-card rounded-2xl border shadow-sm p-6">
              <div className="flex items-center gap-2 border-b pb-3 mb-6">
                <Wallet className="w-5 h-5 text-signal" />
                <h2 className="font-heading text-lg font-bold">Payment Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Payment Method</label>
                  <select 
                    name="paymentMethod" 
                    value={formData.paymentMethod} 
                    onChange={handleChange}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="CASH">CASH</option>
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="ROCKET">Rocket</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input 
                      name="amountReceived" 
                      type="number" 
                      value={formData.amountReceived} 
                      onChange={handleChange} 
                      className="pl-8" 
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Discount (%)</label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      name="discount" 
                      type="number" 
                      value={formData.discount} 
                      onChange={handleChange} 
                      className="pl-9" 
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Received By</label>
                  <select 
                    name="receivedBy" 
                    value={formData.receivedBy} 
                    onChange={handleChange}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option>Al Jaami Technologies</option>
                    <option>Admin</option>
                    <option>Reseller</option>
                  </select>
                </div>
              </div>

              {/* Due Amount Display */}
              <div className={`mt-5 p-4 rounded-xl flex items-center gap-3 ${calculations.dueAmount > 0 ? "bg-amber-500/10 border border-amber-500/20" : "bg-emerald-500/10 border border-emerald-500/20"}`}>
                {calculations.dueAmount > 0 ? (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-amber-700 font-semibold uppercase">Due Amount</p>
                      <p className="text-sm font-bold text-amber-700">৳{calculations.dueAmount.toFixed(2)} will be added to balance</p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-emerald-700 font-semibold uppercase">Payment Complete</p>
                      <p className="text-sm font-bold text-emerald-700">No due amount. Change: ৳{Math.abs(calculations.dueAmount).toFixed(2)}</p>
                    </div>
                  </>
                )}
              </div>

              {/* SMS & Remarks */}
              <div className="mt-6 pt-6 border-t space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="sendSMS" 
                    checked={formData.sendSMS} 
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-semibold">Send SMS Notification</p>
                    <p className="text-xs text-muted-foreground">Notify client about successful renewal</p>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Remarks</label>
                  <textarea 
                    name="remarks" 
                    value={formData.remarks} 
                    onChange={handleChange}
                    placeholder="Optional note about this renewal..."
                    rows={3}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <Button type="button" variant="outline" className="rounded-2xl font-semibold h-12 px-8 order-2 sm:order-1">
                Cancel
              </Button>
              <Button type="submit" className="rounded-2xl font-semibold h-12 px-8 bg-gradient-to-r from-signal to-violet-accent border-0 shadow-lg hover:shadow-xl transition-shadow order-1 sm:order-2">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Renewal
              </Button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}