import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/atomic";
import { DataCell } from "@/components/atomic";
import { formatTime } from "@/utils/helpers";
import type { FlightData } from "@/types/api";
import { cn } from "@/lib/utils";

interface SummaryTableProps {
  flight: FlightData;
  className?: string;
}

export function SummaryTable({ flight, className }: SummaryTableProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        {/* Header row: flight number + status */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-mono tracking-wide text-foreground">
              {flight.flightNumber}
            </h2>
            <p className="text-xs text-muted-foreground">{flight.airline}</p>
          </div>
          <StatusBadge status={flight.status} />
        </div>

        {/* Airport pair */}
        <div className="flex items-center justify-between gap-4 mb-5 py-3 px-4 rounded-lg bg-muted/50">
          <div className="text-center flex-1">
            <p className="text-2xl font-mono font-bold tracking-wider text-foreground">
              {flight.origin}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Departure</p>
          </div>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          <div className="text-center flex-1">
            <p className="text-2xl font-mono font-bold tracking-wider text-foreground">
              {flight.destination}
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Arrival</p>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <DataCell label="Aircraft" value={flight.aircraftType} mono />
          <DataCell label="Dep Gate" value={flight.departureGate} mono />
          <DataCell label="Arr Gate" value={flight.arrivalGate} mono />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              Departure
            </span>
            <span className="text-sm font-mono tracking-wide">
              {flight.actualDeparture ? (
                <>
                  <span className="line-through text-muted-foreground mr-1">
                    {formatTime(flight.scheduledDeparture)}
                  </span>
                  <span className="text-foreground font-medium">
                    {formatTime(flight.actualDeparture)}
                  </span>
                </>
              ) : (
                <span className="text-foreground font-medium">
                  {formatTime(flight.scheduledDeparture)}
                </span>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
