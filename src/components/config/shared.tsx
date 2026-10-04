"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PremiumCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 overflow-hidden">{children}</div>;
}

export function PremiumTableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
        {columns.map((c) => (
          <th key={c} className="text-left px-6 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function PremiumPagination({ shown = "1-25 of 100 items" }: { shown?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Items per page:</span>
        <select className="border rounded-lg px-2 py-1 bg-background">
          <option>25</option>
        </select>
        <span>{shown}</span>
      </div>
      <div className="flex items-center gap-2">
        <select className="border rounded-lg px-2 py-1 bg-background">
          <option>12</option>
        </select>
        <span>of 40 pages</span>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
          ‹
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
          ›
        </Button>
      </div>
    </div>
  );
}

export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-bold",
        active ? "bg-success text-white" : "bg-destructive/70 text-white"
      )}
    >
      {active ? "Active" : "Disable"}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
      <div>
        <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">{eyebrow}</p>
        <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
          {title}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export const gradientBtn =
  "rounded-full gap-1.5 font-semibold h-11 px-5 bg-gradient-to-r from-signal to-violet-accent border-0 shadow-lg shadow-signal/20";

export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block">
        {required && <span className="text-signal">*</span>}
        {label}
      </span>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full border border-border/70 rounded-2xl px-4 py-3 bg-muted/30 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card";