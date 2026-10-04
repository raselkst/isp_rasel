"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-[15px] text-foreground">
      <span className="font-semibold">{label}: </span>
      <span className="font-semibold">{value}</span>
    </p>
  );
}

export default function InvoicePrintPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4">
      <div className="flex justify-end max-w-4xl mx-auto mb-4 print:hidden">
        <Button onClick={() => window.print()} className="rounded-full gap-2 font-semibold">
          <Printer className="h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div className="bg-card max-w-4xl mx-auto rounded-2xl border print:border-none p-10 sm:p-14">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-center text-signal mb-10">
          Al Jaami Technology Limited
        </h1>

        <div className="flex items-start justify-between mb-8 flex-wrap gap-6">
          <div className="space-y-1">
            <h2 className="font-heading text-2xl font-bold mb-3">INVOICE</h2>
            <Row label="Customer ID" value="2550" />
            <Row label="Username" value="mb@liton.crs" />
            <Row label="Name" value="Liton" />
            <Row label="Mobile No" value="01715169448" />
            <Row label="Address" value="Address goes here" />
            <Row label="Expiry Date" value="2025-02-27 10:38:26" />
            <Row label="ID" value="413540" />
            <Row label="Initiator" value="Modhupur Broadband (kajol), ipv6-routes=," />
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center justify-end gap-2 mb-2">
              <div className="w-9 h-9 rounded-lg bg-signal" />
              <span className="font-heading font-bold text-sm">LOGO NAME</span>
            </div>
            <p className="text-sm font-bold">Invoice For: 2025/08</p>
            <p className="text-sm font-bold">Invoice No: 2550</p>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-signal text-signal-foreground">
                <th className="text-left px-5 py-3 font-semibold">Remarks</th>
                <th className="text-right px-5 py-3 font-semibold">Amount(BDT)</th>
                <th className="text-right px-5 py-3 font-semibold">VAT(5%)</th>
                <th className="text-right px-5 py-3 font-semibold">Total (BDT)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-5 py-3">Invoice for August/2025</td>
                <td className="px-5 py-3 text-right">490</td>
                <td className="px-5 py-3 text-right">0</td>
                <td className="px-5 py-3 text-right">490</td>
              </tr>
              <tr className="border-t font-bold">
                <td className="px-5 py-3 text-right" colSpan={1}>
                  Total(BDT)
                </td>
                <td className="px-5 py-3 text-right">490</td>
                <td className="px-5 py-3 text-right">0</td>
                <td className="px-5 py-3 text-right">490</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="font-bold mb-10">In words: Taka Four Hundred Ninety Only</p>

        <div className="mb-10">
          <div className="border-t w-56 mb-2" />
          <p className="text-sm">Billing Department</p>
        </div>

        <div className="space-y-1 mb-10">
          <p className="font-bold">Bank Information</p>
          <p className="text-sm">Account Name: Company Limited</p>
          <p className="text-sm">Account No: 00000000</p>
          <p className="text-sm">XY Bank Limited</p>
        </div>

        <p className="text-center text-sm mb-6">Thank you for being a valid customer</p>

        <div className="border-t pt-4 text-center text-sm space-y-1">
          <p className="font-bold">Your Company Address</p>
          <p>(100th Floor), 1 Company Avenue, Dhaka 1212,</p>
          <p>Phone: +880 1713336403</p>
        </div>
      </div>
    </div>
  );
}