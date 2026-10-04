"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Clock,
  EyeOff,
  Search,
  CheckCircle2,
  XCircle,
  Send,
  LayoutGrid,
  List,
  Filter,
  Download,
  Phone,
  Calendar,
  Server,
  Code2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Copy,
  Trash2,
  TrendingUp,
  Zap,
  AlertTriangle,
  Inbox,
  Sparkles,
} from "lucide-react";

// 🎯 SMS ডেটা টাইপ
interface SmsRecord {
  id: string;
  phone: string;
  message: string;
  count: number;
  status: "Sent" | "Pending" | "Failed";
  date: string;
  gateway: string;
  response: string;
}

// 🎯 ডামি ডেটা
const mockSms: SmsRecord[] = [
  {
    id: "4443868",
    phone: "01921183037",
    message: "Dear Md: Masud Jahanger, Welcome to Refayetpur Broadband Network Wi-Fi Your username: Sp00131 and password: bokul Expire: 13-04-2025 12:00 PM",
    count: 1,
    status: "Sent",
    date: "2025-03-13",
    gateway: "custom",
    response: '{"success":true,"data":{"messageId":"SMS-9921"},"error":null}',
  },
  {
    id: "4443869",
    phone: "01711223344",
    message: "Your monthly bill of ৳1000 is due on 15-04-2025. Please pay to avoid disconnection.",
    count: 1,
    status: "Sent",
    date: "2025-03-13",
    gateway: "bkash",
    response: '{"success":true,"data":{"messageId":"SMS-9922"},"error":null}',
  },
  {
    id: "4443870",
    phone: "01711556677",
    message: "Your OTP is 847291. Valid for 5 minutes. Do not share with anyone.",
    count: 1,
    status: "Pending",
    date: "2025-03-14",
    gateway: "custom",
    response: '{"success":false,"data":null,"error":{"code":102,"message":"Gateway timeout"}}',
  },
  {
    id: "4443871",
    phone: "01711889900",
    message: "Congratulations! Your internet package has been upgraded to 20Mbps.",
    count: 2,
    status: "Sent",
    date: "2025-03-14",
    gateway: "custom",
    response: '{"success":true,"data":{"messageId":"SMS-9924"},"error":null}',
  },
  {
    id: "4443872",
    phone: "01711334455",
    message: "Dear customer, your service has been temporarily suspended due to non-payment.",
    count: 1,
    status: "Failed",
    date: "2025-03-15",
    gateway: "custom",
    response: '{"success":false,"data":null,"error":{"code":401,"message":"This API key is invalid."}}',
  },
];

// 🎯 স্টেটাস কনফিগ
const statusConfig: Record<string, { color: string; bg: string; border: string; icon: any }> = {
  Sent: { color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2 },
  Pending: { color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: Clock },
  Failed: { color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle },
};

