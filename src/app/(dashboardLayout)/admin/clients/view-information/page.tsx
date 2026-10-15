"use client";

import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { ClientActionModal } from "@/components/clients/client-action-modal";

export default function ViewInformationPage() {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("clientId");
    setClientId(id);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <ClientActionModal activeTab="view-information" initialClientId={clientId} />
      </div>
    </div>
  );
}