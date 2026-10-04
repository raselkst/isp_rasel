"use client";

import { useEffect, useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DataPanel } from "@/components/dashboard/data-panel";
import {
  Users,
  Home,
  TrendingUp,
  FileText,
  UserPlus,
  UserMinus,
  ShoppingBag,
  Store,
  CalendarDays,
  Coins,
  LayoutGrid,
  Wallet,
  Ticket,
  MapPin,
  Wifi,
  Bell,
  Search,
  ChevronDown,
  Router,
  Network,
  Globe,
  Settings,
  Activity,
  Ban,
  Clock,
  Calendar,
  UsersRound,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  UserCheck,
} from "lucide-react";

// ===========================================================================
// Data (placeholder — wire up to your API)
// ===========================================================================
const tabs = [
  "Clients",
  "Monthly Data",
  "PPPoE",
  "PPTP",
  "SSTP",
  "OVPN",
  "WiFi Hotspot",
  "Voucher Card",
  "Zone",
  "Tickets",
];

const invoiceRows = [
  { invoice: "872193", user: "Taylor Michel", date: "Jun 23", amount: "$31.65", status: "paid" },
  { invoice: "872194", user: "Michel Taylor", date: "Jun 23", amount: "$31.65", status: "unpaid" },
  { invoice: "872195", user: "Rahim Uddin", date: "Jun 22", amount: "$31.65", status: "paid" },
  { invoice: "872196", user: "Sara Nasrin", date: "Jun 22", amount: "$31.65", status: "unpaid" },
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
// Custom Stat Card Component
// ===========================================================================
const NeoStatCard = ({
  label,
  value,
  icon: Icon,
  gradient,
  trend,
  trendValue,
  subtitle,
}: {
  label: string;
  value: string | number;
  icon: any;
  gradient: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700`} />
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      <div className="relative p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5 text-gray-300" />
              {label}
            </p>
            <p className="text-2xl font-bold text-gray-800 tracking-tight">
              {value}
            </p>
            {subtitle && (
              <p className="text-[10px] text-gray-400 font-medium">{subtitle}</p>
            )}
          </div>
          
          <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-${gradient.split(' ')[1]}/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>

        {trend && trendValue && (
          <div className="mt-2 flex items-center gap-2 pt-1.5 border-t border-gray-100/50">
            <div className={`flex items-center gap-1 text-[10px] font-semibold ${
              trend === 'up' ? 'text-emerald-600' : 
              trend === 'down' ? 'text-rose-600' : 
              'text-gray-400'
            }`}>
              {trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
              {trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
              {trendValue}
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <span className="text-[10px] text-gray-400">vs last month</span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent w-0 group-hover:w-full transition-all duration-700" />
      </div>

      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-3xl`} />
    </div>
  );
};

