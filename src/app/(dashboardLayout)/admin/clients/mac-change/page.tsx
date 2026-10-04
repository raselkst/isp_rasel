"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { FormShell, FormSection, ReadonlyField } from "@/components/clients-v2/premium-form";
import { Cpu, X, ClipboardPaste } from "lucide-react";

export default function ChangeMacPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-2xl mx-auto">
          <FormShell icon={Cpu} eyebrow="Client · Network" title="Change MAC Address">
            <FormSection>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-2xl bg-signal-tint text-signal flex items-center justify-center font-heading font-bold shrink-0">
                  Z
                </div>
                <div>
                  <p className="font-heading font-bold">Zim</p>
                  <p className="text-xs text-muted-foreground">10_Mbps_Package</p>
                </div>
              </div>

              <p className="text-sm font-semibold mb-2">Current MAC</p>
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 mb-6">
                <span className="font-mono font-semibold text-sm">BC:62:CE:08:79:3C</span>
                <button className="flex items-center gap-1.5 text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-1.5 rounded-full transition-colors">
                  <X className="h-3 w-3" /> Remove
                </button>
              </div>

              <p className="text-sm font-semibold mb-2">New MAC address</p>
              <div className="flex items-center gap-1.5 justify-center p-4 rounded-2xl bg-signal-tint/40">
                {["AA", "BB", "CC", "DD", "EE", "FF"].map((seg, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <input
                      defaultValue={seg}
                      maxLength={2}
                      className="w-11 text-center border-2 border-signal/20 focus:border-signal rounded-xl px-1 py-2.5 bg-card font-mono font-bold text-sm outline-none transition-colors"
                    />
                    {i < 5 && <span className="text-muted-foreground font-bold">:</span>}
                  </div>
                ))}
              </div>
              <p className="flex items-center justify-center gap-1.5 text-xs text-signal font-medium mt-3">
                <ClipboardPaste className="h-3.5 w-3.5" /> Paste a full MAC address to auto-fill all segments
              </p>
            </FormSection>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-2xl font-semibold h-12">
                Cancel
              </Button>
              <Button className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0">
                Save MAC Address
              </Button>
            </div>
          </FormShell>
        </div>
      </div>
    </div>
  );
}