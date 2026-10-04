"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, FileSpreadsheet, FileDown, FileText, Search } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-semibold text-sm whitespace-nowrap w-28">{label}</span>
      {children}
    </div>
  );
}

function Select({ placeholder }: { placeholder: string }) {
  return (
    <select className="flex-1 border rounded-xl px-4 py-2.5 bg-background text-sm text-muted-foreground">
      <option>{placeholder}</option>
    </select>
  );
}

const columns = [
  "C_ID",
  "Customer Name",
  "Pay Date",
  "Recieved Amount",
  "Total Bill",
  "Pay Type",
  "Money Receipt",
  "Received By",
  "POP Name",
  "Entry By",
];

const rows = Array.from({ length: 10 }).map(() => ({
  cid: "2550",
  name: "mb@limon.crs",
  date: "2025-03-31 19:20",
  received: "500.00",
  total: "500.00",
  payType: "Cash",
  remarks: "Bill Cycle Change 02-03-2025 to 01-04-2025.",
  bill: "484",
  receivedBy: "ID - 36\nRejaul Cable Network [RCN]",
  entryBy: "Bill Cycle Change",
}));

function ExportButton({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <Button variant="outline" className="rounded-full gap-1.5 font-semibold text-signal border-signal/30">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export default function PaymentReportPage() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Payment Report
            </h1>
            <span className="text-sm font-semibold">
              Balance: <span className="text-signal">0.00</span>
            </span>
          </div>

          <p className="text-sm font-semibold mb-6">
            Customer Payment Report From <span className="text-signal">2025-02-03</span> To{" "}
            <span className="text-signal">2025-08-03</span>
          </p>

          <div className="bg-card rounded-2xl border p-5 mb-5 space-y-4">
            <div className="flex flex-wrap items-center gap-4">
              <Field label="Date Range:">
                <Input type="date" defaultValue="2025-07-23" className="rounded-xl" />
              </Field>
              <span className="text-sm text-muted-foreground">To</span>
              <Input type="date" defaultValue="2025-07-23" className="rounded-xl w-40" />
              <Button className="rounded-xl">Go</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="POP:">
                <Select placeholder="Select" />
              </Field>
              <Field label="Billing Cycle:">
                <Select placeholder="Select" />
              </Field>
              <Field label="Received By:">
                <Select placeholder="Select" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Pay Type:">
                <Select placeholder="Select" />
              </Field>
              <Field label="Action Type:">
                <Select placeholder="Select" />
              </Field>
              <Field label="Show Due:">
                <button className="w-11 h-6 rounded-full bg-muted relative">
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow" />
                </button>
              </Field>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <h2 className="font-heading text-lg font-bold">Customer Payment Report</h2>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 rounded-full w-56" />
              </div>
              <ExportButton icon={Copy} label="Copy" />
              <ExportButton icon={FileSpreadsheet} label="Excel" />
              <ExportButton icon={FileDown} label="CSV" />
              <ExportButton icon={FileText} label="PDF" />
            </div>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto mb-5">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="bg-signal text-signal-foreground">
                  {columns.map((c) => (
                    <th key={c} className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-t align-top">
                    <td className="px-4 py-4">{r.cid}</td>
                    <td className="px-4 py-4">{r.name}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{r.date}</td>
                    <td className="px-4 py-4 font-mono">{r.received}</td>
                    <td className="px-4 py-4 font-mono">{r.total}</td>
                    <td className="px-4 py-4">{r.payType}</td>
                    <td className="px-4 py-4 max-w-[220px]">
                      {r.remarks}
                      <br />
                      <span className="text-signal font-semibold">Bill - {r.bill}</span>
                    </td>
                    <td className="px-4 py-4 whitespace-pre-line">{r.receivedBy}</td>
                    <td className="px-4 py-4 whitespace-pre-line">{r.receivedBy}</td>
                    <td className="px-4 py-4">{r.entryBy}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t font-bold">
                  <td className="px-4 py-3">Total:</td>
                  <td />
                  <td />
                  <td className="px-4 py-3 text-signal">1,395.00</td>
                  <td className="px-4 py-3 text-signal">1,395.00</td>
                  <td colSpan={2} className="px-4 py-3">
                    Discount: 0.00
                  </td>
                  <td colSpan={3} />
                </tr>
              </tfoot>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <span>Items per page:</span>
                <select className="border rounded-lg px-2 py-1 bg-background">
                  <option>25</option>
                </select>
                <span>1-25 of 100 items</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <select className="border rounded-lg px-2 py-1 bg-background">
                  <option>12</option>
                </select>
                <span>of 40 pages</span>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  ‹
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                  ›
                </Button>
              </div>
            </div>
          </div>

          <h2 className="font-heading text-lg font-bold text-center mb-5">Transactions Summary</h2>
          <div className="bg-card rounded-2xl border overflow-hidden max-w-2xl mx-auto">
            {[
              ["Total Transactions", "11"],
              ["Total Bill Amount", "1,395.00"],
              ["Total Received", "1,395.00"],
              ["Total Discount", "0.00"],
              ["Total Return", "0.00"],
            ].map(([label, value], i) => (
              <div
                key={label}
                className={cnRow(i)}
              >
                <span className="font-semibold text-sm">{label}</span>
                <span className="font-semibold text-sm">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cnRow(i: number) {
  return `flex items-center justify-between px-6 py-4 border-t first:border-t-0 ${
    i % 2 === 0 ? "bg-signal-tint/40" : ""
  }`;
}