"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import {
  Download, Activity, TrendingUp, TrendingDown, Wifi, Zap,
  RefreshCw, Play, Pause, ArrowUpCircle, ArrowDownCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// সার্ভার ও ইউজার ডেটা
const servers = [
  { id: "s1", name: "SERVER-2" },
  { id: "s2", name: "SERVER-3" },
  { id: "s3", name: "SERVER-4" },
];

const users = [
  { id: "u1", name: "jihad1019" },
  { id: "u2", name: "mogul_ali" },
  { id: "u3", name: "rahim_uddin" },
  { id: "u4", name: "karim_hossain" },
];

const timeRanges = [
  { id: "1h", label: "1 Hour" },
  { id: "6h", label: "6 Hours" },
  { id: "24h", label: "24 Hours" },
  { id: "7d", label: "7 Days" },
  { id: "30d", label: "30 Days" },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October"];

// সার্ভার/ইউজার অনুযায়ী ডেটা জেনারেট করা (মক)
function generateData(serverId: string, userId: string, range: string) {
  const base = serverId.charCodeAt(1) + userId.charCodeAt(1) + range.length;
  const seed = base % 5;
  return [40, 90, 180, 300, 220, 190, 260, 340, 320, 380].map(
    (v, i) => v + seed * 15 + (i * seed * 3) % 40
  );
}

const W = 1600;
const H = 380;
const PAD = 40;

function toXY(i: number, v: number, points: number[], maxV: number) {
  const x = PAD + (i / (points.length - 1)) * (W - PAD * 2);
  const y = H - PAD - (v / maxV) * (H - PAD * 2);
  return [x, y];
}

export default function UserTrafficPage() {
  const [activeServer, setActiveServer] = useState("s1");
  const [activeUser, setActiveUser] = useState("u1");
  const [timeRange, setTimeRange] = useState("24h");
  const [isLive, setIsLive] = useState(false);
  const [activeIndex, setActiveIndex] = useState(3);
  const [dataPoints, setDataPoints] = useState<number[]>([]);

  // ডেটা জেনারেশন
  useEffect(() => {
    setDataPoints(generateData(activeServer, activeUser, timeRange));
    setActiveIndex(3);
  }, [activeServer, activeUser, timeRange]);

  // লাইভ মোড - প্রতি ২ সেকেন্ডে ডেটা আপডেট
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setDataPoints((prev) =>
        prev.map((v) => Math.max(20, v + (Math.random() * 60 - 30)))
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  // ক্যালকুলেশন
  const maxV = useMemo(() => Math.max(...dataPoints, 400), [dataPoints]);
  
  const calculations = useMemo(() => {
    if (dataPoints.length === 0) return { tx: 0, rx: 0, total: 0, peak: 0, avg: 0 };
    const total = dataPoints.reduce((a, b) => a + b, 0);
    const peak = Math.max(...dataPoints);
    const avg = total / dataPoints.length;
    const tx = (total * 0.13).toFixed(2);
    const rx = (total * 0.87).toFixed(2);
    return {
      tx: parseFloat(tx),
      rx: parseFloat(rx),
      total: parseFloat((total / 100).toFixed(2)),
      peak: parseFloat((peak / 100).toFixed(2)),
      avg: parseFloat((avg / 100).toFixed(2)),
    };
  }, [dataPoints]);

  // Path জেনারেশন
  const { linePath, areaPath } = useMemo(() => {
    if (dataPoints.length === 0) return { linePath: "", areaPath: "" };
    const line = dataPoints
      .map((v, i) => {
        const [x, y] = toXY(i, v, dataPoints, maxV);
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");
    const [lastX] = toXY(dataPoints.length - 1, 0, dataPoints, maxV);
    const [firstX] = toXY(0, 0, dataPoints, maxV);
    const area = `${line} L${lastX},${H - PAD} L${firstX},${H - PAD} Z`;
    return { linePath: line, areaPath: area };
  }, [dataPoints, maxV]);

  const [ax, ay] = dataPoints.length > 0
    ? toXY(activeIndex, dataPoints[activeIndex], dataPoints, maxV)
    : [0, 0];

  // Export CSV
  const handleExport = () => {
    const headers = "Month,Traffic (Mbps)";
    const rows = months
      .map((m, i) => `"${m}",${dataPoints[i]?.toFixed(2) || 0}`)
      .join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `traffic-${activeUser}-${timeRange}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRefresh = () => {
    setDataPoints(generateData(activeServer, activeUser, timeRange));
    setActiveIndex(3);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
            User Traffic Analytics
          </h1>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <ArrowUpCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Upload (TX)</p>
              </div>
              <p className="font-heading text-2xl font-bold text-emerald-600">
                {calculations.tx} <span className="text-sm">Mbps</span>
              </p>
            </div>
            <div className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <ArrowDownCircle className="w-4 h-4 text-blue-600" />
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Download (RX)</p>
              </div>
              <p className="font-heading text-2xl font-bold text-blue-600">
                {calculations.rx} <span className="text-sm">Mbps</span>
              </p>
            </div>
            <div className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-violet-600" />
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Peak Usage</p>
              </div>
              <p className="font-heading text-2xl font-bold text-violet-600">
                {calculations.peak} <span className="text-sm">Mbps</span>
              </p>
            </div>
            <div className="bg-card rounded-2xl border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs text-muted-foreground font-semibold uppercase">Avg Speed</p>
              </div>
              <p className="font-heading text-2xl font-bold text-amber-600">
                {calculations.avg} <span className="text-sm">Mbps</span>
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border p-6 sm:p-8 shadow-sm">
            {/* Header Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="font-heading text-xl font-bold">Traffic Overview</h2>
              <div className="flex flex-wrap items-center gap-3">
                
                {/* Server Select */}
                <select
                  value={activeServer}
                  onChange={(e) => setActiveServer(e.target.value)}
                  className="border rounded-xl px-4 py-2.5 bg-background text-sm font-semibold focus:ring-2 focus:ring-signal outline-none"
                >
                  {servers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                {/* User Select */}
                <select
                  value={activeUser}
                  onChange={(e) => setActiveUser(e.target.value)}
                  className="border rounded-xl px-4 py-2.5 bg-background text-sm font-semibold focus:ring-2 focus:ring-signal outline-none"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>

                {/* Refresh Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  className="rounded-xl h-10 w-10"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>

                {/* Live Toggle */}
                <Button
                  variant={isLive ? "default" : "outline"}
                  onClick={() => setIsLive(!isLive)}
                  className={cn(
                    "rounded-xl gap-2 font-semibold",
                    isLive && "bg-emerald-600 hover:bg-emerald-500 text-white"
                  )}
                >
                  {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isLive ? "Live" : "Go Live"}
                </Button>

                {/* Export Button */}
                <Button
                  variant="outline"
                  onClick={handleExport}
                  className="rounded-xl gap-2 font-semibold text-signal border-signal/30"
                >
                  <Download className="w-4 h-4" /> Export
                </Button>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {timeRanges.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setTimeRange(r.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all",
                    timeRange === r.id
                      ? "bg-signal text-white border-signal shadow-md"
                      : "bg-background text-muted-foreground border-border hover:border-signal/50"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mb-4 text-sm font-semibold">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-destructive" /> TX {calculations.tx} Mbps
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-signal" /> RX {calculations.rx} Mbps
              </span>
              <span className="flex items-center gap-2 ml-auto text-xs text-muted-foreground">
                <Wifi className="w-3.5 h-3.5" /> {servers.find((s) => s.id === activeServer)?.name} · {users.find((u) => u.id === activeUser)?.name}
              </span>
            </div>

            {/* Chart */}
            <div className="relative">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[340px]">
                <defs>
                  <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--violet-accent)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="var(--signal)" stopOpacity="0.03" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                {[0, 1, 2, 3, 4].map((row) => (
                  <line
                    key={row}
                    x1={PAD}
                    x2={W - PAD}
                    y1={PAD + (row * (H - PAD * 2)) / 4}
                    y2={PAD + (row * (H - PAD * 2)) / 4}
                    stroke="currentColor"
                    className="text-border"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-Axis Labels */}
                {[0, 1, 2, 3, 4].map((row) => {
                  const value = Math.round((maxV * (4 - row)) / 4);
                  return (
                    <text
                      key={row}
                      x={PAD - 10}
                      y={PAD + (row * (H - PAD * 2)) / 4 + 4}
                      textAnchor="end"
                      className="fill-muted-foreground"
                      fontSize="12"
                    >
                      {value}
                    </text>
                  );
                })}

                {/* Area Fill */}
                <path d={areaPath} fill="url(#trafficFill)" />

                {/* Line Path */}
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--violet-accent)"
                  strokeWidth="3"
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                {dataPoints.map((v, i) => {
                  const [x, y] = toXY(i, v, dataPoints, maxV);
                  const isActive = i === activeIndex;
                  return (
                    <g key={i}>
                      {isActive && (
                        <circle cx={x} cy={y} r={14} fill="var(--violet-accent)" opacity="0.2" />
                      )}
                      <circle
                        cx={x}
                        cy={y}
                        r={isActive ? 8 : 5}
                        fill="var(--card)"
                        stroke="var(--violet-accent)"
                        strokeWidth="3"
                        className="cursor-pointer transition-all"
                        onMouseEnter={() => setActiveIndex(i)}
                      />
                    </g>
                  );
                })}

                {/* Active Line */}
                <line
                  x1={ax}
                  x2={ax}
                  y1={ay}
                  y2={H - PAD}
                  stroke="var(--violet-accent)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>

              {/* Tooltip */}
              <div
                className="absolute bg-card border rounded-xl shadow-lg px-4 py-3 text-sm pointer-events-none transition-all duration-200"
                style={{
                  left: `${(ax / W) * 100}%`,
                  top: `${(ay / H) * 100}%`,
                  transform: "translate(12px, -50%)",
                }}
              >
                <p className="font-semibold text-foreground">
                  {months[activeIndex]} <span className="text-signal">2025</span>
                </p>
                <p className="font-semibold text-xs mt-1">
                  Traffic: <span className="text-destructive">{dataPoints[activeIndex]?.toFixed(2)} Mbps</span>
                </p>
              </div>
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between text-xs text-muted-foreground mt-3 px-6">
              {months.map((m) => (
                <span key={m} className="truncate">{m.slice(0, 3)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}