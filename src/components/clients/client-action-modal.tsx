"use client";

import Link from "next/link";
import { X, Search, RefreshCw, User, CreditCard, Activity, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

export type ClientActionTab =
  | "general-renew"
  | "view-information"
  | "client-search"
  | "plan-migration"
  | "online-renew"
  | "client-date-extend"
  | "special-renew";

const tabs: { id: ClientActionTab; label: string; href: string }[] = [
  { id: "general-renew", label: "General Renew", href: "/admin/clients/general-renew" },
  { id: "view-information", label: "View Information", href: "/admin/clients/view-information" },
  { id: "client-search", label: "Client Search", href: "/admin/clients/client-search" },
  { id: "plan-migration", label: "Plan Migration", href: "/admin/clients/plan-migration" },
  { id: "online-renew", label: "Online Renew", href: "/admin/clients/online-renew" },
  { id: "client-date-extend", label: "Client Date Extend", href: "/admin/clients/client-date-extend" },
  { id: "special-renew", label: "Special Renew", href: "/clients/special-renew" },
];

const titles: Record<ClientActionTab, string> = {
  "general-renew": "Client Renew",
  "view-information": "Client Information",
  "client-search": "Client Search",
  "plan-migration": "Plan Migration",
  "online-renew": "Online Client Renew",
  "client-date-extend": "Client Date Extend",
  "special-renew": "Client Renew Special",
};

const fieldConfig: Partial<Record<ClientActionTab, { label: string; placeholder: string }>> = {
  "general-renew": { label: "Client ID:", placeholder: "Search for an option" },
  "view-information": { label: "Client details", placeholder: "Client's Username/AC No/Mobile No" },
  "client-search": { label: "Client ID:", placeholder: "Search for an option" },
  "plan-migration": { label: "Client account", placeholder: "Client's Username/AC No/Mobile No" },
  "client-date-extend": { label: "Client details", placeholder: "Client's Username/AC No/Mobile No" },
  "special-renew": { label: "Client ID", placeholder: "Search for an option" },
};

function ActionIllustration() {
  return (
    <div className="flex justify-center py-4">
      <div className="relative w-40 h-28 flex items-center justify-center">
        <RefreshCw className="w-20 h-20 text-signal/20" strokeWidth={1.2} />
        <div className="absolute top-0 left-4 w-10 h-10 rounded-xl bg-signal flex items-center justify-center shadow-md rotate-[-8deg]">
          <Search className="w-5 h-5 text-signal-foreground" />
        </div>
      </div>
    </div>
  );
}

// ডামি ক্লায়েন্ট ডেটা (সার্চ করার পর দেখানোর জন্য)
const mockClientData = {
  name: "Liton Ahmed",
  id: "2550",
  username: "liton_ahmed",
  mobile: "+8801712345678",
  email: "mb@liton.crs",
  package: "10Mbps_Package",
  billingCycle: "Day 1",
  balance: 0,
  status: "Active",
  expiryDate: "03/09/2025",
  address: "123, Mirpur, Dhaka",
};

interface ClientActionModalProps {
  activeTab: ClientActionTab;
}

export function ClientActionModal({ activeTab }: ClientActionModalProps) {
  const field = fieldConfig[activeTab];
  const [searchTerm, setSearchTerm] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim().length > 0) {
      setShowPreview(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]" onClick={() => setShowPreview(false)} />
      <div className="relative bg-card w-full max-w-lg h-full overflow-y-auto p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[9px] bg-signal" />
            <span className="font-heading font-bold text-sm">LOGO ICON ONLY</span>
          </div>
          <Link
            href="/admin/clients/create"
            className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        <h2 className="font-heading text-2xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-4">
          {titles[activeTab]}
        </h2>

        <div className="flex flex-wrap gap-2 mb-2">
          {tabs.map((t) => (
            <Link
              key={t.id}
              href={t.href}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors",
                t.id === activeTab
                  ? "border-signal text-signal"
                  : "border-border text-foreground hover:border-signal/50"
              )}
            >
              {t.label}
            </Link>
          ))}
        </div>

        <ActionIllustration />

        {!showPreview ? (
          // Search View
          <div className="space-y-4">
            {activeTab === "online-renew" ? (
              <div className="space-y-6">
                {["SERVER-2", "SERVER-3"].map((server) => (
                  <div key={server} className="space-y-2">
                    <h4 className="font-heading font-bold text-sm">{server}</h4>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        placeholder={`${server} Client's username`}
                        className="flex-1 h-11 px-4 rounded-xl border bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-signal/30"
                      />
                      <Button className="rounded-full font-semibold px-6">Search</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              field && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold">{field.label}</label>
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full h-12 px-4 rounded-xl border bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-signal/30"
                  />
                  {activeTab === "client-date-extend" && (
                    <p className="text-xs text-muted-foreground">Please enter 2 or more characters</p>
                  )}
                </div>
              )
            )}

            {activeTab !== "online-renew" && (
              <Button onClick={handleSearch} className="w-full rounded-full font-semibold mt-4">
                <Search className="w-4 h-4 mr-2" /> Search Client
              </Button>
            )}
          </div>
        ) : (
          // Preview View (সার্চ করার পর)
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-gradient-to-br from-signal-tint to-violet-accent-tint rounded-2xl p-5 border border-signal/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-signal to-violet-accent text-white flex items-center justify-center font-heading font-bold text-xl">
                  {mockClientData.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-heading font-bold text-lg">{mockClientData.name}</h3>
                  <p className="text-xs text-muted-foreground">ID: {mockClientData.id} · @{mockClientData.username}</p>
                </div>
                <span className="bg-emerald-500/20 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                  {mockClientData.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" /> {mockClientData.mobile}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" /> {mockClientData.email}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="w-4 h-4 text-signal" />
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Package</p>
                </div>
                <p className="font-bold text-sm">{mockClientData.package}</p>
              </div>
              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-violet-accent" />
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Balance</p>
                </div>
                <p className="font-bold text-sm text-emerald-600">৳{mockClientData.balance.toFixed(2)}</p>
              </div>
              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Expiry Date</p>
                </div>
                <p className="font-bold text-sm">{mockClientData.expiryDate}</p>
              </div>
              <div className="bg-card border rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-blue-500" />
                  <p className="text-xs text-muted-foreground font-semibold uppercase">Billing Cycle</p>
                </div>
                <p className="font-bold text-sm">{mockClientData.billingCycle}</p>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">Address</p>
              <p className="text-sm">{mockClientData.address}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1 rounded-full font-semibold">
                Back to Search
              </Button>
              <Link href="/admin/clients/general-renew" className="flex-1">
                <Button className="w-full rounded-full font-semibold bg-gradient-to-r from-signal to-violet-accent border-0">
                  Renew Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}