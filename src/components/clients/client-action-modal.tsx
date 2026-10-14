"use client";

import {
  Pencil, Zap, Send, FileText, FileSignature, RefreshCw, ArrowRightLeft,
  Receipt, MapPin, UserX, BarChart3, Link2, XCircle, Phone, MessageCircle,
  Database, TrendingUp
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

// 🎯 Client Data (রিয়েল অ্যাপে API থেকে আসবে)
const clientData = {
  // Account Information
  clientId: "282941",
  name: "Md. Tarequl Islam",
  address: "Khoksa Thanapara",
  mobileNo: "01724025800",
  email: "—",
  nidNo: "7305223559",
  dob: "16/11/87",
  zone: "—",
  subZone: "—",
  notes: "—",
  update: "12/03/26",
  join: "17/10/23",

  // Billing Information
  protocolType: "PPPOE",
  packagePlan: "8Mbps",
  balance: "0",
  planPrice: "400",
  addLess: "0",
  billingCycle: "Monthly",
  bill: "400",
  billingType: "Prepaid",
  billingStatus: "Expired",
  disabledStatus: "Disabled",
  expiryDate: "03-09-2024 11:59",
  connectedBy: "Poli Network Pop",
  location: "—",

  // Server Information
  server: "Poli Network",
  username: "tarequl.thanapara",
  password: "1234",
  saveMac: "00:72:63:AD:D4:7A",
  deviceVendor: "-",
  activeMac: "-",
  ipAddress: "—",
  uptime: "-",
  lastLogout: "01-01-70 12:00 AM",
  dataUsed: "0Byte",
  serverStatus: "Offline",
};

// 🎯 Info Row Component
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

// 🎯 Action Button Component
function ActionBtn({
  icon: Icon,
  label,
  onClick,
  variant = "outline",
}: {
  icon: React.ElementType;
  label?: string;
  onClick?: () => void;
  variant?: "outline" | "primary" | "success" | "warning" | "danger";
}) {
  const styles = {
    outline:
      "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-signal/30 hover:text-signal",
    primary:
      "bg-signal text-white border border-signal hover:bg-signal-hover",
    success:
      "bg-success-tint text-success border border-success/30 hover:bg-success/20",
    warning:
      "bg-warning-tint text-warning border border-warning/30 hover:bg-warning/20",
    danger:
      "bg-destructive/10 text-destructive border border-destructive/30 hover:bg-destructive/20",
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
      {label && <span>{label}</span>}
    </button>
  );
}

interface ClientActionModalProps {
  activeTab: ClientActionTab;
}

export function ClientActionModal({ activeTab }: ClientActionModalProps) {
  const showToast = (msg: string) => alert(msg);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ═══════════════════════════════════════════════════════
          COLUMN 1: ACCOUNT INFORMATION
          ═══════════════════════════════════════════════════════ */}
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
              <span className="text-xs font-semibold text-signal">
                {clientData.mobileNo}
              </span>
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
                DOB:{" "}
                <span className="font-semibold text-signal">
                  {clientData.dob}
                </span>
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
                Join:{" "}
                <span className="font-semibold text-signal">
                  {clientData.join}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 p-3 border-t border-slate-200 bg-slate-50/50">
          <ActionBtn
            icon={Pencil}
            label="Edit Info"
            variant="outline"
            onClick={() => showToast("Edit Info")}
          />
          <ActionBtn
            icon={Zap}
            label="Quick Edit"
            variant="warning"
            onClick={() => showToast("Quick Edit")}
          />
          <ActionBtn
            icon={Send}
            label="Send SMS"
            variant="success"
            onClick={() => showToast("Send SMS")}
          />
          <ActionBtn
            icon={FileText}
            label="Logs"
            variant="outline"
            onClick={() => showToast("Logs")}
          />
          <ActionBtn
            icon={FileSignature}
            label="Agreement"
            variant="primary"
            onClick={() => showToast("Agreement")}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          COLUMN 2: BILLING INFORMATION
          ═══════════════════════════════════════════════════════ */}
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
              <span className="text-xs font-semibold text-signal">
                {clientData.balance}
              </span>
              <ActionBtn
                icon={RefreshCw}
                variant="primary"
                onClick={() => showToast("Renew")}
              />
              <ActionBtn
                icon={RefreshCw}
                variant="warning"
                onClick={() => showToast("Reset")}
              />
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
              <span className="text-xs font-bold text-destructive">
                {clientData.billingStatus}
              </span>
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
              <span className="text-xs font-bold text-destructive">
                {clientData.expiryDate}
              </span>
              <ActionBtn
                icon={Receipt}
                variant="outline"
                onClick={() => showToast("Receipt")}
              />
            </div>
          </div>
          <InfoRow label="Connected By:" value={clientData.connectedBy} />
          <InfoRow label="Location:" value={clientData.location} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 p-3 border-t border-slate-200 bg-slate-50/50">
          <ActionBtn
            icon={RefreshCw}
            label="Renew"
            variant="success"
            onClick={() => showToast("Renew")}
          />
          <ActionBtn
            icon={ArrowRightLeft}
            label="Migration"
            variant="warning"
            onClick={() => showToast("Migration")}
          />
          <ActionBtn
            icon={Receipt}
            label="Invoices"
            variant="success"
            onClick={() => showToast("Invoices")}
          />
          <ActionBtn
            icon={MapPin}
            label="Location"
            variant="outline"
            onClick={() => showToast("Location")}
          />
          <ActionBtn
            icon={UserX}
            label="Suspend"
            variant="danger"
            onClick={() => showToast("Suspend")}
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          COLUMN 3: SERVER INFORMATION
          ═══════════════════════════════════════════════════════ */}
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
              <span className="text-xs font-semibold text-signal font-mono">
                {clientData.saveMac}
              </span>
              <Database className="w-3.5 h-3.5 text-signal" />
            </div>
          </div>
          <InfoRow label="Device/Vendor:" value={clientData.deviceVendor} />
          <div className="flex items-start border-b border-slate-200">
            <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
              Active Mac:
            </div>
            <div className="flex-1 flex items-center justify-between px-3 py-2">
              <span className="text-xs font-semibold text-signal font-mono">
                {clientData.activeMac}
              </span>
              <Database className="w-3.5 h-3.5 text-signal" />
            </div>
          </div>
          <InfoRow label="IP Address:" value={clientData.ipAddress} />
          <div className="flex items-start border-b border-slate-200">
            <div className="w-[38%] shrink-0 px-3 py-2 text-xs font-medium text-slate-500 bg-slate-50/50">
              Uptime:
            </div>
            <div className="flex-1 flex items-center px-3 py-2 gap-3">
              <span className="text-xs font-semibold text-signal">
                {clientData.uptime}
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-destructive">
                <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
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
              <span className="text-xs font-semibold text-signal">
                {clientData.dataUsed}
              </span>
              <ActionBtn
                icon={BarChart3}
                variant="primary"
                onClick={() => showToast("Data chart")}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 p-3 border-t border-slate-200 bg-slate-50/50">
          <ActionBtn
            icon={TrendingUp}
            label="User Traffic"
            variant="outline"
            onClick={() => showToast("User Traffic")}
          />
          <ActionBtn
            icon={Link2}
            label="Bind Mac"
            variant="primary"
            onClick={() => showToast("Bind Mac")}
          />
          <ActionBtn
            icon={XCircle}
            label="Disconnect"
            variant="danger"
            onClick={() => showToast("Disconnect")}
          />
        </div>
      </div>
    </div>
  );
}