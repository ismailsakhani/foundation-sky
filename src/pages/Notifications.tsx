import { Bell } from "lucide-react";

const Notifications = () => {
  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-2">
        <Bell className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No notifications yet. Track a flight to receive updates.
        </p>
      </div>
    </div>
  );
};

export default Notifications;
