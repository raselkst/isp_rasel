"use client";

import { PortalTopbar } from "@/components/client-portal/portal-topbar";
import { RolePill, StatusPill } from "@/components/client-portal/status-pills";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

const users = [
  { id: 335, name: "Sanwar hos ain", tag: "(Admin)", username: "sanwar0927", role: "Super Admin", email: "admin@rbnisp.net", address: "1234 Elm Street, Springfield, USA", contract: "01710626699", status: "Active" as const },
  { id: 335, name: "Sanwar hos ain network", tag: "", username: "alexjohnson3850", role: "Admin", email: "contact@techhub.com", address: "5678 Maple Avenue, Rivertown, USA", contract: "01710626699", status: "Inactive" as const },
  { id: 335, name: "Sanwar hos ain", tag: "(Admin)", username: "mariasmith8575", role: "Technical", email: "admin@techhub.com", address: "5678 Maple Avenue, Rivertown, USA", contract: "01710626699", status: "Active" as const },
  { id: 335, name: "Sanwar hos ain network", tag: "", username: "sanwar0927", role: "Sales & Marketing", email: "support@techhub.com", address: "5678 Maple Avenue, Rivertown, USA", contract: "01710626699", status: "Inactive" as const },
  { id: 335, name: "Sanwar hos ain", tag: "(Admin)", username: "mariasmith8575", role: "Accounts & Billing", email: "admin@techhub.com", address: "5678 Maple Avenue, Rivertown, USA", contract: "01710626699", status: "Active" as const },
  { id: 335, name: "Sanwar hos ain network", tag: "", username: "alexjohnson3850", role: "Client", email: "info@techhub.com", address: "5678 Maple Avenue, Rivertown, USA", contract: "01710626699", status: "Inactive" as const },
];

export default function UserListPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <PortalTopbar />

      <div className="px-8 py-8">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-heading text-[26px] font-bold tracking-tight">User list</h1>
          <Button
            variant="outline"
            className="rounded-full font-semibold border-signal text-signal hover:bg-signal-tint"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add User
          </Button>
        </div>

        <div className="bg-card rounded-2xl border overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr className="bg-signal text-signal-foreground">
                {["ID", "Name", "Username", "Role", "Email", "Address", "Contract Number", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 font-semibold text-[13px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-t hover:bg-muted/40">
                  <td className="px-5 py-4">{u.id}</td>
                  <td className="px-5 py-4">
                    {u.name} {u.tag && <span className="text-signal">{u.tag}</span>}
                  </td>
                  <td className="px-5 py-4 font-mono text-[12.5px]">{u.username}</td>
                  <td className="px-5 py-4">
                    <RolePill role={u.role} />
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{u.address}</td>
                  <td className="px-5 py-4 font-mono text-[12.5px]">{u.contract}</td>
                  <td className="px-5 py-4">
                    <StatusPill status={u.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-5 py-4 border-t text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              Items per page:
              <select className="border rounded-md px-2 py-1 bg-background">
                <option>25</option>
              </select>
              <span>1-25 of 100 items</span>
            </div>
            <div className="flex items-center gap-3">
              <select className="border rounded-md px-2 py-1 bg-background">
                <option>12</option>
              </select>
              <span>of 40 pages</span>
              <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-full border flex items-center justify-center">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}