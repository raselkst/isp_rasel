"use client";

import { ClientTopbar } from "@/components/client-panel/client-topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccountDetailsPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ClientTopbar />

      <div className="px-8 py-8">
        <h1 className="font-heading text-[26px] font-bold tracking-tight mb-6">Account Details</h1>

        <div className="bg-card rounded-2xl border p-8 max-w-4xl">
          <h2 className="font-heading font-bold text-lg mb-6">Your Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">First Name</label>
              <Input placeholder="Enter first name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Address 1</label>
              <Input placeholder="Enter Address" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Last Name</label>
              <Input placeholder="Enter last name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Address 2</label>
              <Input placeholder="Enter Address" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Company Name</label>
              <Input placeholder="Enter company name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">City</label>
              <Input placeholder="Enter city name" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Email Address</label>
              <Input placeholder="Enter email" type="email" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">State</label>
              <Input placeholder="Enter state" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Payment Method</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Direct Bank Transfer</SelectItem>
                  <SelectItem value="mobile">Mobile Banking</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Zip code</label>
              <Input placeholder="Enter code" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Billings Contact</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select Protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Country</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bd">Bangladesh</SelectItem>
                  <SelectItem value="us">United States</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <Button className="rounded-full font-semibold px-8">Save Changes</Button>
            <Button variant="outline" className="rounded-full font-semibold px-8">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}