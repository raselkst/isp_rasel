"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Clock,
  UserCheck,
  UserMinus,
  AlertTriangle,
  CalendarX,
  PauseCircle,
} from "lucide-react";

const quickActions = [
  { label: "All Accounts", href: "/admin/billing/all-accounts", icon: Clock },
  { label: "Todays Client", href: "/admin/billing/todays-client", icon: Clock },
  { label: "Active Accounts", href: "/admin/billing/active-accounts", icon: UserCheck },
  { label: "Left Accounts", href: "/admin/billing/left-accounts", icon: UserMinus },
  { label: "Expire In 3 Days", href: "/admin/billing/expire-3-days", icon: AlertTriangle },
  { label: "Expire In 7 Days", href: "/admin/billing/expire-7-days", icon: CalendarX },
  { label: "Expired Accounts", href: "/admin/billing/expired-accounts", icon: CalendarX },
  { label: "Pending Accounts", href: "/admin/billing/pending-accounts", icon: Clock },
  { label: "Suspend Accounts", href: "/admin/billing/suspend-accounts", icon: PauseCircle },
];

export function AllAccountsTopbar() {
  const pathname = usePathname();

  return (
    <div
      className="sticky top-[64px] z-30 border-b border-slate-200"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="px-4 sm:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {quickActions.map((action) => {
          const isActive = pathname === action.href;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap overflow-hidden shrink-0 border",
                isActive
                  ? "bg-signal text-signal-foreground border-signal shadow-md scale-105"
                  : "bg-white text-slate-500 border-slate-200 hover:text-signal hover:bg-signal-tint hover:border-signal/30"
              )}
            >
              {!isActive && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-signal-tint pointer-events-none" />
              )}
              <action.icon className="h-4 w-4 relative z-10" />
              <span className="relative z-10">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}