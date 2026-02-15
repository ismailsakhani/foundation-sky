import { useState, useEffect, useCallback } from "react";
import { notificationService } from "@/services/notificationService";
import type { NotificationPreference, NotificationEvent } from "@/types/domain";

export function useNotifications(email: string | undefined) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  const reload = useCallback(() => {
    if (!email) return;
    setPreferences(notificationService.getPreferences(email));
    setNotifications(notificationService.getNotifications(email));
  }, [email]);

  useEffect(() => {
    reload();
  }, [reload]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addPreference = useCallback(
    (flightId: string, flightNumber: string) => {
      if (!email) return;
      notificationService.addPreference(email, flightId, flightNumber);
      reload();
    },
    [email, reload],
  );

  const removePreference = useCallback(
    (id: string) => {
      if (!email) return;
      notificationService.removePreference(email, id);
      reload();
    },
    [email, reload],
  );

  const togglePreference = useCallback(
    (id: string, enabled: boolean) => {
      if (!email) return;
      notificationService.togglePreference(email, id, enabled);
      reload();
    },
    [email, reload],
  );

  const updateFrequency = useCallback(
    (id: string, frequency: NotificationPreference["frequency"]) => {
      if (!email) return;
      notificationService.updateFrequency(email, id, frequency);
      reload();
    },
    [email, reload],
  );

  const isWatching = useCallback(
    (flightId: string) => {
      if (!email) return false;
      return notificationService.isWatching(email, flightId);
    },
    [email],
  );

  const markAsRead = useCallback(
    (notifId: string) => {
      if (!email) return;
      notificationService.markAsRead(email, notifId);
      reload();
    },
    [email, reload],
  );

  const markAllAsRead = useCallback(() => {
    if (!email) return;
    notificationService.markAllAsRead(email);
    reload();
  }, [email, reload]);

  return {
    preferences,
    notifications,
    unreadCount,
    addPreference,
    removePreference,
    togglePreference,
    updateFrequency,
    isWatching,
    markAsRead,
    markAllAsRead,
  };
}
