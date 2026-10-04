"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { TicketingTopbar } from "@/components/dashboard/ticketing-topbar";
import {
  Archive, CheckCircle2, MessageSquare, MoreVertical, Calendar,
  Search, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight, X,
  Trash2, RotateCcw, Download, Eye, AlertTriangle, Clock,
  CheckSquare, Ticket, Zap, Filter, User
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🎯 Initial Archived Tickets
const initialTickets = [
  { id: "TKT-0992", subject: "WiFi password reset request", customer: "Rafiq Islam", priority: "Low", status: "Closed", date: "5 days ago", daysAgo: 5, resolvedBy: "Support A", resolutionTime: "2h 15m", messages: 4 },
  { id: "TKT-0985", subject: "Billing issue resolved", customer: "Karim Ali", priority: "Medium", status: "Closed", date: "12 days ago", daysAgo: 12, resolvedBy: "Support B", resolutionTime: "4h 30m", messages: 8 },
  { id: "TKT-0978", subject: "New connection installed", customer: "Sultana Begum", priority: "Low", status: "Closed", date: "20 days ago", daysAgo: 20, resolvedBy: "Support A", resolutionTime: "1d 2h", messages: 6 },
  { id: "TKT-0970", subject: "Router configuration completed", customer: "Nasir Ahmed", priority: "Medium", status: "Closed", date: "1 month ago", daysAgo: 30, resolvedBy: "Support C", resolutionTime: "3h 45m", messages: 12 },
  { id: "TKT-0962", subject: "Fiber cable repaired after storm", customer: "Kamal Uddin", priority: "High", status: "Closed", date: "45 days ago", daysAgo: 45, resolvedBy: "Support B", resolutionTime: "8h 20m", messages: 15 },
  { id: "TKT-0955", subject: "Speed upgrade request completed", customer: "Tahmina Akter", priority: "Low", status: "Closed", date: "60 days ago", daysAgo: 60, resolvedBy: "Support A", resolutionTime: "1h 10m", messages: 3 },
  { id: "TKT-0948", subject: "Static IP assigned and configured", customer: "Sohel Rana", priority: "Medium", status: "Closed", date: "75 days ago", daysAgo: 75, resolvedBy: "Support C", resolutionTime: "5h 40m", messages: 9 },
  { id: "TKT-0940", subject: "Router replacement delivered", customer: "Anwar Hossain", priority: "High", status: "Closed", date: "90 days ago", daysAgo: 90, resolvedBy: "Support B", resolutionTime: "2d 4h", messages: 18 },
];

const priorityColors: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-600 border-red-500/20",
  High: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const dateRanges = [
  { id: "all", label: "All Time", days: 9999 },
  { id: "7d", label: "Last 7 Days", days: 7 },
  { id: "30d", label: "Last 30 Days", days: 30 },
  { id: "90d", label: "Last 90 Days", days: 90 },
];

export default function OldTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [dateRange, setDateRange] = useState("all");
  const [sortKey, setSortKey] = useState<string | null>("daysAgo");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewModal, setViewModal] = useState<any | null>(null);
  const [actionsMenu, setActionsMenu] = useState<string | null>(null);

  // Stat Calculations
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      thisWeek: tickets.filter((t) => t.daysAgo <= 7).length,
      thisMonth: tickets.filter((t) => t.daysAgo <= 30).length,
      highValue: tickets.filter((t) => t.priority === "High" || t.priority === "Critical").length,
    };
  }, [tickets]);

  // ফিল্টার + সার্চ
  const filteredTickets = useMemo(() => {
    const activeRange = dateRanges.find((r) => r.id === dateRange) || dateRanges[0];

    let filtered = tickets.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "All Priority" || t.priority === priorityFilter;
      const matchesDate = t.daysAgo <= activeRange.days;
      return matchesSearch && matchesPriority && matchesDate;
    });

    if (sortKey) {
      filtered = [...filtered].sort((a: any, b: any) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [tickets, searchTerm, priorityFilter, dateRange, sortKey, sortOrder]);

  // পেজিনেশন
  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + rowsPerPage);

  // সিলেক্ট
  const allSelected =
    paginatedTickets.length > 0 && paginatedTickets.every((t) => selectedTickets.includes(t.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedTickets((prev) => prev.filter((id) => !paginatedTickets.find((t) => t.id === id)));
    } else {
      setSelectedTickets((prev) => [...new Set([...prev, ...paginatedTickets.map((t) => t.id)])]);
    }
  };
  const toggleSelect = (id: string) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  // Reopen Ticket
  const handleReopen = (id: string) => {
    if (confirm(`Reopen ticket ${id}? It will move back to Open Tickets.`)) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setSelectedTickets((prev) => prev.filter((i) => i !== id));
      setActionsMenu(null);
      alert(`Ticket ${id} reopened and moved to Open Tickets.`);
    }
  };

  // Delete Ticket
  const handleDelete = (id: string) => {
    if (confirm(`Permanently delete ticket ${id}? This action cannot be undone.`)) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setSelectedTickets((prev) => prev.filter((i) => i !== id));
      setActionsMenu(null);
      alert("Ticket deleted permanently.");
    }
  };

  // Bulk Restore
  const handleBulkRestore = () => {
    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }
    if (confirm(`Reopen ${selectedTickets.length} ticket(s)? They will move to Open Tickets.`)) {
      setTickets((prev) => prev.filter((t) => !selectedTickets.includes(t.id)));
      setSelectedTickets([]);
      alert(`${selectedTickets.length} ticket(s) restored to Open Tickets.`);
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }
    if (confirm(`Permanently delete ${selectedTickets.length} ticket(s)? This cannot be undone.`)) {
      setTickets((prev) => prev.filter((t) => !selectedTickets.includes(t.id)));
      setSelectedTickets([]);
      alert(`${selectedTickets.length} ticket(s) deleted.`);
    }
  };

  // Export CSV
  const handleExport = () => {
    const dataToExport = selectedTickets.length > 0
      ? tickets.filter((t) => selectedTickets.includes(t.id))
      : filteredTickets;
    const headers = ["ID", "Subject", "Customer", "Priority", "Status", "Closed Date", "Resolved By", "Resolution Time"].join(",");
    const csvRows = dataToExport.map((t) =>
      [t.id, t.subject, t.customer, t.priority, t.status, t.date, t.resolvedBy, t.resolutionTime]
        .map((v) => `"${v}"`).join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `archived-tickets-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} ticket(s) to CSV.`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setPriorityFilter("All Priority");
    setDateRange("all");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <TicketingTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-orange-500 mb-1">
                Archive
              </p>
              <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Old Tickets
              </h1>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border border-orange-500/30 text-orange-600 hover:bg-orange-500/5 transition-all"
            >
              <Download className="h-4 w-4" /> Export Archive
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-slate-500/10 border border-slate-500/20 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <Archive className="h-5 w-5 text-slate-600 shrink-0" />
            <p className="text-sm font-semibold text-slate-700">
              These tickets are closed and archived. You can view their history or reopen them if needed.
            </p>
          </div>

          {/* 🎯 Compact Stat Cards - এক লাইনে */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center shrink-0">
                <Archive className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">This Week</p>
                <p className="text-lg font-heading font-bold text-orange-600">{stats.thisWeek}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">30 Days</p>
                <p className="text-lg font-heading font-bold text-emerald-600">{stats.thisMonth}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">High</p>
                <p className="text-lg font-heading font-bold text-red-600">{stats.highValue}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search archived tickets…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-orange-500/30"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-orange-500/30 outline-none font-semibold"
            >
              <option>All Priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <div className="flex items-center bg-muted/50 rounded-xl p-1 border">
              {dateRanges.map((range) => (
                <button
                  key={range.id}
                  onClick={() => { setDateRange(range.id); setCurrentPage(1); }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                    dateRange === range.id
                      ? "bg-orange-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-background text-muted-foreground text-sm font-semibold hover:bg-muted transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedTickets.length > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                <CheckSquare className="w-4 h-4" />
                {selectedTickets.length} ticket{selectedTickets.length !== 1 ? "s" : ""} selected
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkRestore}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reopen Selected
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
                <button
                  onClick={() => setSelectedTickets([])}
                  className="p-2 rounded-lg border bg-background text-muted-foreground hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Sort Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border rounded-lg px-2 py-1 bg-background text-xs"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {filteredTickets.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, filteredTickets.length)} of {filteredTickets.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Sort:</span>
              {[
                { key: "daysAgo", label: "Date" },
                { key: "priority", label: "Priority" },
                { key: "id", label: "ID" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-background text-muted-foreground border-border hover:border-orange-500/50"
                  )}
                >
                  {s.label}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Select All */}
          {paginatedTickets.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="rounded cursor-pointer"
              />
              <span className="font-semibold">Select All on this page</span>
            </div>
          )}

          {/* Ticket List */}
          <div className="space-y-3">
            {paginatedTickets.length > 0 ? (
              paginatedTickets.map((ticket) => {
                const isSelected = selectedTickets.includes(ticket.id);
                return (
                  <div
                    key={ticket.id}
                    className={cn(
                      "group bg-card rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 relative",
                      isSelected ? "border-orange-500/50 bg-orange-500/5" : "opacity-90 hover:opacity-100 hover:border-orange-500/30"
                    )}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(ticket.id)}
                        className="rounded cursor-pointer mt-1"
                      />
                      <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="h-5 w-5 text-slate-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono font-bold text-muted-foreground">{ticket.id}</span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", priorityColors[ticket.priority])}>
                            {ticket.priority}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-600 border border-slate-500/20">
                            {ticket.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm truncate text-muted-foreground">{ticket.subject}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          By <span className="font-semibold">{ticket.customer}</span>
                          <span className="mx-2">·</span>
                          Resolved by <span className="font-semibold">{ticket.resolvedBy}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-500/10 text-slate-600 border border-slate-500/20 whitespace-nowrap">
                        ⏱ {ticket.resolutionTime}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                        <Calendar className="h-3.5 w-3.5" />
                        {ticket.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 relative">
                      <button
                        onClick={() => setViewModal(ticket)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-orange-500 transition-colors"
                        title="View Ticket"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setActionsMenu(actionsMenu === ticket.id ? null : ticket.id)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {actionsMenu === ticket.id && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-card border rounded-xl shadow-xl z-30 overflow-hidden">
                          <button
                            onClick={() => { setViewModal(ticket); setActionsMenu(null); }}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2"
                          >
                            <Eye className="w-3 h-3" /> View Details
                          </button>
                          <button
                            onClick={() => handleReopen(ticket.id)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-emerald-600"
                          >
                            <RotateCcw className="w-3 h-3" /> Reopen Ticket
                          </button>
                          <div className="border-t my-1" />
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" /> Delete Permanently
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-card rounded-2xl border border-dashed p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <Archive className="h-8 w-8 text-orange-500" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-1">No archived tickets</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  {searchTerm || priorityFilter !== "All Priority" || dateRange !== "all"
                    ? "Try adjusting your search or filters."
                    : "Closed tickets will appear here once resolved."}
                </p>
                <a
                  href="/admin/ticketing"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:scale-105 transition-all"
                >
                  <Zap className="h-4 w-4" /> View All Tickets
                </a>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTickets.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>Page</span>
                <span className="font-semibold text-foreground">{currentPage}</span>
                <span>of {totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all",
                        currentPage === page
                          ? "bg-orange-500 text-white shadow-md"
                          : "border bg-card hover:bg-muted"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🎯 View Ticket Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setViewModal(null)} />
          <div className="relative bg-card w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-mono font-bold text-muted-foreground">{viewModal.id}</p>
                <h3 className="font-heading text-xl font-bold mt-1">{viewModal.subject}</h3>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", priorityColors[viewModal.priority])}>
                    {viewModal.priority}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-500/10 text-slate-600 border border-slate-500/20">
                    {viewModal.status}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewModal(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-2xl">
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Customer</p>
                <p className="text-sm font-bold flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-muted-foreground" /> {viewModal.customer}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Closed Date</p>
                <p className="text-sm font-bold flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" /> {viewModal.date}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Resolved By</p>
                <p className="text-sm font-bold">{viewModal.resolvedBy}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Resolution Time</p>
                <p className="text-sm font-bold text-emerald-600">{viewModal.resolutionTime}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Messages ({viewModal.messages})</p>
              <div className="bg-muted/30 rounded-2xl p-4 max-h-60 overflow-y-auto space-y-3">
                <div className="bg-card rounded-xl p-3 border">
                  <p className="text-[10px] font-bold text-muted-foreground mb-1">{viewModal.customer}</p>
                  <p className="text-sm">{viewModal.subject}</p>
                </div>
                <div className="bg-signal/10 rounded-xl p-3 border border-signal/20 ml-8">
                  <p className="text-[10px] font-bold text-signal mb-1">{viewModal.resolvedBy}</p>
                  <p className="text-sm">We've resolved your issue. Please let us know if you need anything else.</p>
                </div>
                <p className="text-xs text-muted-foreground text-center italic pt-2">
                  — This ticket was closed and archived —
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setViewModal(null)}
                className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { handleReopen(viewModal.id); setViewModal(null); }}
                className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Reopen Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}