"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════
// Premium Card — Theme Connected
// ═══════════════════════════════════════════════════════════
export function PremiumCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Premium Table Head — Theme Connected
// ═══════════════════════════════════════════════════════════
export function PremiumTableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="bg-signal text-white">
        {columns.map((c) => (
          <th key={c} className="text-left px-6 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ═══════════════════════════════════════════════════════════
// Premium Pagination — Theme Connected
// ═══════════════════════════════════════════════════════════
export function PremiumPagination({ shown = "1-25 of 100 items" }: { shown?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 text-sm text-slate-500">
      <div className="flex items-center gap-2">
        <span>Items per page:</span>
        <select className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-signal">
          <option>25</option>
        </select>
        <span>{shown}</span>
      </div>
      <div className="flex items-center gap-2">
        <select className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-signal">
          <option>12</option>
        </select>
        <span>of 40 pages</span>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-slate-200 text-slate-500 hover:bg-slate-50">
          ‹
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8 border-slate-200 text-slate-500 hover:bg-slate-50">
          ›
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Status Pill — Theme Connected
// ═══════════════════════════════════════════════════════════
export function StatusPill({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-bold border",
        active
          ? "bg-success-tint text-success border-success/30"
          : "bg-destructive/10 text-destructive border-destructive/30"
      )}
    >
      {active ? "Active" : "Disable"}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
// Page Header — Theme Connected
// ═══════════════════════════════════════════════════════════
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
        <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
          {eyebrow}
        </p>
        <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
          {title}
        </h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Gradient Button Class — Theme Connected (এখন সলিড Teal)
// ═══════════════════════════════════════════════════════════
export const gradientBtn =
  "rounded-full gap-1.5 font-semibold h-11 px-5 bg-signal text-white hover:bg-signal-hover border-0 shadow-md";

// ═══════════════════════════════════════════════════════════
// Field — Theme Connected
// ═══════════════════════════════════════════════════════════
export function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block text-signal">
        {required && <span className="text-destructive">*</span>}
        {label}
      </span>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Input Class — Theme Connected
// ═══════════════════════════════════════════════════════════
export const inputClass =
  "w-full border border-slate-200 rounded-2xl px-4 py-3 bg-white text-sm text-signal outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10";