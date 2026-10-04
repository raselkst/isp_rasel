"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PremiumCard, PremiumTableHead, PageHeader, Field, inputClass } from "@/components/config/shared";
import { Search, Plus, Pencil, Trash2, HelpCircle } from "lucide-react";

const columns = ["Name", "Pool", "IPv6 Prefix Pool", "DHCPv6 PD Pool", "PPP Profile", "For Company", "Queue", "DIS BW", "DIS Rate", "FuP Pool", "FuP BW", "Edit/Delete"];

const rows = [
  { name: "10Mbps_Package", pool: "10Mbps_Pool", profile: "10Mbps_Package" },
  { name: "10Mbps_Package", pool: "10Mbps_Pool", profile: "10Mbps_Package" },
];

export default function AddPackagePage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Config · Packages & Rates" title="Add Package / Plan" />

          <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 overflow-hidden mb-8">
            <div className="px-8 py-5 bg-gradient-to-r from-signal to-violet-accent text-white font-heading font-bold text-lg">
              Add Package / Plan
            </div>

            <div className="p-7 sm:p-8 space-y-5">
              <Field label="Package Type" required>
                <select className={`${inputClass} border-signal ring-4 ring-signal/10`}>
                  <option>PPPoE Package</option>
                </select>
              </Field>
              <Field label="Package Name" required>
                <input className={inputClass} />
              </Field>
              <Field label="IP Pool Name">
                <input className={inputClass} />
              </Field>
              <Field label="PPP Profile">
                <input className={inputClass} />
              </Field>
              <Field label="Remarks">
                <input className={inputClass} />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="For Company">
                  <select className={inputClass}>
                    <option>No</option>
                  </select>
                </Field>
                <Field label="Show in Sales query">
                  <select className={inputClass}>
                    <option>No</option>
                  </select>
                </Field>
              </div>
              <div>
                <Field label="Mikrotik Queue / Bw Setting">
                  <input className={inputClass} />
                </Field>
                <p className="text-xs text-signal font-medium mt-1.5 flex items-center gap-1 justify-end">
                  <HelpCircle className="h-3 w-3" /> Need help?
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Field label="DIS BW">
                  <input className={inputClass} />
                </Field>
                <Field label="DIS Rate">
                  <input className={inputClass} />
                </Field>
              </div>

              <div className="flex justify-end">
                <Button className="rounded-2xl font-semibold h-12 px-10 bg-gradient-to-r from-signal to-violet-accent border-0">
                  Next
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 rounded-full w-64" />
            </div>
          </div>

          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1100px]">
                <PremiumTableHead columns={columns} />
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-signal-tint/30 transition-colors align-top">
                      <td className="px-6 py-4">
                        <p className="font-semibold mb-2">{r.name}</p>
                        <button className="flex items-center gap-1 text-xs font-semibold text-signal">
                          <Plus className="h-3 w-3" /> Add VAS
                        </button>
                      </td>
                      <td className="px-6 py-4">{r.pool}</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">{r.profile}</td>
                      <td className="px-6 py-4">No</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">—</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <button className="flex items-center gap-1.5 text-signal font-semibold text-xs">
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button className="flex items-center gap-1.5 text-destructive font-semibold text-xs">
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Show Entities</span>
                <select className="border rounded-lg px-2 py-1 bg-background">
                  <option>10</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <select className="border rounded-lg px-2 py-1 bg-background">
                  <option>01</option>
                </select>
                <span>of 4 pages</span>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  ‹
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  ›
                </Button>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}