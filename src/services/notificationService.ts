import type { NotificationPreference, NotificationEvent } from "@/types/domain";

const PREFS_KEY = "flightops_notif_prefs";
const EVENTS_KEY = "flightops_notif_events";

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded
  }
}

function prefKey(email: string) {
  return `${PREFS_KEY}_${email}`;
}
function eventKey(email: string) {
  return `${EVENTS_KEY}_${email}`;
}

export const notificationService = {
  /* ── Preferences ─────────────────────────────── */

  getPreferences(email: string): NotificationPreference[] {
    return loadJSON<NotificationPreference[]>(prefKey(email), []);
  },

  addPreference(
    email: string,
    flightId: string,
    flightNumber: string,
  ): NotificationPreference {
    const prefs = notificationService.getPreferences(email);
    // Don't duplicate
    const existing = prefs.find((p) => p.flightId === flightId);
    if (existing) return existing;

    const pref: NotificationPreference = {
      id: `pref_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      flightId,
      flightNumber,
      enabled: true,
      frequency: "realtime",
      types: ["status_change", "gate_change", "delay", "edct"],
    };
    prefs.push(pref);
    saveJSON(prefKey(email), prefs);
    return pref;
  },

  removePreference(email: string, id: string): void {
    const prefs = notificationService.getPreferences(email).filter((p) => p.id !== id);
    saveJSON(prefKey(email), prefs);
  },

  togglePreference(email: string, id: string, enabled: boolean): void {
    const prefs = notificationService.getPreferences(email).map((p) =>
      p.id === id ? { ...p, enabled } : p,
    );
    saveJSON(prefKey(email), prefs);
  },

  updateFrequency(
    email: string,
    id: string,
    frequency: NotificationPreference["frequency"],
  ): void {
    const prefs = notificationService.getPreferences(email).map((p) =>
      p.id === id ? { ...p, frequency } : p,
    );
    saveJSON(prefKey(email), prefs);
  },

  isWatching(email: string, flightId: string): boolean {
    return notificationService
      .getPreferences(email)
      .some((p) => p.flightId === flightId && p.enabled);
  },

  /* ── Notification Events ─────────────────────── */

  getNotifications(email: string): NotificationEvent[] {
    return loadJSON<NotificationEvent[]>(eventKey(email), []);
  },

  markAsRead(email: string, notifId: string): void {
    const events = notificationService.getNotifications(email).map((e) =>
      e.id === notifId ? { ...e, read: true } : e,
    );
    saveJSON(eventKey(email), events);
  },

  markAllAsRead(email: string): void {
    const events = notificationService
      .getNotifications(email)
      .map((e) => ({ ...e, read: true }));
    saveJSON(eventKey(email), events);
  },

  getUnreadCount(email: string): number {
    return notificationService
      .getNotifications(email)
      .filter((e) => !e.read).length;
  },

  /** Add a mock notification event (for testing). */
  _addMockEvent(email: string, event: NotificationEvent): void {
    const events = notificationService.getNotifications(email);
    events.unshift(event);
    saveJSON(eventKey(email), events);
  },
};
