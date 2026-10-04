"use client";

import { useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const values = [42, 48, 45, 55, 60, 58, 66, 72, 70, 78, 84, 92];

const W = 1000;
const H = 300;
const PAD = 30;

function toXY(i: number, v: number) {
  const x = PAD + (i / (values.length - 1)) * (W - PAD * 2);
  const y = H - PAD - (v / 100) * (H - PAD * 2);
  return [x, y];
}

export function RevenueChart() {
  const [active, setActive] = useState(values.length - 1);

  const linePath = values
    .map((v, i) => {
      const [x, y] = toXY(i, v);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const [firstX] = toXY(0, 0);
  const [lastX] = toXY(values.length - 1, 0);
  const areaPath = `${linePath} L${lastX},${H - PAD} L${firstX},${H - PAD} Z`;
  const [ax, ay] = toXY(active, values[active]);

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[240px]">
          <defs>
            <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3].map((row) => (
            <line
              key={row}
              x1={PAD}
              x2={W - PAD}
              y1={PAD + (row * (H - PAD * 2)) / 3}
              y2={PAD + (row * (H - PAD * 2)) / 3}
              stroke="white"
              strokeOpacity="0.06"
            />
          ))}

          <path d={areaPath} fill="url(#revFill)" />
          <path d={linePath} fill="none" stroke="var(--signal)" strokeWidth="3" strokeLinecap="round" />

          {values.map((v, i) => {
            const [x, y] = toXY(i, v);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={i === active ? 6 : 3.5}
                fill={i === active ? "var(--violet-accent)" : "var(--signal)"}
                className="cursor-pointer"
                onMouseEnter={() => setActive(i)}
              />
            );
          })}

          <line x1={ax} x2={ax} y1={ay} y2={H - PAD} stroke="var(--violet-accent)" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        <div
          className="absolute bg-[#151a29] border border-white/10 rounded-xl px-3 py-2 text-xs shadow-xl pointer-events-none"
          style={{ left: `${(ax / W) * 100}%`, top: `${(ay / H) * 100}%`, transform: "translate(-50%, -130%)" }}
        >
          <p className="text-white/50">{months[active]} 2026</p>
          <p className="font-bold">৳{values[active]}.{active}L</p>
        </div>
      </div>

      <div className="flex justify-between text-xs text-white/35 mt-2 px-1">
        {months.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}