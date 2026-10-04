"use client";

import { cn } from "@/lib/utils";

export function QuickAction({
  icon: Icon,
  label,
  tone = "light",
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  tone?: "light" | "danger";
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-1.5 shrink-0"
      title={label}
    >
      <span
        className={cn(
          "w-11 h-11 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-0.5 group-hover:shadow-lg",
          tone === "danger" ? "bg-white/15 text-white group-hover:bg-destructive" : "bg-white/15 text-white group-hover:bg-white group-hover:text-signal"
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="text-[10px] font-semibold text-white/80 whitespace-nowrap">{label}</span>
    </button>
  );
}