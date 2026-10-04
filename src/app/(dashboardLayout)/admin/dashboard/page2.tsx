"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DataPanel } from "@/components/dashboard/data-panel";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { RegionDonut } from "@/components/dashboard/region-donut";
import { 
  Users, 
  Home, 
  Clock, 
  Ban, 
  TrendingUp, 
  FileText,
  UserPlus,
  Activity,
  UserMinus,
  ShoppingBag,
  Store,
  DollarSign,
  Calendar,
  UsersRound,
  CalendarDays,
  TrendingDown,
  Wifi,
  Coins,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

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

// Custom Stat Card Component with Unique Light Design
const NeoStatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  gradient, 
  trend, 
  trendValue,
  subtitle,
  color
}: { 
  label: string;
  value: string | number;
  icon: any;
  gradient: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  subtitle?: string;
  color?: string;
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border-2 border-gray-100 hover:border-gray-200 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-gray-200/50">
      {/* Animated Gradient Background on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.08] transition-opacity duration-700`} />
      
      {/* Subtle Shine Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/30 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Content */}
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
          
          {/* Icon with Soft Gradient */}
          <div className={`p-2 rounded-xl bg-gradient-to-br ${gradient} shadow-lg shadow-${gradient.split(' ')[1]}/10 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Trend Indicator */}
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

        {/* Animated Bottom Border */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent w-0 group-hover:w-full transition-all duration-700" />
      </div>

      {/* Corner Accent */}
      <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-bl-3xl`} />
    </div>
  );
};

// Unique Card Grid Component - All 6 columns
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

export default function OverviewPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-8 py-7 pb-16">
          {/* Page head with Modern Design */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-[11.5px] tracking-[0.14em] uppercase text-emerald-600 font-bold mb-1.5 flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                Network Online — 320 active sessions
              </div>
              <h1 className="font-heading text-[32px] font-bold tracking-tight text-gray-800">
                Overview
              </h1>
            </div>
            <div className="flex gap-3">
              <button className="group relative overflow-hidden rounded-full px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="relative text-xs font-bold text-gray-700 flex items-center gap-2">
                  <span className="text-amber-500">💳</span> Balance ৳48,200
                </span>
              </button>
              <button className="group relative overflow-hidden rounded-full px-5 py-2.5 bg-white border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md">
                <span className="relative text-xs font-bold text-gray-700 flex items-center gap-2">
                  ✉ SMS
                </span>
              </button>
              <button className="group relative overflow-hidden rounded-full px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/35">
                <span className="relative text-xs font-bold text-white flex items-center gap-2">
                  ⚡ Recharge
                </span>
              </button>
            </div>
          </div>

          {/* Tabs - Clean Style */}
          <div className="my-6">
            <div className="flex border-b-2 border-gray-200/60 w-full justify-start overflow-x-auto gap-1">
              {tabs.map((t) => (
                <button
                  key={t}
                  className="relative px-4 py-2.5 text-[13px] font-semibold text-gray-400 hover:text-gray-700 transition-all duration-300 whitespace-nowrap group"
                >
                  {t}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:w-full transition-all duration-500" />
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grids - All 6 columns */}
          
          {/* Row 1: Main Stats */}
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

          {/* Row 2: More Stats */}
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

          {/* Row 3: From Your Image - Left Section */}
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

          {/* Row 4: From Your Image - Middle Section */}
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

          {/* Row 5: From Your Image - Right Section */}
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

          {/* Data panels with Clean Design */}
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

          {/* Charts with Clean Design */}
          <div className="grid grid-cols-[1.7fr_1fr] gap-4">
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 p-6 transition-all duration-500 shadow-sm hover:shadow-xl">
              <SalesChart />
            </div>
            <div className="bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 p-6 transition-all duration-500 shadow-sm hover:shadow-xl">
              <RegionDonut />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}