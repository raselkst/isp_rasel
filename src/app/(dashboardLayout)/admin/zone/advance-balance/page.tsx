"use client";

import { ZoneFormShell, ZoneFieldRow } from "@/components/zone/zone-form-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChangeAdvanceBalancePage() {
  return (
    <ZoneFormShell
      title="Change Advance Balance"
      footer={
        <>
          <Button className="rounded-full font-semibold px-10 h-12 text-base">Save</Button>
          <Button variant="outline" className="rounded-full font-semibold px-10 h-12 text-base">
            Cancel
          </Button>
        </>
      }
    >
      <ZoneFieldRow label="Zone Name:">
        <Input value="ID: 53 - Ujan Chor Internet (UCI)" readOnly className="h-12 bg-signal-tint border-signal/40 font-semibold" />
      </ZoneFieldRow>

      <ZoneFieldRow label="OLD Advance Balance:">
        <Input value="0.0" readOnly className="h-12 bg-muted font-bold" />
      </ZoneFieldRow>

      <ZoneFieldRow label="OLD-Balance:">
        <Input value="0.0" readOnly className="h-12 bg-muted font-bold" />
      </ZoneFieldRow>

      <ZoneFieldRow label="New Advance Balance:">
        <Input type="number" placeholder="Enter new advance balance" className="h-12" />
      </ZoneFieldRow>

      <ZoneFieldRow label="Remarks:">
        <div>
          <textarea
            rows={4}
            placeholder="Type here…"
            className="w-full rounded-xl border bg-muted/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-y"
          />
          <p className="text-xs text-signal font-semibold mt-1.5">
            Note: Remarks must be with in 160 Character
          </p>
        </div>
      </ZoneFieldRow>
    </ZoneFormShell>
  );
}