import { DoorOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/atomic";
import { formatTime } from "@/utils/helpers";
import type { GateInfo } from "@/types/api";
import { cn } from "@/lib/utils";

interface GateListProps {
  gate: GateInfo;
  className?: string;
}

export function GateList({ gate, className }: GateListProps) {
  const navigate = useNavigate();

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
                <TableHead className="text-xs">Flight #</TableHead>
                <TableHead className="text-xs">Departure</TableHead>
                <TableHead className="text-xs text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gate.flights.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-6">
                    No flights at this gate
                  </TableCell>
                </TableRow>
              ) : (
                gate.flights.map((f) => (
                  <TableRow
                    key={f.flightNumber}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() =>
                      navigate(`/details?q=${encodeURIComponent(f.flightNumber)}`)
                    }
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {f.flightNumber}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatTime(f.scheduledDeparture)}
                    </TableCell>
                    <TableCell className="text-right">
                      <StatusBadge status={f.status} size="sm" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
