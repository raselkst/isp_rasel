"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown, X, Search, Star, PanelLeftClose, PanelLeftOpen,
  LayoutGrid, Radio, FileText, BarChart3, Zap, UserCircle, Radar,
  Wifi, CreditCard, Ticket, Mail, Landmark, Waypoints, Package,
  ServerCog, Users, Settings, BadgeDollarSign, Wallet, Clock,
  Sparkles, History, Bell, Command, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobileSidebarOpen, closeMobileSidebar } from "./mobile-sidebar-store";

interface SubNavItem {
  label: string;
  href: string;
}
interface NavGroupDef {
  key: string;
  label: string;
  icon: React.ElementType;
  basePath: string;
  items: SubNavItem[];
  color: string;
  colorBg: string;
}
interface NavLinkDef {
  key: string;
  label: string;
  icon: React.ElementType;
  href: string;
}

// Single Links
const singleLinks: NavLinkDef[] = [
  { key: "dashboard", label: "DASHBOARD", icon: LayoutGrid, href: "/admin/dashboard" },
  { key: "all-accounts", label: "All Accounts", icon: FileText, href: "/admin/billing/all-accounts" },
  { key: "self-recharge", label: "Auto Top-Up", icon: Zap, href: "/admin/self-recharge" },
  { key: "instant-pay", label: "Quick Settle", icon: Zap, href: "/admin/instant-pay" },
  { key: "payments", label: "Money Stream", icon: Wallet, href: "/admin/payments" },
  { key: "ticketing", label: "Help Desk", icon: Ticket, href: "/admin/ticketing" },
  { key: "network-diagram", label: "Topology Map", icon: Waypoints, href: "/admin/network-diagram" },
  { key: "package-plan", label: "Service Catalog", icon: Package, href: "/admin/package-plan" },
  { key: "server-watcher", label: "Node Monitor", icon: ServerCog, href: "/admin/server-watcher" },
  { key: "manage-users", label: "Team Control", icon: Users, href: "/admin/manage-users" },
];

