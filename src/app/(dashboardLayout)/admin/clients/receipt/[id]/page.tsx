"use client";

import { Printer } from "lucide-react";

const receipt = {
  provider: "Network Service Provider (NSP)",
  address: "43, Joadder Road, Thanapara, Kushtia",
  note: "Null",
  receiptNo: "123456456",
  name: "Salam",
  clientAddress: "Kushtia",
  userLoginId: "dotnet.salam",
  clientId: "10116",
  pkg: "10Mbps_Packages",
  expiryDate: "10/08/2025",
  previousDue: 0,
  billAmount: 500,
  total: 500,
  billAmount2: 500,
  billAmount3: 0,
  receiveDate: "10/07/2025",
  printDate: "24/07/2025",
  printTime: "06:38 PM",
};

function Row({ label, value, bold }: { label: string; value: string | number; bold?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className={bold ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-bold" : "font-semibold"}>{value}</span>
    </div>
  );
}

export default function PaymentReceiptPage() {
  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 print:bg-white print:py-0">
      <div className="max-w-sm mx-auto bg-card border rounded-2xl p-6 print:border-none print:shadow-none">
        <div className="text-center mb-4">
          <h1 className="font-heading font-bold text-base">{receipt.provider}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{receipt.address}</p>
        </div>

        <p className="text-center text-sm font-semibold mb-3">{receipt.note}</p>

        <h2 className="text-center font-heading font-bold text-lg mb-3">Payment Receipt</h2>

        <div className="border-t border-dashed pt-2">
          <Row label="Receipt No:" value={receipt.receiptNo} />
          <Row label="Name:" value={receipt.name} />
          <Row label="Address:" value={receipt.clientAddress} />
          <Row label="User Login ID:" value={receipt.userLoginId} />
          <Row label="Client ID NO:" value={receipt.clientId} />
          <Row label="Internet Package:" value={receipt.pkg} />
          <Row label="Expiry Date:" value={receipt.expiryDate} />
        </div>

        <div className="border-t border-dashed mt-2 pt-2">
          <Row label="Previous Due:" value={receipt.previousDue} />
          <Row label="Bill Amount:" value={receipt.billAmount} />
        </div>

        <div className="border-t border-dashed mt-2 pt-2">
          <Row label="Total:" value={receipt.total} bold />
          <Row label="Bill Amount:" value={receipt.billAmount2} />
          <Row label="Bill Amount:" value={receipt.billAmount3} />
        </div>

        <div className="border-t border-dashed mt-2 pt-2">
          <Row label="Receive Date:" value={receipt.receiveDate} />
        </div>

        <div className="text-center mt-5">
          <p className="font-heading font-bold">Thank You</p>
          <p className="text-xs text-muted-foreground mt-1">Visit Self Service Portal</p>
          <p className="text-xs text-signal font-semibold">Http://Portal.Nspbd.Net</p>
        </div>

        <div className="flex justify-between text-[11px] text-muted-foreground mt-4 pt-3 border-t">
          <span>Print Date: {receipt.printDate}</span>
          <span>Time: {receipt.printTime}</span>
        </div>
      </div>

      <div className="max-w-sm mx-auto mt-4 print:hidden">
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-signal text-signal-foreground font-semibold py-3 text-sm"
        >
          <Printer className="h-4 w-4" />
          Print Receipt
        </button>
      </div>
    </div>
  );
}