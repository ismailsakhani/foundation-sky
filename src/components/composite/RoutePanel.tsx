import { Route } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface RoutePanelProps {
  route: string;
  clearance?: string | null;
  className?: string;
}

export function RoutePanel({ route, clearance, className }: RoutePanelProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Route className="h-4 w-4 text-primary" />
          Route
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className="max-h-32">
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground">
            {route}
          </pre>
        </ScrollArea>
        {clearance && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Clearance
            </p>
            <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-foreground rounded-md bg-muted/50 p-3">
              {clearance}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
