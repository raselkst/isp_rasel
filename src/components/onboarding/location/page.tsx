"use client";

import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Button } from "@/components/ui/button";

export default function LocationDetailsPage() {
  const router = useRouter();

  return (
    <OnboardingShell
      icon={MapPin}
      currentStep={3}
      backHref="/onboarding/client-info"
      title="Location Details"
      subtitle="Help us personalize your experience by adding your location details"
    >
      <div className="space-y-2 mb-8">
        <label className="text-sm font-semibold">GPS Coordinates</label>
        <div className="flex items-center gap-2 border rounded-xl px-4 py-1 h-12 bg-card">
          <input
            placeholder="Enter latitude, longtude"
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <button className="text-xs font-semibold text-signal border border-signal rounded-full px-3 py-1.5 whitespace-nowrap">
            Open in map
          </button>
          <button className="text-xs font-semibold bg-signal text-signal-foreground rounded-full px-3 py-1.5 whitespace-nowrap">
            Current location
          </button>
        </div>
      </div>

      <Button
        className="w-full h-12 rounded-full font-semibold text-base"
        onClick={() => router.push("/onboarding/profile")}
      >
        Continue
      </Button>
    </OnboardingShell>
  );
}