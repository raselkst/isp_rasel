"use client";

import { useState } from "react";
import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { GlassCard } from "@/components/super-admin/widgets";
import { PageTitle } from "@/components/super-admin/table-shell";
import { cn } from "@/lib/utils";
import { TriangleAlert, ShieldAlert, Info, CheckCircle2 } from "lucide-react";

const filters = ["All", "Critical", "Warning", "Resolved"];

const alerts = [
  {
    tone: "destructive" as const,
    icon: ShieldAlert,
    title: "SMS gateway BDbulkSMS credit balance critically low",
    detail: "Affects 14 resellers using the shared gateway credit pool.",
    time: "12 minutes ago",
    status: "Critical",
  },
  {
    tone: "destructive" as const,
    icon: TriangleAlert,
    title: "SERVER-4 (Rajshahi) unreachable",
    detail: "No heartbeat received for 8 minutes — 9,760 clients potentially affected.",
    time: "38 minutes ago",
    status: "Critical",
  },
  {
    tone: "caution" as const,
    icon: TriangleAlert,
    title: "SERVER-3 (Chattogram) running at 88% load",
    detail: "Consider load-balancing or provisioning an additional node.",
    time: "1 hour ago",
    status: "Warning",
  },
  {
    tone: "caution" as const,
    icon: Info,
    title: "Kajol Broadband payment overdue by 5 days",
    detail: "Auto-suspension scheduled in 2 days if unresolved.",
    time: "3 hours ago",
    status: "Warning",
  },
  {
    tone: "success" as const,
    icon: CheckCircle2,
    title: "SERVER-2 (Khulna) maintenance completed",
    detail: "Firmware updated to v7.4, zero downtime reported.",
    time: "Yesterday, 6:40 PM",
    status: "Resolved",
  },
];

const toneMap = {
  destructive: { bg: "bg-destructive/15", text: "text-destructive", ring: "ring-destructive/20" },
  caution: { bg: "bg-caution/15", text: "text-caution", ring: "ring-caution/20" },
  success: { bg: "bg-success/15", text: "text-success", ring: "ring-success/20" },
};

export default function AlertsPage() {
  const [filter, setFilter] = useState("All");

  const visible = alerts.filter((a) => filter === "All" || a.status === filter);

  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          <PageTitle eyebrow="Command Center" title="Risk & Alerts">
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1 gap-1">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-bold transition-colors",
                    filter === f ? "bg-gradient-to-r from-signal to-violet-accent text-white" : "text-white/50 hover:text-white"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </PageTitle>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <GlassCard className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Critical</p>
                <p className="font-heading text-2xl font-bold">2</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-caution/15 text-caution flex items-center justify-center shrink-0">
                <TriangleAlert className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Warning</p>
                <p className="font-heading text-2xl font-bold">2</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-white/40">Resolved (24h)</p>
                <p className="font-heading text-2xl font-bold">9</p>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-3">
            {visible.map((a, i) => {
              const t = toneMap[a.tone];
              return (
                <GlassCard key={i} className="flex items-start gap-4 !py-5">
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 ring-4", t.bg, t.text, t.ring)}>
                    <a.icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{a.title}</p>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", t.bg, t.text)}>
                        {a.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/50 mt-1">{a.detail}</p>
                    <p className="text-xs text-white/30 mt-1.5">{a.time}</p>
                  </div>
                  {a.status !== "Resolved" && (
                    <button className="text-xs font-bold px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors shrink-0">
                      Resolve
                    </button>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}