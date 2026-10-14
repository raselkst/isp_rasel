"use client";

import { UserRound, Wifi, WifiOff, Ban, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total",
    value: "700",
    change: "+18",
    trend: "up",
    icon: UserRound,
    gradientClass: "bg-gradient-to-br from-signal to-signal-light",
  },
  {
    label: "Online",
    value: "512",
    change: "73%",
    trend: "up",
    icon: Wifi,
    gradientClass: "bg-gradient-to-br from-success to-success/80",
  },
  {
    label: "Offline",
    value: "188",
    change: "27%",
    trend: "down",
    icon: WifiOff,
    gradientClass: "bg-gradient-to-br from-warning to-warning/80",
  },
  {
    label: "Blocked",
    value: "10",
    change: "1%",
    trend: "down",
    icon: Ban,
    gradientClass: "bg-gradient-to-br from-destructive to-destructive/80",
  },
];

export function HotspotStatCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className={cn(
            "relative overflow-hidden rounded-xl p-3 flex items-center gap-3 shadow-md text-white",
            s.gradientClass
          )}
        >
          <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
            <s.icon className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2 min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">{s.label}</p>
            <p className="text-lg font-heading font-bold">{s.value}</p>
          </div>
          <span
            className={cn(
              "flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0",
              s.trend === "up" ? "bg-white/25" : "bg-black/20"
            )}
          >
            {s.trend === "up" ? (
              <TrendingUp className="w-2.5 h-2.5" />
            ) : (
              <TrendingDown className="w-2.5 h-2.5" />
            )}
            {s.change}
          </span>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full border-2 border-white/10" />
        </div>
      ))}
    </div>
  );
}