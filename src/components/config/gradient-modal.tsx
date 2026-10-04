"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GradientModalProps {
  open: boolean;
  onClose: () => void;
  eyebrow: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function GradientModal({
  open,
  onClose,
  eyebrow,
  title,
  icon: Icon,
  children,
  footer,
  maxWidth = "max-w-xl",
}: GradientModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={onClose} />

      <div className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-[28px] bg-card shadow-2xl ring-1 ring-black/5`}>
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-signal via-violet-accent to-signal overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">{eyebrow}</p>
                <h2 className="text-white font-heading text-2xl font-bold">{title}</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-8 py-7">{children}</div>

        {footer && <div className="px-8 pb-8 flex gap-3">{footer}</div>}
      </div>
    </div>
  );
}

export { Button };