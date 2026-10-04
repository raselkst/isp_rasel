"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const columns = ["SL.", "Reference", "Debit", "Credit", "Balance", "Time", "Creator", "Description"];

const rows = Array.from({ length: 12 }).map((_, i) => ({
  sl: i + 1,
  ref: i % 2 === 0 ? "19133648" : "19133647",
  debit: i % 2 === 0 ? "500" : "-",
  credit: i % 2 === 0 ? "-" : "500",
  balance: i % 2 === 0 ? "0" : "500",
  time: "2025-07-05 10:42:28",
  creator: i % 2 === 0 ? "TNRSOFT-24Network" : "24 Network (Admin)",
  desc: "AC Renewal From 24 Network (Admin)",
}));

export default function ClientRechargeHistoryPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight">Client Recharge History</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 rounded-full w-56" />
            </div>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  {columns.map((c) => (
                    <th key={c} className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.sl} className="border-t">
                    <td className="px-6 py-4">{r.sl}</td>
                    <td className="px-6 py-4 font-mono">{r.ref}</td>
                    <td className="px-6 py-4">{r.debit}</td>
                    <td className="px-6 py-4">{r.credit}</td>
                    <td className="px-6 py-4">{r.balance}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{r.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{r.creator}</td>
                    <td className="px-6 py-4">{r.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Items per page:</span>
                <select className="border rounded-lg px-2 py-1 bg-background">
                  <option>25</option>
                </select>
                <span>1-25 of 100 items</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <select className="border rounded-lg px-2 py-1 bg-background">
                  <option>12</option>
                </select>
                <span>of 40 pages</span>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  ‹
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  ›
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}