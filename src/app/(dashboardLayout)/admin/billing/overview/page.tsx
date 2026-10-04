"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Wallet, CalendarClock, Receipt, Zap, ArrowUp, ArrowDown, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const summaryCards = [
  { label: "Current Balance", value: "$100K", note: "Better than last month", trend: "up", icon: Wallet, hero: true },
  { label: "Next Payment Due", value: "$20K", note: "Last month payment due", trend: "down", icon: CalendarClock },
  { label: "Total Paid This Month", value: "$20K", note: "Successfully paid", trend: "up", icon: Receipt },
  { label: "Active Plan", value: "100K", note: "Total Active plans", trend: "down", icon: Zap },
];

const payments = [
  { invoice: "872193", period: "June 23, 2024", method: "visa", amount: "$31,65", status: "Paid" },
  { invoice: "872194", period: "June 23, 2024", method: "mastercard", amount: "$31,65", status: "Unpaid" },
  { invoice: "872194", period: "June 23, 2024", method: "paypal", amount: "$31,65", status: "Over due" },
  { invoice: "872194", period: "June 23, 2024", method: "mastercard", amount: "$31,65", status: "Paid" },
  { invoice: "872193", period: "June 23, 2024", method: "visa", amount: "$31,65", status: "Unpaid" },
  { invoice: "872194", period: "June 23, 2024", method: "paypal", amount: "$31,65", status: "Over due" },
  { invoice: "872193", period: "June 23, 2024", method: "visa", amount: "$31,65", status: "Paid" },
  { invoice: "872194", period: "June 23, 2024", method: "mastercard", amount: "$31,65", status: "Unpaid" },
  { invoice: "872194", period: "June 23, 2024", method: "paypal", amount: "$31,65", status: "Over due" },
];

const statusStyles: Record<string, string> = {
  Paid: "bg-success-tint text-success",
  Unpaid: "bg-warning-tint text-warning",
  "Over due": "bg-destructive/10 text-destructive",
};

const methodBadge: Record<string, { label: string; className: string }> = {
  visa: { label: "VISA", className: "bg-blue-50 text-blue-700" },
  mastercard: { label: "●●", className: "bg-orange-50 text-orange-700" },
  paypal: { label: "PayPal", className: "bg-sky-50 text-sky-700" },
};

export default function BillingOverviewPage() {
  const [selectedMethod, setSelectedMethod] = useState("mastercard");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Billing
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div>
              {/* Summary cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
                {summaryCards.map((c) => (
                  <div
                    key={c.label}
                    className={cn(
                      "rounded-2xl p-5 relative overflow-hidden",
                      c.hero
                        ? "bg-gradient-to-br from-signal to-violet-accent text-white"
                        : "bg-card border"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center",
                          c.hero ? "bg-white/20" : "bg-signal-tint"
                        )}
                      >
                        <c.icon className={cn("h-4 w-4", c.hero ? "text-white" : "text-signal")} />
                      </div>
                    </div>
                    <div className={cn("text-sm font-semibold", c.hero ? "text-white/90" : "text-foreground")}>
                      {c.label}
                    </div>
                    <div
                      className={cn(
                        "flex items-center gap-1 text-xs mt-1",
                        c.hero ? "text-white/70" : c.trend === "up" ? "text-success" : "text-destructive"
                      )}
                    >
                      {c.trend === "up" ? (
                        <ArrowUp className="h-3 w-3" />
                      ) : (
                        <ArrowDown className="h-3 w-3" />
                      )}
                      {c.note}
                    </div>
                    <div className="font-heading text-3xl font-bold mt-3">{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Payment history */}
              <h2 className="font-heading text-xl font-bold mb-4">Payment History</h2>
              <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                  <thead>
                    <tr className="bg-signal text-signal-foreground">
                      {["Invoice No.", "Billing Period", "Payment Method", "Amount", "Status", "Download"].map((h) => (
                        <th key={h} className="text-left px-5 py-3.5 font-semibold text-[13px]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p, i) => (
                      <tr key={i} className="border-t hover:bg-muted/40">
                        <td className="px-5 py-3.5 font-mono">{p.invoice}</td>
                        <td className="px-5 py-3.5 text-muted-foreground">{p.period}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex px-3 py-1 rounded-md text-xs font-bold",
                              methodBadge[p.method].className
                            )}
                          >
                            {methodBadge[p.method].label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 font-mono">{p.amount}</td>
                        <td className="px-5 py-3.5">
                          <span
                            className={cn(
                              "inline-flex px-3 py-1 rounded-full text-xs font-bold",
                              statusStyles[p.status]
                            )}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center">
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-5">
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading font-bold text-lg mb-4">Upcoming Payments</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-3">
                    <dt className="text-muted-foreground">Next Billing Date:</dt>
                    <dd className="font-semibold">02/26/2025</dd>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <dt className="text-muted-foreground">Plan Renewal:</dt>
                    <dd className="font-semibold">02/26/2025</dd>
                  </div>
                  <div className="flex justify-between items-center border-b pb-3">
                    <dt className="text-muted-foreground">Auto-renews</dt>
                    <button className="w-9 h-5 rounded-full bg-signal relative">
                      <span className="absolute top-0.5 left-4.5 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Payment Method:</dt>
                    <dd className="font-semibold text-right">Credit Card ending in 1234</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading font-bold text-lg mb-1">Payment Methods</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage billing information and view receipts
                </p>

                <div className="space-y-2.5 mb-4">
                  {["mastercard", "visa", "paypal"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMethod(m)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-bold",
                        selectedMethod === m ? "border-signal bg-signal-tint" : "bg-muted/20"
                      )}
                    >
                      <span
                        className={cn(
                          "px-3 py-1 rounded-md text-xs",
                          methodBadge[m].className
                        )}
                      >
                        {methodBadge[m].label}
                      </span>
                      {selectedMethod === m && (
                        <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center text-white text-xs">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                <label className="flex items-center gap-2 text-sm font-semibold mb-4">
                  <input type="checkbox" defaultChecked className="accent-signal" />
                  Save for later
                </label>

                <button className="w-full rounded-full bg-signal text-signal-foreground font-semibold py-3 text-sm hover:opacity-90 transition-opacity">
                  Add New Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}