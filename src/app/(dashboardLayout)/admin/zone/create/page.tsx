"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Key,
  Phone,
  MapPin,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Globe,
  Sparkles,
  Check,
  Info,
  Wand2,
} from "lucide-react";

// 🎯 ফর্ম ডেটা টাইপ
interface FormData {
  zoneId: string;
  parent: string;
  zoneName: string;
  loginId: string;
  password: string;
  email: string;
  mobile1: string;
  mobile2: string;
  contactName: string;
  contactNumber: string;
  address1: string;
  address2: string;
  city: string;
  street: string;
  zip: string;
  remarks: string;
}

// 🎯 ধাপের কনফিগারেশন
const STEPS = [
  { id: 1, label: "Basic Info", icon: Building2, fields: ["zoneName"] },
  { id: 2, label: "Credentials", icon: Key, fields: ["loginId", "password", "email"] },
  { id: 3, label: "Contact", icon: Phone, fields: ["mobile1", "contactName"] },
  { id: 4, label: "Location & Notes", icon: MapPin, fields: ["address1", "city"] },
];

const DRAFT_KEY = "zone:create-draft";

export default function CreateZonePage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<FormData>({
    zoneId: "A12022",
    parent: "Al Jaamitech",
    zoneName: "",
    loginId: "",
    password: "",
    email: "",
    mobile1: "",
    mobile2: "",
    contactName: "",
    contactNumber: "",
    address1: "",
    address2: "",
    city: "Kustia",
    street: "",
    zip: "",
    remarks: "",
  });

  // 🎯 ড্রাফট লোড
  useEffect(() => {
    const draft = sessionStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        setForm(JSON.parse(draft));
      } catch { /* ignore */ }
    }
  }, []);

  // 🎯 ড্রাফট সেভ
  useEffect(() => {
    const timer = setTimeout(() => {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }, 500);
    return () => clearTimeout(timer);
  }, [form]);

  // 🎯 ফিল্ড আপডেট
  const handleChange = (name: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  // 🎯 ভ্যালিডেশন
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!form.zoneName.trim()) newErrors.zoneName = "Zone name is required";
      else if (form.zoneName.length < 3) newErrors.zoneName = "Minimum 3 characters";
    }

    if (step === 2) {
      if (!form.loginId.trim()) newErrors.loginId = "Login ID is required";
      if (!form.password) newErrors.password = "Password is required";
      else if (form.password.length < 6) newErrors.password = "Minimum 6 characters";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Invalid email format";
      }
    }

    if (step === 3) {
      if (!form.mobile1.trim()) newErrors.mobile1 = "Mobile number is required";
      else if (!/^01\d{9}$/.test(form.mobile1)) newErrors.mobile1 = "Format: 01XXXXXXXXX";
      if (!form.contactName.trim()) newErrors.contactName = "Contact name is required";
    }

    if (step === 4) {
      if (!form.address1.trim()) newErrors.address1 = "Address is required";
      if (!form.city.trim()) newErrors.city = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🎯 পরবর্তী ধাপ
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
    }
  };

  // 🎯 পূর্ববর্তী ধাপ
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // 🎯 ফর্ম সাবমিট
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    // সেভ সিমুলেশন
    setSaved(true);
    sessionStorage.removeItem(DRAFT_KEY);
    setTimeout(() => {
      setSaved(false);
      router.push("/admin/zone/list");
    }, 1500);
  };

  // 🎯 ড্রাফট ক্লিয়ার
  const clearDraft = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setForm({
        zoneId: "A12022",
        parent: "Al Jaamitech",
        zoneName: "",
        loginId: "",
        password: "",
        email: "",
        mobile1: "",
        mobile2: "",
        contactName: "",
        contactNumber: "",
        address1: "",
        address2: "",
        city: "Kustia",
        street: "",
        zip: "",
        remarks: "",
      });
      sessionStorage.removeItem(DRAFT_KEY);
      setErrors({});
    }
  };

  // 🎯 পাসওয়ার্ড স্ট্রেংথ
  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return { score: 0, label: "None", color: "bg-muted" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { score: 33, label: "Weak", color: "bg-red-500" };
    if (score <= 3) return { score: 66, label: "Medium", color: "bg-amber-500" };
    return { score: 100, label: "Strong", color: "bg-emerald-500" };
  }, [form.password]);

  // 🎯 কমপ্লিশন %
  const completion = useMemo(() => {
    const required: (keyof FormData)[] = ["zoneName", "loginId", "password", "mobile1", "contactName", "address1", "city"];
    const filled = required.filter(f => form[f].trim()).length;
    return Math.round((filled / required.length) * 100);
  }, [form]);

  // 🎯 ইনপুট ফিল্ড কম্পোনেন্ট
  const FormField = ({
    label,
    name,
    type = "text",
    placeholder,
    required,
    readOnly,
    icon: Icon,
    prefix,
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder: string;
    required?: boolean;
    readOnly?: boolean;
    icon?: any;
    prefix?: React.ReactNode;
  }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-signal" />}
        {label}
        {required && <span className="text-red-500">*</span>}
        {readOnly && <span className="text-[10px] text-muted-foreground ml-auto">(Read-only)</span>}
      </label>
      <div className="relative">
        {prefix}
        <Input
          type={name === "password" ? (showPassword ? "text" : "password") : type}
          value={form[name]}
          onChange={(e) => handleChange(name, e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={cn(
            "h-11 rounded-xl transition-all",
            readOnly && "bg-signal-tint border-signal/30 font-semibold",
            errors[name] && "border-red-500 focus:ring-red-500/30",
            prefix && "pl-10"
          )}
        />
        {name === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
        {errors[name] && (
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 text-red-500" />
            <p className="text-[10px] text-red-500 font-semibold">{errors[name]}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* 🎯 Hero Header */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-signal transition-colors mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to List
            </button>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1 flex items-center gap-1.5">
                  <Wand2 className="h-3 w-3" />
                  Smart Setup Wizard
                </p>
                <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                  Create Zone / Sub-Zone
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill in the details below. Your progress is auto-saved.
                </p>
              </div>

              {/* Completion Badge */}
              <div className="bg-card rounded-2xl border p-4 min-w-[180px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Completion</span>
                  <span className={cn(
                    "text-xs font-bold",
                    completion === 100 ? "text-emerald-600" :
                    completion >= 50 ? "text-amber-600" : "text-red-500"
                  )}>{completion}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      completion === 100 ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                      completion >= 50 ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                      "bg-gradient-to-r from-red-500 to-rose-500"
                    )}
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {completion === 100 ? "Ready to save!" : "Fill required fields"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 🎯 Left: Step Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-2xl border p-4 sticky top-24">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Steps</p>
                <div className="space-y-1">
                  {STEPS.map((step) => {
                    const Icon = step.icon;
                    const isActive = currentStep === step.id;
                    const isComplete = currentStep > step.id;
                    return (
                      <button
                        key={step.id}
                        onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                        disabled={step.id > currentStep}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
                          isActive && "bg-signal/10 border border-signal/20",
                          isComplete && "hover:bg-muted/50 cursor-pointer",
                          step.id > currentStep && "opacity-40 cursor-not-allowed"
                        )}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all",
                          isActive && "bg-gradient-to-br from-signal to-violet-accent text-white shadow-md",
                          isComplete && "bg-emerald-500/10 text-emerald-600",
                          step.id > currentStep && "bg-muted text-muted-foreground"
                        )}>
                          {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className={cn(
                            "text-xs font-bold truncate",
                            isActive && "text-signal",
                            isComplete && "text-emerald-600"
                          )}>
                            Step {step.id}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">{step.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Auto-save indicator */}
                <div className="mt-4 p-3 rounded-xl bg-muted/40 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    Auto-saving draft
                  </p>
                </div>
              </div>
            </div>

            {/* 🎯 Right: Form */}
            <div className="lg:col-span-3">
              <div className="bg-card rounded-2xl border overflow-hidden">
                {/* Progress Bar */}
                <div className="h-1 bg-muted">
                  <div
                    className="h-full bg-gradient-to-r from-signal to-violet-accent transition-all duration-500"
                    style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                  />
                </div>

                {/* Current Step Header */}
                <div className="px-6 pt-6 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center text-white shadow-md">
                      {(() => {
                        const StepIcon = STEPS[currentStep - 1].icon;
                        return <StepIcon className="h-5 w-5" />;
                      })()}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        Step {currentStep} of {STEPS.length}
                      </p>
                      <h2 className="font-heading text-lg font-bold">{STEPS[currentStep - 1].label}</h2>
                    </div>
                  </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-5">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="Zone ID" name="zoneId" placeholder="Ex: A12022" readOnly icon={Building2} />
                        <FormField label="Parent" name="parent" placeholder="Al Jaamitech" readOnly icon={Building2} />
                        <div className="sm:col-span-2">
                          <FormField label="Zone Name" name="zoneName" placeholder="Enter Zone Name" required icon={Building2} />
                        </div>
                      </div>
                    )}

                    {/* Step 2: Credentials */}
                    {currentStep === 2 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="Login ID" name="loginId" placeholder="Enter Login ID" required icon={User} />
                        <FormField
                          label="Password"
                          name="password"
                          type="password"
                          placeholder="Enter password"
                          required
                          icon={Lock}
                        />
                        {/* Password Strength */}
                        {form.password && (
                          <div className="sm:col-span-2 -mt-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Strength</span>
                              <span className={cn(
                                "text-[10px] font-bold",
                                passwordStrength.label === "Strong" ? "text-emerald-600" :
                                passwordStrength.label === "Medium" ? "text-amber-600" : "text-red-500"
                              )}>{passwordStrength.label}</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={cn("h-full rounded-full transition-all duration-300", passwordStrength.color)}
                                style={{ width: `${passwordStrength.score}%` }}
                              />
                            </div>
                          </div>
                        )}
                        <div className="sm:col-span-2">
                          <FormField label="Email" name="email" type="email" placeholder="ex: naimuan@gmail.com" icon={Mail} />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Contact */}
                    {currentStep === 3 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <FormField label="Mobile Number 1" name="mobile1" placeholder="01XXXXXXXXX" required icon={Phone} />
                        <FormField label="Mobile Number 2" name="mobile2" placeholder="01XXXXXXXXX" icon={Phone} />
                        <FormField label="Contact Name" name="contactName" placeholder="Enter contact name" required icon={User} />
                        <FormField label="Contact Number" name="contactNumber" placeholder="Enter contact number" icon={Phone} />
                      </div>
                    )}

                    {/* Step 4: Location & Notes */}
                    {currentStep === 4 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="sm:col-span-2">
                          <FormField label="Address 1" name="address1" placeholder="Enter address" required icon={MapPin} />
                        </div>
                        <div className="sm:col-span-2">
                          <FormField label="Address 2" name="address2" placeholder="Enter address" icon={MapPin} />
                        </div>
                        <FormField label="City" name="city" placeholder="Kustia" required icon={MapPin} />
                        <FormField label="Street" name="street" placeholder="Select Street" icon={MapPin} />
                        <FormField label="Zip/Postal Code" name="zip" placeholder="Enter Zip/Postal Code" icon={Globe} />
                        <div className="sm:col-span-2">
                          <label className="text-xs font-semibold flex items-center gap-1.5 mb-1.5">
                            <Info className="h-3.5 w-3.5 text-signal" />
                            Hints / Remarks
                          </label>
                          <textarea
                            value={form.remarks}
                            onChange={(e) => handleChange("remarks", e.target.value)}
                            placeholder="Enter any additional information…"
                            className="w-full min-h-[100px] p-3 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-signal/30 resize-none transition-all"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-8 pt-6 border-t">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-muted text-muted-foreground hover:bg-muted/80 transition-all"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Previous
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={clearDraft}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Clear
                    </button>

                    <div className="flex-1" />

                    {currentStep < STEPS.length ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-signal to-violet-accent text-white shadow-md shadow-signal/30 hover:scale-105 transition-all"
                      >
                        Next Step
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={saved}
                        className={cn(
                          "flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                          saved
                            ? "bg-emerald-500 text-white cursor-wait"
                            : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30 hover:scale-105"
                        )}
                      >
                        {saved ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Zone
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}