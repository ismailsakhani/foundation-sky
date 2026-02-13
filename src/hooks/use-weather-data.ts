import { useQuery } from "@tanstack/react-query";
import { weatherService } from "@/services/weatherService";
import { CACHE_TIMES } from "@/lib/queryClient";
import { formatApiError } from "@/services/api";

export function useWeatherData(airportCode: string | undefined, enabled = true) {
  const query = useQuery({
    queryKey: ["weather", airportCode],
    queryFn: () => weatherService.getAirportWeather(airportCode!),
    enabled: enabled && !!airportCode,
    ...CACHE_TIMES.weather,
  });

  return {
    metar: query.data?.metar ?? null,
    taf: query.data?.taf ?? null,
    datis: query.data?.datis ?? null,
    nas: query.data?.nas ?? null,
    isLoading: query.isLoading,
    error: query.error ? formatApiError(query.error) : null,
    refetch: query.refetch,
  };
}
