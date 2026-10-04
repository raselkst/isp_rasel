"use client";

import { X, Building2, TrendingUp, Users, Server, Phone, Mail } from "lucide-react";
import { StatusChip } from "@/components/super-admin/table-shell";

interface ResellerDrawerProps {
  open: boolean;
  onClose: () => void;
  reseller: {
    name: string;
    region: string;
    status: "success" | "caution" | "destructive";
    revenue: string;
    subscribers: string;
    servers: number;
    phone: string;
    email: string;
  } | null;
}

export function ResellerDrawer({ open, onClose, reseller }: ResellerDrawerProps) {
  if (!open || !reseller) return null;

  const stat = [
    { icon: TrendingUp, label: "Monthly revenue", value: reseller.revenue },
    { icon: Users, label: "Active subscribers", value: reseller.subscribers },
    { icon: Server, label: "Servers managed", value: String(reseller.servers) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md h-full bg-[#0a0d16] border-l border-white/10 overflow-y-auto text-white">
        <div className="relative px-7 pt-7 pb-8 bg-gradient-to-br from-signal via-violet-accent to-signal overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30 shrink-0">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-xl font-bold truncate">{reseller.name}</p>
              <p className="text-white/70 text-sm">{reseller.region}</p>
            </div>
          </div>
          <div className="relative mt-5">
            <StatusChip tone={reseller.status}>
              {reseller.status === "success" ? "Active" : reseller.status === "caution" ? "At risk" : "Suspended"}
            </StatusChip>
          </div>
        </div>

        <div className="p-7 space-y-6">
          <div className="grid grid-cols-1 gap-3">
            {stat.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-white/10"
              >
                <div className="w-9 h-9 rounded-xl bg-signal/15 text-signal flex items-center justify-center shrink-0">
                  <s.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-white/40">{s.label}</p>
                  <p className="text-sm font-bold">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold tracking-wide uppercase text-white/40 mb-3">Contact</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-white/40" /> {reseller.phone}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-white/40" /> {reseller.email}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button className="flex-1 rounded-2xl bg-gradient-to-r from-signal to-violet-accent text-sm font-semibold py-3 hover:opacity-90 transition-opacity">
              Message Reseller
            </button>
            <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
              <Server className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}