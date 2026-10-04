"use client";

import { useState } from "react";
import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { ServiceStatusPill } from "@/components/client-portal/service-status-pill";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  MoreHorizontal,
} from "lucide-react";

const initialServices = [
  { sid: "01", plan: "Plan 1", category: "ultimateISP", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: true, status: "Active" as const },
  { sid: "01", plan: "Plan 2", category: "ISP Log", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: false, status: "Suspend" as const },
  { sid: "01", plan: "Plan 1", category: "Amar WiFi", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: true, status: "Pending" as const },
  { sid: "01", plan: "Plan 4", category: "My Diagram", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: false, status: "Terminated" as const },
  { sid: "01", plan: "Plan 1", category: "My NMS", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: true, status: "Active" as const },
  { sid: "01", plan: "Plan 1", category: "Amar WiFi", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: false, status: "Suspend" as const },
  { sid: "01", plan: "Plan 1", category: "ISP Log", price: "1000Tk", start: "Tue, Jan 27, 2026", expired: "Tue, Jan 27, 2026", validity: "30d0h", autoRenew: true, status: "Active" as const },
];

export default function ServicesListPage() {
  const [services, setServices] = useState(initialServices);

  const toggleAutoRenew = (index: number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === index ? { ...s, autoRenew: !s.autoRenew } : s))
    );
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">Services list</h1>
          <Button
            variant="outline"
            className="rounded-full font-semibold border-signal text-signal hover:bg-signal-tint"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Service
          </Button>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-signal text-signal-foreground">
                {["SID", "Serves Name", "Category", "Price", "Service Start", "Service Expired", "Auto Renew", "Validity", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-[12.5px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {services.map((s, i) => (
                <tr key={i} className="border-t hover:bg-muted/40">
                  <td className="px-4 py-4">{s.sid}</td>
                  <td className="px-4 py-4">{s.plan}</td>
                  <td className="px-4 py-4">{s.category}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{s.price}</td>
                  <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{s.start}</td>
                  <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{s.expired}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={s.autoRenew}
                        onCheckedChange={() => toggleAutoRenew(i)}
                      />
                      <span className="text-[12.5px] text-muted-foreground">
                        {s.autoRenew ? "Enabled" : "Disable"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{s.validity}</td>
                  <td className="px-4 py-4">
                    <ServiceStatusPill status={s.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      <button className="w-8 h-8 rounded-full bg-violet-accent-tint text-violet-accent flex items-center justify-center">
                        <Settings className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              Items per page:
              <select className="border rounded-md px-2 py-1 bg-background">
                <option>25</option>
              </select>
              <span>1-25 of 100 items</span>
            </div>
            <div className="flex items-center gap-3">
              <select className="border rounded-md px-2 py-1 bg-background">
                <option>12</option>
              </select>
              <span>of 40 pages</span>
              <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}