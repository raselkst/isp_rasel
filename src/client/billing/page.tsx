"use client";

import { ClientTopbar } from "@/components/client-panel/client-topbar";
import { FilterSidebar } from "@/components/client-panel/filter-sidebar";
import { CheckCircle2, Search, ChevronLeft, ChevronRight } from "lucide-react";

const filters = [
  { label: "Paid", count: "00", colorClass: "bg-success" },
  { label: "Unpaid", count: "00", colorClass: "bg-warning" },
  { label: "Cancelled", count: "00", colorClass: "bg-destructive" },
  { label: "Refunded", count: "00", colorClass: "bg-signal" },
];

const invoices = Array.from({ length: 7 }).map(() => ({
  no: "957395",
  date: "Mon, Jan 3, 2025",
  due: "Mon, Jan 3, 2025",
  total: "5000 tk",
  status: "Paid" as const,
}));

export default function MyInvoicesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ClientTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">My Invoices</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border bg-card text-sm outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
          <FilterSidebar
            title="Invoice Status"
            items={filters}
            banner={
              <div className="bg-success-tint border-l-[3px] border-success rounded-lg p-4">
                <div className="flex items-center gap-2 font-semibold text-sm text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  No outstanding invoices at this time.
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All invoices have been successfully cleared.
                </p>
              </div>
            }
          />

          <div className="bg-card rounded-2xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  {["Invoice", "Invoice Date", "Due Date", "Total", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 font-semibold text-[13px]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr key={i} className="border-t hover:bg-muted/40">
                    <td className="px-5 py-4 font-mono text-[12.5px]">{inv.no}</td>
                    <td className="px-5 py-4 text-muted-foreground">{inv.date}</td>
                    <td className="px-5 py-4 text-muted-foreground">{inv.due}</td>
                    <td className="px-5 py-4 font-mono text-[12.5px]">{inv.total}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-success text-white">
                        {inv.status}
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