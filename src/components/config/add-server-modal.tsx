"use client";

import { Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientModal } from "@/components/config/gradient-modal";
import { Field, inputClass } from "@/components/config/shared";

interface AddServerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export function AddServerModal({ open, onClose, onSubmit }: AddServerModalProps) {
  return (
    <GradientModal
      open={open}
      onClose={onClose}
      eyebrow="Config · Mikrotik"
      title="Add Mikrotik Server"
      icon={Server}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl font-semibold h-12">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent hover:opacity-90 border-0"
          >
            Save Server
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field label="Name">
          <input placeholder="Enter Name" className={inputClass} />
        </Field>
        <Field label="IP">
          <input placeholder="Enter IP Address" className={inputClass} />
        </Field>
        <Field label="DNS">
          <input placeholder="Enter DNS Name for Hotspot" className={inputClass} />
        </Field>
        <Field label="Port">
          <input placeholder="Enter Port 7320 to 7390" className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Username">
            <input placeholder="Enter Username" className={inputClass} />
          </Field>
          <Field label="Password">
            <input type="password" placeholder="Enter Password" className={inputClass} />
          </Field>
        </div>
      </div>
    </GradientModal>
  );
}