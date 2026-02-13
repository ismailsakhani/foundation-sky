import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { FormattedError } from "@/services/api";

interface ErrorCardProps {
  error: FormattedError;
  onRetry?: () => void;
  className?: string;
}

export function ErrorCard({ error, onRetry, className }: ErrorCardProps) {
  const isNetwork = error.status === 0;
  const Icon = isNetwork ? WifiOff : AlertTriangle;

  return (
    <Card className={className}>
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <Icon className="h-7 w-7 text-destructive" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">
            {isNetwork ? "Connection Error" : `Error ${error.status}`}
          </h3>
          <p className="text-sm text-muted-foreground">{error.message}</p>
          {error.detail && (
            <p className="text-xs text-muted-foreground/70">{error.detail}</p>
          )}
        </div>

        {error.retryable && onRetry && (
          <Button variant="secondary" size="sm" onClick={onRetry}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
