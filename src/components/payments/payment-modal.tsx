"use client";

import { useState } from "react";
import { X, CreditCard, Pencil, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PaymentStep = "no-account" | "select-method" | "enter-amount";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  initialStep?: PaymentStep;
  accountNumber?: string | null;
  totalAmount?: string;
}

/** Custom "no wallet linked" illustration — not a stock asset. */
function NoAccountGraphic() {
  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-[260px] mx-auto">
      <defs>
        <radialGradient id="noAcctGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="var(--violet-accent)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--violet-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="150" cy="110" r="95" fill="url(#noAcctGlow)" />

      {/* tag / card shape */}
      <path
        d="M112 62 h68 a10 10 0 0 1 10 10 v86 a10 10 0 0 1 -10 10 h-68 a10 10 0 0 1 -10 -10 v-86 a10 10 0 0 1 10 -10 z"
        fill="var(--card)"
        stroke="var(--muted-foreground)"
        strokeOpacity="0.35"
        strokeWidth="2.5"
      />
      <circle cx="146" cy="88" r="8" fill="none" stroke="var(--muted-foreground)" strokeOpacity="0.45" strokeWidth="2.5" />
      {/* sad face */}
      <circle cx="134" cy="116" r="3" fill="var(--muted-foreground)" fillOpacity="0.5" />
      <circle cx="160" cy="116" r="3" fill="var(--muted-foreground)" fillOpacity="0.5" />
      <path d="M133 136 q14 -11 28 0" fill="none" stroke="var(--muted-foreground)" strokeOpacity="0.5" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="116" y="148" width="60" height="12" rx="4" fill="var(--muted)" />

      {/* scattered x marks */}
      {[
        [96, 46], [120, 38], [148, 34], [176, 38], [200, 46],
      ].map(([x, y], i) => (
        <g key={i} stroke="var(--destructive)" strokeWidth="3" strokeLinecap="round" opacity="0.85">
          <line x1={x - 5} y1={y - 5} x2={x + 5} y2={y + 5} />
          <line x1={x + 5} y1={y - 5} x2={x - 5} y2={y + 5} />
        </g>
      ))}
    </svg>
  );
}

/** Brand-neutral wallet mark — drawn, not a copied logo. */
function WalletMark({ size = 96 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shadow-lg shadow-signal/20"
      style={{ width: size, height: size }}
    >
      <CreditCard className="text-white" style={{ width: size * 0.42, height: size * 0.42 }} />
    </div>
  );
}

export function PaymentModal({
  open,
  onClose,
  initialStep = "select-method",
  accountNumber = "01799769592",
  totalAmount = "2000 BDT",
}: PaymentModalProps) {
  const [step, setStep] = useState<PaymentStep>(initialStep);
  const [showSuccess, setShowSuccess] = useState(false);
  const [account, setAccount] = useState(accountNumber);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[28px] bg-card shadow-2xl ring-1 ring-black/5">
        {showSuccess ? (
          <div className="flex items-start justify-between gap-3 px-8 py-5 bg-success/10 border-b border-success/20">
            <p className="flex items-center gap-2 text-sm font-semibold text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Your account number was successfully added
            </p>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-signal via-violet-accent to-signal overflow-hidden">
            <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                  <CreditCard className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">Payments</p>
                  <h2 className="text-white font-heading text-2xl font-bold">Payment</h2>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* ---------- STEP: no account linked ---------- */}
        {step === "no-account" && (
          <>
            <div className="px-8 py-8">
              <NoAccountGraphic />
              <p className="text-center text-lg mt-6 leading-relaxed">
                Wallet number removed.{" "}
                <span className="font-bold text-signal">Add a new one</span> to proceed
              </p>
            </div>
            <div className="px-8 pb-8">
              <Button
                onClick={() => {
                  setStep("select-method");
                  setShowSuccess(true);
                }}
                className="w-full rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent hover:opacity-90 border-0"
              >
                Add Wallet Account
              </Button>
            </div>
          </>
        )}

        {/* ---------- STEP: select method ---------- */}
        {step === "select-method" && (
          <>
            <div className="px-8 py-7">
              <p className="text-sm text-muted-foreground mb-2">Your current wallet account number</p>
              <div className="inline-flex items-center gap-2 rounded-full border border-signal/30 bg-signal-tint px-4 py-2">
                <span className="font-semibold text-sm">{account}</span>
                <button className="w-6 h-6 rounded-full bg-signal/15 text-signal flex items-center justify-center">
                  <Pencil className="h-3 w-3" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-7 pb-5 border-b border-dashed">
                <span className="font-heading text-lg font-bold">Total Amount</span>
                <span className="font-heading text-lg font-bold text-signal">{totalAmount}</span>
              </div>

              <p className="font-heading text-lg font-bold mt-6 mb-4">Payment Methods</p>
              <button
                onClick={() => setStep("enter-amount")}
                className={cn(
                  "w-28 rounded-2xl border-2 border-signal bg-signal-tint/40 p-4 flex flex-col items-center gap-2",
                  "transition-all hover:shadow-md"
                )}
              >
                <WalletMark size={52} />
                <span className="text-sm font-semibold">Wallet</span>
              </button>
            </div>

            <div className="px-8 pb-8">
              <Button className="w-full rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent hover:opacity-90 border-0">
                Confirm Payment
              </Button>
            </div>
          </>
        )}

        {/* ---------- STEP: enter amount ---------- */}
        {step === "enter-amount" && (
          <>
            <div className="px-8 py-7">
              <div className="flex flex-col items-center gap-4 mb-7">
                <WalletMark size={96} />
                <p className="font-heading text-xl font-bold">Payment via Wallet</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-2">
                  <span className="font-semibold text-sm block">
                    Amount <span className="text-muted-foreground font-normal">(TK)</span>
                  </span>
                  <input
                    placeholder="Enter Amount"
                    className="w-full border border-signal/40 rounded-2xl px-4 py-3.5 bg-muted/30 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <span className="font-semibold text-sm block">Remarks</span>
                  <textarea
                    placeholder="Write something"
                    className="w-full border border-border/70 rounded-2xl px-4 py-3 bg-muted/30 text-sm min-h-[110px] outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional — proceed with this step only if necessary
                  </p>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8">
              <Button
                onClick={() => setStep("select-method")}
                className="w-full rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent hover:opacity-90 border-0"
              >
                Continue
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}