import { ClientSummaryTable } from "@/components/reports/client-summary-table";

const names = [
  "Jane Cooper", "Jerome Bell", "Cody Fisher", "Guy Hawkins", "Esther Howard",
  "Albert Flores", "Ronald Richards", "Floyd Miles", "Kristin Watson",
  "Eleanor Pena", "Darlene Robertson", "Jacob Jones", "Cameron Williamson",
];

const rows = names.map((entity) => ({
  entity, total: 96, active: 20, expired: 15, left: 100, pending: 50, pppoe: 30, hotspot: 20, free: 0, vip: 0,
}));

export default function SubZoneWiseClientPage() {
  return <ClientSummaryTable title="Sub Zone Wise Client" entityColumnLabel="Sub zone" rows={rows} />;
}