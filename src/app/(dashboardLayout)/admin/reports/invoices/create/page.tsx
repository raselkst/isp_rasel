"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Calendar,
  User,
  FileText,
  Save,
  ArrowLeft,
  Receipt,
  DollarSign,
  Package,
  Hash,
  Percent,
} from "lucide-react";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export default function CreateInvoicePage() {
  const router = useRouter();
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: number, field: keyof LineItem, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updated.amount = updated.quantity * updated.rate;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        {/* 🎯 Sticky Header Bar */}
        <div className="border-b bg-gradient-to-r from-card via-card/80 to-muted/20 backdrop-blur-md sticky top-[64px] z-30">
          <div className="px-4 sm:px-8 py-3 flex items-center justify-between gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-card border border-border text-muted-foreground hover:text-foreground hover:shadow-md transition-all">
                <Save className="h-4 w-4" />
                Save Draft
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-105 transition-all">
                <Plus className="h-4 w-4" />
                Create Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
              Create New
            </p>
            <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              New Invoice
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Customer & Invoice Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Details Card */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-signal" />
                  Invoice Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      <Hash className="h-3.5 w-3.5" /> Invoice No.
                    </Label>
                    <Input placeholder="Auto-generated" readOnly className="bg-muted/40 font-mono" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Invoice Date
                    </Label>
                    <div className="relative">
                      <Input type="date" className="pr-9" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Due Date
                    </Label>
                    <div className="relative">
                      <Input type="date" className="pr-9" />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold flex items-center gap-1">
                      <Receipt className="h-3.5 w-3.5" /> Status
                    </Label>
                    <Select defaultValue="unpaid">
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-card rounded-2xl border p-6">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-violet-500" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Customer Name</Label>
                    <Input placeholder="Enter customer name" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-sm font-semibold">Phone Number</Label>
                    <Input placeholder="01XXXXXXXXX" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-sm font-semibold">Email Address</Label>
                    <Input placeholder="customer@example.com" />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-sm font-semibold">Billing Address</Label>
                    <Input placeholder="Enter full address" />
                  </div>
                </div>
              </div>

              {/* Line Items Card */}
              <div className="bg-card rounded-2xl border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-bold flex items-center gap-2">
                    <Package className="h-5 w-5 text-emerald-500" />
                    Line Items
                  </h3>
                  <button
                    onClick={addItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-xl bg-muted/30">
                      <div className="col-span-12 sm:col-span-4 space-y-1.5">
                        <Label className="text-xs font-semibold">Description</Label>
                        <Input
                          placeholder="Item description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-1.5">
                        <Label className="text-xs font-semibold">Qty</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-1.5">
                        <Label className="text-xs font-semibold">Rate</Label>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-4 sm:col-span-2 space-y-1.5">
                        <Label className="text-xs font-semibold">Amount</Label>
                        <Input value={item.amount} readOnly className="bg-muted/50 font-bold text-signal" />
                      </div>
                      <div className="col-span-12 sm:col-span-2 flex justify-end">
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={items.length === 1}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border p-6 sticky top-24">
                <h3 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-amber-500" />
                  Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Percent className="h-3 w-3" /> Tax (5%)
                    </span>
                    <span className="font-semibold">৳{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-heading text-2xl font-bold text-signal">
                      ৳{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 mt-6">
                  <Label className="text-sm font-semibold">Notes</Label>
                  <textarea
                    placeholder="Additional notes…"
                    className="w-full min-h-[80px] p-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none"
                  />
                </div>

                <button className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-[1.02] transition-all">
                  <Save className="h-4 w-4" />
                  Save & Create Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}