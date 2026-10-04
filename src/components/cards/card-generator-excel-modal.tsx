"use client";

import { useState, useRef, useMemo } from "react";
import { CenteredFormModal } from "@/components/cards/centered-form-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload, FileSpreadsheet, Loader2, CheckCircle2, Download, RefreshCw,
  X, AlertCircle, FileText, Table, Eye, Trash2, Sparkles, ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CardGeneratorExcelModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

// ডাইনামিক ড্রপডাউন ডেটা
const users = ["Admin", "Reseller-A", "Reseller-B", "Al Jaami Tech"];
const protocols = ["Hotspot", "PPPoE", "Static"];

// ম্যাপিং ফিল্ড
const mappingFields = [
  { key: "cardNo", label: "Card No", required: true },
  { key: "package", label: "Package", required: true },
  { key: "protocol", label: "Protocol", required: false },
  { key: "server", label: "Server", required: false },
  { key: "expiry", label: "Expiry Date", required: false },
];

// ডামি এক্সেল ডেটা (আপলোডের পর দেখানোর জন্য)
const mockExcelData = {
  fileName: "cards-import-template.xlsx",
  fileSize: "12.4 KB",
  columns: ["Card No", "Package", "Protocol", "Server", "Expiry"],
  rows: [
    { cardNo: "CARD-100001", package: "1Day-5GB", protocol: "Hotspot", server: "SERVER-3", expiry: "2025-10-15" },
    { cardNo: "CARD-100002", package: "7Day-50GB", protocol: "PPPoE", server: "SERVER-2", expiry: "2025-10-22" },
    { cardNo: "CARD-100003", package: "30Day-500GB", protocol: "Hotspot", server: "SERVER-4", expiry: "2025-11-15" },
    { cardNo: "CARD-100004", package: "1Hour-Unlimited", protocol: "Hotspot", server: "SERVER-3", expiry: "2025-10-08" },
    { cardNo: "CARD-100005", package: "1Day-5GB", protocol: "PPPoE", server: "SERVER-5", expiry: "2025-10-18" },
  ],
};

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

