"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { cn } from "@/lib/utils";
import {
  Users, Home, TrendingUp, FileText, UserPlus, UserMinus, ShoppingBag,
  Store, CalendarDays, Coins, Activity, Ban, Clock, Calendar, UsersRound,
  Wifi, Sparkles, ArrowUpRight, ArrowDownRight, DollarSign, X, Send,
  Wallet, Search, ChevronRight, RefreshCw, Smartphone, CheckCircle2,
  AlertCircle, Eye, Bell
} from "lucide-react";

// ===========================================================================
// Data
// ===========================================================================
const tabs = [
  { id: "clients", label: "Clients" },
  { id: "monthly", label: "Monthly Data" },
  { id: "pppoe", label: "PPPoE" },
  { id: "pptp", label: "PPTP" },
  { id: "sstp", label: "SSTP" },
  { id: "ovpn", label: "OVPN" },
  { id: "hotspot", label: "WiFi Hotspot" },
  { id: "voucher", label: "Voucher Card" },
  { id: "zone", label: "Zone" },
  { id: "tickets", label: "Tickets" },
];

const tabData: Record<string, { stat1: number; stat2: number; stat3: number; label1: string; label2: string; label3: string }> = {
  clients: { stat1: 921, stat2: 200, stat3: 320, label1: "Total", label2: "Suspended", label3: "Pending" },
  monthly: { stat1: 268, stat2: 52, stat3: 90, label1: "Active", label2: "Offline", label3: "New" },
  pppoe: { stat1: 500, stat2: 120, stat3: 80, label1: "Online", label2: "Offline", label3: "Pending" },
  pptp: { stat1: 120, stat2: 30, stat3: 15, label1: "Online", label2: "Offline", label3: "Pending" },
  sstp: { stat1: 80, stat2: 20, stat3: 10, label1: "Online", label2: "Offline", label3: "Pending" },
  ovpn: { stat1: 60, stat2: 15, stat3: 8, label1: "Online", label2: "Offline", label3: "Pending" },
  hotspot: { stat1: 240, stat2: 45, stat3: 30, label1: "Active", label2: "Expired", label3: "Pending" },
  voucher: { stat1: 150, stat2: 25, stat3: 12, label1: "Used", label2: "Unused", label3: "Expired" },
  zone: { stat1: 12, stat2: 5, stat3: 3, label1: "Total", label2: "Active", label3: "Pending" },
  tickets: { stat1: 24, stat2: 18, stat3: 86, label1: "Open", label2: "In Progress", label3: "Closed" },
};

const invoiceRows = [
  { invoice: "872193", user: "Taylor Michel", date: "Jun 23", amount: "$31.65", status: "paid" as const },
  { invoice: "872194", user: "Michel Taylor", date: "Jun 23", amount: "$31.65", status: "unpaid" as const },
  { invoice: "872195", user: "Rahim Uddin", date: "Jun 22", amount: "$31.65", status: "paid" as const },
  { invoice: "872196", user: "Sara Nasrin", date: "Jun 22", amount: "$31.65", status: "unpaid" as const },
];

const expiryRows = [
  { username: "nazmul123", bill: "$31.65", expiry: "Jun 23" },
  { username: "nazmul124", bill: "$31.65", expiry: "Jun 23" },
  { username: "nazmul125", bill: "$31.65", expiry: "Jun 24" },
  { username: "nazmul126", bill: "$31.65", expiry: "Jun 24" },
];

const expiredRows = [
  { username: "nazmul123", bill: "$31.65", expired: "Jun 23" },
  { username: "nazmul124", bill: "$31.65", expired: "Jun 23" },
  { username: "nazmul125", bill: "$31.65", expired: "Jun 22" },
  { username: "nazmul126", bill: "$31.65", expired: "Jun 22" },
];

const salesSeries = [32, 41, 35, 52, 48, 61, 58, 70, 66, 78, 74, 89];
const salesLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const regionData = [
  { name: "Dhaka", value: 42, color: "#22C58B" },
  { name: "Chattogram", value: 26, color: "#5B8CFF" },
  { name: "Sylhet", value: 18, color: "#FFB454" },
  { name: "Other", value: 14, color: "#FF6B4A" },
];

