"use client";

import { useState, useMemo } from "react";
import { CenteredFormModal } from "@/components/cards/centered-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sparkles, CreditCard, Loader2, CheckCircle2, Download, Copy,
  Printer, RefreshCw, Wifi, Server, Package, Hash, AlertCircle,
  TrendingUp, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CardGeneratorModalProps {
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

const packages = [
  { id: "p1", name: "1Hour-Unlimited", price: 10, validity: "1 Hour", data: "Unlimited" },
  { id: "p2", name: "1Day-5GB", price: 30, validity: "1 Day", data: "5 GB" },
  { id: "p3", name: "7Day-50GB", price: 150, validity: "7 Days", data: "50 GB" },
  { id: "p4", name: "30Day-500GB", price: 500, validity: "30 Days", data: "500 GB" },
];

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block text-signal">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </div>
  );
}

export function CardGeneratorModal({ open, onClose, onSubmit }: CardGeneratorModalProps) {
  const [formData, setFormData] = useState({
    user: "",
    protocol: "Hotspot",
    server: "",
    packageId: "",
    quantity: 10,
    prefix: "CARD-",
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedCards, setGeneratedCards] = useState<{ cardNo: string; refNo: string; package: string }[]>([]);

  const availableServers = useMemo(() => serversByProtocol[formData.protocol] || [], [formData.protocol]);
  const selectedPackage = packages.find((p) => p.id === formData.packageId);
  const totalPrice = selectedPackage ? selectedPackage.price * formData.quantity : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleGenerate = () => {
    if (!formData.user) {
      alert("Please select a User.");
      return;
    }
    if (!formData.server) {
      alert("Please select a Server.");
      return;
    }
    if (!formData.packageId) {
      alert("Please select a Package.");
      return;
    }
    if (formData.quantity < 1 || formData.quantity > 1000) {
      alert("Quantity must be between 1 and 1000.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedCards([]);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);

        const newCards = Array.from({ length: formData.quantity }).map((_, i) => {
          const random = Math.floor(100000 + Math.random() * 900000);
          return {
            cardNo: `${formData.prefix}${random}${i}`,
            refNo: `REF-${Date.now().toString().slice(-6)}-${i}`,
            package: selectedPackage?.name || "",
          };
        });

        setGeneratedCards(newCards);
        setIsGenerating(false);
      }
    }, 100);
  };

  const handleReset = () => {
    setFormData({
      user: "",
      protocol: "Hotspot",
      server: "",
      packageId: "",
      quantity: 10,
      prefix: "CARD-",
    });
    setGeneratedCards([]);
    setProgress(0);
  };

  const handleCopyAll = () => {
    const all = generatedCards.map((c) => c.cardNo).join("\n");
    navigator.clipboard.writeText(all);
    alert(`Copied ${generatedCards.length} card numbers to clipboard!`);
  };

  const handleDownload = () => {
    const headers = "Card No,Ref No,Package";
    const rows = generatedCards.map((c) => `"${c.cardNo}","${c.refNo}","${c.package}"`).join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `generated-cards-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <CenteredFormModal
      open={open}
      onClose={onClose}
      title="Card Generator"
      hideSubmit
    >
      {/* Live Preview Card */}
      <div className="rounded-2xl bg-signal p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full border-4 border-white/10" />
        <div className="absolute -right-12 -bottom-12 w-44 h-44 rounded-full border-4 border-white/5" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span className="font-heading font-bold text-sm">Card Preview</span>
            </div>
            <Sparkles className="w-4 h-4 opacity-80" />
          </div>
          <p className="font-mono text-2xl font-bold mb-1">
            {formData.prefix}XXXXXX
          </p>
          <div className="flex items-center justify-between text-xs opacity-90">
            <span>{selectedPackage?.name || "Select Package"}</span>
            <span>{formData.protocol}</span>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="User" required>
          <select
            name="user"
            value={formData.user}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
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
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
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
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
          >
            <option value="">Choose Server</option>
            {availableServers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Package" required>
          <select
            name="packageId"
            value={formData.packageId}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-50 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
          >
            <option value="">Select Package</option>
            {packages.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Card Quantity" required>
          <Input
            name="quantity"
            type="number"
            min={1}
            max={1000}
            value={formData.quantity}
            onChange={handleChange}
            className="rounded-xl text-signal"
          />
        </Field>

        <Field label="Card Prefix">
          <Input
            name="prefix"
            value={formData.prefix}
            onChange={handleChange}
            placeholder="CARD-"
            className="rounded-xl text-signal"
          />
        </Field>
      </div>

      {/* Package Details Card */}
      {selectedPackage && (
        <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Validity</p>
            <p className="font-semibold text-sm flex items-center gap-1 text-signal">
              <Zap className="w-3.5 h-3.5 text-warning" /> {selectedPackage.validity}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Data</p>
            <p className="font-semibold text-sm flex items-center gap-1 text-signal">
              <Wifi className="w-3.5 h-3.5 text-signal" /> {selectedPackage.data}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Unit Price</p>
            <p className="font-semibold text-sm text-signal">৳{selectedPackage.price}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase mb-1">Total Price</p>
            <p className="font-bold text-sm text-signal">৳{totalPrice.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Generate Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex-1 rounded-xl font-semibold h-12 bg-signal hover:bg-signal-hover text-white border-0 shadow-md"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Generate Cards
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="rounded-xl font-semibold h-12 px-6 border-slate-200 text-signal hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      {isGenerating && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-500">Generating cards...</span>
            <span className="text-signal">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-signal transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Generated Cards Preview */}
      {generatedCards.length > 0 && (
        <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between p-4 rounded-xl bg-success-tint border border-success/30">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-semibold text-success">
                  {generatedCards.length} card(s) generated successfully!
                </p>
                <p className="text-xs text-success">
                  Package: {selectedPackage?.name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopyAll}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-signal"
                title="Copy All"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-signal"
                title="Download CSV"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-signal"
                title="Print"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview List */}
          <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-signal text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">#</th>
                  <th className="px-3 py-2 text-left font-semibold">Card No</th>
                  <th className="px-3 py-2 text-left font-semibold">Ref No</th>
                  <th className="px-3 py-2 text-left font-semibold">Package</th>
                </tr>
              </thead>
              <tbody>
                {generatedCards.slice(0, 100).map((c, i) => (
                  <tr key={i} className="border-t border-slate-100 hover:bg-white">
                    <td className="px-3 py-2 text-slate-500">{i + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-signal">{c.cardNo}</td>
                    <td className="px-3 py-2 font-mono text-slate-500">{c.refNo}</td>
                    <td className="px-3 py-2 text-signal">{c.package}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {generatedCards.length > 100 && (
              <p className="text-center text-xs text-slate-500 py-2 border-t border-slate-200">
                Showing first 100 of {generatedCards.length} cards
              </p>
            )}
          </div>
        </div>
      )}

      {/* Info Note */}
      {!isGenerating && generatedCards.length === 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-signal-tint border border-signal/30">
          <AlertCircle className="w-4 h-4 text-signal shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Select a User, Protocol, Server, Package, and Quantity, then click{" "}
            <strong className="text-signal">Generate Cards</strong>.
            Cards will be created with unique numbers and can be downloaded as CSV or copied to clipboard.
          </p>
        </div>
      )}
    </CenteredFormModal>
  );
}