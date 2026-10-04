"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/client" },
  { label: "Services", href: "/client/services", hasDropdown: true },
  { label: "Billing", href: "/client/billing", hasDropdown: true },
  { label: "Support", href: "/client/support", hasDropdown: true },
  { label: "Open Ticket", href: "/client/open-ticket" },
];

export function ClientTopbar() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-card sticky top-0 z-20">
      <div className="flex items-center justify-between px-8 h-16">
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 mr-8">
            <div className="w-8 h-8 rounded-[9px] bg-signal flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3C7 3 3 6.5 3 11c0 3 2 5.5 4.5 6.8L12 21l4.5-3.2C19 16.5 21 14 21 11c0-4.5-4-8-9-8z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="text-signal-foreground"
                />
                <circle cx="12" cy="10" r="2.2" fill="currentColor" className="text-signal-foreground" />
              </svg>
            </div>
            <span className="font-heading font-bold text-[15px]">ISP Cloud</span>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const active = item.href === "/client" ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-semibold tracking-wide uppercase transition-colors",
                    active ? "text-signal" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {item.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm font-semibold">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-signal to-violet-accent" />
            Sanwar Hos Ain
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <Button className="rounded-full font-semibold bg-gradient-to-r from-signal to-violet-accent border-none">
            + Create New
          </Button>
        </div>
      </div>
    </header>
  );
}