"use client";

import { useState } from "react";
import { NavRail } from "@/components/super-admin/nav-rail";
import { TopBar } from "@/components/super-admin/topbar";
import { DarkTableShell, DarkTableHead, StatusChip, PageTitle } from "@/components/super-admin/table-shell";
import { ResellerDrawer } from "@/components/super-admin/reseller-drawer";
import { Search, Plus, Building2 } from "lucide-react";

const columns = ["Reseller", "Region", "Subscribers", "Monthly Revenue", "Servers", "Status", ""];

const resellers = [
  { name: "Sky Next Networks", region: "Dhaka Division", status: "success" as const, revenue: "৳6.8L", subscribers: "18,204", servers: 6, phone: "01710626699", email: "admin@skynext.net" },
  { name: "Refayetpur Broadband", region: "Khulna Division", status: "success" as const, revenue: "৳5.1L", subscribers: "14,880", servers: 4, phone: "01710626699", email: "admin@rbnisp.net" },
  { name: "Delowar Network (DNET)", region: "Chattogram Division", status: "caution" as const, revenue: "৳4.4L", subscribers: "11,320", servers: 3, phone: "01710626699", email: "support@dnet.com" },
  { name: "Rejaul Cable Network", region: "Rajshahi Division", status: "success" as const, revenue: "৳3.9L", subscribers: "9,760", servers: 3, phone: "01710626699", email: "info@rcn.com" },
  { name: "Afi Cable Network", region: "Sylhet Division", status: "success" as const, revenue: "৳3.2L", subscribers: "8,140", servers: 2, phone: "01710626699", email: "hello@acn.com" },
  { name: "Kajol Broadband", region: "Mymensingh Division", status: "destructive" as const, revenue: "৳1.1L", subscribers: "2,410", servers: 1, phone: "01710626699", email: "kajol@kb.net" },
];

const statusLabel = { success: "Active", caution: "At risk", destructive: "Suspended" };

export default function ResellersPage() {
  const [selected, setSelected] = useState<(typeof resellers)[number] | null>(null);

  return (
    <div className="flex min-h-screen bg-[#05070c] text-white">
      <NavRail />

      <div className="flex-1 min-w-0">
        <TopBar />

        <div className="px-6 sm:px-10 py-8">
          <PageTitle eyebrow="Command Center" title="Resellers">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
              <input
                placeholder="Search resellers..."
                className="w-64 rounded-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-signal/60 focus:ring-4 focus:ring-signal/10"
              />
            </div>
            <button className="rounded-full gap-1.5 font-semibold h-11 px-5 bg-gradient-to-r from-signal to-violet-accent shadow-lg shadow-signal/20 flex items-center hover:opacity-90 transition-opacity">
              <Plus className="h-4 w-4 mr-1.5" /> Add Reseller
            </button>
          </PageTitle>

          <DarkTableShell>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <DarkTableHead columns={columns} />
                <tbody>
                  {resellers.map((r) => (
                    <tr
                      key={r.name}
                      onClick={() => setSelected(r)}
                      className="border-t border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0">
                            <Building2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="font-semibold">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white/60">{r.region}</td>
                      <td className="px-6 py-4 text-white/80">{r.subscribers}</td>
                      <td className="px-6 py-4 font-bold text-signal">{r.revenue}</td>
                      <td className="px-6 py-4 text-white/60">{r.servers}</td>
                      <td className="px-6 py-4">
                        <StatusChip tone={r.status}>{statusLabel[r.status]}</StatusChip>
                      </td>
                      <td className="px-6 py-4 text-right text-white/30">›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-white/10 text-sm text-white/40">
              <span>Showing 1–6 of 1,248 resellers</span>
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
                  ‹
                </button>
                <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
                  ›
                </button>
              </div>
            </div>
          </DarkTableShell>
        </div>
      </div>

      <ResellerDrawer open={!!selected} onClose={() => setSelected(null)} reseller={selected} />
    </div>
  );
}