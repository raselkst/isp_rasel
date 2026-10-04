"use client";

import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Printer,
  Download,
  Edit3,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  Receipt,
  FileText,
  MapPin,
  Mail,
  Phone,
  Package,
} from "lucide-react";

export default function ViewInvoicePage() {
  const router = useRouter();

  // 🎯 ডামি ইনভয়েস ডেটা
  const invoice = {
    number: "872193",
    date: "Tue, Jan 27, 2026",
    due: "Tue, Feb 27, 2026",
    status: "Unpaid",
    customer: {
      name: "Rahim Uddin",
      email: "rahim@example.com",
      phone: "01710626699",
      address: "House 12, Road 5, Dhanmondi, Dhaka-1205",
    },
    items: [
      { description: "10Mbps Internet Package - January", quantity: 1, rate: 1000, amount: 1000 },
      { description: "Installation Charge", quantity: 1, rate: 500, amount: 500 },
    ],
    subtotal: 1500,
    tax: 75,
    total: 1575,
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* 🎯 Sticky Action Bar */}
        <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all">
                <Edit3 className="h-4 w-4" /> Edit
              </button>
              <button
                onClick={() => router.push(`/admin/reports/invoices/print/${invoice.number}`)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
              >
                <Printer className="h-4 w-4" /> Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Invoice Details
            </p>
            <div className="flex items-center gap-3">
              <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                #{invoice.number}
              </h1>
              <span className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold",
                invoice.status === "Paid" ? "bg-emerald-500/10 text-emerald-600" :
                invoice.status === "Unpaid" ? "bg-red-500/10 text-red-600" :
                "bg-amber-500/10 text-amber-600"
              )}>
                {invoice.status === "Paid" ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                {invoice.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Invoice Body */}
            <div className="lg:col-span-2 space-y-6">
              {/* From / To Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl border p-6">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">From</h3>
                  <p className="font-bold text-base mb-2">SmartISP Pvt. Ltd.</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    123 Tech Park, Gulshan-2<br />
                    Dhaka-1212, Bangladesh<br />
                    support@smartisp.com
                  </p>
                </div>
                <div className="bg-card rounded-2xl border p-6">
                  <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Bill To</h3>
                  <p className="font-bold text-base mb-2">{invoice.customer.name}</p>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {invoice.customer.email}</p>
                    <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {invoice.customer.phone}</p>
                    <p className="flex items-start gap-1.5"><MapPin className="h-3 w-3 mt-0.5 shrink-0" /> {invoice.customer.address}</p>
                  </div>
                </div>
              </div>

              {/* Invoice Info */}
              <div className="bg-card rounded-2xl border p-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Invoice Date</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-signal" /> {invoice.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Due Date</p>
                    <p className="text-sm font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-amber-500" /> {invoice.due}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Invoice No.</p>
                    <p className="text-sm font-mono font-semibold">{invoice.number}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-semibold">{invoice.status}</p>
                  </div>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="bg-card rounded-2xl border overflow-hidden">
                <div className="px-6 py-4 border-b bg-muted/30">
                  <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-emerald-500" />
                    Line Items
                  </h3>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/20">
                      <th className="text-left px-6 py-3 font-semibold text-xs">Description</th>
                      <th className="text-right px-6 py-3 font-semibold text-xs">Qty</th>
                      <th className="text-right px-6 py-3 font-semibold text-xs">Rate</th>
                      <th className="text-right px-6 py-3 font-semibold text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, i) => (
                      <tr key={i} className="border-t">
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4 text-right font-mono">{item.quantity}</td>
                        <td className="px-6 py-4 text-right font-mono">৳{item.rate.toLocaleString()}</td>
                        <td className="px-6 py-4 text-right font-bold">৳{item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-signal" />
                  Payment Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">৳{invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span className="font-semibold">৳{invoice.tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-heading text-2xl font-bold text-signal">
                      ৳{invoice.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Payment due by {invoice.due}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}