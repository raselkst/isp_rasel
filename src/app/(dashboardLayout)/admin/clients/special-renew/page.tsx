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
    discount: 100,
    approvedBy: "Network Service Provider (NSP)",
    reason: "",
    paymentMethod: "CASH",
    applyVAT: false,
    sendSMS: true,
    autoRenew: false,
    remarks: "",
  });

  const calculations = useMemo(() => {
    const standardAmount = (clientInfo.standardPrice / 30) * formData.extendDays;
    const discountAmount = (standardAmount * formData.discount) / 100;
    const afterDiscount = standardAmount - discountAmount;
    const vatAmount = formData.applyVAT ? afterDiscount * 0.05 : 0;
    const finalAmount = formData.specialAmount + vatAmount;
    const savings = standardAmount - finalAmount;

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
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-3xl mx-auto">
          <FormShell icon={Sparkles} eyebrow="Clients · Special Renew" title="Special Renewal">

            {/* Warning Banner — Theme Connected */}
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-caution-tint border border-caution/30 mb-6">
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
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                <div className="w-14 h-14 rounded-2xl bg-signal text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-lg">
                  {clientInfo.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-heading font-bold text-lg text-signal">{clientInfo.name}</p>
                  <p className="text-xs text-slate-500">
                    ID: {clientInfo.id} · {clientInfo.username} · {clientInfo.package}
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-destructive/10 text-destructive px-3 py-1.5 rounded-full text-xs font-semibold border border-destructive/30">
                  <ShieldAlert className="w-3.5 h-3.5" /> Override
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase mb-1">Standard Price</p>
                  <p className="font-heading font-bold text-lg text-signal">৳{clientInfo.standardPrice}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase mb-1">Current Expiry</p>
                  <p className="font-heading font-bold text-lg text-signal">{calculations.oldExpiryDate}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase mb-1">Balance</p>
                  <p className="font-heading font-bold text-lg text-success">৳{clientInfo.balance.toFixed(2)}</p>
                </div>
              </div>
            </FormSection>

            {/* Override Configuration */}
            <FormSection title="Override Configuration">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="Special Amount (৳)" required>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">৳</span>
                    <Input
                      name="specialAmount"
                      type="number"
                      value={formData.specialAmount}
                      onChange={handleChange}
                      placeholder="e.g. 0 for free"
                      className={`${premiumInput} pl-8 border-caution/40 ring-4 ring-caution/10 text-signal`}
                    />
                  </div>
                </EditableField>

                <EditableField label="Extend by (Days)" required>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      name="extendDays"
                      type="number"
                      value={formData.extendDays}
                      onChange={handleChange}
                      placeholder="30"
                      className={`${premiumInput} pl-9 text-signal`}
                    />
                  </div>
                </EditableField>

                <EditableField label="Discount (%)">
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      name="discount"
                      type="number"
                      value={formData.discount}
                      onChange={handleChange}
                      placeholder="100"
                      className={`${premiumInput} pl-9 text-signal`}
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
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        name="reason"
                        value={formData.reason}
                        onChange={handleChange}
                        placeholder="e.g. Loyalty discount, Compensation for downtime, etc."
                        className={`${premiumInput} pl-9 text-signal`}
                      />
                    </div>
                  </EditableField>
                </div>
              </div>
            </FormSection>

            {/* Expiry Date Transition */}
            <FormSection title="Expiry Adjustment">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-signal-tint border border-signal/30">
                <Calendar className="h-5 w-5 text-signal shrink-0" />
                <div className="flex items-center gap-3 text-sm">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-semibold">Current Expiry</p>
                    <span className="text-slate-500 line-through">{calculations.oldExpiryDate}</span>
                  </div>
                  <span className="text-signal font-bold">→</span>
                  <div>
                    <p className="text-[10px] text-signal uppercase font-semibold">New Expiry</p>
                    <span className="font-bold text-signal">{calculations.newExpiryDate}</span>
                  </div>
                  <div className="ml-auto bg-success-tint text-success px-3 py-1 rounded-full text-xs font-semibold border border-success/30">
                    +{formData.extendDays} days
                  </div>
                </div>
              </div>
            </FormSection>

            {/* Financial Summary */}
            <FormSection title="Financial Summary">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-slate-500" />
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">Standard Amount</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-signal">৳{calculations.standardAmount.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">For {formData.extendDays} days</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-success" />
                    <p className="text-[11px] text-slate-500 font-semibold uppercase">You Save</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-success">৳{calculations.savings.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">Discount applied</p>
                </div>
                <div className="bg-signal-tint rounded-xl p-4 border border-signal/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-signal" />
                    <p className="text-[11px] text-signal font-semibold uppercase">Final Amount</p>
                  </div>
                  <p className="font-heading font-bold text-lg text-signal">৳{calculations.finalAmount.toFixed(2)}</p>
                  <p className="text-[11px] text-slate-500 mt-1">To be charged</p>
                </div>
              </div>

              {/* Final Amount Display */}
              <div className="mt-5 p-5 rounded-2xl bg-caution text-white flex items-center justify-between shadow-lg">
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
                  <label className="text-xs text-slate-500 font-semibold uppercase">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">৳</span>
                    <Input
                      value={calculations.finalAmount.toFixed(2)}
                      readOnly
                      className={`${premiumInput} pl-8 bg-slate-50 text-signal`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
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

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="sendSMS"
                    checked={formData.sendSMS}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-signal focus:ring-signal cursor-pointer accent-signal"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5 text-signal">
                      <Zap className="w-3.5 h-3.5 text-violet-accent" /> Send SMS Notification
                    </p>
                    <p className="text-xs text-slate-500">Notify client about special renewal</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    checked={formData.autoRenew}
                    onChange={handleChange}
                    className="w-4 h-4 rounded border-slate-300 text-signal focus:ring-signal cursor-pointer accent-signal"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold flex items-center gap-1.5 text-signal">
                      <Gift className="w-3.5 h-3.5 text-violet-accent" /> Auto Renew After Expiry
                    </p>
                    <p className="text-xs text-slate-500">Automatically renew after this special period</p>
                  </div>
                </label>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500 font-semibold uppercase">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Additional notes about this special renewal..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                  />
                </div>
              </div>
            </FormSection>

            {/* Approval Status */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success-tint border border-success/30">
              <UserCheck className="w-5 h-5 text-success shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-success font-semibold uppercase">Approval Status</p>
                <p className="text-sm font-bold text-success">
                  Approved by {formData.approvedBy}
                </p>
              </div>
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                className="rounded-2xl font-semibold h-12 px-8 order-2 sm:order-1 border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-2xl font-semibold h-12 px-8 bg-caution hover:bg-caution/90 text-white border-0 shadow-lg hover:shadow-xl transition-all order-1 sm:order-2"
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