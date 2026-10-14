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

interface Invoice {
  id: number;
  invoice: string;
  date: string;
  due: string;
  total: number;
  status: "Paid" | "Unpaid" | "Overdue" | "Partial";
  customer: string;
}

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

// 🎯 Theme-Connected Status Config
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any; label: string }> = {
  Paid: {
    color: "text-success",
    bg: "bg-success-tint",
    border: "border-success/30",
    icon: CheckCircle2,
    label: "Paid",
  },
  Unpaid: {
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    icon: XCircle,
    label: "Unpaid",
  },
  Overdue: {
    color: "text-warning",
    bg: "bg-warning-tint",
    border: "border-warning/30",
    icon: AlertTriangle,
    label: "Overdue",
  },
  Partial: {
    color: "text-signal",
    bg: "bg-signal-tint",
    border: "border-signal/30",
    icon: Clock,
    label: "Partial",
  },
};

export default function InvoicesPage() {
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"All" | "Paid" | "Unpaid" | "Overdue">("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInvoices = useMemo(() => {
    let result = mockInvoices;

    if (activeTab !== "All") {
      result = result.filter((inv) => inv.status === activeTab);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (inv) =>
          inv.invoice.includes(q) ||
          inv.customer.toLowerCase().includes(q) ||
          inv.status.toLowerCase().includes(q)
      );
    }

    return result;
  }, [activeTab, searchTerm]);

  const stats = useMemo(() => {
    const total = mockInvoices.reduce((acc, i) => acc + i.total, 0);
    const paid = mockInvoices
      .filter((i) => i.status === "Paid")
      .reduce((acc, i) => acc + i.total, 0);
    const unpaid = mockInvoices
      .filter((i) => i.status === "Unpaid" || i.status === "Partial")
      .reduce((acc, i) => acc + i.total, 0);
    const overdue = mockInvoices
      .filter((i) => i.status === "Overdue")
      .reduce((acc, i) => acc + i.total, 0);
    return { total, paid, unpaid, overdue };
  }, []);

  const paidPercent = Math.round((stats.paid / stats.total) * 100);
  const unpaidPercent = Math.round((stats.unpaid / stats.total) * 100);
  const overduePercent = Math.round((stats.overdue / stats.total) * 100);

  const tabs = [
    { key: "All", label: "All", count: mockInvoices.length },
    { key: "Paid", label: "Paid", count: mockInvoices.filter((i) => i.status === "Paid").length },
    { key: "Unpaid", label: "Unpaid", count: mockInvoices.filter((i) => i.status === "Unpaid").length },
    { key: "Overdue", label: "Overdue", count: mockInvoices.filter((i) => i.status === "Overdue").length },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* Sticky Action Bar */}
        <div
          className="sticky top-[64px] z-30 border-b border-slate-200"
          style={{
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-2">
              <Link
                href="/admin/reports/invoices/create"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                Create Invoice
              </Link>
              <Link
                href="/admin/reports/invoices/download"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:text-signal hover:shadow-md transition-all whitespace-nowrap"
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
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
              Invoices
            </h1>
          </div>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">৳{stats.total.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Paid</p>
                <p className="text-lg font-heading font-bold text-success">৳{stats.paid.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4 text-destructive" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Unpaid</p>
                <p className="text-lg font-heading font-bold text-destructive">৳{stats.unpaid.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Overdue</p>
                <p className="text-lg font-heading font-bold text-warning">৳{stats.overdue.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Payment Distribution
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {mockInvoices.length} Invoices
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-slate-100">
              <div
                className="bg-success transition-all"
                style={{ width: `${paidPercent}%` }}
                title={`Paid: ${paidPercent}%`}
              />
              <div
                className="bg-destructive transition-all"
                style={{ width: `${unpaidPercent}%` }}
                title={`Unpaid: ${unpaidPercent}%`}
              />
              <div
                className="bg-warning transition-all"
                style={{ width: `${overduePercent}%` }}
                title={`Overdue: ${overduePercent}%`}
              />
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" /> Paid ({paidPercent}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-destructive" /> Unpaid ({unpaidPercent}%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning" /> Overdue ({overduePercent}%)
              </span>
            </div>
          </div>

          {/* Tabs + Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all",
                    activeTab === tab.key
                      ? "bg-white shadow-sm text-signal"
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-md text-[10px]",
                      activeTab === tab.key
                        ? "bg-signal-tint text-signal"
                        : "bg-white text-slate-500"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search by invoice no, customer or status…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* Actions */}
            <button
              onClick={() => router.push("/admin/reports/invoices/download")}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-signal hover:shadow-md transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
            <button
              onClick={() => setReportOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-signal text-white text-sm font-semibold hover:bg-signal-hover hover:scale-105 transition-all shadow-md"
            >
              <Filter className="h-3.5 w-3.5" />
              Report
            </button>
          </div>

          {/* Enhanced Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-signal text-white">
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        Invoice No. <ArrowUpDown className="h-3 w-3 opacity-70" />
                      </div>
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      Customer
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      Invoice Date
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      Due Date
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      Total
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length > 0 ? (
                    filteredInvoices.map((inv) => {
                      const sc = statusConfig[inv.status];
                      const StatusIcon = sc.icon;
                      return (
                        <tr
                          key={inv.id}
                          className="border-t border-slate-100 hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-8 h-8 rounded-lg flex items-center justify-center border",
                                  sc.bg,
                                  sc.border
                                )}
                              >
                                <Receipt className={cn("h-4 w-4", sc.color)} />
                              </div>
                              <span className="font-mono font-bold text-signal">
                                #{inv.invoice}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-semibold text-signal">{inv.customer}</span>
                          </td>
                          <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                            {inv.date}
                          </td>
                          <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                            {inv.due}
                          </td>
                          <td className="px-5 py-4">
                            <span className="font-bold text-base text-signal">
                              ৳{inv.total.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border",
                                sc.bg,
                                sc.color,
                                sc.border
                              )}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={`/admin/reports/invoices/view/${inv.id}`}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                                title="View"
                              >
                                <Eye className="h-4 w-4" />
                              </Link>

                              <Link
                                href={`/admin/reports/invoices/print/${inv.id}`}
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-violet-accent transition-colors"
                                title="Print"
                              >
                                <Printer className="h-4 w-4" />
                              </Link>

                              <Link
                                href="/admin/reports/invoices/download"
                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-success transition-colors"
                                title="Download"
                              >
                                <Download className="h-4 w-4" />
                              </Link>

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
                      <td colSpan={7} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center">
                            <FileText className="h-8 w-8 text-signal" />
                          </div>
                          <p className="font-semibold text-signal">No invoices found</p>
                          <p className="text-xs text-slate-500">
                            Try adjusting your filters or search term.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-signal">1-{filteredInvoices.length}</span>
                <span>of</span>
                <span className="font-semibold text-signal">{filteredInvoices.length}</span>
                <span>invoices</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50"
                  disabled
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-bold text-xs flex items-center justify-center shadow-md">
                  1
                </button>
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

      {/* Advanced Invoice Report Modal */}
      <SidePanelModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Invoice Report"
        confirmLabel="Generate Report"
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">POP In-charge</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose Pop in charge" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Server</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose Server" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Zone</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="opt1">Option 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Sub Zone</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Protocol</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Status</label>
            <Select defaultValue="success">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 col-span-2">
            <label className="text-sm font-semibold text-signal">Pay Method</label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Date From</label>
            <div className="relative">
              <Input placeholder="mm/dd/yyyy" className="pr-9" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-signal">Date To</label>
            <div className="relative">
              <Input placeholder="mm/dd/yyyy" className="pr-9" />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>
      </SidePanelModal>
    </div>
  );
}