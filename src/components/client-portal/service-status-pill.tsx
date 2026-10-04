import { cn } from "@/lib/utils";

type ServiceStatus = "Active" | "Suspend" | "Pending" | "Terminated";

const statusStyles: Record<ServiceStatus, string> = {
  Active: "bg-success text-white",
  Suspend: "bg-caution text-white",
  Pending: "bg-neutral-accent text-white",
  Terminated: "bg-destructive text-white",
};

export function ServiceStatusPill({ status }: { status: ServiceStatus }) {
  return (
    <span
      className={cn(
        "inline-flex px-3 py-1 rounded-full text-xs font-semibold",
        statusStyles[status]
      )}
    >
      {status}
    </span>
  );
}