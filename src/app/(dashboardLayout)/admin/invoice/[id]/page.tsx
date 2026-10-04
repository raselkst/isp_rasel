"use client";

import { useState } from "react";
import { Printer, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface InvoiceItem {
  description: string;
  meta: string[];
  amount: string;
}

const item: InvoiceItem = {
  description: "BDIX KVM VPS - 1 - mikhmon (06/16/2025 - 07/15/2025)",
  meta: [
    "Number of IPs: 1 Dedicated IP",
    "Managed / Unmanaged: Unmanaged",
    "Management Panel: None",
    "Operating System: ubuntu- 18.04-x86_64",
  ],
  amount: "590.00TK",
};

export default function InvoiceDetailPage() {
  // In real usage this comes from the invoice record; toggle here only for local preview
  const [status] = useState<"PAID" | "UNPAID">("UNPAID");
  const isPaid = status === "PAID";

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-6">
      <div className="max-w-3xl mx-auto bg-card rounded-2xl border p-10">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-signal" />
            <span className="font-heading font-bold text-lg tracking-wide">LOGO</span>
          </div>
          <div className="text-right">
            <div
              className={cn(
                "font-heading font-bold text-2xl tracking-wide",
                isPaid ? "text-success" : "text-foreground"
              )}
            >
              {status}
            </div>
            {!isPaid && (
              <div className="text-sm text-muted-foreground mt-1">
                Due Date: Monday, June 16th, 2025
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-bold">Invoice #2147416868</h1>
          {!isPaid && (
            <button className="rounded-full bg-signal text-signal-foreground px-6 py-2.5 font-semibold text-sm hover:opacity-90 transition-opacity">
              Pay Now
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-signal mb-2">Invoiced To</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Network Service Provider (NSP)
              <br />
              Md, Sanwar Hos Ain
              <br />
              43 WH Road, Kushtia,
              <br />
              Kushtia, Khulna, 7000
              <br />
              Bangladesh
            </p>
          </div>
          <div className="text-right">
            <h3 className="font-heading font-bold text-signal mb-2">Pay To</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Wolast Technologies
              <br />
              2nd Floor, 1/2, Asad Ave, Dhaka 1207
              <br />
              <br />
              Email: support@gotmyhost.com
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-heading font-bold text-signal mb-2">Invoice Date</h3>
            <p className="text-sm text-muted-foreground">
              {isPaid ? "Friday, November 24, 2023" : "Monday, June 16th, 2025"}
            </p>
          </div>
          <div className="text-right">
            <h3 className="font-heading font-bold text-signal mb-2">Payment Method</h3>
            {isPaid ? (
              <p className="text-sm font-semibold">Mobile Banking / Bank Transfer</p>
            ) : (
              <select className="border rounded-lg px-4 py-2.5 text-sm bg-muted/40 w-full max-w-xs ml-auto block">
                <option>Mobile Banking / Bank Transfer</option>
              </select>
            )}
          </div>
        </div>

        <div className="rounded-xl overflow-hidden border mb-6">
          <div className="bg-signal text-signal-foreground px-6 py-3 flex justify-between font-heading font-bold">
            <span>Invoice Items</span>
          </div>
          <div className="px-6 py-4 flex justify-between border-b">
            <span className="font-semibold text-sm">Description</span>
            <span className="font-semibold text-sm">Amount</span>
          </div>
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between">
              <span className="text-sm">{item.description}</span>
              <span className="text-sm font-mono">{item.amount}</span>
            </div>
            <ul className="mt-2 space-y-1">
              {item.meta.map((m) => (
                <li key={m} className="text-[13px] text-muted-foreground">
                  {m}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-muted/30">
            <div className="px-6 py-3 flex justify-between border-b">
              <span className="font-semibold text-sm">Sub Total:</span>
              <span className="font-semibold text-sm font-mono">{item.amount}</span>
            </div>
            <div className="px-6 py-3 flex justify-between border-b">
              <span className="font-semibold text-sm">Credit:</span>
              <span className="font-semibold text-sm font-mono">0.00TK</span>
            </div>
            <div className="px-6 py-3 flex justify-between">
              <span className="font-heading font-bold">Total:</span>
              <span className="font-heading font-bold font-mono">{item.amount}</span>
            </div>
          </div>

          <div className="px-6 py-3 flex justify-between border-t bg-muted/10 text-sm font-semibold">
            <span>Transaction Date</span>
            <span>Gateway</span>
            <span>Transaction ID</span>
            <span>Amount</span>
          </div>
          {isPaid ? (
            <div className="px-6 py-3 flex justify-between text-sm text-muted-foreground border-t">
              <span>Friday, November 24, 2023</span>
              <span>Mobile Banking / Bank Transfer</span>
              <span className="font-mono">AKO5SED9V5</span>
              <span className="font-mono">{item.amount}</span>
            </div>
          ) : (
            <div className="px-6 py-4 text-center text-sm text-muted-foreground border-t">
              No Related Transactions Found
            </div>
          )}

          <div className="px-6 py-3 flex justify-between border-t bg-muted/30">
            <span className="font-heading font-bold">Balance:</span>
            <span className="font-heading font-bold font-mono">{item.amount}</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button className="flex items-center gap-2 border rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            <Printer className="h-4 w-4" />
            Print
          </button>
          <button className="flex items-center gap-2 border rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}