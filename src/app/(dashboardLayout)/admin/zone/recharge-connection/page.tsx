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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border overflow-hidden mb-6">
      <div className="bg-signal text-signal-foreground text-center py-3.5 font-heading font-bold text-lg">
        {title}
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

export default function RechargeConnectionPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-4xl">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            Recharge Connection
          </h1>

          <Section title="Customer Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Customer ID:">
                <Input defaultValue="2550" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <Field label="Username:">
                <Input defaultValue="mb@liton.crs" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <Field label="Customer Name:">
                <Input defaultValue="Liton" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <Field label="Package:">
                <Input defaultValue="10Mbps_Package" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <Field label="Billing Cycle:">
                <Input defaultValue="Day 1" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <Field label="IP Address:">
                <Input placeholder="Type here..." className="rounded-xl" />
              </Field>
              <Field label="OLD Expiry_Date:">
                <Input defaultValue="01/05/2025" readOnly className="rounded-xl bg-muted/40 line-through text-muted-foreground" />
              </Field>
              <Field label="New Exp Date:">
                <Input defaultValue="03/09/2025" readOnly className="rounded-xl bg-signal-tint font-semibold" />
              </Field>
              <Field label="Balance:">
                <Input defaultValue="0.0" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
            </div>
          </Section>

          <Section title="User Rate Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Package Price:">
                <Input defaultValue="490" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <div />
              <Field label="Bill For 1 Month:">
                <Input defaultValue="490" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <div />
              <Field label="Total For 1 Month:">
                <Input defaultValue="490" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
              <Field label="No of Months:">
                <select className="w-full border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                  <option>1</option>
                </select>
              </Field>
              <Field label="Grand Total:">
                <Input defaultValue="490" readOnly className="rounded-xl bg-signal-tint font-semibold" />
              </Field>
            </div>
          </Section>

          <Section title="Payment Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-2">
              <Field label="Payment Method:">
                <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm font-semibold">
                  <option>CASH</option>
                </select>
              </Field>
              <div />
              <Field label="Amount Receive From Client:">
                <Input defaultValue="490" className="rounded-xl bg-signal-tint font-semibold" />
              </Field>
              <label className="flex items-center gap-2 text-sm font-semibold text-signal self-end pb-2.5">
                <input type="checkbox" className="rounded" />
                Copy Grand Total
              </label>
              <Field label="Discount:">
                <Input placeholder="0" className="rounded-xl" />
              </Field>
              <Field label="Received By:">
                <select className="w-full border rounded-xl px-4 py-2.5 bg-signal-tint text-sm font-semibold">
                  <option>Network Service Provider (NSP)</option>
                </select>
              </Field>
              <Field label="Money Receipt No:">
                <Input className="rounded-xl" />
              </Field>
              <Field label="Remarks:">
                <Input className="rounded-xl" />
              </Field>
            </div>
          </Section>

          <div className="flex gap-3 max-w-md ml-auto">
            <Button variant="outline" className="flex-1 rounded-full font-semibold">
              Cancel
            </Button>
            <Button className="flex-1 rounded-full font-semibold">Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}