"use client";

import { cn } from "@/lib/utils";

export function DarkTableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  );
}

export function DarkTableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="border-b border-white/10">
        {columns.map((c) => (
          <th
            key={c}
            className="text-left px-6 py-4 font-semibold text-xs tracking-wide uppercase text-white/40 whitespace-nowrap"
          >
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function StatusChip({ tone, children }: { tone: "success" | "caution" | "destructive" | "signal"; children: React.ReactNode }) {
  const toneMap = {
    success: "bg-success/15 text-success",
    caution: "bg-caution/15 text-caution",
    destructive: "bg-destructive/15 text-destructive",
    signal: "bg-signal/15 text-signal",
  };
  return (
    <span className={cn("px-3 py-1 rounded-full text-xs font-bold inline-block", toneMap[tone])}>
      {children}
    </span>
  );
}

export function PageTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-1">{eyebrow}</p>
        <h1 className="font-heading text-2xl font-bold text-white">{title}</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}