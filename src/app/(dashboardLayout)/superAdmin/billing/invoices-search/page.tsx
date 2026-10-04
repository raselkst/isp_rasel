"use client";

import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { cn } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

type InvoiceStatus = "Paid" | "Unpaid";

const statusStyles: Record<InvoiceStatus, string> = {
  Paid: "bg-success text-white",
  Unpaid: "bg-destructive text-white",
};

const invoices: { no: string; date: string; due: string; total: string; status: InvoiceStatus }[] = [
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Paid" },
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Unpaid" },
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Paid" },
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Paid" },
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Paid" },
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Paid" },
  { no: "705838", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: "1000Tk", status: "Paid" },
];

export default function InvoicesSearchPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">Invoices</h1>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Search…"
              className="w-full pl-9 pr-4 py-2.5 rounded-full border bg-card text-sm outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-signal text-signal-foreground">
                <th className="px-5 py-3.5 w-10">
                  <input type="checkbox" className="accent-signal-foreground" />
                </th>
                {["Invoice No.", "Invoice Date", "Due Date", "Total", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-[13px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv, i) => (
                <tr key={i} className="border-t hover:bg-muted/40">
                  <td className="px-5 py-4">
                    <input type="checkbox" className="accent-signal" />
                  </td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{inv.no}</td>
                  <td className="px-4 py-4 text-muted-foreground">{inv.date}</td>
                  <td className="px-4 py-4 text-muted-foreground">{inv.due}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{inv.total}</td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-semibold", statusStyles[inv.status])}>
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
  );
}