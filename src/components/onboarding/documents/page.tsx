"use client";

import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Button } from "@/components/ui/button";

interface UploadRowProps {
  label: string;
  placeholder: string;
  actions: { label: string; primary?: boolean }[];
}

function UploadRow({ label, placeholder, actions }: UploadRowProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex items-center justify-between border rounded-xl px-4 h-12 bg-card">
        <span className="text-sm text-muted-foreground">{placeholder}</span>
        <div className="flex items-center gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              className={
                a.primary
                  ? "text-xs font-semibold bg-signal text-signal-foreground rounded-full px-3 py-1.5 whitespace-nowrap"
                  : "text-xs font-semibold text-signal border border-signal rounded-full px-3 py-1.5 whitespace-nowrap"
              }
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function UploadDocumentsPage() {
  const router = useRouter();

  return (
    <OnboardingShell icon={FileUp}
      currentStep={6} backHref="/onboarding/server-info" title="Upload Documents">
      <div className="space-y-5 mb-8">
        <UploadRow
          label="Upload photo"
          placeholder="Upload or snap a photo"
          actions={[{ label: "Upload Photo" }, { label: "Take a Photo", primary: true }]}
        />
        <UploadRow
          label="Nid front side"
          placeholder="Tap to upload font of NID"
          actions={[{ label: "Upload NID front" }]}
        />
        <UploadRow
          label="Nid back side"
          placeholder="Tap to upload back of NID"
          actions={[{ label: "Upload NID back" }]}
        />
      </div>

      <Button
        className="w-full h-12 rounded-full font-semibold text-base"
        onClick={() => router.push("/super-admin")}
      >
        Continue
      </Button>
    </OnboardingShell>
  );
}