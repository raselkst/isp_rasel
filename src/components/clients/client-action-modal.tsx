"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Pencil, Zap, Send, FileText, FileSignature, RefreshCw, ArrowRightLeft,
  Receipt, MapPin, UserX, BarChart3, Link2, XCircle, Phone, MessageCircle,
  Database, TrendingUp, Search, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ClientActionTab =
  | "general-renew"
  | "view-information"
  | "client-search"
  | "plan-migration"
  | "online-renew"
  | "client-date-extend"
  | "special-renew";

// 🎯 ডায়নামিক Client Data Generator
function generateClientData(clientId: string) {
  if (!clientId) return null;

  const hash = clientId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);

  const firstNames = ["Md. Tarequl", "Rahim", "Karim", "Jamal", "Sultana", "Rafiq", "Nasir", "Shorup", "Nusrat", "Sabbir"];
  const lastNames = ["Islam", "Ahmed", "Uddin", "Hossain", "Begum", "Khan", "Ali", "Rahman", "Akter", "Chowdhury"];

  const firstName = firstNames[hash % firstNames.length];
  const lastName = lastNames[(hash * 3) % lastNames.length];

  const packages = ["5Mbps", "8Mbps", "10Mbps", "12Mbps", "15Mbps", "20Mbps", "25Mbps", "30Mbps"];
  const protocols = ["PPPOE", "HOTSPOT", "STATIC"];
  const servers = ["Poli Network", "ZS Cable Network", "AR Internet", "Online Network", "Sky Net"];
  const zones = ["Khoksa Thanapara", "Mirpur", "Uttara", "Dhanmondi", "Banani", "Gulshan"];
  const billingStatuses = ["Active", "Expired", "Suspended"];
  const serverStatuses = ["Online", "Offline"];
  const connectedByList = ["Poli Network Pop", "ZS Cable Network", "AR Internet Pop", "Online Network Pop"];

  const pkg = packages[hash % packages.length];
  const protocol = protocols[hash % protocols.length];
  const server = servers[(hash * 2) % servers.length];
  const zone = zones[(hash * 4) % zones.length];
  const billingStatus = billingStatuses[(hash * 5) % billingStatuses.length];
  const serverStatus = serverStatuses[(hash * 6) % serverStatuses.length];
  const connectedBy = connectedByList[(hash * 7) % connectedByList.length];

  const updateDate = `0${(hash % 9) + 1}/0${(hash % 9) + 1}/${24 + (hash % 3)}`;
  const joinDate = `1${hash % 9}/${(hash % 12) + 1}/2${(hash % 4) + 2}`;

  const macHex = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  const saveMac = `00:${macHex(hash % 256)}:${macHex((hash * 2) % 256)}:${macHex((hash * 3) % 256)}:AD:D4:7A`;

  const mobileNo = `017${(hash * 3) % 10}${(hash * 5) % 10}${(hash * 7) % 10}${(hash * 11) % 10}${(hash * 13) % 10}${(hash * 17) % 10}${(hash * 19) % 10}${(hash * 23) % 10}`;

  const nidNo = `${(hash * 100) + 730000000}`.slice(0, 10);

  const expiryDate = `0${(hash % 9) + 1}-0${(hash % 9) + 1}-202${(hash % 6) + 4} ${(hash % 12) + 10}:${(hash % 60).toString().padStart(2, "0")}`;

  const balance = (hash % 5) * 100;

  return {
    clientId: clientId,
    name: `${firstName} ${lastName}`,
    address: `${zone}, Bangladesh`,
    mobileNo: mobileNo,
    email: `${clientId}@isp.net`,
    nidNo: nidNo,
    dob: `${(hash % 28) + 1}/0${(hash % 9) + 1}/19${70 + (hash % 30)}`,
    zone: zone,
    subZone: "—",
    notes: "—",
    update: updateDate,
    join: joinDate,

    protocolType: protocol,
    packagePlan: pkg,
    balance: String(balance),
    planPrice: String(300 + (hash % 8) * 100),
    addLess: "0",
    billingCycle: "Monthly",
    bill: String(300 + (hash % 8) * 100),
    billingType: "Prepaid",
    billingStatus: billingStatus,
    disabledStatus: billingStatus === "Expired" ? "Disabled" : billingStatus === "Suspended" ? "Suspended" : "Enabled",
    expiryDate: expiryDate,
    connectedBy: connectedBy,
    location: "—",

    server: server,
    username: `user.${clientId.slice(-6)}`,
    password: `${1000 + (hash % 9000)}`,
    saveMac: saveMac,
    deviceVendor: "-",
    activeMac: "-",
    ipAddress: `10.${hash % 255}.${(hash * 2) % 255}.${(hash * 3) % 255}`,
    uptime: serverStatus === "Online" ? `${(hash % 24)}h ${(hash % 60)}m` : "-",
    lastLogout: `0${(hash % 9) + 1}-0${(hash % 9) + 1}-202${(hash % 6) + 4} 12:00 AM`,
    dataUsed: `${(hash * 100) % 5000}MB`,
    serverStatus: serverStatus,
  };
}

