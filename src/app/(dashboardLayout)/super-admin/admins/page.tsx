"use client";

import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { GlassCard } from "@/components/super-admin/widgets";
import { DarkTableShell, DarkTableHead, StatusChip, PageTitle } from "@/components/super-admin/table-shell";
import { Plus, Shield, ShieldCheck, UserCog, Users, MoreVertical } from "lucide-react";

const columns = ["Admin", "Role", "Last Active", "Access Level", "Status", ""];

const admins = [
  { name: "Nazmul Hasan", email: "nazmul@platform.com", role: "Super Admin", active: "Online now", level: "Full access", status: "success" as const },
  { name: "Sanwar Hossain", email: "sanwar@platform.com", role: "Platform Admin", active: "12 min ago", level: "Resellers + Billing", status: "success" as const },
  { name: "Taylor Michel", email: "taylor@platform.com", role: "Support Lead", active: "1 hour ago", level: "Tickets + Support", status: "success" as const },
  { name: "Michel Taylor", email: "michel@platform.com", role: "Finance Reviewer", active: "3 days ago", level: "Revenue (read-only)", status: "caution" as const },
  { name: "Rezaul Karim", email: "rezaul@platform.com", role: "Network Ops", active: "2 weeks ago", level: "Network + Servers", status: "destructive" as const },
];

const statusLabel = { success: "Active", caution: "Idle", destructive: "Disabled" };

const roleSummary = [
  { icon: Shield, label: "Super Admins", value: "1" },
  { icon: ShieldCheck, label: "Platform Admins", value: "4" },
  { icon: UserCog, label: "Ops & Support", value: "9" },
  { icon: Users, label: "Total staff", value: "14" },
];

export default function AdminsPage() {
  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8 space-y-6">
          <PageTitle eyebrow="Command Center" title="Admins">
            <button className="rounded-full gap-1.5 font-semibold h-11 px-5 bg-gradient-to-r from-signal to-violet-accent shadow-lg shadow-signal/20 flex items-center hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-1.5" /> Invite Admin
            </button>
          </PageTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {roleSummary.map((r) => (
              <GlassCard key={r.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-signal/15 text-signal flex items-center justify-center shrink-0">
                  <r.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{r.label}</p>
                  <p className="font-heading text-2xl font-bold">{r.value}</p>
                </div>
              </GlassCard>
            ))}
          </div>

          <DarkTableShell>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <DarkTableHead columns={columns} />
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.email} className="border-t border-white/5 hover:bg-white/[0.04] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-xs font-bold shrink-0">
                            {a.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-semibold">{a.name}</p>
                            <p className="text-xs text-white/40">{a.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/70">{a.role}</td>
                      <td className="px-6 py-4 text-white/50">{a.active}</td>
                      <td className="px-6 py-4 text-white/70">{a.level}</td>
                      <td className="px-6 py-4">
                        <StatusChip tone={a.status}>{statusLabel[a.status]}</StatusChip>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/40 ml-auto">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
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