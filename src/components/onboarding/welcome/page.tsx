"use client";

import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <OnboardingShell
      icon={Rocket}
      currentStep={1}
      title="Let's Get You Started With (Company Name)"
      subtitle="Simplify your workflow and get things done faster. Let's set up your account!"
    >
      <div className="space-y-2 mb-8">
        <label className="text-sm font-semibold">ISP Name</label>
        <Input placeholder="Enter your ISP name" className="h-12" />
      </div>

      <Button
        className="w-full h-12 rounded-full font-semibold text-base"
        onClick={() => router.push("/onboarding/client-info")}
      >
        Get Started
      </Button>
    </OnboardingShell>
  );
}