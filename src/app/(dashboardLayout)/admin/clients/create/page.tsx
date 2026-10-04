"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  User, Server, UploadCloud, MapPin, CheckCircle2, 
  ChevronRight, ChevronLeft, Camera, FileImage, 
  Lock, RefreshCw, Smartphone, Mail, CreditCard
} from "lucide-react";

// স্টেপ ডেফিনিশন
const steps = [
  { id: 1, title: "Client Info", icon: User },
  { id: 2, title: "Server Config", icon: Server },
  { id: 3, title: "Documents", icon: UploadCloud },
  { id: 4, title: "Location", icon: MapPin },
];

export default function AddNewClientPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    clientName: "", mobile: "", email: "", nid: "", dob: "", address: "",
    // Step 2
    zone: "", subZone: "", serverName: "", password: "", remoteAddress: "", 
    billingCycle: "", protocol: "", billingDate: "", package: "", username: "", remark: "",
    // Step 3
    photo: null, nidFront: null, nidBack: null,
    // Step 4
    gps: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length) {
      handleNext();
    } else {
      console.log("Form Submitted:", formData);
      alert("Client Created Successfully! Check console for data.");
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7 max-w-7xl mx-auto">
          <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-2">
            Add New Client
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Follow the steps to register a new client into the system securely.
          </p>

          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border -z-10" />
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-muted/30 px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive ? "bg-signal text-white shadow-lg scale-110" : 
                    isCompleted ? "bg-emerald-500 text-white" : "bg-card border text-muted-foreground"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-semibold ${isActive ? "text-signal" : "text-muted-foreground"}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="bg-card rounded-2xl border shadow-sm p-6 sm:p-8">
            
            {/* Step 1: Client Information */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 border-b pb-3 mb-4">
                  <User className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Client Name <span className="text-red-500">*</span></label>
                    <Input name="clientName" value={formData.clientName} onChange={handleChange} placeholder="Enter full name" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Mobile No <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="01XXXXXXXXX" className="pl-9" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="client@example.com" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">NID No</label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input name="nid" value={formData.nid} onChange={handleChange} placeholder="Enter NID number" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Date Of Birth</label>
                    <Input name="dob" type="date" value={formData.dob} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-sm font-semibold">Address</label>
                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="Vill/HouseNo, Road, Area" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Server Information */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 border-b pb-3 mb-4">
                  <Server className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold">Network Configuration</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Zone <span className="text-red-500">*</span></label>
                    <Select value={formData.zone} onValueChange={(v) => handleSelectChange("zone", v)}>
                      <SelectTrigger><SelectValue placeholder="Choose Zone" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zone1">Zone 1</SelectItem>
                        <SelectItem value="zone2">Zone 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Sub Zone</label>
                    <Select value={formData.subZone} onValueChange={(v) => handleSelectChange("subZone", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Sub Zone" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sub1">Sub Zone 1</SelectItem>
                        <SelectItem value="sub2">Sub Zone 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Server Name <span className="text-red-500">*</span></label>
                    <Select value={formData.serverName} onValueChange={(v) => handleSelectChange("serverName", v)}>
                      <SelectTrigger><SelectValue placeholder="Choose Server" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="server1">Server 1</SelectItem>
                        <SelectItem value="server2">Server 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Package</label>
                    <Select value={formData.package} onValueChange={(v) => handleSelectChange("package", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Server First" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pkg1">10 Mbps</SelectItem>
                        <SelectItem value="pkg2">20 Mbps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Protocol</label>
                    <Select value={formData.protocol} onValueChange={(v) => handleSelectChange("protocol", v)}>
                      <SelectTrigger><SelectValue placeholder="Select Protocol" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pppoe">PPPoE</SelectItem>
                        <SelectItem value="hotspot">Hotspot</SelectItem>
                        <SelectItem value="static">Static</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Billing Cycle</label>
                    <Select value={formData.billingCycle} onValueChange={(v) => handleSelectChange("billingCycle", v)}>
                      <SelectTrigger><SelectValue placeholder="Plan Validity" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Username</label>
                    <Input name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Remote Address</label>
                    <Input name="remoteAddress" value={formData.remoteAddress} onChange={handleChange} placeholder="IP Address" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Billing/Exp Date</label>
                    <Input name="billingDate" type="date" value={formData.billingDate} onChange={handleChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Pop-In Charge</label>
                    <Input value="RBN Bappy (Admin)" readOnly className="bg-signal-tint border-signal/30 font-semibold text-signal" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">Remark</label>
                    <Input name="remark" value={formData.remark} onChange={handleChange} placeholder="Any special notes" />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Documents */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 border-b pb-3 mb-4">
                  <UploadCloud className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold">Upload Documents</h2>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-semibold mb-2 block">Profile Photo</label>
                    <div className="border-2 border-dashed border-signal/30 rounded-2xl bg-gradient-to-br from-signal-tint to-violet-accent-tint p-10 flex flex-col items-center gap-3 transition-colors hover:border-signal/60">
                      <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center shadow-sm">
                        <Camera className="h-7 w-7 text-signal" />
                      </div>
                      <p className="text-sm text-muted-foreground text-center">Select a photo or open your camera to take a new one</p>
                      <div className="flex gap-3 mt-2">
                        <button type="button" className="border rounded-full px-5 py-2 text-xs font-semibold bg-card hover:bg-muted transition-colors flex items-center gap-2">
                          <FileImage className="w-3.5 h-3.5" /> Upload Photo
                        </button>
                        <button type="button" className="rounded-full px-5 py-2 text-xs font-semibold bg-signal text-white hover:bg-signal/90 transition-colors flex items-center gap-2">
                          <Camera className="w-3.5 h-3.5" /> Take a Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {["NID Front Side", "NID Back Side"].map((label, idx) => (
                      <div key={idx}>
                        <label className="text-sm font-semibold mb-2 block">{label}</label>
                        <div className="border rounded-2xl p-8 flex flex-col items-center gap-3 text-center transition-colors hover:border-signal/50">
                          <UploadCloud className="h-7 w-7 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Tap to upload the {label.toLowerCase()}</p>
                          <button type="button" className="border rounded-full px-5 py-1.5 text-xs font-semibold text-signal border-signal hover:bg-signal/5 transition-colors">
                            Upload {label}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Location */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center gap-2 border-b pb-3 mb-4">
                  <MapPin className="w-5 h-5 text-signal" />
                  <h2 className="font-heading text-lg font-bold">Location Data</h2>
                </div>
                <div className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold">GPS Coordinates</label>
                    <Input name="gps" value={formData.gps} onChange={handleChange} placeholder="Enter Latitude, Longitude" />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button type="button" className="flex-1 border rounded-full px-4 py-3 text-sm font-semibold text-signal border-signal hover:bg-signal/5 transition-colors">
                      Open in Maps
                    </button>
                    <button type="button" className="flex-1 rounded-full px-4 py-3 text-sm font-semibold bg-signal text-white hover:bg-signal/90 transition-colors flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" /> My Current Location
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrev} 
                disabled={currentStep === 1}
                className="rounded-full font-semibold px-6"
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="rounded-full font-semibold px-6 text-destructive border-destructive/40 hover:bg-destructive/10">
                  <RefreshCw className="w-4 h-4 mr-2" /> Reset
                </Button>
                
                {currentStep < steps.length ? (
                  <Button type="submit" className="rounded-full font-semibold px-8">
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button type="submit" className="rounded-full font-semibold px-8 bg-emerald-600 hover:bg-emerald-500 text-white">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Save Client
                  </Button>
                )}
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}