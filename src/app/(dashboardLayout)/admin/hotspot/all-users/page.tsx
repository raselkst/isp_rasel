"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { HotspotStatCards } from "@/components/hotspot/stat-cards";
import { HotspotClientListTable } from "@/components/hotspot/client-list-table";

export default function HotspotAllUsersPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Hotspot All Users
          </h1>
          <HotspotStatCards />
          <HotspotClientListTable />
        </div>
      </div>
    </div>
  );
}