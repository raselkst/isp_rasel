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
    gradient: "from-orange-500 to-amber-500",
    shadow: "shadow-orange-500/30"
  },
  { 
    label: "Sub-Zone Customer Summary", 
    href: "/admin/zone/sub-zone-customer-summary", 
    icon: Users,
    gradient: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/30"
  },
  { 
    label: "Sub-Zone Rate", 
    href: "/admin/zone/sub-zone-rate", 
    icon: BadgeDollarSign,
    gradient: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/30"
  },
];

export function ListSubZoneTopbar() {
  const pathname = usePathname();

  return (
    <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
      <div className="px-4 sm:px-8 py-3.5 flex items-center gap-3 overflow-x-auto scrollbar-none">
        {quickActions.map((action) => {
          const isActive = pathname === action.href;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                "group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 whitespace-nowrap overflow-hidden shrink-0",
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
              
              <action.icon className={cn("h-5 w-5 relative z-10", isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground")} />
              <span className="relative z-10">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}