"use client";

import { ClientTopbar } from "@/components/client-panel/client-topbar";
import { PlanCard } from "@/components/client-portal/plan-card";

const plans = [
  {
    name: "Basic Plan",
    price: "$500",
    features: [
      "Speed: Up to 30 Mbps",
      "Data Limit: 200 GB/month",
      "Support: Email support",
      "No setup fees",
      "Reliable connection",
      "Stable internet access",
      "Consistent connectivity",
      "Dependable online service",
      "Steady network performance",
      "Uninterrupted internet service",
      "Robust connection quality",
    ],
  },
  {
    name: "Standard Plan",
    price: "$999",
    features: [
      "Speed: Up to 35 Mbps",
      "Data Limit: 250 GB/month",
      "Support: 24/7 email and chat support",
      "No installation fees",
      "Consistent and reliable connection",
      "Seamless internet access throughout your home",
      "Stable and dependable connectivity",
      "Trusted online service with excellent reviews",
      "High-performance network reliability",
      "Continuous internet service without interruptions",
      "Exceptional connection quality for all devices",
    ],
  },
  {
    name: "Premium Plan",
    price: "$1499",
    highlighted: true,
    features: [
      "Speed: Up to 50 Mbps",
      "Data Limit: 500 GB/month",
      "Support: 24/7 live chat support",
      "No installation charges",
      "High-speed connection guaranteed",
      "Seamless internet access",
      "Reliable and consistent connectivity",
      "Trusted online service provider",
      "Exceptional network performance",
      "Continuous internet availability",
      "Superior connection quality",
    ],
  },
  {
    name: "Ultimate Plan",
    price: "$9999",
    features: [
      "Speed: Up to 35 Mbps",
      "Data Limit: 300 GB/month",
      "Support: 24/7 customer support",
      "No installation charges",
      "Consistent and reliable connection",
      "Seamless internet access throughout your home",
      "Stable and dependable connectivity",
      "Trusted online service provider",
      "Exceptional network performance",
      "Continuous internet availability",
      "Superior connection quality for all devices",
    ],
  },
];

export default function ClientOrderServicesPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ClientTopbar />

      <div className="px-8 py-8">
        <h1 className="font-heading text-[26px] font-bold tracking-tight mb-6">Order New Services</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              features={plan.features}
              highlighted={plan.highlighted}
            />
          ))}
        </div>
      </div>
    </div>
  );
}