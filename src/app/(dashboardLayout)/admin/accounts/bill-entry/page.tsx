"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search, Building2, Receipt, Calendar, Percent,
  FileText, CheckCircle2, AlertCircle, X, Info, RefreshCw,
  Plus, Trash2, Download, Save, Layers, Keyboard, Copy,
  Clock, ShieldCheck, TrendingUp, FileSpreadsheet, Palette
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============ ডেটা ============
const companies = [
  { id: 1, name: "ZS Cable Network (ZSCN)", contact: "01716-102651", address: "Mirpur, Dhaka", totalInvoices: 12, dueAmount: 45000, lastInvoice: "2026-08-15" },
  { id: 2, name: "Poli Network Pop", contact: "01816-234567", address: "Uttara, Dhaka", totalInvoices: 8, dueAmount: 22000, lastInvoice: "2026-09-01" },
  { id: 3, name: "AR Internet", contact: "01917-345678", address: "Banani, Dhaka", totalInvoices: 15, dueAmount: 0, lastInvoice: "2026-09-20" },
  { id: 4, name: "Online Network", contact: "01718-456789", address: "Dhanmondi, Dhaka", totalInvoices: 5, dueAmount: 12500, lastInvoice: "2026-07-10" },
  { id: 5, name: "Akas Cable Network", contact: "01611-567890", address: "Gulshan, Dhaka", totalInvoices: 22, dueAmount: 78000, lastInvoice: "2026-09-25" },
  { id: 6, name: "SmartISP Solutions", contact: "01521-678901", address: "Bashundhara, Dhaka", totalInvoices: 3, dueAmount: 8000, lastInvoice: "2026-06-30" },
];

// 🎯 Theme-connected Templates
const templates = [
  { id: "classic", label: "Classic", className: "bg-signal" },
  { id: "modern", label: "Modern", className: "bg-violet-accent" },
  { id: "minimal", label: "Minimal", className: "bg-slate-600" },
];

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
}

const DRAFT_KEY = "bill-entry-draft";

