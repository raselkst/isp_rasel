"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/accounts/shared";
import {
  ArrowRight, Wallet, Building2, TrendingUp, TrendingDown,
  CheckCircle2, AlertCircle, Info, FileText, Save, RefreshCw,
  Calculator, Hash, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

// অ্যাকাউন্ট ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const accounts = [
  { id: "cash", label: "Cash", code: "1001", type: "Asset", balance: 40100 },
  { id: "brac", label: "BRAC Bank", code: "1002", type: "Asset", balance: 125400.5 },
  { id: "dbbl", label: "Dutch Bangla Bank", code: "1003", type: "Asset", balance: 285600.75 },
  { id: "ibbl", label: "Islami Bank", code: "1004", type: "Asset", balance: 42350.0 },
  { id: "service_income", label: "Service Income", code: "2001", type: "Income", balance: 0 },
  { id: "recharge_income", label: "Recharge Income", code: "2002", type: "Income", balance: 0 },
  { id: "salary_expense", label: "Salary Expense", code: "3001", type: "Expense", balance: 0 },
  { id: "rent_expense", label: "Rent Expense", code: "3002", type: "Expense", balance: 0 },
  { id: "isp_bill", label: "ISP Bill", code: "3003", type: "Expense", balance: 0 },
];

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-signal to-violet-accent text-white px-6 py-4 flex items-center gap-2">
        <Icon className="w-5 h-5" />
        <h2 className="font-heading font-bold text-lg">{title}</h2>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

