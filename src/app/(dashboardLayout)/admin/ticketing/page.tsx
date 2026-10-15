"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { TicketingTopbar } from "@/components/dashboard/ticketing-topbar";
import { cn } from "@/lib/utils";
import {
  Ticket, Clock, Loader2, CheckCircle2, AlertTriangle, UserCheck,
  Search, MoreVertical, MessageSquare, Zap, ArrowUpDown, ChevronLeft,
  ChevronRight, X, Send, Trash2, UserPlus, CheckSquare, RefreshCw,
  Plus
} from "lucide-react";

// 🎯 Stat Cards (গ্রেডিয়েন্ট বাদ দিয়ে থিম ভিত্তিক আইকন কালার)
const stats = [
  { label: "Total", value: 128, icon: Ticket, tone: "signal", trend: "+12%" },
  { label: "Open", value: 24, icon: Clock, tone: "success", trend: "+4%" },
  { label: "In Progress", value: 18, icon: Loader2, tone: "warning", trend: "-2%" },
  { label: "Closed", value: 86, icon: CheckCircle2, tone: "violet", trend: "+8%" },
  { label: "SLA", value: 3, icon: AlertTriangle, tone: "destructive", trend: "-1%" },
  { label: "Assigned", value: 7, icon: UserCheck, tone: "signal", trend: "+2%" },
];

const initialTickets = [
  { id: "TKT-1001", subject: "Internet connection slow in Ward 5", customer: "Rahim Uddin", assigned: "Support A", priority: "High", status: "Open", date: "2 mins ago", messages: 3 },
  { id: "TKT-1002", subject: "Billing discrepancy for September", customer: "Karim Ali", assigned: "Support B", priority: "Medium", status: "In Progress", date: "15 mins ago", messages: 5 },
  { id: "TKT-1003", subject: "Router not responding after power cut", customer: "Jamal Hossain", assigned: "Support C", priority: "Critical", status: "Open", date: "1 hour ago", messages: 1 },
  { id: "TKT-1004", subject: "Request for plan upgrade to 50Mbps", customer: "Sultana Begum", assigned: "Support A", priority: "Low", status: "Closed", date: "3 hours ago", messages: 8 },
  { id: "TKT-1005", subject: "WiFi password reset request", customer: "Rafiq Islam", assigned: "Unassigned", priority: "Medium", status: "Closed", date: "5 hours ago", messages: 2 },
  { id: "TKT-1006", subject: "Fiber cable damaged by construction", customer: "Sabbir Ahmed", assigned: "Support B", priority: "Critical", status: "In Progress", date: "8 hours ago", messages: 12 },
  { id: "TKT-1007", subject: "Slow upload speed since yesterday", customer: "Nusrat Jahan", assigned: "Support C", priority: "Medium", status: "Open", date: "1 day ago", messages: 4 },
  { id: "TKT-1008", subject: "Need additional IP address", customer: "Tanvir Islam", assigned: "Support A", priority: "Low", status: "Closed", date: "2 days ago", messages: 6 },
];

const priorityColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/30",
  High: "bg-caution-tint text-caution border-caution/30",
  Medium: "bg-warning-tint text-warning border-warning/30",
  Low: "bg-signal-tint text-signal border-signal/30",
};

const statusColors: Record<string, string> = {
  Open: "bg-success-tint text-success border-success/30",
  "In Progress": "bg-warning-tint text-warning border-warning/30",
  Closed: "bg-violet-accent-tint text-violet-accent border-violet-accent/30",
};

const priorityBorder: Record<string, string> = {
  Critical: "bg-destructive",
  High: "bg-caution",
  Medium: "bg-warning",
  Low: "bg-signal",
};

