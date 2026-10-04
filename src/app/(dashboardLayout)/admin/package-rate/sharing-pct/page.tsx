"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PremiumCard, PageHeader, gradientBtn } from "@/components/config/shared";
import {
  Search, Pencil, Trash2, Plus, Download, ArrowUpDown, X,
  Save, TrendingUp, Package, Percent, DollarSign, Users,
  AlertCircle, BarChart3, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const rateColumns = [
  { key: "name", label: "Plan Name" },
  { key: "customer", label: "Customer Rate" },
  { key: "zone", label: "Zone Rate" },
  { key: "idRate", label: "Rate For ID 21-Soron Internet PoP" },
];

const shareColumns = [
  { key: "name", label: "Plan Name" },
  { key: "customer", label: "Customer Rate" },
  { key: "comp", label: "Comp Get" },
  { key: "myShare", label: "My Share" },
  { key: "idShare", label: "Share ID 21-Soron Internet PoP" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialRateRows = [
  { id: 1, name: "5Mbps-Pkg", customer: 350, zone: 20, idRate: 200 },
  { id: 2, name: "10Mbps-Pkg", customer: 500, zone: 30, idRate: 300 },
  { id: 3, name: "15Mbps-Pkg", customer: 700, zone: 40, idRate: 420 },
  { id: 4, name: "20Mbps-Pkg", customer: 900, zone: 50, idRate: 540 },
  { id: 5, name: "30Mbps-Pkg", customer: 1200, zone: 70, idRate: 720 },
  { id: 6, name: "50Mbps-Pkg", customer: 1800, zone: 100, idRate: 1080 },
];

const initialShareRows = [
  { id: 1, name: "5Mbps-Pkg", customer: 350, comp: 20, compPct: "5.7%", myShare: 180, myPct: "51.4%", idShare: 150, idPct: "42.9%" },
  { id: 2, name: "10Mbps-Pkg", customer: 500, comp: 30, compPct: "6%", myShare: 270, myPct: "54%", idShare: 200, idPct: "40%" },
  { id: 3, name: "15Mbps-Pkg", customer: 700, comp: 40, compPct: "5.7%", myShare: 380, myPct: "54.3%", idShare: 280, idPct: "40%" },
  { id: 4, name: "20Mbps-Pkg", customer: 900, comp: 50, compPct: "5.5%", myShare: 480, myPct: "53.4%", idShare: 370, idPct: "41.1%" },
  { id: 5, name: "30Mbps-Pkg", customer: 1200, comp: 70, compPct: "5.8%", myShare: 650, myPct: "54.2%", idShare: 480, idPct: "40%" },
];

const emptyRate = { id: 0, name: "", customer: 0, zone: 0, idRate: 0 };

export default function RateListSharingPctPage() {
  const [rateRows, setRateRows] = useState(initialRateRows);
  const [shareRows] = useState(initialShareRows);
  const [rateSearch, setRateSearch] = useState("");
  const [shareSearch, setShareSearch] = useState("");
  const [rateSortKey, setRateSortKey] = useState<string | null>(null);
  const [rateSortOrder, setRateSortOrder] = useState<"asc" | "desc">("asc");
  const [shareSortKey, setShareSortKey] = useState<string | null>(null);
  const [shareSortOrder, setShareSortOrder] = useState<"asc" | "desc">("asc");
  const [editModal, setEditModal] = useState<any | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Stat Calculations
  const stats = useMemo(() => {
    const total = rateRows.length;
    const avgCustomer = total > 0 ? Math.round(rateRows.reduce((a, b) => a + b.customer, 0) / total) : 0;
    const avgZone = total > 0 ? Math.round(rateRows.reduce((a, b) => a + b.zone, 0) / total) : 0;
    const avgId = total > 0 ? Math.round(rateRows.reduce((a, b) => a + b.idRate, 0) / total) : 0;
    return { total, avgCustomer, avgZone, avgId };
  }, [rateRows]);

  // Rate Filter + Sort
  const filteredRateRows = useMemo(() => {
    let filtered = rateRows.filter(
      (r) =>
        r.name.toLowerCase().includes(rateSearch.toLowerCase()) ||
        String(r.customer).includes(rateSearch) ||
        String(r.idRate).includes(rateSearch)
    );
    if (rateSortKey) {
      filtered = [...filtered].sort((a: any, b: any) => {
        const aVal = a[rateSortKey];
        const bVal = b[rateSortKey];
        if (aVal < bVal) return rateSortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return rateSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [rateRows, rateSearch, rateSortKey, rateSortOrder]);

  // Share Filter + Sort
  const filteredShareRows = useMemo(() => {
    let filtered = shareRows.filter(
      (r) =>
        r.name.toLowerCase().includes(shareSearch.toLowerCase()) ||
        String(r.customer).includes(shareSearch)
    );
    if (shareSortKey) {
      filtered = [...filtered].sort((a: any, b: any) => {
        const aVal = a[shareSortKey];
        const bVal = b[shareSortKey];
        if (aVal < bVal) return shareSortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return shareSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [shareRows, shareSearch, shareSortKey, shareSortOrder]);

  // Handlers
  const handleRateSort = (key: string) => {
    if (rateSortKey === key) setRateSortOrder(rateSortOrder === "asc" ? "desc" : "asc");
    else { setRateSortKey(key); setRateSortOrder("asc"); }
  };

  const handleShareSort = (key: string) => {
    if (shareSortKey === key) setShareSortOrder(shareSortOrder === "asc" ? "desc" : "asc");
    else { setShareSortKey(key); setShareSortOrder("asc"); }
  };

  const handleEdit = (row: any) => {
    setEditModal({ ...row });
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditModal({ ...emptyRate, id: Math.max(...rateRows.map((r) => r.id), 0) + 1 });
    setIsAddingNew(true);
  };

  const handleSave = () => {
    if (!editModal.name.trim()) {
      alert("Plan Name is required!");
      return;
    }
    if (isAddingNew) {
      setRateRows((prev) => [...prev, editModal]);
      alert(`New plan "${editModal.name}" added successfully!`);
    } else {
      setRateRows((prev) => prev.map((r) => (r.id === editModal.id ? editModal : r)));
      alert(`Plan "${editModal.name}" updated successfully!`);
    }
    setEditModal(null);
    setIsAddingNew(false);
  };

  const handleDelete = (row: any) => {
    if (confirm(`Delete plan "${row.name}"? This cannot be undone.`)) {
      setRateRows((prev) => prev.filter((r) => r.id !== row.id));
      alert("Plan deleted successfully!");
    }
  };

  const handleExport = () => {
    const headers = rateColumns.map((c) => c.label).join(",");
    const csvRows = filteredRateRows.map((r: any) =>
      rateColumns.map((c) => `"${r[c.key]}"`).join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `rate-list-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${filteredRateRows.length} plan(s) to CSV.`);
  };

  // Sharing Progress Bar
  const ShareBar = ({ compPct, myPct, idPct }: { compPct: string; myPct: string; idPct: string }) => {
    const comp = parseFloat(compPct);
    const my = parseFloat(myPct);
    const id = parseFloat(idPct);
    return (
      <div className="flex h-1.5 rounded-full overflow-hidden bg-muted mt-1.5 max-w-[140px]">
        <div className="bg-amber-500" style={{ width: `${comp}%` }} />
        <div className="bg-signal" style={{ width: `${my}%` }} />
        <div className="bg-violet-accent" style={{ width: `${id}%` }} />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <PageHeader eyebrow="Package & Rate · ID-21-Soron Internet PoP" title="Rate List">
            <Button
              onClick={handleExport}
              variant="outline"
              className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
            >
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button onClick={handleAddNew} className={gradientBtn}>
              <Plus className="h-4 w-4" /> Add Plan
            </Button>
          </PageHeader>

          {/* Compact Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                <Package className="w-4 h-4 text-signal" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Plans</p>
                <p className="font-heading text-xl font-bold">{stats.total}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Customer</p>
                <p className="font-heading text-xl font-bold text-emerald-600">৳{stats.avgCustomer}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <Percent className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg Zone</p>
                <p className="font-heading text-xl font-bold text-amber-600">৳{stats.avgZone}</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border p-3.5 shadow-sm flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-accent/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-violet-accent" />
              </div>
              <div className="flex items-baseline gap-2 min-w-0">
                <p className="text-xs text-muted-foreground font-semibold uppercase whitespace-nowrap">Avg ID-21</p>
                <p className="font-heading text-xl font-bold text-violet-accent">৳{stats.avgId}</p>
              </div>
            </div>
          </div>

          {/* Rate List Section */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-signal" />
              <h2 className="font-heading text-lg font-bold">Rate List</h2>
              <span className="bg-signal/10 text-signal text-xs font-semibold px-2.5 py-0.5 rounded-full border border-signal/20">
                {filteredRateRows.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={rateSearch}
                onChange={(e) => setRateSearch(e.target.value)}
                placeholder="Search rate..."
                className="pl-9 rounded-full w-56 h-9"
              />
            </div>
          </div>

          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    {rateColumns.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleRateSort(c.key)}
                        className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-signal/90 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          {c.label}
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                    ))}
                    <th className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRateRows.length > 0 ? (
                    filteredRateRows.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-signal-tint/30 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold">{r.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-600 font-semibold">৳{r.customer}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-amber-600 font-semibold">৳{r.zone}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-signal">৳{r.idRate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(r)}
                              className="w-8 h-8 rounded-full bg-signal-tint text-signal flex items-center justify-center hover:bg-signal/20 transition-colors"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(r)}
                              className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={rateColumns.length + 1} className="px-6 py-16 text-center text-muted-foreground">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No plans found</p>
                        <p className="text-xs mt-1">Try adjusting your search</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PremiumCard>

          {/* Sharing PCT Section */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-10 mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-accent" />
              <h2 className="font-heading text-lg font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                Sharing PCT
              </h2>
              <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2.5 py-0.5 rounded-full border border-violet-accent/20">
                {filteredShareRows.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={shareSearch}
                onChange={(e) => setShareSearch(e.target.value)}
                placeholder="Search sharing..."
                className="pl-9 rounded-full w-56 h-9"
              />
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Company Get
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-signal" /> My Share
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-accent" /> ID-21 Share
            </span>
          </div>

          <PremiumCard>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1000px]">
                <thead>
                  <tr className="bg-signal text-signal-foreground">
                    {shareColumns.map((c) => (
                      <th
                        key={c.key}
                        onClick={() => handleShareSort(c.key)}
                        className="text-left px-6 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-signal/90 transition-colors select-none"
                      >
                        <div className="flex items-center gap-1">
                          {c.label}
                          <ArrowUpDown className="w-3 h-3 opacity-60" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredShareRows.length > 0 ? (
                    filteredShareRows.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-signal-tint/30 transition-colors">
                        <td className="px-6 py-4 font-semibold">{r.name}</td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-600 font-semibold">৳{r.customer}</span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-amber-600">৳{r.comp}</p>
                          <p className="text-xs text-muted-foreground">{r.compPct}</p>
                          <ShareBar compPct={r.compPct} myPct={r.myPct} idPct={r.idPct} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-signal">৳{r.myShare}</p>
                          <p className="text-xs text-muted-foreground">{r.myPct}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-violet-accent">৳{r.idShare}</p>
                          <p className="text-xs text-muted-foreground">{r.idPct}</p>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={shareColumns.length} className="px-6 py-16 text-center text-muted-foreground">
                        <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                        <p className="font-semibold">No sharing data found</p>
                        <p className="text-xs mt-1">Try adjusting your search</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PremiumCard>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]" onClick={() => setEditModal(null)} />
          <div className="relative bg-card w-full max-w-lg rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl font-bold bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
                {isAddingNew ? "Add New Plan" : "Edit Rate"}
              </h3>
              <button
                onClick={() => setEditModal(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-5 mb-8">
              <div className="space-y-2">
                <label className="font-semibold text-sm block">Plan Name <span className="text-red-500">*</span></label>
                <Input
                  value={editModal.name}
                  onChange={(e) => setEditModal({ ...editModal, name: e.target.value })}
                  placeholder="e.g. 10Mbps-Pkg"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Customer Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      type="number"
                      value={editModal.customer}
                      onChange={(e) => setEditModal({ ...editModal, customer: Number(e.target.value) })}
                      className="rounded-xl pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">Zone Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      type="number"
                      value={editModal.zone}
                      onChange={(e) => setEditModal({ ...editModal, zone: Number(e.target.value) })}
                      className="rounded-xl pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="font-semibold text-sm block">ID-21 Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">৳</span>
                    <Input
                      type="number"
                      value={editModal.idRate}
                      onChange={(e) => setEditModal({ ...editModal, idRate: Number(e.target.value) })}
                      className="rounded-xl pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setEditModal(null)}
                variant="outline"
                className="flex-1 rounded-xl font-semibold h-12"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 rounded-xl font-semibold h-12 bg-gradient-to-r from-signal to-violet-accent border-0"
              >
                <Save className="w-4 h-4 mr-2" />
                {isAddingNew ? "Add Plan" : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}