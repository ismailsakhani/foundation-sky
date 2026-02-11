import type { FlightStatus } from "@/types";

export function getStatusColor(status: FlightStatus): string {
  const map: Record<FlightStatus, string> = {
    scheduled: "text-muted-foreground",
    boarding: "text-primary",
    departed: "text-primary",
    en_route: "text-primary",
    arrived: "text-success",
    delayed: "text-warning",
    cancelled: "text-destructive",
    diverted: "text-warning",
  };
  return map[status];
}

export function getStatusLabel(status: FlightStatus): string {
  const map: Record<FlightStatus, string> = {
    scheduled: "Scheduled",
    boarding: "Boarding",
    departed: "Departed",
    en_route: "En Route",
    arrived: "Arrived",
    delayed: "Delayed",
    cancelled: "Cancelled",
    diverted: "Diverted",
  };
  return map[status];
}

export function formatTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getFlightCategoryColor(cat: "VFR" | "MVFR" | "IFR" | "LIFR"): string {
  const map = {
    VFR: "text-success",
    MVFR: "text-primary",
    IFR: "text-destructive",
    LIFR: "text-destructive",
  };
  return map[cat];
}
