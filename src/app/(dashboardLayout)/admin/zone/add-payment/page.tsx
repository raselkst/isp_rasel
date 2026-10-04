"use client";

import { ZoneFormShell, ZoneFieldRow } from "@/components/zone/zone-form-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddZonePaymentPage() {
  return (
    <ZoneFormShell
      title="Add Payment: Zone/Sub-Zone"
      footer={
        <>
          <Button className="rounded-full font-semibold px-10 h-12 text-base">Save</Button>
          <Button variant="outline" className="rounded-full font-semibold px-10 h-12 text-base">
            Reset
          </Button>
        </>
      }
    >
      <ZoneFieldRow label="Name:">
        <Input value="ID: 53 - Ujan Chor Internet (UCI)" readOnly className="h-12 bg-signal-tint border-signal/40 font-semibold" />
      </ZoneFieldRow>

      <ZoneFieldRow label="Amount:">
        <Input type="number" placeholder="Enter amount" className="h-12" />
      </ZoneFieldRow>

      <ZoneFieldRow label="Payment Type:">
        <Select>
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bkash">bKash</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </ZoneFieldRow>

      <ZoneFieldRow label="Money Receipt No:">
        <Input placeholder="Enter receipt number" className="h-12" />
      </ZoneFieldRow>

      <ZoneFieldRow label="Remarks:">
        <textarea
          rows={4}
          placeholder="Type here…"
          className="w-full rounded-xl border bg-muted/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-y"
        />
      </ZoneFieldRow>
    </ZoneFormShell>
  );
}