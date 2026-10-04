"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidePanelModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  warning?: string;
  children?: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  exitLabel?: string;
  /** Show a single centered button (uses confirmLabel + onConfirm, defaults onConfirm to onClose) instead of the Exit/Confirm pair */
  singleButton?: boolean;
}

export function SidePanelModal({
  open,
  onClose,
  title,
  warning,
  children,
  onConfirm,
  confirmLabel = "Confirm",
  exitLabel = "Exit",
  singleButton = false,
}: SidePanelModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative bg-card w-full max-w-lg h-full overflow-y-auto p-8 shadow-2xl animate-in slide-in-from-right duration-200">
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

        {warning && (
          <div className="bg-destructive/10 text-destructive text-sm text-center rounded-xl p-4 mb-6 font-medium leading-relaxed">
            {warning}
          </div>
        )}

        <div className="space-y-6 mb-8">{children}</div>

        <div className="absolute bottom-8 left-8 right-8 flex gap-3">
          {singleButton ? (
            <Button
              className="flex-1 rounded-full font-semibold"
              onClick={onConfirm ?? onClose}
            >
              {confirmLabel}
            </Button>
          ) : (
            <>
              <Button variant="outline" className="flex-1 rounded-full font-semibold" onClick={onClose}>
                {exitLabel}
              </Button>
              <Button className="flex-1 rounded-full font-semibold" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}