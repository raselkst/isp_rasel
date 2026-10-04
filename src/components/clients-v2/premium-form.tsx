"use client";

import { cn } from "@/lib/utils";

export function FormShell({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: React.ElementType;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide uppercase text-signal">{eyebrow}</p>
          <h1 className="font-heading text-xl font-bold">{title}</h1>
        </div>
      </div>
      {children}
    </div>
  );
}

export function FormSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[28px] bg-card border shadow-sm p-6 sm:p-7 mb-5">
      {title && <h2 className="font-heading font-bold mb-5">{title}</h2>}
      {children}
    </div>
  );
}

export function ReadonlyField({ label, value, tone }: { label: string; value: React.ReactNode; tone?: "signal" | "success" }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      <p
        className={cn(
          "text-sm font-semibold",
          tone === "signal" && "text-signal",
          tone === "success" && "text-success"
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function EditableField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-semibold block">
        {required && <span className="text-signal">*</span>}
        {label}
      </span>
      {children}
    </div>
  );
}

export const premiumInput =
  "w-full border border-border/70 rounded-2xl px-4 py-2.5 bg-muted/30 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card";