"use client";

import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", sales: 450, users: 560 },
  { month: "Feb", sales: 420, users: 880 },
  { month: "Mar", sales: 220, users: 140 },
  { month: "Apr", sales: 160, users: 520 },
  { month: "May", sales: 1000, users: 300 },
  { month: "Jun", sales: 780, users: 360 },
  { month: "Jul", sales: 60, users: 180 },
];

export function SalesChart() {
  return (
    <Card className="rounded-2xl p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4.5 pt-4 pb-3 border-b">
        <h3 className="font-heading font-semibold text-sm">Sales Analytics</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-teal-600 inline-block" />
            Sales
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm bg-violet-500 inline-block" />
            Users
          </span>
        </div>
      </div>
      <div className="h-[240px] px-2 py-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={4}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              fontSize={11}
            />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={36} />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                borderRadius: 10,
                border: "1px solid var(--border)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="sales" fill="#0F8B8D" radius={[4, 4, 0, 0]} maxBarSize={16} />
            <Bar dataKey="users" fill="#a78bfa" radius={[4, 4, 0, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}