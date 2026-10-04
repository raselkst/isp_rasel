"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Ticket, CalendarDays, LayoutGrid, CircleDot, Upload } from "lucide-react";

function Pill({ icon: Icon, label, tone }: { icon: React.ElementType; label: string; tone: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border",
        tone
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-1.5">
      <span className="font-semibold text-sm block">
        {required && <span className="text-signal">*</span>}
        {label}
      </span>
      {children}
    </div>
  );
}

export default function TicketInformationPage() {
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("High");

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Ticket Information
            </h1>
            <div className="flex flex-wrap gap-2">
              <Pill icon={Ticket} label="TKT" tone="border-violet-accent/40 text-violet-accent" />
              <Pill icon={CalendarDays} label="Date" tone="border-destructive/40 text-destructive" />
              <Pill icon={LayoutGrid} label="Type" tone="border-success/40 text-success" />
              <Pill icon={CircleDot} label="Status" tone="border-signal/40 text-signal" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 mb-6">
            <div className="bg-card rounded-2xl border p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Find Customer by Username or ID:" required>
                  <select className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm font-semibold">
                    <option>mb@liton.crs</option>
                  </select>
                </Field>
                <Field label="Status:">
                  <div className="flex items-center gap-3">
                    <select className="flex-1 border rounded-xl px-4 py-2.5 bg-background text-sm font-semibold text-signal">
                      <option>Active</option>
                    </select>
                    <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-signal-tint text-signal text-sm font-semibold whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-signal" /> Online
                    </span>
                  </div>
                </Field>
              </div>
              <Button className="rounded-full font-semibold">Load Client Info</Button>
            </div>

            <div className="bg-card rounded-2xl border p-5">
              <p className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Ticket className="h-4 w-4" /> Tickets <span className="text-muted-foreground font-normal">[ Last 30 Days ]</span>
              </p>
              <div className="border rounded-xl h-24 flex items-center justify-center text-sm text-signal font-medium">
                No recent ticket founds
              </div>
            </div>
          </div>

          <div className="bg-signal text-signal-foreground text-center py-3.5 rounded-t-2xl font-heading font-bold text-lg">
            Customer Information
          </div>

          <div className="bg-card rounded-b-2xl border border-t-0 p-6 sm:p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="First Name:" required>
                <Input defaultValue="Liton" className="rounded-xl border-signal ring-1 ring-signal/30 font-semibold" />
              </Field>
              <Field label="Status:" required>
                <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm font-semibold">
                  <option>New</option>
                </select>
              </Field>
              <Field label="Email:">
                <Input placeholder="Enter your email" className="rounded-xl" />
              </Field>
              <Field label="Mobile:">
                <Input defaultValue="01716548392" readOnly className="rounded-xl bg-muted/40 font-semibold" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Priority:">
                <div className="flex items-center gap-5 pt-1">
                  {(["Low", "Medium", "High"] as const).map((p) => (
                    <label key={p} className="flex items-center gap-1.5 text-sm font-semibold cursor-pointer">
                      <input
                        type="radio"
                        checked={priority === p}
                        onChange={() => setPriority(p)}
                        className={cn(
                          "accent-signal",
                          p === "Low" && "accent-caution",
                          p === "Medium" && "accent-violet-accent"
                        )}
                      />
                      {p}
                    </label>
                  ))}
                </div>
              </Field>
              <div className="flex items-center gap-8">
                <label className="flex items-center gap-2 text-sm font-semibold">
                  Send Sms
                  <span className="w-10 h-5.5 rounded-full bg-signal relative inline-block">
                    <span className="absolute right-0.5 top-0.5 w-4.5 h-4.5 rounded-full bg-white" />
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  Sms to Customer
                  <span className="w-10 h-5.5 rounded-full bg-signal relative inline-block">
                    <span className="absolute right-0.5 top-0.5 w-4.5 h-4.5 rounded-full bg-white" />
                  </span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Associate to:">
                <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm">
                  <option>Select one</option>
                </select>
              </Field>
              <Field label="Assigned to:">
                <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm">
                  <option>Select one</option>
                </select>
              </Field>
            </div>

            <Field label="Short Description:">
              <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm">
                <option>Select Issue</option>
              </select>
            </Field>

            <Field label="Sms to assigned to:" required>
              <textarea
                placeholder="Write message to assigned person"
                className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm min-h-[90px]"
              />
            </Field>

            <Field label="Sms to Customer:" required>
              <textarea
                placeholder="Write message to Customer"
                className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm min-h-[90px]"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-5 items-start">
              <Field label="Discription:" required>
                <textarea
                  placeholder="Campaign details"
                  className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm min-h-[110px]"
                />
              </Field>
              <Button variant="outline" className="rounded-xl font-semibold gap-2 self-start mt-7 w-full">
                <Upload className="h-4 w-4" /> Upload a file
              </Button>
            </div>

            <Button className="w-full rounded-xl font-semibold py-6">Create Complain</Button>
          </div>
        </div>
      </div>
    </div>
  );
}