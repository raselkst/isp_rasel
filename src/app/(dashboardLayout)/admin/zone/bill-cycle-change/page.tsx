"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
      <span className="font-semibold text-sm w-40 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function ZoneBillCycleChangePage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-3xl">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-5">
            Change Bill Cycle
          </h1>

          <div className="bg-signal text-signal-foreground text-center py-3.5 rounded-t-2xl font-heading font-bold text-lg">
            Bill Cycle Info
          </div>

          <div className="bg-card rounded-b-2xl border border-t-0 p-6 sm:p-8 space-y-6">
            <Field label="Current Bill Cycle:">
              <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm font-semibold">
                <option>Mst Tanzima Haque</option>
              </select>
            </Field>
            <Field label="*New Bill Cycle:">
              <Input defaultValue="183369" className="rounded-xl border-signal ring-1 ring-signal/30 font-semibold" />
            </Field>

            <div className="flex gap-3 pt-2 max-w-md ml-auto">
              <Button variant="outline" className="flex-1 rounded-full font-semibold">
                Cancel
              </Button>
              <Button className="flex-1 rounded-full font-semibold">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}