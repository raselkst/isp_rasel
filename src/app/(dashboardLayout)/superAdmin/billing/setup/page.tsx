"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { CategorySidebar } from "@/components/client-portal/category-sidebar";
import { OrderSummary } from "@/components/client-portal/order-summary";
import { ChevronUp, ChevronDown } from "lucide-react";

const categories = ["ultimateISP", "ISP Log", "Amar WiFi", "My Diagram", "My NMS"];

const features = [
  "All Modules",
  "All Features",
  "No Need Real IP",
  "Upto 1 Mikrotik Server",
  "Upto 300 Active Customers",
  "ONU Laser Check Not Available",
  "aamarPay, shurjoPay Gateway",
  "Payment Webhook Not Available",
  "PPPoE Session Log Not Available",
  "Customer Portal Not Available",
  "Custom Domain Not Available",
  "Free Mikrotik Basic Support",
  "New Features Requests",
];

export default function SetUpBillingPage() {
  const router = useRouter();
  const [months, setMonths] = useState(1);
  const monthlyRate = 6590;

  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 py-8">
        <h1 className="font-heading text-[26px] font-bold tracking-tight mb-6">
          Generate Invoices
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          <CategorySidebar categories={categories} active={categories[0]} onSelect={() => {}} />

          <div>
            <h2 className="font-heading text-xl font-bold mb-1">Set Up Billing</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Select your billing preferences and proceed to finalize your order.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-5 items-start">
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading font-bold text-lg mb-4">Plan 1 (Basic)</h3>
                <ul className="space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="text-[13px] text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-signal mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <OrderSummary
                planName="Plan 1 (Basic)"
                features={["All Modules", "All Features", "No Need Real IP", "Upto 1 Mikrotik Server"]}
                setupFee="00TK"
                monthlyFee="1000TK"
                total="1000TK"
                ctaLabel="Continue"
                onCta={() => router.push("/super-admin/billing/checkout")}
              />
            </div>

            <div className="mt-5 bg-signal-tint rounded-2xl px-6 py-4 flex items-center justify-between">
              <span className="font-heading font-bold text-lg">
                {months} Month Price - {(monthlyRate * months).toLocaleString()}.00BDT
              </span>
              <div className="flex flex-col border rounded-lg overflow-hidden bg-card">
                <button
                  onClick={() => setMonths((m) => Math.min(m + 1, 24))}
                  className="px-2 py-1 hover:bg-muted"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setMonths((m) => Math.max(m - 1, 1))}
                  className="px-2 py-1 hover:bg-muted border-t"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}