import { useState, useCallback } from "react";

interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Generic hook for one-off async operations (not cached queries).
 */
export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (fn: () => Promise<T>) => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const data = await fn();
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setState({ data: null, isLoading: false, error });
      throw error;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, isLoading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
