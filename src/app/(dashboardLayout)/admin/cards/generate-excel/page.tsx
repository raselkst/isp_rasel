"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { CardGeneratorExcelModal } from "@/components/cards/card-generator-excel-modal";

export default function CardGenerateExcelPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className="flex-1 min-w-0">
        <DashboardTopbar />
      </div>
      <CardGeneratorExcelModal
        open={open}
        onClose={() => {
          setOpen(false);
          router.back();
        }}
        onSubmit={() => {
          // handle generate from excel
        }}
      />
    </div>
  );
}