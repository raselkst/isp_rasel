"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, FormSection, EditableField, premiumInput } from "@/components/clients-v2/premium-form";
import {
  Sparkles, ShieldAlert, CheckCircle2, AlertCircle, Calendar,
  Gift, Percent, Wallet, Zap, UserCheck, FileText, TrendingDown
} from "lucide-react";

// ক্লায়েন্ট ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const clientInfo = {
  name: "Liton",
  id: "2550",
  username: "mb@liton.crs",
  package: "10Mbps_Package",
  standardPrice: 490,
  currentExpiry: "2025-05-01",
  balance: 0,
};

export default function SpecialRenewPage() {
  const [formData, setFormData] = useState({
    specialAmount: 0,
    extendDays: 30,
    discount: 100, // স্পেশাল রিনিউতে সাধারণত ১০০% ডিসকাউন্ট হয়
    approvedBy: "Network Service Provider (NSP)",
    reason: "",
    paymentMethod: "CASH",
    applyVAT: false,
    sendSMS: true,
    autoRenew: false,
    remarks: "",
  });

  // রিয়েল-টাইম ক্যালকুলেশন
  const calculations = useMemo(() => {
    const standardAmount = (clientInfo.standardPrice / 30) * formData.extendDays; // প্রোরেটেড স্ট্যান্ডার্ড
    const discountAmount = (standardAmount * formData.discount) / 100;
    const afterDiscount = standardAmount - discountAmount;
    const vatAmount = formData.applyVAT ? afterDiscount * 0.05 : 0;
    const finalAmount = formData.specialAmount + vatAmount; // স্পেশাল অ্যামাউন্ট সরাসরি
    const savings = standardAmount - finalAmount;
    
    // নতুন এক্সপায়ারি ডেট ক্যালকুলেশন
    const currentExpiryDate = new Date(clientInfo.currentExpiry);
    const newExpiryDate = new Date(currentExpiryDate);
    newExpiryDate.setDate(newExpiryDate.getDate() + formData.extendDays);

    return {
      standardAmount,
      discountAmount,
      afterDiscount,
      vatAmount,
      finalAmount,
      savings,
      newExpiryDate: newExpiryDate.toISOString().split("T")[0],
      oldExpiryDate: clientInfo.currentExpiry,
    };
  }, [formData.specialAmount, formData.extendDays, formData.discount, formData.applyVAT]);

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
    console.log("Special Renewal Submitted:", { ...formData, calculations });
    alert(`Special Renewal Applied! New Expiry: ${calculations.newExpiryDate}`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-3xl mx-auto">
          <FormShell icon={Sparkles} eyebrow="Clients · Special Renew" title="Special Renewal">
            
            {/* Warning Banner */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-caution/10 border border-caution/20 mb-6">
              <ShieldAlert className="h-5 w-5 text-caution shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-caution">Admin Override Active</p>
                <p className="text-xs text-caution/90 leading-relaxed mt-0.5">
                  Special renewal overrides the standard package price. Use only for approved
                  discounts, complimentary extensions, or manual corrections.
                </p>
              </div>
            </div>

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
                <div className="hidden sm:flex items-center gap-2 bg-red-500/10 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-red-500/20">
                  <ShieldAlert className="w-3.5 h-3.5" /> Override
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Standard Price</p>
                  <p className="font-heading font-bold text-lg">৳{clientInfo.standardPrice}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Current Expiry</p>
                  <p className="font-heading font-bold text-lg">{calculations.oldExpiryDate}</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <p className="text-[11px] text-muted-foreground font-semibold uppercase mb-1">Balance</p>
                  <p className="font-heading font-bold text-lg text-emerald-600">৳{clientInfo.balance.toFixed(2)}</p>
                </div>
              </div>
            </FormSection>

            {/* Override Configuration */}
            <FormSection title="Override Configuration">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="Special Amount (৳)" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      name="specialAmount"
                      type="number"
                      value={formData.specialAmount}
                      onChange={handleChange}
                      placeholder="e.g. 0 for free"
                      className={`${premiumInput} pl-8 border-caution/40 ring-4 ring-caution/10`}
                    />
                  </div>
                </EditableField>

                <EditableField label="Extend by (Days)" required>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      name="extendDays"
                      type="number"
                      value={formData.extendDays}
                      onChange={handleChange}
                      placeholder="30"
                      className={`${premiumInput} pl-9`}
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
                      placeholder="100"
                      className={`${premiumInput} pl-9`}
                    />
                  </div>
                </EditableField>

                <EditableField label="Approved By" required>
                  <select
                    name="approvedBy"
                    value={formData.approvedBy}
                    onChange={handleChange}
                    className={premiumInput}
                  >
                    <option>Network Service Provider (NSP)</option>
                    <option>Admin</option>
                    <option>Reseller Manager</option>
                    <option>Super Admin</option>
                  </select>
                </EditableField>

                <div className="sm:col-span-2">
                  <EditableField label="Reason for Override" required>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="e.g. Loyalty discount, Compensation for downtime, etc."
                        className={`${premiumInput} pl-9`}
                      />
                    </div>
                  </EditableField>
                </div>
              </div>
            </FormSection>

            {/* Expiry Date Transition */}
            <FormSection title="Expiry Adjustment">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-signal-tint/60 to-violet-accent-tint/60 border border-signal/10">
                <Calendar className="h-5 w-5 text-signal shrink-0" />
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-semibold">Current Expiry</p>
                    <span className="text-muted-foreground line-through">{calculations.oldExpiryDate}</span>
                  </div>
                  <span className="text-signal font-bold">→</span>
                  <div>
                    <p className="text-[10px] text-signal uppercase font-semibold">New Expiry</p>
                    <span className="font-bold text-signal">{calculations.newExpiryDate}</span>
                  </div>
                  <div className="ml-auto bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                    +{formData.extendDays} days
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Financial Summary */}
            <FormSection title="Financial Summary">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase">Standard Amount</p>
                  </div>
                  <p className="font-heading font-bold text-lg">৳{calculations.standardAmount.toFixed(2)}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">For {formData.extendDays} days</p>
                </div>
                <div className="bg-muted/30 rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-emerald-500" />
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase">You Save</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-emerald-600">৳{calculations.savings.toFixed(2)}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Discount applied</p>
                </div>
                <div className="bg-signal-tint/60 rounded-xl p-4 border border-signal/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-signal" />
                    <p className="text-[11px] text-signal font-semibold uppercase">Final Amount</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-signal">৳{calculations.finalAmount.toFixed(2)}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">To be charged</p>
                </div>
              </div>

              {/* Final Amount Display */}
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-r from-caution to-destructive text-white flex items-center justify-between shadow-lg">
                <div>
                  <p className="text-xs opacity-90 font-semibold uppercase tracking-wider">Total Payable</p>
                  <p className="text-[10px] opacity-75 mt-0.5">
                    {formData.applyVAT ? "Including 5% VAT" : "Excluding VAT"}
                  </p>
                </div>
                <span className="font-heading text-2xl font-bold">৳{calculations.finalAmount.toFixed(2)}</span>
              </div>
            </FormSection>

            {/* Payment & Options */}
            <FormSection title="Payment & Options">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="Payment Method">
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
                    <option value="FREE">Free / No Charge</option>
                  </select>
                </EditableField>
                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      value={calculations.finalAmount.toFixed(2)}
                      readOnly
                      className={`${premiumInput} pl-8 bg-muted/50`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-4">
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
                    <p className="text-xs text-muted-foreground">Add government VAT to the invoice</p>
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
                    <p className="text-xs text-muted-foreground">Notify client about special renewal</p>
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
                      <Gift className="w-3.5 h-3.5 text-violet-accent" /> Auto Renew After Expiry
                    </p>
                    <p className="text-xs text-muted-foreground">Automatically renew after this special period</p>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs text-muted-foreground font-semibold uppercase">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Additional notes about this special renewal..."
                    rows={3}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none resize-none"
                  />
                </div>
              </div>
            </FormSection>

            {/* Approval Status */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-emerald-700 font-semibold uppercase">Approval Status</p>
                <p className="text-sm font-bold text-emerald-700">
                  Approved by {formData.approvedBy}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
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
                className="rounded-2xl font-semibold h-12 px-8 bg-gradient-to-r from-caution to-destructive border-0 shadow-lg hover:shadow-xl transition-shadow order-1 sm:order-2"
              >
                <Sparkles className="w-4 h-4 mr-2" /> Apply Special Renewal
              </Button>
            </div>

          </FormShell>
        </div>
      </div>
    </div>
  );
}