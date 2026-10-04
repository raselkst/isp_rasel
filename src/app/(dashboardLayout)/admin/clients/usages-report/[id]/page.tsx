"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const tabs = ["Last 7 Days", "This Month", "Last Month", "Session Log"] as const;

const rows = Array.from({ length: 7 }).map((_, i) => ({
  date: i % 2 === 0 ? "2025-08-01" : "2025-08-02",
  upload: "0.30 G",
  download: "7.42 G",
}));

export default function DailyUsagesReportPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Last 7 Days");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Daily Usages Report
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h2 className="font-heading text-lg font-bold">Daily Usages Report ({tab})</h2>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex bg-signal-tint rounded-full p-1 gap-1">
                {tabs.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                      tab === t ? "bg-signal text-signal-foreground" : "text-signal"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 rounded-full w-56" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  <th className="text-left px-6 py-4 font-semibold text-xs">Date</th>
                  <th className="text-left px-6 py-4 font-semibold text-xs">Upload</th>
                  <th className="text-left px-6 py-4 font-semibold text-xs">Download</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-6 py-4 whitespace-nowrap">{r.date}</td>
                    <td className="px-6 py-4 font-mono">{r.upload}</td>
                    <td className="px-6 py-4 font-mono">{r.download}</td>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}