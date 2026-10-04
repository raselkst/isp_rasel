"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Link2, UserX, Download, MessageSquareText, RefreshCw, Filter,
  ListFilter, Search, ChevronLeft, ChevronRight, ArrowUpDown,
  AlertCircle, Eye, Edit, Trash2, CheckCircle2, X
} from "lucide-react";
import { cn } from "@/lib/utils";

const columns = [
  { key: "invoice", label: "Invoice No." },
  { key: "cid", label: "C.ID" },
  { key: "name", label: "Name" },
  { key: "mobile", label: "Mobile" },
  { key: "pkg", label: "Package" },
  { key: "rDays", label: "R.Days" },
  { key: "uptime", label: "Uptime" },
  { key: "ip", label: "IP" },
  { key: "mac", label: "Mac Address" },
  { key: "up", label: "Up" },
  { key: "down", label: "Down" },
  { key: "lastOffline", label: "Last Offline" },
];

// ডামি ডেটা
const initialRows = Array.from({ length: 13 }).map((_, i) => ({
  id: i + 1,
  invoice: `872${193 + i}`,
  cid: `jihad10${19 + i}`,
  name: ["Mogul Ali", "Rahim Uddin", "Karim Hossain", "Sabbir Ahmed", "Nusrat Jahan"][i % 5],
  mobile: `0171610265${i}`,
  pkg: "500Tk.8Mb30Day",
  rDays: i % 3 === 0 ? "030" : "000",
  uptime: i % 2 === 0 ? "2d 4h" : "Null",
  ip: i % 2 === 0 ? `192.168.1.${10 + i}` : "Null",
  mac: i % 2 === 0 ? `00:1A:2B:3C:4D:${i}${i}` : "Null",
  up: i % 2 === 0 ? `${100 + i} MB` : "000",
  down: i % 2 === 0 ? `${200 + i} MB` : "000",
  lastOffline: `1-5-24 10:0${i % 9}PM`,
  status: i % 4 === 0 ? "offline" : i % 3 === 0 ? "warning" : "online",
}));

// টুলবার বাটন কম্পোনেন্ট
function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full gap-1.5 font-semibold text-xs h-9",
        "text-signal border-signal/30 hover:bg-signal/5 disabled:opacity-40"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

