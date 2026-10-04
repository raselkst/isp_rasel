"use client";

import { Button } from "@/components/ui/button";
import { GradientModal } from "@/components/config/gradient-modal";
import { Router } from "lucide-react";

interface RouterLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <span className="text-sm font-semibold block">{label}</span>
      <input
        defaultValue={value}
        readOnly
        className="w-full border border-border/70 rounded-2xl px-4 py-2.5 bg-muted/30 text-sm"
      />
    </div>
  );
}

export function RouterLoginModal({ open, onClose, onSave }: RouterLoginModalProps) {
  return (
    <GradientModal
      open={open}
      onClose={onClose}
      eyebrow="Client · Network"
      title="Router Details"
      icon={Router}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl font-semibold h-12">
            Close
          </Button>
          <Button
            onClick={onSave}
            className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
          >
            Save
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <Field label="Router model" value="N/A" />
        <Field label="Router port" value="N/A" />
        <Field label="Router username" value="N/A" />
        <Field label="Router password" value="N/A" />
      </div>
    </GradientModal>
  );
}