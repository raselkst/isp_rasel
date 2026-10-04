"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { TicketingTopbar } from "@/components/dashboard/ticketing-topbar";
import {
  UserCheck, Clock, MessageSquare, MoreVertical, Loader2, CheckCircle2,
  AlertTriangle, Search, RefreshCw, ArrowUpDown, ChevronLeft, ChevronRight,
  X, Send, Trash2, UserMinus, CheckSquare, Ticket, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🎯 Initial Assigned Tickets
const initialTickets = [
  { id: "TKT-1001", subject: "Internet connection slow in Ward 5", customer: "Rahim Uddin", priority: "High", status: "Open", date: "2 mins ago", messages: 3 },
  { id: "TKT-1004", subject: "Request for plan upgrade to 50Mbps", customer: "Sultana Begum", priority: "Low", status: "Closed", date: "3 hours ago", messages: 8 },
  { id: "TKT-1008", subject: "Router replacement needed", customer: "Nasir Ahmed", priority: "Critical", status: "In Progress", date: "1 hour ago", messages: 5 },
  { id: "TKT-1012", subject: "No internet since morning", customer: "Tahmina Akter", priority: "High", status: "Open", date: "30 mins ago", messages: 2 },
  { id: "TKT-1015", subject: "Billing query for October invoice", customer: "Sohel Rana", priority: "Medium", status: "In Progress", date: "4 hours ago", messages: 4 },
  { id: "TKT-1019", subject: "Slow speed after 8 PM", customer: "Anwar Hossain", priority: "Medium", status: "Open", date: "20 mins ago", messages: 1 },
];

const priorityColors: Record<string, string> = {
  Critical: "bg-red-500/10 text-red-600 border-red-500/20",
  High: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Low: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const statusColors: Record<string, string> = {
  Open: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  "In Progress": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Closed: "bg-violet-500/10 text-violet-600 border-violet-500/20",
};

const priorityBorder: Record<string, string> = {
  Critical: "bg-red-500",
  High: "bg-orange-500",
  Medium: "bg-amber-500",
  Low: "bg-blue-500",
};

export default function MyAssignedTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [replyModal, setReplyModal] = useState<any | null>(null);
  const [replyText, setReplyText] = useState("");
  const [actionsMenu, setActionsMenu] = useState<string | null>(null);

  // Stat Calculations
  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "Open").length,
      inProgress: tickets.filter((t) => t.status === "In Progress").length,
      closed: tickets.filter((t) => t.status === "Closed").length,
      critical: tickets.filter((t) => t.priority === "Critical").length,
    };
  }, [tickets]);

  // ফিল্টার + সার্চ
  const filteredTickets = useMemo(() => {
    let filtered = tickets.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All Status" || t.status === statusFilter;
      const matchesPriority = priorityFilter === "All Priority" || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
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
  }, [tickets, searchTerm, statusFilter, priorityFilter, sortKey, sortOrder]);

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

  // Change Status
  const handleChangeStatus = (id: string, newStatus: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    setActionsMenu(null);
    alert(`Ticket ${id} status changed to "${newStatus}"`);
  };

  // Unassign (Remove from My Queue)
  const handleUnassign = (id: string) => {
    if (confirm(`Unassign ticket ${id} from yourself? It will move back to the general queue.`)) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setSelectedTickets((prev) => prev.filter((i) => i !== id));
      setActionsMenu(null);
      alert(`Ticket ${id} unassigned from you.`);
    }
  };

  // Delete
  const handleDelete = (id: string) => {
    if (confirm(`Delete ticket ${id}? This cannot be undone.`)) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setSelectedTickets((prev) => prev.filter((i) => i !== id));
      setActionsMenu(null);
      alert("Ticket deleted successfully!");
    }
  };

  // Bulk Close
  const handleBulkClose = () => {
    if (selectedTickets.length === 0) {
      alert("Please select at least one ticket.");
      return;
    }
    if (confirm(`Close ${selectedTickets.length} ticket(s)?`)) {
      setTickets((prev) =>
        prev.map((t) => (selectedTickets.includes(t.id) ? { ...t, status: "Closed" } : t))
      );
      setSelectedTickets([]);
      alert(`${selectedTickets.length} ticket(s) closed.`);
    }
  };

  // Reply Submit
  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      alert("Please write a reply message.");
      return;
    }
    setTickets((prev) =>
      prev.map((t) =>
        t.id === replyModal.id ? { ...t, messages: t.messages + 1, status: "In Progress" } : t
      )
    );
    alert(`Reply sent to ${replyModal.customer}:\n\n"${replyText}"`);
    setReplyModal(null);
    setReplyText("");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPriorityFilter("All Priority");
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
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-violet-500 mb-1">
              Personal Queue
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              My Assigned Tickets
            </h1>
          </div>

          {/* 🎯 Compact Stat Cards - এক লাইনে */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Open</p>
                <p className="text-lg font-heading font-bold text-emerald-600">{stats.open}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Progress</p>
                <p className="text-lg font-heading font-bold text-amber-600">{stats.inProgress}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Closed</p>
                <p className="text-lg font-heading font-bold text-violet-600">{stats.closed}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Critical</p>
                <p className="text-lg font-heading font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search your tickets by ID, subject or customer…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-violet-500/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-violet-500/30 outline-none font-semibold"
            >
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-violet-500/30 outline-none font-semibold"
            >
              <option>All Priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border bg-background text-muted-foreground text-sm font-semibold hover:bg-muted transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>

            {selectedTickets.length > 0 && (
              <button
                onClick={handleBulkClose}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-500 text-white text-sm font-semibold hover:bg-violet-600 transition-all"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Close {selectedTickets.length}
              </button>
            )}
          </div>

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
                { key: "id", label: "ID" },
                { key: "priority", label: "Priority" },
                { key: "status", label: "Status" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key
                      ? "bg-violet-500 text-white border-violet-500"
                      : "bg-background text-muted-foreground border-border hover:border-violet-500/50"
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
                      isSelected ? "border-violet-500/50 bg-violet-500/5" : "hover:border-violet-500/30"
                    )}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(ticket.id)}
                        className="rounded cursor-pointer mt-1"
                      />
                      <div className={cn("w-1 h-12 rounded-full shrink-0", priorityBorder[ticket.priority])} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono font-bold text-muted-foreground">{ticket.id}</span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", priorityColors[ticket.priority])}>
                            {ticket.priority}
                          </span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", statusColors[ticket.status])}>
                            {ticket.status}
                          </span>
                          {ticket.messages > 0 && (
                            <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {ticket.messages}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm truncate">{ticket.subject}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          By <span className="font-semibold text-foreground">{ticket.customer}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        {ticket.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 relative">
                      <button
                        onClick={() => setReplyModal(ticket)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-violet-500 transition-colors"
                        title="Reply"
                      >
                        <MessageSquare className="h-4 w-4" />
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
                          <div className="px-3 py-2 border-b bg-muted/30">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Change Status</p>
                          </div>
                          {["Open", "In Progress", "Closed"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleChangeStatus(ticket.id, status)}
                              className={cn(
                                "w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2",
                                ticket.status === status && "text-violet-500 font-semibold"
                              )}
                            >
                              {status === "Open" && <Clock className="w-3 h-3 text-emerald-500" />}
                              {status === "In Progress" && <Loader2 className="w-3 h-3 text-amber-500" />}
                              {status === "Closed" && <CheckCircle2 className="w-3 h-3 text-violet-500" />}
                              {status}
                            </button>
                          ))}
                          <div className="border-t my-1" />
                          <button
                            onClick={() => handleUnassign(ticket.id)}
                            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2 text-amber-600"
                          >
                            <UserMinus className="w-3 h-3" /> Unassign from Me
                          </button>
                          <button
                            onClick={() => handleDelete(ticket.id)}
                            className="w-full text-left px-3 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2"
                          >
                            <Trash2 className="w-3 h-3" /> Delete Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-card rounded-2xl border border-dashed p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-violet-500" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-1">No tickets assigned to you</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  {searchTerm || statusFilter !== "All Status" || priorityFilter !== "All Priority"
                    ? "Try adjusting your search or filters."
                    : "You're all caught up! Tickets assigned to you will appear here."}
                </p>
                <a
                  href="/admin/ticketing"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/30 hover:scale-105 transition-all"
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
                          ? "bg-violet-500 text-white shadow-md"
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

      {/* 🎯 Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setReplyModal(null)} />
          <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-mono font-bold text-muted-foreground">{replyModal.id}</p>
                <h3 className="font-heading text-lg font-bold mt-1">{replyModal.subject}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  By <span className="font-semibold text-foreground">{replyModal.customer}</span> · {replyModal.date}
                </p>
              </div>
              <button
                onClick={() => setReplyModal(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-muted/30 rounded-xl p-4 max-h-40 overflow-y-auto">
                <p className="text-xs text-muted-foreground mb-1 font-semibold">Customer Message:</p>
                <p className="text-sm">{replyModal.subject}</p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response..."
                  rows={4}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setReplyModal(null)}
                className="flex-1 rounded-xl font-semibold h-12 border border-border hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}