"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Ticket, UserCheck, FolderOpen, Archive, Plus } from "lucide-react";

const quickActions = [
  { label: "All Tickets", href: "/admin/ticketing", icon: Ticket },
  { label: "My Assigned", href: "/admin/ticketing/my-assigned", icon: UserCheck },
  { label: "Open Tickets", href: "/admin/ticketing/open-tickets", icon: FolderOpen },
  { label: "Old Tickets", href: "/admin/ticketing/old-tickets", icon: Archive },
];

export function TicketingTopbar({ onCreate }: { onCreate?: () => void }) {
  const pathname = usePathname();

  return (
    <div
      className="sticky top-[64px] z-30 border-b border-slate-200"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2">
          {quickActions.map((action) => {
            const isActive = pathname === action.href;
            return (
              <Link
                key={action.href}
                href={action.href}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap overflow-hidden shrink-0 border",
                  isActive
                    ? "bg-signal text-white border-signal shadow-md scale-105"
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

        {onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Ticket
          </button>
        )}
      </div>
    </div>
  );
}