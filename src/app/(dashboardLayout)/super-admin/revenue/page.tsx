"use client";

import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { GlassCard } from "@/components/super-admin/widgets";
import { PageTitle } from "@/components/super-admin/table-shell";
import { RevenueChart } from "@/components/super-admin/revenue-chart";
import { Download, Wallet, TrendingUp, Percent, ArrowUpRight } from "lucide-react";

const summary = [
  { icon: Wallet, label: "Total revenue (YTD)", value: "৳7.4Cr" },
  { icon: TrendingUp, label: "Avg. monthly growth", value: "9.2%" },
  { icon: Percent, label: "Platform commission", value: "৳38.6L" },
];

const breakdown = [
  { label: "PPPoE Packages", value: 58, amount: "৳4.3Cr" },
  { label: "Hotspot Cards", value: 24, amount: "৳1.8Cr" },
  { label: "Static IP / Enterprise", value: 12, amount: "৳0.9Cr" },
  { label: "SMS & Add-ons", value: 6, amount: "৳0.4Cr" },
];

const ledger = [
  { reseller: "Sky Next Networks", amount: "৳6.8L", date: "Sep 20, 2026", status: "Paid" },
  { reseller: "Refayetpur Broadband", amount: "৳5.1L", date: "Sep 20, 2026", status: "Paid" },
  { reseller: "Delowar Network (DNET)", amount: "৳4.4L", date: "Sep 19, 2026", status: "Processing" },
  { reseller: "Rejaul Cable Network", amount: "৳3.9L", date: "Sep 19, 2026", status: "Paid" },
];

const barColors = ["var(--signal)", "var(--violet-accent)", "var(--success)", "var(--caution)"];

export default function RevenuePage() {
  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          <PageTitle eyebrow="Command Center" title="Revenue">
            <button className="rounded-full gap-1.5 font-semibold h-11 px-5 bg-white/5 border border-white/10 flex items-center hover:bg-white/10 transition-colors">
              <Download className="h-4 w-4 mr-1.5" /> Export report
            </button>
          </PageTitle>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {summary.map((s) => (
              <GlassCard key={s.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-signal/15 text-signal flex items-center justify-center shrink-0">
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{s.label}</p>
                  <p className="font-heading text-2xl font-bold">{s.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <GlassCard className="xl:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-lg font-bold">Revenue Trend</h2>
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-success/15 text-success">
                  <ArrowUpRight className="h-3 w-3" /> 12.4% YoY
                </span>
              </div>
              <RevenueChart />
            </GlassCard>

            <GlassCard>
              <h2 className="font-heading text-lg font-bold mb-5">Revenue by Category</h2>
              <div className="space-y-5">
                {breakdown.map((b, i) => (
                  <div key={b.label}>
                    <div className="flex items-center justify-between mb-1.5 text-sm">
                      <span className="text-white/70">{b.label}</span>
                      <span className="font-bold">{b.amount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${b.value}%`, backgroundColor: barColors[i] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          <GlassCard>
            <h2 className="font-heading text-lg font-bold mb-4">Recent Payouts</h2>
            <div className="divide-y divide-white/5">
              {ledger.map((l) => (
                <div key={l.reseller} className="flex items-center justify-between py-3.5">
                  <div>
                    <p className="text-sm font-semibold">{l.reseller}</p>
                    <p className="text-xs text-white/40">{l.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm">{l.amount}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        l.status === "Paid" ? "bg-success/15 text-success" : "bg-caution/15 text-caution"
                      }`}
                    >
                      {l.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}