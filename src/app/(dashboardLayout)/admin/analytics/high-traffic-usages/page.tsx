"use client";

import React, { useState } from "react";
import { Search, Download, Activity, Wifi, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";

const mockData = [
  { id: "C-101", package: "Premium 50Mbps", upload: "12.5 GB", download: "85.2 GB", total: "97.7 GB", avg: "4.2 Mbps" },
  { id: "C-102", package: "Standard 20Mbps", upload: "5.1 GB", download: "32.4 GB", total: "37.5 GB", avg: "2.1 Mbps" },
  { id: "C-103", package: "Basic 10Mbps", upload: "1.2 GB", download: "8.5 GB", total: "9.7 GB", avg: "0.8 Mbps" },
];

export default function HighTrafficUsagesPage() {
  const [data] = useState(mockData);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
                  <Activity className="h-3 w-3" /> Analytics
                </p>
                <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                  Real-time Traffic Flow
                </h1>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Live Data Syncing
                </p>
              </div>
              <button className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl transition-all text-signal font-semibold text-sm shadow-sm">
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>

            {/* Filter Bar — Theme Connected */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pop In-Charge</label>
                  <select className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal font-semibold outline-none focus:ring-2 focus:ring-signal/30 appearance-none">
                    <option>Choose Pop In-Charge</option>
                    <option>Pop 1</option>
                    <option>Pop 2</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date From</label>
                  <input
                    type="date"
                    defaultValue="2026-09-17"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal font-semibold outline-none focus:ring-2 focus:ring-signal/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Date To</label>
                  <input
                    type="date"
                    defaultValue="2026-09-24"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal font-semibold outline-none focus:ring-2 focus:ring-signal/30"
                  />
                </div>
                <div className="flex items-end">
                  <button className="w-full bg-signal hover:bg-signal-hover text-white font-semibold py-2.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2">
                    <Search className="w-4 h-4" /> Search Data
                  </button>
                </div>
              </div>
            </div>

            {/* Stat Cards — Compact */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-signal" />
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Clients</p>
                  <p className="text-lg font-heading font-bold text-signal">{data.length}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-success" />
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total Up</p>
                  <p className="text-lg font-heading font-bold text-success">18.8 GB</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-violet-accent-tint flex items-center justify-center shrink-0">
                  <ArrowDownRight className="w-4 h-4 text-violet-accent" />
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total Down</p>
                  <p className="text-lg font-heading font-bold text-violet-accent">126.1 GB</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                  <Wifi className="w-4 h-4 text-warning" />
                </div>
                <div className="flex items-baseline gap-2 min-w-0">
                  <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Avg Speed</p>
                  <p className="text-lg font-heading font-bold text-warning">2.4 Mbps</p>
                </div>
              </div>
            </div>

            {/* Traffic Cards List */}
            <div className="space-y-3">
              {data.length > 0 ? (
                data.map((item) => (
                  <div
                    key={item.id}
                    className="group bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 transition-all duration-300 hover:shadow-md hover:border-signal/30"
                  >
                    {/* Left: Client Info */}
                    <div className="flex items-center gap-4 w-full md:w-1/4">
                      <div className="w-12 h-12 rounded-xl bg-signal-tint flex items-center justify-center text-signal shrink-0">
                        <Wifi className="w-6 h-6" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-signal text-lg">{item.id}</h3>
                        <p className="text-xs text-slate-500 truncate">{item.package}</p>
                      </div>
                    </div>

                    {/* Right: Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-3/4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <ArrowUpRight className="w-3 h-3 text-success" /> Upload
                        </p>
                        <p className="font-semibold text-success">{item.upload}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                          <ArrowDownRight className="w-3 h-3 text-signal" /> Download
                        </p>
                        <p className="font-semibold text-signal">{item.download}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Total Usage</p>
                        <p className="font-semibold text-signal">{item.total}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Avg Speed</p>
                        <p className="font-semibold text-warning">{item.avg}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
                  <Activity className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-signal">No Traffic Data Found</h3>
                  <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or date range.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}