const toneStyles: Record<string, { bg: string; text: string }> = {
  signal: { bg: "bg-signal-tint", text: "text-signal" },
  success: { bg: "bg-success-tint", text: "text-success" },
  warning: { bg: "bg-warning-tint", text: "text-warning" },
  violet: { bg: "bg-violet-accent-tint", text: "text-violet-accent" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive" },
};

const supportAgents = ["Support A", "Support B", "Support C", "Support D", "Unassigned"];

export default function TicketsPage() {
  const [tickets, setTickets] = useState(initialTickets);
  const [createOpen, setCreateOpen] = useState(false);
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

  const [newTicket, setNewTicket] = useState({
    subject: "",
    customer: "",
    priority: "Medium",
    assigned: "Unassigned",
    description: "",
  });

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

  const totalPages = Math.ceil(filteredTickets.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + rowsPerPage);

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

  const handleChangeStatus = (id: string, newStatus: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
    setActionsMenu(null);
    alert(`Ticket ${id} status changed to "${newStatus}"`);
  };

  const handleAssign = (id: string, agent: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, assigned: agent } : t)));
    setActionsMenu(null);
    alert(`Ticket ${id} assigned to "${agent}"`);
  };

  const handleDelete = (id: string) => {
    if (confirm(`Delete ticket ${id}? This cannot be undone.`)) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
      setSelectedTickets((prev) => prev.filter((i) => i !== id));
      setActionsMenu(null);
      alert("Ticket deleted successfully!");
    }
  };

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

  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.subject.trim()) {
      alert("Please enter a subject.");
      return;
    }
    if (!newTicket.customer.trim()) {
      alert("Please enter a customer name.");
      return;
    }

    const maxNum = tickets.reduce((max, t) => {
      const num = parseInt(t.id.replace("TKT-", ""));
      return num > max ? num : max;
    }, 1000);
    const newId = `TKT-${maxNum + 1}`;

    const ticketToAdd = {
      id: newId,
      subject: newTicket.subject,
      customer: newTicket.customer,
      assigned: newTicket.assigned,
      priority: newTicket.priority,
      status: "Open",
      date: "Just now",
      messages: 0,
    };

    setTickets((prev) => [ticketToAdd, ...prev]);
    setCreateOpen(false);
    setNewTicket({ subject: "", customer: "", priority: "Medium", assigned: "Unassigned", description: "" });
    alert(`✅ New ticket "${newId}" created successfully!\n\nSubject: ${ticketToAdd.subject}\nCustomer: ${ticketToAdd.customer}`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All Status");
    setPriorityFilter("All Priority");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />
        <TicketingTopbar onCreate={() => setCreateOpen(true)} />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
                Support Center
              </p>
              <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
                All Tickets
              </h1>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" /> New Ticket
            </button>
          </div>

          {/* 🎯 Compact Stat Cards — Theme Connected */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {stats.map((s) => {
              const tone = toneStyles[s.tone];
              return (
                <div
                  key={s.label}
                  className="group relative bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 overflow-hidden hover:shadow-md transition-all duration-300"
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", tone.bg)}>
                    <s.icon className={cn("h-4 w-4", tone.text)} />
                  </div>
                  <div className="flex items-baseline gap-2 min-w-0 flex-1">
                    <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">{s.label}</p>
                    <p className={cn("text-lg font-heading font-bold", tone.text)}>{s.value}</p>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0",
                    s.trend.startsWith("+") ? "bg-success-tint text-success" : "bg-destructive/10 text-destructive"
                  )}>
                    {s.trend}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search tickets by ID, subject or customer…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option>All Status</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option>All Priority</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>

            {selectedTickets.length > 0 && (
              <button
                onClick={handleBulkClose}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-accent text-white text-sm font-semibold hover:bg-violet-accent/90 transition-all"
              >
                <CheckSquare className="h-3.5 w-3.5" />
                Close {selectedTickets.length}
              </button>
            )}
          </div>

          {/* Sort Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Show</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs"
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
              <span className="text-xs text-slate-500 font-semibold">Sort:</span>
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
                      ? "bg-signal text-white border-signal"
                      : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                  )}
                >
                  {s.label}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {paginatedTickets.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 mb-2 text-xs text-slate-500">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="rounded cursor-pointer accent-signal"
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
                      "group bg-white rounded-2xl border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all duration-300 relative",
                      isSelected ? "border-signal/50 bg-signal-tint" : "hover:border-signal/30"
                    )}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(ticket.id)}
                        className="rounded cursor-pointer mt-1 accent-signal"
                      />
                      <div className={cn("w-1 h-12 rounded-full shrink-0", priorityBorder[ticket.priority])} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-mono font-bold text-slate-500">{ticket.id}</span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", priorityColors[ticket.priority])}>
                            {ticket.priority}
                          </span>
                          <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border", statusColors[ticket.status])}>
                            {ticket.status}
                          </span>
                          {ticket.messages > 0 && (
                            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> {ticket.messages}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-sm truncate text-signal">{ticket.subject}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          By <span className="font-semibold text-signal">{ticket.customer}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-violet-accent-tint flex items-center justify-center text-violet-accent font-bold text-[10px]">
                          {ticket.assigned === "Unassigned" ? "?" : ticket.assigned.split(" ")[1]}
                        </div>
                        <span className="text-slate-500">{ticket.assigned}</span>
                      </div>
                      <div className="text-slate-500 whitespace-nowrap">{ticket.date}</div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 relative">
                      <button
                        onClick={() => setReplyModal(ticket)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-signal transition-colors"
                        title="Reply"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setActionsMenu(actionsMenu === ticket.id ? null : ticket.id)}
                        className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                        title="More Actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {actionsMenu === ticket.id && (
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden">
                          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Change Status</p>
                          </div>
                          {["Open", "In Progress", "Closed"].map((status) => (
                            <button
                              key={status}
                              onClick={() => handleChangeStatus(ticket.id, status)}
                              className={cn(
                                "w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex items-center gap-2",
                                ticket.status === status && "text-signal font-semibold"
                              )}
                            >
                              {status === "Open" && <Clock className="w-3 h-3 text-success" />}
                              {status === "In Progress" && <Loader2 className="w-3 h-3 text-warning" />}
                              {status === "Closed" && <CheckCircle2 className="w-3 h-3 text-violet-accent" />}
                              {status}
                            </button>
                          ))}
                          <div className="border-t border-slate-100 my-1" />
                          <div className="px-3 py-2 border-b border-slate-100 bg-slate-50">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Assign To</p>
                          </div>
                          {supportAgents.map((agent) => (
                            <button
                              key={agent}
                              onClick={() => handleAssign(ticket.id, agent)}
                              className={cn(
                                "w-full text-left px-3 py-2 text-xs hover:bg-slate-50 transition-colors flex items-center gap-2",
                                ticket.assigned === agent && "text-signal font-semibold"
                              )}
                            >
                              <UserPlus className="w-3 h-3" /> {agent}
                            </button>
                          ))}
                          <div className="border-t border-slate-100 my-1" />
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
              <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center mb-4">
                  <Ticket className="h-8 w-8 text-signal" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-1 text-signal">No tickets found</h3>
                <p className="text-sm text-slate-500 max-w-sm mb-4">
                  {searchTerm || statusFilter !== "All Status" || priorityFilter !== "All Priority"
                    ? "Try adjusting your search or filters."
                    : "Create your first ticket to get started."}
                </p>
                <button
                  onClick={() => setCreateOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
                >
                  <Zap className="h-4 w-4" /> Create Ticket
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTickets.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>Page</span>
                <span className="font-semibold text-signal">{currentPage}</span>
                <span>of {totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1"
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
                          ? "bg-signal text-white shadow-md"
                          : "border border-slate-200 bg-white hover:bg-slate-50 text-signal"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setReplyModal(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-500">{replyModal.id}</p>
                <h3 className="font-heading text-lg font-bold mt-1 text-signal">{replyModal.subject}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  By <span className="font-semibold text-signal">{replyModal.customer}</span> · {replyModal.date}
                </p>
              </div>
              <button
                onClick={() => setReplyModal(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                <p className="text-xs text-slate-500 mb-1 font-semibold">Customer Message:</p>
                <p className="text-sm text-signal">{replyModal.subject}</p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response..."
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setReplyModal(null)}
                className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={handleReplySubmit}
                className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Reply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setCreateOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-[9px] bg-signal" />
                  <span className="font-heading font-bold text-sm text-signal">LOGO ICON ONLY</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Create New Ticket
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the details below to create a new support ticket.
                </p>
              </div>
              <button
                onClick={() => setCreateOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">
                  Subject <span className="text-destructive">*</span>
                </label>
                <input
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="e.g. Internet connection slow in Ward 5"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">
                    Customer Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={newTicket.customer}
                    onChange={(e) => setNewTicket({ ...newTicket, customer: e.target.value })}
                    placeholder="e.g. Rahim Uddin"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Assign To</label>
                  <select
                    value={newTicket.assigned}
                    onChange={(e) => setNewTicket({ ...newTicket, assigned: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    {supportAgents.map((agent) => (
                      <option key={agent} value={agent}>{agent}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Initial Status</label>
                  <div className="w-full bg-success-tint text-success border border-success/30 rounded-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Open
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Description</label>
                <textarea
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}