"use client";

import { useState, useMemo } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CalendarDays, PlusCircle, Search, Download, Eye, Edit, Trash2,
  ArrowUpDown, ChevronLeft, ChevronRight, AlertCircle, RefreshCw,
  Filter, CheckCircle2, X, CreditCard, UserCheck, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "sl", label: "SL" },
  { key: "refNo", label: "Ref No" },
  { key: "cardNo", label: "Card No" },
  { key: "state", label: "State" },
  { key: "protocol", label: "Protocol" },
  { key: "package", label: "Package" },
  { key: "generateTime", label: "Generate Time" },
  { key: "generateBy", label: "Generate By" },
];

// ডামি ডেটা (রিয়েল অ্যাপে API থেকে আসবে)
const initialCards = Array.from({ length: 18 }).map((_, i) => ({
  id: i + 1,
  sl: i + 1,
  refNo: `REF-${202500 + i}`,
  cardNo: `CARD-${100000 + i * 37}`,
  state: ["Active", "Used", "Expired", "Unused"][i % 4],
  protocol: ["PPPoE", "Hotspot", "Static"][i % 3],
  package: ["1Day-5GB", "7Day-50GB", "30Day-500GB", "1Hour-Unlimited"][i % 4],
  generateTime: `2025-0${(i % 9) + 1}-1${i % 9} 10:${(i * 3) % 60} AM`,
  generateBy: ["Admin", "Reseller-A", "Reseller-B", "NSP"][i % 4],
}));

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <span className="font-semibold text-sm block">{label}</span>
      {children}
    </div>
  );
}

