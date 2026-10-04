"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StatCardItem {
  label: string;
  value: string;
  icon: LucideIcon;
  hero?: boolean;
  iconBg?: string; // used for non-hero cards, e.g. "bg-pink-100 text-pink-600"
}

export function StatCardsRow({ items }: { items: StatCardItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">
      {items.map((c) => (
        <div
          key={c.label}
          className={cn(
            "rounded-2xl p-5 relative overflow-hidden flex items-center gap-4",
            c.hero ? "bg-gradient-to-br from-signal to-violet-accent text-white" : "bg-card border"
          )}
        >
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
              c.hero ? "bg-white/20" : c.iconBg ?? "bg-signal-tint text-signal"
            )}
          >
            <c.icon className={cn("h-5 w-5", c.hero && "text-white")} />
          </div>
          <div>
            <div className={cn("text-sm font-semibold", c.hero ? "text-white/90" : "text-muted-foreground")}>
              {c.label}
            </div>
            <div className="font-heading text-2xl font-bold mt-0.5">{c.value}</div>
          </div>

          {/* decorative rings */}
          <div
            className={cn(
              "absolute -right-6 -bottom-6 w-28 h-28 rounded-full border-2",
              c.hero ? "border-white/20" : "border-muted"
            )}
          />
        </div>
      ))}
    </div>
  );
}