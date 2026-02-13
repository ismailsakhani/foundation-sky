import client from "./api";
import type { AirportWeather } from "@/types/api";

/** Normalise to 4-letter ICAO code (prepend K for 3-letter US codes). */
function toICAO(code: string): string {
  const c = code.toUpperCase().trim();
  return c.length === 3 ? `K${c}` : c;
}

export const weatherService = {
  /** Fetch METAR, TAF, D-ATIS, and NAS status for an airport. */
  getAirportWeather: async (airportCode: string): Promise<AirportWeather> => {
    const icao = toICAO(airportCode);
    const { data } = await client.get<AirportWeather>(`/mdbAirportWeatherByAirportCode/${icao}`);
    return data;
  },
};
