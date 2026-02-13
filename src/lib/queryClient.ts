import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

/**
 * Retry strategy: skip 4xx (not retryable), retry 5xx up to 3 times.
 */
function shouldRetry(failureCount: number, error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    if (status >= 400 && status < 500) return false; // Don't retry client errors
  }
  return failureCount < 3;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: shouldRetry,
      refetchOnWindowFocus: false,
      // Sensible global defaults — overridden per-hook
      staleTime: 60_000,
      gcTime: 5 * 60_000,
    },
    mutations: {
      retry: false,
    },
  },
});

/* ── Per-type cache presets ─────────────────────────────────── */

export const CACHE_TIMES = {
  flight: { staleTime: 30_000, refetchInterval: 60_000 },
  edct: { staleTime: 20_000, refetchInterval: 30_000 },
  weather: { staleTime: 5 * 60_000, refetchInterval: 10 * 60_000 },
  gate: { staleTime: 60_000, refetchInterval: 30_000 },
  search: { staleTime: 10 * 60_000 },
} as const;
