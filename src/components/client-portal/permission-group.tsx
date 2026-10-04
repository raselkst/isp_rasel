"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PermissionGroupProps {
  title: string;
  accentClass: string; // e.g. "bg-signal", "bg-violet-accent"
  items: string[];
}

export function PermissionGroup({ title, accentClass, items }: PermissionGroupProps) {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i, true]))
  );

  const toggle = (item: string) =>
    setChecked((c) => ({ ...c, [item]: !c[item] }));

  return (
    <div className="bg-muted/40 rounded-2xl p-6 border">
      <h3 className="font-heading font-bold text-lg mb-4">{title}</h3>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <label
            key={item}
            className={cn(
              "flex items-center gap-3 py-2.5 cursor-pointer text-sm",
              i !== items.length - 1 && "border-b border-border/70"
            )}
          >
            <span
              onClick={(e) => {
                e.preventDefault();
                toggle(item);
              }}
              className={cn(
                "w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors",
                checked[item] ? accentClass : "bg-background border"
              )}
            >
              {checked[item] && <Check className="h-3.5 w-3.5 text-white" />}
            </span>
            <span className={checked[item] ? "text-foreground" : "text-muted-foreground"}>
              {item}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}