// ===========================================================================
// Stat Grid Component - All 6 columns
// ===========================================================================
const StatGrid = ({ title, stats, className = "", icon }: { title?: string; stats: any[]; className?: string; icon?: any }) => {
  const TitleIcon = icon;
  return (
    <div className={className}>
      {title && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full" />
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            {TitleIcon && <TitleIcon className="w-4 h-4" />}
            {title}
          </h3>
          <div className="flex-1 h-px bg-gray-200" />
        </div>
      )}
      <div className="grid grid-cols-6 gap-3">
        {stats.map((stat, index) => (
          <NeoStatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

// ===========================================================================
// Live pulse strip
// ===========================================================================
function PulseStrip() {
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
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-6">
        <div className="flex shrink-0 items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C58B] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C58B]" />
          </span>
          <div>
            <p className="font-mono text-[11px] text-gray-400">network status</p>
            <p className="font-mono text-sm font-medium text-gray-700">nominal, 320 sessions live</p>
          </div>
        </div>

        <div className="flex h-9 flex-1 items-end gap-[3px]">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-full bg-gradient-to-t from-[#22C58B]/80 to-[#5B8CFF]/60 transition-all duration-[1400ms] ease-in-out"
              style={{ height: `${h * 100}%` }}
            />
          ))}
        </div>

        <div className="shrink-0 text-right">
          <p className="font-mono text-[11px] text-gray-400">balance</p>
          <p className="font-mono text-sm font-medium text-gray-700">৳48,200</p>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Hero radial
// ===========================================================================
function HeroRadial({ value, of, label, sub }: { value: number; of: number; label: string; sub: string }) {
  const pct = value / of;
  const r = 84;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-8">
      <div className="relative h-[200px] w-[200px] shrink-0">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <circle cx="100" cy="100" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="url(#pulseGrad)"
            strokeWidth="10"
            strokeLinecap="round"
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
          <span className="font-mono text-4xl font-semibold text-gray-800">{value}</span>
          <span className="font-mono text-[11px] text-gray-400">of {of}</span>
        </div>
      </div>
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wide text-[#22C58B]">{label}</p>
        <p className="mt-1 max-w-[220px] font-sans text-sm leading-relaxed text-gray-500">{sub}</p>
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
};

function TickerRail({ items }: { items: TickerItem[] }) {
  return (
    <div className="divide-y divide-gray-100">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2.5">
              <Icon className="h-3.5 w-3.5 text-[#5B8CFF]" strokeWidth={1.75} />
              <span className="font-sans text-[13px] text-gray-500">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] text-gray-700">{item.value}</span>
              {item.delta && (
                <span className={`font-mono text-[10px] ${item.deltaUp ? "text-[#22C58B]" : "text-[#FF6B4A]"}`}>
                  {item.delta}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===========================================================================
// Signal log
// ===========================================================================
function SignalLog({
  title,
  rows,
  columns,
}: {
  title: string;
  rows: Record<string, string>[];
  columns: { key: string; label: string; statusKey?: boolean }[];
}) {
  const statusColor = (v: string) => (v === "paid" ? "#22C58B" : v === "unpaid" ? "#FF6B4A" : "#5B8CFF");

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-sans text-[13px] font-medium text-gray-800">{title}</h3>
        <span className="font-mono text-[10px] text-gray-400">{rows.length} entries</span>
      </div>
      <div className="space-y-0">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-center gap-3 border-l-2 py-2.5 pl-3"
            style={{ borderColor: row.status ? statusColor(row.status) : "#E5E7EB" }}
          >
            {columns.map((col) => (
              <span
                key={col.key}
                className={`font-mono text-[12px] ${
                  col.key === columns[0].key ? "text-gray-700" : "text-gray-500"
                } ${col.statusKey ? "ml-auto" : ""}`}
                style={col.statusKey ? { color: statusColor(row[col.key]) } : undefined}
              >
                {row[col.key]}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===========================================================================
// Sales line chart
// ===========================================================================
function SignalTrend() {
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
          <p className="font-sans text-[13px] font-medium text-gray-800">Revenue trend</p>
          <p className="font-mono text-[11px] text-gray-400">last 12 months</p>
        </div>
        <p className="font-mono text-lg text-[#22C58B]">+42.6%</p>
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
          <circle key={i} cx={p.x} cy={p.y} r={i === points.length - 1 ? 4 : 0} fill="#1F2937" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between">
        {salesLabels.map((l) => (
          <span key={l} className="font-mono text-[10px] text-gray-400">
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
function RegionArcs() {
  const total = regionData.reduce((s, r) => s + r.value, 0);
  const r = 70;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div>
      <p className="mb-5 font-sans text-[13px] font-medium text-gray-800">Clients by region</p>
      <div className="flex items-center gap-6">
        <svg viewBox="0 0 180 180" className="h-[160px] w-[160px] shrink-0 -rotate-90">
          <circle cx="90" cy="90" r={r} fill="none" stroke="#E5E7EB" strokeWidth="16" />
          {regionData.map((seg) => {
            const len = (seg.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <circle
                key={seg.name}
                cx="90"
                cy="90"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="flex-1 space-y-2.5">
          {regionData.map((seg) => (
            <div key={seg.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
                <span className="font-sans text-[12px] text-gray-500">{seg.name}</span>
              </div>
              <span className="font-mono text-[12px] text-gray-700">{seg.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Main Page
// ===========================================================================
export default function OverviewPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="min-w-0 flex-1">
        <DashboardTopbar />

        <div className="px-8 py-7 pb-16">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h1 className="font-sans text-[28px] font-semibold tracking-tight text-gray-800">Overview</h1>
              <p className="mt-1 font-sans text-[13px] text-gray-400">Your network, read like a signal.</p>
            </div>
            <div className="flex gap-2.5">
              <button className="rounded-full border border-gray-200 bg-white px-5 py-2.5 font-sans text-[12px] font-medium text-gray-500 transition-colors hover:text-gray-700 hover:border-gray-300">
                Send SMS
              </button>
              <button className="rounded-full bg-gradient-to-r from-[#22C58B] to-[#5B8CFF] px-6 py-2.5 font-sans text-[12px] font-medium text-white transition-opacity hover:opacity-90">
                Recharge
              </button>
            </div>
          </div>

          <div className="mb-5">
            <PulseStrip />
          </div>

          <div className="mb-6 flex gap-1 overflow-x-auto border-b border-gray-200">
            {tabs.map((t, i) => (
              <button
                key={t}
                className={`whitespace-nowrap px-4 py-2.5 font-sans text-[13px] transition-colors ${
                  i === 0 ? "border-b-2 border-[#22C58B] text-gray-800" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Stats Grids */}
          <StatGrid
            stats={[
              { label: "Total Clients", value: "320", icon: Users, gradient: "from-blue-500 to-indigo-500", subtitle: "268 currently active", trend: 'up', trendValue: '+12%' },
              { label: "Active Clients", value: "320", icon: Activity, gradient: "from-emerald-500 to-teal-500", subtitle: "+5% this week", trend: 'up', trendValue: '+5%' },
              { label: "Suspended", value: "200", icon: Ban, gradient: "from-amber-500 to-orange-500", subtitle: "−5% clients left", trend: 'down', trendValue: '-5%' },
              { label: "Online Now", value: "320", icon: Wifi, gradient: "from-cyan-500 to-blue-500", subtitle: "+10% vs last month", trend: 'up', trendValue: '+10%' },
              { label: "Offline", value: "320", icon: UsersRound, gradient: "from-slate-500 to-gray-500", subtitle: "20% offline this cycle", trend: 'down', trendValue: '-20%' },
            ]}
            className="mb-4"
          />

          <StatGrid
            stats={[
              { label: "Pending Clients", value: "320", icon: Clock, gradient: "from-violet-500 to-purple-500", trend: 'up', trendValue: '+5%' },
              { label: "Due Client", value: "200", icon: Calendar, gradient: "from-orange-500 to-red-500", trend: 'down', trendValue: '-5%' },
              { label: "Extended", value: "320", icon: CalendarDays, gradient: "from-teal-500 to-cyan-500", trend: 'up', trendValue: '+10%' },
              { label: "Expired", value: "320", icon: UserMinus, gradient: "from-amber-500 to-yellow-500", trend: 'down', trendValue: '-20%' },
              { label: "Left Clients", value: "320", icon: UserMinus, gradient: "from-rose-500 to-pink-500", trend: 'down', trendValue: '-20%' },
            ]}
            className="mb-4"
          />

          <StatGrid
            title="📊 Client Overview"
            icon={Users}
            stats={[
              { label: "Total Client", value: "921", icon: Users, gradient: "from-blue-400 to-indigo-500" },
              { label: "Home Client", value: "921", icon: Home, gradient: "from-green-400 to-emerald-500" },
              { label: "Pending Client", value: "3", icon: Clock, gradient: "from-yellow-400 to-amber-500" },
              { label: "Suspend Client", value: "257", icon: Ban, gradient: "from-red-400 to-rose-500" },
              { label: "Last Month Profit", value: "61,640.46", icon: TrendingUp, gradient: "from-purple-400 to-violet-500" },
              { label: "Personal Invoice", value: "0", icon: FileText, gradient: "from-gray-400 to-slate-500" },
            ]}
            className="mb-4"
          />

          <StatGrid
            title="📈 Monthly Performance"
            icon={TrendingUp}
            stats={[
              { label: "This Month Join", value: "0", icon: UserPlus, gradient: "from-teal-400 to-cyan-500" },
              { label: "Total Active Now", value: "245", icon: Activity, gradient: "from-emerald-400 to-green-500" },
              { label: "Left Client", value: "9", icon: UserMinus, gradient: "from-rose-400 to-red-500" },
              { label: "Today Home Sales", value: "0", icon: ShoppingBag, gradient: "from-amber-400 to-orange-500" },
              { label: "Merchant In This Month", value: "0", icon: Store, gradient: "from-indigo-400 to-blue-500" },
              { label: "Personal Invoice Amount", value: "0", icon: DollarSign, gradient: "from-slate-400 to-gray-500" },
            ]}
            className="mb-4"
          />

          <StatGrid
            title="📉 Historical Data"
            icon={Calendar}
            stats={[
              { label: "Last Month Join", value: "4", icon: Calendar, gradient: "from-cyan-400 to-blue-500" },
              { label: "Home Active Now", value: "245", icon: Home, gradient: "from-lime-400 to-green-500" },
              { label: "Extended Client", value: "30", icon: CalendarDays, gradient: "from-orange-400 to-amber-500" },
              { label: "Yesterday Home Sales", value: "1,167", icon: ShoppingBag, gradient: "from-fuchsia-400 to-pink-500" },
              { label: "Online In This Month", value: "0", icon: Wifi, gradient: "from-pink-400 to-rose-500" },
              { label: "Personal Commission", value: "0", icon: Coins, gradient: "from-stone-400 to-neutral-500" },
            ]}
            className="mb-6"
          />

          {/* Data panels */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-4 mb-6">
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl">
              <DataPanel
                title="Recent Invoices"
                columns={[
                  { key: "invoice", label: "Invoice" },
                  { key: "user", label: "Client" },
                  { key: "date", label: "Date" },
                  { key: "amount", label: "Amount" },
                  { key: "status", label: "Status" },
                ]}
                rows={invoiceRows}
              />
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl">
              <DataPanel
                title="Upcoming Expiry"
                columns={[
                  { key: "username", label: "Username" },
                  { key: "bill", label: "Bill" },
                  { key: "expiry", label: "Expiry" },
                ]}
                rows={expiryRows}
              />
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl">
              <DataPanel
                title="Expired Accounts"
                columns={[
                  { key: "username", label: "Username" },
                  { key: "bill", label: "Bill" },
                  { key: "expired", label: "Expired" },
                ]}
                rows={expiredRows}
              />
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-[1.7fr_1fr] gap-4">
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 p-6 transition-all duration-500 shadow-sm hover:shadow-xl">
              <SignalTrend />
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 p-6 transition-all duration-500 shadow-sm hover:shadow-xl">
              <RegionArcs />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}