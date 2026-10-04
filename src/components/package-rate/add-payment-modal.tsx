"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gauge, Users2, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface OwnRow {
  name: string;
  type: string;
  profile: string;
  pool: string;
  monthly: string;
  base: string;
}

interface CustomerRow extends OwnRow {
  rateType: string;
}

const ownRows: OwnRow[] = [
  { name: "10Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "10Mbps_Pool", monthly: "50.0", base: "50.0" },
  { name: "12Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "12Mbps_Pool", monthly: "50.0", base: "50.0" },
  { name: "15Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "15Mbps_Pool", monthly: "50.0", base: "50.0" },
  { name: "20Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "20Mbps_Pool", monthly: "50.0", base: "50.0" },
  { name: "5Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "5Mbps_Pool", monthly: "50.0", base: "50.0" },
  { name: "8Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "8Mbps_Pool", monthly: "50.0", base: "50.0" },
];

const customerRows: CustomerRow[] = [
  { name: "10Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "10Mbps_Pool", monthly: "490.0", base: "50.0", rateType: "Company Defined" },
  { name: "12Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "12Mbps_Pool", monthly: "588.0", base: "50.0", rateType: "Company Defined" },
  { name: "15Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "15Mbps_Pool", monthly: "490.0", base: "50.0", rateType: "Company Defined" },
  { name: "20Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "20Mbps_Pool", monthly: "588.0", base: "50.0", rateType: "Company Defined" },
  { name: "5Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "5Mbps_Pool", monthly: "490.0", base: "50.0", rateType: "Company Defined" },
  { name: "8Mbps_Package", type: "PPPoE Package", profile: "NO", pool: "8Mbps_Pool", monthly: "588.0", base: "50.0", rateType: "Company Defined" },
];

function RatePagination() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-7 py-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <span>Rows:</span>
        <select className="border rounded-lg px-2 py-1 bg-background">
          <option>25</option>
        </select>
        <span>1-5 of 100 items</span>
      </div>
      <div className="flex items-center gap-2">
        <span>of 40 pages</span>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

function RateSection({
  icon: Icon,
  title,
  subtitle,
  rows,
  showRateType,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  rows: (OwnRow | CustomerRow)[];
  showRateType?: boolean;
}) {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-signal to-violet-accent flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold">{title}</h2>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search packages..." className="pl-9 rounded-full w-64" />
        </div>
      </div>

      <div className="rounded-[28px] bg-card shadow-sm ring-1 ring-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[820px]">
            <thead>
              <tr className="border-b">
                {[
                  "Package",
                  "Type",
                  "PPP Profile",
                  "Pool",
                  "Monthly Bill",
                  "Base Rate",
                  ...(showRateType ? ["Rate Type"] : []),
                ].map((c) => (
                  <th key={c} className="text-left px-7 py-4 font-semibold text-xs tracking-wide text-muted-foreground">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t hover:bg-signal-tint/30 transition-colors">
                  <td className="px-7 py-4 font-semibold">{r.name}</td>
                  <td className="px-7 py-4 text-muted-foreground">{r.type}</td>
                  <td className="px-7 py-4 text-muted-foreground">{r.profile}</td>
                  <td className="px-7 py-4 text-muted-foreground">{r.pool}</td>
                  <td className="px-7 py-4 font-semibold text-signal">৳{r.monthly}</td>
                  <td className="px-7 py-4 text-muted-foreground">৳{r.base}</td>
                  {showRateType && (
                    <td className="px-7 py-4">
                      <span className="px-3 py-1 rounded-full bg-violet-accent-tint text-violet-accent text-xs font-bold">
                        {(r as CustomerRow).rateType}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <RatePagination />
      </div>
    </div>
  );
}

export default function PackagePlanPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-muted/40 to-muted/10">
      <DashboardSidebar />

      <div className="flex-1 min-w-0">
        <DashboardTopbar />

        <div className="px-4 sm:px-8 py-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-signal mb-1">
            Pricing & Plans
          </p>
          <h1 className="font-heading text-[28px] font-bold tracking-tight bg-gradient-to-r from-signal to-violet-accent bg-clip-text text-transparent mb-8">
            Package Plan
          </h1>

          <RateSection
            icon={Gauge}
            title="Own Rates"
            subtitle="What each package costs your organization"
            rows={ownRows}
          />

          <RateSection
            icon={Users2}
            title="Customer Rate"
            subtitle="What clients are billed for each package"
            rows={customerRows}
            showRateType
          />
        </div>
      </div>
    </div>
  );
}