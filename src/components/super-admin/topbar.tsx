"use client";

import { Search, Bell, Command } from "lucide-react";

export function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-6 sm:px-10 py-5 border-b border-white/5">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40">
          Command Center
        </p>
        <h1 className="font-heading text-2xl font-bold text-white">Good morning, SuperAdmin</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            placeholder="Search resellers, invoices, tickets..."
            className="w-72 rounded-full bg-white/5 border border-white/10 pl-10 pr-16 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-signal/60 focus:ring-4 focus:ring-signal/10 transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
            <Command className="h-2.5 w-2.5" />K
          </span>
        </div>

        <button className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>

        <div className="flex items-center gap-2 pl-1">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
          </span>
          <span className="text-xs font-semibold text-white/60 hidden sm:inline">All systems normal</span>
        </div>
      </div>
    </header>
  );
}