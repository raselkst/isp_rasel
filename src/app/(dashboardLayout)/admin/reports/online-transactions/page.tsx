"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Send,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Eye,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  CreditCard,
  Smartphone,
  Zap,
  Receipt,
  BarChart3,
  FileText,
  FileSpreadsheet,
  FileJson,
  ArrowUpDown,
  Copy,
  Check,
  Wallet,
  DollarSign,
  Users,
  Globe,
} from "lucide-react";

interface Transaction {
  id: number;
  invoice: string;
  name: string;
  mobile: string;
  type: "bKash" | "Nagad" | "Rocket" | "Card";
  req: string;
  pay: string;
  status: "Paid" | "Pending" | "Failed";
  total: number;
  txn: string;
  gateway: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, invoice: "R4768454", name: "Md Sumon Ali", mobile: "01728601080", type: "bKash", req: "13/03/25", pay: "13/03/25", status: "Paid", total: 500, txn: "CCD8K75FYW", gateway: "bkash" },
  { id: 2, invoice: "R4768455", name: "Rahim Uddin", mobile: "01710626699", type: "Nagad", req: "13/03/25", pay: "13/03/25", status: "Paid", total: 1200, txn: "NGD9A21BXC", gateway: "nagad" },
  { id: 3, invoice: "R4768456", name: "Karim Ali", mobile: "01711223344", type: "bKash", req: "13/03/25", pay: "—", status: "Pending", total: 800, txn: "PND7K88YZQ", gateway: "bkash" },
  { id: 4, invoice: "R4768457", name: "Jamal Hossain", mobile: "01711556677", type: "Card", req: "12/03/25", pay: "12/03/25", status: "Paid", total: 2000, txn: "CRD5M31PLK", gateway: "sslcommerz" },
  { id: 5, invoice: "R4768458", name: "Sultana Begum", mobile: "01711889900", type: "Rocket", req: "12/03/25", pay: "—", status: "Failed", total: 350, txn: "RKT2B95QWX", gateway: "rocket" },
  { id: 6, invoice: "R4768459", name: "Rafiq Islam", mobile: "01711334455", type: "bKash", req: "12/03/25", pay: "12/03/25", status: "Paid", total: 1500, txn: "BKS8N47TRM", gateway: "bkash" },
  { id: 7, invoice: "R4768460", name: "Nasir Ahmed", mobile: "01711778899", type: "Nagad", req: "11/03/25", pay: "11/03/25", status: "Paid", total: 900, txn: "NGD4C12VHK", gateway: "nagad" },
  { id: 8, invoice: "R4768461", name: "Sabbir Rahman", mobile: "01711556688", type: "bKash", req: "11/03/25", pay: "11/03/25", status: "Paid", total: 700, txn: "BKS6D78WLP", gateway: "bkash" },
];

// 🎯 Pay Type Config — Theme Connected
const payTypeConfig: Record<string, { color: string; bg: string; icon: any }> = {
  bKash: { color: "text-signal", bg: "bg-signal-tint", icon: Smartphone },
  Nagad: { color: "text-warning", bg: "bg-warning-tint", icon: Zap },
  Rocket: { color: "text-violet-accent", bg: "bg-violet-accent-tint", icon: Send },
  Card: { color: "text-success", bg: "bg-success-tint", icon: CreditCard },
};

// 🎯 Status Config — Theme Connected
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  Paid: { color: "text-success", bg: "bg-success-tint", border: "border-success/30", icon: CheckCircle2 },
  Pending: { color: "text-warning", bg: "bg-warning-tint", border: "border-warning/30", icon: Clock },
  Failed: { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", icon: XCircle },
};

