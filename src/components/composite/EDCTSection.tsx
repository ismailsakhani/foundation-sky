import { AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataCell } from "@/components/atomic";
import { formatTime } from "@/utils/helpers";
import type { EDCT } from "@/types/api";
import { cn } from "@/lib/utils";

interface EDCTSectionProps {
  edct: EDCT;
  filedDeparture: string;
  className?: string;
}

function formatTMinus(minutes: number): string {
  const h = Math.floor(Math.abs(minutes) / 60);
  const m = Math.abs(minutes) % 60;
  const sign = minutes < 0 ? "+" : "-";
  return `T${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function EDCTSection({ edct, filedDeparture, className }: EDCTSectionProps) {
  const isCritical = edct.tMinus <= 15;
  const isCancelled = edct.reason.toLowerCase().includes("cancel");

  return (
    <Card className={cn("overflow-hidden", className)}>
      {isCancelled && (
        <div className="flex items-center gap-2 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
          <AlertTriangle className="h-4 w-4" />
          EDCT Cancelled — {edct.reason}
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-primary" />
          Departure Clearance (EDCT)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4">
          <DataCell label="Filed Departure" value={formatTime(filedDeparture)} mono />
          <DataCell label="EDCT Time" value={formatTime(edct.edctTime)} mono />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              T-Minus
            </span>
            <span
              className={cn(
                "text-sm font-mono font-semibold tracking-wide",
                isCritical ? "text-destructive" : "text-foreground",
              )}
            >
              {formatTMinus(edct.tMinus)}
            </span>
          </div>
          <DataCell label="Control Element" value={edct.controlElement} mono />
        </div>
      </CardContent>
    </Card>
  );
}
