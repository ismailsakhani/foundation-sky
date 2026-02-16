import { DoorOpen, PlaneTakeoff, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/atomic";
import type { GateInfo, GateFlight } from "@/types/api";
import { cn } from "@/lib/utils";

interface GateListProps {
  gate: GateInfo;
  className?: string;
}

export function GateList({ gate, className }: GateListProps) {
  const navigate = useNavigate();

  // Helper function to render a flight row uniformly
  const renderFlightRow = (f: GateFlight) => (
    <TableRow
      key={f.flightNumber}
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/details?q=${encodeURIComponent(f.flightNumber)}&type=flight`)}
    >
      <TableCell className="font-mono text-sm font-medium">
        {f.flightNumber}
        <div className="text-[10px] text-muted-foreground mt-0.5">To: {f.destination} ({f.aircraftType})</div>
      </TableCell>
      <TableCell className="font-mono text-sm">
        {f.scheduledDeparture}
        {f.estimatedDeparture && (
          <div className="text-[10px] text-warning mt-0.5">Est: {f.estimatedDeparture}</div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <StatusBadge status={f.status} size="sm" />
      </TableCell>
    </TableRow>
  );

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <DoorOpen className="h-4 w-4 text-primary" />
          Gate {gate.gate}
          <span className="text-sm font-normal text-muted-foreground">
            — {gate.airport} Terminal {gate.terminal}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Flight & Dest</TableHead>
                <TableHead className="text-xs">Departure</TableHead>
                <TableHead className="text-xs text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              
              {/* 1. Current Flight Section */}
              {gate.currentFlight && (
                <>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell colSpan={3} className="text-xs font-semibold uppercase text-muted-foreground py-2">
                      <div className="flex items-center gap-1.5"><PlaneTakeoff className="h-3 w-3" /> Current / Next Flight</div>
                    </TableCell>
                  </TableRow>
                  {renderFlightRow(gate.currentFlight)}
                </>
              )}

              {/* 2. Upcoming Flights Section */}
              {gate.upcomingFlights.length > 0 && (
                <>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableCell colSpan={3} className="text-xs font-semibold uppercase text-muted-foreground py-2">
                        <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Upcoming Scheduled</div>
                    </TableCell>
                  </TableRow>
                  {gate.upcomingFlights.map(renderFlightRow)}
                </>
              )}

              {/* 3. Empty State if nothing is at the gate */}
              {!gate.currentFlight && gate.upcomingFlights.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-6">
                    No flights scheduled at this gate.
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}