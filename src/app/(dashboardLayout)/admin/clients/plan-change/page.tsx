"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <span className="font-semibold text-sm block">{label}</span>
      {children}
    </div>
  );
}

export default function PlanChangePage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-4xl">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Plan Change
          </h1>

          <div className="bg-card rounded-2xl border overflow-hidden mb-8">
            <div className="bg-signal text-signal-foreground text-center py-3.5 font-heading font-bold text-lg">
              Customer Details
            </div>
            <div className="p-6 sm:p-8 space-y-5">
              <Field label="Customer Name:">
                <Input defaultValue="Md Milan" className="rounded-xl border-signal ring-1 ring-signal/30 font-semibold" />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Customer ID:">
                  <Input defaultValue="10158" readOnly className="rounded-xl bg-muted/40 font-semibold" />
                </Field>
                <Field label="UserName:">
                  <Input defaultValue="576378" readOnly className="rounded-xl bg-muted/40 font-semibold" />
                </Field>
                <Field label="Expiry Status:">
                  <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm font-semibold text-signal">
                    <option>Active</option>
                  </select>
                </Field>
                <Field label="Expiry Date:">
                  <Input defaultValue="2025-07-23" readOnly className="rounded-xl bg-muted/40 font-semibold" />
                </Field>
                <Field label="New Package:">
                  <Input defaultValue="12_Mbps_Package" readOnly className="rounded-xl bg-muted/40 font-semibold" />
                </Field>
                <Field label="Old Package:">
                  <Input defaultValue="10_Mbps_Package" readOnly className="rounded-xl bg-muted/40 font-semibold" />
                </Field>
              </div>
            </div>
          </div>

          <h2 className="font-heading text-xl font-bold text-center mb-5">Plan Comparison Table</h2>
          <div className="bg-card rounded-2xl border overflow-hidden mb-10 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  <th className="text-left px-5 py-4 font-semibold">Description</th>
                  <th className="text-center px-5 py-4 font-semibold" colSpan={2}>
                    Monthly Bill [Customer]
                  </th>
                  <th className="text-center px-5 py-4 font-semibold" colSpan={2}>
                    Monthly Bill [Sub-Zone]
                  </th>
                </tr>
                <tr className="border-t text-xs font-semibold text-muted-foreground">
                  <th className="text-left px-5 py-2">Packages</th>
                  <th className="text-center px-5 py-2">Old Packages</th>
                  <th className="text-center px-5 py-2">New Packages</th>
                  <th className="text-center px-5 py-2">Old Packages</th>
                  <th className="text-center px-5 py-2">New Packages</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-5 py-4 font-bold">Bills</td>
                  <td className="px-5 py-4 text-center">490.00</td>
                  <td className="px-5 py-4 text-center">588.00</td>
                  <td className="px-5 py-4 text-center">50.00</td>
                  <td className="px-5 py-4 text-center">50.00</td>
                </tr>
                <tr className="border-t">
                  <td className="px-5 py-4 text-signal font-semibold">Total Bill for 0 Month 29 Days</td>
                  <td className="px-5 py-4 text-center text-signal font-semibold">458.39</td>
                  <td className="px-5 py-4 text-center text-signal font-semibold">550.06</td>
                  <td className="px-5 py-4 text-center text-signal font-semibold">46.77</td>
                  <td className="px-5 py-4 text-center text-signal font-semibold">46.77</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="font-heading text-xl font-bold text-center mb-5">Plan Summary</h2>
          <div className="bg-card rounded-2xl border overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  <th className="text-left px-6 py-4 font-semibold">Description</th>
                  <th className="text-center px-6 py-4 font-semibold">Customer</th>
                  <th className="text-center px-6 py-4 font-semibold">Zone / Sub-Zone</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4">Old Package</td>
                  <td className="px-6 py-4 text-center">458.39</td>
                  <td className="px-6 py-4 text-center">46.77</td>
                </tr>
                <tr className="border-t">
                  <td className="px-6 py-4">New Package</td>
                  <td className="px-6 py-4 text-center">550.06</td>
                  <td className="px-6 py-4 text-center">46.77</td>
                </tr>
                <tr className="border-t font-bold">
                  <td className="px-6 py-4">Net Amount</td>
                  <td className="px-6 py-4 text-center">92.00</td>
                  <td className="px-6 py-4 text-center">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-5 mb-8">
            <Field label="Payment Method:">
              <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm font-semibold">
                <option>CASH</option>
              </select>
            </Field>
            <Field label="Amount Received:">
              <Input className="rounded-xl bg-muted/40" />
            </Field>
            <Field label="Received By:">
              <select className="w-full border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                <option>ID-24-Afi cable network [ACN] (Cash/Bank)</option>
              </select>
            </Field>
          </div>

          <div className="flex gap-3 max-w-md ml-auto">
            <Button variant="outline" className="flex-1 rounded-full font-semibold">
              Cancel
            </Button>
            <Button className="flex-1 rounded-full font-semibold">Change</Button>
          </div>
        </div>
      </div>
    </div>
  );
}