"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintRechargeHistoryPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  const transactions = [
    { ref: "4768467", initiator: "TNRSOFT-Refayetpur Network", pop: "Md Sumon Ali", debit: 250, credit: null, balance: 326, time: "2025-03-13", desc: "AC#862649 User#Sp00131 Renewal" },
    { ref: "4768468", initiator: "TNRSOFT-Refayetpur Network", pop: "Md Sumon Ali", debit: null, credit: 500, balance: 826, time: "2025-03-12", desc: "Top-up via bKash" },
    { ref: "4768469", initiator: "TNRSOFT-Refayetpur Network", pop: "Karim Hossain", debit: 300, credit: null, balance: 526, time: "2025-03-12", desc: "AC#862650 User#Sp00132 Renewal" },
  ];

  return (
    <div className="min-h-screen bg-white p-8 print:p-4">
      {/* Action Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex items-center justify-between print:hidden">
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
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      {/* Printable Area */}
      <div className="max-w-6xl mx-auto bg-white text-slate-900">
        <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">RECHARGE HISTORY REPORT</h1>
            <p className="text-sm text-slate-600 mt-1">SmartISP Pvt. Ltd.</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>Generated: {new Date().toLocaleString()}</p>
            <p>Total Transactions: {transactions.length}</p>
          </div>
        </div>

        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-900 text-white">
              {["SL", "Ref", "Initiator", "Pop", "Debit", "Credit", "Balance", "Time", "Description"].map((h) => (
                <th key={h} className="text-left px-3 py-2 font-bold uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-b border-slate-200">
                <td className="px-3 py-2">{i + 1}</td>
                <td className="px-3 py-2 font-mono">{t.ref}</td>
                <td className="px-3 py-2">{t.initiator}</td>
                <td className="px-3 py-2">{t.pop}</td>
                <td className="px-3 py-2 text-red-600 font-bold">{t.debit ? `৳${t.debit}` : "—"}</td>
                <td className="px-3 py-2 text-emerald-600 font-bold">{t.credit ? `৳${t.credit}` : "—"}</td>
                <td className="px-3 py-2 font-bold">৳{t.balance}</td>
                <td className="px-3 py-2">{t.time}</td>
                <td className="px-3 py-2">{t.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 pt-4 border-t text-center text-xs text-slate-500">
          <p>This is a computer-generated report.</p>
        </div>
      </div>
    </div>
  );
}