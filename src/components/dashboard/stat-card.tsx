"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { SignalBars } from "./signal-bars";

interface StatCardProps {
  label: string;
  value: string | number;
  footnote?: string;
  footnoteClass?: string;
  accentClass?: string; // border-l color, e.g. "border-l-signal"
  hero?: boolean;
  showSignal?: boolean;
  signalLevels?: number[];
  signalActive?: number;
  signalColorClass?: string;
}

export function StatCard({
  label,
  value,
  footnote,
  footnoteClass,
  accentClass = "border-l-signal",
  hero = false,
  showSignal = false,
  signalLevels = [30, 55, 80, 45, 35],
  signalActive = 3,
  signalColorClass = "bg-signal",
}: StatCardProps) {
  if (hero) {
    return (
      <Card className="relative overflow-hidden bg-foreground text-background border-none p-5 rounded-2xl">
        {/* animated packet-pulse line, subtle signature motif */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
          <div className="pulse-dash absolute top-4 right-[-40px] w-[120px] h-px" />
        </div>
        <div className="text-xs font-semibold text-background/60 mb-2.5">
          {label}
        </div>
        <div className="font-heading text-3xl font-bold tracking-tight">
          {value}
        </div>
        {footnote && (
          <div className="text-[11.5px] text-background/70 mt-2">
            {footnote}
          </div>
        )}
        <style jsx>{`
          .pulse-dash {
            background: repeating-linear-gradient(
              90deg,
              var(--signal) 0 6px,
              transparent 6px 12px
            );
            animation: pulse-move 3.2s linear infinite;
          }
          @keyframes pulse-move {
            to {
              transform: translateX(-160px);
            }
          }
        `}</style>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "relative border-l-[3px] p-4.5 rounded-2xl",
        accentClass
      )}
    >
      <div className="text-xs font-semibold text-muted-foreground mb-2.5">
        {label}
      </div>
      <div className="font-heading text-3xl font-bold tracking-tight">
        {value}
      </div>
      {footnote && (
        <div className={cn("text-[11.5px] mt-2", footnoteClass ?? "text-muted-foreground")}>
          {footnote}
        </div>
      )}
      {showSignal && (
        <SignalBars
          levels={signalLevels}
          activeCount={signalActive}
          colorClass={signalColorClass}
          className="absolute right-4 bottom-4"
        />
      )}
    </Card>
  );
}