// Groups
const groups: NavGroupDef[] = [
  {
    key: "zone", label: "ZONE", icon: Radio, basePath: "/zone",
    color: "text-blue-400", colorBg: "bg-blue-500/15",
    items: [
      { label: "Add New Territory", href: "/admin/zone/create" },
      { label: "All Territories", href: "/admin/zone/list" },
      { label: "Sub-Territories", href: "/admin/zone/list-sub-zone" },
      { label: "Subscriber Pay", href: "/admin/zone/customer-payment" },
    ],
  },
  {
    key: "reports", label: "REPORTS", icon: BarChart3, basePath: "/reports",
    color: "text-cyan-400", colorBg: "bg-cyan-500/15",
    items: [
      { label: "PoP Subscriber View", href: "/admin/reports/report-pop-wise" },
      { label: "PoP Revenue Flow", href: "/admin/reports/pop-wise-sales" },
      { label: "Reseller Subscribers", href: "/admin/reports/reseller-wise-client" },
      { label: "Sub-Zone Subscribers", href: "/admin/reports/sub-zone-wise-client" },
      { label: "Server Uptime", href: "/admin/reports/server-wise-online" },
      { label: "Invoices Archive", href: "/admin/reports/invoices" },
      { label: "Online Ledger", href: "/admin/reports/online-transactions" },
      { label: "Merchant Ledger", href: "/admin/reports/merchant-payments" },
      { label: "Merchant Monthly", href: "/admin/reports/merchant-monthly-report" },
      { label: "Monthly Sales Flow", href: "/admin/reports/month-wise-sales" },
      { label: "Server Sales Split", href: "/admin/reports/server-wise-sales" },
      { label: "Reseller Sales Split", href: "/admin/reports/reseller-wise-sales" },
      { label: "Top-Up Chronicles", href: "/admin/reports/recharge-history" },
      { label: "Message Chronicles", href: "/admin/reports/sms-history" },
      { label: "Monthly Active Pulse", href: "/admin/reports/monthly-active-user" },
    ],
  },
  {
    key: "analytics", label: "ANALYTICS", icon: BarChart3, basePath: "/admin/analytics",
    color: "text-violet-400", colorBg: "bg-violet-500/15",
    items: [
      { label: "Bandwidth Peaks", href: "/admin/analytics/high-traffic-usages" },
      { label: "Broadband Insights", href: "/admin/analytics/pppoe-analytics" },
      { label: "Optical Analytics", href: "/admin/analytics/laser-analytics" },
      { label: "Revenue Signals", href: "/admin/analytics/sales-analytics" },
    ],
  },
  {
    key: "clients", label: "CLIENTS", icon: UserCircle, basePath: "/clients",
    color: "text-pink-400", colorBg: "bg-pink-500/15",
    items: [
      { label: "Add New Subscriber", href: "/admin/clients/create" },
      { label: "Standard Renewal", href: "/admin/clients/general-renew" },
      { label: "Subscriber Profile", href: "/admin/clients/view-information" },
      { label: "Find Subscriber", href: "/admin/clients/client-search" },
      { label: "Plan Switch", href: "/admin/clients/plan-migration" },
      { label: "Custom Renewal", href: "/admin/clients/special-renew" },
      { label: "Extend Validity", href: "/admin/clients/client-date-extend" },
      { label: "Remote Renewal", href: "/admin/clients/online-renew" },
    ],
  },
  {
    key: "pppoe", label: "PPPoE", icon: Radar, basePath: "/pppoe",
    color: "text-emerald-400", colorBg: "bg-emerald-500/15",
    items: [
      { label: "Broadband Directory", href: "/admin/pppoe/all-users" },
      { label: "Real-Time Flow", href: "/admin/pppoe/user-traffic" },
      { label: "Live Connections", href: "/admin/pppoe/online-users" },
      { label: "Active Sessions", href: "/admin/pppoe/active-users" },
      { label: "Disconnected", href: "/admin/pppoe/offline-users" },
      { label: "Shared Bandwidth", href: "/admin/pppoe/sharing-users" },
    ],
  },
  {
    key: "hotspot", label: "HOTSPOT Zone", icon: Wifi, basePath: "/hotspot",
    color: "text-amber-400", colorBg: "bg-amber-500/15",
    items: [
      { label: "Wi-Fi Directory", href: "/admin/hotspot/all-users" },
      { label: "Disconnected", href: "/admin/hotspot/offline-users" },
      { label: "Live Wi-Fi", href: "/admin/hotspot/online-users" },
      { label: "Active Wi-Fi", href: "/admin/hotspot/active-users" },
      { label: "Device Traces", href: "/admin/hotspot/mac-log" },
      { label: "Session Traces", href: "/admin/hotspot/log" },
    ],
  },
  {
    key: "cards", label: "CARDS", icon: CreditCard, basePath: "/cards",
    color: "text-orange-400", colorBg: "bg-orange-500/15",
    items: [
      { label: "Voucher Directory", href: "/admin/cards/list" },
      { label: "Find Voucher", href: "/admin/cards/search" },
      { label: "Voucher Maker", href: "/admin/cards/generator" },
      { label: "Bulk Voucher Maker", href: "/admin/cards/generate-excel" },
      { label: "Voucher Print", href: "/admin/cards/print" },
      { label: "Voucher Chronicles", href: "/admin/cards/report" },
      { label: "Voucher By Date", href: "/admin/cards/report-by-date" },
    ],
  },
  {
    key: "sms", label: "Message Center", icon: Mail, basePath: "/sms",
    color: "text-sky-400", colorBg: "bg-sky-500/15",
    items: [
      { label: "Credit Purchase", href: "/admin/sms/buy" },
      { label: "Gateway Setup", href: "/admin/sms/settings" },
    ],
  },
  {
    key: "accounts", label: "Finance Ledger", icon: Landmark, basePath: "/accounts",
    color: "text-teal-400", colorBg: "bg-teal-500/15",
    items: [
      { label: "Finance Panel", href: "/admin/accounts/accounts" },
      { label: "Earnings", href: "/admin/accounts/income" },
      { label: "Spendings", href: "/admin/accounts/expense" },
      { label: "Fund Shuffle", href: "/admin/accounts/fund-transfer" },
      { label: "Bank Vault", href: "/admin/accounts/bank-account" },
      { label: "Voucher Maker", href: "/admin/accounts/voucher-entry" },
      { label: "Invoice Entry", href: "/admin/accounts/bill-entry" },
      { label: "Account Tree", href: "/admin/accounts/chart-of-account" },
      { label: "Cash Stream", href: "/admin/accounts/cash-flow" },
      { label: "Gain & Loss", href: "/admin/accounts/profit-loss" },
      { label: "Cash Stream Details", href: "/admin/accounts/cash-flow-details" },
    ],
  },
  {
    key: "config", label: "CONFIG", icon: Settings, basePath: "/config",
    color: "text-slate-400", colorBg: "bg-slate-500/15",
    items: [
      { label: "Service Catalog", href: "/admin/config/package-plan" },
      { label: "Catalog & Rates", href: "/admin/config/packages-rates" },
      { label: "Server Links", href: "/admin/config/server-bind" },
      { label: "Bulk Subscribers", href: "/admin/config/import-client" },
      { label: "Billing Cycle", href: "/admin/config/bill-cycle-list" },
      { label: "Router Bridge", href: "/admin/config/mikrotik" },
      { label: "System Setup", href: "/admin/config/setup-settings" },
    ],
  },
  {
    key: "package-rate", label: "PLAN & PRICING", icon: BadgeDollarSign, basePath: "/package-rate",
    color: "text-fuchsia-400", colorBg: "bg-fuchsia-500/15",
    items: [
      { label: "Balance Top-Up", href: "/admin/package-rate/balance-add" },
      { label: "Billing Cycle", href: "/admin/package-rate/bill-cycle" },
      { label: "Pricing & Splits", href: "/admin/package-rate/sharing-pct" },
      { label: "Price Book", href: "/admin/package-rate/rate-list" },
      { label: "Subscriber Prices", href: "/admin/package-rate/customer-rates" },
    ],
  },
];