export function CardGeneratorExcelModal({ open, onClose, onSubmit }: CardGeneratorExcelModalProps) {
  const [formData, setFormData] = useState({
    user: "",
    protocol: "Hotspot",
    server: "",
    overwriteDuplicates: false,
    autoGenerateRef: true,
  });

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>({
    cardNo: "Card No",
    package: "Package",
    protocol: "Protocol",
    server: "Server",
    expiry: "Expiry",
  });
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // ফাইল হ্যান্ডলার
  const handleFileSelect = (selectedFile: File) => {
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(xlsx|xls|csv)$/i)) {
      alert("Please select a valid Excel (.xlsx, .xls) or CSV file.");
      return;
    }
    setFile(selectedFile);
    setShowPreview(true);
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileSelect(droppedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFileSelect(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setShowPreview(false);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // টেমপ্লেট ডাউনলোড
  const handleDownloadTemplate = () => {
    const headers = "Card No,Package,Protocol,Server,Expiry";
    const sampleRows = [
      "CARD-100001,1Day-5GB,Hotspot,SERVER-3,2025-10-15",
      "CARD-100002,7Day-50GB,PPPoE,SERVER-2,2025-10-22",
    ].join("\n");
    const csv = `${headers}\n${sampleRows}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "cards-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // ইমপোর্ট হ্যান্ডলার
  const handleImport = () => {
    if (!formData.user) {
      alert("Please select a User.");
      return;
    }
    if (!formData.server) {
      alert("Please select a Server.");
      return;
    }
    if (!file) {
      alert("Please upload an Excel file.");
      return;
    }

    setIsImporting(true);
    setProgress(0);
    setResult(null);

    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsImporting(false);
        // সফল ও ফেইলড রেজাল্ট
        setResult({ success: mockExcelData.rows.length, failed: 0 });
      }
    }, 100);
  };

  // Reset
  const handleReset = () => {
    setFormData({
      user: "",
      protocol: "Hotspot",
      server: "",
      overwriteDuplicates: false,
      autoGenerateRef: true,
    });
    setFile(null);
    setShowPreview(false);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ম্যাপিং আপডেট
  const handleMappingChange = (field: string, column: string) => {
    setMapping((prev) => ({ ...prev, [field]: column }));
  };

  return (
    <CenteredFormModal
      open={open}
      onClose={onClose}
      title="Card Generator (Excel Import)"
      hideSubmit
    >
      {/* Dropzone / File Upload */}
      {!file ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-3 transition-all cursor-pointer",
            isDragging
              ? "border-signal bg-signal/5 scale-[1.01]"
              : "border-border bg-muted/20 hover:border-signal/50 hover:bg-signal/5"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInput}
            className="hidden"
          />
          <div className="w-16 h-16 rounded-full bg-signal/10 flex items-center justify-center">
            <Upload className={cn("w-8 h-8 transition-colors", isDragging ? "text-signal" : "text-signal/70")} />
          </div>
          <div className="text-center">
            <p className="font-heading font-bold text-foreground">
              {isDragging ? "Drop file here" : "Upload Excel File"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Drag & drop or click to select (.xlsx, .xls, .csv)
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full font-semibold text-signal border-signal/30 mt-2"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> Select File
          </Button>
        </div>
      ) : (
        /* File Preview */
        <div className="rounded-2xl border bg-muted/20 p-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB · Ready to import
              </p>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Remove file"
            >
              <X className="w-4 h-4 text-red-500" />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadTemplate}
              className="flex-1 rounded-full text-xs font-semibold"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Template
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex-1 rounded-full text-xs font-semibold text-signal border-signal/30"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5" />
              {showPreview ? "Hide" : "Preview"}
            </Button>
          </div>
        </div>
      )}

      {/* Excel Preview Table */}
      {showPreview && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-signal" />
            <p className="text-sm font-semibold">Data Preview</p>
            <span className="text-xs text-muted-foreground">
              ({mockExcelData.rows.length} rows)
            </span>
          </div>
          <div className="max-h-56 overflow-y-auto rounded-2xl border bg-muted/20">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-signal text-signal-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">#</th>
                  {mockExcelData.columns.map((c) => (
                    <th key={c} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockExcelData.rows.map((row, i) => (
                  <tr key={i} className="border-t hover:bg-muted/30">
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-mono font-semibold text-signal">{row.cardNo}</td>
                    <td className="px-3 py-2">{row.package}</td>
                    <td className="px-3 py-2">{row.protocol}</td>
                    <td className="px-3 py-2">{row.server}</td>
                    <td className="px-3 py-2 text-muted-foreground">{row.expiry}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Column Mapping */}
      {file && showPreview && (
        <div className="space-y-3 p-5 rounded-2xl bg-muted/30 border animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-signal" />
            <p className="text-sm font-semibold">Column Mapping</p>
          </div>
          {mappingFields.map((field) => (
            <div key={field.key} className="grid grid-cols-2 gap-3 items-center">
              <label className="text-xs font-semibold text-muted-foreground">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <select
                value={mapping[field.key] || ""}
                onChange={(e) => handleMappingChange(field.key, e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 bg-background text-xs focus:ring-2 focus:ring-signal outline-none"
              >
                <option value="">-- Select --</option>
                {mockExcelData.columns.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="User" required>
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
            onChange={handleChange}
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
            <option value="SERVER-2">SERVER-2</option>
            <option value="SERVER-3">SERVER-3</option>
            <option value="SERVER-4">SERVER-4</option>
          </select>
        </Field>

        <div className="flex items-end">
          <label className="flex items-center gap-3 p-3 rounded-xl border border-input hover:bg-muted/30 cursor-pointer transition-colors w-full">
            <input
              type="checkbox"
              name="overwriteDuplicates"
              checked={formData.overwriteDuplicates}
              onChange={handleChange}
              className="w-4 h-4 rounded border-input text-signal focus:ring-signal cursor-pointer"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold">Overwrite Duplicates</p>
              <p className="text-xs text-muted-foreground">Replace existing card numbers</p>
            </div>
          </label>
        </div>
      </div>

      {/* Import Button */}
      <div className="flex gap-3">
        <Button
          onClick={handleImport}
          disabled={isImporting || !file}
          className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
        >
          {isImporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" /> Import & Generate Cards
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

      {/* Progress Bar */}
      {isImporting && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Importing cards from Excel...</span>
            <span className="text-signal">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-signal to-violet-accent transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-heading font-bold text-emerald-700">Import Completed!</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="bg-background/60 rounded-xl p-3">
                  <p className="text-[10px] text-emerald-700 font-semibold uppercase mb-1">Success</p>
                  <p className="font-heading font-bold text-xl text-emerald-600">{result.success}</p>
                </div>
                <div className="bg-background/60 rounded-xl p-3">
                  <p className="text-[10px] text-red-600 font-semibold uppercase mb-1">Failed</p>
                  <p className="font-heading font-bold text-xl text-red-600">{result.failed}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleDownloadTemplate}
                  className="rounded-full text-xs font-semibold"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download CSV
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="rounded-full text-xs font-semibold"
                >
                  <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Import Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      {!file && !isImporting && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-signal/5 border border-signal/20">
          <AlertCircle className="w-4 h-4 text-signal shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload an Excel (.xlsx/.xls) or CSV file containing card numbers, then map the columns to system fields. 
            Click <strong className="text-signal">Import & Generate Cards</strong> to bulk-create cards.
          </p>
        </div>
      )}
    </CenteredFormModal>
  );
}