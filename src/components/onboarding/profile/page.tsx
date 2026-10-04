"use client";

import { useRouter } from "next/navigation";
import { UserSquare2 } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileSetupPage() {
  const router = useRouter();

  return (
    <OnboardingShell
      icon={UserSquare2}
      currentStep={4}
      backHref="/onboarding/location"
      title="Profile Setup"
      subtitle="Complete your profile to personalize your experience. You can always update it later"
    >
      <div className="flex items-center gap-4 mb-8">
        <span className="w-16 h-16 rounded-full bg-gradient-to-br from-signal to-violet-accent" />
        <button className="border rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-muted">
          Choose profile
        </button>
      </div>

      <div className="space-y-2 mb-8">
        <label className="text-sm font-semibold">Username</label>
        <Input placeholder="Enter your username" className="h-12" />
      </div>

      <Button
        className="w-full h-12 rounded-full font-semibold text-base"
        onClick={() => router.push("/onboarding/server-info")}
      >
        Confirm & Continue
      </Button>
    </OnboardingShell>
  );
}