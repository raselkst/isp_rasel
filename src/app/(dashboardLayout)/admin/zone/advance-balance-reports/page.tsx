"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ReportToolbar } from "@/components/zone/report-toolbar";
import { Search } from "lucide-react";

const rows = [
  { user: "admin@uci.net", old: 500, next: 0, date: "2025-07-05 10:39", by: "Network Service Provider (NSP)" },
  { user: "admin@uci.net", old: 0, next: 500, date: "2025-07-05 10:39", by: "Network Service Provider (NSP)" },
  { user: "admin@uci.net", old: 500, next: 0, date: "2025-07-05 10:39", by: "Network Service Provider (NSP)" },
  { user: "admin@uci.net", old: 0, next: 500, date: "2025-07-05 10:39", by: "Network Service Provider (NSP)" },
];

export default function AdvanceBalanceReportsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-8 py-7">
          <ReportToolbar
            extraFilters={
              <span className="text-sm font-semibold text-muted-foreground ml-auto">
                Show For All Reseller:
              </span>
            }
          />

          <div className="flex items-center justify-between mb-4">
            <h1 className="font-heading text-2xl font-bold">Advance Balance Reports</h1>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search…"
                className="w-full pl-9 pr-4 py-2.5 rounded-full border bg-card text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  {["Username", "Old Advance Balance", "New Advance Balance", "Advance Balance Date", "Done By", "Remarks"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-[13px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-muted/40">
                    <td className="px-5 py-4">{r.user}</td>
                    <td className="px-5 py-4 font-mono">{r.old}</td>
                    <td className="px-5 py-4 font-mono">{r.next}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.date}</td>
                    <td className="px-5 py-4">{r.by}</td>
                    <td className="px-5 py-4" />
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                Items per page:
                <select className="border rounded-md px-2 py-1 bg-background">
                  <option>25</option>
                </select>
                <span>1-4 of 100 items</span>
              </div>
              <div className="flex items-center gap-3">
                <select className="border rounded-md px-2 py-1 bg-background">
                  <option>12</option>
                </select>
                <span>of 40 pages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}