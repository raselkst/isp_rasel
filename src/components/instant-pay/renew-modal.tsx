"use client";

import { useState } from "react";
import { X, Zap, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RenewModalProps {
  open: boolean;
  onClose: () => void;
  onContinue?: (id: string) => void;
}

function RenewIllustration() {
  // Custom "identity check" illustration — not a stock asset.
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-xs mx-auto">
      <defs>
        <radialGradient id="renewGlow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="var(--signal)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--signal)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--signal)" />
          <stop offset="100%" stopColor="var(--violet-accent)" />
        </linearGradient>
      </defs>

      <ellipse cx="160" cy="120" rx="130" ry="90" fill="url(#renewGlow)" />

      {/* ID card */}
      <rect x="70" y="55" width="110" height="140" rx="16" fill="var(--card)" stroke="url(#cardGrad)" strokeWidth="3" />
      <circle cx="125" cy="100" r="20" fill="var(--signal-tint)" stroke="var(--signal)" strokeWidth="2" />
      <circle cx="125" cy="93" r="7" fill="var(--signal)" />
      <path d="M110 118 q15 -12 30 0" fill="none" stroke="var(--signal)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="90" y="140" width="70" height="8" rx="4" fill="var(--signal-tint)" />
      <rect x="90" y="156" width="50" height="8" rx="4" fill="var(--violet-accent-tint)" />

      {/* refresh arrow */}
      <path
        d="M195 80 a35 35 0 1 1 -10 -25"
        fill="none"
        stroke="var(--violet-accent)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M185 45 L198 55 L182 62 Z" fill="var(--violet-accent)" />

      {/* small figure */}
      <circle cx="235" cy="95" r="16" fill="var(--card)" stroke="var(--signal)" strokeWidth="2.5" />
      <rect x="220" y="115" width="30" height="55" rx="14" fill="var(--signal-tint)" />
    </svg>
  );
}

export function RenewModal({ open, onClose, onContinue }: RenewModalProps) {
  const [id, setId] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] bg-card shadow-2xl ring-1 ring-black/5">
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-signal via-violet-accent to-signal overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">Instant Pay</p>
                <h2 className="text-white font-heading text-xl font-bold leading-snug">
                  Enter your ID to renew your account
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-8 py-7">
          <RenewIllustration />

          <div className="space-y-2 mt-6">
            <span className="font-semibold text-sm block">Customer ID / User ID / Mobile No</span>
            <input
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter your ID"
              className="w-full border border-signal/40 rounded-2xl px-4 py-3.5 bg-muted/30 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card"
            />
          </div>
        </div>

        <div className="px-8 pb-8 space-y-3">
          <Button
            onClick={() => onContinue?.(id)}
            className="w-full rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent hover:opacity-90 border-0"
          >
            Continue
          </Button>
          <Button variant="outline" className="w-full rounded-2xl font-semibold h-12 gap-2">
            <PhoneCall className="h-4 w-4" /> Helpline
          </Button>
        </div>
      </div>
    </div>
  );
}