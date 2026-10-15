"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Wallet, UserCog, MoreVertical, Shield, Users, Crown,
  UserCheck, Trash2, Phone, Mail, DollarSign, Key, Activity, Filter,
  ArrowUpDown, ChevronLeft, ChevronRight, X, Save, Download,
  RefreshCw, CheckSquare, UserPlus, AlertCircle, Lock, ShieldCheck
} from "lucide-react";

interface UserData {
  id: number;
  name: string;
  tag?: string;
  username: string;
  role: "Admin" | "Reseller" | "POP In-charge" | "Manager";
  balance: number;
  limit: number;
  phone: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

const initialUsers: UserData[] = [
  { id: 335, name: "Sanwar Hossain", tag: "(Admin)", username: "admin@rbnisp.net", role: "Admin", balance: 500, limit: 0, phone: "01710626699", status: "Active", lastLogin: "2 mins ago" },
  { id: 336, name: "Sanwar Hossain Network", username: "client91@tnrsoft.com", role: "POP In-charge", balance: 500, limit: 0, phone: "01710626699", status: "Inactive", lastLogin: "1 day ago" },
  { id: 337, name: "Karim Ali", tag: "(Reseller)", username: "karim@rbnisp.net", role: "Reseller", balance: 1200, limit: 5000, phone: "01711223344", status: "Active", lastLogin: "5 mins ago" },
  { id: 338, name: "Jamal Uddin", username: "jamal@rbnisp.net", role: "Manager", balance: 800, limit: 2000, phone: "01711556677", status: "Active", lastLogin: "1 hour ago" },
  { id: 339, name: "Rafiq Islam", tag: "(Reseller)", username: "rafiq@rbnisp.net", role: "Reseller", balance: 300, limit: 1000, phone: "01711889900", status: "Active", lastLogin: "30 mins ago" },
  { id: 340, name: "Nasir Ahmed", username: "nasir@rbnisp.net", role: "POP In-charge", balance: 150, limit: 500, phone: "01711334455", status: "Inactive", lastLogin: "3 days ago" },
  { id: 341, name: "Tariqul Islam", username: "tariq@rbnisp.net", role: "Reseller", balance: 2500, limit: 10000, phone: "01711778899", status: "Active", lastLogin: "10 mins ago" },
];

// 🎯 Theme-connected Role Config
const roleConfig: Record<string, { bg: string; color: string; icon: any; gradient: string; access: number }> = {
  Admin: { bg: "bg-signal-tint", color: "text-signal", icon: Crown, gradient: "bg-signal", access: 100 },
  Reseller: { bg: "bg-violet-accent-tint", color: "text-violet-accent", icon: Users, gradient: "bg-violet-accent", access: 75 },
  "POP In-charge": { bg: "bg-warning-tint", color: "text-warning", icon: Shield, gradient: "bg-warning", access: 60 },
  Manager: { bg: "bg-success-tint", color: "text-success", icon: UserCheck, gradient: "bg-success", access: 85 },
};

const getAvatarColor = (name: string) => {
  const colors = [
    "from-signal to-signal-light",
    "from-violet-accent to-violet-accent-light",
    "from-success to-success",
    "from-warning to-caution",
    "from-destructive to-destructive",
  ];
  return colors[name.charCodeAt(0) % colors.length];
};

const emptyUser: UserData = {
  id: 0, name: "", tag: "", username: "", role: "Reseller",
  balance: 0, limit: 0, phone: "", status: "Active", lastLogin: "Just now",
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [addOpen, setAddOpen] = useState(false);
  const [editModal, setEditModal] = useState<UserData | null>(null);
  const [rechargeModal, setRechargeModal] = useState<UserData | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState(0);
  const [bulkRechargeOpen, setBulkRechargeOpen] = useState(false);
  const [bulkRechargeAmount, setBulkRechargeAmount] = useState(0);
  const [newUser, setNewUser] = useState<UserData>({ ...emptyUser });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [actionsMenu, setActionsMenu] = useState<number | null>(null);

  const stats = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter(u => u.role === "Admin").length,
      active: users.filter(u => u.status === "Active").length,
      totalBalance: users.reduce((acc, u) => acc + u.balance, 0),
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    let filtered = users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm);
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesStatus = statusFilter === "All" || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
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
  }, [users, searchTerm, roleFilter, statusFilter, sortKey, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + rowsPerPage);

  const allSelected =
    paginatedUsers.length > 0 && paginatedUsers.every(u => selectedRows.includes(u.id));
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

  const handleSort = (key: string) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortOrder("asc"); }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.username.trim()) {
      alert("Name and Username are required!");
      return;
    }
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    const toAdd = { ...newUser, id: newId };
    setUsers(prev => [toAdd, ...prev]);
    setNewUser({ ...emptyUser });
    setAddOpen(false);
    alert(`✅ User "${toAdd.name}" added successfully!`);
  };

  const handleSaveEdit = () => {
    if (!editModal || !editModal.name.trim()) {
      alert("Name is required!");
      return;
    }
    setUsers(prev => prev.map(u => (u.id === editModal.id ? editModal : u)));
    setEditModal(null);
    alert("User updated successfully!");
  };

  const handleSingleRecharge = () => {
    if (!rechargeModal || rechargeAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setUsers(prev =>
      prev.map(u => u.id === rechargeModal.id ? { ...u, balance: u.balance + rechargeAmount } : u)
    );
    alert(`৳${rechargeAmount} recharged to ${rechargeModal.name}\nNew Balance: ৳${rechargeModal.balance + rechargeAmount}`);
    setRechargeModal(null);
    setRechargeAmount(0);
  };

  const handleBulkRecharge = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one user.");
      return;
    }
    if (bulkRechargeAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }
    setUsers(prev =>
      prev.map(u => selectedRows.includes(u.id) ? { ...u, balance: u.balance + bulkRechargeAmount } : u)
    );
    alert(`৳${bulkRechargeAmount} recharged to ${selectedRows.length} user(s).`);
    setBulkRechargeOpen(false);
    setBulkRechargeAmount(0);
    setSelectedRows([]);
  };

  const handleDelete = (id: number, name: string) => {
    if (confirm(`Delete user "${name}"? This cannot be undone.`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      setSelectedRows(prev => prev.filter(i => i !== id));
      alert("User deleted successfully!");
    }
  };

  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one user.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} user(s)?`)) {
      setUsers(prev => prev.filter(u => !selectedRows.includes(u.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} user(s) deleted.`);
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(prev =>
      prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)
    );
    setActionsMenu(null);
    alert("User status updated!");
  };

  const handleExport = () => {
    const dataToExport =
      selectedRows.length > 0 ? users.filter(u => selectedRows.includes(u.id)) : filteredUsers;
    const headers = "ID,Name,Username,Role,Balance,Limit,Phone,Status,Last Login";
    const csvRows = dataToExport.map(u =>
      `${u.id},"${u.name}","${u.username}","${u.role}",${u.balance},${u.limit},"${u.phone}","${u.status}","${u.lastLogin}"`
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `users-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} user(s) to CSV.`);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setRoleFilter("All");
    setStatusFilter("All");
    setCurrentPage(1);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* Sticky Action Bar */}
        <div className="border-b border-slate-200 bg-white/85 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3 overflow-x-auto">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all whitespace-nowrap"
              >
                <Plus className="h-4 w-4" /> Add User
              </button>
              <button
                onClick={() => {
                  if (selectedRows.length === 0) {
                    alert("Please select at least one user first.");
                    return;
                  }
                  setBulkRechargeOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:text-signal hover:border-signal/30 hover:shadow-md transition-all whitespace-nowrap"
              >
                <Wallet className="h-4 w-4" /> Bulk Recharge
                {selectedRows.length > 0 && (
                  <span className="bg-signal text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {selectedRows.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-500 hover:text-signal hover:border-signal/30 hover:shadow-md transition-all whitespace-nowrap"
              >
                <Download className="h-4 w-4" /> Export
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Access Control
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight text-signal">
              Manage Users
            </h1>
          </div>

          {/* Compact Stat Cards — Theme Connected */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.total}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-signal-tint flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Admins</p>
                <p className="text-lg font-heading font-bold text-signal">{stats.admins}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-success-tint flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-success" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Active</p>
                <p className="text-lg font-heading font-bold text-success">{stats.active}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center gap-3 hover:shadow-md transition-all">
              <div className="w-9 h-9 rounded-lg bg-warning-tint flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-warning" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-[11px] text-slate-500 font-semibold uppercase whitespace-nowrap">Balance</p>
                <p className="text-lg font-heading font-bold text-warning">৳{stats.totalBalance.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center gap-3 shadow-sm">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                placeholder="Search by name, username or phone…"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Reseller">Reseller</option>
              <option value="POP In-charge">POP In-charge</option>
              <option value="Manager">Manager</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-signal focus:ring-2 focus:ring-signal/30 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>

            {selectedRows.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-destructive text-white text-sm font-semibold hover:bg-destructive/90 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete {selectedRows.length}
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
                className="border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs text-signal"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
              <span className="mx-1">·</span>
              <span>
                Showing {filteredUsers.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + rowsPerPage, filteredUsers.length)} of {filteredUsers.length}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-500 font-semibold">Sort:</span>
              {[
                { key: "name", label: "Name" },
                { key: "balance", label: "Balance" },
                { key: "role", label: "Role" },
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

          {/* Table */}
          {filteredUsers.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1200px]">
                  <thead>
                    <tr className="bg-signal text-white">
                      <th className="px-4 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="rounded cursor-pointer accent-white"
                        />
                      </th>
                      {["ID", "User", "Username", "Role", "Access", "Balance", "Limit", "Phone", "Status", "Action"].map((c) => (
                        <th key={c} className="text-left px-5 py-4 font-semibold text-xs tracking-wide whitespace-nowrap">
                          <div
                            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                              const map: any = { User: "name", Balance: "balance", Role: "role" };
                              if (map[c]) handleSort(map[c]);
                            }}
                          >
                            {c}
                            {["User", "Balance", "Role"].includes(c) && (
                              <ArrowUpDown className="h-3 w-3 opacity-60" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => {
                      const rc = roleConfig[user.role] || roleConfig.Manager;
                      const RoleIcon = rc.icon;
                      const initials = user.name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
                      const isSelected = selectedRows.includes(user.id);
                      return (
                        <tr
                          key={user.id}
                          className={cn(
                            "border-t border-slate-100 hover:bg-slate-50 transition-colors",
                            isSelected && "bg-signal-tint"
                          )}
                        >
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(user.id)}
                              className="rounded cursor-pointer accent-signal"
                            />
                          </td>
                          <td className="px-5 py-4 font-mono text-slate-500">{user.id}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-md", getAvatarColor(user.name))}>
                                {initials}
                              </div>
                              <span className="font-semibold text-signal">
                                {user.name} {user.tag && <span className="text-signal text-xs">{user.tag}</span>}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-500 text-xs">{user.username}</td>
                          <td className="px-5 py-4">
                            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border", rc.bg, rc.color, "border-current/20")}>
                              <RoleIcon className="h-3 w-3" />
                              {user.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="w-24">
                              <div className="flex items-center justify-between mb-1">
                                <span className={cn("text-[10px] font-bold", rc.color)}>{rc.access}%</span>
                              </div>
                              <div className="w-full h-1 rounded-full bg-slate-100 overflow-hidden">
                                <div className={cn("h-full rounded-full", rc.gradient)} style={{ width: `${rc.access}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 font-bold text-signal">৳{user.balance.toLocaleString()}</td>
                          <td className="px-5 py-4 text-slate-500">৳{user.limit.toLocaleString()}</td>
                          <td className="px-5 py-4 font-mono text-xs text-slate-600">{user.phone}</td>
                          <td className="px-5 py-4">
                            <button
                              onClick={() => handleToggleStatus(user.id)}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer hover:opacity-80 transition-opacity border",
                                user.status === "Active"
                                  ? "bg-success-tint text-success border-success/30"
                                  : "bg-destructive/10 text-destructive border-destructive/30"
                              )}
                            >
                              <span className={cn("w-1.5 h-1.5 rounded-full", user.status === "Active" ? "bg-success" : "bg-destructive")} />
                              {user.status}
                            </button>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 relative">
                              <button
                                onClick={() => { setRechargeModal(user); setRechargeAmount(0); }}
                                className="p-2 rounded-lg hover:bg-signal-tint text-slate-500 hover:text-signal transition-colors"
                                title="Recharge"
                              >
                                <Wallet className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setEditModal({ ...user })}
                                className="p-2 rounded-lg hover:bg-violet-accent-tint text-slate-500 hover:text-violet-accent transition-colors"
                                title="Edit"
                              >
                                <UserCog className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id, user.name)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-slate-500 hover:text-destructive transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-slate-100 text-sm">
                <div className="text-slate-500">
                  Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + rowsPerPage, filteredUsers.length)} of {filteredUsers.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1 text-slate-600"
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
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1 text-slate-600"
                  >
                    Next <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-signal-tint flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-signal" />
              </div>
              <h3 className="font-heading text-lg font-bold mb-1 text-signal">No users found</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-5">
                {searchTerm || roleFilter !== "All" || statusFilter !== "All"
                  ? "Try adjusting your search or filters."
                  : "Add your first user to get started."}
              </p>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-signal text-white shadow-md hover:bg-signal-hover hover:scale-105 transition-all"
              >
                <Plus className="h-4 w-4" /> Add User
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ============ MODALS ============ */}

      {/* Add User Modal */}
      {addOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setAddOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Add New User
                </h3>
                <p className="text-xs text-slate-500 mt-1">Create a new user account.</p>
              </div>
              <button
                onClick={() => setAddOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="e.g. Karim Ali"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">
                    Username <span className="text-destructive">*</span>
                  </label>
                  <input
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    placeholder="user@rbnisp.net"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Phone</label>
                  <input
                    value={newUser.phone}
                    onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Reseller">Reseller</option>
                    <option value="POP In-charge">POP In-charge</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Status</label>
                  <select
                    value={newUser.status}
                    onChange={(e) => setNewUser({ ...newUser, status: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Initial Balance (৳)</label>
                  <input
                    type="number"
                    value={newUser.balance}
                    onChange={(e) => setNewUser({ ...newUser, balance: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Credit Limit (৳)</label>
                  <input
                    type="number"
                    value={newUser.limit}
                    onChange={(e) => setNewUser({ ...newUser, limit: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddOpen(false)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Edit User
                </h3>
                <p className="text-xs text-slate-500 mt-1">Update user details.</p>
              </div>
              <button
                onClick={() => setEditModal(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="font-semibold text-sm block text-signal">Full Name</label>
                <input
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Username</label>
                  <input
                    value={editModal.username}
                    onChange={(e) => setEditModal({ ...editModal, username: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Phone</label>
                  <input
                    value={editModal.phone}
                    onChange={(e) => setEditModal({ ...editModal, phone: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Role</label>
                  <select
                    value={editModal.role}
                    onChange={(e) => setEditModal({ ...editModal, role: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Reseller">Reseller</option>
                    <option value="POP In-charge">POP In-charge</option>
                    <option value="Manager">Manager</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Status</label>
                  <select
                    value={editModal.status}
                    onChange={(e) => setEditModal({ ...editModal, status: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Balance (৳)</label>
                  <input
                    type="number"
                    value={editModal.balance}
                    onChange={(e) => setEditModal({ ...editModal, balance: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block text-signal">Credit Limit (৳)</label>
                  <input
                    type="number"
                    value={editModal.limit}
                    onChange={(e) => setEditModal({ ...editModal, limit: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setEditModal(null)}
                  className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Single Recharge Modal */}
      {rechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setRechargeModal(null)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Recharge Balance
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Recharge {rechargeModal.name}'s account
                </p>
              </div>
              <button
                onClick={() => setRechargeModal(null)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-signal-tint rounded-2xl p-5 border border-signal/20 mb-5">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Current Balance</p>
              <p className="font-heading text-2xl font-bold text-signal">৳{rechargeModal.balance.toLocaleString()}</p>
            </div>

            <div className="space-y-3 mb-5">
              <label className="font-semibold text-sm block text-signal">Recharge Amount (৳)</label>
              <input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold text-signal focus:ring-2 focus:ring-signal outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setRechargeAmount(amt)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                      rechargeAmount === amt
                        ? "bg-signal text-white border-signal"
                        : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                    )}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>

            {rechargeAmount > 0 && (
              <div className="bg-success-tint border border-success/30 rounded-xl p-4 mb-5">
                <p className="text-xs text-success font-semibold uppercase mb-1">New Balance</p>
                <p className="font-heading text-xl font-bold text-success">
                  ৳{(rechargeModal.balance + rechargeAmount).toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setRechargeModal(null)}
                className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSingleRecharge}
                className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" /> Recharge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Recharge Modal */}
      {bulkRechargeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setBulkRechargeOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl font-bold text-signal">
                  Bulk Recharge
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Recharge {selectedRows.length} selected user(s)
                </p>
              </div>
              <button
                onClick={() => setBulkRechargeOpen(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-signal-tint rounded-2xl p-5 border border-signal/20 mb-5">
              <p className="text-xs text-slate-500 font-semibold uppercase mb-1">Selected Users</p>
              <p className="font-heading text-2xl font-bold text-signal">{selectedRows.length}</p>
            </div>

            <div className="space-y-3 mb-5">
              <label className="font-semibold text-sm block text-signal">Recharge Amount Per User (৳)</label>
              <input
                type="number"
                value={bulkRechargeAmount}
                onChange={(e) => setBulkRechargeAmount(Number(e.target.value))}
                placeholder="Enter amount"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-semibold text-signal focus:ring-2 focus:ring-signal outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setBulkRechargeAmount(amt)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-semibold border transition-all",
                      bulkRechargeAmount === amt
                        ? "bg-signal text-white border-signal"
                        : "bg-white text-slate-500 border-slate-200 hover:border-signal/50"
                    )}
                  >
                    ৳{amt}
                  </button>
                ))}
              </div>
            </div>

            {bulkRechargeAmount > 0 && (
              <div className="bg-success-tint border border-success/30 rounded-xl p-4 mb-5">
                <p className="text-xs text-success font-semibold uppercase mb-1">Total Recharge Amount</p>
                <p className="font-heading text-xl font-bold text-success">
                  ৳{(bulkRechargeAmount * selectedRows.length).toLocaleString()}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setBulkRechargeOpen(false)}
                className="flex-1 rounded-xl font-semibold h-12 border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkRecharge}
                className="flex-1 rounded-xl font-semibold h-12 bg-signal text-white border-0 shadow-md hover:bg-signal-hover transition-all flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" /> Recharge All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}