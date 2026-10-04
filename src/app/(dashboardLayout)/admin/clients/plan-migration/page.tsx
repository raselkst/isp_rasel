"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, FormSection, EditableField, premiumInput } from "@/components/clients-v2/premium-form";
import {
  ArrowLeftRight, Wifi, CheckCircle2, AlertCircle, Calculator,
  Calendar, Zap, Gift, Percent, Wallet, RefreshCw
} from "lucide-react";

// প্ল্যান ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const availablePlans = [
  { id: "pkg1", name: "10_Mbps_Package", price: 490.0 },
  { id: "pkg2", name: "12_Mbps_Package", price: 588.0 },
  { id: "pkg3", name: "15_Mbps_Package", price: 700.0 },
  { id: "pkg4", name: "20_Mbps_Package", price: 900.0 },
  { id: "pkg5", name: "30_Mbps_Package", price: 1200.0 },
];

// ক্লায়েন্টের বর্তমান তথ্য
const clientInfo = {
  name: "Md Milan",
  id: "10158",
  username: "576378",
  status: "Active",
  currentPlan: { id: "pkg1", name: "10_Mbps_Package", price: 490.0 },
  billingCycleDays: 30,
  daysRemaining: 29,
};

function PlanCard({
  label,
  name,
  price,
  tone,
  icon: Icon,
}: {
  label: string;
  name: string;
  price: string;
  tone: "muted" | "signal";
  icon: any;
}) {
  return (
    <div
      className={`flex-1 rounded-2xl p-5 border-2 transition-all duration-300 ${
        tone === "signal"
          ? "border-signal bg-signal-tint/50 shadow-lg shadow-signal/10"
          : "border-dashed border-border bg-muted/30"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">{label}</p>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`h-4 w-4 ${tone === "signal" ? "text-signal" : "text-muted-foreground"}`} />
        <p className="font-heading font-bold text-sm">{name}</p>
      </div>
      <p className={`text-sm font-semibold ${tone === "signal" ? "text-signal" : "text-muted-foreground"}`}>
        ৳{price} / month
      </p>
    </div>
  );
}

export default function PlanMigrationPage() {
  const [formData, setFormData] = useState({
    newPlanId: "pkg2",
    paymentMethod: "CASH",
    amountReceived: 0,
    discount: 0,
    effectiveDate: "immediate",
    remarks: "",
    carryForwardBalance: true,
    sendSMS: true,
  });

  const selectedPlan = availablePlans.find((p) => p.id === formData.newPlanId) || availablePlans[1];

  // রিয়েল-টাইম প্রোরেটেড ক্যালকুলেশন
  const calculations = useMemo(() => {
    const totalDays = clientInfo.billingCycleDays;
    const remainingDays = clientInfo.daysRemaining;
    const usedDays = totalDays - remainingDays;

    // পুরনো প্ল্যানের প্রোরেটেড ভ্যালু (যা ব্যবহার হয়নি)
    const oldPlanProrated = (clientInfo.currentPlan.price / totalDays) * remainingDays;
    // নতুন প্ল্যানের প্রোরেটেড ভ্যালু (যা ব্যবহার হবে)
    const newPlanProrated = (selectedPlan.price / totalDays) * remainingDays;
    // নেট ডিউ (পার্থক্য)
    const netDue = Math.max(0, newPlanProrated - oldPlanProrated);
    // যদি নতুন প্ল্যান পুরনোর চেয়ে সস্তা হয়, তাহলে ক্যারি ফরওয়ার্ড ব্যালেন্স
    const carryForward = Math.max(0, oldPlanProrated - newPlanProrated);

    // ডিসকাউন্ট এবং পেমেন্ট
    const discountAmount = (netDue * formData.discount) / 100;
    const finalDue = netDue - discountAmount;
    const change = formData.amountReceived - finalDue;

    return {
      totalDays,
      remainingDays,
      usedDays,
      oldPlanProrated,
      newPlanProrated,
      netDue,
      carryForward,
      discountAmount,
      finalDue,
      change,
    };
  }, [formData.newPlanId, formData.discount, formData.amountReceived, selectedPlan.price]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Plan Migration Submitted:", { ...formData, calculations });
    alert(`Migration Confirmed! Net Due: ৳${calculations.finalDue.toFixed(2)}`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-4xl mx-auto">
          <FormShell icon={ArrowLeftRight} eyebrow="Clients · Plan Migration" title="Change Package">
            
            {/* Client Info Card */}
            <FormSection>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-signal to-violet-accent text-white flex items-center justify-center font-heading font-bold text-lg shrink-0 shadow-md">
                  M
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold">{clientInfo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Customer ID {clientInfo.id} · Username {clientInfo.username} ·{" "}
                    <span className="text-emerald-600 font-semibold">{clientInfo.status}</span>
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-amber-500/10 text-amber-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-500/20">
                  <Calendar className="w-3.5 h-3.5" /> {calculations.remainingDays} days left
                </div>
              </div>

              {/* Plan Comparison */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <PlanCard
                  label="Current Plan"
                  name={clientInfo.currentPlan.name}
                  price={clientInfo.currentPlan.price.toFixed(2)}
                  tone="muted"
                  icon={Wifi}
                />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0 shadow-lg rotate-90 sm:rotate-0">
                  <ArrowLeftRight className="h-4 w-4 text-white" />
                </div>
                <PlanCard
                  label="New Plan"
                  name={selectedPlan.name}
                  price={selectedPlan.price.toFixed(2)}
                  tone="signal"
                  icon={Zap}
                />
              </div>
            </FormSection>

            {/* Plan Selection */}
            <FormSection title="Select New Plan">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Choose a Package</label>
                <select
                  name="newPlanId"
                  value={formData.newPlanId}
                  onChange={handleChange}
                  className={premiumInput}
                >
                  {availablePlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — ৳{plan.price.toFixed(2)}/month
                    </option>
                  ))}
                </select>
              </div>
            </FormSection>

            {/* Prorated Adjustment */}
            <FormSection title="Prorated Adjustment">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-signal" />
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase">Remaining this cycle</p>
                  </div>
                  <p className="font-heading font-bold text-lg">{calculations.remainingDays} days</p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    out of {calculations.totalDays} days
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-4 h-4 text-amber-500" />
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase">Old plan (prorated)</p>
                  </div>
                  <p className="font-heading font-bold text-lg">৳{calculations.oldPlanProrated.toFixed(2)}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{clientInfo.currentPlan.name}</p>
                </div>
                <div className="bg-signal-tint/60 rounded-xl p-4 border border-signal/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-signal" />
                    <p className="text-[11px] text-signal font-semibold uppercase">New plan (prorated)</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-signal">৳{calculations.newPlanProrated.toFixed(2)}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{selectedPlan.name}</p>
                </div>
              </div>

              {/* Net Amount Due */}
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-signal to-violet-accent text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs opacity-90 font-semibold uppercase tracking-wider">Net Amount Due</p>
                  <p className="text-[10px] opacity-75 mt-0.5">
                    {calculations.carryForward > 0
                      ? `৳${calculations.carryForward.toFixed(2)} will be carried forward`
                      : "Prorated difference to pay now"}
                  </p>
                </div>
                <span className="font-heading text-2xl font-bold">৳{calculations.netDue.toFixed(2)}</span>
              </div>
            </FormSection>

            {/* Payment */}
            <FormSection title="Payment Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="Payment method">
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className={premiumInput}
                  >
                    <option value="CASH">CASH</option>
                    <option value="BKASH">bKash</option>
                    <option value="NAGAD">Nagad</option>
                    <option value="ROCKET">Rocket</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </EditableField>
                <EditableField label="Amount received">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      name="amountReceived"
                      type="number"
                      value={formData.amountReceived}
                      onChange={handleChange}
                      className="pl-8"
                      placeholder={calculations.netDue.toFixed(2)}
                    />
                  </div>
                </EditableField>
                <EditableField label="Discount (%)">
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
                </EditableField>
                <EditableField label="Effective Date">
                  <select
                    name="effectiveDate"
                    value={formData.effectiveDate}
                    onChange={handleChange}
                    className={premiumInput}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="next-cycle">Next Billing Cycle</option>
                  </select>
                </EditableField>
              </div>

              {/* Payment Status */}
              <div
                className={`mt-5 p-4 rounded-xl flex items-center gap-3 ${
                  calculations.change >= 0
                    ? "bg-emerald-500/10 border border-emerald-500/20"
                    : "bg-amber-500/10 border border-amber-500/20"
                }`}
              >
                {calculations.change >= 0 ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-emerald-700 font-semibold uppercase">Payment Complete</p>
                      <p className="text-sm font-bold text-emerald-700">
                        Change: ৳{calculations.change.toFixed(2)}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-amber-700 font-semibold uppercase">Due Amount</p>
                      <p className="text-sm font-bold text-amber-700">
                        ৳{Math.abs(calculations.change).toFixed(2)} still due
                      </p>
                    </div>
                  </>
                )}
              </div>
            </FormSection>

            {/* Additional Options */}
            <FormSection title="Additional Options">
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="carryForwardBalance"
                    checked={formData.carryForwardBalance}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      <Gift className="w-3.5 h-3.5 text-signal" /> Carry Forward Balance
                    </p>
                    <p className="text-xs text-muted-foreground">If new plan is cheaper, keep remaining as balance</p>
                  </div>
                </label>

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
                      <Zap className="w-3.5 h-3.5 text-violet-accent" /> Send SMS Notification
                    </p>
                    <p className="text-xs text-muted-foreground">Notify client about plan change</p>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional note about this migration..."
                    rows={3}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none resize-none"
                  />
                </div>
              </div>
            </FormSection>

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
                <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Migration
              </Button>
            </div>

          </FormShell>
        </div>
      </div>
    </div>
  );
}