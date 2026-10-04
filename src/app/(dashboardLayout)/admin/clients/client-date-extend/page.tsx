"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, FormSection, EditableField, premiumInput } from "@/components/clients-v2/premium-form";
import {
  CalendarClock, Plus, Minus, ArrowRight, CheckCircle2,
  AlertCircle, Zap, Gift, Percent, Wallet, FileText, ShieldCheck
} from "lucide-react";

// ক্লায়েন্ট ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const clientInfo = {
  name: "Liton",
  id: "2550",
  username: "mb@liton.crs",
  package: "10Mbps_Package",
  currentExpiry: "2025-05-01T06:00:00",
  monthlyPrice: 490,
};

export default function ClientDateExtendPage() {
  const [formData, setFormData] = useState({
    days: 3,
    reason: "",
    chargeable: false, // চার্জ নেওয়া হবে কি না
    applyVAT: false,
    sendSMS: true,
    autoRenew: false,
  });

  // রিয়েল-টাইম ক্যালকুলেশন
  const calculations = useMemo(() => {
    const currentDate = new Date(clientInfo.currentExpiry);
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + formData.days);

    // প্রোরেটেড চার্জ (যদি Chargeable হয়)
    const dailyRate = clientInfo.monthlyPrice / 30;
    const baseCharge = dailyRate * formData.days;
    const vatAmount = formData.applyVAT ? baseCharge * 0.05 : 0;
    const totalCharge = formData.chargeable ? baseCharge + vatAmount : 0;

    return {
      oldExpiry: currentDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      newExpiry: newDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      newExpiryFull: newDate.toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      baseCharge,
      vatAmount,
      totalCharge,
      dailyRate,
    };
  }, [formData.days, formData.chargeable, formData.applyVAT]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const adjustDays = (amount: number) => {
    setFormData((prev) => ({ ...prev, days: Math.max(1, prev.days + amount) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Date Extend Submitted:", { ...formData, calculations });
    alert(`Expiry Extended! New Date: ${calculations.newExpiryFull}`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-3xl mx-auto">
          <FormShell icon={CalendarClock} eyebrow="Clients · Date Extend" title="Extend Expiry Date">
            
            {/* Client Info Card */}
            <FormSection>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-signal to-violet-accent text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-lg">
                  {clientInfo.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-lg">{clientInfo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {clientInfo.id} · {clientInfo.username} · {clientInfo.package}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-signal-tint text-signal px-3 py-1.5 rounded-full text-xs font-semibold border border-signal/20">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active
                </div>
              </div>

              <div className="bg-muted/30 rounded-xl p-4 border border-border">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Current Expiry</p>
                <p className="font-heading font-bold text-lg">{calculations.oldExpiry}</p>
                <p className="text-xs text-muted-foreground mt-1">Time: 06:00 AM</p>
              </div>
            </FormSection>

            {/* Day Selector */}
            <FormSection title="Extend Duration">
              <div className="flex items-center gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => adjustDays(-1)}
                  className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors shrink-0 active:scale-95"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="flex-1 text-center">
                  <span className="font-heading text-5xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                    {formData.days}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2 font-semibold">
                    day{formData.days !== 1 && "s"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => adjustDays(1)}
                  className="w-12 h-12 rounded-2xl bg-signal-tint text-signal flex items-center justify-center hover:bg-signal/20 transition-colors shrink-0 active:scale-95"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {[1, 3, 7, 15, 30, 60, 90].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, days: n }))}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      formData.days === n
                        ? "bg-signal text-white shadow-md scale-105"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    }`}
                  >
                    +{n}d
                  </button>
                ))}
              </div>

              {/* Expiry Transition */}
              <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-signal-tint/60 to-violet-accent-tint/60 border border-signal/10">
                <CalendarClock className="h-5 w-5 text-signal shrink-0" />
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Old Expiry</p>
                    <span className="text-muted-foreground line-through">{calculations.oldExpiry}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-signal" />
                  <div>
                    <p className="text-[10px] text-signal uppercase font-semibold">New Expiry</p>
                    <span className="font-bold text-signal">{calculations.newExpiry}</span>
                  </div>
                  <div className="ml-auto bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                    +{formData.days} days
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Charge Configuration */}
            <FormSection title="Charge Configuration">
              <label className="flex items-center gap-3 p-4 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors mb-5">
                <input
                  type="checkbox"
                  name="chargeable"
                  checked={formData.chargeable}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-signal" /> Charge for Extension
                  </p>
                  <p className="text-xs text-muted-foreground">
                    If unchecked, this will be a free extension (no charge applied)
                  </p>
                </div>
              </label>

              {formData.chargeable && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-muted/30 rounded-xl p-4 border border-border">
                      <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Daily Rate</p>
                      <p className="font-heading font-bold text-lg">৳{calculations.dailyRate.toFixed(2)}</p>
                    </div>
                    <div className="bg-muted/30 rounded-xl p-4 border border-border">
                      <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Base Charge</p>
                      <p className="font-heading font-bold text-lg">৳{calculations.baseCharge.toFixed(2)}</p>
                    </div>
                    <div className="bg-signal-tint/60 rounded-xl p-4 border border-signal/20">
                      <p className="text-[11px] text-signal font-semibold uppercase mb-1">Total Charge</p>
                      <p className="font-heading font-bold text-lg text-signal">৳{calculations.totalCharge.toFixed(2)}</p>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="applyVAT"
                      checked={formData.applyVAT}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <Percent className="w-3.5 h-3.5 text-signal" /> Apply VAT (5%)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Adds ৳{calculations.vatAmount.toFixed(2)} government VAT
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Total Display */}
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-signal to-violet-accent text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs opacity-90 font-semibold uppercase tracking-wider">Total Payable</p>
                  <p className="text-[10px] opacity-75 mt-0.5">
                    {formData.chargeable ? "Charged for extension" : "Free extension — no charge"}
                  </p>
                </div>
                <span className="font-heading text-2xl font-bold">৳{calculations.totalCharge.toFixed(2)}</span>
              </div>
            </FormSection>

            {/* Reason & Notifications */}
            <FormSection title="Reason & Notifications">
              <div className="space-y-4">
                <EditableField label="Reason for Extension" required>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      name="reason"
                      value={formData.reason}
                      onChange={handleChange}
                      placeholder="e.g. Service outage compensation, Customer request, etc."
                      rows={3}
                      className="w-full bg-background border border-input rounded-xl pl-9 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none resize-none"
                    />
                  </div>
                </EditableField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      name="sendSMS"
                      checked={formData.sendSMS}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-violet-accent" /> Send SMS
                      </p>
                      <p className="text-xs text-muted-foreground">Notify client</p>
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
                      <p className="text-sm font-semibold flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-violet-accent" /> Auto Renew
                      </p>
                      <p className="text-xs text-muted-foreground">Enable after expiry</p>
                    </div>
                  </label>
                </div>
              </div>
            </FormSection>

            {/* Info Banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-signal-tint/50 border border-signal/20">
              <AlertCircle className="w-5 h-5 text-signal shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-signal uppercase">Important</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                  Extending the expiry date will not affect the client's billing cycle. 
                  The new expiry is calculated from the current expiry date.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl font-semibold h-12 px-8 order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-2xl font-semibold h-12 px-8 bg-gradient-to-r from-signal to-violet-accent border-0 shadow-lg hover:shadow-xl transition-shadow order-1 sm:order-2"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" /> Extend Expiry
              </Button>
            </div>

          </FormShell>
        </div>
      </div>
    </div>
  );
}