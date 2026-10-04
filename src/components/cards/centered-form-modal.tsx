"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CenteredFormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  hideSubmit?: boolean;
  maxWidth?: string;
}

export function CenteredFormModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Submit",
  hideSubmit = false,
  maxWidth = "max-w-2xl",
}: CenteredFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative bg-card w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl p-8 sm:p-10 shadow-2xl`}>
        <div className="flex items-center justify-between mb-8">
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
          {title}
        </h2>

        <div className="space-y-6 mb-8">{children}</div>

        {!hideSubmit && (
          <Button onClick={onSubmit} className="w-full rounded-xl font-semibold py-6">
            {submitLabel}
          </Button>
        )}
      </div>
    </div>
  );
}