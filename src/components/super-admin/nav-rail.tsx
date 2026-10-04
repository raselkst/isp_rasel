"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Building2,
  Wallet,
  Radio,
  ShieldAlert,
  Users,
  Settings,
  LifeBuoy,
  Sparkles,
} from "lucide-react";

const navItems = [
  { icon: LayoutGrid, label: "Overview", href: "/super-admin" },
  { icon: Building2, label: "Resellers", href: "/super-admin/resellers" },
  { icon: Wallet, label: "Revenue", href: "/super-admin/revenue" },
  { icon: Radio, label: "Network", href: "/super-admin/network" },
  { icon: ShieldAlert, label: "Risk & Alerts", href: "/super-admin/alerts" },
  { icon: Users, label: "Admins", href: "/super-admin/admins" },
  { icon: LifeBuoy, label: "Support", href: "/super-admin/support" },
  { icon: Settings, label: "System", href: "/super-admin/system" },
];

export function NavRail() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[84px] shrink-0 flex-col items-center py-6 bg-[#0a0d16] border-r border-white/5">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center mb-8 shadow-lg shadow-signal/30">
        <Sparkles className="h-5 w-5 text-white" />
      </div>

      <nav className="flex-1 flex flex-col gap-2">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              title={item.label}
              className={cn(
                "relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all group",
                active
                  ? "bg-gradient-to-br from-signal to-violet-accent text-white shadow-lg shadow-signal/30"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon className="h-5 w-5" />
              {active && (
                <span className="absolute -left-[13px] top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-gradient-to-b from-signal to-violet-accent" />
              )}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-[#151a29] px-3 py-1.5 text-xs font-semibold text-white opacity-0 shadow-xl group-hover:opacity-100 transition-opacity z-20">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-accent to-signal flex items-center justify-center text-xs font-bold text-white mt-4">
        SA
      </div>
    </aside>
  );
}