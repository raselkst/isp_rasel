"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Search, Signal, SignalHigh, SignalLow, XCircle } from "lucide-react";

const mockLaserData = [
  { id: "L-001", cid: "C-101", laser: "Laser 1", pon: "PON-1", onu: "ONU-01", vlan: "100", mac: "00:1A:2B:3C:4D:5E", olt: "OLT-A", status: "active", updateTime: "2 mins ago" },
  { id: "L-002", cid: "C-102", laser: "Laser 2", pon: "PON-2", onu: "ONU-02", vlan: "101", mac: "00:1A:2B:3C:4D:5F", olt: "OLT-A", status: "warning", updateTime: "5 mins ago" },
  { id: "L-003", cid: "C-103", laser: "Laser 3", pon: "PON-3", onu: "ONU-03", vlan: "102", mac: "00:1A:2B:3C:4D:60", olt: "OLT-B", status: "offline", updateTime: "1 hour ago" },
];

export default function LaserAnalyticsPage() {
  const [data] = useState(mockLaserData);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <SignalHigh className="w-5 h-5 text-emerald-500" />;
      case "warning":
        return <SignalLow className="w-5 h-5 text-amber-500" />;
      case "offline":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Signal className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            High Laser Users
          </h1>

          {/* Filter Bar */}
          <div className="bg-card rounded-2xl border p-6 mb-6 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px] space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pop In-Charge</label>
              <select className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none appearance-none">
                <option>Choose Pop In-Charge</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px] space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OLT List</label>
              <select className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none appearance-none">
                <option>Choose OLT</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px] space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">PON List</label>
              <select className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none appearance-none">
                <option>Choose One</option>
              </select>
            </div>
            <button className="bg-signal hover:bg-signal/90 text-white font-semibold px-6 py-2.5 rounded-xl transition-all flex items-center gap-2">
              <Search className="w-4 h-4" /> Filter
            </button>
          </div>

          {/* Grid View */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((item) => (
              <div
                key={item.id}
                className={`bg-card rounded-2xl border p-6 transition-all duration-300 hover:shadow-md cursor-pointer ${
                  item.status === "active"
                    ? "border-emerald-500/40"
                    : item.status === "warning"
                    ? "border-amber-500/40"
                    : "border-red-500/40"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{item.id}</h3>
                    <p className="text-xs text-muted-foreground">CID: {item.cid}</p>
                  </div>
                  <div
                    className={`p-2 rounded-full ${
                      item.status === "active"
                        ? "bg-emerald-500/10"
                        : item.status === "warning"
                        ? "bg-amber-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {getStatusIcon(item.status)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Laser / PON</span>
                    <span className="font-medium">{item.laser} / {item.pon}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ONU / VLAN</span>
                    <span className="font-medium">{item.onu} / {item.vlan}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">OLT Name</span>
                    <span className="font-medium">{item.olt}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-3 mt-3">
                    <span className="text-muted-foreground">Last Update</span>
                    <span className="text-xs">{item.updateTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}