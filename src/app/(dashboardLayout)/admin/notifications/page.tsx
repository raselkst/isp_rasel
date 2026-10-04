"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bell, CheckCircle2, AlertTriangle, Info, XCircle, Search,
  Check, Trash2, Filter, RefreshCw, ArrowRight, Clock,
  Users, CreditCard, Server, MessageSquare, Shield, Zap,
  TrendingUp, Mail, X, CheckCheck
} from "lucide-react";

type NotificationType = "success" | "warning" | "error" | "info";
type NotificationCategory = "system" | "payment" | "user" | "server" | "message" | "security";

interface Notification {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  category: NotificationCategory;
  time: string;
  read: boolean;
  actionLink?: string;
}

const initialNotifications: Notification[] = [
  {
    id: 1,
    title: "New client registered",
    description: "Rahim Uddin has been added as a new client in Zone-1.",
    type: "success",
    category: "user",
    time: "2 minutes ago",
    read: false,
    actionLink: "/admin/clients/view-information",
  },
  {
    id: 2,
    title: "Payment received",
    description: "৳2,500 payment received from ZS Cable Network via bKash.",
    type: "success",
    category: "payment",
    time: "15 minutes ago",
    read: false,
    actionLink: "/admin/accounts/income",
  },
  {
    id: 3,
    title: "Server SERVER-2 is down",
    description: "Server SERVER-2 stopped responding. Check immediately.",
    type: "error",
    category: "server",
    time: "1 hour ago",
    read: false,
    actionLink: "/admin/server-watcher",
  },
  {
    id: 4,
    title: "SMS credit running low",
    description: "You have only 250 SMS credits left. Please recharge.",
    type: "warning",
    category: "message",
    time: "3 hours ago",
    read: true,
    actionLink: "/admin/sms/buy",
  },
  {
    id: 5,
    title: "Suspicious login detected",
    description: "Login from a new device (IP: 103.191.240.213) detected.",
    type: "warning",
    category: "security",
    time: "5 hours ago",
    read: true,
  },
  {
    id: 6,
    title: "Backup completed",
    description: "Daily database backup completed successfully.",
    type: "info",
    category: "system",
    time: "8 hours ago",
    read: true,
  },
  {
    id: 7,
    title: "25 new invoices generated",
    description: "Auto-invoice generation completed for 25 clients.",
    type: "info",
    category: "payment",
    time: "1 day ago",
    read: true,
    actionLink: "/admin/reports/invoices",
  },
  {
    id: 8,
    title: "New ticket assigned",
    description: "Ticket #TKT-1005 assigned to you by Super Admin.",
    type: "info",
    category: "user",
    time: "2 days ago",
    read: true,
    actionLink: "/admin/ticketing",
  },
];

