"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, EditableField, premiumInput } from "@/components/clients-v2/premium-form";
import { cn } from "@/lib/utils";
import {
  Globe2, Search, Wifi, Wallet, ArrowRight, User, CheckCircle2,
  AlertCircle, Calendar, Zap, Percent, Gift, ShieldCheck, RefreshCw, Server
} from "lucide-react";

// সার্ভার গ্রুপ ডেটা
const serverGroups = [
  { key: "server2", label: "SERVER-2", protocol: "PPPoE", status: "online", users: 1240 },
  { key: "server3", label: "SERVER-3", protocol: "Hotspot", status: "online", users: 850 },
  { key: "server4", label: "SERVER-4", protocol: "Static", status: "maintenance", users: 420 },
];

// ডামি ক্লায়েন্ট ডেটা
const mockClientData = {
  name: "Liton",
  id: "2550",
  username: "mb@liton.crs",
  mobile: "+8801712345678",
  package: "10Mbps_Package",
  balance: 0,
  expiryDate: "01/05/2025",
  status: "Active",
};

export default function OnlineRenewPage() {
  const [activeServer, setActiveServer] = useState(serverGroups[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [found, setFound] = useState(false);
  const [formData, setFormData] = useState({
    months: 1,
    paymentMethod: "CASH",
    amountReceived: 490,
    discount: 0,
    applyVAT: false,
    sendSMS: true,
    autoRenew: false,
    remarks: "",
  });

  const selectedServer = serverGroups.find((s) => s.key === activeServer);

  const calculations = useMemo(() => {
    const basePrice = 490;
    const subTotal = basePrice * formData.months;
    const discountAmount = (subTotal * formData.discount) / 100;
    const afterDiscount = subTotal - discountAmount;
    const vatAmount = formData.applyVAT ? afterDiscount * 0.05 : 0;
    const grandTotal = afterDiscount + vatAmount;
    const dueAmount = grandTotal - formData.amountReceived;

    const currentExpiry = new Date(mockClientData.expiryDate.split("/").reverse().join("-"));
    const newExpiry = new Date(currentExpiry);
    newExpiry.setMonth(newExpiry.getMonth() + formData.months);

    return {
      subTotal,
      discountAmount,
      vatAmount,
      grandTotal,
      dueAmount,
      newExpiryDate: newExpiry.toLocaleDateString("en-GB"),
    };
  }, [formData.months, formData.discount, formData.amountReceived, formData.applyVAT]);

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

  const handleSearch = () => {
    if (searchTerm.trim().length > 0) {
      setFound(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Online Renewal Submitted:", { ...formData, calculations, server: activeServer });
    alert(`Renewal Confirmed! Server: ${selectedServer?.label}, Total: ৳${calculations.grandTotal}`);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-3xl mx-auto">
          <FormShell icon={Globe2} eyebrow="Clients · Online Renew" title="Renew from Online Server">

            {/* Server Group Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              {serverGroups.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => {
                    setActiveServer(g.key);
                    setFound(false);
                  }}
                  className={cn(
                    "rounded-2xl border-2 p-4 text-left transition-all duration-300 relative overflow-hidden",
                    activeServer === g.key
                      ? "border-signal bg-signal-tint shadow-md shadow-signal/10"
                      : "border-slate-200 bg-white hover:border-signal/30"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className={cn("font-heading font-bold text-sm", activeServer === g.key ? "text-signal" : "text-slate-600")}>
                      {g.label}
                    </p>
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        g.status === "online" ? "bg-success animate-pulse" : "bg-warning"
                      )}
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <Wifi className="h-3 w-3" /> {g.protocol}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                    <User className="h-3 w-3" /> {g.users} users
                  </p>
                </button>
              ))}
            </div>

            {/* Server Status Bar */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 mb-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-signal-tint flex items-center justify-center shrink-0">
                <Server className="w-5 h-5 text-signal" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-signal">{selectedServer?.label}</p>
                <p className="text-xs text-slate-500">
                  Status:{" "}
                  <span className={selectedServer?.status === "online" ? "text-success font-semibold" : "text-warning font-semibold"}>
                    {selectedServer?.status === "online" ? "Online" : "Under Maintenance"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2 bg-success-tint text-success px-3 py-1.5 rounded-full text-xs font-semibold border border-success/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Secure
              </div>
            </div>

            {/* Search Card */}
            <div className="rounded-[28px] bg-white border border-slate-200 shadow-sm p-6 sm:p-7 mb-5">
              <EditableField label="Search customer" required>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Username, ID, or mobile number"
                    className={`${premiumInput} pl-11`}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
              </EditableField>
              <Button
                type="button"
                onClick={handleSearch}
                className="w-full mt-4 rounded-2xl font-semibold h-11 bg-signal hover:bg-signal-hover text-white border-0 shadow-md"
              >
                <Search className="w-4 h-4 mr-2" /> Search Client
              </Button>
            </div>

            {/* Result Card */}
            {found && (
              <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                
                {/* Client Info */}
                <div className="rounded-[28px] bg-white border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-200">
                    <div className="w-14 h-14 rounded-2xl bg-signal text-white flex items-center justify-center font-heading font-bold text-xl shrink-0 shadow-md">
                      {mockClientData.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-heading font-bold text-lg text-signal">{mockClientData.name}</p>
                      <p className="text-xs text-slate-500">
                        ID: {mockClientData.id} · @{mockClientData.username}
                      </p>
                    </div>
                    <span className="bg-success-tint text-success text-xs font-bold px-3 py-1 rounded-full border border-success/30">
                      {mockClientData.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase mb-1">Package</p>
                      <p className="font-semibold text-signal">{mockClientData.package}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase mb-1">Balance</p>
                      <p className={`font-semibold ${mockClientData.balance === 0 ? "text-success" : "text-destructive"}`}>
                        ৳{mockClientData.balance.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold uppercase mb-1">Current Expiry</p>
                      <p className="font-semibold text-signal">{mockClientData.expiryDate}</p>
                    </div>
                  </div>

                  {/* Expiry Transition */}
                  <div className="mt-5 flex items-center gap-4 p-4 rounded-2xl bg-signal-tint border border-signal/30">
                    <Calendar className="h-5 w-5 text-signal shrink-0" />
                    <div className="flex items-center gap-3 text-sm">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-semibold">Old</p>
                        <span className="text-slate-500 line-through">{mockClientData.expiryDate}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-signal" />
                      <div>
                        <p className="text-[10px] text-signal uppercase font-semibold">New</p>
                        <span className="font-bold text-signal">{calculations.newExpiryDate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Renewal Configuration */}
                <form onSubmit={handleSubmit} className="rounded-[28px] bg-white border border-slate-200 shadow-sm p-6">
                  <h3 className="font-heading font-bold text-lg mb-5 text-signal">Renewal Configuration</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <EditableField label="Duration">
                      <select
                        name="months"
                        value={formData.months}
                        onChange={handleChange}
                        className={premiumInput}
                      >
                        {[1, 2, 3, 6, 12].map((m) => (
                          <option key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</option>
                        ))}
                      </select>
                    </EditableField>

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
                      </select>
                    </EditableField>

                    <EditableField label="Amount Received">
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
                    </EditableField>

                    <EditableField label="Discount (%)">
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                          name="discount"
                          type="number"
                          value={formData.discount}
                          onChange={handleChange}
                          className="pl-9 text-signal"
                          placeholder="0"
                        />
                      </div>
                    </EditableField>
                  </div>

                  {/* Add-ons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
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
                          <Gift className="w-3.5 h-3.5 text-violet-accent" /> Auto Renew
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Grand Total */}
                  <div className="mt-6 p-5 rounded-2xl bg-signal text-white flex items-center justify-between shadow-lg">
                    <div>
                      <p className="text-xs opacity-90 font-semibold uppercase tracking-wider">Total Payable</p>
                      <p className="text-[10px] opacity-75 mt-0.5">
                        {formData.months} month{formData.months > 1 ? "s" : ""} {formData.applyVAT && "· incl. VAT"}
                      </p>
                    </div>
                    <span className="font-heading text-2xl font-bold">৳{calculations.grandTotal.toFixed(2)}</span>
                  </div>

                  {/* Due Alert */}
                  <div className={`mt-5 p-4 rounded-xl flex items-center gap-3 ${calculations.dueAmount > 0 ? "bg-warning-tint border border-warning/30" : "bg-success-tint border border-success/30"}`}>
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
                          <p className="text-sm font-bold text-success">Change: ৳{Math.abs(calculations.dueAmount).toFixed(2)}</p>
                        </div>
                      </>
                    )}
                  </div>

                  {/* SMS & Remarks */}
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="sendSMS"
                        checked={formData.sendSMS}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-slate-300 text-signal focus:ring-signal cursor-pointer accent-signal"
                      />
                      <div>
                        <p className="text-sm font-semibold flex items-center gap-1.5 text-signal">
                          <Zap className="w-3.5 h-3.5 text-violet-accent" /> Send SMS Notification
                        </p>
                        <p className="text-xs text-slate-500">Notify client about successful renewal</p>
                      </div>
                    </label>

                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-500 font-semibold uppercase">Remarks</label>
                      <textarea
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Optional note..."
                        rows={2}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full mt-6 rounded-2xl gap-1.5 font-semibold h-12 bg-signal hover:bg-signal-hover text-white border-0 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Confirm Renewal
                  </Button>
                </form>
              </div>
            )}

            {/* Empty State */}
            {!found && (
              <div className="rounded-[28px] bg-white border border-dashed border-slate-300 shadow-sm p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center mb-4">
                  <RefreshCw className="w-7 h-7 text-signal" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1 text-signal">Ready to Renew</h3>
                <p className="text-sm text-slate-500 max-w-xs">
                  Search for a client by username, ID, or mobile number to begin the online renewal process.
                </p>
              </div>
            )}

          </FormShell>
        </div>
      </div>
    </div>
  );
}