export default function AdvancedBillEntryPage() {
  const [formData, setFormData] = useState({
    searchTerm: "",
    selectedCompany: null as any,
    invoiceNo: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    fromDate: new Date().toISOString().split("T")[0],
    toDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    vat: 0,
    discount: 0,
    applyVat: false,
    remarks: "",
    template: "classic",
    status: "draft" as "draft" | "pending" | "approved",
    currency: "BDT",
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: 1, description: "", quantity: 1, rate: 0 },
  ]);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Draft Auto-Save
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData && parsed.lineItems) {
          setFormData(parsed.formData);
          setLineItems(parsed.lineItems);
          setLastSaved(parsed.savedAt);
        }
      }
    } catch (e) {
      console.warn("Failed to load draft", e);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const savedAt = new Date().toLocaleTimeString();
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ formData, lineItems, savedAt })
        );
        setLastSaved(savedAt);
      } catch (e) {
        console.warn("Failed to save draft", e);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formData, lineItems]);

  // Duplicate Check
  useEffect(() => {
    if (formData.invoiceNo.trim().length >= 3 && formData.selectedCompany) {
      const isDuplicate = ["INV-2025-001", "INV-2026-045"].includes(formData.invoiceNo.trim());
      setDuplicateWarning(isDuplicate);
    } else {
      setDuplicateWarning(false);
    }
  }, [formData.invoiceNo, formData.selectedCompany]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSubmit(new Event("submit") as any);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setShowShortcuts((s) => !s);
      }
      if (e.key === "Escape") {
        setShowSuggestions(false);
        setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, lineItems]);

  // কোম্পানি সার্চ
  const filteredCompanies = useMemo(() => {
    if (formData.searchTerm.length < 3) return [];
    return companies.filter((c) =>
      c.name.toLowerCase().includes(formData.searchTerm.toLowerCase())
    );
  }, [formData.searchTerm]);

  // Calculations
  const calculations = useMemo(() => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const vatAmount = formData.applyVat ? (subtotal * formData.vat) / 100 : 0;
    const discountAmount = (subtotal * formData.discount) / 100;
    const grandTotal = subtotal + vatAmount - discountAmount;
    return { subtotal, vatAmount, discountAmount, grandTotal };
  }, [lineItems, formData.vat, formData.discount, formData.applyVat]);

  // Form Progress
  const progress = useMemo(() => {
    let filled = 0;
    let total = 4;
    if (formData.selectedCompany) filled++;
    if (formData.invoiceNo.trim()) filled++;
    if (lineItems[0]?.description && lineItems[0]?.rate > 0) filled++;
    if (formData.dueDate) filled++;
    return Math.round((filled / total) * 100);
  }, [formData, lineItems]);

  // Handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const handleSelectCompany = (company: any) => {
    setFormData((prev) => ({
      ...prev,
      selectedCompany: company,
      searchTerm: company.name,
    }));
    setShowSuggestions(false);
  };

  const handleRemoveCompany = () => {
    setFormData((prev) => ({ ...prev, selectedCompany: null, searchTerm: "" }));
  };

  const addLineItem = () => {
    const newId = Math.max(...lineItems.map((i) => i.id), 0) + 1;
    setLineItems((prev) => [
      ...prev,
      { id: newId, description: "", quantity: 1, rate: 0 },
    ]);
  };

  const removeLineItem = (id: number) => {
    if (lineItems.length === 1) {
      alert("At least one line item is required.");
      return;
    }
    setLineItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateLineItem = (id: number, field: keyof LineItem, value: any) => {
    setLineItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, [field]: value } : i))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.selectedCompany) return alert("Please select a company!");
    if (!formData.invoiceNo.trim()) return alert("Invoice No is required!");
    if (calculations.subtotal <= 0) return alert("Add at least one line item with a rate.");
    if (duplicateWarning) {
      if (!confirm("⚠️ Duplicate invoice number detected. Continue anyway?")) return;
    }

    alert(
      `✅ Invoice Created Successfully!\n\n` +
        `Company: ${formData.selectedCompany.name}\n` +
        `Invoice No: ${formData.invoiceNo}\n` +
        `Line Items: ${lineItems.length}\n` +
        `Subtotal: ৳${calculations.subtotal.toFixed(2)}\n` +
        `VAT (${formData.vat}%): ৳${calculations.vatAmount.toFixed(2)}\n` +
        `Discount (${formData.discount}%): -৳${calculations.discountAmount.toFixed(2)}\n` +
        `Grand Total: ৳${calculations.grandTotal.toFixed(2)}\n` +
        `Template: ${formData.template}`
    );

    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null);
  };

  const handleReset = () => {
    if (!confirm("Reset the entire form? Unsaved data will be lost.")) return;
    setFormData({
      searchTerm: "",
      selectedCompany: null,
      invoiceNo: "",
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
      fromDate: new Date().toISOString().split("T")[0],
      toDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      vat: 0,
      discount: 0,
      applyVat: false,
      remarks: "",
      template: "classic",
      status: "draft",
      currency: "BDT",
    });
    setLineItems([{ id: 1, description: "", quantity: 1, rate: 0 }]);
    localStorage.removeItem(DRAFT_KEY);
    setLastSaved(null);
  };

  const handleDownloadPDF = () => {
    if (!formData.selectedCompany || !formData.invoiceNo) {
      alert("Please fill in the required fields first.");
      return;
    }
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
      <head>
        <title>Invoice ${formData.invoiceNo}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; }
          .header { border-bottom: 3px solid #066F6F; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; }
          .header h1 { font-size: 28px; color: #066F6F; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .meta label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 4px; }
          .meta span { font-size: 14px; font-weight: 600; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          thead tr { background: #066F6F; color: white; }
          th { padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; }
          td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          .totals { text-align: right; margin-top: 20px; }
          .totals div { display: flex; justify-content: flex-end; gap: 30px; padding: 6px 0; font-size: 14px; }
          .totals .grand { font-size: 20px; font-weight: bold; color: #066F6F; border-top: 2px solid #066F6F; padding-top: 12px; margin-top: 12px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1>INVOICE</h1>
            <p>Invoice No: <strong>${formData.invoiceNo}</strong></p>
          </div>
          <div style="text-align:right;">
            <p style="font-size:12px;color:#64748b;">Date: ${formData.invoiceDate}</p>
            <p style="font-size:12px;color:#64748b;">Due: ${formData.dueDate}</p>
          </div>
        </div>
        <div class="meta">
          <div><label>Bill To</label><span>${formData.selectedCompany.name}</span><br/><small>${formData.selectedCompany.address}</small><br/><small>${formData.selectedCompany.contact}</small></div>
          <div><label>From</label><span>SmartISP Pvt. Ltd.</span><br/><small>Dhaka, Bangladesh</small><br/><small>info@smartisp.com</small></div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>
            ${lineItems.map((item, i) => `<tr><td>${i + 1}</td><td>${item.description || "-"}</td><td>${item.quantity}</td><td>৳${item.rate.toFixed(2)}</td><td>৳${(item.quantity * item.rate).toFixed(2)}</td></tr>`).join("")}
          </tbody>
        </table>
        <div class="totals">
          <div><span>Subtotal:</span><strong>৳${calculations.subtotal.toFixed(2)}</strong></div>
          ${formData.applyVat ? `<div><span>VAT (${formData.vat}%):</span><strong>+৳${calculations.vatAmount.toFixed(2)}</strong></div>` : ""}
          ${formData.discount > 0 ? `<div><span>Discount (${formData.discount}%):</span><strong>-৳${calculations.discountAmount.toFixed(2)}</strong></div>` : ""}
          <div class="grand"><span>Grand Total:</span><span>৳${calculations.grandTotal.toFixed(2)}</span></div>
        </div>
        <div class="footer">This is a computer-generated invoice. © ${new Date().getFullYear()} SmartISP Pvt. Ltd.</div>
        <script>window.onload = function(){setTimeout(function(){window.print();},300);}</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const templateConfig = templates.find((t) => t.id === formData.template) || templates[0];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="w-full px-4 sm:px-6 lg:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-[26px] font-bold tracking-tight text-signal">
                Advanced Invoice Entry
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Create multi-item invoices with auto-save, PDF export & approval workflow.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="flex items-center gap-1.5 text-xs text-success bg-success-tint px-3 py-1.5 rounded-full border border-success/30">
                  <ShieldCheck className="w-3 h-3" /> Auto-saved at {lastSaved}
                </span>
              )}
              <button
                onClick={() => setShowShortcuts(!showShortcuts)}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-slate-200 text-signal hover:bg-slate-50 transition-colors"
              >
                <Keyboard className="w-3.5 h-3.5" /> Shortcuts
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex items-center gap-4 shadow-sm">
            <div className="flex items-center gap-2 shrink-0">
              <TrendingUp className="w-4 h-4 text-signal" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Form Progress</span>
            </div>
            <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-signal transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-bold text-signal shrink-0">{progress}%</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px] gap-6">
            {/* LEFT: FORM */}
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              {/* Invoice Info Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className={cn("text-white px-6 py-4 flex items-center gap-2", templateConfig.className)}>
                  <FileText className="w-5 h-5" />
                  <h2 className="font-heading font-bold text-lg">Invoice Information</h2>
                  <span className="ml-auto text-xs bg-white/20 px-2.5 py-1 rounded-full font-mono">
                    {formData.status.toUpperCase()}
                  </span>
                </div>

                <div className="p-6 sm:p-8 space-y-6">
                  {/* Company Search */}
                  <div className="relative">
                    <label className="text-sm font-semibold block mb-2 text-signal">
                      Search Company <span className="text-destructive">*</span>
                    </label>
                    {formData.selectedCompany ? (
                      <div className="p-4 rounded-xl border border-signal bg-signal-tint">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-signal text-white flex items-center justify-center font-bold text-lg shrink-0">
                            {formData.selectedCompany.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-sm text-signal">{formData.selectedCompany.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {formData.selectedCompany.contact} · {formData.selectedCompany.address}
                            </p>
                            <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-signal/20">
                              <div>
                                <p className="text-[10px] uppercase text-slate-500 font-bold">Invoices</p>
                                <p className="text-sm font-bold text-signal">{formData.selectedCompany.totalInvoices}</p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase text-slate-500 font-bold">Due</p>
                                <p className={cn("text-sm font-bold", formData.selectedCompany.dueAmount > 0 ? "text-destructive" : "text-success")}>
                                  ৳{formData.selectedCompany.dueAmount.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-[10px] uppercase text-slate-500 font-bold">Last</p>
                                <p className="text-xs font-semibold text-signal">{formData.selectedCompany.lastInvoice}</p>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveCompany}
                            className="w-7 h-7 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 shrink-0"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                          name="searchTerm"
                          value={formData.searchTerm}
                          onChange={handleChange}
                          onFocus={() => setShowSuggestions(true)}
                          placeholder="Search by company name (min 3 chars)"
                          className="rounded-xl pl-11 border-signal ring-1 ring-signal/30 text-signal"
                        />
                      </div>
                    )}

                    {!formData.selectedCompany && showSuggestions && formData.searchTerm.length >= 3 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-30 overflow-hidden max-h-72 overflow-y-auto">
                        {filteredCompanies.length > 0 ? (
                          filteredCompanies.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => handleSelectCompany(c)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-left border-b border-slate-100 last:border-b-0"
                            >
                              <div className="w-9 h-9 rounded-full bg-signal-tint text-signal flex items-center justify-center shrink-0">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold truncate text-signal">{c.name}</p>
                                <p className="text-xs text-slate-500">{c.contact}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-sm text-slate-500">
                            <AlertCircle className="w-6 h-6 mx-auto mb-2 opacity-40" />
                            No companies found
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Invoice Meta */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-signal">
                        Invoice No <span className="text-destructive">*</span>
                      </label>
                      <Input
                        name="invoiceNo"
                        value={formData.invoiceNo}
                        onChange={handleChange}
                        placeholder="INV-2026-001"
                        className={cn(
                          "rounded-xl font-mono border-slate-200 text-signal",
                          duplicateWarning && "border-destructive ring-2 ring-destructive/20"
                        )}
                      />
                      {duplicateWarning && (
                        <p className="text-xs text-destructive font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> This invoice number already exists!
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-signal">Invoice Date</label>
                      <Input
                        name="invoiceDate"
                        type="date"
                        value={formData.invoiceDate}
                        onChange={handleChange}
                        className="rounded-xl border-slate-200 text-signal"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-signal">Due Date</label>
                      <Input
                        name="dueDate"
                        type="date"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="rounded-xl border-slate-200 text-signal"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-signal">Currency</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                      >
                        <option value="BDT">BDT (৳)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Line Items Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-signal" />
                    <h2 className="font-heading font-bold text-lg text-signal">Line Items</h2>
                    <span className="text-xs bg-signal-tint text-signal px-2 py-0.5 rounded-full font-bold border border-signal/30">
                      {lineItems.length}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={addLineItem}
                    size="sm"
                    className="rounded-full gap-1.5 font-semibold bg-signal text-white hover:bg-signal-hover border-0 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                  </Button>
                </div>

                <div className="p-6 space-y-4">
                  <div className="hidden md:grid grid-cols-[1fr_100px_140px_140px_40px] gap-3 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <span>Description</span>
                    <span>Quantity</span>
                    <span>Rate (৳)</span>
                    <span>Amount (৳)</span>
                    <span></span>
                  </div>

                  {lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_100px_140px_140px_40px] gap-3 items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-2 md:gap-0">
                        <span className="md:hidden text-[10px] font-bold uppercase text-slate-500 w-20">Desc</span>
                        <Input
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                          placeholder={`Item ${index + 1} description`}
                          className="rounded-lg border-slate-200 text-signal"
                        />
                      </div>
                      <div className="flex items-center gap-2 md:gap-0">
                        <span className="md:hidden text-[10px] font-bold uppercase text-slate-500 w-20">Qty</span>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, "quantity", Number(e.target.value))}
                          className="rounded-lg border-slate-200 text-signal"
                        />
                      </div>
                      <div className="flex items-center gap-2 md:gap-0">
                        <span className="md:hidden text-[10px] font-bold uppercase text-slate-500 w-20">Rate</span>
                        <Input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, "rate", Number(e.target.value))}
                          className="rounded-lg border-slate-200 text-signal"
                        />
                      </div>
                      <div className="flex items-center gap-2 md:gap-0">
                        <span className="md:hidden text-[10px] font-bold uppercase text-slate-500 w-20">Amount</span>
                        <div className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 font-mono font-bold text-signal">
                          ৳{(item.quantity * item.rate).toFixed(2)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors md:justify-self-center"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex justify-end pt-3 border-t border-slate-100">
                    <div className="text-right">
                      <p className="text-xs text-slate-500 font-bold uppercase">Subtotal</p>
                      <p className="text-2xl font-heading font-bold text-signal">৳{calculations.subtotal.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* VAT & Discount + Template */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Percent className="w-5 h-5 text-signal" />
                    <h3 className="font-heading font-bold text-signal">VAT & Discount</h3>
                  </div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 p-3 rounded-xl bg-signal-tint border border-signal/20 cursor-pointer">
                      <input
                        type="checkbox"
                        name="applyVat"
                        checked={formData.applyVat}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer accent-signal"
                      />
                      <span className="text-sm font-semibold text-signal">Apply VAT</span>
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500">VAT (%)</label>
                        <Input
                          name="vat"
                          type="number"
                          value={formData.vat}
                          onChange={handleChange}
                          disabled={!formData.applyVat}
                          className="rounded-xl disabled:opacity-50 border-slate-200 text-signal"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase text-slate-500">Discount (%)</label>
                        <Input
                          name="discount"
                          type="number"
                          value={formData.discount}
                          onChange={handleChange}
                          className="rounded-xl border-slate-200 text-signal"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-5 h-5 text-signal" />
                    <h3 className="font-heading font-bold text-signal">Invoice Template</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, template: t.id }))}
                        className={cn(
                          "p-3 rounded-xl border-2 transition-all text-left bg-white",
                          formData.template === t.id
                            ? "border-signal bg-signal-tint shadow-md"
                            : "border-slate-200 hover:border-signal/50"
                        )}
                      >
                        <div className={cn("h-2 rounded-full mb-2", t.className)} />
                        <p className="text-xs font-bold text-signal">{t.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status & Remarks */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-signal">Approval Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-signal focus:ring-2 focus:ring-signal outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="pending">Pending Approval</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-signal">From Date</label>
                    <Input
                      name="fromDate"
                      type="date"
                      value={formData.fromDate}
                      onChange={handleChange}
                      className="rounded-xl border-slate-200 text-signal"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-signal">Remarks</label>
                  <textarea
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    placeholder="Optional note about this invoice..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 bg-white text-sm text-signal focus:ring-2 focus:ring-signal outline-none resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-full font-semibold h-11 px-6 order-3 sm:order-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Reset
                </Button>
                <Button
                  type="button"
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="rounded-full font-semibold h-11 px-6 text-signal border-signal/30 hover:bg-signal-tint order-2 sm:order-2"
                >
                  <Download className="w-4 h-4 mr-2" /> PDF
                </Button>
                <Button
                  type="submit"
                  className="rounded-full font-semibold h-11 px-8 bg-signal text-white hover:bg-signal-hover border-0 shadow-md order-1 sm:order-3"
                >
                  <Save className="w-4 h-4 mr-2" /> Save Invoice
                </Button>
              </div>
            </form>

            {/* RIGHT: LIVE PREVIEW */}
            <div className="space-y-5 lg:sticky lg:top-24 h-fit">
              <div className={cn("rounded-2xl p-6 text-white shadow-lg", templateConfig.className)}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5" />
                    <h3 className="font-heading font-bold">Live Preview</h3>
                  </div>
                  <span className="text-[10px] bg-white/20 px-2 py-1 rounded-full font-bold uppercase">
                    {formData.template}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="opacity-90">Company</span>
                    <span className="font-semibold text-right max-w-[160px] truncate">
                      {formData.selectedCompany?.name || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Invoice No</span>
                    <span className="font-semibold font-mono">{formData.invoiceNo || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Invoice Date</span>
                    <span className="font-semibold">{formData.invoiceDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Due Date</span>
                    <span className="font-semibold">{formData.dueDate}</span>
                  </div>

                  <div className="border-t border-white/20 my-3" />

                  <div className="flex justify-between">
                    <span className="opacity-90">Items</span>
                    <span className="font-semibold">{lineItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-90">Subtotal</span>
                    <span className="font-semibold">৳{calculations.subtotal.toFixed(2)}</span>
                  </div>
                  {formData.applyVat && (
                    <div className="flex justify-between">
                      <span className="opacity-90">VAT ({formData.vat}%)</span>
                      <span className="font-semibold">+৳{calculations.vatAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {formData.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="opacity-90">Discount ({formData.discount}%)</span>
                      <span className="font-semibold">-৳{calculations.discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="border-t border-white/20 my-3" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold uppercase tracking-wider opacity-90">
                      Grand Total
                    </span>
                    <span className="font-heading text-2xl font-bold">
                      ৳{calculations.grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint border border-signal/20">
                <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <div className="text-xs text-signal leading-relaxed">
                  <p className="font-bold mb-1">Pro Tips:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Form auto-saves every 2 seconds</li>
                    <li>Press <kbd className="px-1.5 py-0.5 rounded bg-white/70 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/70 font-mono text-[10px]">S</kbd> to save</li>
                    <li>Press <kbd className="px-1.5 py-0.5 rounded bg-white/70 font-mono text-[10px]">Esc</kbd> to close popups</li>
                    <li>Download PDF for printable invoice</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px]" onClick={() => setShowShortcuts(false)} />
          <div className="relative bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-signal" />
                <h3 className="font-heading text-xl font-bold text-signal">Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { keys: ["Ctrl", "S"], label: "Save Invoice" },
                { keys: ["Ctrl", "K"], label: "Toggle Shortcuts" },
                { keys: ["Esc"], label: "Close Popups" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-sm font-semibold text-signal">{s.label}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((k) => (
                      <kbd key={k} className="px-2 py-1 rounded-md bg-white border border-slate-200 text-xs font-mono font-bold text-signal">
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}