// ===========================================================================
// Pulse strip
// ===========================================================================
function PulseStrip({ onClick }: { onClick: () => void }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1400);
    return () => clearInterval(id);
  }, []);

  const bars = Array.from({ length: 48 }, (_, i) => {
    const base = Math.sin((i + tick) * 0.4) * 0.5 + 0.5;
    const noise = Math.sin((i * 7 + tick * 3) * 0.9) * 0.15;
    return Math.max(0.12, Math.min(1, base * 0.7 + noise + 0.25));
  });

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card px-6 py-4 transition-all hover:shadow-lg hover:border-signal/40"
    >
      <div className="flex items-center justify-between gap-6">
        <div className="flex shrink-0 items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <div>
            <p className="font-mono text-[11px] text-muted-foreground">network status</p>
            <p className="font-mono text-sm font-medium text-foreground">nominal, 320 sessions live</p>
          </div>
        </div>

        <div className="flex h-9 flex-1 items-end gap-[3px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-emerald-500/80 to-blue-500/60 transition-all duration-[1400ms] ease-in-out"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-mono text-[11px] text-muted-foreground">balance</p>
          <p className="font-mono text-sm font-medium text-foreground">৳48,200</p>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Hero radial
// ===========================================================================
function HeroRadial({ value, of, label, sub }: { value: number; of: number; label: string; sub: string }) {
  const [hovered, setHovered] = useState(false);
  const pct = value / of;
  const r = 84;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-8">
      <div
        className="relative h-[200px] w-[200px] shrink-0 cursor-pointer transition-transform hover:scale-105"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={r} fill="none" stroke="currentColor" className="text-border" strokeWidth="10" />
          <circle
            cx="100" cy="100" r={r} fill="none"
            stroke="url(#pulseGrad)" strokeWidth="10" strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{ transition: "stroke-dashoffset 1s ease" }}
          />
          <defs>
            <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22C58B" />
              <stop offset="100%" stopColor="#5B8CFF" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-semibold text-foreground">{value}</span>
          <span className="font-mono text-[11px] text-muted-foreground">of {of}</span>
          {hovered && (
            <span className="absolute bottom-8 font-mono text-[10px] text-signal bg-signal/10 px-2 py-0.5 rounded-full">
              {Math.round(pct * 100)}% active
            </span>
          )}
        </div>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-emerald-500">{label}</p>
        <p className="mt-1 max-w-[220px] font-sans text-sm leading-relaxed text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

// ===========================================================================
// Ticker rail
// ===========================================================================
type TickerItem = {
  label: string;
  value: string | number;
  icon: any;
  delta?: string;
  deltaUp?: boolean;
  href?: string;
};

