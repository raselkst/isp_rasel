"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Ticket, UserCheck, FolderOpen, Archive, Plus } from "lucide-react";

const quickActions = [
  { label: "All Tickets", href: "/admin/ticketing", icon: Ticket, gradient: "from-blue-500 to-cyan-500", shadow: "shadow-blue-500/30" },
  { label: "My Assigned", href: "/admin/ticketing/my-assigned", icon: UserCheck, gradient: "from-violet-500 to-purple-500", shadow: "shadow-violet-500/30" },
  { label: "Open Tickets", href: "/admin/ticketing/open-tickets", icon: FolderOpen, gradient: "from-emerald-500 to-teal-500", shadow: "shadow-emerald-500/30" },
  { label: "Old Tickets", href: "/admin/ticketing/old-tickets", icon: Archive, gradient: "from-orange-500 to-amber-500", shadow: "shadow-orange-500/30" },
];

export function TicketingTopbar({ onCreate }: { onCreate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
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

        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        )}
      </div>
    </div>
  );
}