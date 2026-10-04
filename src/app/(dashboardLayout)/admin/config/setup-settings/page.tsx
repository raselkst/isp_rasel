"use client";

import { useState, useRef } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, Field, inputClass } from "@/components/config/shared";
import {
  Upload, Save, RefreshCw, Building2, Landmark, Settings, Wifi,
  MessageSquare, Bell, Image as ImageIcon, X, CheckCircle2, Copy,
  Plus, Trash2, Info, Phone, Mail, MapPin, Shield, Zap, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

const companyTabs = [
  { id: "general", label: "General Info", icon: Building2 },
  { id: "bank", label: "Bank Info", icon: Landmark },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "ppp", label: "PPP Settings", icon: Wifi },
  { id: "hotspot", label: "Hotspot Settings", icon: Zap },
];

const smsTabs = [
  { id: "sms-general", label: "General Info", icon: MessageSquare },
  { id: "sms-ppp", label: "PPP Settings", icon: Wifi },
  { id: "sms-hotspot", label: "Hotspot Settings", icon: Zap },
  { id: "sms-alert", label: "Alert Template", icon: Bell },
];

// Template Variables
const templateVars = [
  "{ClientName}", "{ClientUsername}", "{Balance}", "{Amount}", "{Fee}",
  "{TxnNo}", "{BillRef}", "{ACNumber}", "{ISPNickName}", "{ISPFullName}",
  "{ISPSupportNumber}", "{Sender}", "{FromUser}", "{ToUser}", "{Description}",
];

