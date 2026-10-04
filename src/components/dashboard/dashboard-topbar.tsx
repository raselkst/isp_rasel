"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell, Headphones, Settings, Search, Menu, X, User, LogOut,
  Plus, FileText, Ticket, UserPlus, Wallet, Command, ChevronDown,
  Moon, Sun, Globe, Palette, HelpCircle, Shield, CheckCircle2,
  Clock, Link2, Zap, Home, Star, Sparkles, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleMobileSidebar } from "./mobile-sidebar-store";

// 🎯 Search Index
const searchIndex = [
  { label: "Add New Client", href: "/admin/clients/create", icon: UserPlus, category: "Clients" },
  { label: "General Renew", href: "/admin/clients/general-renew", icon: Zap, category: "Clients" },
  { label: "Client Search", href: "/admin/clients/client-search", icon: Search, category: "Clients" },
  { label: "Create Invoice", href: "/admin/reports/invoices", icon: FileText, category: "Billing" },
  { label: "All Accounts", href: "/admin/billing/all-accounts", icon: Wallet, category: "Billing" },
  { label: "Payments", href: "/admin/payments", icon: Wallet, category: "Finance" },
  { label: "Instant Pay", href: "/admin/instant-pay", icon: Zap, category: "Finance" },
  { label: "Create Ticket", href: "/admin/ticketing", icon: Ticket, category: "Support" },
  { label: "Network Diagram", href: "/admin/network-diagram", icon: Sparkles, category: "Infrastructure" },
  { label: "Server Watcher", href: "/admin/server-watcher", icon: Shield, category: "Infrastructure" },
  { label: "Manage Users", href: "/admin/manage-users", icon: User, category: "Access" },
  { label: "SMS Buy", href: "/admin/sms/buy", icon: MessageSquare, category: "SMS" },
  { label: "Mikrotik Config", href: "/admin/config/mikrotik", icon: Settings, category: "Config" },
  { label: "Dashboard", href: "/admin/dashboard", icon: Home, category: "Overview" },
];

// 🎯 Notifications
const initialNotifications = [
  { id: 1, title: "New client registered", desc: "Rahim Uddin joined via portal", time: "2m ago", type: "success", read: false },
  { id: 2, title: "Payment received", desc: "৳490 from C-101 (bKash)", time: "15m ago", type: "success", read: false },
  { id: 3, title: "Server warning", desc: "SERVER-3 latency above 45ms", time: "1h ago", type: "warning", read: false },
  { id: 4, title: "New support ticket", desc: "TKT-1006: Fiber cable damaged", time: "2h ago", type: "info", read: true },
  { id: 5, title: "Ticket SLA breached", desc: "TKT-1003 exceeded 4h response", time: "4h ago", type: "error", read: true },
];

// 🎯 Create New Menu
const createMenuItems = [
  { label: "New Client", href: "/admin/clients/create", icon: UserPlus, color: "text-emerald-600 bg-emerald-500/10", desc: "Register a new client" },
  { label: "New Invoice", href: "/admin/reports/invoices", icon: FileText, color: "text-blue-600 bg-blue-500/10", desc: "Create billing invoice" },
  { label: "New Ticket", href: "/admin/ticketing", icon: Ticket, color: "text-amber-600 bg-amber-500/10", desc: "Report support issue" },
  { label: "New Payment", href: "/admin/payments", icon: Wallet, color: "text-violet-600 bg-violet-500/10", desc: "Record a payment" },
];

