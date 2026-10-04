"use client";

import { CenteredFormModal } from "@/components/cards/centered-form-modal";
import { Upload } from "lucide-react";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block">{label}</span>
      {children}
    </div>
  );
}

interface TicketCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

export function TicketCreateModal({ open, onClose, onSubmit }: TicketCreateModalProps) {
  return (
    <CenteredFormModal open={open} onClose={onClose} onSubmit={onSubmit} title="Ticket Create">
      <Field label="Subject">
        <input
          placeholder="Write here"
          className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm"
        />
      </Field>
      <Field label="Priority">
        <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm">
          <option>Select</option>
        </select>
      </Field>
      <Field label="Attachment">
        <div className="flex items-center justify-between border rounded-xl px-4 py-2.5 bg-muted/40 text-sm text-muted-foreground">
          <span>Choose file</span>
          <span className="flex items-center gap-1.5 text-signal font-semibold">
            <Upload className="h-3.5 w-3.5" /> Select file
          </span>
        </div>
      </Field>
      <Field label="Client ID">
        <input
          placeholder="Search"
          className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm"
        />
      </Field>
      <Field label="Message">
        <textarea
          placeholder="Write here"
          className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm min-h-[110px]"
        />
      </Field>
    </CenteredFormModal>
  );
}