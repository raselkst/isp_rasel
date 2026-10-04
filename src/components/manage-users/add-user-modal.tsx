"use client";

import { useState } from "react";
import { X, UserPlus, User, Mail, Lock, Phone, DollarSign, Server, Shield, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
}

// 🎯 Field কম্পোনেন্ট (আইকন সাপোর্ট সহ)
function Field({
  label,
  icon: Icon,
  required,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-signal" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

// 🎯 ইনপুট স্টাইল
const inputClass =
  "w-full border-2 border-border/70 rounded-xl px-4 py-2.5 bg-muted/20 text-sm outline-none transition-all focus:border-signal focus:ring-4 focus:ring-signal/10 focus:bg-card placeholder:text-muted-foreground/60";

// 🎯 রোল কনফিগ (আগের পেজ থেকে)
const roleConfig: Record<string, { bg: string; color: string; icon: any }> = {
  Admin: { bg: "bg-signal/10", color: "text-signal", icon: Shield },
  Reseller: { bg: "bg-violet-500/10", color: "text-violet-600", icon: User },
  "POP In-charge": { bg: "bg-amber-500/10", color: "text-amber-600", icon: User },
  Manager: { bg: "bg-emerald-500/10", color: "text-emerald-600", icon: User },
};

// 🎯 অ্যাভাটার কালার
const getAvatarColor = (name: string) => {
  const colors = [
    "from-blue-500 to-cyan-500",
    "from-violet-500 to-purple-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
    "from-pink-500 to-rose-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index] || "from-signal to-violet-accent";
};

export function AddUserModal({ open, onClose, onSubmit }: AddUserModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    phone: "",
    commission: "",
    server: "",
    role: "Admin",
  });

  if (!open) return null;

  const initials = formData.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

  const rc = roleConfig[formData.role] || roleConfig.Admin;
  const RoleIcon = rc.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    onSubmit?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-3xl bg-card shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-300">
        
        {/* 🎯 Gradient Header */}
        <div className="relative px-6 sm:px-8 pt-6 pb-5 bg-gradient-to-br from-signal via-violet-accent to-signal overflow-hidden">
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center ring-1 ring-white/30">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-bold tracking-widest uppercase">
                  Manage Users
                </p>
                <h2 className="text-white font-heading text-2xl font-bold">Add New User</h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 🎯 Body */}
        <div className="px-6 sm:px-8 py-6 space-y-5 max-h-[55vh] overflow-y-auto">
          
          {/* Live Avatar Preview */}
          {formData.name && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
              <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-base shadow-md", getAvatarColor(formData.name))}>
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{formData.name}</p>
                <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold mt-0.5", rc.bg, rc.color)}>
                  <RoleIcon className="h-3 w-3" />
                  {formData.role}
                </span>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
          )}

          {/* Name & Username */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" icon={User} required>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className={inputClass}
              />
            </Field>
            <Field label="Username" icon={Mail} required>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username or email"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Password & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Password" icon={Lock} required>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={cn(inputClass, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
            <Field label="Phone Number" icon={Phone} required>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01XXXXXXXXX"
                className={inputClass}
              />
            </Field>
          </div>

          {/* Commission */}
          <Field label="Commission (%)" icon={DollarSign}>
            <input
              name="commission"
              type="number"
              value={formData.commission}
              onChange={handleChange}
              placeholder="Enter commission percentage"
              className={inputClass}
            />
          </Field>

          {/* Server & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Server" icon={Server}>
              <select
                name="server"
                value={formData.server}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Server</option>
                <option value="server-1">Main Server</option>
                <option value="server-2">Backup Server</option>
                <option value="server-3">POP Server</option>
              </select>
            </Field>
            <Field label="Role" icon={Shield} required>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Admin">Admin</option>
                <option value="Reseller">Reseller</option>
                <option value="POP In-charge">POP In-charge</option>
                <option value="Manager">Manager</option>
              </select>
            </Field>
          </div>

          {/* Info Hint */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-signal/5 border border-signal/20">
            <Shield className="h-4 w-4 text-signal mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              The user will receive login credentials via SMS. Ensure the phone number is
              correct before saving.
            </p>
          </div>
        </div>

        {/* 🎯 Footer Actions */}
        <div className="px-6 sm:px-8 py-5 border-t bg-muted/20 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl font-bold text-sm bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name || !formData.username || !formData.password || !formData.phone}
            className={cn(
              "flex-1 h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300",
              formData.name && formData.username && formData.password && formData.phone
                ? "bg-gradient-to-r from-signal to-violet-accent text-white shadow-lg shadow-signal/30 hover:scale-[1.02]"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <UserPlus className="h-4 w-4" />
            Save User
          </button>
        </div>
      </div>
    </div>
  );
}