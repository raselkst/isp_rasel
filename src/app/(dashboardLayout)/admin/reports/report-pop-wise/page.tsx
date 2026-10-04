"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

// ডামি ডেটা (আপনার API থেকে আসবে)
const mockData = [
  { id: 1, reseller: "Poli Network", total: 47, active: 0, expired: 3, left: 5, pending: 0, pppoe: 47, hotspot: 0, free: 0, vip: 0 },
  { id: 2, reseller: "AR Internet", total: 123, active: 0, expired: 81, left: 0, pending: 0, pppoe: 123, hotspot: 0, free: 0, vip: 0 },
  { id: 3, reseller: "ZS Cable Network", total: 279, active: 5, expired: 91, left: 0, pending: 0, pppoe: 279, hotspot: 0, free: 1, vip: 0 },
  { id: 4, reseller: "Poli Network Pop", total: 423, active: 172, expired: 242, left: 4, pending: 2, pppoe: 423, hotspot: 0, free: 0, vip: 0 },
  { id: 5, reseller: "Online Network", total: 44, active: 0, expired: 43, left: 0, pending: 0, pppoe: 44, hotspot: 0, free: 0, vip: 0 },
  { id: 6, reseller: "Akas Cable Network", total: 12, active: 0, expired: 12, left: 0, pending: 0, pppoe: 12, hotspot: 0, free: 0, vip: 0 },
];

// টোটাল ক্যালকুলেশন
const totals = mockData.reduce(
  (acc, curr) => ({
    total: acc.total + curr.total,
    active: acc.active + curr.active,
    expired: acc.expired + curr.expired,
    left: acc.left + curr.left,
    pending: acc.pending + curr.pending,
    pppoe: acc.pppoe + curr.pppoe,
    hotspot: acc.hotspot + curr.hotspot,
    free: acc.free + curr.free,
    vip: acc.vip + curr.vip,
  }),
  { total: 0, active: 0, expired: 0, left: 0, pending: 0, pppoe: 0, hotspot: 0, free: 0, vip: 0 }
);

// স্টেটাস ব্যাজ কম্পোনেন্ট
const StatusBadge = ({ value, type }: { value: number; type: "active" | "expired" | "left" | "pending" | "free" | "vip" | "default" }) => {
  if (value === 0 && type !== "default") {
    return <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-md text-xs font-semibold bg-muted text-muted-foreground border border-border">0</span>;
  }

  const colorMap = {
    active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    expired: "bg-red-500/10 text-red-600 border-red-500/20",
    left: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    pending: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    free: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    vip: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    default: "bg-signal/10 text-signal border-signal/20",
  };

  return (
    <span className={`inline-flex items-center justify-center min-w-[32px] px-2 py-0.5 rounded-md text-xs font-semibold border ${colorMap[type]}`}>
      {value}
    </span>
  );
};

export default function PopWiseClientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);

  const filteredData = mockData.filter((item) =>
    item.reseller.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            POP Wise Clients
          </h1>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Table Header Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                  className="bg-background border border-input rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-muted-foreground">entries</span>
              </div>

              <div className="flex items-center gap-2 text-sm w-full sm:w-auto">
                <span className="text-muted-foreground whitespace-nowrap">Search:</span>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-signal outline-none"
                    placeholder="Search reseller..."
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    {[
                      { label: "SL", key: "id" },
                      { label: "Reseller", key: "reseller" },
                      { label: "Total", key: "total" },
                      { label: "Active", key: "active" },
                      { label: "Expired", key: "expired" },
                      { label: "Left", key: "left" },
                      { label: "Pending", key: "pending" },
                      { label: "PPPOE", key: "pppoe" },
                      { label: "Hotspot", key: "hotspot" },
                      { label: "Free", key: "free" },
                      { label: "VIP", key: "vip" },
                    ].map((col) => (
                      <th key={col.key} className="px-4 py-3 font-semibold whitespace-nowrap">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                          {col.label}
                          <ArrowUpDown className="w-3 h-3 opacity-50" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredData.length > 0 ? (
                    filteredData.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{row.id}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.reseller}</td>
                        <td className="px-4 py-3"><StatusBadge value={row.total} type="default" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.active} type="active" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.expired} type="expired" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.left} type="left" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.pending} type="pending" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.pppoe} type="default" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.hotspot} type="default" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.free} type="free" /></td>
                        <td className="px-4 py-3"><StatusBadge value={row.vip} type="vip" /></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={11} className="px-4 py-12 text-center text-muted-foreground">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Total Row */}
                {filteredData.length > 0 && (
                  <tfoot className="bg-muted/50 font-bold border-t-2 border-border">
                    <tr>
                      <td className="px-4 py-3"></td>
                      <td className="px-4 py-3">{filteredData.length}</td>
                      <td className="px-4 py-3">{totals.total}</td>
                      <td className="px-4 py-3 text-emerald-600">{totals.active}</td>
                      <td className="px-4 py-3 text-red-600">{totals.expired}</td>
                      <td className="px-4 py-3 text-amber-600">{totals.left}</td>
                      <td className="px-4 py-3 text-blue-600">{totals.pending}</td>
                      <td className="px-4 py-3">{totals.pppoe}</td>
                      <td className="px-4 py-3">{totals.hotspot}</td>
                      <td className="px-4 py-3 text-cyan-600">{totals.free}</td>
                      <td className="px-4 py-3 text-purple-600">{totals.vip}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 text-sm">
              <div className="text-muted-foreground">
                Showing 1 to {filteredData.length} of {filteredData.length} entries
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg border border-input hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-signal text-white font-semibold text-sm">1</button>
                <button className="p-1.5 rounded-lg border border-input hover:bg-muted transition-colors disabled:opacity-50" disabled>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}