"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { SidePanelModal } from "@/components/billing/side-panel-modal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Eye,
  MoreVertical,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  Receipt,
  Printer,
  ArrowUpDown,
  Plus,
} from "lucide-react";

// 🎯 ইনভয়েস ডেটা টাইপ
interface Invoice {
  id: number;
  invoice: string;
  date: string;
  due: string;
  total: number;
  status: "Paid" | "Unpaid" | "Overdue" | "Partial";
  customer: string;
}

// 🎯 ডামি ডেটা
const mockInvoices: Invoice[] = [
  { id: 1, invoice: "872193", date: "Tue, Jan 27, 2026", due: "Tue, Jan 27, 2026", total: 1000, status: "Unpaid", customer: "Rahim Uddin" },
  { id: 2, invoice: "872194", date: "Mon, Jan 26, 2026", due: "Wed, Feb 05, 2026", total: 1500, status: "Paid", customer: "Karim Ali" },
  { id: 3, invoice: "872195", date: "Sun, Jan 25, 2026", due: "Tue, Feb 04, 2026", total: 2000, status: "Paid", customer: "Jamal Hossain" },
  { id: 4, invoice: "872196", date: "Sat, Jan 24, 2026", due: "Mon, Feb 03, 2026", total: 800, status: "Overdue", customer: "Sultana Begum" },
  { id: 5, invoice: "872197", date: "Fri, Jan 23, 2026", due: "Sun, Feb 02, 2026", total: 1200, status: "Partial", customer: "Rafiq Islam" },
  { id: 6, invoice: "872198", date: "Thu, Jan 22, 2026", due: "Sat, Feb 01, 2026", total: 2500, status: "Paid", customer: "Nasir Ahmed" },
  { id: 7, invoice: "872199", date: "Wed, Jan 21, 2026", due: "Fri, Jan 31, 2026", total: 900, status: "Unpaid", customer: "Sabbir Rahman" },
  { id: 8, invoice: "872200", date: "Tue, Jan 20, 2026", due: "Thu, Jan 30, 2026", total: 1800, status: "Paid", customer: "Mizanur Rahman" },
];

// 🎯 স্টেটাস অনুযায়ী কালার ও আইকন
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any; label: string }> = {
  Paid: { color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2, label: "Paid" },
  Unpaid: { color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle, label: "Unpaid" },
  Overdue: { color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: AlertTriangle, label: "Overdue" },
  Partial: { color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Clock, label: "Partial" },
};

