"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pencil, Trash2, Plus, X, Save, CheckCircle2, AlertCircle,
  Settings2, Shield, Link2, MessageSquare, Key, RefreshCw, Info
} from "lucide-react";
import { cn } from "@/lib/utils";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block">
        {required && <span className="text-signal">*</span>}
        {label}
      </span>
      {children}
    </div>
  );
}

interface CustomParam {
  id: number;
  key: string;
  value: string;
}

interface Gateway {
  id: number;
  name: string;
  url: string;
  method: string;
  sendToParam: string;
  messageToParam: string;
  authHeader: boolean;
  authUrl: boolean;
  headerKey: string;
  headerValue: string;
  urlKey: string;
  urlValue: string;
  customParams: CustomParam[];
  isActive: boolean;
}

// ডিফল্ট গেটওয়ে
const initialGateways: Gateway[] = [
  {
    id: 1,
    name: "BDbulkSMS",
    url: "https://api.bdbulksms.net/api.php",
    method: "GET",
    sendToParam: "to",
    messageToParam: "message",
    authHeader: true,
    authUrl: false,
    headerKey: "Authorization",
    headerValue: "Bearer YOUR_API_KEY",
    urlKey: "",
    urlValue: "",
    customParams: [
      { id: 1, key: "type", value: "text" },
      { id: 2, key: "sender", value: "SMARTISP" },
      { id: 3, key: "api_key", value: "YOUR_KEY" },
      { id: 4, key: "", value: "" },
    ],
    isActive: true,
  },
];

const emptyGateway: Gateway = {
  id: 0,
  name: "",
  url: "",
  method: "GET",
  sendToParam: "",
  messageToParam: "",
  authHeader: false,
  authUrl: false,
  headerKey: "",
  headerValue: "",
  urlKey: "",
  urlValue: "",
  customParams: [
    { id: 1, key: "", value: "" },
    { id: 2, key: "", value: "" },
    { id: 3, key: "", value: "" },
    { id: 4, key: "", value: "" },
  ],
  isActive: true,
};

