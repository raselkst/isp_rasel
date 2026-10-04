"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { FormShell, FormSection, ReadonlyField } from "@/components/clients-v2/premium-form";
import { cn } from "@/lib/utils";
import { Gauge, CheckCircle2, Star, Zap, Gift, CreditCard } from "lucide-react";

const classOptions = [
  { key: "postpaid", label: "Postpaid", icon: CreditCard, desc: "Billed after usage period" },
  { key: "prepaid", label: "Prepaid", icon: Zap, desc: "Currently active" },
  { key: "vip", label: "VIP", icon: Star, desc: "Priority support & bandwidth" },
  { key: "free", label: "Free", icon: Gift, desc: "Complimentary access" },
];

export default function PriorityChangePage() {
  const [selected, setSelected] = useState("prepaid");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-2xl mx-auto">
          <FormShell icon={Gauge} eyebrow="Client · Priority" title="Change Class / Priority">
            <FormSection>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-2xl bg-signal-tint text-signal flex items-center justify-center font-heading font-bold shrink-0">
                  Z
                </div>
                <div>
                  <p className="font-heading font-bold">Zim</p>
                  <p className="text-xs text-muted-foreground">Customer ID 1345667 · ch@1914</p>
                </div>
              </div>

              <p className="text-sm font-semibold mb-3">Select new class</p>
              <div className="grid grid-cols-2 gap-3">
                {classOptions.map((opt) => {
                  const active = selected === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setSelected(opt.key)}
                      className={cn(
                        "relative text-left rounded-2xl border-2 p-4 transition-all",
                        active ? "border-signal bg-signal-tint/50" : "border-border hover:border-signal/30"
                      )}
                    >
                      {active && (
                        <CheckCircle2 className="absolute top-3 right-3 h-4 w-4 text-signal" />
                      )}
                      <opt.icon className={cn("h-5 w-5 mb-2", active ? "text-signal" : "text-muted-foreground")} />
                      <p className={cn("font-heading font-bold text-sm", active && "text-signal")}>{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </FormSection>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-2xl font-semibold h-12">
                Cancel
              </Button>
              <Button className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0">
                Save Priority
              </Button>
            </div>
          </FormShell>
        </div>
      </div>
    </div>
  );
}