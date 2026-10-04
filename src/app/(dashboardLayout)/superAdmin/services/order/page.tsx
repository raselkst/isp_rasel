"use client";

import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { PlanCard } from "@/components/client-portal/plan-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const plans = [
  { name: "Plan 1 (Basic)", price: "Tk 1000" },
  { name: "Plan 2 (Standard)", price: "Tk 1500" },
  { name: "Plan 3 (Premium)", price: "Tk 2000", highlighted: true },
  { name: "Plan 4 (Ultimate)", price: "Tk 2500" },
];

const products = ["ultimateISP", "ISP Log", "Amar WiFi", "My Diagram", "My NMS"];

export default function OrderServicesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">Order New Services</h1>
          <Select defaultValue="">
            <SelectTrigger className="w-64 bg-card">
              <SelectValue placeholder="Choose Product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              features={features}
              highlighted={plan.highlighted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}