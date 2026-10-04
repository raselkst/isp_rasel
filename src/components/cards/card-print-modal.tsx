"use client";

import { useState, useMemo } from "react";
import { CenteredFormModal } from "@/components/cards/centered-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Printer, CreditCard, Loader2, Download, Copy, RefreshCw,
  Wifi, Server, Package, Eye, FileText, CheckCircle2,
  Layout, Smartphone, Monitor, AlertCircle, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CardPrintModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

// ডাইনামিক ড্রপডাউন ডেটা
const users = ["Admin", "Reseller-A", "Reseller-B", "Al Jaami Tech"];
const protocols = ["Hotspot", "PPPoE", "Static"];

const serversByProtocol: Record<string, string[]> = {
  Hotspot: ["SERVER-3", "SERVER-4"],
  PPPoE: ["SERVER-2", "SERVER-5"],
  Static: ["SERVER-6", "SERVER-7"],
};

const packages = ["1Hour-Unlimited", "1Day-5GB", "7Day-50GB", "30Day-500GB"];

const cardDesigns = [
  { id: "small", name: "Small-1", width: "w-48", size: "Small" },
  { id: "medium", name: "Medium-1", width: "w-64", size: "Medium" },
  { id: "large", name: "Large-1", width: "w-80", size: "Large" },
];

const cardTypes = ["Valid", "Used", "Expired", "Sample"];
const printModes = [
  { id: "portrait", name: "Portrait", icon: Smartphone },
  { id: "landscape", name: "Landscape", icon: Monitor },
];

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </div>
  );
}

// ডামি কার্ড ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
function generateSampleCards(count: number, pkg: string): { cardNo: string; refNo: string; pkg: string; expiry: string }[] {
  return Array.from({ length: count }).map((_, i) => ({
    cardNo: `CARD-${100000 + Math.floor(Math.random() * 900000)}`,
    refNo: `REF-${Date.now().toString().slice(-6)}-${i}`,
    pkg: pkg || "1Day-5GB",
    expiry: "2025-12-31",
  }));
}

