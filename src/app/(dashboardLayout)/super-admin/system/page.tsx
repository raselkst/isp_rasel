"use client";

import { useState } from "react";
import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { GlassCard } from "@/components/super-admin/widgets";
import { PageTitle } from "@/components/super-admin/table-shell";
import { KeyRound, ScrollText, Bell, ShieldCheck } from "lucide-react";

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((o) => !o)}
      className={`w-12 h-6.5 rounded-full relative transition-colors shrink-0 ${on ? "bg-gradient-to-r from-signal to-violet-accent" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 w-5.5 h-5.5 rounded-full bg-white transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}

const toggles = [
  { label: "Two-factor authentication for all admins", desc: "Require 2FA on every admin login attempt.", on: true },
  { label: "Auto-suspend resellers on overdue payment", desc: "Suspend service after 7 days past due.", on: true },
  { label: "Platform-wide maintenance mode", desc: "Show a maintenance banner to all resellers.", on: false },
  { label: "Email digest for critical alerts", desc: "Send a daily summary to super admins.", on: true },
];

const apiKeys = [
  { name: "Production API Key", value: "sk_live_••••••••••••4f2a", created: "Created Jan 12, 2026" },
  { name: "SMS Gateway Key (BDbulkSMS)", value: "sms_••••••••••••9c31", created: "Created Mar 3, 2026" },
];

const auditLog = [
  { actor: "Nazmul Hasan", action: "Updated commission rate for Sky Next Networks", time: "10 min ago" },
  { actor: "Sanwar Hossain", action: "Suspended reseller Kajol Broadband", time: "2 hours ago" },
  { actor: "System", action: "Rotated SMS gateway API key", time: "Yesterday" },
];

export default function SystemPage() {
  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          <PageTitle eyebrow="Command Center" title="System" />

          <GlassCard>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl bg-signal/15 text-signal flex items-center justify-center">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <h2 className="font-heading text-lg font-bold">Platform Controls</h2>
            </div>
            <div className="divide-y divide-white/5">
              {toggles.map((t) => (
                <div key={t.label} className="flex items-center justify-between gap-4 py-4">
                  <div>
                    <p className="text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-white/40 mt-0.5">{t.desc}</p>
                  </div>
                  <Toggle defaultOn={t.on} />
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-violet-accent/15 text-violet-accent flex items-center justify-center">
                  <KeyRound className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-heading text-lg font-bold">API Keys</h2>
              </div>
              <div className="space-y-3">
                {apiKeys.map((k) => (
                  <div key={k.name} className="px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10">
                    <p className="text-sm font-semibold">{k.name}</p>
                    <p className="text-xs font-mono text-white/50 mt-1">{k.value}</p>
                    <p className="text-xs text-white/30 mt-1">{k.created}</p>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold py-2.5 hover:bg-white/10 transition-colors">
                Generate new key
              </button>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-caution/15 text-caution flex items-center justify-center">
                  <ScrollText className="h-4.5 w-4.5" />
                </div>
                <h2 className="font-heading text-lg font-bold">Audit Log</h2>
              </div>
              <div className="space-y-4">
                {auditLog.map((l, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Bell className="h-3.5 w-3.5 text-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold">{l.actor}</span>{" "}
                        <span className="text-white/60">{l.action}</span>
                      </p>
                      <p className="text-xs text-white/30 mt-0.5">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}