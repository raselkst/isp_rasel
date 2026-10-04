"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, Copy, Printer, FileText } from "lucide-react";

// ডামি ডেটা (আপনার API থেকে আসবে)
const mockData = [
  { id: 1, year: "2026", month: "September", reseller: "Poli Network Pop", sales: 152, clients: 148, totalAmount: 75453.33, rAmount: 37726.66 },
  { id: 2, year: "2026", month: "September", reseller: "Poli Network", sales: 2, clients: 2, totalAmount: 698, rAmount: 698 },
  { id: 3, year: "2026", month: "August", reseller: "Poli Network Pop", sales: 134, clients: 133, totalAmount: 64993.34, rAmount: 32496.68 },
  { id: 4, year: "2026", month: "August", reseller: "ZS Cable Network", sales: 110, clients: 109, totalAmount: 53970, rAmount: 24826.2 },
  { id: 5, year: "2026", month: "August", reseller: "Poli Network", sales: 6, clients: 6, totalAmount: 3049, rAmount: 3049 },
  { id: 6, year: "2026", month: "July", reseller: "Poli Network Pop", sales: 128, clients: 128, totalAmount: 63500, rAmount: 31750 },
  { id: 7, year: "2026", month: "July", reseller: "ZS Cable Network", sales: 103, clients: 102, totalAmount: 50113, rAmount: 23051.98 },
  { id: 8, year: "2026", month: "July", reseller: "Poli Network", sales: 7, clients: 7, totalAmount: 3300, rAmount: 3300 },
  { id: 9, year: "2026", month: "June", reseller: "Poli Network Pop", sales: 123, clients: 123, totalAmount: 60500, rAmount: 30250 },
  { id: 10, year: "2026", month: "June", reseller: "ZS Cable Network", sales: 115, clients: 110, totalAmount: 55307, rAmount: 25441.22 },
];

export default function PopWiseSalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // ফিল্টারিং লজিক
  const filteredData = mockData.filter(
    (item) =>
      item.reseller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year.includes(searchTerm)
  );

  // পেজিনেশন লজিক (ডেমো)
  const totalEntries = 103; // ছবি অনুযায়ী ডামি টোটাল
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + entriesPerPage);

  // নাম্বার ফরম্যাটিং (কমা সহ)
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            POP Wise Sales
          </h1>

          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
            {/* Top Controls: Show entries & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b gap-4">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
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
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>

            {/* Export Buttons: Copy, Print, PDF */}
            <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/20">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background border border-input rounded-lg hover:bg-muted transition-colors">
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background border border-input rounded-lg hover:bg-muted transition-colors">
                <Printer className="w-3.5 h-3.5" /> Print
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background border border-input rounded-lg hover:bg-muted transition-colors">
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
                  <tr>
                    {[
                      { label: "SL", key: "id" },
                      { label: "Year", key: "year" },
                      { label: "Month", key: "month" },
                      { label: "Reseller", key: "reseller" },
                      { label: "Sales", key: "sales" },
                      { label: "Clients", key: "clients" },
                      { label: "Total Amount", key: "totalAmount" },
                      { label: "R.Amount", key: "rAmount" },
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
                  {paginatedData.length > 0 ? (
                    paginatedData.map((row) => (
                      <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{row.id}</td>
                        <td className="px-4 py-3">{row.year}</td>
                        <td className="px-4 py-3">{row.month}</td>
                        <td className="px-4 py-3 font-semibold text-foreground">{row.reseller}</td>
                        <td className="px-4 py-3 text-center">{row.sales}</td>
                        <td className="px-4 py-3 text-center">{row.clients}</td>
                        <td className="px-4 py-3 font-medium">{formatNumber(row.totalAmount)}</td>
                        <td className="px-4 py-3 font-medium text-signal">{formatNumber(row.rAmount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 text-sm">
              <div className="text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, totalEntries)} of {totalEntries} entries
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-input hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers (Demo logic) */}
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg font-semibold text-sm transition-colors ${
                      currentPage === page
                        ? "bg-signal text-white"
                        : "border border-input hover:bg-muted"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="px-1 text-muted-foreground">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-8 h-8 rounded-lg font-semibold text-sm transition-colors ${
                    currentPage === totalPages
                      ? "bg-signal text-white"
                      : "border border-input hover:bg-muted"
                  }`}
                >
                  {totalPages}
                </button>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-input hover:bg-muted transition-colors disabled:opacity-50"
                >
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