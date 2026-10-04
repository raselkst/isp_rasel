"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { PppoeStatCards } from "@/components/pppoe/stat-cards";
import { PppoeClientListTable } from "@/components/pppoe/client-list-table";

export default function PppoeOfflineUsersPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Pppoe overview
          </h1>
          <PppoeStatCards />
          <PppoeClientListTable dotColor="bg-destructive" />
        </div>
      </div>
    </div>
  );
}