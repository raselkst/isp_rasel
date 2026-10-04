"use client";

import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UserPlus, Pencil, Trash2, Plus, ChevronLeft, ChevronRight } from "lucide-react";

const rows = Array.from({ length: 11 }).map(() => ({
  invoice: "705838",
  cid: "jihad1019",
  name: "Mogbul Hosen",
  mobile: "01700634514",
  pkg: "500Tk@8Mb30Day",
  protocol: "Pppoe",
  bill: 500,
  balance: 0,
  exp: "04/09/24",
  lastPay: "05/08/24",
  status: "Paid" as const,
}));

export default function GenerateNewInvoicesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">Generate New Invoices</h1>
          <Button
            variant="outline"
            className="rounded-full font-semibold border-signal text-signal hover:bg-signal-tint"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add New Invoices
          </Button>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[1300px]">
            <thead>
              <tr className="bg-signal text-signal-foreground">
                <th className="px-4 py-3.5 w-10">
                  <input type="checkbox" className="accent-signal-foreground" />
                </th>
                {["Invoice No.", "C.ID", "Name", "Mobile", "Package", "Protocol", "Bill", "Balance", "Exp Date", "L.Pay Date", "B.Status", "Action"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 font-semibold text-[12.5px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t hover:bg-muted/40">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="accent-signal" />
                  </td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{r.invoice}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{r.cid}</td>
                  <td className="px-4 py-4">{r.name}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{r.mobile}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{r.pkg}</td>
                  <td className="px-4 py-4">{r.protocol}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{r.bill}</td>
                  <td className="px-4 py-4 font-mono text-[12.5px]">{r.balance.toString().padStart(2, "0")}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{r.exp}</td>
                  <td className="px-4 py-4 whitespace-nowrap">{r.lastPay}</td>
                  <td className="px-4 py-4">
                    <span className={cn("inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-success text-white")}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1.5">
                      <button title="Assign to user" className="w-8 h-8 rounded-full bg-violet-accent-tint text-violet-accent flex items-center justify-center">
                        <UserPlus className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
                        <Trash2 className="h-3.5 w-3.5" />
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