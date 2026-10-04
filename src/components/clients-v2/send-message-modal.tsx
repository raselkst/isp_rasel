"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GradientModal } from "@/components/config/gradient-modal";
import { MessageSquareText } from "lucide-react";

interface SendMessageModalProps {
  open: boolean;
  onClose: () => void;
  onSend?: () => void;
}

const keywords = [
  "#Username",
  "#Expiry_date",
  "#Due+Rate",
  "#Int_Ref",
  "#Password",
  "#Rate",
  "#Balance",
  "#Support",
  "#Customer_Id",
  "#Due",
  "#Mobile",
];

export function SendMessageModal({ open, onClose, onSend }: SendMessageModalProps) {
  const [message, setMessage] = useState("");

  return (
    <GradientModal
      open={open}
      onClose={onClose}
      eyebrow="Client · Communication"
      title="Send Message"
      icon={MessageSquareText}
      footer={
        <>
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl font-semibold h-12">
            Close
          </Button>
          <Button
            onClick={onSend}
            className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
          >
            Send
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="space-y-1.5">
          <span className="text-sm font-semibold block">Template</span>
          <select className="w-full border border-border/70 rounded-2xl px-4 py-2.5 bg-muted/30 text-sm">
            <option>Select a template</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold block">Message</span>
            <span className="text-xs text-muted-foreground">{message.length}/160</span>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 160))}
            placeholder="Write your message — tap a keyword below to insert it"
            className="w-full border border-border/70 rounded-2xl px-4 py-2.5 bg-muted/30 text-sm min-h-[110px] outline-none focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card transition-all"
          />
        </div>

        <div>
          <span className="text-sm font-semibold block mb-2">Insert keyword</span>
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((k) => (
              <button
                key={k}
                onClick={() => setMessage((m) => `${m}${m ? " " : ""}${k}`)}
                className="px-3 py-1.5 rounded-full bg-signal-tint text-signal text-xs font-semibold hover:bg-signal/20 transition-colors"
              >
                {k}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            When balance is positive, <code className="text-signal">#Due</code> automatically shows 0.
          </p>
        </div>
      </div>
    </GradientModal>
  );
}