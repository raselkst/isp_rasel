"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { SidePanelModal } from "@/components/billing/side-panel-modal";
import { ExpiryRing } from "@/components/clients-v2/expiry-ring";
import { SignalBars, InfoRow, InfoCard } from "@/components/clients-v2/info-card";
import { QuickAction } from "@/components/clients-v2/quick-action";
import { cn } from "@/lib/utils";
import {
  Phone,
  MessageCircle,
  RefreshCw,
  Wallet,
  Ban,
  FileText,
  Ticket as TicketIcon,
  Pencil,
  MapPin,
  Calendar,
  Hash,
  Wifi,
  Server,
  KeyRound,
  Cpu,
  Router,
  Radio,
  Gauge,
  Ruler,
} from "lucide-react";

export default function ClientInformationPage() {
  const [suspended, setSuspended] = useState(false);
  const [bound, setBound] = useState(true);
  const [pingOpen, setPingOpen] = useState(false);

  const pingRows = Array.from({ length: 5 }).map((_, i) => ({
    sl: (i + 1).toString().padStart(2, "0"),
    ip: "172.16.11.116",
    byte: 32,
    time: ["2ms858us", "1ms406us", "2ms790us", "2ms91us", "2ms937us"][i],
    ttl: 64,
  }));

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-6xl mx-auto space-y-6">
          {/* ---------- HERO ---------- */}
          <div
            className={cn(
              "relative overflow-hidden rounded-[32px] p-7 sm:p-8 text-white bg-gradient-to-br",
              suspended ? "from-destructive via-destructive/80 to-caution" : "from-signal via-signal to-violet-accent"
            )}
          >
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-10 -bottom-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
              {/* identity */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30 shrink-0 text-2xl font-heading font-bold">
                  ML
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-heading text-2xl font-bold truncate">Md.Lipu Vai</h1>
                    <span
                      className={cn(
                        "flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-white/20",
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", suspended ? "bg-white" : "bg-white animate-pulse")} />
                      {suspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                  <p className="text-white/75 text-sm mt-0.5">Client ID 585831 · Chadot</p>
                  <div className="flex items-center gap-3 mt-2 text-white/85 text-sm">
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" /> 01711010341
                    </span>
                    <button className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25">
                      <MessageCircle className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* expiry ring */}
              <div className="flex items-center gap-3 lg:ml-auto">
                <ExpiryRing daysLeft={9} />
                <div className="text-sm">
                  <p className="text-white/70 text-xs">Plan expires</p>
                  <p className="font-bold">15 Dec 2024, 06:00</p>
                  <p className="text-white/70 text-xs mt-0.5">500Tk @ 10Mb / 30Day</p>
                </div>
              </div>
            </div>

            {/* quick actions */}
            <div className="relative flex items-center gap-5 mt-7 overflow-x-auto pb-1">
              <QuickAction icon={RefreshCw} label="Renew" />
              <QuickAction icon={Wallet} label="Cash Receive" />
              <QuickAction icon={FileText} label="Invoices" />
              <QuickAction icon={Pencil} label="Edit Info" />
              <QuickAction icon={TicketIcon} label="Ticket" />
              <QuickAction icon={Wallet} label="Payment Report" />
              <div className="ml-auto shrink-0">
                <button
                  onClick={() => setSuspended((s) => !s)}
                  className="flex items-center gap-1.5 text-xs font-bold px-4 py-2.5 rounded-full bg-white text-signal hover:opacity-90 transition-opacity"
                >
                  <Ban className="h-3.5 w-3.5" />
                  {suspended ? "Reactivate Client" : "Suspend Client"}
                </button>
              </div>
            </div>
          </div>

          {/* ---------- BENTO INFO GRID ---------- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <InfoCard icon={MapPin} title="Account">
              <InfoRow icon={MapPin} label="Zone / Sub Zone" value="Siam_Ali" />
              <InfoRow icon={Calendar} label="Joined" value="05 Dec 2024" />
              <InfoRow icon={Calendar} label="Last updated" value="12 Dec 2024" />
              <InfoRow icon={Hash} label="Notes" value="—" />
            </InfoCard>

            <InfoCard
              icon={Wallet}
              title="Billing"
              action={
                <button className="text-xs font-bold text-signal hover:underline">Change plan</button>
              }
            >
              <InfoRow icon={Wifi} label="Protocol" value="PPPoE" />
              <InfoRow
                icon={Wallet}
                label="Balance"
                value="৳0"
                valueClass="text-success"
              />
              <InfoRow icon={Calendar} label="Billing cycle" value="Day 1 · Prepaid" />
              <InfoRow icon={Server} label="Owner" value="Ar-internet-online" />
            </InfoCard>

            <InfoCard
              icon={Router}
              title="Network"
              action={
                <button
                  onClick={() => setPingOpen(true)}
                  className="text-xs font-bold text-signal hover:underline"
                >
                  Ping
                </button>
              }
            >
              <InfoRow icon={Server} label="Server" value="AR_Internet_Siam_410" />
              <InfoRow icon={KeyRound} label="Username" value="Lipu" />
              <InfoRow
                icon={Cpu}
                label="MAC binding"
                value={bound ? "Bound to 50:0F:F5:EB:80:80" : "Not bound"}
                action={
                  <button
                    onClick={() => setBound((b) => !b)}
                    className={cn(
                      "text-[10px] font-bold px-2.5 py-1 rounded-full",
                      bound ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {bound ? "Bound" : "Unbound"}
                  </button>
                }
              />
              <InfoRow icon={Radio} label="IP Address" value="10.10.5.254" valueClass="text-signal" />
            </InfoCard>
          </div>

          {/* ---------- ONU strip ---------- */}
          <div className="rounded-[28px] bg-card border shadow-sm p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center">
                <Gauge className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-heading font-bold">ONU Signal</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">OLT</p>
                <p className="text-sm font-semibold text-success">AR_INTERNET_VSOL</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">PON / VLAN</p>
                <p className="text-sm font-semibold">3/24 · V410</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1">
                  <Ruler className="h-3 w-3" /> Distance
                </p>
                <p className="text-sm font-semibold">0M</p>
              </div>
              <div>
                <p className="text-[11px] text-muted-foreground mb-1">Optical Power</p>
                <div className="flex items-center gap-2">
                  <SignalBars dbm={-19.59} />
                  <span className="text-sm font-semibold text-success">-19.59dBm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SidePanelModal
        open={pingOpen}
        onClose={() => setPingOpen(false)}
        title="Ping Result"
        confirmLabel="Cancel"
        singleButton
      >
        <div className="rounded-xl overflow-hidden border -mx-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-signal text-signal-foreground">
                {["SL", "IP", "Byte", "Time", "TTL"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-semibold text-xs">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pingRows.map((r) => (
                <tr key={r.sl} className="border-t">
                  <td className="px-4 py-3">{r.sl}</td>
                  <td className="px-4 py-3 font-mono">{r.ip}</td>
                  <td className="px-4 py-3 font-mono">{r.byte}</td>
                  <td className="px-4 py-3 font-mono">{r.time}</td>
                  <td className="px-4 py-3 font-mono">{r.ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SidePanelModal>
    </div>
  );
}