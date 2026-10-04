"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface PlanCardProps {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  onSelect?: () => void;
}

export function PlanCard({
  name,
  price,
  features,
  highlighted = false,
  ctaLabel = "Buy Now",
  onSelect,
}: PlanCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 flex flex-col bg-card transition-shadow",
        highlighted ? "border-signal shadow-lg shadow-signal/10 relative" : "border-border"
      )}
    >
      {highlighted && (
        <span className="absolute -top-3 left-6 bg-signal text-signal-foreground text-[11px] font-bold px-3 py-1 rounded-full">
          Most Popular
        </span>
      )}
      <h3 className="font-heading font-bold text-lg mb-2">{name}</h3>
      <div className="mb-5">
        <span className="font-heading text-3xl font-bold text-signal">{price}</span>
        <span className="text-muted-foreground text-sm">/month</span>
      </div>
      <ul className="space-y-2.5 mb-6 flex-1">
        {features.map((f) => {
          const unavailable = f.toLowerCase().includes("not available");
          return (
            <li
              key={f}
              className={cn(
                "flex items-start gap-2 text-[13px]",
                unavailable ? "text-muted-foreground/60" : "text-foreground"
              )}
            >
              <Check
                className={cn(
                  "h-4 w-4 mt-0.5 shrink-0",
                  unavailable ? "text-muted-foreground/40" : "text-success"
                )}
              />
              {f}
            </li>
          );
        })}
      </ul>
      <button
        onClick={onSelect}
        className={cn(
          "w-full rounded-full py-2.5 text-sm font-semibold border transition-colors",
          highlighted
            ? "bg-signal text-signal-foreground border-signal hover:opacity-90"
            : "border-signal text-signal hover:bg-signal-tint"
        )}
      >
        {ctaLabel}
      </button>
    </div>
  );
}