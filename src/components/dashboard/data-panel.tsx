"use client";

import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DataPanelColumn {
  key: string;
  label: string;
}

export interface DataPanelRow {
  [key: string]: string | number;
  status?: "paid" | "unpaid" | "expired";
}

interface DataPanelProps {
  title: string;
  columns: DataPanelColumn[];
  rows: DataPanelRow[];
  onViewAll?: () => void;
}

export function DataPanel({ title, columns, rows, onViewAll }: DataPanelProps) {
  return (
    <Card className="rounded-2xl overflow-hidden p-0">
      <div className="flex items-center justify-between px-4.5 pt-4 pb-3 border-b">
        <h3 className="font-heading font-semibold text-sm">{title}</h3>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-teal-700 hover:underline"
        >
          View all &rarr;
        </button>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className="text-[11px] uppercase tracking-wider font-semibold"
              >
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col.key} className="text-[12.8px]">
                  {col.key === "status" ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-bold text-[11px] border-none",
                        row.status === "paid" &&
                          "bg-emerald-50 text-emerald-700",
                        row.status === "unpaid" &&
                          "bg-amber-50 text-amber-700",
                        row.status === "expired" &&
                          "bg-red-50 text-red-700"
                      )}
                    >
                      {row[col.key]}
                    </Badge>
                  ) : col.key === "username" && row.isExpired ? (
                    <span className="flex items-center gap-1.5 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block" />
                      {row[col.key]}
                    </span>
                  ) : col.key === "amount" || col.key === "bill" || col.key === "invoice" || col.key === "username" ? (
                    <span className="font-mono">{row[col.key]}</span>
                  ) : (
                    row[col.key]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}