export default function CardListPage() {
  const [cards, setCards] = useState(initialCards);
  const [filters, setFilters] = useState({
    reseller: "",
    server: "",
    package: "",
    cardType: "",
    date: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // ড্রপডাউন অপশন
  const resellerOptions = ["Admin", "Reseller-A", "Reseller-B", "NSP"];
  const serverOptions = ["SERVER-2", "SERVER-3", "SERVER-4"];
  const packageOptions = ["1Day-5GB", "7Day-50GB", "30Day-500GB", "1Hour-Unlimited"];
  const cardTypeOptions = ["PPPoE", "Hotspot", "Static"];

  // ফিল্টার + সার্চ
  const filteredCards = useMemo(() => {
    return cards.filter((c) => {
      const matchesSearch =
        c.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cardNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.package.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesReseller = !filters.reseller || c.generateBy === filters.reseller;
      const matchesServer = !filters.server || true; // সার্ভার ফিল্টার ডেমো
      const matchesPackage = !filters.package || c.package === filters.package;
      const matchesType = !filters.cardType || c.protocol === filters.cardType;
      const matchesDate = !filters.date || c.generateTime.includes(filters.date);
      return matchesSearch && matchesReseller && matchesServer && matchesPackage && matchesType && matchesDate;
    });
  }, [cards, searchTerm, filters]);

  // সর্টিং
  const sortedCards = useMemo(() => {
    if (!sortKey) return filteredCards;
    return [...filteredCards].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredCards, sortKey, sortOrder]);

  // পেজিনেশন
  const totalPages = Math.ceil(sortedCards.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedCards = sortedCards.slice(startIndex, startIndex + rowsPerPage);

  // সিলেক্ট
  const allSelected =
    paginatedCards.length > 0 && paginatedCards.every((c) => selectedRows.includes(c.id));
  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedCards.find((c) => c.id === id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...paginatedCards.map((c) => c.id)])]);
    }
  };
  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  // সর্ট হ্যান্ডলার
  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // ============ ACTIONS ============

  // Add Card
  const handleAddCard = () => {
    const newId = Math.max(...cards.map((c) => c.id)) + 1;
    const newCard = {
      id: newId,
      sl: newId,
      refNo: `REF-${202500 + newId}`,
      cardNo: `CARD-${100000 + newId * 37}`,
      state: "Unused",
      protocol: filters.cardType || "PPPoE",
      package: filters.package || "1Day-5GB",
      generateTime: new Date().toLocaleString("en-GB"),
      generateBy: filters.reseller || "Admin",
    };
    setCards((prev) => [newCard, ...prev]);
    alert(`New card added successfully!\n\nCard No: ${newCard.cardNo}`);
  };

  // Search ফিল্টার
  const handleSearch = () => {
    setCurrentPage(1);
    alert(`Applied filters.\nFound ${filteredCards.length} card(s).`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilters({ reseller: "", server: "", package: "", cardType: "", date: "" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Export CSV
  const handleExport = () => {
    const dataToExport = selectedRows.length > 0
      ? cards.filter((c) => selectedRows.includes(c.id))
      : sortedCards;
    const headers = columns.map((c) => c.label).join(",");
    const csvRows = dataToExport.map((c) =>
      columns.map((col) => `"${(c as any)[col.key]}"`).join(",")
    );
    const csv = [headers, ...csvRows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cards-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} card(s) to CSV.`);
  };

  // View Card
  const handleView = (card: any) => {
    alert(
      `Card Details:\n\nRef No: ${card.refNo}\nCard No: ${card.cardNo}\nState: ${card.state}\nProtocol: ${card.protocol}\nPackage: ${card.package}\nGenerated By: ${card.generateBy}\nGenerated At: ${card.generateTime}`
    );
  };

  // Edit Card
  const handleEdit = (card: any) => {
    const newState = prompt(`Edit card state (Active/Used/Expired/Unused):`, card.state);
    if (newState && ["Active", "Used", "Expired", "Unused"].includes(newState)) {
      setCards((prev) => prev.map((c) => (c.id === card.id ? { ...c, state: newState } : c)));
      alert("Card state updated successfully!");
    } else if (newState) {
      alert("Invalid state. Please use: Active, Used, Expired, or Unused.");
    }
  };

  // Delete Card
  const handleDelete = (card: any) => {
    if (confirm(`Delete card ${card.cardNo}? This cannot be undone.`)) {
      setCards((prev) => prev.filter((c) => c.id !== card.id));
      setSelectedRows((prev) => prev.filter((id) => id !== card.id));
      alert("Card deleted successfully!");
    }
  };

  // Bulk Delete
  const handleBulkDelete = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one card to delete.");
      return;
    }
    if (confirm(`Delete ${selectedRows.length} card(s)? This cannot be undone.`)) {
      setCards((prev) => prev.filter((c) => !selectedRows.includes(c.id)));
      setSelectedRows([]);
      alert(`${selectedRows.length} card(s) deleted.`);
    }
  };

  // State Badge Color
  const getStateBadge = (state: string) => {
    switch (state) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "Used":
        return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      case "Expired":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      case "Unused":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-7">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="font-heading text-[26px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent">
              All Cards List
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="rounded-full gap-1.5 font-semibold text-signal border-signal/30"
              >
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button
                onClick={handleAddCard}
                className="rounded-full gap-1.5 font-semibold bg-gradient-to-r from-signal to-violet-accent border-0"
              >
                <PlusCircle className="h-4 w-4" /> Add Card
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5">
            {/* Filter Panel */}
            <div className="bg-card rounded-2xl border p-6 space-y-5 h-fit">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-bold flex items-center gap-2">
                  <Filter className="w-4 h-4 text-signal" /> Filters
                </h2>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-muted-foreground hover:text-signal flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              <Field label="Reseller">
                <select
                  value={filters.reseller}
                  onChange={(e) => setFilters({ ...filters, reseller: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                >
                  <option value="">All Resellers</option>
                  {resellerOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </Field>

              <Field label="Server">
                <select
                  value={filters.server}
                  onChange={(e) => setFilters({ ...filters, server: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                >
                  <option value="">All Servers</option>
                  {serverOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>

              <Field label="Package">
                <select
                  value={filters.package}
                  onChange={(e) => setFilters({ ...filters, package: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                >
                  <option value="">All Packages</option>
                  {packageOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </Field>

              <Field label="Card Type">
                <select
                  value={filters.cardType}
                  onChange={(e) => setFilters({ ...filters, cardType: e.target.value })}
                  className="w-full border rounded-xl px-4 py-2.5 bg-muted/40 text-sm focus:ring-2 focus:ring-signal outline-none"
                >
                  <option value="">All Types</option>
                  {cardTypeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </Field>

              <Field label="Date Filter">
                <div className="relative">
                  <Input
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    placeholder="2025-09"
                    className="rounded-xl pr-10"
                  />
                  <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </Field>

              <Button
                onClick={handleSearch}
                className="w-full rounded-xl font-semibold py-6 bg-gradient-to-r from-signal to-violet-accent border-0"
              >
                <Search className="h-4 w-4 mr-2" /> Search Cards
              </Button>

              {selectedRows.length > 0 && (
                <Button
                  onClick={handleBulkDelete}
                  variant="outline"
                  className="w-full rounded-xl font-semibold py-6 text-destructive border-destructive/40 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete {selectedRows.length} Selected
                </Button>
              )}
            </div>

            {/* Table Panel */}
            <div className="bg-card rounded-2xl border overflow-hidden">
              {/* Search & Rows per page */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Show</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="border rounded-lg px-2 py-1 bg-background text-sm"
                  >
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span>entries</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    placeholder="Search cards..."
                    className="pl-9 rounded-full w-64 h-9"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1100px]">
                  <thead>
                    <tr className="bg-signal text-signal-foreground">
                      <th className="px-4 py-4 w-12">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={toggleSelectAll}
                          className="rounded cursor-pointer"
                        />
                      </th>
                      {columns.map((c) => (
                        <th
                          key={c.key}
                          onClick={() => handleSort(c.key)}
                          className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-signal/90 transition-colors select-none"
                        >
                          <div className="flex items-center gap-1">
                            {c.label}
                            <ArrowUpDown className="w-3 h-3 opacity-60" />
                          </div>
                        </th>
                      ))}
                      <th className="text-left px-4 py-4 font-semibold text-xs whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCards.length > 0 ? (
                      paginatedCards.map((c) => {
                        const isSelected = selectedRows.includes(c.id);
                        return (
                          <tr
                            key={c.id}
                            className={cn(
                              "border-t transition-colors",
                              isSelected ? "bg-signal/5" : "hover:bg-muted/30"
                            )}
                          >
                            <td className="px-4 py-4">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectRow(c.id)}
                                className="rounded cursor-pointer"
                              />
                            </td>
                            <td className="px-4 py-4 font-medium">{c.sl}</td>
                            <td className="px-4 py-4 font-mono text-xs">{c.refNo}</td>
                            <td className="px-4 py-4 font-mono text-xs font-semibold text-signal">
                              {c.cardNo}
                            </td>
                            <td className="px-4 py-4">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border",
                                getStateBadge(c.state)
                              )}>
                                {c.state}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <span className="bg-violet-accent/10 text-violet-accent text-xs font-semibold px-2 py-1 rounded-md border border-violet-accent/20">
                                {c.protocol}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-xs">{c.package}</td>
                            <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                              {c.generateTime}
                            </td>
                            <td className="px-4 py-4 text-xs">
                              <span className="flex items-center gap-1.5">
                                <UserCheck className="w-3 h-3 text-muted-foreground" />
                                {c.generateBy}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleView(c)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                  title="View"
                                >
                                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button
                                  onClick={() => handleEdit(c)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                  title="Edit"
                                >
                                  <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                                <button
                                  onClick={() => handleDelete(c)}
                                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={columns.length + 2} className="px-4 py-16 text-center text-muted-foreground">
                          <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                          <p className="font-semibold">No cards found</p>
                          <p className="text-xs mt-1">Try adjusting your filters or add a new card</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
                <div className="text-muted-foreground">
                  Showing {sortedCards.length > 0 ? startIndex + 1 : 0} to{" "}
                  {Math.min(startIndex + rowsPerPage, sortedCards.length)} of {sortedCards.length} entries
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full h-8 w-8"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(page)}
                        className={cn(
                          "rounded-full h-8 w-8 text-xs font-semibold",
                          currentPage === page && "bg-signal text-white"
                        )}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-muted-foreground px-1">...</span>}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full h-8 w-8"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}