export default function InvoicesPage() {
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Unpaid" | "Overdue">("All");
  const [searchTerm, setSearchTerm] = useState("");

  // 🎯 ফিল্টার ও সার্চ
  const filteredInvoices = useMemo(() => {
    let result = mockInvoices;

    if (activeTab !== "All") {
      result = result.filter(inv => inv.status === activeTab);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(inv =>
        inv.invoice.includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeTab, searchTerm]);

  // 🎯 স্ট্যাট ক্যালকুলেশন
  const stats = useMemo(() => {
    const total = mockInvoices.reduce((acc, i) => acc + i.total, 0);
    const paid = mockInvoices.filter(i => i.status === "Paid").reduce((acc, i) => acc + i.total, 0);
    const unpaid = mockInvoices.filter(i => i.status === "Unpaid" || i.status === "Partial").reduce((acc, i) => acc + i.total, 0);
    const overdue = mockInvoices.filter(i => i.status === "Overdue").reduce((acc, i) => acc + i.total, 0);
    return { total, paid, unpaid, overdue };
  }, []);

  // 🎯 প্রগ্রেস বার ক্যালকুলেশন
  const paidPercent = Math.round((stats.paid / stats.total) * 100);
  const unpaidPercent = Math.round((stats.unpaid / stats.total) * 100);
  const overduePercent = Math.round((stats.overdue / stats.total) * 100);

  // 🎯 Tab Config
  const tabs = [
    { key: "All", label: "All", count: mockInvoices.length },
    { key: "Paid", label: "Paid", count: mockInvoices.filter(i => i.status === "Paid").length },
    { key: "Unpaid", label: "Unpaid", count: mockInvoices.filter(i => i.status === "Unpaid").length },
    { key: "Overdue", label: "Overdue", count: mockInvoices.filter(i => i.status === "Overdue").length },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* 🎯 Sticky Action Bar */}
        <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/reports/invoices/create"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Create Invoice
              </Link>
              <Link
                href="/admin/reports/invoices/download"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                Download
              </Link>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Financial Management
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Invoices
            </h1>
          </div>

         {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
      <DollarSign className="w-4 h-4 text-signal" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
      <p className="text-lg font-heading font-bold">৳{stats.total.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Paid</p>
      <p className="text-lg font-heading font-bold text-emerald-600">৳{stats.paid.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
      <XCircle className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Unpaid</p>
      <p className="text-lg font-heading font-bold text-red-600">৳{stats.unpaid.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <AlertTriangle className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Overdue</p>
      <p className="text-lg font-heading font-bold text-amber-600">৳{stats.overdue.toLocaleString()}</p>
    </div>
  </div>
</div>

          {/* 🎯 Payment Summary Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Distribution</span>
              <span className="text-xs font-semibold text-muted-foreground">{mockInvoices.length} Invoices</span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted">
              <div className="bg-emerald-500 transition-all" style={{ width: `${paidPercent}%` }} title={`Paid: ${paidPercent}%`} />
              <div className="bg-red-500 transition-all" style={{ width: `${unpaidPercent}%` }} title={`Unpaid: ${unpaidPercent}%`} />
              <div className="bg-amber-500 transition-all" style={{ width: `${overduePercent}%` }} title={`Overdue: ${overduePercent}%`} />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Paid ({paidPercent}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Unpaid ({unpaidPercent}%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Overdue ({overduePercent}%)</span>
            </div>
          </div>

          {/* 🎯 Tabs + Search Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-6 flex flex-wrap items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.key
                      ? "bg-card shadow-sm text-signal"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px]",
                    activeTab === tab.key ? "bg-signal/10 text-signal" : "bg-muted text-muted-foreground"
                  )}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search by invoice no, customer or status…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* Actions */}
            <button
              onClick={() => router.push("/admin/reports/invoices/download")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:shadow-md transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-signal to-violet-accent text-white text-sm font-semibold hover:scale-105 transition-all shadow-md shadow-signal/20"
            >
              <Filter className="h-3.5 w-3.5" />
              Report
            </button>
          </div>

          {/* 🎯 Enhanced Table */}
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">Invoice No. <ArrowUpDown className="h-3 w-3 opacity-70" /></div>
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Customer</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Invoice Date</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Due Date</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Total</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Status</th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => {
                      const sc = statusConfig[inv.status];
                      const StatusIcon = sc.icon;
                      return (
                        <tr key={inv.id} className="border-t hover:bg-signal-tint/30 transition-colors group">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", sc.bg)}>
                                <Receipt className={cn("h-4 w-4", sc.color)} />
                              </div>
                              <span className="font-mono font-bold text-signal">#{inv.invoice}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-semibold">{inv.customer}</span>
                          </td>
                          <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{inv.date}</td>
                          <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{inv.due}</td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-base">৳{inv.total.toLocaleString()}</span>
                          </td>
                          <td className="px-5 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border",
                              sc.bg, sc.color, sc.border
                            )}>
                              <StatusIcon className="h-3.5 w-3.5" />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {/* 👁️ View */}
                              <Link
                                href={`/admin/reports/invoices/view/${inv.id}`}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>

                              {/* 🖨️ Print */}
                              <Link
                                href={`/admin/reports/invoices/print/${inv.id}`}
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-violet-500 transition-colors"
                                title="Print"
                              >
                                <Printer className="h-4 w-4" />
                              </Link>

                              {/* ⬇️ Download */}
                              <Link
                                href="/admin/reports/invoices/download"
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-emerald-500 transition-colors"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Link>

                              {/* ⋮ More */}
                              <button
                                className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
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
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold">No invoices found</p>
                          <p className="text-xs text-muted-foreground">Try adjusting your filters or search term.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 🎯 Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{filteredInvoices.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredInvoices.length}</span>
                <span>invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">1</button>
                <button className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎯 Advanced Invoice Report Modal */}
      <SidePanelModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Invoice Report"
        confirmLabel="Generate Report"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">POP In-charge</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choose Pop in charge" /></SelectTrigger>
              <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Server</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choose Server" /></SelectTrigger>
              <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Zone</label>
            <Select>
              <SelectTrigger><SelectValue placeholder="Choose Zone" /></SelectTrigger>
              <SelectContent><SelectItem value="opt1">Option 1</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Sub Zone</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Protocol</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Status</label>
            <Select defaultValue="success">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 col-span-2">
            <label className="text-sm font-semibold">Pay Method</label>
            <Select defaultValue="all">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">All</SelectItem></SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Date From</label>
            <div className="relative">
              <Input placeholder="mm/dd/yyyy" className="pr-9" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Date To</label>
            <div className="relative">
              <Input placeholder="mm/dd/yyyy" className="pr-9" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </SidePanelModal>
    </div>
  );
}