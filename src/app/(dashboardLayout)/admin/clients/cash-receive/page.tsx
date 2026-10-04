"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, FormSection, ReadonlyField, EditableField, premiumInput } from "@/components/clients-v2/premium-form";
import { Wallet } from "lucide-react";

export default function CashReceivePage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-2xl mx-auto">
          <FormShell icon={Wallet} eyebrow="Clients · Cash Receive" title="Receive Payment">
            <FormSection>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-2xl bg-signal-tint text-signal flex items-center justify-center font-heading font-bold shrink-0">
                  A
                </div>
                <div>
                  <p className="font-heading font-bold">admin@kc.net</p>
                  <p className="text-xs text-muted-foreground">2550 / mb@liton.crs · 10Mbps_Package</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                <ReadonlyField label="Billing cycle" value="Day 1" />
                <ReadonlyField label="Expiry date" value="01/05/2025" />
                <ReadonlyField label="Current balance" value="৳0.00" />
              </div>
            </FormSection>

            <FormSection title="Payment Details">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="Payment type">
                  <select className={`${premiumInput} bg-signal-tint border-signal/30 font-semibold`}>
                    <option>CASH</option>
                  </select>
                </EditableField>
                <EditableField label="Amount received" required>
                  <Input placeholder="0" className={`${premiumInput} bg-signal-tint border-signal/30 font-semibold`} />
                </EditableField>
                <EditableField label="Discount">
                  <Input placeholder="0" className={premiumInput} />
                </EditableField>
                <EditableField label="Received by">
                  <select className={premiumInput}>
                    <option>Network Service Provider (NSP)</option>
                  </select>
                </EditableField>
                <EditableField label="Money receipt no">
                  <Input placeholder="Keep blank for auto" className={premiumInput} />
                </EditableField>
              </div>
              <div className="mt-5">
                <EditableField label="Remarks">
                  <textarea className={`${premiumInput} min-h-[90px]`} />
                </EditableField>
              </div>
            </FormSection>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-2xl font-semibold h-12">
                Cancel
              </Button>
              <Button className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0">
                Confirm Payment
              </Button>
            </div>
          </FormShell>
        </div>
      </div>
    </div>
  );
}