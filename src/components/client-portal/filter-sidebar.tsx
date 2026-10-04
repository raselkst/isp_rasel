"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FilterItem {
  label: string;
  count: string;
  colorClass: string; // e.g. "bg-success"
}

interface FilterSidebarProps {
  title: string;
  items: FilterItem[];
  banner?: ReactNode;
}

export function FilterSidebar({ title, items, banner }: FilterSidebarProps) {
  return (
    <div className="bg-card rounded-2xl border p-6 h-fit">
      <h3 className="font-heading font-bold text-lg mb-4">{title}</h3>

      {banner && <div className="mb-4">{banner}</div>}

      <div className="flex flex-col">
        {items.map((item, i) => (
          <div
            key={item.label}
            className={cn(
              "flex items-center justify-between py-2.5 text-sm",
              i !== items.length - 1 && "border-b border-border/70"
            )}
          >
            <span className="flex items-center gap-2.5 font-semibold">
              <span className={cn("w-2.5 h-2.5 rounded-full", item.colorClass)} />
              {item.label}
            </span>
            <span className="text-muted-foreground font-mono">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}