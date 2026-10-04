import { SalesReportTable } from "@/components/reports/sales-report-table";

const rows = Array.from({ length: 12 }).map(() => ({
  year: "2025", month: "March", sales: 179, amount: 85600,
}));

export default function ServerWiseSalesPage() {
  return <SalesReportTable title="ServerWise Sales" rows={rows} />;
}