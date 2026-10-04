"use client";

import { cn } from "@/lib/utils";

export function SignalBars({ dbm }: { dbm: number }) {
  // Rough ONU optical power → bar-strength mapping (closer to 0 is stronger).
  const strength = dbm > -20 ? 4 : dbm > -24 ? 3 : dbm > -27 ? 2 : 1;
  const color = strength >= 3 ? "bg-success" : strength === 2 ? "bg-caution" : "bg-destructive";

  return (
    <div className="flex items-end gap-1 h-5">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={cn("w-1.5 rounded-full", bar <= strength ? color : "bg-muted")}
          style={{ height: `${bar * 5}px` }}
        />
      ))}
    </div>
  );
}

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  action?: React.ReactNode;
  valueClass?: string;
}

export function InfoRow({ icon: Icon, label, value, action, valueClass }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="w-8 h-8 rounded-xl bg-signal-tint text-signal flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-muted-foreground leading-none mb-1">{label}</p>
        <p className={cn("text-sm font-semibold truncate", valueClass)}>{value}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function InfoCard({
  icon: Icon,
  title,
  action,
  children,
}: {
  icon: React.ElementType;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] bg-card border shadow-sm p-6">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-heading font-bold">{title}</h3>
        </div>
        {action}
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}