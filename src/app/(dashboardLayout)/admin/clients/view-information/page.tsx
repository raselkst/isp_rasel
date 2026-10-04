"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ClientActionModal } from "@/components/clients/client-action-modal";

export default function ViewInformationPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />
      </div>
      <ClientActionModal activeTab="view-information" />
    </div>
  );
}