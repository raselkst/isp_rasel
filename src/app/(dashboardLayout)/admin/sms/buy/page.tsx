"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare, Wallet, ShieldCheck, Sparkles, Zap, Calendar,
  CreditCard, Smartphone, Building2, Gift, TrendingDown,
  CheckCircle2, AlertCircle, Info, Calculator, Percent
} from "lucide-react";
import { cn } from "@/lib/utils";

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block text-signal">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </div>
  );
}

const zones = [
  { id: "z1", name: "Dhaka North", currentSms: 1993, validity: "08/01/2026" },
  { id: "z2", name: "Dhaka South", currentSms: 850, validity: "05/01/2026" },
  { id: "z3", name: "Chittagong", currentSms: 3200, validity: "10/01/2026" },
  { id: "z4", name: "Sylhet", currentSms: 420, validity: "03/01/2026" },
];

const rateSlabs = [
  { min: 1, max: 999, ratePerThousand: 700, bonus: 0, validityMonths: 6, label: "Standard" },
  { min: 1000, max: 4999, ratePerThousand: 600, bonus: 0, validityMonths: 6, label: "Bronze" },
  { min: 5000, max: 9999, ratePerThousand: 550, bonus: 2, validityMonths: 6, label: "Silver" },
  { min: 10000, max: 49999, ratePerThousand: 500, bonus: 5, validityMonths: 12, label: "Gold" },
  { min: 50000, max: Infinity, ratePerThousand: 450, bonus: 10, validityMonths: 12, label: "Platinum" },
];

const paymentMethods = [
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "rocket", label: "Rocket", icon: Smartphone },
  { id: "bank", label: "Bank Transfer", icon: Building2 },
  { id: "card", label: "Card", icon: CreditCard },
];

