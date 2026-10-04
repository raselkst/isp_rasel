import { cn } from "@/lib/utils";

const roleStyles: Record<string, string> = {
  "Super Admin": "bg-signal text-signal-foreground",
  Admin: "bg-violet-accent text-white",
  Technical: "bg-blue-600 text-white",
  "Sales & Marketing": "bg-success text-white",
  "Accounts & Billing": "bg-caution text-white",
  Client: "bg-neutral-accent text-white",
};

export function RolePill({ role }: { role: string }) {
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-xs font-semibold",
        roleStyles[role] ?? "bg-muted text-foreground"
      )}
    >
      {role}
    </span>
  );
}

export function StatusPill({ status }: { status: "Active" | "Inactive" }) {
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-xs font-semibold",
        status === "Active" ? "bg-success text-white" : "bg-destructive text-white"
      )}
    >
      {status}
    </span>
  );
}