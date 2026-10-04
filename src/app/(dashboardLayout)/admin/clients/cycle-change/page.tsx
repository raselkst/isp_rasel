"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const columns = [
  "Cust ID",
  "Username",
  "Package",
  "Rate",
  "Bill For",
  "Charge Amt",
  "OLD Expiry Date",
  "New Expiry Date",
  "Z. Rate",
  "ZONE Charge",
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
      <span className="font-semibold text-sm w-56 shrink-0">{label}</span>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default function CycleChangePage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Cycle Change
          </h1>

          <div className="bg-card rounded-2xl border overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    {columns.map((c) => (
                      <th key={c} className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-5 py-4">10102</td>
                    <td className="px-5 py-4">kbn.shantoB</td>
                    <td className="px-5 py-4">12Mbps_Package</td>
                    <td className="px-5 py-4">588.0</td>
                    <td className="px-5 py-4">2 days</td>
                    <td className="px-5 py-4">38</td>
                    <td className="px-5 py-4 whitespace-nowrap">24/08/2025</td>
                    <td className="px-5 py-4 whitespace-nowrap">26/08/2025</td>
                    <td className="px-5 py-4">0</td>
                    <td className="px-5 py-4">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-t font-bold text-sm">
              <span>Total:</span>
              <span>38</span>
              <span className="text-transparent">·</span>
              <span>0</span>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t text-sm font-semibold">
              <span>Zone Balance:</span>
              <span>0</span>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t text-sm font-semibold">
              <span>Zone Balance Left:</span>
              <span>0</span>
            </div>
          </div>

          <div className="max-w-2xl space-y-5">
            <Field label="Payment Method:">
              <select className="w-full border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                <option>CASH</option>
              </select>
            </Field>
            <Field label="Amount Received From Client:">
              <Input defaultValue="38" className="rounded-xl bg-muted/40" />
            </Field>
            <Field label="Received By:">
              <select className="w-full border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                <option>ID-24-Afi cable network [ACN] (Cash/Bank)</option>
              </select>
            </Field>
            <Field label="Remarks:">
              <textarea className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm min-h-[70px]" />
            </Field>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-full font-semibold">
                Cancel
              </Button>
              <Button className="flex-1 rounded-full font-semibold">Save</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}