"use client";

import { ReactNode } from "react";
import { Calendar, Copy, FileSpreadsheet, FileText, FileDown } from "lucide-react";

interface ReportToolbarProps {
  fromDate?: string;
  toDate?: string;
  extraFilters?: ReactNode;
}

export function ReportToolbar({
  fromDate = "2025-07-11",
  toDate = "2025-07-12",
  extraFilters,
}: ReportToolbarProps) {
  return (
    <div className="bg-signal-tint rounded-2xl px-6 py-4 flex flex-wrap items-center gap-6 mb-6">
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold">Date:</label>
        <div className="relative">
          <input
            defaultValue={fromDate}
            className="h-10 pl-3 pr-9 rounded-lg border bg-card text-sm outline-none w-36"
          />
          <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm font-semibold">To</label>
        <div className="relative">
          <input
            defaultValue={toDate}
            className="h-10 pl-3 pr-9 rounded-lg border bg-card text-sm outline-none w-36"
          />
          <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <button className="h-10 px-6 rounded-lg bg-signal text-signal-foreground text-sm font-semibold">
        Go
      </button>
      {extraFilters}
    </div>
  );
}

export function ExportButtons() {
  const items = [
    { label: "Copy", icon: Copy },
    { label: "Excel", icon: FileSpreadsheet },
    { label: "CSV", icon: FileDown },
    { label: "PDF", icon: FileText },
  ];

  return (
    <div className="flex items-center gap-2">
      {items.map(({ label, icon: Icon }) => (
        <button
          key={label}
          className="flex items-center gap-1.5 border rounded-full px-4 py-2 text-sm font-semibold bg-card hover:bg-muted"
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}