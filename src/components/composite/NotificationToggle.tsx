import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NotificationToggleProps {
  enabled: boolean;
  loading?: boolean;
  onToggle: () => void;
  className?: string;
}

export function NotificationToggle({
  enabled,
  loading = false,
  onToggle,
  className,
}: NotificationToggleProps) {
  return (
    <Button
      variant={enabled ? "default" : "outline"}
      size="sm"
      onClick={onToggle}
      loading={loading}
      className={cn(
        "gap-1.5",
        enabled && "bg-primary text-primary-foreground",
        className,
      )}
      aria-label={enabled ? "Disable notifications" : "Enable notifications"}
    >
      {enabled ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
      {enabled ? "Notifications On" : "Notify Me"}
    </Button>
  );
}