export default function VoucherEntryPage() {
  const [formData, setFormData] = useState({
    voucherNo: `VCH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
    fromAccount: "",
    toAccount: "",
    amount: "",
    date: new Date().toISOString().slice(0, 16),
    description: "",
  });

  // ভ্যালিডেশন
  const validation = useMemo(() => {
    const amount = Number(formData.amount) || 0;
    return {
      isSameAccount: formData.fromAccount !== "" && formData.fromAccount === formData.toAccount,
      isValidAmount: amount > 0,
      isComplete: formData.fromAccount && formData.toAccount && amount > 0,
      amount,
    };
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fromAccount) return alert("Please select a From/Credit account!");
    if (!formData.toAccount) return alert("Please select a To/Debit account!");
    if (formData.fromAccount === formData.toAccount) return alert("From and To accounts cannot be the same!");
    if (!formData.amount || Number(formData.amount) <= 0) return alert("Valid amount is required!");

    const fromLabel = accounts.find((a) => a.id === formData.fromAccount)?.label;
    const toLabel = accounts.find((a) => a.id === formData.toAccount)?.label;

    alert(
      `Voucher Entry Created!\n\n` +
        `Voucher No: ${formData.voucherNo}\n` +
        `Date: ${formData.date}\n` +
        `Credit (From): ${fromLabel}\n` +
        `Debit (To): ${toLabel}\n` +
        `Amount: ৳${Number(formData.amount).toFixed(2)}\n` +
        `Description: ${formData.description || "—"}`
    );
  };

  const handleReset = () => {
    setFormData({
      voucherNo: `VCH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      fromAccount: "",
      toAccount: "",
      amount: "",
      date: new Date().toISOString().slice(0, 16),
      description: "",
    });
  };

  const getAccountLabel = (id: string) =>
    accounts.find((a) => a.id === id)?.label || "—";

  const getAccountType = (id: string) =>
    accounts.find((a) => a.id === id)?.type || "";

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Voucher Entry
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Record a double-entry accounting voucher for credit and debit transactions.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-signal/10 text-signal px-4 py-2 rounded-full text-xs font-semibold border border-signal/20">
              <Hash className="w-3.5 h-3.5" /> {formData.voucherNo}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* Form */}
            <div>
              <Section title="Accounting Information" icon={FileText}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* From / Credit */}
                  <Field label="From / Credit (Source)" required>
                    <select
                      name="fromAccount"
                      value={formData.fromAccount}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                    >
                      <option value="">Choose Credit account</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.code} — {a.label} ({a.type})
                        </option>
                      ))}
                    </select>
                    {formData.fromAccount && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current balance:{" "}
                        <span className="font-semibold text-emerald-600">
                          ৳{accounts.find((a) => a.id === formData.fromAccount)?.balance.toLocaleString()}
                        </span>
                      </p>
                    )}
                  </Field>

                  {/* To / Debit */}
                  <Field label="To / Debit (Destination)" required>
                    <select
                      name="toAccount"
                      value={formData.toAccount}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                    >
                      <option value="">Choose Debit account</option>
                      {accounts.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.code} — {a.label} ({a.type})
                        </option>
                      ))}
                    </select>
                    {formData.toAccount && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Current balance:{" "}
                        <span className="font-semibold text-blue-600">
                          ৳{accounts.find((a) => a.id === formData.toAccount)?.balance.toLocaleString()}
                        </span>
                      </p>
                    )}
                  </Field>
                </div>

                {/* Visual Arrow */}
                {formData.fromAccount && formData.toAccount && (
                  <div className="flex items-center justify-center gap-4 mt-6 p-4 rounded-2xl bg-signal-tint/40 border border-signal/20 animate-in fade-in duration-300">
                    <span className="inline-flex items-center gap-1.5 bg-red-500/10 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-red-500/20">
                      <TrendingDown className="w-3 h-3" /> {getAccountLabel(formData.fromAccount)}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-signal to-violet-accent text-white flex items-center justify-center shadow-md">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-500/20">
                      <TrendingUp className="w-3 h-3" /> {getAccountLabel(formData.toAccount)}
                    </span>
                  </div>
                )}
              </Section>

              <Section title="Transaction Information" icon={Calculator}>
                <div className="space-y-6">
                  <Field label="Amount" required>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                      <Input
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="rounded-xl pl-8 h-12 text-lg font-semibold"
                      />
                    </div>
                  </Field>

                  {/* Quick Amounts */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground font-semibold self-center mr-1">
                      Quick:
                    </span>
                    {[1000, 5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, amount: String(amt) }))}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                          formData.amount === String(amt)
                            ? "bg-signal text-white border-signal shadow-md"
                            : "bg-background text-muted-foreground border-border hover:border-signal/50"
                        )}
                      >
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <Field label="Transactions Date" required>
                    <div className="relative">
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        name="date"
                        type="datetime-local"
                        value={formData.date}
                        onChange={handleChange}
                        className="rounded-xl pr-10"
                      />
                    </div>
                  </Field>

                  <Field label="Description">
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the purpose of this voucher entry..."
                      className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none resize-none"
                      rows={4}
                    />
                  </Field>
                </div>
              </Section>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-full font-semibold h-11 px-6 order-2 sm:order-1"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="rounded-full font-semibold h-11 px-8 bg-gradient-to-r from-signal to-violet-accent border-0 order-1 sm:order-2"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Submit Voucher
                </Button>
              </div>
            </div>

            {/* Live Preview */}
            <div className="space-y-5 lg:sticky lg:top-24 h-fit">
              <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="w-5 h-5" />
                  <h3 className="font-heading font-bold">Voucher Preview</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Voucher No</span>
                    <span className="font-semibold font-mono text-xs">{formData.voucherNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Date</span>
                    <span className="font-semibold text-xs">{formData.date}</span>
                  </div>

                  <div className="border-t border-white/20 my-3" />

                  <div>
                    <p className="text-xs uppercase opacity-75 mb-1">Credit (From)</p>
                    <p className="font-semibold">
                      {getAccountLabel(formData.fromAccount)}
                      {formData.fromAccount && (
                        <span className="text-xs opacity-75 ml-1">
                          ({getAccountType(formData.fromAccount)})
                        </span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase opacity-75 mb-1">Debit (To)</p>
                    <p className="font-semibold">
                      {getAccountLabel(formData.toAccount)}
                      {formData.toAccount && (
                        <span className="text-xs opacity-75 ml-1">
                          ({getAccountType(formData.toAccount)})
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="border-t border-white/20 my-3" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                      Amount
                    </span>
                    <span className="font-heading text-2xl font-bold">
                      ৳{Number(formData.amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Validation Alert */}
              {formData.fromAccount && formData.toAccount && validation.isSameAccount && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 font-semibold">
                    From and To accounts cannot be the same!
                  </p>
                </div>
              )}

              {validation.isComplete && !validation.isSameAccount && (
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-emerald-700">
                    <p className="font-bold">Voucher is valid ✓</p>
                    <p className="mt-0.5">Ready to submit.</p>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20">
                <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <div className="text-xs text-signal leading-relaxed">
                  <p className="font-bold mb-1">Double-Entry Rules:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Credit (From) account is the source</li>
                    <li>Debit (To) account is the destination</li>
                    <li>From ≠ To accounts</li>
                    <li>Amount must be greater than 0</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}