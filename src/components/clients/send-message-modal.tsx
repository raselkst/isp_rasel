"use client";

import { SidePanelModal } from "@/components/billing/side-panel-modal";

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
  return (
    <SidePanelModal
      open={open}
      onClose={onClose}
      onConfirm={onSend}
      title="Send Message"
      confirmLabel="Send"
      exitLabel="Close"
    >
      <div className="space-y-6">
        <div className="space-y-1.5">
          <span className="font-semibold text-sm block">Template</span>
          <select className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm">
            <option>Select</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <span className="font-semibold text-sm block">Message</span>
          <textarea className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm min-h-[110px]" />
        </div>

        <div className="space-y-2">
          <span className="font-semibold text-sm block">Keywords</span>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {keywords.map((k) => (
              <span key={k} className="text-xs text-signal font-medium flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-signal shrink-0" />
                {k}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            ( When balance &gt; 0 then #Due will show 0 )
          </p>
        </div>
      </div>
    </SidePanelModal>
  );
}