export function PppoeClientListTable({ dotColor = "bg-success" }: { dotColor?: string }) {
  const [rows, setRows] = useState(initialRows);
  const [searchTerm, setSearchTerm] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline" | "warning">("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // ফিল্টার + সার্চ
  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchesSearch =
        r.cid.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.mobile.includes(searchTerm) ||
        r.invoice.includes(searchTerm);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [rows, searchTerm, statusFilter]);

  // সর্টিং
  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    return [...filteredRows].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, sortKey, sortOrder]);

  // পেজিনেশন
  const totalPages = Math.ceil(sortedRows.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedRows = sortedRows.slice(startIndex, startIndex + rowsPerPage);

  // সিলেক্ট হ্যান্ডলার
  const allSelected =
    paginatedRows.length > 0 && paginatedRows.every((r) => selectedRows.includes(r.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !paginatedRows.find((r) => r.id === id)));
    } else {
      setSelectedRows((prev) => [
        ...new Set([...prev, ...paginatedRows.map((r) => r.id)]),
      ]);
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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

  // স্ট্যাটাস ডট কালার
  const getStatusDot = (status: string) => {
    switch (status) {
      case "online":
        return "bg-emerald-500";
      case "warning":
        return "bg-amber-500";
      case "offline":
        return "bg-red-500";
      default:
        return "bg-slate-400";
    }
  };

  // ============ ACTIONS ============

  // Activate Selected
  const handleActivate = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one client to activate.");
      return;
    }
    setRows((prev) =>
      prev.map((r) => (selectedRows.includes(r.id) ? { ...r, status: "online", uptime: "Just now" } : r))
    );
    alert(`${selectedRows.length} client(s) activated successfully!`);
    setSelectedRows([]);
  };

  // Mark as Left
  const handleLeft = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one client to mark as Left.");
      return;
    }
    setRows((prev) =>
      prev.map((r) => (selectedRows.includes(r.id) ? { ...r, status: "offline", uptime: "Null" } : r))
    );
    alert(`${selectedRows.length} client(s) marked as Left.`);
    setSelectedRows([]);
  };

  // Export to CSV
  const handleExport = () => {
    const dataToExport = selectedRows.length > 0
      ? rows.filter((r) => selectedRows.includes(r.id))
      : sortedRows;

    const headers = columns.map((c) => c.label).join(",");
    const csvRows = dataToExport.map((r) =>
      columns.map((c) => `"${(r as any)[c.key]}"`).join(",")
    );
    const csv = [headers, ...csvRows].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pppoe-clients-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    alert(`Exported ${dataToExport.length} client(s) to CSV.`);
  };

  // Bulk SMS
  const handleBulkSMS = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one client to send SMS.");
      return;
    }
    alert(`Sending SMS to ${selectedRows.length} client(s)...\n\nThis is a mock action. Connect your SMS API here.`);
  };

  // Bulk Renew
  const handleBulkRenew = () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one client to renew.");
      return;
    }
    alert(`Renewing ${selectedRows.length} client(s)...\n\nThis is a mock action. Connect your renewal API here.`);
  };

  // View Single Client
  const handleView = (row: any) => {
    alert(`Viewing client:\n\nName: ${row.name}\nCID: ${row.cid}\nInvoice: ${row.invoice}\nPackage: ${row.pkg}\nStatus: ${row.status}`);
  };

  // Edit Single Client
  const handleEdit = (row: any) => {
    const newName = prompt(`Edit client name:`, row.name);
    if (newName && newName.trim()) {
      setRows((prev) =>
        prev.map((r) => (r.id === row.id ? { ...r, name: newName.trim() } : r))
      );
      alert("Client updated successfully!");
    }
  };

  // Delete Single Client
  const handleDelete = (row: any) => {
    if (confirm(`Are you sure you want to delete ${row.name}? This action cannot be undone.`)) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      setSelectedRows((prev) => prev.filter((id) => id !== row.id));
      alert("Client deleted successfully!");
    }
  };

  // Filter Dropdown Toggle
  const handleFilterSelect = (status: "all" | "online" | "offline" | "warning") => {
    setStatusFilter(status);
    setShowFilterDropdown(false);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Header with Search & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-xl font-bold">Client List</h2>
          {selectedRows.length > 0 && (
            <span className="bg-signal/10 text-signal text-xs font-semibold px-3 py-1 rounded-full border border-signal/20 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {selectedRows.length} selected
              <button
                onClick={() => setSelectedRows([])}
                className="ml-1 hover:bg-signal/20 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search..."
              className="pl-9 rounded-full w-56 h-9"
            />
          </div>
          <ToolbarButton icon={Link2} label="Activate" onClick={handleActivate} />
          <ToolbarButton icon={UserX} label="Left" onClick={handleLeft} />
          <ToolbarButton icon={Download} label="Export" onClick={handleExport} />
          <ToolbarButton icon={MessageSquareText} label="Bulk SMS" onClick={handleBulkSMS} />
          <ToolbarButton icon={RefreshCw} label="Bulk Renew" onClick={handleBulkRenew} />

          {/* Filter with Dropdown */}
          <div className="relative">
            <ToolbarButton
              icon={Filter}
              label={statusFilter === "all" ? "Filter" : `Filter: ${statusFilter}`}
              onClick={() => setShowFilterDropdown((s) => !s)}
            />
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-2 w-44 bg-card border rounded-xl shadow-lg z-30 overflow-hidden">
                {(["all", "online", "offline", "warning"] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleFilterSelect(status)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors capitalize flex items-center gap-2",
                      statusFilter === status && "bg-signal/10 text-signal font-semibold"
                    )}
                  >
                    <span className={cn("w-2 h-2 rounded-full", getStatusDot(status === "all" ? "default" : status))} />
                    {status === "all" ? "All Status" : status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Rows per page */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border rounded-lg px-2 py-1 bg-background text-sm"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>
        <Button
          variant="outline"
          className="rounded-full gap-1.5 font-semibold text-signal border-signal/30 h-9"
        >
          <ListFilter className="h-3.5 w-3.5" />
          Show {rowsPerPage} rows
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[1400px]">
          <thead>
            <tr className="bg-signal text-signal-foreground">
              <th className="px-5 py-4 w-12">
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
                  className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap cursor-pointer hover:bg-signal/90 transition-colors select-none"
                >
                  <div className="flex items-center gap-1">
                    {c.label}
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
              ))}
              <th className="text-left px-5 py-4 font-semibold text-xs whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRows.length > 0 ? (
              paginatedRows.map((r) => {
                const isSelected = selectedRows.includes(r.id);
                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-t transition-colors",
                      isSelected ? "bg-signal/5" : "hover:bg-muted/30"
                    )}
                  >
                    <td className="px-5 py-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectRow(r.id)}
                        className="rounded cursor-pointer"
                      />
                    </td>
                    <td className="px-5 py-4 font-medium">{r.invoice}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-signal font-semibold">
                        <span className={cn("w-1.5 h-1.5 rounded-full", getStatusDot(r.status))} />
                        {r.cid}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium">{r.name}</td>
                    <td className="px-5 py-4">{r.mobile}</td>
                    <td className="px-5 py-4">
                      <span className="bg-signal/10 text-signal text-xs font-semibold px-2 py-1 rounded-md border border-signal/20">
                        {r.pkg}
                      </span>
                    </td>
                    <td className="px-5 py-4">{r.rDays}</td>
                    <td className="px-5 py-4">
                      {r.uptime !== "Null" ? (
                        <span className="text-emerald-600 font-semibold">{r.uptime}</span>
                      ) : (
                        <span className="text-muted-foreground">Null</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs">{r.ip}</td>
                    <td className="px-5 py-4 font-mono text-xs">{r.mac}</td>
                    <td className="px-5 py-4 text-emerald-600 font-semibold">{r.up}</td>
                    <td className="px-5 py-4 text-blue-600 font-semibold">{r.down}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-muted-foreground">
                      {r.lastOffline}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleView(r)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          title="View"
                        >
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleEdit(r)}
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => handleDelete(r)}
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
                <td colSpan={columns.length + 2} className="px-5 py-16 text-center text-muted-foreground">
                  <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="font-semibold">No clients found</p>
                  <p className="text-xs mt-1">Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t text-sm">
          <div className="text-muted-foreground">
            Showing {sortedRows.length > 0 ? startIndex + 1 : 0} to{" "}
            {Math.min(startIndex + rowsPerPage, sortedRows.length)} of {sortedRows.length} entries
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
  );
}