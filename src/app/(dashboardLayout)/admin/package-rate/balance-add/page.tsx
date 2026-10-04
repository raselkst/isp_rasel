"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Wallet, User, CheckCircle2, Percent,
  Smartphone, Building2, Gift, Info, TrendingUp, History, Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

// ডামি ক্লায়েন্ট ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const mockClients = [
  { id: "1", cid: "C-101", name: "Liton Ahmed", mobile: "01716102651", balance: 0, package: "10Mbps-Pkg" },
  { id: "2", cid: "C-102", name: "Mogul Ali", mobile: "01716102652", balance: 120, package: "5Mbps-Pkg" },
  { id: "3", cid: "C-103", name: "Karim Hossain", mobile: "01716102653", balance: 350, package: "15Mbps-Pkg" },
];

const paymentMethods = [
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "bkash", label: "bKash", icon: Smartphone },
  { id: "nagad", label: "Nagad", icon: Smartphone },
  { id: "bank", label: "Bank", icon: Building2 },
];

const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

export default function BalanceAddPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(mockClients[0]);
  const [showClientList, setShowClientList] = useState(false);

  const [formData, setFormData] = useState({
    amount: 500,
    discount: 0,
    paymentMethod: "cash",
    bonusAmount: 0,
    remarks: "",
    sendSMS: true,
  });

  // ক্লায়েন্ট সার্চ ফিল্টার
  const filteredClients = useMemo(() => {
    if (!searchTerm) return mockClients;
    return mockClients.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm) ||
        c.cid.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Real-time ক্যালকুলেশন
  const calculations = useMemo(() => {
    const discountAmount = (formData.amount * formData.discount) / 100;
    const finalAmount = formData.amount - discountAmount;
    const totalCredit = finalAmount + formData.bonusAmount;
    const newBalance = (selectedClient?.balance || 0) + totalCredit;
    return { discountAmount, finalAmount, totalCredit, newBalance };
  }, [formData.amount, formData.discount, formData.bonusAmount, selectedClient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || 0 : value,
      }));
    }
  };

  const handleQuickAmount = (amount: number) => {
    setFormData((prev) => ({ ...prev, amount }));
  };

  const handleSelectClient = (client: any) => {
    setSelectedClient(client);
    setSearchTerm("");
    setShowClientList(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) {
      alert("Please select a client first.");
      return;
    }
    if (formData.amount < 1) {
      alert("Please enter a valid amount.");
      return;
    }
    alert(
      `Balance Added!\n\nClient: ${selectedClient.name} (${selectedClient.cid})\nAmount: ৳${formData.amount}\nDiscount: ৳${calculations.discountAmount.toFixed(2)}\nBonus: ৳${formData.bonusAmount}\nMethod: ${formData.paymentMethod.toUpperCase()}\n\nNew Balance: ৳${calculations.newBalance.toFixed(2)}`
    );
    // এখানে API কল বসবে
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Balance Add
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add balance to a client account quickly and securely.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* LEFT: Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Client Selection */}
              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-2 border-b pb-3 mb-5">
                  <User className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold">Client Selection</h2>
                </div>

                {selectedClient && (
                  <div className="flex items-center gap-4 mb-4 p-4 rounded-xl bg-signal-tint/50 border border-signal/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-signal to-violet-accent text-white flex items-center justify-center font-heading font-bold text-lg shrink-0">
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold">{selectedClient.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {selectedClient.cid} · {selectedClient.mobile} · {selectedClient.package}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Current Balance</p>
                      <p className="font-heading font-bold text-lg">৳{selectedClient.balance.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2 relative">
                  <label className="text-sm font-semibold block">Search Client</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => { setSearchTerm(e.target.value); setShowClientList(true); }}
                      onFocus={() => setShowClientList(true)}
                      placeholder="Search by Name, Mobile, or CID..."
                      className="pl-9 rounded-xl h-11"
                    />
                  </div>

                  {showClientList && filteredClients.length > 0 && searchTerm && (
                    <div className="absolute left-0 right-0 top-full mt-2 bg-card border rounded-xl shadow-xl z-20 overflow-hidden max-h-64 overflow-y-auto">
                      {filteredClients.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleSelectClient(c)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted text-left border-b last:border-b-0 transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-signal/10 text-signal flex items-center justify-center font-bold text-sm shrink-0">
                            {c.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{c.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{c.cid} · {c.mobile}</p>
                          </div>
                          <p className="font-semibold text-xs text-signal">৳{c.balance}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Amount & Payment */}
              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <div className="flex items-center gap-2 border-b pb-3 mb-5">
                  <Calculator className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold">Amount & Payment</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Amount <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                      <Input
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        className="pl-8 rounded-xl h-11 text-lg font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Discount (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="discount"
                        type="number"
                        value={formData.discount}
                        onChange={handleChange}
                        className="pl-9 rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Bonus Amount (৳)</label>
                    <div className="relative">
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="bonusAmount"
                        type="number"
                        value={formData.bonusAmount}
                        onChange={handleChange}
                        className="pl-9 rounded-xl h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Payment Method</label>
                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm h-11 focus:ring-2 focus:ring-signal outline-none"
                    >
                      {paymentMethods.map((m) => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Amount Presets */}
                <div className="mt-5 pt-5 border-t">
                  <label className="text-xs font-semibold uppercase text-muted-foreground block mb-3">
                    Quick Amounts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => handleQuickAmount(amt)}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                          formData.amount === amt
                            ? "bg-signal text-white border-signal shadow-sm"
                            : "bg-background text-muted-foreground border-border hover:border-signal/50"
                        )}
                      >
                        ৳{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label className="text-sm font-semibold block mb-2">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional note about this balance addition..."
                    rows={3}
                    className="w-full bg-muted/40 border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    name="sendSMS"
                    checked={formData.sendSMS}
                    onChange={handleChange}
                    className="w-4 h-4 rounded accent-signal"
                  />
                  <div>
                    <p className="text-sm font-semibold">Send SMS Notification</p>
                    <p className="text-xs text-muted-foreground">Notify client about balance addition</p>
                  </div>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  className="rounded-xl font-semibold h-12 px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-xl font-semibold h-12 px-8 bg-gradient-to-r from-signal to-violet-accent border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" /> Add Balance
                </Button>
              </div>
            </form>

            {/* RIGHT: Order Summary */}
            <div className="space-y-5 lg:sticky lg:top-24 h-fit">
              <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-5">
                  <Wallet className="w-5 h-5" />
                  <h3 className="font-heading font-bold">Balance Preview</h3>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Current Balance</span>
                    <span className="font-semibold">৳{(selectedClient?.balance || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Amount Added</span>
                    <span className="font-semibold">+৳{formData.amount.toFixed(2)}</span>
                  </div>
                  {formData.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90">Discount ({formData.discount}%)</span>
                      <span className="font-semibold text-red-200">-৳{calculations.discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {formData.bonusAmount > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90 flex items-center gap-1">
                        <Gift className="w-3 h-3" /> Bonus
                      </span>
                      <span className="font-semibold">+৳{formData.bonusAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/20 my-3" />
                  <div className="flex justify-between">
                    <span className="opacity-90">Total Credit</span>
                    <span className="font-semibold">৳{calculations.totalCredit.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 my-4" />

                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold uppercase tracking-wider opacity-90">New Balance</span>
                  <span className="font-heading text-2xl font-bold">৳{calculations.newBalance.toFixed(2)}</span>
                </div>
              </div>

              {/* Info Card */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20">
                <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <p className="text-xs text-signal leading-relaxed">
                  Balance will be added immediately. SMS notification will be sent to the client if
                  enabled. You can add multiple balances in a single session.
                </p>
              </div>

              {/* Recent History (Mock) */}
              <div className="bg-card rounded-2xl border shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-signal" />
                  <h4 className="font-heading font-bold text-sm">Recent Additions</h4>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { cid: "C-102", amount: 200, time: "5 min ago" },
                    { cid: "C-103", amount: 500, time: "1 hour ago" },
                    { cid: "C-101", amount: 1000, time: "3 hours ago" },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <span className="font-semibold text-foreground">{h.cid}</span>
                      <span className="font-bold text-emerald-600">+৳{h.amount}</span>
                      <span className="text-muted-foreground">{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Savings Card */}
              {calculations.discountAmount > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-700">
                      Client saves ৳{calculations.discountAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-emerald-600">
                      With {formData.discount}% discount
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