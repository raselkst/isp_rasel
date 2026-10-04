"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const data = [
  { month: "January-2025", sales: 42000, user: 51000 },
  { month: "February-2025", sales: 41000, user: 83000 },
  { month: "March-2025", sales: 23000, user: 13000 },
  { month: "April-2025", sales: 15000, user: 52000 },
  { month: "May-2025", sales: 98000, user: 21000 },
  { month: "June-2025", sales: 75000, user: 34000 },
  { month: "July-2025", sales: 3000, user: 26000 },
  { month: "August-2025", sales: 43000, user: 51000 },
  { month: "September-2025", sales: 41000, user: 81000 },
  { month: "October-2025", sales: 21000, user: 15000 },
];

export default function SalesAnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* সাইডবার এখানে যুক্ত করা হয়েছে */}
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        {/* টপবার এখানে যুক্ত করা হয়েছে */}
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Sales Analytics
          </h1>

          <div className="bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading text-xl font-bold">Users</h2>
              <div className="flex items-center gap-5 text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-signal" />
                  Sales
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-violet-accent" />
                  user
                </span>
              </div>
            </div>

            <div className="h-[460px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barGap={4}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={11} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    fontSize={11}
                    width={50}
                    tickFormatter={(v) => `${v / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid var(--border)", fontSize: 12 }}
                    formatter={(v: number) => v.toLocaleString()}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Bar dataKey="sales" name="Sales" fill="#0F8B8D" radius={[6, 6, 0, 0]} maxBarSize={28} />
                  <Bar dataKey="user" name="Users" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}