type SearchEntry = { label: string; href: string; group?: string };
const searchIndex: SearchEntry[] = [
  ...groups.flatMap((g) => g.items.map((i) => ({ label: i.label, href: i.href, group: g.label }))),
  ...singleLinks.map((l) => ({ label: l.label, href: l.href })),
];

const OPEN_GROUPS_KEY = "sidebar:open-groups";
const SCROLL_KEY = "sidebar:scroll-top";
const PINNED_KEY = "sidebar:pinned";
const COLLAPSED_KEY = "sidebar:collapsed";
const RECENT_KEY = "sidebar:recent";
const ACTIVE_TAB_KEY = "sidebar:active-tab";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key: string, value: unknown) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function PinStar({ pinned, onToggle }: { pinned: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 p-0.5 rounded",
        pinned && "opacity-100"
      )}
      title={pinned ? "Unpin" : "Pin to top"}
    >
      <Star className={cn("h-3 w-3", pinned ? "fill-amber-400 text-amber-400" : "text-slate-500")} />
    </button>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);
  return <span className="text-[10px] font-mono text-slate-500">{time}</span>;
}

export function DashboardSidebar() {
  const open = useMobileSidebarOpen();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [pinned, setPinned] = useState<string[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"nav" | "pinned" | "recent">("nav");
  const [recent, setRecent] = useState<{ label: string; href: string }[]>([]);

  useLayoutEffect(() => {
    const savedOpen = readJSON<Record<string, boolean>>(OPEN_GROUPS_KEY, {});
    const activeGroup = groups.find((g) => pathname?.startsWith(g.basePath));
    if (activeGroup) savedOpen[activeGroup.key] = true;
    setOpenGroups(savedOpen);
    setPinned(readJSON<string[]>(PINNED_KEY, []));
    setCollapsed(readJSON<boolean>(COLLAPSED_KEY, false));
    setRecent(readJSON<{ label: string; href: string }[]>(RECENT_KEY, []));
    setActiveTab(readJSON<"nav" | "pinned" | "recent">(ACTIVE_TAB_KEY, "nav"));
    setHydrated(true);
  }, [pathname]);

  useEffect(() => {
    if (!hydrated || !pathname) return;
    const entry = searchIndex.find((e) => e.href === pathname);
    if (!entry) return;
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.href !== entry.href);
      const next = [{ label: entry.label, href: entry.href }, ...filtered].slice(0, 5);
      writeJSON(RECENT_KEY, next);
      return next;
    });
  }, [pathname, hydrated]);

  useLayoutEffect(() => {
    if (!hydrated || !scrollRef.current) return;
    const savedScroll = readJSON<number>(SCROLL_KEY, 0);
    scrollRef.current.scrollTop = savedScroll;

    requestAnimationFrame(() => {
      const el = activeItemRef.current;
      const container = scrollRef.current;
      if (!el || !container) return;
      const elRect = el.getBoundingClientRect();
      const boxRect = container.getBoundingClientRect();
      const isVisible = elRect.top >= boxRect.top && elRect.bottom <= boxRect.bottom;
      if (!isVisible) {
        el.scrollIntoView({ block: "center", behavior: savedScroll ? "auto" : "smooth" });
      }
    });
  }, [hydrated]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => writeJSON(SCROLL_KEY, el.scrollTop));
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hydrated]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function toggleGroup(key: string) {
    setOpenGroups((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      writeJSON(OPEN_GROUPS_KEY, next);
      return next;
    });
  }

  function togglePin(href: string) {
    setPinned((prev) => {
      const next = prev.includes(href) ? prev.filter((h) => h !== href) : [...prev, href];
      writeJSON(PINNED_KEY, next);
      return next;
    });
  }

  function toggleCollapsed() {
    setCollapsed((prev) => {
      writeJSON(COLLAPSED_KEY, !prev);
      return !prev;
    });
  }

  function changeTab(tab: "nav" | "pinned" | "recent") {
    setActiveTab(tab);
    writeJSON(ACTIVE_TAB_KEY, tab);
  }

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return searchIndex.filter((e) => e.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  const pinnedEntries = useMemo(
    () => searchIndex.filter((e) => pinned.includes(e.href)),
    [pinned]
  );

  if (!hydrated) return null;

  const renderNavItem = (item: SubNavItem, isPinned: boolean) => {
    const active = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        ref={active ? activeItemRef : undefined}
        className={cn(
          "group/item relative flex items-center justify-between gap-2 pl-4 pr-2.5 py-1.5 rounded-md text-[12.5px] transition-all duration-200",
          active
            ? "text-signal font-semibold bg-signal/10"
            : "text-slate-400 hover:text-white hover:bg-white/5 hover:pl-5"
        )}
      >
        {active && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-signal" />
        )}
        <span className="truncate">{item.label}</span>
        <PinStar pinned={isPinned} onToggle={() => togglePin(item.href)} />
      </Link>
    );
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={closeMobileSidebar} />
      )}

      <aside
        className={cn(
          "shrink-0 bg-gradient-to-b from-[#0f1523] to-[#0a0f1a] text-slate-300 h-screen z-50 transition-[width,transform] duration-200 flex flex-col border-r border-white/5",
          "fixed top-0 left-0 lg:sticky lg:top-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          collapsed ? "w-[76px]" : "w-64"
        )}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-3.5 pt-4 pb-3 shrink-0 border-b border-white/5">
          <div className={cn("flex items-center gap-2.5 min-w-0", collapsed && "justify-center w-full")}>
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0 shadow-lg shadow-signal/30">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 3C7 3 3 6.5 3 11c0 3 2 5.5 4.5 6.8L12 21l4.5-3.2C19 16.5 21 14 21 11c0-4.5-4-8-9-8z" stroke="white" strokeWidth="1.6" />
                <circle cx="12" cy="10" r="2.2" fill="white" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0f1523] animate-pulse" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="font-heading font-bold text-white text-[15px] leading-tight truncate">
                  ISP Cloud
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="text-[9px] tracking-[0.14em] uppercase text-slate-500">Network OS</div>
                  <span className="text-slate-700">·</span>
                  <LiveClock />
                </div>
              </div>
            )}
          </div>
          <button
            onClick={closeMobileSidebar}
            className="lg:hidden w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* USER PROFILE */}
        {!collapsed && (
          <div className="px-3.5 py-3 shrink-0 border-b border-white/5">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-signal/30 transition-all cursor-pointer group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-accent to-signal flex items-center justify-center text-white font-bold text-xs shadow-md">
                  RB
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#0f1523]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-white truncate">RBN Bappy</div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Super Admin
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-signal group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        )}

        {/* SEARCH */}
        {!collapsed && (
          <div className="px-3.5 pt-3 pb-2 shrink-0 relative">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 group-focus-within:text-signal transition-colors" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-14 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-signal/60 focus:ring-2 focus:ring-signal/20 transition-all"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                  <Command className="w-2.5 h-2.5" />K
                </kbd>
              </div>
            </div>

            {results.length > 0 && (
              <div className="absolute left-3.5 right-3.5 top-full mt-1.5 rounded-xl bg-[#1a2032] border border-white/10 shadow-2xl overflow-hidden z-30 max-h-80 overflow-y-auto">
                {results.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    onClick={() => setQuery("")}
                    className="flex items-center justify-between px-3.5 py-2.5 hover:bg-white/5 border-t border-white/5 first:border-t-0 group"
                  >
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-semibold text-white truncate">{r.label}</span>
                      {r.group && <span className="text-[10px] text-slate-500">{r.group}</span>}
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-signal group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* QUICK TABS */}
        {!collapsed && (
          <div className="px-3.5 pb-3 shrink-0">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
              {[
                { id: "nav" as const, icon: LayoutGrid, label: "Nav", count: null },
                { id: "pinned" as const, icon: Star, label: "Pinned", count: pinned.length },
                { id: "recent" as const, icon: History, label: "Recent", count: recent.length },
              ].map((t) => {
                const Icon = t.icon;
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => changeTab(t.id)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                      isActive
                        ? "bg-gradient-to-r from-signal to-violet-accent text-white shadow-md"
                        : "text-slate-500 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <Icon className={cn("w-3 h-3", t.id === "pinned" && isActive && "fill-white")} />
                    {t.label}
                    {t.count !== null && t.count > 0 && (
                      <span className={cn(
                        "px-1 rounded-full text-[8px] font-bold",
                        isActive ? "bg-white/20" : "bg-white/10 text-slate-400"
                      )}>
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* NAV BODY */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 pb-3 sidebar-scroll">
          {!collapsed && activeTab === "pinned" && (
            <div className="space-y-0.5">
              {pinnedEntries.length > 0 ? (
                pinnedEntries.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    ref={pathname === p.href ? activeItemRef : undefined}
                    className={cn(
                      "group/item relative flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-[12.5px] transition-all",
                      pathname === p.href
                        ? "bg-signal/15 text-signal font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="truncate">{p.label}</span>
                    <PinStar pinned onToggle={() => togglePin(p.href)} />
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 px-4">
                  <Star className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No pinned items</p>
                  <p className="text-[10px] text-slate-600 mt-1">Hover any item and click ★</p>
                </div>
              )}
            </div>
          )}

          {!collapsed && activeTab === "recent" && (
            <div className="space-y-0.5">
              {recent.length > 0 ? (
                recent.map((r) => (
                  <Link
                    key={r.href}
                    href={r.href}
                    className={cn(
                      "flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12.5px] transition-all",
                      pathname === r.href
                        ? "bg-signal/15 text-signal font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <History className="w-3 h-3 shrink-0 text-slate-500" />
                    <span className="truncate">{r.label}</span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10 px-4">
                  <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No recent visits</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "nav" && (
            <>
              <div className="mb-2">
                {singleLinks.slice(0, 2).map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      ref={active ? activeItemRef : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all mb-0.5",
                        collapsed && "justify-center",
                        active
                          ? "bg-gradient-to-r from-signal to-violet-accent text-white font-semibold shadow-md shadow-signal/20"
                          : "text-slate-300/80 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>

              {!collapsed && (
                <div className="flex items-center gap-2 px-2.5 py-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <span className="text-[9px] tracking-[0.2em] uppercase text-slate-600 font-semibold">Modules</span>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              )}

              {groups.map((g) => {
                const isActiveSection = pathname?.startsWith(g.basePath);
                const isOpen = collapsed ? isActiveSection : !!openGroups[g.key];
                const GroupIcon = g.icon;

                return (
                  <div key={g.key} className="mb-0.5">
                    <button
                      onClick={() => !collapsed && toggleGroup(g.key)}
                      title={collapsed ? g.label : undefined}
                      className={cn(
                        "w-full group/group flex items-center justify-between px-2.5 py-2 rounded-lg text-[13px] font-semibold transition-all",
                        collapsed && "justify-center",
                        isActiveSection
                          ? "bg-white/5 text-white"
                          : "text-slate-300/80 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <span className={cn("flex items-center gap-2.5 min-w-0", collapsed && "justify-center")}>
                        <span className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-all",
                          isActiveSection ? g.colorBg : "bg-white/5 group-hover/group:bg-white/10"
                        )}>
                          <GroupIcon className={cn("h-3.5 w-3.5", isActiveSection ? g.color : "text-slate-400")} />
                        </span>
                        {!collapsed && <span className="truncate">{g.label}</span>}
                        {!collapsed && g.items.length > 0 && (
                          <span className={cn(
                            "ml-auto px-1.5 rounded text-[9px] font-bold",
                            isActiveSection ? "bg-signal/20 text-signal" : "bg-white/5 text-slate-500"
                          )}>
                            {g.items.length}
                          </span>
                        )}
                      </span>
                      {!collapsed && (
                        <ChevronDown className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform duration-200",
                          isOpen && "rotate-180",
                          isActiveSection ? "text-signal" : "text-slate-500"
                        )} />
                      )}
                    </button>

                    {!collapsed && (
                      <div
                        className="ml-3 pl-2 border-l border-white/10 overflow-hidden transition-[grid-template-rows] duration-200 grid"
                        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <div className="mt-1 flex flex-col gap-0.5 pb-1">
                            {g.items.map((item) => renderNavItem(item, pinned.includes(item.href)))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="mt-2 pt-2 border-t border-white/5">
                {singleLinks.slice(2).map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      ref={active ? activeItemRef : undefined}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "relative flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all mb-0.5",
                        collapsed && "justify-center",
                        active
                          ? "bg-gradient-to-r from-signal to-violet-accent text-white font-semibold shadow-md shadow-signal/20"
                          : "text-slate-300/80 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="shrink-0 border-t border-white/5 p-2.5 space-y-1">
          {!collapsed && (
            <Link
              href="/admin/notifications"
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-[12.5px] font-semibold transition-colors",
                pathname === "/admin/notifications"
                  ? "bg-signal/15 text-signal"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
            >
              <span className="flex items-center gap-2.5">
                <div className="relative">
                  <Bell className="h-4 w-4 shrink-0" />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </div>
                <span>Notifications</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-400">
                3
              </span>
            </Link>
          )}

          <button
            onClick={toggleCollapsed}
            className={cn(
              "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[12.5px] font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors",
              collapsed && "justify-center"
            )}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4 shrink-0" /> : <PanelLeftClose className="h-4 w-4 shrink-0" />}
            {!collapsed && <span>Collapse Sidebar</span>}
          </button>

          {!collapsed && (
            <div className="px-2.5 pt-2 pb-1 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-600">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                <span>v2.4.0 · All systems operational</span>
              </div>
            </div>
          )}
        </div>
      </aside>

      <style jsx global>{`
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 4px;
        }
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.08) transparent;
        }
      `}</style>
    </>
  );
}