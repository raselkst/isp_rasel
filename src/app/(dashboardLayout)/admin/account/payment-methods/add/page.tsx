"use client";

import { AccountShell } from "@/components/client-portal/account-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export default function AddPaymentMethodPage() {
  return (
    <AccountShell
      breadcrumbs={[
        { label: "Portal Home", href: "/super-admin" },
        { label: "Client Area", href: "/account/details" },
        { label: "My Details", href: "/account/details" },
        { label: "Payment Methods", href: "/account/payment-methods" },
        { label: "Add New Payment Method" },
      ]}
    >
      <h1 className="font-heading text-2xl font-bold mb-6">Add New Payment Method</h1>

      <div className="space-y-6 max-w-2xl">
        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-semibold">Type</label>
          <span className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-signal" />
            Visa / Master card / Others (Card Payment)
          </span>
        </div>

        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-semibold">Description</label>
          <div className="relative">
            <Input placeholder="" className="pr-24" />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              (Optional)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-semibold">Card Number</label>
          <Input placeholder="1234 1234 1234 1234" />
        </div>

        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-semibold">Expiry Date</label>
          <Input placeholder="MM / YY" className="max-w-[160px]" />
        </div>

        <div className="grid grid-cols-[140px_1fr] items-center gap-4">
          <label className="text-sm font-semibold">CVV/CVC2</label>
          <div className="flex items-center gap-4">
            <Input placeholder="CVC" className="max-w-[160px]" />
            <a href="#" className="text-sm text-signal font-semibold hover:underline">
              Where do I find this?
            </a>
          </div>
        </div>

        <div className="grid grid-cols-[140px_1fr] items-start gap-4">
          <label className="text-sm font-semibold pt-1">Billing Address</label>
          <div className="space-y-3">
            <span className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-signal" />
              Md. Sanwar Hos Ain 43 WH Road, Kushtia, Kushtia, Khulna, 7000, BD
            </span>
            <Button variant="outline" className="rounded-lg font-semibold">
              Add a new address
            </Button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button className="rounded-full font-semibold px-8">Save Changes</Button>
          <Button variant="outline" className="rounded-full font-semibold px-8">
            Cancel
          </Button>
        </div>
      </div>
    </AccountShell>
  );
}