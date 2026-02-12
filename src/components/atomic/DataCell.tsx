import { cn } from "@/lib/utils";

interface DataCellProps {
  label: string;
  value: string | number | null;
  unit?: string;
  mono?: boolean;
  className?: string;
}

export function DataCell({ label, value, unit, mono, className }: DataCellProps) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <span className="text-xs text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <span
        className={cn(
          "text-sm font-medium text-foreground",
          mono && "font-mono tracking-wide",
        )}
      >
        {value ?? "—"}
        {unit && value != null && (
          <span className="text-muted-foreground ml-0.5 text-xs">{unit}</span>
        )}
      </span>
    </div>
  );
}
