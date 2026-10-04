"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, FileSpreadsheet, FileDown, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function ExportButton({ icon: Icon, label, onClick }: { icon: React.ElementType; label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 hover:bg-signal/5 text-xs h-9"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

interface TableToolbarProps {
  title: string;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onCopy: () => void;
  onExcel: () => void;
  onCSV: () => void;
  onPDF: () => void;
}

export function TableToolbar({
  title,
  searchTerm,
  onSearchChange,
  onCopy,
  onExcel,
  onCSV,
  onPDF,
}: TableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="pl-9 rounded-full w-56 h-9"
          />
        </div>
        <ExportButton icon={Copy} label="Copy" onClick={onCopy} />
        <ExportButton icon={FileSpreadsheet} label="Excel" onClick={onExcel} />
        <ExportButton icon={FileDown} label="CSV" onClick={onCSV} />
        <ExportButton icon={FileText} label="PDF" onClick={onPDF} />
      </div>
    </div>
  );
}

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  onRowsPerPageChange: (n: number) => void;
  onPageChange: (p: number) => void;
  totalItems: number;
  startIndex: number;
}

export function TablePagination({
  currentPage,
  totalPages,
  rowsPerPage,
  onRowsPerPageChange,
  onPageChange,
  totalItems,
  startIndex,
}: TablePaginationProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>Show</span>
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
          className="border rounded-lg px-2 py-1 bg-background text-sm"
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
        <span>entries</span>
      </div>

      <div className="text-muted-foreground text-xs">
        Showing {totalItems > 0 ? startIndex + 1 : 0} to{" "}
        {Math.min(startIndex + rowsPerPage, totalItems)} of {totalItems} entries
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="rounded-full h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
          const page = i + 1;
          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                "rounded-full h-8 w-8 text-xs font-semibold",
                currentPage === page && "bg-signal text-white"
              )}
            >
              {page}
            </Button>
          );
        })}
        {totalPages > 5 && <span className="text-muted-foreground px-1">...</span>}
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="rounded-full h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block">
        {required && <span className="text-signal">*</span>}
        {label}
      </span>
      {children}
    </div>
  );
}