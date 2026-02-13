import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import type { ApiError } from "@/types/api";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const isDev = import.meta.env.DEV;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

/**
 * Create and configure the Axios instance.
 */
const client: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

/* ── Request interceptor ───────────────────────────────────── */
client.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (isDev) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    // Future: attach auth headers here
    return config;
  },
  (error) => Promise.reject(error),
);

/* ── Response interceptor ──────────────────────────────────── */
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig & { _retryCount?: number };

    // Retry on 5xx (up to MAX_RETRIES)
    const status = error.response?.status ?? 0;
    if (status >= 500 && config && (config._retryCount ?? 0) < MAX_RETRIES) {
      config._retryCount = (config._retryCount ?? 0) + 1;
      if (isDev) {
        console.warn(`[API] Retry ${config._retryCount}/${MAX_RETRIES} for ${config.url}`);
      }
      await new Promise((r) => setTimeout(r, RETRY_DELAY * config._retryCount!));
      return client(config);
    }

    return Promise.reject(error);
  },
);

export default client;

/* ── Error formatting ──────────────────────────────────────── */

const friendlyMessages: Record<number, string> = {
  400: "Please check your input and try again.",
  401: "Authentication required. Please log in.",
  403: "You don't have permission to access this resource.",
  404: "Not found — try another search.",
  429: "Too many requests. Please wait a moment.",
};

export interface FormattedError {
  status: number;
  message: string;
  detail?: string;
  retryable: boolean;
}

export function formatApiError(error: unknown): FormattedError {
  if (axios.isAxiosError(error)) {
    const axErr = error as AxiosError<ApiError>;
    const status = axErr.response?.status ?? 0;
    const serverMessage = axErr.response?.data?.message;
    const serverDetail = axErr.response?.data?.detail;

    // Network / timeout
    if (!axErr.response) {
      if (isDev) console.error("[API] Network error:", axErr.message);
      return {
        status: 0,
        message: "Unable to connect. Please check your internet connection.",
        retryable: true,
      };
    }

    if (isDev) console.error(`[API] ${status}:`, serverMessage || axErr.message);

    return {
      status,
      message: friendlyMessages[status] ?? (status >= 500 ? "Service error — please try again later." : (serverMessage || "Something went wrong.")),
      detail: serverDetail,
      retryable: status >= 500 || status === 429,
    };
  }

  if (isDev) console.error("[API] Unknown error:", error);
  return {
    status: 0,
    message: "An unexpected error occurred.",
    retryable: false,
  };
}
