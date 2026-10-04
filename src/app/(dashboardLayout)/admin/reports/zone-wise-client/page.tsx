import { ClientSummaryTable } from "@/components/reports/client-summary-table";

const rows = Array.from({ length: 13 }).map(() => ({
  entity: "Sweet Cable Network",
  total: 96, active: 20, expired: 15, left: 100, pending: 50, pppoe: 30, hotspot: 20, free: 0, vip: 0,
}));

export default function ZoneWiseClientPage() {
  return <ClientSummaryTable title="Zone Wise Client" entityColumnLabel="Reseller" rows={rows} />;
}