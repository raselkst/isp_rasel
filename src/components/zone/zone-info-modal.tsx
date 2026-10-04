"use client";

import { X, LogIn, Settings, Server, Grid3x3, Calendar, MapPin, LinkIcon, Eye, KeyRound, PlusCircle, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ZoneInfoModalProps {
  open: boolean;
  onClose: () => void;
  entityLabel?: string; // "Zone" | "Sub-Zone"
}

const actions = [
  { label: "Login", icon: LogIn },
  { label: "Settings", icon: Settings },
  { label: "Server Permission", icon: Server },
  { label: "Package Rate & Permission", icon: Grid3x3 },
  { label: "Bill cycle permission", icon: Calendar },
  { label: "Address", icon: MapPin },
  { label: "Allow/Remove Menu Links", icon: LinkIcon },
  { label: "View Information", icon: Eye },
  { label: "Password Change", icon: KeyRound },
  { label: "Allow/Remove Action Permission", icon: PlusCircle },
  { label: "Edit Information", icon: Pencil },
];

export function ZoneInfoModal({ open, onClose, entityLabel = "Zone" }: ZoneInfoModalProps) {
  const [active, setActive] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[10px] bg-signal" />
            <div>
              <div className="font-heading font-bold">{entityLabel.toUpperCase()} NAME</div>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-signal text-signal-foreground">
                {entityLabel}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <dl className="space-y-3 text-sm mb-6">
          {[
            ["Username:", "Mythanet.net"],
            ["Mobile:", "01757809238"],
            ["Email:", "Mythanet@gmail.com"],
            ["Balance:", "21500"],
            ["Advance Balance:", "000"],
            ["Owner:", "Company Name"],
            ["Join Date:", "2022-04-18  12:43:49"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between">
              <dt className="font-semibold">{label}</dt>
              <dd className="text-muted-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="border-t pt-4 flex flex-col gap-1">
          {actions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="flex items-center gap-3 py-2 text-sm font-semibold text-signal hover:bg-signal-tint rounded-lg px-2 transition-colors text-left"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}

          <label className="flex items-center gap-3 py-2 px-2 cursor-pointer">
            <button
              onClick={() => setActive(true)}
              className={cn(
                "w-9 h-5 rounded-full relative transition-colors",
                active ? "bg-signal" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                  active ? "left-4.5" : "left-0.5"
                )}
              />
            </button>
            <span className="text-sm font-semibold">Active</span>
          </label>
          <label className="flex items-center gap-3 py-2 px-2 cursor-pointer">
            <button
              onClick={() => setActive(false)}
              className={cn(
                "w-9 h-5 rounded-full relative transition-colors",
                !active ? "bg-signal" : "bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all",
                  !active ? "left-4.5" : "left-0.5"
                )}
              />
            </button>
            <span className="text-sm font-semibold">Inactive</span>
          </label>

          <button className="flex items-center gap-3 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10 rounded-lg px-2 transition-colors text-left">
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>

        <Button className="w-full rounded-full font-semibold mt-6" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}