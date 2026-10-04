"use client";

import { useRouter } from "next/navigation";
import { ServerCog } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ServerInfoPage() {
  const router = useRouter();

  return (
    <OnboardingShell icon={ServerCog}
      currentStep={5} backHref="/onboarding/profile" title="Server Information">
      <div className="space-y-5 mb-8">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server name</label>
          <Input placeholder="Enter your server name" className="h-12" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server IP Address</label>
          <Input placeholder="Enter your server ip" className="h-12" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server IP Address Backup (optional)</label>
          <Input placeholder="Enter your server ip" className="h-12" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server IP Address Backup 2 (optional)</label>
          <Input placeholder="Enter your server ip" className="h-12" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server API Port Number</label>
          <div className="flex gap-2">
            <Input placeholder="Enter your Server Poart" className="h-12 flex-1" />
            <Select>
              <SelectTrigger className="h-12 w-32">
                <SelectValue placeholder="SSL" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ssl">SSL</SelectItem>
                <SelectItem value="non-ssl">Non SSL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server Username</label>
          <Input placeholder="Enter your username" className="h-12" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Server Password</label>
          <Input placeholder="Enter your password" type="password" className="h-12" />
        </div>
      </div>

      <Button
        className="w-full h-12 rounded-full font-semibold text-base"
        onClick={() => router.push("/onboarding/documents")}
      >
        Continue
      </Button>
    </OnboardingShell>
  );
}