function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon: any }[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 border-b mb-6 pb-1">
      {tabs.map((t) => {
        const Icon = t.icon;
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-xl border-b-2 -mb-px transition-all",
              isActive
                ? "border-signal text-signal bg-signal/5"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="w-4 h-4" />
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

export default function SetupSettingsPage() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [companyTab, setCompanyTab] = useState("general");
  const [smsTab, setSmsTab] = useState("sms-general");
  const [isDirty, setIsDirty] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Company Data
  const [companyData, setCompanyData] = useState({
    name: "Refayetpur Broadband Network",
    shortName: "RBN",
    licenceNo: "N/A",
    email: "admin@rbnisp.net",
    ownerPhone: "01710626699",
    supportPhone: "01710626699",
    address: "N/A",
    website: "www.rbnisp.net",
    // Bank
    bankName: "",
    bankAccountName: "",
    bankAccountNo: "",
    bankBranch: "",
    bankRoutingNo: "",
    bkashNumber: "",
    nagadNumber: "",
    // Settings
    currency: "BDT",
    timezone: "Asia/Dhaka",
    dateFormat: "DD-MM-YYYY",
    invoicePrefix: "INV-",
    taxRate: 0,
    // PPP Settings
    pppoeServer: "",
    pppoePort: "1812",
    pppoeSecret: "",
    pppoeAuthMethod: "CHAP",
    // Hotspot Settings
    hotspotServer: "",
    hotspotPort: "80",
    hotspotLoginUrl: "",
    hotspotSessionTimeout: 3600,
  });

  // SMS Data
  const [smsData, setSmsData] = useState({
    onlineDepositTemplate: "Dear {ClientName}, your payment of {Amount} BDT (Fee: {Fee}) has been received successfully. TxnNo: {TxnNo}. Balance: {Balance} BDT. - {ISPNickName}",
    cashDepositTemplate: "Dear {ClientName}, your cash deposit of {Amount} BDT has been received. BillRef: {BillRef}. Balance: {Balance} BDT. - {ISPNickName}",
    resellerDepositTemplate: "Dear {ToUser}, {FromUser} has transferred {Amount} BDT to your account. Description: {Description}. - {ISPNickName}",
    pppoeLoginTemplate: "Dear {ClientName}, you have logged in successfully. Your IP is {ACNumber}. - {ISPNickName}",
    pppoeExpireTemplate: "Dear {ClientName}, your package will expire on {BillRef}. Please renew to continue. - {ISPNickName}",
    hotspotLoginTemplate: "Welcome {ClientName}! Your hotspot session has started. Balance: {Balance} BDT. - {ISPNickName}",
    hotspotExpireTemplate: "Dear {ClientName}, your hotspot session is about to expire. - {ISPNickName}",
    lowBalanceAlert: "Dear {ClientName}, your balance is low ({Balance} BDT). Please recharge. - {ISPNickName}",
    expiryAlert: "Dear {ClientName}, your subscription expires in 3 days on {BillRef}. - {ISPNickName}",
  });

  const handleCompanyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCompanyData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    setIsDirty(true);
  };

  const handleSmsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSmsData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handleLogoSelect = () => logoInputRef.current?.click();

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target?.result as string);
      setIsDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
    setIsDirty(true);
  };

  const handleSave = () => {
    console.log("Saving:", { companyData, smsData });
    alert("Settings saved successfully!\n\nAll changes have been applied.");
    setIsDirty(false);
  };

  const handleReset = () => {
    if (confirm("Reset all settings to default? Any unsaved changes will be lost.")) {
      window.location.reload();
    }
  };

  const insertVariable = (target: "onlineDepositTemplate" | "cashDepositTemplate" | "resellerDepositTemplate" | "pppoeLoginTemplate" | "pppoeExpireTemplate" | "hotspotLoginTemplate" | "hotspotExpireTemplate" | "lowBalanceAlert" | "expiryAlert", variable: string) => {
    setSmsData((prev) => ({ ...prev, [target]: prev[target] + " " + variable }));
    setIsDirty(true);
  };

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Template copied to clipboard!");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8 max-w-5xl">
          <PageHeader eyebrow="Config · Setup Settings" title="System Configuration">
            {isDirty && (
              <span className="bg-amber-500/15 text-amber-600 text-xs font-semibold px-3 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1">
                <Info className="w-3 h-3" /> Unsaved Changes
              </span>
            )}
          </PageHeader>

          {/* Company Configuration */}
          <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 p-7 sm:p-8 mb-8">
            <h2 className="font-heading text-xl font-bold mb-5 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-signal" /> Company Configuration
            </h2>

            <Tabs tabs={companyTabs} active={companyTab} onChange={setCompanyTab} />

            {/* General Info Tab */}
            {companyTab === "general" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <Field label="Name" required>
                  <Input
                    name="name"
                    value={companyData.name}
                    onChange={handleCompanyChange}
                    className={cn(inputClass, "border-signal ring-4 ring-signal/10")}
                  />
                </Field>
                <Field label="Short Name">
                  <Input
                    name="shortName"
                    value={companyData.shortName}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Licence No">
                  <Input
                    name="licenceNo"
                    value={companyData.licenceNo}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Email">
                  <Input
                    name="email"
                    type="email"
                    value={companyData.email}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Owner Phone No">
                  <Input
                    name="ownerPhone"
                    value={companyData.ownerPhone}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Support Phone No">
                  <Input
                    name="supportPhone"
                    value={companyData.supportPhone}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Website">
                  <Input
                    name="website"
                    value={companyData.website}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Address">
                  <Input
                    name="address"
                    value={companyData.address}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <div className="space-y-2 sm:col-span-2">
                  <span className="font-semibold text-sm block">Company Logo</span>
                  {logoPreview ? (
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border">
                      <img src={logoPreview} alt="Logo Preview" className="w-20 h-20 rounded-xl object-cover border-2 border-signal/20" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">Logo uploaded</p>
                        <p className="text-xs text-muted-foreground">Click remove to upload a new one</p>
                      </div>
                      <button
                        onClick={handleRemoveLogo}
                        className="w-9 h-9 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleLogoSelect}
                        variant="outline"
                        className="rounded-2xl gap-1.5 font-semibold shrink-0"
                      >
                        <Upload className="h-3.5 w-3.5" /> Choose file
                      </Button>
                      <span className="text-sm text-muted-foreground">No file selected</span>
                    </div>
                  )}
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </div>
              </div>
            )}

            {/* Bank Info Tab */}
            {companyTab === "bank" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <Field label="Bank Name">
                  <Input
                    name="bankName"
                    value={companyData.bankName}
                    onChange={handleCompanyChange}
                    placeholder="e.g. Dutch Bangla Bank"
                    className={inputClass}
                  />
                </Field>
                <Field label="Account Name">
                  <Input
                    name="bankAccountName"
                    value={companyData.bankAccountName}
                    onChange={handleCompanyChange}
                    placeholder="e.g. Refayetpur Broadband"
                    className={inputClass}
                  />
                </Field>
                <Field label="Account Number">
                  <Input
                    name="bankAccountNo"
                    value={companyData.bankAccountNo}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 1234567890"
                    className={inputClass}
                  />
                </Field>
                <Field label="Branch">
                  <Input
                    name="bankBranch"
                    value={companyData.bankBranch}
                    onChange={handleCompanyChange}
                    placeholder="e.g. Mirpur Branch"
                    className={inputClass}
                  />
                </Field>
                <Field label="Routing Number">
                  <Input
                    name="bankRoutingNo"
                    value={companyData.bankRoutingNo}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 090261234"
                    className={inputClass}
                  />
                </Field>
                <Field label="bKash Number">
                  <Input
                    name="bkashNumber"
                    value={companyData.bkashNumber}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 01716102651"
                    className={inputClass}
                  />
                </Field>
                <Field label="Nagad Number">
                  <Input
                    name="nagadNumber"
                    value={companyData.nagadNumber}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 01716102652"
                    className={inputClass}
                  />
                </Field>
              </div>
            )}

            {/* Settings Tab */}
            {companyTab === "settings" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <Field label="Currency">
                  <select
                    name="currency"
                    value={companyData.currency}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  >
                    <option value="BDT">BDT (৳)</option>
                    <option value="USD">USD ($)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </Field>
                <Field label="Timezone">
                  <select
                    name="timezone"
                    value={companyData.timezone}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </Field>
                <Field label="Date Format">
                  <select
                    name="dateFormat"
                    value={companyData.dateFormat}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  >
                    <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                    <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </Field>
                <Field label="Invoice Prefix">
                  <Input
                    name="invoicePrefix"
                    value={companyData.invoicePrefix}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Tax Rate (%)">
                  <Input
                    name="taxRate"
                    type="number"
                    value={companyData.taxRate}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}

            {/* PPP Settings Tab */}
            {companyTab === "ppp" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <Field label="PPPoE Server">
                  <Input
                    name="pppoeServer"
                    value={companyData.pppoeServer}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 192.168.1.1"
                    className={inputClass}
                  />
                </Field>
                <Field label="PPPoE Port">
                  <Input
                    name="pppoePort"
                    value={companyData.pppoePort}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="PPPoE Secret">
                  <Input
                    name="pppoeSecret"
                    type="password"
                    value={companyData.pppoeSecret}
                    onChange={handleCompanyChange}
                    placeholder="••••••••"
                    className={inputClass}
                  />
                </Field>
                <Field label="Auth Method">
                  <select
                    name="pppoeAuthMethod"
                    value={companyData.pppoeAuthMethod}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  >
                    <option value="CHAP">CHAP</option>
                    <option value="PAP">PAP</option>
                    <option value="MSCHAP">MSCHAP</option>
                  </select>
                </Field>
              </div>
            )}

            {/* Hotspot Settings Tab */}
            {companyTab === "hotspot" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <Field label="Hotspot Server">
                  <Input
                    name="hotspotServer"
                    value={companyData.hotspotServer}
                    onChange={handleCompanyChange}
                    placeholder="e.g. 192.168.1.2"
                    className={inputClass}
                  />
                </Field>
                <Field label="Hotspot Port">
                  <Input
                    name="hotspotPort"
                    value={companyData.hotspotPort}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Login URL">
                  <Input
                    name="hotspotLoginUrl"
                    value={companyData.hotspotLoginUrl}
                    onChange={handleCompanyChange}
                    placeholder="e.g. http://login.rbnisp.net"
                    className={inputClass}
                  />
                </Field>
                <Field label="Session Timeout (seconds)">
                  <Input
                    name="hotspotSessionTimeout"
                    type="number"
                    value={companyData.hotspotSessionTimeout}
                    onChange={handleCompanyChange}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </div>

          {/* SMS Settings */}
          <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 p-7 sm:p-8">
            <h2 className="font-heading text-xl font-bold mb-5 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-signal" /> SMS Settings
            </h2>

            <Tabs tabs={smsTabs} active={smsTab} onChange={setSmsTab} />

            {/* SMS General Tab */}
            {smsTab === "sms-general" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="grid grid-cols-1 gap-6">
                  <SmsTemplateField
                    label="Online Deposit SMS Template"
                    name="onlineDepositTemplate"
                    value={smsData.onlineDepositTemplate}
                    onChange={handleSmsChange}
                    onInsertVar={(v) => insertVariable("onlineDepositTemplate", v)}
                    onCopy={() => handleCopyTemplate(smsData.onlineDepositTemplate)}
                  />
                  <SmsTemplateField
                    label="Cash Deposit SMS Template"
                    name="cashDepositTemplate"
                    value={smsData.cashDepositTemplate}
                    onChange={handleSmsChange}
                    onInsertVar={(v) => insertVariable("cashDepositTemplate", v)}
                    onCopy={() => handleCopyTemplate(smsData.cashDepositTemplate)}
                  />
                  <SmsTemplateField
                    label="Reseller Cash Deposit SMS Template"
                    name="resellerDepositTemplate"
                    value={smsData.resellerDepositTemplate}
                    onChange={handleSmsChange}
                    onInsertVar={(v) => insertVariable("resellerDepositTemplate", v)}
                    onCopy={() => handleCopyTemplate(smsData.resellerDepositTemplate)}
                  />
                </div>
              </div>
            )}

            {/* SMS PPP Tab */}
            {smsTab === "sms-ppp" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <SmsTemplateField
                  label="PPPoE Login SMS"
                  name="pppoeLoginTemplate"
                  value={smsData.pppoeLoginTemplate}
                  onChange={handleSmsChange}
                  onInsertVar={(v) => insertVariable("pppoeLoginTemplate", v)}
                  onCopy={() => handleCopyTemplate(smsData.pppoeLoginTemplate)}
                />
                <SmsTemplateField
                  label="PPPoE Expire SMS"
                  name="pppoeExpireTemplate"
                  value={smsData.pppoeExpireTemplate}
                  onChange={handleSmsChange}
                  onInsertVar={(v) => insertVariable("pppoeExpireTemplate", v)}
                  onCopy={() => handleCopyTemplate(smsData.pppoeExpireTemplate)}
                />
              </div>
            )}

            {/* SMS Hotspot Tab */}
            {smsTab === "sms-hotspot" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <SmsTemplateField
                  label="Hotspot Login SMS"
                  name="hotspotLoginTemplate"
                  value={smsData.hotspotLoginTemplate}
                  onChange={handleSmsChange}
                  onInsertVar={(v) => insertVariable("hotspotLoginTemplate", v)}
                  onCopy={() => handleCopyTemplate(smsData.hotspotLoginTemplate)}
                />
                <SmsTemplateField
                  label="Hotspot Expire SMS"
                  name="hotspotExpireTemplate"
                  value={smsData.hotspotExpireTemplate}
                  onChange={handleSmsChange}
                  onInsertVar={(v) => insertVariable("hotspotExpireTemplate", v)}
                  onCopy={() => handleCopyTemplate(smsData.hotspotExpireTemplate)}
                />
              </div>
            )}

            {/* SMS Alert Tab */}
            {smsTab === "sms-alert" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-300">
                <SmsTemplateField
                  label="Low Balance Alert"
                  name="lowBalanceAlert"
                  value={smsData.lowBalanceAlert}
                  onChange={handleSmsChange}
                  onInsertVar={(v) => insertVariable("lowBalanceAlert", v)}
                  onCopy={() => handleCopyTemplate(smsData.lowBalanceAlert)}
                />
                <SmsTemplateField
                  label="Expiry Alert (3 days before)"
                  name="expiryAlert"
                  value={smsData.expiryAlert}
                  onChange={handleSmsChange}
                  onInsertVar={(v) => insertVariable("expiryAlert", v)}
                  onCopy={() => handleCopyTemplate(smsData.expiryAlert)}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-end mt-8 pt-6 border-t">
              <Button
                onClick={handleReset}
                variant="outline"
                className="rounded-2xl font-semibold h-12 px-6"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Reset
              </Button>
              <Button
                onClick={handleSave}
                className={cn(
                  "rounded-2xl font-semibold h-12 px-8 bg-gradient-to-r from-signal to-violet-accent border-0",
                  isDirty && "shadow-lg shadow-signal/30"
                )}
              >
                <Save className="w-4 h-4 mr-2" /> Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// SMS Template Field Component
function SmsTemplateField({
  label,
  name,
  value,
  onChange,
  onInsertVar,
  onCopy,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onInsertVar: (v: string) => void;
  onCopy: () => void;
}) {
  const [showVars, setShowVars] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-sm">{label}</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowVars(!showVars)}
            className="text-xs text-signal hover:underline font-semibold flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Variables
          </button>
          <button
            type="button"
            onClick={onCopy}
            className="text-xs text-muted-foreground hover:text-signal font-semibold flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>
      </div>

      {showVars && (
        <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-muted/30 border animate-in fade-in duration-200">
          {templateVars.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onInsertVar(v)}
              className="text-[10px] font-mono bg-signal/10 text-signal px-2 py-1 rounded-md border border-signal/20 hover:bg-signal/20 transition-colors"
            >
              {v}
            </button>
          ))}
        </div>
      )}

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`${inputClass} min-h-[100px] font-mono text-xs`}
      />
      <p className="text-[10px] text-muted-foreground text-right">
        {value.length} characters · {Math.ceil(value.length / 160)} SMS
      </p>
    </div>
  );
}