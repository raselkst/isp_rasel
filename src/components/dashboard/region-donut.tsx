"use client";

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Dhaka", value: 50, color: "#0F8B8D" },
  { name: "Rajshahi", value: 20, color: "#8B5CF6" },
  { name: "Sylhet", value: 25, color: "#FB7150" },
  { name: "Chattogram", value: 10, color: "#C98A1F" },
];

export function RegionDonut() {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <Card className="rounded-2xl p-0 overflow-hidden">
      <div className="px-4.5 pt-4 pb-3 border-b">
        <h3 className="font-heading font-semibold text-sm">Profit by Region</h3>
      </div>
      <div className="flex flex-col items-center gap-4 px-4.5 py-5">
        <div className="relative h-[150px] w-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={48}
                outerRadius={68}
                paddingAngle={3}
                strokeWidth={0}
              >
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-lg font-bold">{total}%</span>
            <span className="text-[10px] text-muted-foreground">clients</span>
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center justify-between text-[12.5px]">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="w-2 h-2 rounded-sm inline-block"
                  style={{ background: d.color }}
                />
                {d.name}
              </span>
              <span className="font-mono">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}