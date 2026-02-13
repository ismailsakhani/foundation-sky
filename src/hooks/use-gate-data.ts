import { useQuery } from "@tanstack/react-query";
import { gateService } from "@/services/gateService";
import { CACHE_TIMES } from "@/lib/queryClient";
import { formatApiError } from "@/services/api";

export function useGateData(gate: string | undefined, enabled = true) {
  const query = useQuery({
    queryKey: ["gate", gate],
    queryFn: () => gateService.getGateInfo(gate!),
    enabled: enabled && !!gate,
    ...CACHE_TIMES.gate,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? formatApiError(query.error) : null,
    refetch: query.refetch,
  };
}
