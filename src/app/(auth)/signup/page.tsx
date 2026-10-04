"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Mail, Phone, Lock, Eye, EyeOff, Building2 } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your ISP account"
      subtitle="Set up your operator workspace in a couple of minutes."
      footer={
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-signal font-semibold hover:underline">
            Sign in
          </Link>
        </span>
      }
    >
      <form className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="company">Company / ISP name</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="company" placeholder="e.g. Rangpur Broadband" className="pl-9" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fullname">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input id="fullname" placeholder="Your full name" className="pl-9" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" placeholder="you@isp.com" className="pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input id="phone" placeholder="01XXXXXXXXX" className="pl-9" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              className="pl-9 pr-9"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-[11.5px] text-muted-foreground pt-0.5">
            Minimum 8 characters, with a number and a symbol.
          </p>
        </div>

        <label className="flex items-start gap-2 text-[12.5px] text-muted-foreground cursor-pointer pt-1">
          <input type="checkbox" className="mt-0.5 accent-signal" />
          I agree to the Terms of Service and Privacy Policy.
        </label>

        <Button type="submit" className="w-full rounded-full h-11 font-semibold mt-2">
          Create Account
        </Button>
      </form>
    </AuthShell>
  );
}