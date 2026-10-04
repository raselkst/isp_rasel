"use client";

import Link from "next/link";
import { AccountShell } from "@/components/client-portal/account-shell";

export default function PaymentMethodsPage() {
  return (
    <AccountShell
      breadcrumbs={[
        { label: "Portal Home", href: "/super-admin" },
        { label: "Client Area", href: "/account/details" },
        { label: "My Details", href: "/account/details" },
        { label: "Payment Methods" },
      ]}
    >
      <h1 className="font-heading text-2xl font-bold mb-2">Payment Methods</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Add overview of your payment methods and settings.
      </p>

      <Link
        href="/account/payment-methods/add"
        className="inline-block rounded-full bg-signal text-signal-foreground font-semibold px-6 py-3 text-sm hover:opacity-90 transition-opacity mb-8"
      >
        Add New Credit Card
      </Link>

      <div className="border rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 bg-muted/40 px-5 py-3 text-sm font-semibold">
          <span>Name</span>
          <span>Description</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">
          No payment methods have been created yet
        </div>
      </div>
    </AccountShell>
  );
}