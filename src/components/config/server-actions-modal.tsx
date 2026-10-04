"use client";

import { Button } from "@/components/ui/button";
import { GradientModal } from "@/components/config/gradient-modal";
import {
  RotateCw,
  Router,
  CloudUpload,
  RefreshCcw,
  Wrench,
  Lock,
  Unlock,
  Wifi,
  MapPin,
  FileCode,
  Link2,
  Pencil,
  Copy,
  Trash2,
} from "lucide-react";

interface ServerActionsModalProps {
  open: boolean;
  onClose: () => void;
  serverName: string;
  serverId: string;
}

const actions = [
  { label: "Restart", icon: RotateCw },
  { label: "DNS Flush", icon: Router },
  { label: "Create Backup", icon: CloudUpload },
  { label: "Sync Clients", icon: RefreshCcw },
  { label: "PPP Server Troubleshoot", icon: Wrench },
  { label: "PPP Mac Bind All", icon: Lock },
  { label: "PPP Mac Unbind All", icon: Unlock },
  { label: "Hotspot Troubleshoot", icon: Wifi },
  { label: "Hotspot Address List", icon: MapPin },
  { label: "Hotspot Update config.js", icon: FileCode },
  { label: "Bind API IP", icon: Link2 },
  { label: "Edit Server", icon: Pencil },
  { label: "Copy Packages", icon: Copy },
  { label: "Delete", icon: Trash2, danger: true },
];

export function ServerActionsModal({ open, onClose, serverName, serverId }: ServerActionsModalProps) {
  return (
    <GradientModal
      open={open}
      onClose={onClose}
      eyebrow={`ID · ${serverId}`}
      title={serverName}
      icon={Router}
      footer={
        <Button variant="outline" onClick={onClose} className="w-full rounded-2xl font-semibold h-12">
          Cancel
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {actions.map((a) => (
          <button
            key={a.label}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
              a.danger
                ? "text-destructive hover:bg-destructive/10"
                : "text-foreground hover:bg-signal-tint"
            }`}
          >
            <a.icon className="h-4 w-4" />
            {a.label}
          </button>
        ))}
      </div>
    </GradientModal>
  );
}