export default function SmsSettingsPage() {
  const [gateways, setGateways] = useState<Gateway[]>(initialGateways);
  const [formData, setFormData] = useState<Gateway>(initialGateways[0]);
  const [editingId, setEditingId] = useState<number | null>(initialGateways[0].id);

  // হ্যান্ডেল চেঞ্জ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // কাস্টম প্যারামিটার হ্যান্ডলার
  const handleParamChange = (id: number, field: "key" | "value", value: string) => {
    setFormData((prev) => ({
      ...prev,
      customParams: prev.customParams.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    }));
  };

  const addParam = () => {
    const newId = Math.max(...formData.customParams.map((p) => p.id), 0) + 1;
    setFormData((prev) => ({
      ...prev,
      customParams: [...prev.customParams, { id: newId, key: "", value: "" }],
    }));
  };

  const removeParam = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      customParams: prev.customParams.filter((p) => p.id !== id),
    }));
  };

  // নতুন গেটওয়ে
  const handleAddNew = () => {
    const newId = Math.max(...gateways.map((g) => g.id), 0) + 1;
    setFormData({ ...emptyGateway, id: newId });
    setEditingId(null);
    alert("New gateway form ready. Fill in the details and click Save.");
  };

  // এডিট
  const handleEdit = (gateway: Gateway) => {
    setFormData(gateway);
    setEditingId(gateway.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // সেভ
  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("Gateway Name is required!");
      return;
    }
    if (!formData.url.trim()) {
      alert("Gateway URL is required!");
      return;
    }

    if (editingId) {
      // আপডেট
      setGateways((prev) =>
        prev.map((g) => (g.id === editingId ? { ...formData, id: editingId } : g))
      );
      alert(`Gateway "${formData.name}" updated successfully!`);
    } else {
      // নতুন
      const newId = Math.max(...gateways.map((g) => g.id), 0) + 1;
      setGateways((prev) => [...prev, { ...formData, id: newId }]);
      setEditingId(newId);
      alert(`Gateway "${formData.name}" added successfully!`);
    }
  };

  // ডিলিট
  const handleDelete = (id: number) => {
    const gateway = gateways.find((g) => g.id === id);
    if (!gateway) return;
    if (confirm(`Delete gateway "${gateway.name}"? This cannot be undone.`)) {
      setGateways((prev) => prev.filter((g) => g.id !== id));
      if (editingId === id) {
        setFormData(emptyGateway);
        setEditingId(null);
      }
      alert("Gateway deleted successfully!");
    }
  };

  // একটিভ টগল
  const handleToggleActive = (id: number) => {
    setGateways((prev) =>
      prev.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    );
  };

  // ক্যান্সেল এডিট
  const handleCancel = () => {
    setFormData(emptyGateway);
    setEditingId(null);
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              SMS Settings
            </h1>
            <Button
              onClick={handleAddNew}
              className="rounded-full gap-1.5 font-semibold bg-gradient-to-r from-signal to-violet-accent border-0"
            >
              <Plus className="h-4 w-4" /> Add Gateway
            </Button>
          </div>

          {/* Gateway Form */}
          <div className="bg-card rounded-2xl border shadow-sm overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-signal to-violet-accent text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings2 className="w-5 h-5" />
                <h2 className="font-heading font-bold text-lg">
                  {editingId ? `Edit Gateway: ${formData.name || "Untitled"}` : "Add New Gateway"}
                </h2>
              </div>
              {editingId && (
                <button
                  onClick={handleCancel}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full font-semibold flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Gateway Details */}
              <div>
                <div className="flex items-center gap-2 border-b pb-3 mb-5">
                  <Link2 className="w-5 h-5 text-signal" />
                  <h3 className="font-heading font-bold">Gateway Details</h3>
                </div>
                <div className="space-y-5">
                  <Field label="Gateway Name" required>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. BDbulkSMS"
                      className="rounded-xl"
                    />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Gateway URL" required>
                      <Input
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://api.example.com/send"
                        className="rounded-xl"
                      />
                    </Field>
                    <Field label="Request Method" required>
                      <select
                        name="method"
                        value={formData.method}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-4 py-2.5 bg-background text-sm focus:ring-2 focus:ring-signal outline-none"
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                      </select>
                    </Field>
                    <Field label="Send To Parameter" required>
                      <Input
                        name="sendToParam"
                        value={formData.sendToParam}
                        onChange={handleChange}
                        placeholder="e.g. to"
                        className="rounded-xl"
                      />
                    </Field>
                    <Field label="Message To Parameter" required>
                      <Input
                        name="messageToParam"
                        value={formData.messageToParam}
                        onChange={handleChange}
                        placeholder="e.g. message"
                        className="rounded-xl"
                      />
                    </Field>
                  </div>
                </div>
              </div>

              {/* Authentication */}
              <div>
                <div className="flex items-center gap-2 border-b pb-3 mb-5">
                  <Shield className="w-5 h-5 text-signal" />
                  <h3 className="font-heading font-bold">Authentication</h3>
                </div>

                <div className="flex items-center gap-6 mb-5">
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      name="authHeader"
                      checked={formData.authHeader}
                      onChange={handleChange}
                      className="rounded accent-signal w-4 h-4"
                    />
                    Header
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      name="authUrl"
                      checked={formData.authUrl}
                      onChange={handleChange}
                      className="rounded accent-signal w-4 h-4"
                    />
                    URL
                  </label>
                </div>

                {formData.authHeader && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-signal/5 border border-signal/20 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Field label="Header Key">
                      <Input
                        name="headerKey"
                        value={formData.headerKey}
                        onChange={handleChange}
                        placeholder="e.g. Authorization"
                        className="rounded-xl"
                      />
                    </Field>
                    <Field label="Header Value">
                      <Input
                        name="headerValue"
                        value={formData.headerValue}
                        onChange={handleChange}
                        placeholder="e.g. Bearer YOUR_API_KEY"
                        className="rounded-xl"
                      />
                    </Field>
                  </div>
                )}

                {formData.authUrl && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 rounded-2xl bg-violet-accent/5 border border-violet-accent/20 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Field label="URL Key">
                      <Input
                        name="urlKey"
                        value={formData.urlKey}
                        onChange={handleChange}
                        placeholder="e.g. api_key"
                        className="rounded-xl"
                      />
                    </Field>
                    <Field label="URL Value">
                      <Input
                        name="urlValue"
                        value={formData.urlValue}
                        onChange={handleChange}
                        placeholder="e.g. YOUR_KEY"
                        className="rounded-xl"
                      />
                    </Field>
                  </div>
                )}
              </div>

              {/* Custom Parameters */}
              <div>
                <div className="flex items-center justify-between border-b pb-3 mb-5">
                  <div className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-signal" />
                    <h3 className="font-heading font-bold">Custom Parameters</h3>
                  </div>
                  <button
                    type="button"
                    onClick={addParam}
                    className="text-xs font-semibold text-signal border border-signal/30 hover:bg-signal/5 px-3 py-1.5 rounded-full flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Add Parameter
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.customParams.map((param) => (
                    <div key={param.id} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                      <Field label="Parameter Key">
                        <Input
                          value={param.key}
                          onChange={(e) => handleParamChange(param.id, "key", e.target.value)}
                          placeholder="e.g. sender_id"
                          className="rounded-xl"
                        />
                      </Field>
                      <Field label="Parameter Value">
                        <Input
                          value={param.value}
                          onChange={(e) => handleParamChange(param.id, "value", e.target.value)}
                          placeholder="e.g. SMARTISP"
                          className="rounded-xl"
                        />
                      </Field>
                      <button
                        type="button"
                        onClick={() => removeParam(param.id)}
                        disabled={formData.customParams.length <= 1}
                        className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors disabled:opacity-30 mb-0.5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Update Gateway" : "Save Gateway"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="rounded-xl font-semibold h-12 px-6"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Gateways Table */}
          <div className="bg-card rounded-2xl border overflow-hidden shadow-sm">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-heading font-bold text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-signal" /> Configured Gateways
              </h2>
              <span className="bg-signal/10 text-signal text-xs font-semibold px-3 py-1 rounded-full border border-signal/20">
                {gateways.length} Gateway{gateways.length !== 1 ? "s" : ""}
              </span>
            </div>

            {gateways.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground">
                      <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider">Active</th>
                      <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider">Gateway Name</th>
                      <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider">URL</th>
                      <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider">Method</th>
                      <th className="text-left px-6 py-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-4 font-semibold text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gateways.map((g) => (
                      <tr
                        key={g.id}
                        className={cn(
                          "border-t hover:bg-muted/30 transition-colors",
                          editingId === g.id && "bg-signal/5"
                        )}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={g.isActive}
                            onChange={() => handleToggleActive(g.id)}
                            className="rounded accent-signal w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 font-semibold">{g.name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground max-w-xs truncate">
                          {g.url}
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2.5 py-1 rounded-md border border-violet-accent/20">
                            {g.method}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
                              g.isActive
                                ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/20"
                                : "bg-red-500/15 text-red-600 border border-red-500/20"
                            )}
                          >
                            <span className={cn("w-1.5 h-1.5 rounded-full", g.isActive ? "bg-emerald-500" : "bg-red-500")} />
                            {g.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => handleEdit(g)}
                              className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center hover:bg-signal/20 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(g.id)}
                              className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <div className="w-20 h-20 rounded-full bg-signal/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-10 h-10 text-signal" />
                </div>
                <h3 className="font-heading font-bold text-lg mb-1">No Gateways Configured</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs mb-5">
                  Add your first SMS gateway to start sending messages to your clients.
                </p>
                <Button
                  onClick={handleAddNew}
                  className="rounded-full gap-1.5 font-semibold bg-gradient-to-r from-signal to-violet-accent border-0"
                >
                  <Plus className="h-4 w-4" /> Add First Gateway
                </Button>
              </div>
            )}
          </div>

          {/* Info Banner */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-signal-tint/50 border border-signal/20 mt-6">
            <Info className="w-5 h-5 text-signal shrink-0 mt-0.5" />
            <p className="text-xs text-signal leading-relaxed">
              <span className="font-bold">Tip:</span> Configure multiple gateways for redundancy. Only
              the active gateway will be used for sending SMS. You can switch gateways by toggling the
              "Active" checkbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}