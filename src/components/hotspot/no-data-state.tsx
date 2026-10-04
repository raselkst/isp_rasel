import { MonitorX } from "lucide-react";

export function NoDataState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="relative w-28 h-24 flex items-center justify-center">
        <div className="w-24 h-24 rounded-2xl bg-signal-tint flex items-center justify-center">
          <MonitorX className="h-10 w-10 text-signal" />
        </div>
      </div>
      <p className="font-heading text-lg font-bold">No data available in table</p>
    </div>
  );
}