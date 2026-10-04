"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, FormSection, EditableField, premiumInput } from "@/components/clients-v2/premium-form";
import { UserCog, Eye, EyeOff, Info } from "lucide-react";

export default function EditCustomerInfoPage() {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-2xl mx-auto">
          <FormShell icon={UserCog} eyebrow="Clients · Edit Info" title="Edit Customer Information">
            <FormSection>
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-2xl bg-signal-tint text-signal flex items-center justify-center font-heading font-bold shrink-0">
                  Z
                </div>
                <div>
                  <p className="font-heading font-bold">Zim</p>
                  <p className="text-xs text-muted-foreground">Login ID ch@1914</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="Name" required>
                  <Input defaultValue="Zim" className={`${premiumInput} border-signal/40 ring-4 ring-signal/10`} />
                </EditableField>
                <EditableField label="Mobile number">
                  <Input defaultValue="01790031914" className={premiumInput} />
                </EditableField>
                <EditableField label="Email address">
                  <Input placeholder="Not set" className={premiumInput} />
                </EditableField>
                <EditableField label="Login ID" required>
                  <Input defaultValue="ch@1914" className={`${premiumInput} bg-muted/50 font-semibold`} />
                </EditableField>
              </div>
            </FormSection>

            <FormSection title="Change Password">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <EditableField label="New password">
                  <div className="relative">
                    <Input type={showPw ? "text" : "password"} placeholder="Enter password" className={premiumInput} />
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </EditableField>
                <EditableField label="Retype password">
                  <Input type={showPw ? "text" : "password"} placeholder="Retype password" className={premiumInput} />
                </EditableField>
              </div>
              <p className="flex items-center gap-1.5 text-xs text-signal font-medium mt-3">
                <Info className="h-3.5 w-3.5" /> Leave blank to keep the current password. Max 20 characters.
              </p>
            </FormSection>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 rounded-2xl font-semibold h-12">
                Cancel
              </Button>
              <Button className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0">
                Save Changes
              </Button>
            </div>
          </FormShell>
        </div>
      </div>
    </div>
  );
}