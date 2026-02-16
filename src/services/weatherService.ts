import client from "./api";
import type { AirportWeather, NASStatus } from "@/types/api";

/** Normalise to 4-letter ICAO code (prepend K for 3-letter US codes). */
function toICAO(code: string): string {
  const c = code.toUpperCase().trim();
  return c.length === 3 ? `K${c}` : c;
}

export const weatherService = {
  /** Fetch Live Weather, MDB Weather, and map to UI interfaces. */
  getAirportWeather: async (airportCode: string): Promise<AirportWeather> => {
    const icao = toICAO(airportCode);

    try {
      // 1. Fetch live, MDB, AND NAS data in parallel
      const [liveRes, mdbRes, nasRes] = await Promise.all([
        client.get(`/liveAirportWeather/${icao}`).catch(() => ({ data: {} })),
        client.get(`/mdbAirportWeatherByAirportCode/${icao}`).catch(() => ({ data: {} })),
        client.get(`/NAS`, { params: { airport: icao } }).catch(() => ({ data: {} }))
      ]);

      // Extract the nested data 
      const liveData = liveRes.data?.data || liveRes.data || {};
      const mdbData = mdbRes.data?.data || mdbRes.data || {};
      const nasRaw = nasRes.data || {};

      console.log("🛠️ Raw Live Weather from Backend:", liveData);
      console.log("🛠️ Raw MDB Weather from Backend:", mdbData);

      // 2. Map METAR and TAF (incorporating the _zt recency strings)
      const metarRaw = liveData.metar || mdbData.metar || null;
      const metarZt = liveData.metar_zt || mdbData.metar_zt || "";
      
      const tafRaw = liveData.taf || mdbData.taf || null;
      const tafZt = liveData.taf_zt || mdbData.taf_zt || "";

      // 3. Map DATIS (Extracting from the nested combined/arr/dep dict)
      let datisRaw = null;
      let datisZt = "";
      const datisSource = liveData.datis || mdbData.datis;
      
      if (datisSource && typeof datisSource === 'object') {
        // Look inside combined, then arr, then dep exactly like your backend structure
        const dObj = datisSource.combined || datisSource.arr || datisSource.dep;
        if (dObj && typeof dObj === 'object') {
          datisRaw = dObj.datis || null;
          datisZt = dObj.datis_zt || "";
        }
      } else if (typeof datisSource === 'string' && datisSource !== 'N/A') {
        datisRaw = datisSource;
      }

      // 4. Map NAS Status (This was missing in my previous snippet!)
      const nasStatus: NASStatus | null = (nasRaw && Object.keys(nasRaw).length > 0) ? {
        hasDelays: !!nasRaw.groundDelay || !!nasRaw.groundStop,
        groundDelay: nasRaw.groundDelay || null,
        groundStop: nasRaw.groundStop || null,
        airspaceFlowProgram: nasRaw.airspaceFlowProgram || null,
        notes: nasRaw.notes || []
      } : null;

      return {
        icao: icao,
        name: mdbData.name || mdbData.airportName || icao,
        metar: metarRaw && metarRaw !== 'N/A' ? { raw: metarRaw, zt: metarZt } : null,
        taf: tafRaw && tafRaw !== 'N/A' ? { raw: tafRaw, zt: tafZt } : null,
        datis: datisRaw && datisRaw !== 'N/A' ? { raw: datisRaw, zt: datisZt } : null,
        nas: nasStatus
      };

    } catch (error) {
      console.error("Failed to fetch weather:", error);
      throw error;
    }
  },
};