"use client";

import { SidePanelModal } from "@/components/billing/side-panel-modal";

interface RouterLoginModalProps {
  open: boolean;
  onClose: () => void;
  onSave?: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <span className="font-semibold text-sm block">{label}</span>
      <input
        defaultValue={value}
        readOnly
        className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm"
      />
    </div>
  );
}

export function RouterLoginModal({ open, onClose, onSave }: RouterLoginModalProps) {
  return (
    <SidePanelModal
      open={open}
      onClose={onClose}
      onConfirm={onSave}
      title="Client Router Details"
      confirmLabel="Save"
      exitLabel="Close"
    >
      <div className="space-y-6">
        <Field label="Router Model" value="N/A" />
        <Field label="Router Port" value="N/A" />
        <Field label="Router Username" value="N/A" />
        <Field label="Router Password" value="N/A" />
      </div>
    </SidePanelModal>
  );
}