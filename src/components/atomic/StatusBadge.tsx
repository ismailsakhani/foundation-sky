import { cn } from "@/lib/utils";
import type { FlightStatus } from "@/types/api";
import { getStatusLabel } from "@/utils/helpers";

interface StatusBadgeProps {
  status: FlightStatus;
  size?: "sm" | "md";
  className?: string;
}

const statusStyles: Record<FlightStatus, string> = {
  scheduled: "bg-muted text-muted-foreground",
  boarding: "bg-primary/15 text-primary",
  departed: "bg-primary/15 text-primary",
  en_route: "bg-info/15 text-info-foreground",
  arrived: "bg-success/15 text-success-foreground",
  delayed: "bg-warning/15 text-warning-foreground",
  cancelled: "bg-destructive/15 text-destructive-foreground",
  diverted: "bg-warning/15 text-warning-foreground",
};

const dotStyles: Record<FlightStatus, string> = {
  scheduled: "bg-muted-foreground",
  boarding: "bg-primary animate-pulse-glow",
  departed: "bg-primary",
  en_route: "bg-info",
  arrived: "bg-success",
  delayed: "bg-warning",
  cancelled: "bg-destructive",
  diverted: "bg-warning",
};

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
        statusStyles[status],
        className,
      )}
    >
      <span
        className={cn(
          "rounded-full shrink-0",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          dotStyles[status],
        )}
      />
      {getStatusLabel(status)}
    </span>
  );
}
