import { FolderSearch } from "lucide-react";

export function NoReportState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="w-28 h-28 rounded-full bg-signal-tint flex items-center justify-center">
        <FolderSearch className="h-12 w-12 text-signal" />
      </div>
      {label && <p className="font-heading text-lg font-bold">{label}</p>}
    </div>
  );
}