export default function BuySmsPage() {
  const [formData, setFormData] = useState({
    zoneId: "z1",
    newQty: 1000,
    paymentMethod: "bkash",
    remarks: "",
  });

  const selectedZone = zones.find((z) => z.id === formData.zoneId) || zones[0];

  const activeSlab = useMemo(() => {
    return rateSlabs.find(
      (slab) => formData.newQty >= slab.min && formData.newQty <= slab.max
    ) || rateSlabs[0];
  }, [formData.newQty]);

  const calculations = useMemo(() => {
    const qty = formData.newQty;
    const rate = activeSlab.ratePerThousand;
    const totalAmount = (qty / 1000) * rate;
    const bonusSms = Math.floor((qty * activeSlab.bonus) / 100);
    const totalAfterPurchase = selectedZone.currentSms + qty + bonusSms;
    const validityDate = new Date();
    validityDate.setMonth(validityDate.getMonth() + activeSlab.validityMonths);
    const newValidity = validityDate.toLocaleDateString("en-GB");

    return {
      qty,
      rate,
      totalAmount,
      bonusSms,
      totalAfterPurchase,
      newValidity,
      slabLabel: activeSlab.label,
      validityMonths: activeSlab.validityMonths,
    };
  }, [formData.newQty, activeSlab, selectedZone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "newQty" ? Number(value) || 0 : value,
    }));
  };

  const handleQtyPreset = (qty: number) => {
    setFormData((prev) => ({ ...prev, newQty: qty }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newQty < 1) {
      alert("Please enter a valid SMS quantity (minimum 1).");
      return;
    }
    alert(
      `Payment Confirmed!\n\nZone: ${selectedZone.name}\nQuantity: ${calculations.qty} SMS\nRate: ৳${calculations.rate}/1000\nTotal Amount: ৳${calculations.totalAmount.toFixed(2)}\nBonus: ${calculations.bonusSms} SMS\nMethod: ${formData.paymentMethod.toUpperCase()}\n\nProceeding to payment gateway...`
    );
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
                Buy SMS Credits
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Purchase SMS credits for your zones with volume-based discounts.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-signal-tint text-signal px-4 py-2 rounded-full text-xs font-semibold border border-signal/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Secure Payment Gateway
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Left: Form */}
            <form onSubmit={handlePayment} className="space-y-6">
              
              {/* Zone Selection */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
                  <MessageSquare className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold text-signal">Zone Information</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Zone Name" required>
                    <select
                      name="zoneId"
                      value={formData.zoneId}
                      onChange={handleChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm text-signal font-semibold focus:ring-2 focus:ring-signal outline-none"
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>{z.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Current SMS Qty">
                    <Input
                      value={selectedZone.currentSms}
                      readOnly
                      className="rounded-xl bg-slate-50 font-semibold text-signal border-slate-200"
                    />
                  </Field>

                  <Field label="Current Validity">
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <Input
                        value={selectedZone.validity}
                        readOnly
                        className="rounded-xl bg-slate-50 font-semibold text-signal border-slate-200 pr-10"
                      />
                    </div>
                  </Field>

                  <Field label="Current Slab">
                    <div className="flex items-center gap-2 bg-signal-tint text-signal px-4 py-2.5 rounded-xl border border-signal/30 text-sm font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> {calculations.slabLabel}
                    </div>
                  </Field>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
                  <Calculator className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold text-signal">Purchase Quantity</h2>
                </div>

                <Field label="New SMS Qty" required>
                  <div className="relative">
                    <Input
                      name="newQty"
                      type="number"
                      value={formData.newQty}
                      onChange={handleChange}
                      min={1}
                      className="rounded-xl bg-white font-semibold text-lg h-12 text-signal border-slate-200"
                    />
                  </div>
                  <p className="text-xs text-signal font-medium mt-1.5">
                    * If you want to buy 1 thousand SMS, just write 1
                  </p>
                </Field>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {[1000, 5000, 10000, 25000, 50000].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => handleQtyPreset(qty)}
                      className={cn(
                        "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                        formData.newQty === qty
                          ? "bg-signal text-white border-signal shadow-md"
                          : "bg-white text-slate-500 border-slate-200 hover:border-signal/50 hover:text-signal"
                      )}
                    >
                      {qty.toLocaleString()}
                    </button>
                  ))}
                </div>

                {/* Rate Info */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">SMS Rate</p>
                    <p className="font-bold text-sm text-signal">৳{calculations.rate} <span className="text-[10px] font-normal text-slate-500">/1000</span></p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Validity</p>
                    <p className="font-bold text-sm text-signal">{calculations.validityMonths} Months</p>
                  </div>
                  <div className="bg-success-tint rounded-xl p-3 border border-success/30">
                    <p className="text-[10px] text-success font-semibold uppercase mb-1">Bonus</p>
                    <p className="font-bold text-sm text-success">
                      {calculations.bonusSms > 0 ? `+${calculations.bonusSms} SMS` : "No Bonus"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
                  <Wallet className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold text-signal">Payment Method</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    const isActive = formData.paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method.id }))}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                          isActive
                            ? "border-signal bg-signal-tint shadow-md"
                            : "border-slate-200 hover:border-signal/50"
                        )}
                      >
                        <Icon className={cn("w-5 h-5", isActive ? "text-signal" : "text-slate-400")} />
                        <span className={cn("text-xs font-semibold", isActive ? "text-signal" : "text-slate-500")}>
                          {method.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <Field label="Remarks">
                    <textarea
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Optional note about this purchase..."
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                    />
                  </Field>
                </div>
              </div>

              {/* Note */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/30">
                <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <p className="text-xs text-signal leading-relaxed">
                  <span className="font-bold">Note:</span> If you purchase 10,000 or more SMS, the validity
                  will be 12 months. For a smaller amount, the validity will be 6 months. If you recharge SMS
                  again within the validity period, the remaining SMS from the previous balance will be added
                  to the new one. Otherwise, they will be deleted.
                </p>
              </div>
            </form>

            {/* Right: Order Summary */}
            <div className="space-y-5 lg:sticky lg:top-24 h-fit">
              <div className="bg-signal rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-5">
                  <Wallet className="w-5 h-5" />
                  <h3 className="font-heading font-bold">Order Summary</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Zone</span>
                    <span className="font-semibold">{selectedZone.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Current SMS</span>
                    <span className="font-semibold">{selectedZone.currentSms}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">New SMS</span>
                    <span className="font-semibold">+{calculations.qty.toLocaleString()}</span>
                  </div>
                  {calculations.bonusSms > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90 flex items-center gap-1">
                        <Gift className="w-3 h-3" /> Bonus
                      </span>
                      <span className="font-semibold">+{calculations.bonusSms}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 my-2" />
                  <div className="flex justify-between">
                    <span className="opacity-90">Rate / 1000</span>
                    <span className="font-semibold">৳{calculations.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Validity</span>
                    <span className="font-semibold">{calculations.validityMonths} Months</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">New Validity</span>
                    <span className="font-semibold">{calculations.newValidity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Total SMS After</span>
                    <span className="font-semibold">{calculations.totalAfterPurchase.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Total Amount</span>
                  <span className="font-heading text-2xl font-bold">৳{calculations.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                <Button
                  type="button"
                  onClick={handlePayment}
                  className="w-full rounded-xl font-semibold h-12 bg-signal hover:bg-signal-hover text-white border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Wallet className="w-4 h-4 mr-2" /> Make Payment
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full rounded-xl font-semibold h-11 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-200">
                  <ShieldCheck className="w-4 h-4 text-success" />
                  <p className="text-xs text-slate-500">
                    Your payment is secured with 256-bit encryption.
                  </p>
                </div>
              </div>

              {/* Savings Info */}
              {calculations.bonusSms > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-success-tint border border-success/30">
                  <TrendingDown className="w-5 h-5 text-success shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-success">
                      You're saving ৳{((700 - calculations.rate) * (calculations.qty / 1000)).toFixed(0)}!
                    </p>
                    <p className="text-xs text-success/80">
                      Plus {calculations.bonusSms} bonus SMS
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}