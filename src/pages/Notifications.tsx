import {
  Bell,
  BellOff,
  Trash2,
  CheckCheck,
  Plane,
  AlertTriangle,
  Info,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { NotificationPreference, NotificationEvent } from "@/types/domain";

const frequencyLabels: Record<NotificationPreference["frequency"], string> = {
  realtime: "Real-time",
  "15min": "Every 15 min",
  "30min": "Every 30 min",
  "1hr": "Hourly",
};

const severityConfig: Record<
  NotificationEvent["severity"],
  { icon: React.ElementType; className: string }
> = {
  info: { icon: Info, className: "text-primary" },
  warning: { icon: AlertTriangle, className: "text-warning" },
  critical: { icon: AlertTriangle, className: "text-destructive" },
};

const Notifications = () => {
  const { user } = useAuth();
  const {
    preferences,
    notifications,
    unreadCount,
    togglePreference,
    removePreference,
    updateFrequency,
    markAsRead,
    markAllAsRead,
  } = useNotifications(user?.email);

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="gap-1.5 text-xs">
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Watched Flights */}
      <section className="mb-10">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Watched Flights
        </h2>

        {preferences.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <BellOff className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">No watched flights</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Search for a flight and tap "Notify Me" to start watching.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {preferences.map((pref) => (
              <div
                key={pref.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl border bg-card p-4 transition-colors",
                  pref.enabled ? "border-border" : "border-border/50 opacity-60",
                )}
              >
                <Plane className="h-4 w-4 shrink-0 text-primary" />

                <div className="flex-1 min-w-0">
                  <p className="text-data text-sm font-semibold text-foreground">
                    {pref.flightNumber}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {pref.enabled ? "Watching" : "Paused"}
                  </p>
                </div>

                {/* Frequency */}
                <Select
                  value={pref.frequency}
                  onValueChange={(val) =>
                    updateFrequency(pref.id, val as NotificationPreference["frequency"])
                  }
                >
                  <SelectTrigger className="h-8 w-[130px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(frequencyLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value} className="text-xs">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Toggle */}
                <Button
                  variant={pref.enabled ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => togglePreference(pref.id, !pref.enabled)}
                  aria-label={pref.enabled ? "Pause notifications" : "Resume notifications"}
                >
                  {pref.enabled ? (
                    <Bell className="h-3.5 w-3.5" />
                  ) : (
                    <BellOff className="h-3.5 w-3.5" />
                  )}
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removePreference(pref.id)}
                  aria-label="Remove from watched"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notification History */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          History
        </h2>

        {notifications.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Clock className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm font-medium text-foreground">No notifications yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notifications will appear here when watched flights have updates.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const { icon: SeverityIcon, className: sevClass } =
                severityConfig[notif.severity];
              return (
                <button
                  key={notif.id}
                  onClick={() => !notif.read && markAsRead(notif.id)}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                    notif.read
                      ? "border-border/50 bg-card/50"
                      : "border-border bg-card hover:bg-accent/30",
                  )}
                >
                  <SeverityIcon className={cn("mt-0.5 h-4 w-4 shrink-0", sevClass)} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-data text-xs font-semibold text-foreground">
                        {notif.flightNumber}
                      </span>
                      {!notif.read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{notif.title}</p>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                  </div>

                  <time className="shrink-0 text-[10px] text-muted-foreground">
                    {new Date(notif.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;
