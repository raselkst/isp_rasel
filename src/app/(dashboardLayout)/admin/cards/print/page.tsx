"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { CardPrintModal } from "@/components/cards/card-print-modal";

export default function CardPrintPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />
      </div>
      <CardPrintModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.back();
        }}
        onSubmit={() => {
          // handle print
        }}
      />
    </div>
  );
}