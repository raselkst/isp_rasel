"use client";

import { ReactNode } from "react";
import { Label } from "@/components/ui/label";

interface PortalFieldProps {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}

export function PortalField({ label, htmlFor, children }: PortalFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </Label>
      {children}
    </div>
  );
}