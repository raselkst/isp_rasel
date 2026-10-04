"use client";

import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import {
  GlassCard,
  MetricCard,
  RadialGauge,
  NetworkMap,
  Leaderboard,
  ActivityFeed,
} from "@/components/super-admin/widgets";
import { Building2, TriangleAlert, ArrowRight, Plus, ShieldCheck, Zap } from "lucide-react";

const metrics = [
  { label: "Total Resellers", value: "1,248", delta: 6.4, points: [30, 34, 32, 40, 44, 42, 50, 55], accent: "var(--signal)" },
  { label: "Network Revenue (MTD)", value: "৳84.2L", delta: 11.2, points: [20, 25, 22, 30, 28, 35, 38, 44], accent: "var(--violet-accent)" },
  { label: "Active Subscribers", value: "612,904", delta: 3.1, points: [40, 38, 42, 41, 45, 47, 46, 50], accent: "var(--success)" },
  { label: "Open Tickets", value: "37", delta: -18.5, points: [60, 55, 58, 50, 45, 40, 38, 33], accent: "var(--caution)" },
];

const leaderboardRows = [
  { name: "Sky Next Networks", region: "Dhaka Division", revenue: "৳6.8L", growth: 18 },
  { name: "Refayetpur Broadband", region: "Khulna Division", revenue: "৳5.1L", growth: 12 },
  { name: "Delowar Network (DNET)", region: "Chattogram Division", revenue: "৳4.4L", growth: 9 },
  { name: "Rejaul Cable Network", region: "Rajshahi Division", revenue: "৳3.9L", growth: 7 },
  { name: "Afi Cable Network", region: "Sylhet Division", revenue: "৳3.2L", growth: 4 },
];

const activity = [
  { time: "2 min ago", text: "Sky Next Networks crossed ৳5L in monthly revenue.", tone: "success" as const },
  { time: "14 min ago", text: "New reseller application submitted — Kajol Broadband.", tone: "signal" as const },
  { time: "38 min ago", text: "Server SERVER-4 (Rajshahi) reported high latency.", tone: "caution" as const },
  { time: "1 hr ago", text: "Bulk SMS gateway BDbulkSMS credit balance below 10%.", tone: "destructive" as const },
  { time: "2 hr ago", text: "Reseller commission payout of ৳2.1L completed.", tone: "violet" as const },
];

const pendingApprovals = [
  { name: "Kajol Broadband", type: "New Reseller", region: "Mymensingh" },
  { name: "Green Net ISP", type: "Package Change", region: "Barisal" },
  { name: "Trisha Cable", type: "Server Upgrade", region: "Dhaka" },
];

export default function SuperAdminPage() {
  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          {/* Metric row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* Bento main grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Network health map — spans 2 cols */}
            <GlassCard className="xl:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase text-white/40 mb-1">
                    Live Infrastructure
                  </p>
                  <h2 className="font-heading text-lg font-bold">Network Health Map</h2>
                </div>
                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-success" /> Healthy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-caution" /> Degraded
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-destructive" /> Down
                  </span>
                </div>
              </div>
              <NetworkMap />
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-2xl font-heading font-bold">208</p>
                  <p className="text-xs text-white/40">Servers online</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-caution">3</p>
                  <p className="text-xs text-white/40">Degraded</p>
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold text-destructive">1</p>
                  <p className="text-xs text-white/40">Down</p>
                </div>
              </div>
            </GlassCard>

            {/* Uptime gauge */}
            <GlassCard className="flex flex-col items-center justify-center">
              <p className="text-xs font-semibold tracking-wide uppercase text-white/40 mb-2 self-start">
                Platform Uptime
              </p>
              <RadialGauge percent={99.8} label="Last 30 days" sub="No major incidents" />
              <div className="w-full flex items-center justify-center gap-2 mt-2 text-xs text-success font-semibold">
                <ShieldCheck className="h-3.5 w-3.5" /> SLA target met
              </div>
            </GlassCard>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Leaderboard */}
            <GlassCard className="xl:col-span-1">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-lg font-bold">Top Resellers</h2>
                <button className="text-xs font-semibold text-signal flex items-center gap-1 hover:gap-1.5 transition-all">
                  View all <ArrowRight className="h-3 w-3" />
                </button>
              </div>
              <Leaderboard rows={leaderboardRows} />
            </GlassCard>

            {/* Activity feed */}
            <GlassCard className="xl:col-span-1">
              <h2 className="font-heading text-lg font-bold mb-4">Live Activity</h2>
              <ActivityFeed items={activity} />
            </GlassCard>

            {/* Approvals + quick actions */}
            <GlassCard className="xl:col-span-1 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-heading text-lg font-bold">Pending Approvals</h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-signal/15 text-signal">
                  {pendingApprovals.length}
                </span>
              </div>
              <div className="space-y-2 mb-5">
                {pendingApprovals.map((a) => (
                  <div
                    key={a.name}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/[0.04] border border-white/5"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{a.name}</p>
                      <p className="text-xs text-white/40">
                        {a.type} · {a.region}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex gap-2">
                <button className="flex-1 rounded-2xl bg-gradient-to-r from-signal to-violet-accent text-sm font-semibold py-2.5 flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity">
                  <Plus className="h-3.5 w-3.5" /> Add Reseller
                </button>
                <button className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
                  <Zap className="h-4 w-4 text-white/70" />
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Alert strip */}
          <GlassCard className="flex items-center gap-4 !py-4">
            <div className="w-10 h-10 rounded-full bg-destructive/15 flex items-center justify-center shrink-0">
              <TriangleAlert className="h-4.5 w-4.5 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">
                SMS gateway <span className="text-caution">BDbulkSMS</span> credit balance is critically low.
              </p>
              <p className="text-xs text-white/40">Affects 14 resellers using shared gateway credit.</p>
            </div>
            <button className="text-xs font-bold px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors shrink-0">
              Resolve now
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}