// 🎯 Info Row
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start border-b border-slate-200 last:border-b-0">
      <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
        {label}
      </div>
      <div className="flex-1 px-3 py-2 text-xs font-semibold text-signal break-all">
        {value}
      </div>
    </div>
  );
}

// 🎯 Action Button
function ActionBtn({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
}: {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  variant?: "outline" | "primary" | "success" | "warning" | "danger";
}) {
  const styles = {
    outline: "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-signal/30 hover:text-signal",
    primary: "bg-signal text-white border border-signal hover:bg-signal-hover",
    success: "bg-success-tint text-success border border-success/30 hover:bg-success/20",
    warning: "bg-warning-tint text-warning border border-warning/30 hover:bg-warning/20",
    danger: "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20",
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all whitespace-nowrap",
        styles[variant]
      )}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

interface ClientActionModalProps {
  activeTab: ClientActionTab;
  initialClientId?: string | null;
}

export function ClientActionModal({ activeTab, initialClientId }: ClientActionModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  // 🎯 URL থেকে clientId এলে অটো সার্চ
  useEffect(() => {
    if (initialClientId && initialClientId.trim()) {
      setSearchTerm(initialClientId);
      setShowInfo(true);
    }
  }, [initialClientId]);

  // 🎯 Dynamic client data
  const clientData = useMemo(
    () => generateClientData(searchTerm || initialClientId || ""),
    [searchTerm, initialClientId]
  );

  const showToast = (msg: string) => alert(msg);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      alert("Please enter a Client ID");
      return;
    }
    setShowInfo(true);
  };

  const handleBack = () => {
    setShowInfo(false);
    setSearchTerm("");
  };

  // ═══════════════════════════════════════════════════════════
  // SEARCH VIEW
  // ═══════════════════════════════════════════════════════════
  if (!showInfo || !clientData) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <label className="text-sm font-semibold text-signal block mb-2">
          Client ID / Username / Mobile No
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. 282941"
            className="flex-1 h-11 px-4 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-signal/30 focus:border-signal text-signal"
          />
          <button
            onClick={handleSearch}
            className="flex items-center gap-1.5 px-6 h-11 rounded-lg bg-signal text-white text-sm font-bold hover:bg-signal-hover transition-colors shadow-md"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Enter the Client ID to view complete information
        </p>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // INFORMATION VIEW (3-Column Grid)
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-signal transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Search
      </button>

      {/* Client ID Banner */}
      <div className="bg-signal-tint border border-signal/20 rounded-lg px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-signal">Viewing Client:</span>
          <span className="text-sm font-bold text-signal">{clientData.clientId}</span>
        </div>
        <span className="text-xs text-slate-500">{clientData.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* COLUMN 1: ACCOUNT INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-signal-tint border-b border-signal/20 px-4 py-2.5 text-center">
            <h2 className="font-heading font-bold text-sm text-signal">
              Account Information
            </h2>
          </div>

          <div>
            <InfoRow label="Client ID:" value={clientData.clientId} />
            <InfoRow label="Name:" value={clientData.name} />
            <InfoRow label="Address:" value={clientData.address} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Mobile No:
              </div>
              <div className="flex-1 px-3 py-2 flex items-center gap-2">
                <span className="text-xs font-semibold text-signal">{clientData.mobileNo}</span>
                <MessageCircle className="w-3.5 h-3.5 text-success" />
                <Phone className="w-3.5 h-3.5 text-success" />
              </div>
            </div>
            <InfoRow label="Email:" value={clientData.email} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                NID No:
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-[55%] px-3 py-2 text-xs font-semibold text-signal border-r border-slate-200">
                  {clientData.nidNo}
                </div>
                <div className="px-3 py-2 text-[10px] text-slate-500 uppercase">
                  DOB: <span className="font-semibold text-signal">{clientData.dob}</span>
                </div>
              </div>
            </div>
            <InfoRow label="Zone:" value={clientData.zone} />
            <InfoRow label="Sub Zone:" value={clientData.subZone} />
            <InfoRow label="Notes:" value={clientData.notes} />
            <div className="flex items-start border-b border-slate-200 last:border-b-0">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Update:
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-[55%] px-3 py-2 text-xs font-semibold text-signal border-r border-slate-200">
                  {clientData.update}
                </div>
                <div className="px-3 py-2 text-[10px] text-slate-500 uppercase">
                  Join: <span className="font-semibold text-signal">{clientData.join}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 border-t border-slate-200 bg-slate-50/50">
            <ActionBtn icon={Pencil} label="Edit Info" variant="outline" onClick={() => showToast("Edit Info")} />
            <ActionBtn icon={Zap} label="Quick Edit" variant="warning" onClick={() => showToast("Quick Edit")} />
            <ActionBtn icon={Send} label="Send SMS" variant="success" onClick={() => showToast("Send SMS")} />
            <ActionBtn icon={FileText} label="Logs" variant="outline" onClick={() => showToast("Logs")} />
            <ActionBtn icon={FileSignature} label="Agreement" variant="primary" onClick={() => showToast("Agreement")} />
          </div>
        </div>

        {/* COLUMN 2: BILLING INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-signal-tint border-b border-signal/20 px-4 py-2.5 text-center">
            <h2 className="font-heading font-bold text-sm text-signal">
              Billing Information
            </h2>
          </div>

          <div>
            <InfoRow label="Protocol Type:" value={clientData.protocolType} />
            <InfoRow label="Package Plan:" value={clientData.packagePlan} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Balance:
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2">
                <span className="text-xs font-semibold text-signal">{clientData.balance}</span>
                <ActionBtn icon={RefreshCw} label="" variant="primary" onClick={() => showToast("Renew")} />
                <ActionBtn icon={RefreshCw} label="" variant="warning" onClick={() => showToast("Reset")} />
              </div>
            </div>
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Plan Price:
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-1/2 px-3 py-2 text-xs font-semibold text-signal border-r border-slate-200">
                  {clientData.planPrice}
                </div>
                <div className="flex-1 px-3 py-2 text-xs font-semibold text-signal">
                  Add/Less: <span className="font-bold">{clientData.addLess}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Billing Cycle:
              </div>
              <div className="flex-1 flex items-center">
                <div className="w-1/2 px-3 py-2 text-xs font-semibold text-signal border-r border-slate-200">
                  {clientData.billingCycle}
                </div>
                <div className="flex-1 px-3 py-2 text-xs font-semibold text-signal">
                  Bill: <span className="font-bold">{clientData.bill}</span>
                </div>
              </div>
            </div>
            <InfoRow label="Billing Type:" value={clientData.billingType} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Billing Status:
              </div>
              <div className="flex-1 flex items-center px-3 py-2 gap-3">
                <span className="text-xs font-bold text-destructive">{clientData.billingStatus}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-destructive">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                  {clientData.disabledStatus}
                </span>
              </div>
            </div>
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Expiry Date:
              </div>
              <div className="flex-1 flex items-center px-3 py-2 gap-2">
                <span className="text-xs font-bold text-destructive">{clientData.expiryDate}</span>
                <ActionBtn icon={Receipt} label="" variant="outline" onClick={() => showToast("Receipt")} />
              </div>
            </div>
            <InfoRow label="Connected By:" value={clientData.connectedBy} />
            <InfoRow label="Location:" value={clientData.location} />
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 border-t border-slate-200 bg-slate-50/50">
            <ActionBtn icon={RefreshCw} label="Renew" variant="success" onClick={() => showToast("Renew")} />
            <ActionBtn icon={ArrowRightLeft} label="Migration" variant="warning" onClick={() => showToast("Migration")} />
            <ActionBtn icon={Receipt} label="Invoices" variant="success" onClick={() => showToast("Invoices")} />
            <ActionBtn icon={MapPin} label="Location" variant="outline" onClick={() => showToast("Location")} />
            <ActionBtn icon={UserX} label="Suspend" variant="danger" onClick={() => showToast("Suspend")} />
          </div>
        </div>

        {/* COLUMN 3: SERVER INFORMATION */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-signal-tint border-b border-signal/20 px-4 py-2.5 text-center">
            <h2 className="font-heading font-bold text-sm text-signal">
              Server Information
            </h2>
          </div>

          <div>
            <InfoRow label="Server:" value={clientData.server} />
            <InfoRow label="Username:" value={clientData.username} />
            <InfoRow label="Password:" value={clientData.password} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Save Mac:
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2">
                <span className="text-xs font-semibold text-signal font-mono">{clientData.saveMac}</span>
                <Database className="w-3.5 h-3.5 text-signal" />
              </div>
            </div>
            <InfoRow label="Device/Vendor:" value={clientData.deviceVendor} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Active Mac:
              </div>
              <div className="flex-1 flex items-center justify-between px-3 py-2">
                <span className="text-xs font-semibold text-signal font-mono">{clientData.activeMac}</span>
                <Database className="w-3.5 h-3.5 text-signal" />
              </div>
            </div>
            <InfoRow label="IP Address:" value={clientData.ipAddress} />
            <div className="flex items-start border-b border-slate-200">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Uptime:
              </div>
              <div className="flex-1 flex items-center px-3 py-2 gap-3">
                <span className="text-xs font-semibold text-signal">{clientData.uptime}</span>
                <span className={cn(
                  "flex items-center gap-1 text-[10px] font-bold",
                  clientData.serverStatus === "Online" ? "text-success" : "text-destructive"
                )}>
                  <span className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    clientData.serverStatus === "Online" ? "bg-success" : "bg-destructive"
                  )} />
                  {clientData.serverStatus}
                </span>
              </div>
            </div>
            <InfoRow label="Last Logout:" value={clientData.lastLogout} />
            <div className="flex items-start border-b border-slate-200 last:border-b-0">
              <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
                Data Used:
              </div>
              <div className="flex-1 flex items-center gap-2 px-3 py-2">
                <span className="text-xs font-semibold text-signal">{clientData.dataUsed}</span>
                <ActionBtn icon={BarChart3} label="" variant="primary" onClick={() => showToast("Data chart")} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 p-3 border-t border-slate-200 bg-slate-50/50">
            <ActionBtn icon={TrendingUp} label="User Traffic" variant="outline" onClick={() => showToast("User Traffic")} />
            <ActionBtn icon={Link2} label="Bind Mac" variant="primary" onClick={() => showToast("Bind Mac")} />
            <ActionBtn icon={XCircle} label="Disconnect" variant="danger" onClick={() => showToast("Disconnect")} />
          </div>
        </div>
      </div>
    </div>
  );
}