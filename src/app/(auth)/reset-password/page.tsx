"use client";

import { useMemo, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Eye, EyeOff, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score; // 0-4
}

const strengthMeta = [
  { label: "Too short", color: "bg-destructive" },
  { label: "Weak", color: "bg-caution" },
  { label: "Fair", color: "bg-warning" },
  { label: "Good", color: "bg-signal" },
  { label: "Strong", color: "bg-success" },
];

export default function ResetPasswordPage() {
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = useMemo(() => getStrength(pw), [pw]);
  const meta = strengthMeta[strength];
  const matches = confirmPw.length > 0 && confirmPw === pw;

  const rules = [
    { label: "At least 8 characters", pass: pw.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "One number", pass: /[0-9]/.test(pw) },
    { label: "One symbol", pass: /[^A-Za-z0-9]/.test(pw) },
  ];

  return (
    <AuthShell
      eyebrow="Almost done"
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before."
    >
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="new-password">New password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="new-password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-9"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {/* Strength meter */}
          <div className="flex gap-1.5 pt-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 flex-1 rounded-full bg-muted transition-colors",
                  i < strength && meta.color
                )}
              />
            ))}
          </div>
          {pw.length > 0 && (
            <p className="text-[11.5px] text-muted-foreground pt-0.5">{meta.label}</p>
          )}

          <ul className="grid grid-cols-2 gap-x-3 gap-y-1 pt-2">
            {rules.map((r) => (
              <li
                key={r.label}
                className={cn(
                  "flex items-center gap-1.5 text-[11.5px]",
                  r.pass ? "text-success" : "text-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0",
                    r.pass ? "bg-success-tint" : "bg-muted"
                  )}
                >
                  {r.pass && <Check className="w-2.5 h-2.5" />}
                </span>
                {r.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm-password">Confirm password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              className="pl-9 pr-9"
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {confirmPw.length > 0 && (
            <p className={cn("text-[11.5px] pt-0.5", matches ? "text-success" : "text-destructive")}>
              {matches ? "Passwords match" : "Passwords do not match"}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full rounded-full h-11 font-semibold mt-2">
          Update Password
        </Button>
      </form>
    </AuthShell>
  );
}