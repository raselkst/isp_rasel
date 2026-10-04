"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortalModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
}

export function PortalModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  submitLabel = "Save",
}: PortalModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">{children}</div>

        <div className="flex gap-3 mt-8">
          <Button variant="outline" className="flex-1 rounded-full font-semibold" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1 rounded-full font-semibold" onClick={onSubmit}>
            {submitLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}