"use client";

import { UserRound, Signal, SignalZero, Ban, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Total Users",
    value: "700",
    change: "+12 this week",
    trend: "up",
    icon: UserRound,
    gradient: "from-violet-accent to-signal",
    textColor: "text-white",
  },
  {
    label: "Online Users",
    value: "500",
    change: "71% of total",
    trend: "up",
    icon: Signal,
    gradient: "from-emerald-500 to-emerald-600",
    textColor: "text-white",
  },
  {
    label: "Offline Users",
    value: "200",
    change: "28% of total",
    trend: "down",
    icon: SignalZero,
    gradient: "from-amber-500 to-amber-600",
    textColor: "text-white",
  },
  {
    label: "Blocked Users",
    value: "10",
    change: "1% of total",
    trend: "down",
    icon: Ban,
    gradient: "from-red-500 to-red-600",
    textColor: "text-white",
  },
];

export function PppoeStatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, index) => (
        <div
          key={s.label}
          className={cn(
            "relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
            s.gradient,
            s.textColor
          )}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-white/25 backdrop-blur-sm flex items-center justify-center">
                <s.icon className="h-5 w-5" />
              </div>
              <div
                className={cn(
                  "flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full",
                  s.trend === "up" ? "bg-white/20" : "bg-black/10"
                )}
              >
                {s.trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {s.change}
              </div>
            </div>
            <p className="text-sm font-semibold opacity-90">{s.label}</p>
            <p className="text-3xl font-heading font-bold">{s.value}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full border-4 border-white/10" />
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full border-4 border-white/5" />
        </div>
      ))}
    </div>
  );
}