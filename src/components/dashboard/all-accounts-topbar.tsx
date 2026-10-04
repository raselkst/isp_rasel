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
  { label: "All Accounts", href: "/admin/billing/all-accounts", icon: Clock, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/30" },
  { label: "Todays Client", href: "/admin/billing/todays-client", icon: Clock, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/30" },
  { label: "Active Accounts", href: "/admin/billing/active-accounts", icon: UserCheck, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/30" },
  { label: "Left Accounts", href: "/admin/billing/left-accounts", icon: UserMinus, gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/30" },
  { label: "Expire In 3 Days", href: "/admin/billing/expire-3-days", icon: AlertTriangle, gradient: "from-yellow-500 to-orange-500", shadow: "shadow-yellow-500/30" },
  { label: "Expire In 7 Days", href: "/admin/billing/expire-7-days", icon: CalendarX, gradient: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/30" },
  { label: "Expired Accounts", href: "/admin/billing/expired-accounts", icon: CalendarX, gradient: "from-red-500 to-rose-600", shadow: "shadow-red-500/30" },
  { label: "Pending Accounts", href: "/admin/billing/pending-accounts", icon: Clock, gradient: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/30" },
  { label: "Suspend Accounts", href: "/admin/billing/suspend-accounts", icon: PauseCircle, gradient: "from-slate-500 to-gray-600", shadow: "shadow-slate-500/30" },
];

export function AllAccountsTopbar() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
      <div className="px-4 sm:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
        {quickActions.map((action) => {
          const isActive = pathname === action.href;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap overflow-hidden shrink-0",
                isActive
                  ? `bg-gradient-to-r ${action.gradient} text-white shadow-lg ${action.shadow} scale-105`
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-transparent hover:shadow-md"
              )}
            >
              {!isActive && (
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-r",
                  action.gradient
                )} />
              )}
              
              <action.icon className={cn("h-4 w-4 relative z-10", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="relative z-10">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}