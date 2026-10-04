"use client";

import { X, Waypoints } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddDiagramModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm text-foreground/80 block">{label}</span>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-border/70 rounded-2xl px-4 py-3 bg-muted/30 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card";

export function AddDiagramModal({ open, onClose, onSubmit }: AddDiagramModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-card shadow-2xl ring-1 ring-black/5">
        {/* Gradient header band */}
        <div className="relative px-8 pt-8 pb-6 bg-gradient-to-br from-signal via-violet-accent to-signal overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                <Waypoints className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs font-semibold tracking-wide uppercase">
                  Network Diagram
                </p>
                <h2 className="text-white font-heading text-2xl font-bold">Add Diagram Node</h2>
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

        <div className="px-8 py-7 space-y-5">
          <Field label="Node Name">
            <input placeholder="e.g. Core Router — Dhanmondi POP" className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Node Type">
              <select className={inputClass}>
                <option>Select</option>
              </select>
            </Field>
            <Field label="Cable Type">
              <select className={inputClass}>
                <option>Select</option>
              </select>
            </Field>
          </div>

          <Field label="Cable Distance">
            <input placeholder="e.g. 1.2 km" className={inputClass} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Map Latitude">
              <input placeholder="23.7500" className={inputClass} />
            </Field>
            <Field label="Map Longitude">
              <input placeholder="90.3900" className={inputClass} />
            </Field>
          </div>

          <Field label="Description">
            <textarea placeholder="Optional notes about this node..." className={`${inputClass} min-h-[100px]`} />
          </Field>
        </div>

        <div className="px-8 pb-8 flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl font-semibold h-12">
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent hover:opacity-90 border-0"
          >
            Create Node
          </Button>
        </div>
      </div>
    </div>
  );
}