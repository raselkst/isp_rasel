"use client";

import { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";

interface ZoneFormShellProps {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}

export function ZoneFormShell({ title, children, footer }: ZoneFormShellProps) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-8 py-7">
          <div className="rounded-2xl overflow-hidden border">
            <div className="bg-signal text-signal-foreground text-center py-4">
              <h1 className="font-heading text-2xl font-bold">{title}</h1>
            </div>

            <div className="bg-card p-10">
              <div className="max-w-3xl space-y-7">{children}</div>

              <div className="flex gap-4 mt-9">{footer}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ZoneFieldRowProps {
  label: string;
  children: ReactNode;
}

export function ZoneFieldRow({ label, children }: ZoneFieldRowProps) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-center gap-6">
      <label className="font-heading font-bold text-lg">{label}</label>
      {children}
    </div>
  );
}