export function DashboardTopbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [time, setTime] = useState("");

  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLDivElement>(null);

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  // Keyboard shortcut: Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setShowNotifications(false);
        setShowProfile(false);
        setShowSettings(false);
        setShowCreate(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (notifRef.current && !notifRef.current.contains(target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(target)) setShowProfile(false);
      if (settingsRef.current && !settingsRef.current.contains(target)) setShowSettings(false);
      if (createRef.current && !createRef.current.contains(target)) setShowCreate(false);
      if (searchRef.current && !searchRef.current.contains(target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredSearch = searchTerm.trim()
    ? searchIndex.filter(
        (item) =>
          item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 8)
    : searchIndex.slice(0, 6);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Current page URL copied!");
    setShowSettings(false);
  };

  const notifIconColor = (type: string) => {
    switch (type) {
      case "success": return "bg-emerald-500/15 text-emerald-600";
      case "warning": return "bg-amber-500/15 text-amber-600";
      case "error": return "bg-red-500/15 text-red-600";
      default: return "bg-blue-500/15 text-blue-600";
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-3 border-b bg-card/95 backdrop-blur-md sticky top-0 z-30">
      {/* ============ LEFT: Menu + Search ============ */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={toggleMobileSidebar}
          className="lg:hidden w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 hover:bg-muted transition-colors"
        >
          <Menu className="h-4 w-4" />
        </button>

        {/* Desktop Search Trigger */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
          className="hidden sm:flex items-center gap-2 w-full max-w-[360px] h-9 px-3 rounded-lg border bg-muted/40 hover:bg-muted/60 transition-colors text-sm text-muted-foreground"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          <span className="flex-1 text-left">Search clients, invoices, tickets…</span>
          <kbd className="hidden md:flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono shrink-0">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Mobile Search */}
        <button
          onClick={() => { setSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
          className="sm:hidden w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 hover:bg-muted transition-colors"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Current Page Badge (Desktop only) */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-signal/5 border border-signal/20 ml-2">
          <Home className="w-3 h-3 text-signal" />
          <span className="text-[11px] font-semibold text-signal truncate max-w-[140px]">
            {pathname?.split("/").filter(Boolean).slice(-1)[0]?.replace(/-/g, " ") || "Dashboard"}
          </span>
        </div>
      </div>

      {/* ============ RIGHT: Actions ============ */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        
        {/* Live Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-[11px] font-mono text-muted-foreground font-semibold">{time}</span>
        </div>

        {/* Support Button */}
        <button
          onClick={() => alert("Live support chat opening...\n\nOur team will be with you shortly.")}
          className="hidden sm:flex w-9 h-9 rounded-lg border items-center justify-center hover:bg-muted transition-colors"
          title="Support"
        >
          <Headphones className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); setShowSettings(false); setShowCreate(false); }}
            className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-muted transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-card">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-signal" />
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-signal font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n.id)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 px-4 py-3 border-b last:border-b-0 hover:bg-muted/40 transition-colors",
                        !n.read && "bg-signal/5"
                      )}
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", notifIconColor(n.type))}>
                        {n.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                        {n.type === "warning" && <Bell className="w-4 h-4" />}
                        {n.type === "error" && <Bell className="w-4 h-4" />}
                        {n.type === "info" && <Bell className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn("text-xs", !n.read ? "font-semibold" : "font-medium")}>{n.title}</p>
                          {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-signal shrink-0" />}
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Bell className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">No notifications</p>
                  </div>
                )}
              </div>

              <Link
                href="/admin/dashboard"
                onClick={() => setShowNotifications(false)}
                className="block text-center px-4 py-3 border-t bg-muted/30 text-xs text-signal font-semibold hover:bg-muted/50 transition-colors"
              >
                View all notifications →
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <div ref={settingsRef} className="relative">
          <button
            onClick={() => { setShowSettings(!showSettings); setShowNotifications(false); setShowProfile(false); setShowCreate(false); }}
            className="hidden sm:flex w-9 h-9 rounded-lg border items-center justify-center hover:bg-muted transition-colors"
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </button>

          {showSettings && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b bg-muted/30">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-signal" /> Settings
                </h3>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => { setDarkMode(!darkMode); alert(`Dark Mode ${!darkMode ? "enabled" : "disabled"}`); }}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/40 transition-colors border-b"
              >
                <div className="flex items-center gap-3">
                  {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-500" />}
                  <span className="text-sm">Dark Mode</span>
                </div>
                <div className={cn("w-8 h-4 rounded-full transition-colors relative", darkMode ? "bg-signal" : "bg-muted")}>
                  <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all", darkMode ? "left-4" : "left-0.5")} />
                </div>
              </button>

              {/* Language */}
              <button
                onClick={() => alert("Language switcher: English / বাংলা / हिन्दी")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b"
              >
                <Globe className="w-4 h-4 text-blue-500" />
                <span className="text-sm flex-1 text-left">Language</span>
                <span className="text-xs text-muted-foreground">English</span>
              </button>

              {/* Theme */}
              <button
                onClick={() => alert("Theme customization panel")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b"
              >
                <Palette className="w-4 h-4 text-fuchsia-500" />
                <span className="text-sm">Theme</span>
              </button>

              {/* Copy URL */}
              <button
                onClick={handleCopyUrl}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors border-b"
              >
                <Link2 className="w-4 h-4 text-emerald-500" />
                <span className="text-sm">Copy Page URL</span>
              </button>

              {/* Help */}
              <button
                onClick={() => alert("Help Center opening...")}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span className="text-sm">Help & Support</span>
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); setShowSettings(false); setShowCreate(false); }}
            className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-muted transition-colors"
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-white font-bold text-xs shadow-md">
                RB
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-card" />
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform hidden sm:block", showProfile && "rotate-180")} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {/* User Info */}
              <div className="p-4 bg-gradient-to-br from-signal-tint/60 to-violet-accent-tint/60 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-white font-bold shadow-md">
                    RB
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm truncate">RBN Bappy</p>
                    <p className="text-[11px] text-muted-foreground truncate">rbn@ispcloud.net</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-signal/15 text-signal text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-signal" /> Super Admin
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                    Verified
                  </span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-1.5">
                <button
                  onClick={() => { alert("Profile page"); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <User className="w-4 h-4 text-signal" /> My Profile
                </button>
                <button
                  onClick={() => { alert("Account settings"); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <Settings className="w-4 h-4 text-blue-500" /> Account Settings
                </button>
                <button
                  onClick={() => { alert("Manage users"); router.push("/admin/manage-users"); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <Shield className="w-4 h-4 text-violet-500" /> Manage Users
                </button>
                <button
                  onClick={() => { alert("Activity log"); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <Clock className="w-4 h-4 text-amber-500" /> Activity Log
                </button>
              </div>

              {/* Logout */}
              <div className="p-1.5 border-t">
                <button
                  onClick={() => { if (confirm("Log out from your account?")) alert("Logged out successfully!"); setShowProfile(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-red-600 font-semibold"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Create New */}
        <div ref={createRef} className="relative">
          <Button
            onClick={() => { setShowCreate(!showCreate); setShowNotifications(false); setShowProfile(false); setShowSettings(false); }}
            className="rounded-lg font-semibold whitespace-nowrap bg-gradient-to-r from-signal to-violet-accent border-0 shadow-md hover:shadow-lg"
          >
            <Plus className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Create New</span>
          </Button>

          {showCreate && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-card border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b bg-muted/30">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-signal" /> Quick Create
                </h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">What would you like to create?</p>
              </div>

              <div className="p-2">
                {createMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setShowCreate(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                    >
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", item.color)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{item.desc}</p>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ============ SEARCH MODAL ============ */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div ref={searchRef} className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b">
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
              <input
                ref={searchInputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search clients, invoices, tickets, or any page..."
                className="flex-1 bg-transparent outline-none text-base placeholder:text-muted-foreground"
              />
              <kbd className="px-2 py-1 rounded bg-muted text-[10px] font-mono text-muted-foreground shrink-0">
                ESC
              </kbd>
            </div>

            {/* Search Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {filteredSearch.length > 0 ? (
                <>
                  <div className="px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/30">
                    {searchTerm ? `Results for "${searchTerm}"` : "Quick Actions"}
                  </div>
                  {filteredSearch.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setSearchOpen(false); setSearchTerm(""); }}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-muted/50 transition-colors border-b last:border-b-0 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0 group-hover:bg-signal/20 transition-colors">
                          <Icon className="w-4 h-4 text-signal" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{item.label}</p>
                          <p className="text-[11px] text-muted-foreground">{item.category}</p>
                        </div>
                        <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-semibold">No results found</p>
                  <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t bg-muted/30 flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">↑↓</kbd> Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-background border text-[10px] font-mono">↵</kbd> Open
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Command className="w-3 h-3" />K to open anywhere
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}