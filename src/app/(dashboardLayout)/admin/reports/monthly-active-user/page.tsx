"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Search,
  Calendar,
  Filter,
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Sparkles,
  Download,
  FileText,
  FileSpreadsheet,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle2,
  Clock,
  Zap,
  Info,
  Loader2,
} from "lucide-react";

// 🎯 রিপোর্ট ডেটা টাইপ
interface ReportRow {
  id: number;
  clientId: string;
  name: string;
  popInCharge: string;
  protocol: string;
  rechargeType: string;
  lastRecharge: string;
  amount: number;
  status: "Active" | "Inactive";
}

export default function MonthlyActiveUserReportPage() {
  const [formData, setFormData] = useState({
    month: "2026-09",
    popInCharge: "",
    rechargeType: "All",
    countBy: "Invoice Owner",
    protocol: "All",
    uniqueUserOnly: false,
  });

  const [reportType, setReportType] = useState<"detailed" | "summary" | "chart">("detailed");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // 🎯 ডামি রিপোর্ট ডেটা (API থেকে আসবে)
  const reportData: ReportRow[] = useMemo(() => [
    { id: 1, clientId: "C-10001", name: "Rahim Uddin", popInCharge: "Pop 1", protocol: "PPPoE", rechargeType: "Online", lastRecharge: "2026-09-25", amount: 1000, status: "Active" },
    { id: 2, clientId: "C-10002", name: "Karim Ali", popInCharge: "Pop 2", protocol: "Hotspot", rechargeType: "Manual", lastRecharge: "2026-09-24", amount: 500, status: "Active" },
    { id: 3, clientId: "C-10003", name: "Jamal Hossain", popInCharge: "Pop 1", protocol: "PPPoE", rechargeType: "Online", lastRecharge: "2026-09-23", amount: 1500, status: "Active" },
    { id: 4, clientId: "C-10004", name: "Sultana Begum", popInCharge: "Pop 3", protocol: "Static", rechargeType: "Manual", lastRecharge: "2026-09-22", amount: 2000, status: "Inactive" },
    { id: 5, clientId: "C-10005", name: "Rafiq Islam", popInCharge: "Pop 2", protocol: "PPPoE", rechargeType: "Online", lastRecharge: "2026-09-21", amount: 800, status: "Active" },
    { id: 6, clientId: "C-10006", name: "Nasir Ahmed", popInCharge: "Pop 1", protocol: "Hotspot", rechargeType: "Online", lastRecharge: "2026-09-20", amount: 1200, status: "Active" },
    { id: 7, clientId: "C-10007", name: "Sabbir Rahman", popInCharge: "Pop 3", protocol: "PPPoE", rechargeType: "Manual", lastRecharge: "2026-09-19", amount: 900, status: "Inactive" },
    { id: 8, clientId: "C-10008", name: "Mizanur Rahman", popInCharge: "Pop 2", protocol: "Static", rechargeType: "Online", lastRecharge: "2026-09-18", amount: 1800, status: "Active" },
  ], []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setShowResult(false);
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
      showToast("Report generated successfully!", "success");
    }, 1500);
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 🎯 CSV ডাউনলোড ফাংশন
  const downloadCSV = () => {
    const headers = ["SL", "Client ID", "Name", "POP In-charge", "Protocol", "Recharge Type", "Last Recharge", "Amount (৳)", "Status"];
    const rows = reportData.map((r, i) => [
      i + 1,
      r.clientId,
      r.name,
      r.popInCharge,
      r.protocol,
      r.rechargeType,
      r.lastRecharge,
      r.amount,
      r.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, `Monthly-Active-User-Report-${formData.month}.csv`);
  };

  // 🎯 Excel ডাউনলোড ফাংশন (HTML টেবিল দিয়ে .xls ফাইল)
  const downloadExcel = () => {
    const headers = ["SL", "Client ID", "Name", "POP In-charge", "Protocol", "Recharge Type", "Last Recharge", "Amount (৳)", "Status"];
    const rows = reportData.map((r, i) => [
      i + 1,
      r.clientId,
      r.name,
      r.popInCharge,
      r.protocol,
      r.rechargeType,
      r.lastRecharge,
      r.amount,
      r.status,
    ]);

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8"></head>
      <body>
        <table border="1">
          <thead>
            <tr style="background:#0F8B8D;color:#fff;">
              ${headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((c) => `<td>${c}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([tableHTML], { type: "application/vnd.ms-excel" });
    triggerDownload(blob, `Monthly-Active-User-Report-${formData.month}.xls`);
  };

  // 🎯 PDF ডাউনলোড ফাংশন (নতুন উইন্ডোতে প্রিন্ট-রেডি লেআউট)
  const downloadPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showToast("Please allow popups to download PDF", "error");
      return;
    }

    const tableHTML = `
      <html>
      <head>
        <title>Monthly Active User Report - ${formData.month}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 3px solid #0F8B8D; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          .header h1 { font-size: 24px; color: #0F8B8D; margin-bottom: 4px; }
          .header p { font-size: 12px; color: #64748b; }
          .meta { display: flex; gap: 30px; margin-bottom: 30px; padding: 20px; background: #f8fafc; border-radius: 12px; }
          .meta div { flex: 1; }
          .meta label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 4px; }
          .meta span { font-size: 14px; font-weight: 600; color: #1e293b; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          thead tr { background: #0F8B8D; color: #fff; }
          th { padding: 12px 10px; text-align: left; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          td { padding: 10px; font-size: 12px; border-bottom: 1px solid #e2e8f0; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          .status-active { color: #059669; font-weight: bold; }
          .status-inactive { color: #dc2626; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print { body { padding: 20px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>Monthly Active User Report</h1>
            <p>SmartISP Pvt. Ltd. • Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div style="width:60px;height:60px;background:linear-gradient(135deg,#0F8B8D,#8B5CF6);border-radius:12px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:24px;font-weight:bold;">S</div>
        </div>

        <div class="meta">
          <div><label>Month</label><span>${formData.month}</span></div>
          <div><label>POP In-charge</label><span>${formData.popInCharge || "All"}</span></div>
          <div><label>Protocol</label><span>${formData.protocol}</span></div>
          <div><label>Report Type</label><span style="text-transform:capitalize">${reportType}</span></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Client ID</th>
              <th>Name</th>
              <th>POP In-charge</th>
              <th>Protocol</th>
              <th>Recharge Type</th>
              <th>Last Recharge</th>
              <th>Amount (৳)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.map((r, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${r.clientId}</td>
                <td><strong>${r.name}</strong></td>
                <td>${r.popInCharge}</td>
                <td>${r.protocol}</td>
                <td>${r.rechargeType}</td>
                <td>${r.lastRecharge}</td>
                <td>${r.amount.toLocaleString()}</td>
                <td class="${r.status === "Active" ? "status-active" : "status-inactive"}">${r.status}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>This is a computer-generated report. © ${new Date().getFullYear()} SmartISP Pvt. Ltd.</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 300);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(tableHTML);
    printWindow.document.close();
  };

  // 🎯 Download Trigger Helper
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 🎯 Export Handler
  const handleExport = (format: "PDF" | "Excel" | "CSV") => {
    setExportingFormat(format);
    setTimeout(() => {
      try {
        if (format === "CSV") downloadCSV();
        else if (format === "Excel") downloadExcel();
        else if (format === "PDF") downloadPDF();

        setExportingFormat(null);
        showToast(
          format === "PDF"
            ? "PDF ready! Use the print dialog to save."
            : `${format} downloaded successfully!`,
          "success"
        );
      } catch (err) {
        setExportingFormat(null);
        showToast(`Failed to export ${format}. Please try again.`, "error");
      }
    }, 600);
  };

  const setQuickMonth = (offset: number) => {
    const d = new Date();
    d.setMonth(d.getMonth() + offset);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    setFormData((prev) => ({ ...prev, month: `${year}-${month}` }));
  };

  const previewStats = useMemo(() => ({
    totalUsers: 1248,
    activeUsers: 892,
    inactiveUsers: 356,
    growth: 12.5,
  }), []);

  const recentReports = [
    { id: 1, month: "August 2026", type: "Detailed", users: 1180, date: "Generated 2 days ago", status: "Ready" },
    { id: 2, month: "July 2026", type: "Summary", users: 1050, date: "Generated 1 month ago", status: "Ready" },
    { id: 3, month: "June 2026", type: "Chart", users: 980, date: "Generated 2 months ago", status: "Ready" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* Toast */}
        {toast && (
          <div className={cn(
            "fixed top-20 right-8 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-top-2",
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700"
              : "bg-red-500/10 border-red-500/30 text-red-700"
          )}>
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-semibold">{toast.message}</span>
          </div>
        )}

        <div className="px-4 sm:px-8 py-7">
          {/* Hero */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              Reports & Analytics
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Monthly Active User Report
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Generate detailed analytics of your active users with custom filters.
            </p>
          </div>

          {/* Stat Cards - Compact এক লাইনে */}
<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
      <Users className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
      <p className="text-lg font-heading font-bold">{previewStats.totalUsers.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
      <UserCheck className="w-4 h-4 text-emerald-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Active</p>
      <p className="text-lg font-heading font-bold text-emerald-600">{previewStats.activeUsers.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
      <UserX className="w-4 h-4 text-red-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Inactive</p>
      <p className="text-lg font-heading font-bold text-red-600">{previewStats.inactiveUsers.toLocaleString()}</p>
    </div>
  </div>
  <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
    <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
      <TrendingUp className="w-4 h-4 text-violet-600" />
    </div>
    <div className="flex items-baseline gap-2 min-w-0">
      <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Growth</p>
      <p className="text-lg font-heading font-bold text-violet-600">+{previewStats.growth}%</p>
    </div>
  </div>
</div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-2xl border shadow-sm p-6 sm:p-8">
                <div className="border-b pb-4 mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-signal" />
                    <h2 className="text-lg font-semibold">Search Filters</h2>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" /> Required: Month
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick Select</p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: "This Month", offset: 0 },
                      { label: "Last Month", offset: -1 },
                      { label: "2 Months Ago", offset: -2 },
                      { label: "3 Months Ago", offset: -3 },
                    ].map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setQuickMonth(preset.offset)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-muted/50 text-muted-foreground hover:bg-signal/10 hover:text-signal transition-all"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-signal" />
                        Month <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="month"
                        name="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-violet-500" /> POP In-charge
                      </label>
                      <select
                        name="popInCharge"
                        value={formData.popInCharge}
                        onChange={handleChange}
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                      >
                        <option value="">Choose Pop In-Charge</option>
                        <option value="Pop 1">Pop 1</option>
                        <option value="Pop 2">Pop 2</option>
                        <option value="Pop 3">Pop 3</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 text-amber-500" /> Recharge Type
                      </label>
                      <select
                        name="rechargeType"
                        value={formData.rechargeType}
                        onChange={handleChange}
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                      >
                        <option value="All">All</option>
                        <option value="Online">Online</option>
                        <option value="Manual">Manual</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <BarChart3 className="h-3.5 w-3.5 text-emerald-500" /> Count By
                      </label>
                      <select
                        name="countBy"
                        value={formData.countBy}
                        onChange={handleChange}
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                      >
                        <option value="Invoice Owner">Invoice Owner</option>
                        <option value="Client ID">Client ID</option>
                        <option value="Reseller">Reseller</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1.5">
                        <Activity className="h-3.5 w-3.5 text-blue-500" /> Protocol
                      </label>
                      <select
                        name="protocol"
                        value={formData.protocol}
                        onChange={handleChange}
                        className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                      >
                        <option value="All">All</option>
                        <option value="PPPoE">PPPoE</option>
                        <option value="Hotspot">Hotspot</option>
                        <option value="Static">Static</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-signal/5 border border-signal/20">
                    <input
                      type="checkbox"
                      id="uniqueUserOnly"
                      name="uniqueUserOnly"
                      checked={formData.uniqueUserOnly}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                    />
                    <label htmlFor="uniqueUserOnly" className="text-sm font-medium cursor-pointer flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-signal" />
                      Unique User Only
                      <span className="text-xs text-muted-foreground">(Exclude duplicate users)</span>
                    </label>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Report Type</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "detailed", label: "Detailed", sub: "Full data", icon: FileText, gradient: "from-blue-500 to-cyan-500" },
                        { id: "summary", label: "Summary", sub: "Overview", icon: PieChart, gradient: "from-violet-500 to-purple-500" },
                        { id: "chart", label: "Chart", sub: "Visual", icon: BarChart3, gradient: "from-emerald-500 to-teal-500" },
                      ].map((rt) => {
                        const Icon = rt.icon;
                        const isSelected = reportType === rt.id;
                        return (
                          <button
                            key={rt.id}
                            type="button"
                            onClick={() => setReportType(rt.id as any)}
                            className={cn(
                              "group flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                              isSelected
                                ? "border-signal bg-signal/5 shadow-md shadow-signal/10"
                                : "border-border hover:border-muted-foreground/30"
                            )}
                          >
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md transition-transform group-hover:scale-110", rt.gradient)}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-xs">{rt.label}</p>
                              <p className="text-[10px] text-muted-foreground">{rt.sub}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <button
                      type="submit"
                      disabled={isGenerating}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all",
                        isGenerating
                          ? "bg-muted text-muted-foreground cursor-wait"
                          : "bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-[1.01]"
                      )}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating Report…
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Generate Report
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Recent Reports */}
              <div className="bg-card rounded-2xl border shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-signal" />
                    Recent Reports
                  </h3>
                  <button className="text-xs font-semibold text-signal hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {recentReports.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm">{r.month} - {r.type} Report</p>
                        <p className="text-xs text-muted-foreground">{r.users.toLocaleString()} users • {r.date}</p>
                      </div>
                      <button
                        onClick={() => handleExport("PDF")}
                        className="p-2 rounded-lg hover:bg-signal/10 text-muted-foreground hover:text-signal transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Preview */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border shadow-sm p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-signal" />
                  <h3 className="font-heading text-lg font-bold">Report Preview</h3>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Month</span>
                    <span className="font-semibold">{formData.month}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">POP In-charge</span>
                    <span className="font-semibold">{formData.popInCharge || "All"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Protocol</span>
                    <span className="font-semibold">{formData.protocol}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Count By</span>
                    <span className="font-semibold">{formData.countBy}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-3">
                    <span className="text-muted-foreground">Report Type</span>
                    <span className="font-bold text-signal capitalize">{reportType}</span>
                  </div>
                </div>

                {/* Export Options */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Export As</p>
                    {showResult && (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ready
                      </span>
                    )}
                  </div>

                  {[
                    { label: "PDF Document", format: "PDF" as const, icon: FileText, gradient: "from-red-500 to-rose-500" },
                    { label: "Excel Sheet", format: "Excel" as const, icon: FileSpreadsheet, gradient: "from-emerald-500 to-teal-500" },
                    { label: "CSV File", format: "CSV" as const, icon: FileText, gradient: "from-blue-500 to-cyan-500" },
                  ].map((ex) => {
                    const Icon = ex.icon;
                    const isExporting = exportingFormat === ex.format;
                    const isDisabled = !showResult || isExporting;

                    return (
                      <button
                        key={ex.label}
                        type="button"
                        onClick={() => !isDisabled && handleExport(ex.format)}
                        disabled={isDisabled}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border transition-all group",
                          !isDisabled
                            ? "border-border hover:border-signal/40 hover:bg-signal/5 cursor-pointer hover:shadow-md"
                            : "border-border opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br text-white shadow-sm transition-transform", !isDisabled && "group-hover:scale-110", ex.gradient)}>
                          {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className="text-xs font-bold flex-1 text-left">
                          {isExporting ? `Exporting ${ex.format}…` : ex.label}
                        </span>
                        {isExporting ? (
                          <Loader2 className="h-3.5 w-3.5 text-signal animate-spin" />
                        ) : (
                          <Download className={cn("h-3.5 w-3.5 transition-colors", !isDisabled ? "text-muted-foreground group-hover:text-signal" : "text-muted-foreground")} />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className={cn(
                  "mt-6 p-3 rounded-xl border flex items-start gap-2",
                  showResult ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/50 border-border"
                )}>
                  {showResult ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  )}
                  <p className={cn("text-xs", showResult ? "text-emerald-700" : "text-muted-foreground")}>
                    {showResult
                      ? "Report generated successfully! Click any format above to download."
                      : "Select filters and click Generate Report to activate export options."}
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