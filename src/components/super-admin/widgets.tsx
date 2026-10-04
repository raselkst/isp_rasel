"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function GlassCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "rounded-[28px] bg-white/[0.03] border border-white/10 backdrop-blur-xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
        className
      )}
    >
      {children}
    </div>
  );
}

function Sparkline({ points, color }: { points: number[]; color: string }) {
  const w = 160;
  const h = 44;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((p - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-11">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  delta: number;
  points: number[];
  accent: string;
}

export function MetricCard({ label, value, delta, points, accent }: MetricCardProps) {
  const up = delta >= 0;
  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold tracking-wide uppercase text-white/40">{label}</p>
        <span
          className={cn(
            "flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full",
            up ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
          )}
        >
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(delta)}%
        </span>
      </div>
      <p className="font-heading text-3xl font-bold text-white">{value}</p>
      <Sparkline points={points} color={accent} />
    </GlassCard>
  );
}

export function RadialGauge({ percent, label, sub }: { percent: number; label: string; sub: string }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <svg viewBox="0 0 140 140" className="w-40 h-40 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--signal)" />
            <stop offset="100%" stopColor="var(--violet-accent)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="-mt-[104px] text-center">
        <p className="font-heading text-3xl font-bold text-white">{percent}%</p>
      </div>
      <div className="mt-4 text-center">
        <p className="font-semibold text-white text-sm">{label}</p>
        <p className="text-xs text-white/40">{sub}</p>
      </div>
    </div>
  );
}

const regions = [
  { x: 20, y: 30, r: 7, status: "up" },
  { x: 55, y: 15, r: 9, status: "up" },
  { x: 90, y: 35, r: 6, status: "warn" },
  { x: 130, y: 20, r: 8, status: "up" },
  { x: 160, y: 45, r: 5, status: "up" },
  { x: 40, y: 60, r: 6, status: "up" },
  { x: 75, y: 70, r: 10, status: "down" },
  { x: 115, y: 65, r: 7, status: "up" },
  { x: 150, y: 75, r: 6, status: "up" },
  { x: 25, y: 90, r: 5, status: "up" },
  { x: 65, y: 95, r: 8, status: "warn" },
  { x: 105, y: 92, r: 6, status: "up" },
  { x: 140, y: 100, r: 7, status: "up" },
];

const statusColor: Record<string, string> = {
  up: "var(--success)",
  warn: "var(--caution)",
  down: "var(--destructive)",
};

export function NetworkMap() {
  return (
    <svg viewBox="0 0 180 120" className="w-full h-40">
      {regions.map((r, i) => (
        <g key={i}>
          <circle cx={r.x} cy={r.y} r={r.r + 5} fill={statusColor[r.status]} opacity="0.12" />
          <circle cx={r.x} cy={r.y} r={r.r} fill={statusColor[r.status]} opacity="0.85" />
        </g>
      ))}
      {regions.slice(1).map((r, i) => (
        <line
          key={i}
          x1={regions[i].x}
          y1={regions[i].y}
          x2={r.x}
          y2={r.y}
          stroke="white"
          strokeOpacity="0.08"
          strokeWidth="1"
        />
      ))}
    </svg>
  );
}

interface LeaderRow {
  name: string;
  region: string;
  revenue: string;
  growth: number;
}

export function Leaderboard({ rows }: { rows: LeaderRow[] }) {
  return (
    <div className="space-y-1">
      {rows.map((r, i) => (
        <div
          key={r.name}
          className="flex items-center gap-4 px-3 py-3 rounded-2xl hover:bg-white/5 transition-colors"
        >
          <span
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
              i === 0
                ? "bg-gradient-to-br from-signal to-violet-accent text-white"
                : "bg-white/10 text-white/60"
            )}
          >
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{r.name}</p>
            <p className="text-xs text-white/40">{r.region}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-bold text-white">{r.revenue}</p>
            <p className="text-xs text-success">+{r.growth}%</p>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ActivityItem {
  time: string;
  text: string;
  tone: "signal" | "success" | "caution" | "destructive" | "violet";
}

const toneDot: Record<ActivityItem["tone"], string> = {
  signal: "bg-signal",
  success: "bg-success",
  caution: "bg-caution",
  destructive: "bg-destructive",
  violet: "bg-violet-accent",
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-white/10" />
      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="relative">
            <span
              className={cn(
                "absolute -left-5 top-1 w-3 h-3 rounded-full ring-4 ring-[#0a0d16]",
                toneDot[item.tone]
              )}
            />
            <p className="text-sm text-white/85 leading-snug">{item.text}</p>
            <p className="text-xs text-white/35 mt-0.5">{item.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}