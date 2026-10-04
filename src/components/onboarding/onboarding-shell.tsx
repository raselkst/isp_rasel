"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface OnboardingShellProps {
  icon: LucideIcon;
  backHref?: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps?: number;
}

const dots = [
  { top: "6%", left: "23%", color: "bg-violet-accent", size: "w-2 h-2" },
  { top: "8%", right: "8%", color: "bg-foreground", size: "w-1.5 h-1.5" },
  { top: "24%", left: "2%", color: "bg-caution", size: "w-2 h-2" },
  { top: "28%", left: "44%", color: "bg-warning", size: "w-1.5 h-1.5" },
  { top: "19%", right: "26%", color: "bg-violet-accent", size: "w-1.5 h-1.5" },
  { top: "42%", right: "3%", color: "bg-success", size: "w-2 h-2" },
  { bottom: "22%", right: "8%", color: "bg-warning", size: "w-1.5 h-1.5" },
  { bottom: "8%", left: "12%", color: "bg-caution", size: "w-2 h-2" },
];

export function OnboardingShell({
  icon: Icon,
  backHref,
  title,
  subtitle,
  children,
  currentStep,
  totalSteps = 6,
}: OnboardingShellProps) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Illustration panel */}
      <div className="hidden lg:flex items-center justify-center bg-signal-tint relative overflow-hidden p-12">
        <div className="absolute top-8 left-8 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-[9px] bg-signal" />
          <span className="font-heading font-bold text-sm">LOGO</span>
        </div>

        <div className="w-56 h-56 rounded-[2.5rem] bg-card border-2 border-signal/20 flex items-center justify-center shadow-sm">
          <Icon className="w-24 h-24 text-signal" strokeWidth={1.3} />
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={
                i + 1 === currentStep
                  ? "h-2 w-6 rounded-full bg-signal transition-all"
                  : i + 1 < currentStep
                  ? "h-2 w-2 rounded-full bg-signal/50"
                  : "h-2 w-2 rounded-full bg-signal/20"
              }
            />
          ))}
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 sm:px-14 lg:px-20 py-16 relative overflow-hidden">
        {dots.map((d, i) => (
          <span
            key={i}
            className={`absolute rounded-full ${d.color} ${d.size} opacity-70`}
            style={{
              top: d.top,
              left: d.left,
              right: d.right,
              bottom: d.bottom,
            }}
          />
        ))}

        <div className="w-full max-w-md mx-auto relative">
          {backHref && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          )}

          <div className="text-xs font-semibold text-signal tracking-wide mb-3">
            STEP {currentStep} OF {totalSteps}
          </div>

          <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">{title}</h1>
          {subtitle && <p className="text-muted-foreground mb-8">{subtitle}</p>}
          {!subtitle && <div className="mb-8" />}

          {children}
        </div>
      </div>
    </div>
  );
}