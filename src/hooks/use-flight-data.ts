import { useQuery } from "@tanstack/react-query";
import { flightService } from "@/services/flightService";
import { weatherService } from "@/services/weatherService";
import { CACHE_TIMES } from "@/lib/queryClient";
import { formatApiError } from "@/services/api";

export function useFlightData(flightID: string | undefined, mock = false) {
  const flightQuery = useQuery({
    queryKey: ["flight", flightID, mock],
    queryFn: () => flightService.getFlightData(flightID!, mock),
    enabled: !!flightID,
    ...CACHE_TIMES.flight,
  });

  const edctQuery = useQuery({
    queryKey: ["edct", flightID],
    queryFn: () =>
      flightService.getEDCT(
        flightID!,
        flightQuery.data?.origin ?? "",
        flightQuery.data?.destination ?? "",
      ),
    enabled: !!flightID && !!flightQuery.data,
    ...CACHE_TIMES.edct,
  });

  const statsQuery = useQuery({
    queryKey: ["flightStats", flightID],
    queryFn: () => flightService.getFlightStats(flightID!),
    enabled: !!flightID,
    ...CACHE_TIMES.flight,
  });

  // Fetch weather for origin & destination once flight data arrives
  const originWeather = useQuery({
    queryKey: ["weather", flightQuery.data?.origin],
    queryFn: () => weatherService.getAirportWeather(flightQuery.data!.origin),
    enabled: !!flightQuery.data?.origin,
    ...CACHE_TIMES.weather,
  });

  const destWeather = useQuery({
    queryKey: ["weather", flightQuery.data?.destination],
    queryFn: () => weatherService.getAirportWeather(flightQuery.data!.destination),
    enabled: !!flightQuery.data?.destination,
    ...CACHE_TIMES.weather,
  });

  const isLoading =
    flightQuery.isLoading || edctQuery.isLoading || statsQuery.isLoading;

  const error = flightQuery.error
    ? formatApiError(flightQuery.error)
    : null;

  return {
    flight: flightQuery.data ?? null,
    edct: edctQuery.data ?? null,
    stats: statsQuery.data ?? null,
    originWeather: originWeather.data ?? null,
    destWeather: destWeather.data ?? null,
    isLoading,
    error,
    refetch: () => {
      flightQuery.refetch();
      edctQuery.refetch();
      statsQuery.refetch();
      originWeather.refetch();
      destWeather.refetch();
    },
  };
}
