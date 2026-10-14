"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Landmark, Users, BadgeDollarSign } from "lucide-react";

const quickActions = [
  {
    label: "Sub Zone Payment",
    href: "/admin/zone/sub-zone-payment",
    icon: Landmark,
  },
  {
    label: "Sub-Zone Customer Summary",
    href: "/admin/zone/sub-zone-customer-summary",
    icon: Users,
  },
  {
    label: "Sub-Zone Rate",
    href: "/admin/zone/sub-zone-rate",
    icon: BadgeDollarSign,
  },
];

export function ListSubZoneTopbar() {
  const pathname = usePathname();

  return (
    <div
      className="sticky top-[64px] z-30 border-b border-slate-200"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="px-4 sm:px-8 py-3.5 flex items-center gap-3 overflow-x-auto scrollbar-none">
        {quickActions.map((action) => {
          const isActive = pathname === action.href;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap overflow-hidden shrink-0 border",
                isActive
                  ? "bg-signal text-signal-foreground border-signal shadow-md scale-105"
                  : "bg-white text-slate-500 border-slate-200 hover:text-signal hover:bg-signal-tint hover:border-signal/30"
              )}
            >
              {/* Hover Tint Layer (only when not active) */}
              {!isActive && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-signal-tint" />
              )}

              <action.icon className="h-5 w-5 relative z-10" />
              <span className="relative z-10">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}