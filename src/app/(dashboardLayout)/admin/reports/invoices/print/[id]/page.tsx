"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintInvoicePage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id || "872193";

  // 🎯 প্রিন্ট ডায়ালগ অটো ওপেন (ক্লায়েন্ট সাইডে)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        window.print();
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // 🎯 ডামি ইনভয়েস ডেটা (API থেকে আসবে)
  const invoice = {
    number: invoiceId,
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
    <div className="min-h-screen bg-white p-8 print:p-0">
      {/* 🎯 Non-printable Action Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-105 transition-all"
        >
          <Printer className="h-4 w-4" /> Print Invoice
        </button>
      </div>

      {/* 🎯 Printable Invoice */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 print:max-w-full">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">INVOICE</h1>
            <p className="text-sm text-slate-600 mt-1">SmartISP Pvt. Ltd.</p>
            <p className="text-xs text-slate-500 mt-1">123 Tech Park, Gulshan-2, Dhaka-1212</p>
            <p className="text-xs text-slate-500">support@smartisp.com | +880 1234 567890</p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mb-2 ml-auto">
              S
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Invoice No.</p>
            <p className="font-mono font-bold text-lg">#{invoice.number}</p>
          </div>
        </div>

        {/* Bill To & Invoice Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Bill To</p>
            <p className="font-bold text-base">{invoice.customer.name}</p>
            <p className="text-sm text-slate-600">{invoice.customer.email}</p>
            <p className="text-sm text-slate-600">{invoice.customer.phone}</p>
            <p className="text-sm text-slate-600 mt-1">{invoice.customer.address}</p>
          </div>
          <div className="text-right">
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Invoice Date:</span>
                <span className="text-sm font-semibold">{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Due Date:</span>
                <span className="text-sm font-semibold">{invoice.due}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">Status:</span>
                <span className="text-sm font-bold text-red-600">{invoice.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="text-left px-4 py-3 text-xs font-bold uppercase">Description</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase w-20">Qty</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase w-28">Rate</th>
              <th className="text-right px-4 py-3 text-xs font-bold uppercase w-32">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="px-4 py-4 text-sm">{item.description}</td>
                <td className="px-4 py-4 text-sm text-right font-mono">{item.quantity}</td>
                <td className="px-4 py-4 text-sm text-right font-mono">৳{item.rate.toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-right font-bold">৳{item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-semibold">৳{invoice.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Tax (5%):</span>
              <span className="font-semibold">৳{invoice.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-t-2 border-slate-900 pt-2">
              <span className="font-bold text-base">Total:</span>
              <span className="font-bold text-xl">৳{invoice.total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="border-t pt-6">
          <p className="text-xs font-bold uppercase text-slate-500 mb-2">Terms & Conditions</p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Payment is due within 30 days of invoice date. Please include the invoice number with your payment.
            For any queries, contact support@smartisp.com.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center">
          <p className="text-xs text-slate-500">Thank you for your business!</p>
          <p className="text-xs text-slate-400 mt-1">This is a computer-generated invoice and does not require a signature.</p>
        </div>
      </div>
    </div>
  );
}