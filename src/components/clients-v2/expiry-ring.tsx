"use client";

export function ExpiryRing({ daysLeft, totalDays = 30 }: { daysLeft: number; totalDays?: number }) {
  const pct = Math.max(0, Math.min(1, daysLeft / totalDays));
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - pct * c;
  const urgent = daysLeft <= 3;

  return (
    <div className="relative w-[76px] h-[76px] shrink-0">
      <svg viewBox="0 0 76 76" className="w-full h-full -rotate-90">
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="7" />
        <circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke={urgent ? "var(--caution)" : "white"}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-heading font-bold text-white leading-none">{daysLeft}</span>
        <span className="text-[9px] text-white/70 uppercase tracking-wide">days</span>
      </div>
    </div>
  );
}