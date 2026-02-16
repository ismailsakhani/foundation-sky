import client from "./api";
import type { FlightData, EDCT } from "@/types/api";

export const flightService = {
  /** Fetch flight data. Pass `mock=true` to use mock endpoint. */
  getFlightData: async (flightID: string, mock = false): Promise<FlightData> => {
    const params = mock ? { mock: "true" } : undefined;
    const { data } = await client.get<FlightData>(`/ajms/${flightID}`, { params });
    return data;
  },

  /** Fetch flight stats with timezone info. */
  getFlightStats: async (flightID: string) => {
    const { data } = await client.get(`/flightStatsTZ/${flightID}`);
    return data;
  },

  /** Fetch FlightAware data (respecting environment toggles). */
  getFlightAwareData: async (flightID: string) => {
    if (import.meta.env.VITE_APP_AVOID_FLIGHT_AWARE === "true") {
      return { data: {}, error: true };
    }
    
    if (import.meta.env.VITE_ENV === "dev") {
      console.log("Getting flightaware data. Switch it off in .env if not needed");
    }
    
    try {
      const { data } = await client.get(`/flightAware/${flightID}`);
      return { data, error: false };
    } catch (error) {
      console.error("FlightAware Error:", error);
      return { data: {}, error: true };
    }
  },

  /** Fetch EDCT (departure clearance) for a flight. */
  getEDCT: async (flightID: string, origin: string, destination: string): Promise<EDCT | null> => {
    const { data } = await client.get<EDCT | null>(`/EDCTLookup/${flightID}`, {
      params: { origin, destination },
    });
    return data;
  },
};