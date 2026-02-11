export interface User {
  id: string;
  email: string;
  provider: "google" | "email";
  loginTime: string;
  displayName?: string;
}

export interface NotificationPreference {
  id: string;
  flightId: string;
  flightNumber: string;
  enabled: boolean;
  frequency: "realtime" | "15min" | "30min" | "1hr";
  types: NotificationType[];
}

export type NotificationType =
  | "status_change"
  | "gate_change"
  | "delay"
  | "edct"
  | "weather";

export interface NotificationEvent {
  id: string;
  flightId: string;
  flightNumber: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  severity: "info" | "warning" | "critical";
}

export interface AppError {
  status: number;
  code: string;
  message: string;
  userMessage: string;
}
