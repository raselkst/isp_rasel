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
import {
  Bold,
  Italic,
  Heading,
  Link2,
  List,
  ListOrdered,
  ListChecks,
  MessageSquare,
  Eye,
  Plus,
} from "lucide-react";

export default function OpenTicketPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <ClientTopbar />

      <div className="px-8 py-8">
        <h1 className="font-heading text-[26px] font-bold tracking-tight mb-6">ISP Ticket Network</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
          <div className="bg-card rounded-2xl border p-6">
            <h3 className="font-heading font-bold text-lg mb-4">Tickets information</h3>
            <dl className="space-y-4 text-sm">
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Ticket Serial</dt>
                <dd className="font-semibold">3767485</dd>
                <button className="mt-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-signal text-signal-foreground">
                  Buy this ticket
                </button>
                <span className="ml-2 text-xs text-muted-foreground">1 months ago</span>
              </div>
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Department</dt>
                <dd className="font-semibold">Technical support</dd>
              </div>
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Closed</dt>
                <dd className="font-semibold">April 10, 2023, at 3:45 PM</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1">Status</dt>
                <dd className="mt-1">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-signal-tint text-signal">
                    Active ticket
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-card rounded-2xl border p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Name</label>
                <Input placeholder="Enter name" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Email address</label>
                <Input placeholder="Enter address" type="email" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Subject</label>
              <Input placeholder="Write your subject" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Department</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Related Service</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="plan1">Plan 1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold">Priority</label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Message</label>
              <div className="border rounded-xl overflow-hidden">
                <div className="flex items-center gap-1 px-3 py-2 border-b bg-muted/30">
                  {[Bold, Italic, Heading, Link2, List, ListOrdered, ListChecks, MessageSquare].map((Icon, i) => (
                    <button
                      key={i}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-signal hover:bg-signal-tint"
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  ))}
                  <div className="flex-1" />
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-signal px-2">
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                </div>
                <textarea
                  rows={8}
                  className="w-full px-4 py-3 text-sm outline-none resize-none"
                  placeholder="Describe the issue…"
                />
                <div className="flex items-center justify-between px-4 py-2.5 border-t bg-muted/20 text-xs text-muted-foreground">
                  <span>Line: 0 &nbsp;&nbsp; Words: 0</span>
                  <Button size="sm" className="rounded-full font-semibold px-6">
                    Save
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Attachments</label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer">
                  <span className="inline-block px-4 py-2.5 rounded-full border bg-signal-tint text-signal text-sm font-semibold">
                    Browse file
                  </span>
                  <input type="file" className="hidden" />
                </label>
                <span className="text-sm text-muted-foreground">No file chosen</span>
                <div className="flex-1" />
                <button className="flex items-center gap-1.5 text-sm font-semibold text-signal">
                  <Plus className="h-4 w-4" />
                  Add More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}