"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, FileSpreadsheet, FileDown, FileText, Search } from "lucide-react";

const columns = [
  "Username",
  "Start Time",
  "End Time",
  "Duration",
  "IP",
  "MAC",
  "Upload (M)",
  "Download (M)",
  "Disconnect Cause",
  "Port",
  "IPv6",
  "NAS IP",
];

const rows = Array.from({ length: 10 }).map(() => ({
  username: "motiar.sk",
  start: "2025-08-03 15:14:14.0",
  end: "2025-08-03 15:13:11.0",
  duration: "00:00:18",
  ip: "123.10.0.12",
  mac: "B6:1C:82:23:88:32",
  upload: "0",
  download: "0",
  nasIp: "10.253.0.185 ID-19-SERVER-1",
}));

function ExportButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <Button variant="outline" className="rounded-full gap-1.5 font-semibold text-signal border-signal/30">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export default function SessionLogPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="bg-signal-tint rounded-2xl p-5 flex flex-wrap items-center gap-4 mb-2">
            <span className="font-semibold text-sm">Date:</span>
            <Input type="date" defaultValue="2025-07-11" className="rounded-xl w-44" />
            <span className="text-sm text-muted-foreground">To</span>
            <Input type="date" defaultValue="2025-07-12" className="rounded-xl w-44" />
            <Button className="rounded-xl">Go</Button>
          </div>
          <p className="text-sm font-semibold text-center mb-6">
            Sub-Zone Report From <span className="text-signal">2025-07-11</span> To{" "}
            <span className="text-signal">2025-07-12</span>
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h2 className="font-heading text-lg font-bold">Session Log</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 rounded-full w-56" />
              </div>
              <ExportButton icon={Copy} label="Copy" />
              <ExportButton icon={FileSpreadsheet} label="Excel" />
              <ExportButton icon={FileDown} label="CSV" />
              <ExportButton icon={FileText} label="PDF" />
            </div>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[1300px]">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  {columns.map((c) => (
                    <th key={c} className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-4 py-4">{r.username}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{r.start}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{r.end}</td>
                    <td className="px-4 py-4">{r.duration}</td>
                    <td className="px-4 py-4">{r.ip}</td>
                    <td className="px-4 py-4 font-mono">{r.mac}</td>
                    <td className="px-4 py-4">{r.upload}</td>
                    <td className="px-4 py-4">{r.download}</td>
                    <td className="px-4 py-4">—</td>
                    <td className="px-4 py-4">—</td>
                    <td className="px-4 py-4">—</td>
                    <td className="px-4 py-4 whitespace-nowrap">{r.nasIp}</td>
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