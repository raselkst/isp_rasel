"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface ZoneSettingsModalProps {
  open: boolean;
  onClose: () => void;
}

interface FieldDef {
  label: string;
  type: "select" | "input";
  defaultValue?: string;
  options?: string[];
}

const fields: FieldDef[] = [
  { label: "Whatsapp Policy", type: "select", defaultValue: "SMS for non-Wh", options: ["SMS for non-Wh", "WhatsApp only"] },
  { label: "Porichoy API", type: "select", options: ["Enabled", "Disabled"] },
  { label: "Show Home Invoice", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Customer ID Start From", type: "input", defaultValue: "590001" },
  { label: "Portal Subscriber Form", type: "select", defaultValue: "NO", options: ["YES", "NO"] },
  { label: "Download Customer", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Billing Cycle Change", type: "select", defaultValue: "Disallowed", options: ["Allowed", "Disallowed"] },
  { label: "Support Phone No", type: "input" },
  { label: "Max Inactive Days", type: "input", defaultValue: "7" },
  { label: "bKash", type: "select", defaultValue: "None", options: ["None", "Personal", "Merchant"] },
  { label: "Cash Receive", type: "select", defaultValue: "Allowed", options: ["Allowed", "Disallowed"] },
  { label: "Default Grace Days", type: "input", defaultValue: "0" },
  { label: "bKash Number", type: "input" },
  { label: "Max Cust/Mobile", type: "input" },
  { label: "Default Grace Hour", type: "input", defaultValue: "12" },
  { label: "Rocket", type: "select", defaultValue: "NO", options: ["YES", "NO"] },
  { label: "Jump Billing Cycle", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Manual Grace Days", type: "input" },
  { label: "Rocket Number", type: "input" },
  { label: "Auto Billing Cycle", type: "select", defaultValue: "NO", options: ["YES", "NO"] },
  { label: "Edit SMS Settings", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Max Package Change", type: "input" },
  { label: "New Conn Expired", type: "select", defaultValue: "NO", options: ["YES", "NO"] },
  { label: "MFS Add Payment to Balance", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Package Downgrade", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Own bKash SMS Sync", type: "select", defaultValue: "NO", options: ["YES", "NO"] },
  { label: "MFS Recharge Customer", type: "select", defaultValue: "YES", options: ["YES", "NO"] },
  { label: "Max Billing Cycle Change", type: "input", defaultValue: "31" },
  { label: "SMS Sync Mode", type: "select", options: ["Mode 1", "Mode 2"] },
  { label: "Sub-Zone", type: "select", defaultValue: "NO", options: ["YES", "NO"] },
];

export function ZoneSettingsModal({ open, onClose }: ZoneSettingsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-signal" />
            <span className="font-heading font-bold text-sm">LOGO ICON ONLY</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-6">
          Settings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
          {fields.map((f) => (
            <div key={f.label} className="space-y-1.5">
              <label className="text-sm font-semibold">{f.label}</label>
              {f.type === "select" ? (
                <Select defaultValue={f.defaultValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {(f.options ?? []).map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input defaultValue={f.defaultValue} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1 rounded-full font-semibold" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 rounded-full font-semibold">Save</Button>
        </div>
      </div>
    </div>
  );
}