function TickerRail({ items, onItemClick }: { items: TickerItem[]; onItemClick: (item: TickerItem) => void }) {
  return (
    <div className="divide-y divide-border">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <button
            key={i}
            onClick={() => onItemClick(item)}
            className="w-full flex items-center justify-between gap-3 py-3 hover:bg-muted/40 transition-colors -mx-2 px-2 rounded-lg"
          >
            <div className="flex items-center gap-2.5">
              <Icon className="h-3.5 w-3.5 text-blue-500" strokeWidth={1.75} />
              <span className="font-sans text-[13px] text-muted-foreground">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] text-foreground">{item.value}</span>
              {item.delta && (
                <span className={cn("font-mono text-[10px]", item.deltaUp ? "text-emerald-500" : "text-red-500")}>
                  {item.delta}
                </span>
              )}
              <ChevronRight className="w-3 h-3 text-muted-foreground" />
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ===========================================================================
// Sales line chart with hover
// ===========================================================================
function SignalTrend() {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const w = 560;
  const h = 200;
  const max = Math.max(...salesSeries);
  const min = Math.min(...salesSeries);
  const pad = 20;

  const points = salesSeries.map((v, i) => {
    const x = pad + (i / (salesSeries.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / (max - min)) * (h - pad * 2);
    return { x, y, v };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1].x},${h - pad} L${points[0].x},${h - pad} Z`;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-sans text-[13px] font-medium text-foreground">Revenue trend</p>
          <p className="font-mono text-[11px] text-muted-foreground">last 12 months</p>
        </div>
        <p className="font-mono text-lg text-emerald-500">+42.6%</p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22C58B" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#22C58B" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#areaGrad)" />
        <path d={linePath} fill="none" stroke="#22C58B" strokeWidth="2" />
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x} cy={p.y} r={12} fill="transparent" className="cursor-pointer"
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
            />
            <circle
              cx={p.x} cy={p.y}
              r={hoverIdx === i ? 6 : i === points.length - 1 ? 4 : 0}
              fill={hoverIdx === i ? "#22C58B" : "#1F2937"}
              className="transition-all"
            />
          </g>
        ))}
        {hoverIdx !== null && (
          <g>
            <rect
              x={points[hoverIdx].x - 30}
              y={points[hoverIdx].y - 40}
              width="60" height="26" rx="6"
              fill="#1F2937"
            />
            <text
              x={points[hoverIdx].x} y={points[hoverIdx].y - 22}
              textAnchor="middle" fill="white"
              fontSize="11" fontFamily="monospace"
            >
              ৳{points[hoverIdx].v}k
            </text>
          </g>
        )}
      </svg>
      <div className="mt-2 flex justify-between">
        {salesLabels.map((l, i) => (
          <span
            key={l}
            className={cn(
              "font-mono text-[10px] transition-colors cursor-pointer",
              hoverIdx === i ? "text-signal font-bold" : "text-muted-foreground"
            )}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          >
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Region breakdown
// ===========================================================================
function RegionArcs({ onRegionClick }: { onRegionClick: (name: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const total = regionData.reduce((s, r) => s + r.value, 0);
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div>
      <p className="mb-5 font-sans text-[13px] font-medium text-foreground">Clients by region</p>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 180 180" className="h-[160px] w-[160px] shrink-0 -rotate-90">
          <circle cx="90" cy="90" r={r} fill="none" stroke="currentColor" className="text-border" strokeWidth="16" />
          {regionData.map((seg) => {
            const len = (seg.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <circle
                key={seg.name}
                cx="90" cy="90" r={r} fill="none"
                stroke={seg.color}
                strokeWidth={hovered === seg.name ? 20 : 16}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHovered(seg.name)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onRegionClick(seg.name)}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="flex-1 space-y-2.5">
          {regionData.map((seg) => (
            <button
              key={seg.name}
              onClick={() => onRegionClick(seg.name)}
              onMouseEnter={() => setHovered(seg.name)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-lg transition-colors",
                hovered === seg.name ? "bg-muted" : "hover:bg-muted/50"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
                <span className="font-sans text-[12px] text-muted-foreground">{seg.name}</span>
              </div>
              <span className="font-mono text-[12px] text-foreground">{seg.value}%</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// DataPanel (Clickable rows)
// ===========================================================================
function DataPanel({
  title,
  columns,
  rows,
  onRowClick,
}: {
  title: string;
  columns: { key: string; label: string; statusKey?: boolean }[];
  rows: Record<string, string>[];
  onRowClick: (row: any) => void;
}) {
  const statusColor = (v: string) =>
    v === "paid" ? "#22C58B" : v === "unpaid" ? "#FF6B4A" : "#5B8CFF";

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-[13px] font-medium text-foreground">{title}</h3>
        <span className="font-mono text-[10px] text-muted-foreground">{rows.length} entries</span>
      </div>
      <div className="space-y-0">
        {rows.map((row, i) => (
          <button
            key={i}
            onClick={() => onRowClick(row)}
            className="w-full flex items-center gap-3 border-l-2 py-2.5 pl-3 hover:bg-muted/50 transition-colors rounded-r-lg text-left"
            style={{ borderColor: row.status ? statusColor(row.status) : "#E5E7EB" }}
          >
            {columns.map((col) => (
              <span
                key={col.key}
                className={cn(
                  "font-mono text-[12px]",
                  col.key === columns[0].key ? "text-foreground" : "text-muted-foreground",
                  col.statusKey && "ml-auto"
                )}
                style={col.statusKey ? { color: statusColor(row[col.key]) } : undefined}
              >
                {row[col.key]}
              </span>
            ))}
          </button>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Modals
// ===========================================================================
function SmsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("all");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Send SMS
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Broadcast a message to clients.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-semibold text-sm block">Recipients</label>
            <select
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
            >
              <option value="all">All Clients</option>
              <option value="active">Active Only</option>
              <option value="expiring">Expiring Soon</option>
              <option value="expired">Expired</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-sm block">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your message..."
              className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none"
            />
            <p className="text-xs text-muted-foreground text-right">{message.length} / 160</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-xl font-semibold h-12 border hover:bg-muted">
              Cancel
            </button>
            <button
              onClick={() => { alert(`SMS sent to "${recipients}" recipients:\n\n"${message}"`); onClose(); setMessage(""); }}
              className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Send SMS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RechargeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState(0);
  const [method, setMethod] = useState("bKash");
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              Quick Recharge
            </h3>
            <p className="text-xs text-muted-foreground mt-1">Recharge a client's balance instantly.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="font-semibold text-sm block">Client ID / Username</label>
            <input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. C-101 or rahim_101"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
            />
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-sm block">Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0"
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
            />
            <div className="flex flex-wrap gap-2">
              {[100, 500, 1000, 5000].map(a => (
                <button key={a} onClick={() => setAmount(a)} className="px-3 py-1 rounded-full text-xs border hover:border-signal">
                  ৳{a}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-semibold text-sm block">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30"
            >
              <option>bKash</option><option>Nagad</option><option>Rocket</option>
              <option>Cash</option><option>Bank</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-xl font-semibold h-12 border hover:bg-muted">
              Cancel
            </button>
            <button
              onClick={() => {
                if (!clientId || amount <= 0) { alert("Please fill all fields."); return; }
                alert(`Recharged ৳${amount} to ${clientId} via ${method}`);
                onClose(); setClientId(""); setAmount(0);
              }}
              className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent text-white flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" /> Recharge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Main Page
// ===========================================================================
export default function OverviewPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("clients");
  const [smsOpen, setSmsOpen] = useState(false);
  const [rechargeOpen, setRechargeOpen] = useState(false);

  const currentTab = tabData[activeTab] || tabData.clients;

  const handleRowClick = (row: any, type: string) => {
    alert(`${type} Details:\n\n${Object.entries(row).map(([k, v]) => `${k}: ${v}`).join("\n")}`);
  };

  const handleTickerClick = (item: TickerItem) => {
    const label = item.label.toLowerCase();
    if (label.includes("total clients") || label.includes("home clients")) router.push("/admin/clients/view-information");
    else if (label.includes("joins") || label.includes("left")) router.push("/admin/clients/view-information");
    else if (label.includes("extended")) router.push("/admin/clients/client-date-extend");
    else if (label.includes("profit") || label.includes("invoice")) router.push("/admin/reports/invoices");
    else if (label.includes("merchant")) router.push("/admin/reports/merchant-payments");
    else if (label.includes("sales") || label.includes("commission")) router.push("/admin/reports/month-wise-sales");
    else alert(`${item.label}: ${item.value}`);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 pb-16">
          {/* Header */}
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-[28px] font-semibold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Overview
              </h1>
              <p className="mt-1 font-sans text-[13px] text-muted-foreground">Your network, read like a signal.</p>
            </div>
            <div className="flex gap-2.5">
              <button
                onClick={() => setSmsOpen(true)}
                className="rounded-full border border-border bg-card px-5 py-2.5 font-sans text-[12px] font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-signal/40"
              >
                Send SMS
              </button>
              <button
                onClick={() => setRechargeOpen(true)}
                className="rounded-full bg-gradient-to-r from-signal to-violet-accent px-6 py-2.5 font-sans text-[12px] font-medium text-white transition-opacity hover:opacity-90 shadow-lg shadow-signal/30"
              >
                Recharge
              </button>
            </div>
          </div>

          {/* Pulse Strip */}
          <div className="mb-5">
            <PulseStrip onClick={() => router.push("/admin/server-watcher")} />
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "whitespace-nowrap px-4 py-2.5 font-sans text-[13px] transition-colors",
                  activeTab === t.id
                    ? "border-b-2 border-signal text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Hero + Ticker */}
          <div className="mb-5 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-4">
            <div className="rounded-2xl border border-border bg-card p-7">
              <HeroRadial
                value={currentTab.stat1}
                of={currentTab.stat1 + currentTab.stat2 + currentTab.stat3}
                label="online now"
                sub={`${currentTab.stat1} of ${currentTab.stat1 + currentTab.stat2 + currentTab.stat3} clients are actively connected to the network right now.`}
              />
              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5">
                <button onClick={() => alert(`${currentTab.label1}: ${currentTab.stat1}`)} className="text-left hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <p className="font-mono text-lg text-foreground">{currentTab.stat1}</p>
                  <p className="font-sans text-[11px] text-muted-foreground">{currentTab.label1}</p>
                </button>
                <button onClick={() => alert(`${currentTab.label2}: ${currentTab.stat2}`)} className="text-left hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <p className="font-mono text-lg text-foreground">{currentTab.stat2}</p>
                  <p className="font-sans text-[11px] text-muted-foreground">{currentTab.label2}</p>
                </button>
                <button onClick={() => alert(`${currentTab.label3}: ${currentTab.stat3}`)} className="text-left hover:bg-muted/50 p-2 rounded-lg transition-colors">
                  <p className="font-mono text-lg text-foreground">{currentTab.stat3}</p>
                  <p className="font-sans text-[11px] text-muted-foreground">{currentTab.label3}</p>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="mb-1 font-sans text-[13px] font-medium text-foreground">This month</p>
              <TickerRail
                items={[
                  { label: "Total clients", value: 921, icon: Users, delta: "+12%", deltaUp: true },
                  { label: "Home clients", value: 921, icon: Home, delta: "+3%", deltaUp: true },
                  { label: "New joins", value: 0, icon: UserPlus },
                  { label: "Left clients", value: 9, icon: UserMinus, delta: "-2%", deltaUp: false },
                  { label: "Extended", value: 30, icon: CalendarDays, delta: "+10%", deltaUp: true },
                  { label: "Last month profit", value: "৳61,640", icon: TrendingUp, delta: "+8%", deltaUp: true },
                  { label: "Personal invoice", value: "৳0", icon: FileText },
                  { label: "Merchants joined", value: 0, icon: Store },
                  { label: "Yesterday sales", value: "৳1,167", icon: ShoppingBag },
                  { label: "Commission", value: "৳0", icon: Coins },
                ]}
                onItemClick={handleTickerClick}
              />
            </div>
          </div>

          {/* Data panels */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-4 mb-6">
            <DataPanel
              title="Recent Invoices"
              columns={[
                { key: "invoice", label: "Invoice" },
                { key: "user", label: "Client" },
                { key: "date", label: "Date" },
                { key: "amount", label: "Amount" },
                { key: "status", label: "Status", statusKey: true },
              ]}
              rows={invoiceRows}
              onRowClick={(r) => handleRowClick(r, "Invoice")}
            />
            <DataPanel
              title="Upcoming Expiry"
              columns={[
                { key: "username", label: "Username" },
                { key: "bill", label: "Bill" },
                { key: "expiry", label: "Expiry" },
              ]}
              rows={expiryRows}
              onRowClick={(r) => handleRowClick(r, "Expiry")}
            />
            <DataPanel
              title="Expired Accounts"
              columns={[
                { key: "username", label: "Username" },
                { key: "bill", label: "Bill" },
                { key: "expired", label: "Expired" },
              ]}
              rows={expiredRows}
              onRowClick={(r) => handleRowClick(r, "Expired")}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.7fr_1fr] gap-4">
            <div className="bg-card rounded-2xl border border-border p-6">
              <SignalTrend />
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <RegionArcs onRegionClick={(name) => alert(`Viewing clients in ${name}`)} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SmsModal open={smsOpen} onClose={() => setSmsOpen(false)} />
      <RechargeModal open={rechargeOpen} onClose={() => setRechargeOpen(false)} />
    </div>
  );
}