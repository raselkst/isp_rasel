"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Download,
  FileText,
  FileSpreadsheet,
  FileJson,
  Calendar,
  Filter,
  CheckCircle2,
  Archive,
  Zap,
} from "lucide-react";

export default function DownloadInvoicesPage() {
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [selectedRange, setSelectedRange] = useState("all");

  const formats = [
    { id: "pdf", label: "PDF Document", sub: "Best for printing", icon: FileText, gradient: "from-red-500 to-rose-500", ext: ".pdf" },
    { id: "excel", label: "Excel Spreadsheet", sub: "Best for data analysis", icon: FileSpreadsheet, gradient: "from-emerald-500 to-teal-500", ext: ".xlsx" },
    { id: "csv", label: "CSV File", sub: "Compatible with any tool", icon: FileJson, gradient: "from-blue-500 to-cyan-500", ext: ".csv" },
    { id: "zip", label: "ZIP Archive", sub: "Multiple PDFs in one file", icon: Archive, gradient: "from-violet-500 to-purple-500", ext: ".zip" },
  ];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Export & Download
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Download Invoices
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Format Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Format Cards */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <Download className="h-5 w-5 text-signal" />
                  Select Format
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {formats.map((fmt) => {
                    const Icon = fmt.icon;
                    const isSelected = selectedFormat === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        onClick={() => setSelectedFormat(fmt.id)}
                        className={cn(
                          "group relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                          isSelected
                            ? "border-signal bg-signal/5 shadow-md shadow-signal/10"
                            : "border-border hover:border-muted-foreground/30"
                        )}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br text-white shadow-md shrink-0 transition-transform group-hover:scale-105",
                          fmt.gradient
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm">{fmt.label}</p>
                          <p className="text-xs text-muted-foreground">{fmt.sub}</p>
                          <p className="text-[10px] font-mono text-muted-foreground mt-1">{fmt.ext}</p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="h-5 w-5 text-signal shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filter Options */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5 text-violet-500" />
                  Filter Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Date Range</Label>
                    <Select value={selectedRange} onValueChange={setSelectedRange}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                        <SelectItem value="year">This Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Status</Label>
                    <Select defaultValue="all">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">From Date</Label>
                    <div className="relative">
                      <Input type="date" className="pr-9" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">To Date</Label>
                    <div className="relative">
                      <Input type="date" className="pr-9" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Summary & Download */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Export Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Invoices</span>
                    <span className="font-semibold">128</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Format</span>
                    <span className="font-semibold uppercase">{selectedFormat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Date Range</span>
                    <span className="font-semibold capitalize">{selectedRange}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t pt-3">
                    <span className="font-bold">Estimated Size</span>
                    <span className="font-semibold text-signal">~2.4 MB</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-[1.02] transition-all">
                  <Download className="h-4 w-4" />
                  Download Now
                </button>

                <p className="text-[10px] text-muted-foreground text-center mt-3">
                  Your download will start automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}