export default function SmsHistoryPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"All" | "Sent" | "Pending" | "Failed">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 🎯 স্ট্যাট ক্যালকুলেশন
  const stats = useMemo(() => {
    const sent = mockSms.filter(s => s.status === "Sent").length;
    const pending = mockSms.filter(s => s.status === "Pending").length;
    const failed = mockSms.filter(s => s.status === "Failed").length;
    const total = mockSms.length;
    return { sent, pending, failed, total };
  }, []);

  // 🎯 ফিল্টার ও সার্চ
  const filteredSms = useMemo(() => {
    let result = mockSms;
    if (activeTab !== "All") {
      result = result.filter(s => s.status === activeTab);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.phone.includes(q) ||
        s.message.toLowerCase().includes(q) ||
        s.id.includes(q)
      );
    }
    return result;
  }, [activeTab, searchTerm]);

  // 🎯 Delivery Rate
  const deliveryRate = Math.round((stats.sent / stats.total) * 100);

  // 🎯 Tab Config
  const tabs = [
    { key: "All", label: "All", count: mockSms.length },
    { key: "Sent", label: "Sent", count: stats.sent },
    { key: "Pending", label: "Pending", count: stats.pending },
    { key: "Failed", label: "Failed", count: stats.failed },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* 🎯 Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Communication Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              SMS History
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track and analyze all SMS sent from your system.
            </p>
          </div>

          {/* 🎯 Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
      <MessageSquare className="w-4 h-4 text-signal" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">This Month</p>
      <p className="text-lg font-heading font-bold text-signal">350</p>
    </div>
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 shrink-0">+12%</span>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
      <Inbox className="w-4 h-4 text-violet-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Last Month</p>
      <p className="text-lg font-heading font-bold text-violet-600">250</p>
    </div>
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 shrink-0">+8%</span>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
      <Clock className="w-4 h-4 text-amber-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Pending</p>
      <p className="text-lg font-heading font-bold text-amber-600">{stats.pending}</p>
    </div>
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0">0%</span>
  </div>

  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <EyeOff className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Masking</p>
      <p className="text-lg font-heading font-bold text-emerald-600">00</p>
    </div>
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground shrink-0">0%</span>
  </div>
</div>

          {/* 🎯 Delivery Rate Visualizer */}
          <div className="bg-card rounded-2xl border p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery Rate</p>
                <p className="text-2xl font-heading font-bold text-emerald-600 mt-0.5">{deliveryRate}%</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Sent ({stats.sent})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Pending ({stats.pending})</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Failed ({stats.failed})</span>
              </div>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted">
              <div className="bg-emerald-500 transition-all" style={{ width: `${(stats.sent / stats.total) * 100}%` }} />
              <div className="bg-amber-500 transition-all" style={{ width: `${(stats.pending / stats.total) * 100}%` }} />
              <div className="bg-red-500 transition-all" style={{ width: `${(stats.failed / stats.total) * 100}%` }} />
            </div>
          </div>

          {/* 🎯 Tabs + Search + View Toggle */}
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
                placeholder="Search by phone, message or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "grid" ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  viewMode === "list" ? "bg-card shadow-sm text-signal" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-semibold hover:shadow-md transition-all">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>

          {/* 🎯 Grid View (SMS Bubble Cards) */}
          {viewMode === "grid" && filteredSms.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredSms.map((sms) => {
                const sc = statusConfig[sms.status];
                const StatusIcon = sc.icon;
                const isExpanded = expandedId === sms.id;
                const responseObj = JSON.parse(sms.response);
                const isSuccess = responseObj.success;

                return (
                  <div
                    key={sms.id}
                    className={cn(
                      "group bg-card rounded-2xl border-2 p-5 transition-all duration-300 hover:shadow-xl overflow-hidden",
                      sc.border
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", sc.bg)}>
                          <Phone className={cn("h-5 w-5", sc.color)} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-mono font-bold text-sm">{sms.phone}</p>
                          <p className="text-[10px] text-muted-foreground">ID: {sms.id}</p>
                        </div>
                      </div>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border shrink-0",
                        sc.bg, sc.color, sc.border
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {sms.status}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div className="relative bg-muted/40 rounded-xl p-3 mb-3">
                      <p className={cn(
                        "text-xs text-foreground leading-relaxed transition-all",
                        !isExpanded && "line-clamp-3"
                      )}>
                        {sms.message}
                      </p>
                      {sms.message.length > 120 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : sms.id)}
                          className="text-[10px] font-bold text-signal mt-1 hover:underline"
                        >
                          {isExpanded ? "Show Less" : "Read More"}
                        </button>
                      )}
                    </div>

                    {/* Meta Info */}
                    <div className="grid grid-cols-3 gap-2 text-[10px] mb-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{sms.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Server className="h-3 w-3" />
                        <span>{sms.gateway}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Send className="h-3 w-3" />
                        <span>{sms.count} sent</span>
                      </div>
                    </div>

                    {/* API Response */}
                    <div className={cn(
                      "rounded-lg p-2.5 text-[10px] font-mono overflow-hidden",
                      isSuccess ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-red-500/5 border border-red-500/20"
                    )}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Code2 className={cn("h-3 w-3", isSuccess ? "text-emerald-600" : "text-red-600")} />
                        <span className={cn("font-bold", isSuccess ? "text-emerald-600" : "text-red-600")}>
                          {isSuccess ? "Success" : "Error"}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 break-all">{sms.response}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-signal transition-colors" title="Copy">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="More">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 🎯 List View (Table) */}
          {viewMode === "list" && filteredSms.length > 0 && (
            <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
              <table className="w-full text-sm min-w-[1300px]">
                <thead>
                  <tr className="bg-gradient-to-r from-signal to-violet-accent text-white">
                    {["ID", "Phone", "Message", "Count", "Status", "Date", "Gateway", "Response"].map((h) => (
                      <th key={h} className="text-left px-4 py-3.5 font-semibold text-[13px] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSms.map((sms) => {
                    const sc = statusConfig[sms.status];
                    const StatusIcon = sc.icon;
                    return (
                      <tr key={sms.id} className="border-t hover:bg-signal-tint/30 align-top transition-colors">
                        <td className="px-4 py-4 font-mono font-semibold text-signal">{sms.id}</td>
                        <td className="px-4 py-4 font-mono">{sms.phone}</td>
                        <td className="px-4 py-4 text-muted-foreground max-w-[280px] text-xs leading-relaxed">
                          {sms.message}
                        </td>
                        <td className="px-4 py-4 text-center">{sms.count}</td>
                        <td className="px-4 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border",
                            sc.bg, sc.color, sc.border
                          )}>
                            <StatusIcon className="h-3 w-3" />
                            {sms.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{sms.date}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold uppercase">{sms.gateway}</span>
                        </td>
                        <td className="px-4 py-4 text-muted-foreground max-w-[300px] font-mono text-[11px] break-all">
                          {sms.response}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 🎯 Empty State */}
          {filteredSms.length === 0 && (
            <div className="bg-card rounded-2xl border border-dashed p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-signal" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1">No SMS found</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchTerm ? "Try adjusting your search term." : "No SMS history available for this filter."}
              </p>
            </div>
          )}

          {/* 🎯 Pagination */}
          {filteredSms.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Showing</span>
                <span className="font-semibold text-foreground">1-{filteredSms.length}</span>
                <span>of</span>
                <span className="font-semibold text-foreground">{filteredSms.length}</span>
                <span>messages</span>
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
          )}
        </div>
      </div>
    </div>
  );
}