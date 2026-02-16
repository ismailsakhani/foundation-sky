import type { FlightData, EDCT } from "@/types/api";

export const flightService = {
  getFlightData: async (flightID: string): Promise<FlightData> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const id = flightID.toUpperCase().replace(/\s/g, ''); // Handles "UA 4433" or "UA4433"

    // STRICT MOCK CONDITION: Only works for UA4433
    if (id !== "UA4433") {
      throw new Error(`Flight ${id} not found. (Mock only supports UA4433)`);
    }

    return {
      flightNumber: "UA4433",
      airline: "United Airlines",
      aircraftType: "B739",
      origin: "KEWR",
      destination: "KORD",
      departureAlternate: "KJFK",
      arrivalAlternate: "KMDW",
      departureGate: "C101",
      arrivalGate: "B12",
      scheduledDeparture: "14:00 EDT",
      actualDeparture: null,
      scheduledArrival: "15:30 CDT",
      actualArrival: null,
      status: "delayed", 
      edct: null,
    };
  },

  getFlightStats: async (flightID: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const id = flightID.toUpperCase().replace(/\s/g, '');
    if (id !== "UA4433") throw new Error("Not found");

    return {
      route: "ELVAE1 COL ELVAE Q436 EWC J146 DJB J110 GSH J19 OBK",
      clearance: "CLEARED AS FILED. CLIMB VIA SID. EXPECT FL340 10 MINS AFT DEP.",
    };
  },

  getEDCT: async (flightID: string): Promise<EDCT | null> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const id = flightID.toUpperCase().replace(/\s/g, '');
    if (id !== "UA4433") return null;

    return {
      edct_departure_time: "14:45 EDT",
      delay_duration: "45 mins",
      reason: "Weather / Low Ceilings at destination",
    };
  },
};