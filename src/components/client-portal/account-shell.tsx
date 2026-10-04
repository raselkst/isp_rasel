"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { ChevronDown, CreditCard, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const accountNav = [
  { label: "My Details", href: "/account/details" },
  { label: "User Management", href: "/account/users" },
  { label: "Payment Methods", href: "/account/payment-methods" },
  { label: "Contacts", href: "/account/contacts" },
  { label: "Account Security", href: "/account/security" },
  { label: "Email History", href: "/account/email-history" },
];

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AccountShellProps {
  breadcrumbs: Breadcrumb[];
  children: ReactNode;
}

export function AccountShell({ breadcrumbs, children }: AccountShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 pt-4 pb-2 flex items-center gap-2 text-sm">
        {breadcrumbs.map((b, i) => (
          <span key={i} className="flex items-center gap-2">
            {b.href ? (
              <Link href={b.href} className="text-signal font-semibold hover:underline">
                {b.label}
              </Link>
            ) : (
              <span className="font-semibold">{b.label}</span>
            )}
            {i !== breadcrumbs.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </span>
        ))}
      </div>

      <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6 items-start">
        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 bg-muted/40">
            <span className="flex items-center gap-2 font-heading font-bold">
              <CreditCard className="h-4 w-4" />
              Account
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex flex-col">
            {accountNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-5 py-3 text-sm font-semibold border-t transition-colors",
                  pathname === item.href
                    ? "bg-signal-tint text-signal"
                    : "text-foreground hover:bg-muted/40"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl border p-8">{children}</div>
      </div>
    </div>
  );
}