export function CardPrintModal({ open, onClose, onSubmit }: CardPrintModalProps) {
  const [formData, setFormData] = useState({
    user: "",
    protocol: "Hotspot",
    server: "",
    package: "",
    cardDesign: "medium",
    cardType: "Valid",
    printMode: "landscape",
    dateFrom: "",
    dateTo: "",
    copiesPerCard: 1,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewCards, setPreviewCards] = useState<typeof generateSampleCards extends (...args: any) => infer R ? R : never>([]);
  const [loaded, setLoaded] = useState(false);

  // Protocol অনুযায়ী সার্ভার
  const availableServers = useMemo(() => serversByProtocol[formData.protocol] || [], [formData.protocol]);

  // সিলেক্টেড ডিজাইন
  const selectedDesign = cardDesigns.find((d) => d.id === formData.cardDesign) || cardDesigns[1];

  // হ্যান্ডলার
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // Load Cards
  const handleLoadCards = () => {
    if (!formData.server) {
      alert("Please select a Server.");
      return;
    }
    if (!formData.package) {
      alert("Please select a Package.");
      return;
    }

    setIsLoading(true);
    setLoaded(false);

    setTimeout(() => {
      const cards = generateSampleCards(6, formData.package);
      setPreviewCards(cards);
      setIsLoading(false);
      setLoaded(true);
    }, 800);
  };

  // Print
  const handlePrint = () => {
    if (previewCards.length === 0) {
      alert("Please load cards first.");
      return;
    }
    window.print();
  };

  // Download CSV
  const handleDownload = () => {
    if (previewCards.length === 0) {
      alert("Please load cards first.");
      return;
    }
    const headers = "Card No,Ref No,Package,Expiry";
    const rows = previewCards.map((c) => `"${c.cardNo}","${c.refNo}","${c.pkg}","${c.expiry}"`).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `print-cards-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy All
  const handleCopyAll = () => {
    if (previewCards.length === 0) {
      alert("Please load cards first.");
      return;
    }
    const all = previewCards.map((c) => c.cardNo).join("\n");
    navigator.clipboard.writeText(all);
    alert(`Copied ${previewCards.length} card numbers to clipboard!`);
  };

  // Reset
  const handleReset = () => {
    setFormData({
      user: "",
      protocol: "Hotspot",
      server: "",
      package: "",
      cardDesign: "medium",
      cardType: "Valid",
      printMode: "landscape",
      dateFrom: "",
      dateTo: "",
      copiesPerCard: 1,
    });
    setPreviewCards([]);
    setLoaded(false);
  };

  return (
    <CenteredFormModal
      open={open}
      onClose={onClose}
      title="Card Print Studio"
      hideSubmit
      maxWidth="max-w-4xl"
    >
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Field label="User">
          <select
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
          >
            <option value="">Choose User</option>
            {users.map((u) => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </Field>

        <Field label="Protocol" required>
          <select
            name="protocol"
            value={formData.protocol}
            onChange={(e) => {
              handleChange(e);
              setFormData((prev) => ({ ...prev, server: "" }));
            }}
            className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
          >
            {protocols.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>

        <Field label="Server" required>
          <select
            name="server"
            value={formData.server}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
          >
            <option value="">Choose Server</option>
            {availableServers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Package" required>
          <select
            name="package"
            value={formData.package}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
          >
            <option value="">Select Package</option>
            {packages.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>

        <Field label="Card Design">
          <select
            name="cardDesign"
            value={formData.cardDesign}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
          >
            {cardDesigns.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Card Type">
          <select
            name="cardType"
            value={formData.cardType}
            onChange={handleChange}
            className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
          >
            {cardTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>

        <Field label="Print Mode">
          <div className="flex gap-2">
            {printModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = formData.printMode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, printMode: mode.id }))}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-semibold transition-all",
                    isActive
                      ? "bg-signal text-white border-signal"
                      : "bg-muted/40 text-muted-foreground border-border hover:border-signal/50"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" /> {mode.name}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Copies Per Card">
          <Input
            name="copiesPerCard"
            type="number"
            min={1}
            max={10}
            value={formData.copiesPerCard}
            onChange={handleChange}
            className="rounded-xl"
          />
        </Field>

        <Field label="Date Filter (From)">
          <Input
            name="dateFrom"
            type="date"
            value={formData.dateFrom}
            onChange={handleChange}
            className="rounded-xl"
          />
        </Field>
      </div>

      {/* Load Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleLoadCards}
          disabled={isLoading}
          className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading Cards...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" /> Load Cards for Preview
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="rounded-xl font-semibold h-12 px-6"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3 animate-in fade-in duration-300">
          <Loader2 className="w-10 h-10 text-signal animate-spin" />
          <p className="text-sm text-muted-foreground">Fetching cards...</p>
        </div>
      )}

      {/* Preview Cards */}
      {!isLoading && loaded && previewCards.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Summary Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-emerald-700">
                  {previewCards.length} card(s) ready to print
                </p>
                <p className="text-xs text-emerald-600">
                  {formData.cardType} · {formData.printMode} · {selectedDesign.size}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="p-2 rounded-lg bg-background border hover:bg-muted transition-colors"
                title="Copy All"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-background border hover:bg-muted transition-colors"
                title="Download CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Grid */}
          <div className={cn(
            "grid gap-4 p-4 rounded-2xl bg-muted/30 border",
            formData.printMode === "landscape" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          )}>
            {previewCards.map((card, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-2xl bg-gradient-to-br from-signal to-violet-accent text-white p-5 shadow-lg relative overflow-hidden transition-all hover:scale-[1.02]",
                  selectedDesign.width,
                  "w-full"
                )}
              >
                <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full border-4 border-white/10" />
                <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full border-4 border-white/5" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {formData.cardType}
                      </span>
                    </div>
                    <Sparkles className="w-3.5 h-3.5 opacity-80" />
                  </div>
                  <p className="font-mono text-sm font-bold mb-2">{card.cardNo}</p>
                  <div className="space-y-1 text-[10px] opacity-90">
                    <p className="flex items-center gap-1">
                      <Package className="w-2.5 h-2.5" /> {card.pkg}
                    </p>
                    <p className="flex items-center gap-1">
                      <Server className="w-2.5 h-2.5" /> {formData.server}
                    </p>
                    <p className="flex items-center gap-1">
                      <Wifi className="w-2.5 h-2.5" /> {formData.protocol}
                    </p>
                  </div>
                  <p className="text-[9px] opacity-70 mt-2 font-mono">Ref: {card.refNo}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Print Button */}
          <Button
            onClick={handlePrint}
            className="w-full rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
          >
            <Printer className="w-4 h-4 mr-2" /> Print {previewCards.length} Cards
          </Button>
        </div>
      )}

      {/* Info Note */}
      {!isLoading && !loaded && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-signal/5 border border-signal/20">
          <AlertCircle className="w-4 h-4 text-signal shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Select a Server, Package, and Card Design, then click <strong className="text-signal">Load Cards for Preview</strong>. 
            You'll see a live preview of how the cards will look. Then click <strong className="text-signal">Print</strong> or download as CSV.
          </p>
        </div>
      )}
    </CenteredFormModal>
  );
}