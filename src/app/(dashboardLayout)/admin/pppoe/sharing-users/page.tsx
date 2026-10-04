"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Link2, UserX, Download, MessageSquareText, RefreshCw, Filter,
  Search, ArrowUpDown, ChevronLeft, ChevronRight,
  Eye, Edit, Trash2, AlertCircle, Wifi, Users,
  CheckCircle2, X, Share2, WifiOff
} from "lucide-react";

interface SharingUser {
  id: number;
  invoice: string;
  cid: string;
  name: string;
  mobile: string;
  pkg: string;
  rDays: string;
  uptime: string;
  ip: string;
  mac: string;
  up: string;
  down: string;
  lastOffline: string;
  status: "online" | "offline" | "warning";
  sharedWith: number;
}

const initialUsers: SharingUser[] = [
  { id: 1, invoice: "SH1001", cid: "share_101", name: "Rahim Uddin", mobile: "01716102651", pkg: "10Mbps_Package", rDays: "030", uptime: "2d 4h", ip: "192.168.10.10", mac: "AA:BB:CC:11:22:01", up: "120 MB", down: "480 MB", lastOffline: "1-5-24 10:00PM", status: "online", sharedWith: 3 },
  { id: 2, invoice: "SH1002", cid: "share_102", name: "Karim Hossain", mobile: "01716102652", pkg: "15Mbps_Package", rDays: "000", uptime: "Null", ip: "Null", mac: "Null", up: "000", down: "000", lastOffline: "1-5-24 09:00PM", status: "offline", sharedWith: 2 },
  { id: 3, invoice: "SH1003", cid: "share_103", name: "Jamal Ali", mobile: "01716102653", pkg: "20Mbps_Package", rDays: "030", uptime: "1d 12h", ip: "192.168.10.12", mac: "AA:BB:CC:11:22:03", up: "240 MB", down: "1.2 GB", lastOffline: "1-5-24 08:30PM", status: "online", sharedWith: 4 },
  { id: 4, invoice: "SH1004", cid: "share_104", name: "Sultana Begum", mobile: "01716102654", pkg: "10Mbps_Package", rDays: "015", uptime: "5h 20m", ip: "192.168.10.13", mac: "AA:BB:CC:11:22:04", up: "80 MB", down: "320 MB", lastOffline: "1-5-24 07:15PM", status: "warning", sharedWith: 2 },
  { id: 5, invoice: "SH1005", cid: "share_105", name: "Rafiq Islam", mobile: "01716102655", pkg: "30Mbps_Package", rDays: "000", uptime: "Null", ip: "Null", mac: "Null", up: "000", down: "000", lastOffline: "1-5-24 06:00PM", status: "offline", sharedWith: 5 },
  { id: 6, invoice: "SH1006", cid: "share_106", name: "Nasir Ahmed", mobile: "01716102656", pkg: "10Mbps_Package", rDays: "030", uptime: "3d 8h", ip: "192.168.10.15", mac: "AA:BB:CC:11:22:06", up: "150 MB", down: "620 MB", lastOffline: "1-5-24 05:30PM", status: "online", sharedWith: 3 },
  { id: 7, invoice: "SH1007", cid: "share_107", name: "Sabbir Rahman", mobile: "01716102657", pkg: "15Mbps_Package", rDays: "022", uptime: "12h", ip: "192.168.10.16", mac: "AA:BB:CC:11:22:07", up: "90 MB", down: "380 MB", lastOffline: "1-5-24 04:45PM", status: "warning", sharedWith: 2 },
  { id: 8, invoice: "SH1008", cid: "share_108", name: "Mizanur Rahman", mobile: "01716102658", pkg: "20Mbps_Package", rDays: "030", uptime: "1d 10h", ip: "192.168.10.17", mac: "AA:BB:CC:11:22:08", up: "200 MB", down: "950 MB", lastOffline: "1-5-24 03:00PM", status: "online", sharedWith: 4 },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "online": return { dot: "bg-emerald-500", label: "Online", badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
    case "warning": return { dot: "bg-amber-500", label: "Warning", badge: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
    case "offline": return { dot: "bg-red-500", label: "Offline", badge: "bg-red-500/10 text-red-600 border-red-500/20" };
    default: return { dot: "bg-slate-400", label: "Unknown", badge: "bg-slate-500/10 text-slate-600 border-slate-500/20" };
  }
};

export default function PppoeSharingUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline" | "warning">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  // Stat Cards
  const stats = useMemo(() => ({
    total: users.length,
    online: users.filter(u => u.status === "online").length,
    offline: users.filter(u => u.status === "offline").length,
    sharing: users.reduce((acc, u) => acc + u.sharedWith, 0),
  }), [users]);

  // Filter + Search + Sort
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(u => {
      const matchesSearch =
        u.invoice.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.mobile.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      return matchesSearch && matchesStatus;
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
  }, [users, searchTerm, statusFilter, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  // Select
  const allSelected = paginatedUsers.length > 0 && paginatedUsers.every(u => selectedRows.includes(u.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(prev => prev.filter(id => !paginatedUsers.find(u => u.id === id)));
    } else {
      setSelectedRows(prev => [...new Set([...prev, ...paginatedUsers.map(u => u.id)])]);
    }
  };
  const toggleSelect = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Sort
  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  // ============ ACTIONS ============

  const handleActivate = () => {
    if (selectedRows.length === 0) { alert("Please select at least one user to activate."); return; }
    setUsers(prev => prev.map(u => selectedRows.includes(u.id) ? { ...u, status: "online", uptime: "Just now" } : u));
    alert(`${selectedRows.length} user(s) activated successfully!`);
    setSelectedRows([]);
  };

  const handleLeft = () => {
    if (selectedRows.length === 0) { alert("Please select at least one user to mark as Left."); return; }
    setUsers(prev => prev.map(u => selectedRows.includes(u.id) ? { ...u, status: "offline", uptime: "Null" } : u));
    alert(`${selectedRows.length} user(s) marked as Left.`);
    setSelectedRows([]);
  };

  const handleExport = () => {
    const dataToExport = selectedRows.length > 0 ? users.filter(u => selectedRows.includes(u.id)) : filteredUsers;
    const headers = "Invoice,C.ID,Name,Mobile,Package,R.Days,Uptime,IP,Mac,Up,Down,Last Offline,Shared With,Status";
    const csvRows = dataToExport.map(u =>
      `"${u.invoice}","${u.cid}","${u.name}","${u.mobile}","${u.pkg}","${u.rDays}","${u.uptime}","${u.ip}","${u.mac}","${u.up}","${u.down}","${u.lastOffline}",${u.sharedWith},"${u.status}"`
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pppoe-sharing-users-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} user(s) to CSV.`);
  };

  const handleBulkSMS = () => {
    if (selectedRows.length === 0) { alert("Please select at least one user to send SMS."); return; }
    alert(`Sending SMS to ${selectedRows.length} user(s)...\n\nConnect your SMS API here.`);
  };

  const handleBulkRenew = () => {
    if (selectedRows.length === 0) { alert("Please select at least one user to renew."); return; }
    alert(`Renewing ${selectedRows.length} user(s)...\n\nConnect your renewal API here.`);
  };

  const handleView = (row: SharingUser) => {
    alert(`User Details:\n\nInvoice: ${row.invoice}\nC.ID: ${row.cid}\nName: ${row.name}\nMobile: ${row.mobile}\nPackage: ${row.pkg}\nShared With: ${row.sharedWith} devices\nStatus: ${row.status}`);
  };

  const handleEdit = (row: SharingUser) => {
    const newName = prompt(`Edit user name:`, row.name);
    if (newName && newName.trim()) {
      setUsers(prev => prev.map(u => u.id === row.id ? { ...u, name: newName.trim() } : u));
      alert("User updated successfully!");
    }
  };

  const handleDelete = (row: SharingUser) => {
    if (confirm(`Delete user "${row.name}" (${row.invoice})? This cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== row.id));
      setSelectedRows(prev => prev.filter(i => i !== row.id));
      alert("User deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) { alert("Please select at least one user."); return; }
    if (confirm(`Delete ${selectedRows.length} user(s)?`)) {
      setUsers(prev => prev.filter(u => !selectedRows.includes(u.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} user(s) deleted.`);
    }
  };

  const handleFilterSelect = (status: "all" | "online" | "offline" | "warning") => {
    setStatusFilter(status);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            PPPoE Sharing Users
          </h1>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Wifi className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Online</p>
                <p className="text-lg font-heading font-bold text-emerald-600">{stats.online}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                <WifiOff className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Offline</p>
                <p className="text-lg font-heading font-bold text-red-600">{stats.offline}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <Share2 className="w-4 h-4 text-violet-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-muted-foreground font-semibold uppercase whitespace-nowrap">Shared</p>
                <p className="text-lg font-heading font-bold text-violet-600">{stats.sharing}</p>
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <h2 className="font-heading text-xl font-bold">Client List</h2>
              {selectedRows.length > 0 && (
                <span className="bg-signal/10 text-signal text-xs font-semibold px-3 py-1 rounded-full border border-signal/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {selectedRows.length} selected
                  <button onClick={() => setSelectedRows([])} className="ml-1 hover:bg-signal/20 rounded-full p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  placeholder="Search..."
                  className="pl-9 pr-4 rounded-full w-56 h-9 border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
                />
              </div>
              <button onClick={handleActivate} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-signal border border-signal/30 hover:bg-signal/5 transition-all">
                <Link2 className="h-3.5 w-3.5" /> Activate
              </button>
              <button onClick={handleLeft} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-signal border border-signal/30 hover:bg-signal/5 transition-all">
                <UserX className="h-3.5 w-3.5" /> Left
              </button>
              <button onClick={handleExport} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-signal border border-signal/30 hover:bg-signal/5 transition-all">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button onClick={handleBulkSMS} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-signal border border-signal/30 hover:bg-signal/5 transition-all">
                <MessageSquareText className="h-3.5 w-3.5" /> Bulk SMS
              </button>
              <button onClick={handleBulkRenew} className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-signal border border-signal/30 hover:bg-signal/5 transition-all">
                <RefreshCw className="h-3.5 w-3.5" /> Bulk Renew
              </button>

              {/* 🎯 Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterDropdown(s => !s)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                    statusFilter !== "all"
                      ? "bg-signal text-white border-signal"
                      : "text-signal border-signal/30 hover:bg-signal/5"
                  )}
                >
                  <Filter className="h-3.5 w-3.5" />
                  {statusFilter === "all" ? "Filter" : `Filter: ${statusFilter}`}
                </button>
                {showFilterDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-card border rounded-xl shadow-lg z-30 overflow-hidden">
                    {(["all", "online", "offline", "warning"] as const).map((status) => {
                      const cfg = status === "all"
                        ? { dot: "bg-slate-400", label: "All Status" }
                        : getStatusConfig(status);
                      return (
                        <button
                          key={status}
                          onClick={() => handleFilterSelect(status)}
                          className={cn(
                            "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 capitalize",
                            statusFilter === status && "bg-signal/10 text-signal font-semibold"
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                          {status === "all" ? "All Status" : cfg.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Rows per page + Sort */}
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
                <option value={100}>100</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {filteredUsers.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground font-semibold">Sort:</span>
              {[{ key: "invoice", label: "Invoice" }, { key: "name", label: "Name" }, { key: "sharedWith", label: "Shared" }].map((s) => (
                <button
                  key={s.key}
                  onClick={() => handleSort(s.key)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1",
                    sortKey === s.key ? "bg-signal text-white border-signal" : "bg-background text-muted-foreground border-border hover:border-signal/50"
                  )}
                >
                  {s.label}
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1400px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    <th className="px-4 py-4 w-12">
                      <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="rounded cursor-pointer" />
                    </th>
                    {["Invoice No.", "C.ID", "Name", "Mobile", "Package", "R.Days", "Uptime", "IP", "Mac Address", "Up", "Down", "Last Offline", "Shared", "Status", "Actions"].map((c) => (
                      <th key={c} className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((u) => {
                      const sc = getStatusConfig(u.status);
                      const isSelected = selectedRows.includes(u.id);
                      return (
                        <tr key={u.id} className={cn("border-t transition-colors", isSelected ? "bg-signal/5" : "hover:bg-muted/30")}>
                          <td className="px-4 py-4">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(u.id)} className="rounded cursor-pointer" />
                          </td>
                          <td className="px-4 py-4 font-medium">{u.invoice}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1.5 text-signal font-semibold">
                              <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                              {u.cid}
                            </span>
                          </td>
                          <td className="px-4 py-4 font-medium">{u.name}</td>
                          <td className="px-4 py-4">{u.mobile}</td>
                          <td className="px-4 py-4">
                            <span className="bg-signal/10 text-signal text-xs font-semibold px-2 py-1 rounded-md border border-signal/20">
                              {u.pkg}
                            </span>
                          </td>
                          <td className="px-4 py-4">{u.rDays}</td>
                          <td className="px-4 py-4">
                            {u.uptime !== "Null" ? (
                              <span className="text-emerald-600 font-semibold">{u.uptime}</span>
                            ) : (
                              <span className="text-muted-foreground">Null</span>
                            )}
                          </td>
                          <td className="px-4 py-4 font-mono text-xs">{u.ip}</td>
                          <td className="px-4 py-4 font-mono text-xs">{u.mac}</td>
                          <td className="px-4 py-4 text-emerald-600 font-semibold">{u.up}</td>
                          <td className="px-4 py-4 text-blue-600 font-semibold">{u.down}</td>
                          <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">{u.lastOffline}</td>
                          <td className="px-4 py-4">
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-violet-500/10 text-violet-600 text-xs font-bold border border-violet-500/20">
                              <Share2 className="w-3 h-3" /> {u.sharedWith}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <span className={cn("inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border", sc.badge)}>
                              <span className={cn("w-1.5 h-1.5 rounded-full", sc.dot)} />
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button onClick={() => handleView(u)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="View">
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button onClick={() => handleEdit(u)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Edit">
                                <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                              <button onClick={() => handleDelete(u)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Delete">
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={16} className="px-4 py-16 text-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No sharing users found</p>
                        <p className="text-xs mt-1">Try adjusting your search or filter</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
              <div className="text-muted-foreground">
                Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center transition-all",
                        currentPage === page ? "bg-signal text-white shadow-md" : "border bg-card hover:bg-muted"
                      )}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalPages > 5 && <span className="text-muted-foreground px-1">...</span>}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border bg-card hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Delete Floating Bar */}
          {selectedRows.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border-2 border-signal/30 rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-4 z-40 animate-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-signal text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">{selectedRows.length} user(s) selected</p>
                  <p className="text-xs text-muted-foreground">Perform bulk actions below</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleBulkSMS} className="px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 transition-colors">
                  Send SMS
                </button>
                <button onClick={handleBulkRenew} className="px-4 py-2 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 transition-colors">
                  Renew
                </button>
                <button onClick={handleBulkDelete} className="px-4 py-2 rounded-lg text-xs font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors">
                  Delete
                </button>
                <button onClick={() => setSelectedRows([])} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}