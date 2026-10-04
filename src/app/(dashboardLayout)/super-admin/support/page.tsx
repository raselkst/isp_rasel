"use client";

import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { GlassCard } from "@/components/super-admin/widgets";
import { PageTitle } from "@/components/super-admin/table-shell";
import { cn } from "@/lib/utils";
import { LifeBuoy, Clock, CheckCircle2, Flame } from "lucide-react";

const summary = [
  { icon: LifeBuoy, label: "Open tickets", value: "37", tone: "signal" },
  { icon: Flame, label: "High priority", value: "6", tone: "destructive" },
  { icon: Clock, label: "Avg. response time", value: "18m", tone: "caution" },
  { icon: CheckCircle2, label: "Resolved today", value: "52", tone: "success" },
];

const toneClass: Record<string, string> = {
  signal: "bg-signal/15 text-signal",
  destructive: "bg-destructive/15 text-destructive",
  caution: "bg-caution/15 text-caution",
  success: "bg-success/15 text-success",
};

const columnsData = [
  {
    title: "New",
    tone: "signal",
    tickets: [
      { id: "TK-1029", subject: "Cannot access billing dashboard", reseller: "Kajol Broadband" },
      { id: "TK-1028", subject: "Bulk SMS not sending", reseller: "Delowar Network" },
    ],
  },
  {
    title: "In Progress",
    tone: "caution",
    tickets: [
      { id: "TK-1024", subject: "Server 4 downtime compensation", reseller: "Rejaul Cable Network" },
      { id: "TK-1021", subject: "Package migration stuck at 80%", reseller: "Sky Next Networks" },
      { id: "TK-1019", subject: "Reseller commission mismatch", reseller: "Afi Cable Network" },
    ],
  },
  {
    title: "Escalated",
    tone: "destructive",
    tickets: [{ id: "TK-1017", subject: "Suspected fraudulent card generation", reseller: "Unknown reseller" }],
  },
  {
    title: "Resolved",
    tone: "success",
    tickets: [
      { id: "TK-1012", subject: "Password reset for admin panel", reseller: "Refayetpur Broadband" },
      { id: "TK-1008", subject: "Invoice PDF formatting issue", reseller: "Sky Next Networks" },
    ],
  },
];

export default function SupportPage() {
  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          <PageTitle eyebrow="Command Center" title="Support" />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {summary.map((s) => (
              <GlassCard key={s.label} className="flex items-center gap-4">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", toneClass[s.tone])}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{s.label}</p>
                  <p className="font-heading text-2xl font-bold">{s.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
            {columnsData.map((col) => (
              <div key={col.title}>
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={cn("w-2 h-2 rounded-full", toneClass[col.tone].split(" ")[1].replace("text-", "bg-"))} />
                  <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-white/70">
                    {col.title}
                  </h2>
                  <span className="text-xs text-white/30">({col.tickets.length})</span>
                </div>
                <div className="space-y-3">
                  {col.tickets.map((t) => (
                    <GlassCard key={t.id} className="!p-4 !rounded-2xl hover:bg-white/[0.05] transition-colors cursor-pointer">
                      <p className="text-xs font-mono text-white/40 mb-1">{t.id}</p>
                      <p className="text-sm font-semibold leading-snug mb-2">{t.subject}</p>
                      <p className="text-xs text-white/40">{t.reseller}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}