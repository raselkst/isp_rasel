"use client";

import { useRouter } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ClientInfoPage() {
  const router = useRouter();

  const fields = [
    { label: "Owner Name", placeholder: "Enter your name" },
    { label: "Mobile No", placeholder: "Enter your number" },
    { label: "Email", placeholder: "Enter your email", type: "email" },
    { label: "Licences", placeholder: "Enter your license" },
    { label: "NID NO", placeholder: "Enter your NID no" },
    { label: "Address", placeholder: "Enter your Vill/House no" },
  ];

  return (
    <OnboardingShell icon={UserCircle2}
      currentStep={2} backHref="/onboarding/welcome" title="Client Information">
      <div className="space-y-5 mb-8">
        {fields.map((f) => (
          <div key={f.label} className="space-y-2">
            <label className="text-sm font-semibold">{f.label}</label>
            <Input placeholder={f.placeholder} type={f.type ?? "text"} className="h-12" />
          </div>
        ))}
      </div>

      <Button
        className="w-full h-12 rounded-full font-semibold text-base"
        onClick={() => router.push("/onboarding/location")}
      >
        Continue
      </Button>
    </OnboardingShell>
  );
}