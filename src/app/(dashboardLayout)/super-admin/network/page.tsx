"use client";

import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { GlassCard, NetworkMap } from "@/components/super-admin/widgets";
import { DarkTableShell, DarkTableHead, StatusChip, PageTitle } from "@/components/super-admin/table-shell";
import { Server, Gauge, Signal, RotateCw } from "lucide-react";

const columns = ["Server", "Region", "Load", "Latency", "Clients", "Status", ""];

const servers = [
  { name: "SERVER-1 · Dhaka Core", region: "Dhaka Division", load: 62, latency: "11ms", clients: "28,410", status: "success" as const },
  { name: "SERVER-2 · Khulna Edge", region: "Khulna Division", load: 45, latency: "14ms", clients: "14,880", status: "success" as const },
  { name: "SERVER-3 · Chattogram", region: "Chattogram Division", load: 88, latency: "31ms", clients: "22,130", status: "caution" as const },
  { name: "SERVER-4 · Rajshahi", region: "Rajshahi Division", load: 12, latency: "—", clients: "9,760", status: "destructive" as const },
  { name: "SERVER-5 · Sylhet Edge", region: "Sylhet Division", load: 54, latency: "18ms", clients: "8,140", status: "success" as const },
];

const statusLabel = { success: "Online", caution: "Degraded", destructive: "Offline" };

function LoadBar({ value }: { value: number }) {
  const color = value > 80 ? "var(--destructive)" : value > 60 ? "var(--caution)" : "var(--success)";
  return (
    <div className="flex items-center gap-2 w-32">
      <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-white/50 w-8 shrink-0">{value}%</span>
    </div>
  );
}

export default function NetworkPage() {
  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          <PageTitle eyebrow="Command Center" title="Network">
            <button className="rounded-full gap-1.5 font-semibold h-11 px-5 bg-white/5 border border-white/10 flex items-center hover:bg-white/10 transition-colors">
              <RotateCw className="h-4 w-4 mr-1.5" /> Refresh status
            </button>
          </PageTitle>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <GlassCard className="xl:col-span-2">
              <h2 className="font-heading text-lg font-bold mb-4">Regional Health Map</h2>
              <NetworkMap />
            </GlassCard>

            <div className="grid grid-cols-1 gap-5">
              <GlassCard className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-signal/15 text-signal flex items-center justify-center shrink-0">
                  <Server className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Total servers</p>
                  <p className="font-heading text-2xl font-bold">212</p>
                </div>
              </GlassCard>
              <GlassCard className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-success/15 text-success flex items-center justify-center shrink-0">
                  <Gauge className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Avg. network load</p>
                  <p className="font-heading text-2xl font-bold">52%</p>
                </div>
              </GlassCard>
              <GlassCard className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-violet-accent/15 text-violet-accent flex items-center justify-center shrink-0">
                  <Signal className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40">Avg. latency</p>
                  <p className="font-heading text-2xl font-bold">18ms</p>
                </div>
              </GlassCard>
            </div>
          </div>

          <DarkTableShell>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <DarkTableHead columns={columns} />
                <tbody>
                  {servers.map((s) => (
                    <tr key={s.name} className="border-t border-white/5 hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4 font-semibold">{s.name}</td>
                      <td className="px-6 py-4 text-white/60">{s.region}</td>
                      <td className="px-6 py-4">
                        <LoadBar value={s.load} />
                      </td>
                      <td className="px-6 py-4 text-white/60">{s.latency}</td>
                      <td className="px-6 py-4 text-white/80">{s.clients}</td>
                      <td className="px-6 py-4">
                        <StatusChip tone={s.status}>{statusLabel[s.status]}</StatusChip>
                      </td>
                      <td className="px-6 py-4 text-right text-white/30">›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DarkTableShell>
        </div>
      </div>
    </div>
  );
}