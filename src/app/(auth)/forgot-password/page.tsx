"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <AuthShell
        eyebrow="Check your inbox"
        title="Reset link sent"
        subtitle="We've emailed a link to reset your password. It expires in 15 minutes."
      >
        <div className="flex flex-col items-center text-center gap-4 py-6">
          <div className="w-14 h-14 rounded-full bg-signal-tint flex items-center justify-center">
            <MailCheck className="h-6 w-6 text-signal" />
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            Didn&apos;t get the email? Check your spam folder, or try again with a different address.
          </p>
          <Button
            variant="outline"
            className="rounded-full font-semibold"
            onClick={() => setSent(false)}
          >
            Try another email
          </Button>
          <Link
            href="/login"
            className="text-sm font-semibold text-signal hover:underline flex items-center gap-1.5 mt-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Trouble signing in"
      title="Forgot your password?"
      subtitle="Enter the email linked to your account and we'll send a reset link."
      footer={
        <Link
          href="/login"
          className="text-muted-foreground hover:text-signal font-semibold flex items-center justify-center gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to sign in
        </Link>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="email" type="email" placeholder="you@isp.com" className="pl-9" />
          </div>
        </div>

        <Button type="submit" className="w-full rounded-full h-11 font-semibold mt-2">
          Send Reset Link
        </Button>
      </form>
    </AuthShell>
  );
}