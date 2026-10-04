"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { TicketingTopbar } from "@/components/dashboard/ticketing-topbar";
import {
  FolderOpen, Clock, MessageSquare, MoreVertical, AlertCircle, AlertTriangle,
  Loader2, CheckCircle2, Search, RefreshCw, ArrowUpDown, ChevronLeft,
  ChevronRight, X, Send, Trash2, UserPlus, CheckSquare, Ticket, Zap, Timer
} from "lucide-react";
import { cn } from "@/lib/utils";

// 🎯 Initial Open Tickets (with SLA data)
const initialTickets = [
  { id: "TKT-1001", subject: "Internet connection slow in Ward 5", customer: "Rahim Uddin", priority: "High", status: "Open", date: "2 mins ago", messages: 3, slaMinutes: 240, slaUsed: 5 },
  { id: "TKT-1003", subject: "Router not responding after power cut", customer: "Jamal Hossain", priority: "Critical", status: "Open", date: "1 hour ago", messages: 1, slaMinutes: 60, slaUsed: 55 },
  { id: "TKT-1008", subject: "Router replacement needed", customer: "Nasir Ahmed", priority: "Critical", status: "Open", date: "1 hour ago", messages: 5, slaMinutes: 60, slaUsed: 70 },
  { id: "TKT-1010", subject: "Frequent disconnection during rain", customer: "Sabbir Rahman", priority: "Medium", status: "Open", date: "30 mins ago", messages: 0, slaMinutes: 480, slaUsed: 30 },
  { id: "TKT-1012", subject: "No internet since morning", customer: "Tahmina Akter", priority: "High", status: "Open", date: "20 mins ago", messages: 2, slaMinutes: 240, slaUsed: 20 },
  { id: "TKT-1014", subject: "Speed dropping during peak hours", customer: "Kamal Uddin", priority: "Medium", status: "Open", date: "45 mins ago", messages: 4, slaMinutes: 480, slaUsed: 45 },
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

const supportAgents = ["Support A", "Support B", "Support C", "Support D", "Unassigned"];

// SLA Helper
const getSLAStatus = (slaMinutes: number, slaUsed: number) => {
  const remaining = slaMinutes - slaUsed;
  if (remaining <= 0) return { label: "SLA Breached", color: "bg-red-500/15 text-red-600 border-red-500/20", icon: AlertTriangle };
  if (remaining <= slaMinutes * 0.2) return { label: `${remaining}m left`, color: "bg-amber-500/15 text-amber-600 border-amber-500/20", icon: Timer };
  const hours = Math.floor(remaining / 60);
  const mins = remaining % 60;
  return { label: hours > 0 ? `${hours}h ${mins}m left` : `${mins}m left`, color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", icon: Clock };
};

export default function OpenTicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [sortKey, setSortKey] = useState<string | null>("slaUsed");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
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
      critical: tickets.filter((t) => t.priority === "Critical").length,
      high: tickets.filter((t) => t.priority === "High").length,
      breached: tickets.filter((t) => t.slaUsed >= t.slaMinutes).length,
    };
  }, [tickets]);

  // ফিল্টার + সার্চ
  const filteredTickets = useMemo(() => {
    let filtered = tickets.filter((t) => {
      const matchesSearch =
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === "All Priority" || t.priority === priorityFilter;
      return matchesSearch && matchesPriority;
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
  }, [tickets, searchTerm, priorityFilter, sortKey, sortOrder]);

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
    if (newStatus !== "Open") {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setActionsMenu(null);
      alert(`Ticket ${id} moved to "${newStatus}" and removed from Open list.`);
    }
  };

  // Assign
  const handleAssign = (id: string, agent: string) => {
    setActionsMenu(null);
    alert(`Ticket ${id} assigned to "${agent}"`);
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
      setTickets((prev) => prev.filter((t) => !selectedTickets.includes(t.id)));
      setSelectedTickets([]);
      alert(`${selectedTickets.length} ticket(s) closed and removed from Open list.`);
    }
  };

  // Reply Submit
  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      alert("Please write a reply message.");
      return;
    }
    setTickets((prev) =>
      prev.map((t) => (t.id === replyModal.id ? { ...t, messages: t.messages + 1 } : t))
    );
    alert(`Reply sent to ${replyModal.customer}:\n\n"${replyText}"`);
    setReplyModal(null);
    setReplyText("");
  };

  const handleResetFilters = () => {
    setSearchTerm("");
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
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald-500 mb-1">
              Action Required
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Open Tickets
            </h1>
          </div>

          {/* Alert Banner */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm font-semibold text-amber-700">
              {stats.total} ticket{stats.total !== 1 ? "s" : ""} need your attention.
              {stats.breached > 0 && (
                <span className="text-red-600 ml-1">
                  {stats.breached} SLA breached!
                </span>
              )}
            </p>
          </div>

          {/* 🎯 Compact Stat Cards - এক লাইনে */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
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

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">High</p>
                <p className="text-lg font-heading font-bold text-orange-600">{stats.high}</p>
              </div>
            </div>

            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 to-pink-600 flex items-center justify-center shrink-0">
                <Timer className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Breached</p>
                <p className="text-lg font-heading font-bold text-red-600">{stats.breached}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search open tickets…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:ring-emerald-500/30 outline-none font-semibold"
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
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-all"
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
                { key: "slaUsed", label: "SLA" },
                { key: "priority", label: "Priority" },
                { key: "id", label: "ID" },
              ].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key
                      ? "bg-emerald-500 text-white border-emerald-500"
                      : "bg-background text-muted-foreground border-border hover:border-emerald-500/50"
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
                const sla = getSLAStatus(ticket.slaMinutes, ticket.slaUsed);
                const SLAIcon = sla.icon;
                return (
                  <div
                    key={ticket.id}
                    className={cn(
                      "group bg-card rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 relative",
                      isSelected ? "border-emerald-500/50 bg-emerald-500/5" : "hover:border-emerald-500/30"
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

                    <div className="flex items-center gap-4 text-xs">
                      {/* SLA Timer */}
                      <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold border whitespace-nowrap", sla.color)}>
                        <SLAIcon className="w-3 h-3" /> {sla.label}
                      </span>
                      <div className="flex items-center gap-1.5 text-muted-foreground whitespace-nowrap">
                        <Clock className="h-3.5 w-3.5" />
                        {ticket.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 relative">
                      <button
                        onClick={() => setReplyModal(ticket)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-emerald-500 transition-colors"
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
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Move To</p>
                          </div>
                          {["In Progress", "Closed"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleChangeStatus(ticket.id, status)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2"
                            >
                              {status === "In Progress" && <Loader2 className="w-3 h-3 text-amber-500" />}
                              {status === "Closed" && <CheckCircle2 className="w-3 h-3 text-violet-500" />}
                              {status}
                            </button>
                          ))}
                          <div className="border-t my-1" />
                          <div className="px-3 py-2 border-b bg-muted/30">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Assign To</p>
                          </div>
                          {supportAgents.map((agent) => (
                            <button
                              key={agent}
                              onClick={() => handleAssign(ticket.id, agent)}
                              className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2"
                            >
                              <UserPlus className="w-3 h-3" /> {agent}
                            </button>
                          ))}
                          <div className="border-t my-1" />
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
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <FolderOpen className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-1">No open tickets</h3>
                <p className="text-sm text-muted-foreground max-w-sm mb-4">
                  {searchTerm || priorityFilter !== "All Priority"
                    ? "Try adjusting your search or filters."
                    : "Great job! All tickets are handled. ✨"}
                </p>
                <a
                  href="/admin/ticketing"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
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
                          ? "bg-emerald-500 text-white shadow-md"
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
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
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
                className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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