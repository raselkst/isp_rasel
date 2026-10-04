"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { time: "14:31", active: 185, online: 170 },
  { time: "15:00", active: 190, online: 175 },
  { time: "15:30", active: 180, online: 165 },
  { time: "16:00", active: 195, online: 180 },
  { time: "16:30", active: 200, online: 185 },
  { time: "17:00", active: 190, online: 170 },
  { time: "17:30", active: 185, online: 165 },
  { time: "18:00", active: 195, online: 180 },
];

export default function PPPoEAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Active & Online Users VS Time
          </h1>

          <div className="bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">Network Pulse</h2>
              <div className="flex items-center gap-5 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-signal" />
                  Active
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-accent" />
                  Online
                </span>
              </div>
            </div>

            <div className="h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F8B8D" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0F8B8D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis tickLine={false} axisLine={false} fontSize={11} width={40} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="active"
                    name="Active Users"
                    stroke="#0F8B8D"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorActive)"
                  />
                  <Area
                    type="monotone"
                    dataKey="online"
                    name="Online Users"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOnline)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}