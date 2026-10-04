"use client";

import { useState } from "react";
import { ClientTopbar } from "@/components/client-panel/client-topbar";
import { Star, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ViewTicketPage() {
  const [rating, setRating] = useState(4);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="min-h-screen bg-muted/30">
      <ClientTopbar />

      <div className="px-8 py-8">
        <h1 className="font-heading text-[26px] font-bold tracking-tight mb-6">
          Network Connectivity Issue
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5 items-start">
          <div className="bg-card rounded-2xl border p-6">
            <h3 className="font-heading font-bold text-lg mb-4">Tickets information</h3>
            <dl className="space-y-4 text-sm">
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Requestor</dt>
                <dd className="font-semibold">Md. Sanwar hos ain</dd>
                <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-signal text-signal-foreground">
                  Authorised user
                </span>
              </div>
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Department</dt>
                <dd className="font-semibold">Technical support</dd>
              </div>
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Sumitted</dt>
                <dd className="font-semibold">April 10, 2023, at 3:45 PM</dd>
              </div>
              <div className="border-b pb-3">
                <dt className="text-muted-foreground mb-1">Last updated</dt>
                <dd className="font-semibold">3 months ago</dd>
              </div>
              <div>
                <dt className="text-muted-foreground mb-1">Status/Priority</dt>
                <dd className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-signal-tint text-signal">
                    Answered
                  </span>
                  <span className="text-sm font-semibold">High</span>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="bg-signal-tint px-6 py-3.5 flex items-center justify-between">
              <span className="font-heading font-bold text-signal">Reply</span>
              <button className="w-7 h-7 rounded-full flex items-center justify-center text-signal hover:bg-signal/10">
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-gradient-to-br from-signal to-violet-accent" />
                  <span className="font-heading font-bold">ISP ( Operator )</span>
                </div>
                <span className="text-sm text-muted-foreground">April 10, 2023, at 3:45 PM</span>
              </div>

              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p className="font-heading font-bold text-foreground text-base">Dear Valued Customer,</p>
                <p>
                  We understand that navigating your service can sometimes be challenging, and we
                  want to assure you that our dedicated support team is here to assist you. Whether
                  you have questions or need help with any aspect of your service, our knowledgeable
                  representatives are always available to provide guidance and support.
                </p>
                <p>
                  We are committed to making your experience with our internet service provider as
                  smooth and enjoyable as possible. Your satisfaction is our utmost priority, and we
                  are dedicated to addressing any issues you may face in a timely and efficient
                  manner. Please feel free to reach out to us anytime; we are here to support you at
                  every step of your journey.
                </p>
              </div>

              <div className="flex items-center gap-1 mt-6">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star
                      className={cn(
                        "h-5 w-5 transition-colors",
                        (hoverRating || rating) >= n
                          ? "fill-caution text-caution"
                          : "text-muted-foreground/40"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}