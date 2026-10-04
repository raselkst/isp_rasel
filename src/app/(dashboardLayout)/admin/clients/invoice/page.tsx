"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Printer, Download, Mail } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-6">
      <span className="font-semibold text-sm w-32 shrink-0">{label}</span>
      {children}
    </div>
  );
}

export default function InvoiceSearchPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight text-center mb-10">
            Home Customer Invoice
          </h1>

          <div className="max-w-2xl mx-auto space-y-6">
            <Field label="Invoice for:">
              <div className="flex gap-3 flex-1">
                <select className="flex-1 border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                  <option>August</option>
                </select>
                <select className="flex-1 border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                  <option>2025</option>
                </select>
              </div>
            </Field>

            <Field label="Customer Name">
              <div className="flex items-center gap-3 flex-1">
                <Input defaultValue="Liton" className="rounded-xl border-signal ring-1 ring-signal/30 font-semibold" />
                <Button size="icon" className="rounded-xl shrink-0">
                  <Printer className="h-4 w-4" />
                </Button>
                <Button size="icon" className="rounded-xl shrink-0">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="icon" className="rounded-xl shrink-0">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
}