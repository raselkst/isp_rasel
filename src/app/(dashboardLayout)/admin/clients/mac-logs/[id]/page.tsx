"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, FileSpreadsheet, FileDown, FileText, Search } from "lucide-react";

const columns = ["SL.", "Device", "Mac", "IP", "Register Time"];

const rows = Array.from({ length: 12 }).map((_, i) => ({
  sl: i + 1,
  device: i % 2 === 0 ? "Hridoy-5-A13" : "Galaxy-A13",
  mac: i % 2 === 0 ? "12:42:AE:64:66:A3" : "F6:79:0A:75:96:AB",
  ip: i % 2 === 0 ? "10.111.1.182" : "10.111.0.42",
  time: i % 2 === 0 ? "2025-02-18 09:53:11" : "2025-01-26 16:48:43",
}));

function ExportButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <Button variant="outline" className="rounded-full gap-1.5 font-semibold text-signal border-signal/30">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export default function ClientMacLogsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight">Client Mac Logs: 332652</h1>

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
                    <td className="px-6 py-4">{r.device}</td>
                    <td className="px-6 py-4 font-mono">{r.mac}</td>
                    <td className="px-6 py-4 font-mono">{r.ip}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{r.time}</td>
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