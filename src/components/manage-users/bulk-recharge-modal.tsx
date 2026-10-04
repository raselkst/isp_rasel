"use client";

import { useState } from "react";
import { SidePanelModal } from "@/components/billing/side-panel-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Wallet, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ডামি ইউজার লিস্ট (আসল অ্যাপে API থেকে আসবে)
const users = [
  { id: 335, name: "Sanwar Hossain (Admin)", role: "Admin" },
  { id: 336, name: "Sanwar Hossain Network", role: "POP In-charge" },
  { id: 337, name: "Karim Ali (Reseller)", role: "Reseller" },
  { id: 338, name: "Jamal Uddin", role: "Manager" },
];

export function BulkRechargeModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}) {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");

  const toggleUser = (id: number) => {
    setSelectedUsers((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((u) => u.id));
    }
  };

  return (
    <SidePanelModal
      open={open}
      onClose={onClose}
      title="Bulk Recharge"
      confirmLabel="Recharge Now"
      exitLabel="Cancel"
      onConfirm={() => {
        if (selectedUsers.length > 0 && amount) {
          onSubmit?.();
          onClose();
        }
      }}
    >
      <p className="text-sm text-muted-foreground -mt-4 mb-4">
        Add balance to multiple users at once.
      </p>

      {/* Selected Count Alert */}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-signal/10 border border-signal/20 mb-4">
        <Users className="h-4 w-4 text-signal" />
        <span className="text-sm font-semibold text-signal">
          {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""} selected
        </span>
      </div>

      {/* User Selection List */}
      <div className="space-y-1.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-semibold">Select Users</Label>
          <button
            onClick={toggleAll}
            className="text-xs font-bold text-signal hover:underline"
          >
            {selectedUsers.length === users.length ? "Deselect All" : "Select All"}
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
          {users.map((user) => {
            const isSelected = selectedUsers.includes(user.id);
            return (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all text-left",
                  isSelected
                    ? "border-signal bg-signal/5"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0",
                      isSelected
                        ? "bg-signal text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {user.role} • ID: {user.id}
                    </p>
                  </div>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                    isSelected ? "border-signal bg-signal" : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount Input */}
      <div className="space-y-1.5 mb-4">
        <Label htmlFor="bulk-amount" className="text-sm font-semibold">
          Recharge Amount (per user)
        </Label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-muted-foreground">
            ৳
          </span>
          <Input
            id="bulk-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="pl-10 h-12 text-lg font-bold rounded-xl"
          />
        </div>
        {amount && selectedUsers.length > 0 && (
          <p className="text-xs text-muted-foreground mt-1">
            Total: <span className="font-bold text-signal">
              ৳{(Number(amount) * selectedUsers.length).toLocaleString()}
            </span>{" "}
            for {selectedUsers.length} users
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-1.5 mb-4">
        <Label className="text-sm font-semibold">Payment Method</Label>
        <Select value={method} onValueChange={setMethod}>
          <SelectTrigger className="h-11 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="bkash">bKash</SelectItem>
            <SelectItem value="nagad">Nagad</SelectItem>
            <SelectItem value="bank">Bank Transfer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-xs text-amber-700 leading-relaxed">
          This action cannot be undone. Please verify the amount and selected users before
          proceeding.
        </p>
      </div>
    </SidePanelModal>
  );
}