export default function OnlineTransactionsPage() {
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Pending" | "Failed">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const exportMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target as Node)) {
        setExportMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const stats = useMemo(() => {
    const today = mockTransactions
      .filter(t => t.req === "13/03/25")
      .reduce((acc, t) => acc + t.total, 0);
    const thisWeek = mockTransactions.reduce((acc, t) => acc + t.total, 0);
    const thisMonth = thisWeek;
    const lastMonth = 70000;
    const paid = mockTransactions.filter(t => t.status === "Paid").reduce((acc, t) => acc + t.total, 0);
    const pending = mockTransactions.filter(t => t.status === "Pending").reduce((acc, t) => acc + t.total, 0);
    const failed = mockTransactions.filter(t => t.status === "Failed").reduce((acc, t) => acc + t.total, 0);
    const bkash = mockTransactions.filter(t => t.type === "bKash").reduce((acc, t) => acc + t.total, 0);
    const nagad = mockTransactions.filter(t => t.type === "Nagad").reduce((acc, t) => acc + t.total, 0);
    const rocket = mockTransactions.filter(t => t.type === "Rocket").reduce((acc, t) => acc + t.total, 0);
    const card = mockTransactions.filter(t => t.type === "Card").reduce((acc, t) => acc + t.total, 0);
    return { today, thisWeek, thisMonth, lastMonth, paid, pending, failed, bkash, nagad, rocket, card };
  }, []);

  const filteredTransactions = useMemo(() => {
    let result = mockTransactions;
    if (activeTab !== "All") result = result.filter(t => t.status === activeTab);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(t =>
        t.invoice.toLowerCase().includes(q) ||
        t.name.toLowerCase().includes(q) ||
        t.mobile.includes(q) ||
        t.txn.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeTab, searchTerm]);

  const totalForBar = stats.bkash + stats.nagad + stats.rocket + stats.card || 1;
  const bkashPct = Math.round((stats.bkash / totalForBar) * 100);
  const nagadPct = Math.round((stats.nagad / totalForBar) * 100);
  const rocketPct = Math.round((stats.rocket / totalForBar) * 100);
  const cardPct = 100 - bkashPct - nagadPct - rocketPct;

  const tabs = [
    { key: "All", label: "All", count: mockTransactions.length },
    { key: "Paid", label: "Paid", count: mockTransactions.filter(t => t.status === "Paid").length },
    { key: "Pending", label: "Pending", count: mockTransactions.filter(t => t.status === "Pending").length },
    { key: "Failed", label: "Failed", count: mockTransactions.filter(t => t.status === "Failed").length },
  ];

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportAsCSV = () => {
    const headers = ["Invoice", "Name", "Mobile", "Type", "Req", "Pay", "Status", "Total", "Txn", "Gateway"];
    const rows = filteredTransactions.map(t => [t.invoice, t.name, t.mobile, t.type, t.req, t.pay, t.status, t.total, t.txn, t.gateway]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    downloadFile(csv, `online-transactions-${Date.now()}.csv`, "text/csv");
  };

  const exportAsJSON = () => {
    downloadFile(JSON.stringify(filteredTransactions, null, 2), `online-transactions-${Date.now()}.json`, "application/json");
  };

  const exportAsExcel = () => {
    const headers = ["Invoice", "Name", "Mobile", "Type", "Req", "Pay", "Status", "Total", "Txn", "Gateway"];
    const rows = filteredTransactions.map(t => [t.invoice, t.name, t.mobile, t.type, t.req, t.pay, t.status, t.total, t.txn, t.gateway]);
    const tsv = [headers, ...rows].map(r => r.join("\t")).join("\n");
    downloadFile(tsv, `online-transactions-${Date.now()}.xls`, "application/vnd.ms-excel");
  };

  const exportAsPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = `
      <html><head><title>Online Transactions Report</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #066F6F; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
        th { background: #066F6F; color: white; }
        tr:nth-child(even) { background: #f9f9f9; }
      </style></head><body>
        <h1>Online Transactions Report</h1>
        <p>Generated: ${new Date().toLocaleString()} | Total: ${filteredTransactions.length} transactions</p>
        <table><thead><tr><th>Invoice</th><th>Name</th><th>Mobile</th><th>Type</th><th>Status</th><th>Total</th><th>Txn</th><th>Gateway</th></tr></thead>
        <tbody>${filteredTransactions.map(t => `<tr><td>${t.invoice}</td><td>${t.name}</td><td>${t.mobile}</td><td>${t.type}</td><td>${t.status}</td><td>৳${t.total}</td><td>${t.txn}</td><td>${t.gateway}</td></tr>`).join("")}</tbody></table>
      </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Globe className="h-3 w-3" />
              Digital Payment Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
              Online Transactions
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Track all digital payment transactions in real-time.
            </p>
          </div>

          {/* Stat Cards — Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal flex items-center justify-center text-white shrink-0 shadow-sm">
                <Send className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Today</p>
                <p className="text-lg font-heading font-bold text-signal">৳{stats.today.toLocaleString()}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-success-tint text-success shrink-0">+12%</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success flex items-center justify-center text-white shrink-0 shadow-sm">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Week</p>
                <p className="text-lg font-heading font-bold text-success">৳{stats.thisWeek.toLocaleString()}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-success-tint text-success shrink-0">+8%</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-violet-accent flex items-center justify-center text-white shrink-0 shadow-sm">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Month</p>
                <p className="text-lg font-heading font-bold text-violet-accent">৳{stats.thisMonth.toLocaleString()}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-success-tint text-success shrink-0">+15%</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning flex items-center justify-center text-white shrink-0 shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Last Month</p>
                <p className="text-lg font-heading font-bold text-warning">৳{stats.lastMonth.toLocaleString()}</p>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive shrink-0">-3%</span>
            </div>
          </div>

          {/* Gateway Distribution Bar — Theme Connected */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-signal">
                <BarChart3 className="h-4 w-4" />
                Gateway Distribution
              </h3>
              <span className="text-xs text-slate-500">{mockTransactions.length} transactions</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
              <div className="bg-signal transition-all" style={{ width: `${bkashPct}%` }} />
              <div className="bg-warning transition-all" style={{ width: `${nagadPct}%` }} />
              <div className="bg-violet-accent transition-all" style={{ width: `${rocketPct}%` }} />
              <div className="bg-success transition-all" style={{ width: `${cardPct}%` }} />
            </div>
            <div className="flex flex-wrap items-center gap-5 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-signal" /> bKash ({bkashPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning" /> Nagad ({nagadPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-violet-accent" /> Rocket ({rocketPct}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success" /> Card ({cardPct}%)</span>
            </div>
          </div>

          {/* Filter Tabs + Search + Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.key ? "bg-white shadow-sm text-signal" : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px]",
                    activeTab === tab.key ? "bg-signal-tint text-signal" : "bg-slate-200 text-slate-500"
                  )}>{tab.count}</span>
                </button>
              ))}
            </div>

            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search invoice, name, mobile, txn…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            <div className="relative" ref={exportMenuRef}>
              <button
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-signal hover:shadow-md transition-all"
              >
                <Download className="h-3.5 w-3.5" />
                Export
              </button>

              {exportMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-40">
                  {[
                    { label: "Export as PDF", icon: FileText, action: exportAsPDF },
                    { label: "Export as Excel", icon: FileSpreadsheet, action: exportAsExcel },
                    { label: "Export as CSV", icon: FileText, action: exportAsCSV },
                    { label: "Export as JSON", icon: FileJson, action: exportAsJSON },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => { item.action(); setExportMenuOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors text-left text-signal"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden overflow-x-auto shadow-sm">
            <table className="w-full text-sm min-w-[1200px]">
              <thead>
                <tr className="bg-signal text-white">
                  {["Invoice ID", "Payee Name", "Payee Mobile", "Pay Type", "Req. Time", "Pay Time", "Status", "Total", "Bank Txn", "Gateway", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => {
                    const pc = payTypeConfig[t.type] || payTypeConfig.Card;
                    const sc = statusConfig[t.status];
                    const PayIcon = pc.icon;
                    const StatusIcon = sc.icon;

                    return (
                      <tr key={t.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sc.bg)}>
                              <Receipt className={cn("h-4 w-4", sc.color)} />
                            </div>
                            <span className="font-mono font-bold text-signal">{t.invoice}</span>
                            <button
                              onClick={() => handleCopy(t.invoice)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-slate-100"
                              title="Copy Invoice ID"
                            >
                              {copiedId === t.invoice ? (
                                <Check className="h-3 w-3 text-success" />
                              ) : (
                                <Copy className="h-3 w-3 text-slate-400" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-semibold text-signal">{t.name}</td>
                        <td className="px-4 py-4 font-mono text-xs text-slate-600">{t.mobile}</td>
                        <td className="px-4 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold", pc.bg, pc.color)}>
                            <PayIcon className="h-3.5 w-3.5" />
                            {t.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">{t.req}</td>
                        <td className="px-4 py-4 text-slate-500 text-xs whitespace-nowrap">{t.pay}</td>
                        <td className="px-4 py-4">
                          <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border", sc.bg, sc.color, sc.border)}>
                            <StatusIcon className="h-3.5 w-3.5" />
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 font-bold text-base text-signal">৳{t.total.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono text-xs text-slate-500">{t.txn}</td>
                        <td className="px-4 py-4 text-xs text-slate-500">{t.gateway}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                              title="More"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={11} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-signal-tint flex items-center justify-center mb-4">
                          <Wallet className="h-9 w-9 text-signal" />
                        </div>
                        <p className="font-heading font-bold text-lg text-signal">No transactions found</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {searchTerm || activeTab !== "All" ? "Try adjusting your filters or search term." : "No online transactions available."}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-signal">1-{filteredTransactions.length}</span>
                <span>of</span>
                <span className="font-semibold text-signal">{filteredTransactions.length}</span>
                <span>entries</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">1</button>
                <button
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                  disabled
                >
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