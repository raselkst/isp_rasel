"use client";

import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ClientActionModal, type ClientActionTab } from "@/components/clients/client-action-modal";
import { cn } from "@/lib/utils";

const tabs: { id: ClientActionTab; label: string; href: string }[] = [
  { id: "general-renew", label: "General Renew", href: "/admin/clients/general-renew" },
  { id: "view-information", label: "View Information", href: "/admin/clients/view-information" },
  { id: "client-search", label: "Client Search", href: "/admin/clients/client-search" },
  { id: "plan-migration", label: "Plan Migration", href: "/admin/clients/plan-migration" },
  { id: "online-renew", label: "Online Renew", href: "/admin/clients/online-renew" },
  { id: "client-date-extend", label: "Client Date Extend", href: "/admin/clients/client-date-extend" },
  { id: "special-renew", label: "Special Renew", href: "/clients/special-renew" },
];

export default function ViewInformationPage() {
  const activeTab: ClientActionTab = "view-information";

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-7">
          {/* Page Title */}
          <div className="mb-5">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-signal">
              Client Information
            </h1>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-5">
            {tabs.map((t) => (
              <Link
                key={t.id}
                href={t.href}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                  t.id === activeTab
                    ? "border-signal text-signal bg-signal-tint"
                    : "border-slate-200 text-slate-500 bg-white hover:border-signal/50 hover:text-signal"
                )}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* 3-Column Grid */}
          <ClientActionModal activeTab={activeTab} />
        </div>
      </div>
    </div>
  );
}