const typeConfig: Record<NotificationType, {
  icon: any; color: string; bg: string; border: string;
}> = {
  success: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  error: { icon: XCircle, color: "text-red-600", bg: "bg-red-500/10", border: "border-red-500/20" },
  info: { icon: Info, color: "text-blue-600", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

const categoryConfig: Record<NotificationCategory, {
  label: string; icon: any; color: string;
}> = {
  system: { label: "System", icon: Shield, color: "text-slate-600" },
  payment: { label: "Payment", icon: CreditCard, color: "text-emerald-600" },
  user: { label: "User", icon: Users, color: "text-violet-600" },
  server: { label: "Server", icon: Server, color: "text-red-600" },
  message: { label: "Message", icon: MessageSquare, color: "text-blue-600" },
  security: { label: "Security", icon: Shield, color: "text-amber-600" },
};

const filters: { id: "all" | "unread" | NotificationType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "success", label: "Success" },
  { id: "warning", label: "Warning" },
  { id: "error", label: "Error" },
  { id: "info", label: "Info" },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | NotificationType>("all");
  const [categoryFilter, setCategoryFilter] = useState<NotificationCategory | "all">("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ফিল্টার
  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "unread" && !n.read) ||
        n.type === activeFilter;
      const matchesCategory =
        categoryFilter === "all" || n.category === categoryFilter;
      return matchesSearch && matchesFilter && matchesCategory;
    });
  }, [notifications, searchTerm, activeFilter, categoryFilter]);

  // Stat counts
  const stats = useMemo(() => ({
    total: notifications.length,
    unread: notifications.filter((n) => !n.read).length,
    success: notifications.filter((n) => n.type === "success").length,
    warning: notifications.filter((n) => n.type === "warning").length,
    error: notifications.filter((n) => n.type === "error").length,
  }), [notifications]);

  // Actions
  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    alert("All notifications marked as read!");
  };

  const deleteOne = (id: number) => {
    if (confirm("Delete this notification?")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const clearAll = () => {
    if (confirm("Delete all notifications? This cannot be undone.")) {
      setNotifications([]);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      alert("Notifications refreshed!");
    }, 800);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Notification Center
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Stay updated with all system, payment, and security alerts.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} /> Refresh
              </Button>
              <Button
                onClick={markAllAsRead}
                disabled={stats.unread === 0}
                className="rounded-full gap-1.5 font-semibold bg-gradient-to-r from-signal to-violet-accent border-0"
              >
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </Button>
            </div>
          </div>

          {/* Compact Colorful Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-signal to-violet-accent text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Total</p>
                <p className="text-lg font-heading font-bold">{stats.total}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Unread</p>
                <p className="text-lg font-heading font-bold">{stats.unread}</p>
              </div>
              {stats.unread > 0 && (
                <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10 animate-pulse" />
              )}
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Success</p>
                <p className="text-lg font-heading font-bold">{stats.success}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>

            <div className="relative overflow-hidden rounded-xl p-3 flex items-center gap-3 bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md">
              <div className="w-9 h-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                <XCircle className="w-4 h-4" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase opacity-90 whitespace-nowrap">Alerts</p>
                <p className="text-lg font-heading font-bold">{stats.error + stats.warning}</p>
              </div>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full border-2 border-white/10" />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-card rounded-2xl border p-4 mb-5">
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search notifications..."
                  className="pl-9 rounded-xl"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-3 py-2.5 rounded-xl border bg-background text-sm font-semibold focus:ring-2 focus:ring-signal/30 outline-none"
              >
                <option value="all">All Categories</option>
                <option value="system">System</option>
                <option value="payment">Payment</option>
                <option value="user">User</option>
                <option value="server">Server</option>
                <option value="message">Message</option>
                <option value="security">Security</option>
              </select>

              {/* Clear All */}
              {notifications.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAll}
                  className="rounded-xl font-semibold text-red-500 border-red-500/30 hover:bg-red-500/5"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Clear All
                </Button>
              )}
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter:
              </span>
              {filters.map((f) => {
                const count =
                  f.id === "all"
                    ? notifications.length
                    : f.id === "unread"
                    ? stats.unread
                    : notifications.filter((n) => n.type === f.id).length;
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all",
                      activeFilter === f.id
                        ? "bg-signal text-white border-signal shadow-md"
                        : "bg-background text-muted-foreground border-border hover:border-signal/50"
                    )}
                  >
                    {f.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filtered.length > 0 ? (
              filtered.map((n) => {
                const tConfig = typeConfig[n.type];
                const cConfig = categoryConfig[n.category];
                const TypeIcon = tConfig.icon;
                const CategoryIcon = cConfig.icon;
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "group relative bg-card rounded-2xl border p-5 transition-all hover:shadow-md",
                      !n.read && "border-signal/30 bg-signal/[0.02]"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      {/* Type Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                        tConfig.bg, tConfig.border
                      )}>
                        <TypeIcon className={cn("w-5 h-5", tConfig.color)} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className={cn(
                            "font-bold text-sm",
                            !n.read ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {n.title}
                          </h3>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-signal animate-pulse shrink-0" />
                          )}
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                            tConfig.bg, tConfig.color, tConfig.border
                          )}>
                            {n.type.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                            <CategoryIcon className={cn("w-3 h-3", cConfig.color)} />
                            {cConfig.label}
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-2">{n.description}</p>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {n.time}
                          </span>
                          {n.actionLink && (
                            <Link
                              href={n.actionLink}
                              className="text-signal font-semibold flex items-center gap-1 hover:underline"
                            >
                              View Details <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="p-2 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteOne(n.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-card rounded-2xl border border-dashed p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-signal" />
                </div>
                <h3 className="font-heading text-lg font-bold mb-1">No notifications found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {searchTerm || activeFilter !== "all" || categoryFilter !== "all"
                    ? "Try adjusting your filters or search term."
                    : "You're all caught up! New notifications will appear here."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}