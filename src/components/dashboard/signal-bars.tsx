"use client";

import { cn } from "@/lib/utils";

interface SignalBarsProps {
  levels: number[]; // 0-100 heights
  activeCount: number; // how many bars are "lit"
  colorClass?: string; // tailwind color class for the lit bars
  className?: string;
}

export function SignalBars({
  levels,
  activeCount,
  colorClass = "bg-teal-600",
  className,
}: SignalBarsProps) {
  return (
    <div className={cn("flex items-end gap-[3px] h-7", className)}>
      {levels.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-sm",
            i < activeCount ? colorClass : "bg-border"
          )}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}