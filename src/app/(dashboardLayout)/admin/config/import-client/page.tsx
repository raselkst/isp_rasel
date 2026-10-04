"use client";

import { useState, useRef, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Field, inputClass } from "@/components/config/shared";
import {
  Download, Upload, FileSpreadsheet, X, CheckCircle2, AlertCircle,
  Trash2, Eye, RefreshCw, Play, Info, FileText, Users, Zap,
  ShieldCheck, TrendingUp, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

// ড্রপডাউন অপশন (রিয়েল অ্যাপে API থেকে আসবে)
const popInCharges = ["RBN Bappy (Admin)", "Reseller-A", "Reseller-B", "NSP"];
const servers = ["SERVER-2", "SERVER-3", "SERVER-4"];
const protocols = ["PPPoE", "Hotspot", "Static"];
const billingCycles = ["Monthly", "Weekly", "Custom", "Quarterly"];
const dateFormats = [
  "DD-MM-YY (12-07-2025)",
  "DD/MM/YYYY (12/07/2025)",
  "MM-DD-YY (07-12-2025)",
  "YYYY-MM-DD (2025-07-12)",
];

// মক প্রিভিউ ডেটা (ফাইল আপলোডের পর দেখানোর জন্য)
const mockPreviewData = [
  { id: 1, name: "Mogul Ali", mobile: "01716102651", package: "10Mbps_Package", address: "Mirpur, Dhaka", valid: true },
  { id: 2, name: "Rahim Uddin", mobile: "01716102652", package: "12Mbps_Package", address: "Uttara, Dhaka", valid: true },
  { id: 3, name: "Karim Hossain", mobile: "01716102653", package: "8Mbps_Package", address: "Banani, Dhaka", valid: true },
  { id: 4, name: "Sabbir Ahmed", mobile: "invalid-phone", package: "15Mbps_Package", address: "Gulshan, Dhaka", valid: false },
  { id: 5, name: "Nusrat Jahan", mobile: "01716102655", package: "10Mbps_Package", address: "Dhanmondi, Dhaka", valid: true },
  { id: 6, name: "Arif Hossain", mobile: "01716102656", package: "8Mbps_Package", address: "Mohammadpur, Dhaka", valid: true },
  { id: 7, name: "Shakib Khan", mobile: "01716102657", package: "20Mbps_Package", address: "Bashundhara, Dhaka", valid: true },
  { id: 8, name: "Tasnim Akter", mobile: "", package: "10Mbps_Package", address: "Badda, Dhaka", valid: false },
];

export default function ImportClientPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    popInCharge: "",
    server: "",
    protocol: "",
    billingCycle: "Monthly",
    expireDate: "",
    dateFormat: dateFormats[0],
    createdDateFormat: dateFormats[0],
    skipDuplicates: true,
    updateExisting: false,
    sendWelcomeSms: true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewData, setPreviewData] = useState<typeof mockPreviewData | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ success: number; failed: number } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ফাইল হ্যান্ডলিং
  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert("Please select a valid Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    setFile(selectedFile);
    setImportResult(null);
    // প্রিভিউ ডেটা লোড করার মক
    setTimeout(() => {
      setPreviewData(mockPreviewData);
    }, 500);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewData(null);
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // স্যাম্পল ফাইল ডাউনলোড
  const handleDownloadSample = () => {
    const headers = "Name,Mobile,Package,Address,Expire Date";
    const rows = [
      "Mogul Ali,01716102651,10Mbps_Package,Mirpur Dhaka,2025-12-31",
      "Rahim Uddin,01716102652,12Mbps_Package,Uttara Dhaka,2025-12-31",
      "Karim Hossain,01716102653,8Mbps_Package,Banani Dhaka,2025-12-31",
    ].join("\n");
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-client-import.csv";
    link.click();
    URL.revokeObjectURL(url);
    alert("Sample file downloaded successfully!");
  };

  // প্রিভিউ ভ্যালিডেশন স্ট্যাট
  const validationStats = useMemo(() => {
    if (!previewData) return { total: 0, valid: 0, invalid: 0 };
    const valid = previewData.filter((d) => d.valid).length;
    return { total: previewData.length, valid, invalid: previewData.length - valid };
  }, [previewData]);

  // ইমপোর্ট
  const handleImport = () => {
    // ভ্যালিডেশন
    if (!formData.popInCharge) { alert("Please select Pop In-Charge."); return; }
    if (!formData.server) { alert("Please select Server."); return; }
    if (!formData.protocol) { alert("Please select Protocol."); return; }
    if (!file) { alert("Please select an Excel file to import."); return; }
    if (!previewData) { alert("Please wait while the file is being analyzed."); return; }

    setImporting(true);
    setImportProgress(0);
    setImportResult(null);

    // প্রোগ্রেস অ্যানিমেশন
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        setImportProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setImporting(false);
          setImportResult({ success: validationStats.valid, failed: validationStats.invalid });
          alert(`Import Complete!\n\n✅ Success: ${validationStats.valid}\n❌ Failed: ${validationStats.invalid}`);
        }, 400);
      } else {
        setImportProgress(progress);
      }
    }, 200);
  };

  const handleReset = () => {
    setFormData({
      popInCharge: "",
      server: "",
      protocol: "",
      billingCycle: "Monthly",
      expireDate: "",
      dateFormat: dateFormats[0],
      createdDateFormat: dateFormats[0],
      skipDuplicates: true,
      updateExisting: false,
      sendWelcomeSms: true,
    });
    handleRemoveFile();
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8 max-w-6xl">
          <PageHeader eyebrow="Config" title="Client Import Excel">
            <Button
              onClick={handleDownloadSample}
              variant="outline"
              className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
            >
              <Download className="h-4 w-4" /> Download Sample
            </Button>
          </PageHeader>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
            {/* Left: Configuration Form */}
            <div className="space-y-6">
              {/* Configuration Card */}
              <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 overflow-hidden">
                <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-signal to-violet-accent text-white">
                  <span className="flex items-center gap-2 font-heading font-bold text-lg">
                    <FileSpreadsheet className="h-5 w-5" /> Client Import Configuration
                  </span>
                </div>

                <div className="p-7 sm:p-8 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Pop In-Charge" required>
                      <select
                        name="popInCharge"
                        value={formData.popInCharge}
                        onChange={handleChange}
                        className={cn(inputClass, "border-signal ring-4 ring-signal/10")}
                      >
                        <option value="">Choose Pop In-Charge</option>
                        {popInCharges.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Server" required>
                      <select
                        name="server"
                        value={formData.server}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Choose Server</option>
                        {servers.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Protocol" required>
                      <select
                        name="protocol"
                        value={formData.protocol}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Protocol Select</option>
                        {protocols.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Billing Cycle" required>
                      <select
                        name="billingCycle"
                        value={formData.billingCycle}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {billingCycles.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Expire Date (Optional)">
                      <input
                        name="expireDate"
                        type="date"
                        value={formData.expireDate}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Date Format" required>
                      <select
                        name="dateFormat"
                        value={formData.dateFormat}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {dateFormats.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Created Date Format (Optional)">
                      <select
                        name="createdDateFormat"
                        value={formData.createdDateFormat}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        {dateFormats.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 overflow-hidden">
                <div className="px-8 py-5 border-b">
                  <span className="flex items-center gap-2 font-heading font-bold text-lg">
                    <Upload className="h-5 w-5 text-signal" /> Upload Excel File
                  </span>
                </div>

                <div className="p-7 sm:p-8 space-y-5">
                  {/* Drag & Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={!file ? handleBrowseClick : undefined}
                    className={cn(
                      "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer",
                      isDragging
                        ? "border-signal bg-signal/10 scale-[1.01]"
                        : file
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-signal/30 bg-signal/5 hover:bg-signal/10 hover:border-signal"
                    )}
                  >
                    {file ? (
                      <>
                        <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mb-4">
                          <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                        </div>
                        <p className="font-semibold text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(file.size / 1024).toFixed(2)} KB · Ready to import
                        </p>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                          className="mt-4 text-xs font-semibold text-destructive hover:underline flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Remove File
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-signal/15 flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-signal" />
                        </div>
                        <p className="font-heading font-bold text-foreground mb-1">
                          Drag & Drop your file here
                        </p>
                        <p className="text-xs text-muted-foreground mb-4">
                          or click to browse from your computer
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
                        >
                          <Upload className="h-3.5 w-3.5" /> Browse File
                        </Button>
                        <p className="text-[10px] text-muted-foreground mt-3">
                          Supported formats: .xlsx, .xls, .csv
                        </p>
                      </>
                    )}
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* Advanced Options */}
                  <div className="pt-5 border-t space-y-3">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3">
                      Advanced Options
                    </p>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        name="skipDuplicates"
                        checked={formData.skipDuplicates}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-signal" /> Skip Duplicate Mobile Numbers
                        </p>
                        <p className="text-xs text-muted-foreground">Existing clients with the same mobile will be skipped</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        name="updateExisting"
                        checked={formData.updateExisting}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Update Existing Clients
                        </p>
                        <p className="text-xs text-muted-foreground">Update data for existing clients instead of skipping</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        name="sendWelcomeSms"
                        checked={formData.sendWelcomeSms}
                        onChange={handleChange}
                        className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5 text-violet-accent" /> Send Welcome SMS
                        </p>
                        <p className="text-xs text-muted-foreground">Send a welcome SMS to all imported clients</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="rounded-2xl font-semibold h-12 px-6"
                >
                  Reset
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || !file}
                  className="flex-1 rounded-2xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
                >
                  {importing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" /> Start Import
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Right: Preview & Stats */}
            <div className="space-y-5 lg:sticky lg:top-24 h-fit">
              {/* Stats Card */}
              <div className="bg-gradient-to-br from-signal to-violet-accent rounded-2xl p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-5">
                  <Eye className="w-5 h-5" />
                  <h3 className="font-heading font-bold">File Preview</h3>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white/15 rounded-xl p-3 text-center">
                    <p className="text-[10px] uppercase opacity-90 font-semibold">Total</p>
                    <p className="font-heading text-xl font-bold">{validationStats.total}</p>
                  </div>
                  <div className="bg-emerald-500/30 rounded-xl p-3 text-center">
                    <p className="text-[10px] uppercase opacity-90 font-semibold">Valid</p>
                    <p className="font-heading text-xl font-bold">{validationStats.valid}</p>
                  </div>
                  <div className="bg-red-500/30 rounded-xl p-3 text-center">
                    <p className="text-[10px] uppercase opacity-90 font-semibold">Invalid</p>
                    <p className="font-heading text-xl font-bold">{validationStats.invalid}</p>
                  </div>
                </div>
              </div>

              {/* Import Progress */}
              {importing && (
                <div className="bg-card rounded-2xl border shadow-sm p-5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Importing...</p>
                    <p className="text-xs text-signal font-bold">{Math.round(importProgress)}%</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-signal to-violet-accent transition-all duration-300"
                      style={{ width: `${importProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Import Result */}
              {importResult && (
                <div className="bg-card rounded-2xl border shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <p className="font-heading font-bold">Import Complete</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/10 rounded-xl p-3 border border-emerald-500/20">
                      <p className="text-[10px] uppercase text-emerald-700 font-semibold">Success</p>
                      <p className="font-heading text-lg font-bold text-emerald-700">{importResult.success}</p>
                    </div>
                    <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
                      <p className="text-[10px] uppercase text-red-700 font-semibold">Failed</p>
                      <p className="font-heading text-lg font-bold text-red-700">{importResult.failed}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              {previewData && previewData.length > 0 && (
                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b">
                    <p className="text-sm font-semibold">Data Preview</p>
                    <span className="text-xs text-muted-foreground">
                      Showing {Math.min(previewData.length, 5)} of {previewData.length}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr>
                          <th className="text-left px-3 py-2 font-semibold">Name</th>
                          <th className="text-left px-3 py-2 font-semibold">Mobile</th>
                          <th className="text-left px-3 py-2 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(0, 5).map((row) => (
                          <tr key={row.id} className="border-t">
                            <td className="px-3 py-2">{row.name}</td>
                            <td className="px-3 py-2 font-mono text-[10px]">{row.mobile || "—"}</td>
                            <td className="px-3 py-2">
                              {row.valid ? (
                                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                                  <CheckCircle2 className="w-3 h-3" /> Valid
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-red-600 font-semibold">
                                  <AlertCircle className="w-3 h-3" /> Invalid
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Info Card */}
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20">
                <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
                <p className="text-xs text-signal leading-relaxed">
                  <span className="font-bold">Tip:</span> Download the sample file first to see the
                  required format. Invalid rows (like empty mobile numbers) will be skipped automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}