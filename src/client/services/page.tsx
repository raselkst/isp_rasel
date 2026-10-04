"use client";

import { ClientTopbar } from "@/components/client-panel/client-topbar";
import { FilterSidebar } from "@/components/client-panel/filter-sidebar";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const filters = [
  { label: "Active", count: "00", colorClass: "bg-success" },
  { label: "Pending", count: "00", colorClass: "bg-warning" },
  { label: "Suspended", count: "00", colorClass: "bg-destructive" },
  { label: "Terminated", count: "00", colorClass: "bg-signal" },
  { label: "Cancelled", count: "00", colorClass: "bg-violet-accent" },
];

const services = Array.from({ length: 7 }).map(() => ({
  plan: "Plan 1",
  domain: "(News24.com)",
  price: "2000 TK",
  cycle: "Monthly",
  due: "Friday",
  dueDate: "(November. 11th.2025)",
  status: "Active" as const,
}));

export default function MyServicesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ClientTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">My Services</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border bg-card text-sm outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          <FilterSidebar title="View" items={filters} />

          <div className="bg-card rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  <th className="text-left px-5 py-3.5 font-semibold text-[13px]">Product/Service</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[13px]">Pricing</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[13px]">Next Due Date</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-[13px]">Status</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s, i) => (
                  <tr key={i} className="border-t hover:bg-muted/40">
                    <td className="px-5 py-4">
                      {s.plan}{" "}
                      <a href="#" className="text-signal underline">
                        {s.domain}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-mono">{s.price}</span>{" "}
                      <span className="text-muted-foreground">({s.cycle})</span>
                    </td>
                    <td className="px-5 py-4">
                      {s.due} <span className="text-muted-foreground">{s.dueDate}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-success text-white">
                        {s.status}
                      </span>
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
    </div>
  );
}