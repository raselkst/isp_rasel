"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Search, UserCircle2, Wifi, Wallet, ArrowRight } from "lucide-react";

const recentSearches = ["mb@liton.crs", "2550", "01711010341", "Md.Lipu Vai"];

export default function ClientSearchPage() {
  const [query, setQuery] = useState("");
  const [found, setFound] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-16 max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-3xl bg-signal flex items-center justify-center mx-auto mb-5 shadow-lg shadow-signal/30">
            <Search className="h-6 w-6 text-white" />
          </div>

          {/* Heading */}
          <h1 className="font-heading text-2xl font-bold mb-2 text-signal">
            Find any client, instantly
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Search by name, username, customer ID, or mobile number.
          </p>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setFound(true)}
              placeholder="Type a name, ID, or mobile number..."
              className="w-full border border-signal/30 rounded-full pl-14 pr-32 py-4 text-sm bg-white text-signal shadow-sm outline-none focus:ring-4 focus:ring-signal/10 focus:border-signal transition-all"
            />
            <Button
              onClick={() => setFound(true)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-11 px-6 font-semibold bg-signal hover:bg-signal-hover text-white border-0 shadow-md transition-all"
            >
              Search
            </Button>
          </div>

          {/* Recent Searches */}
          {!found && (
            <div className="mt-8 text-left">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                Recent searches
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setQuery(r);
                      setFound(true);
                    }}
                    className="px-4 py-2 rounded-full bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:border-signal hover:text-signal hover:bg-signal-tint transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Result */}
          {found && (
            <div className="mt-8 text-left rounded-[28px] bg-white border border-slate-200 shadow-sm p-6 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-signal-tint text-signal flex items-center justify-center font-heading font-bold text-lg shrink-0">
                ML
              </div>

              {/* Client Info */}
              <div className="flex-1 min-w-0">
                <p className="font-heading font-bold text-signal">Md.Lipu Vai</p>
                <p className="text-xs text-slate-500 mb-2">
                  Customer ID 585831 · mb@liton.crs
                </p>
                <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Wifi className="h-3 w-3 text-signal" /> 10Mbps Package
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet className="h-3 w-3 text-signal" /> ৳0 balance
                  </span>
                  <span className="flex items-center gap-1 text-success font-semibold">
                    <UserCircle2 className="h-3 w-3" /> Active
                  </span>
                </div>
              </div>

              {/* Action */}
              <Button className="rounded-2xl gap-1.5 font-semibold shrink-0 bg-signal hover:bg-signal-hover text-white border-0 shadow-md transition-all">
                Open profile <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}