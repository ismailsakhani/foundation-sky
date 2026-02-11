export interface FlightData {
  flightNumber: string;
  airline: string;
  aircraftType: string;
  origin: string;
  destination: string;
  departureGate: string;
  arrivalGate: string;
  scheduledDeparture: string;
  actualDeparture: string | null;
  scheduledArrival: string;
  actualArrival: string | null;
  status: FlightStatus;
  edct: EDCT | null;
}

export type FlightStatus =
  | "scheduled"
  | "boarding"
  | "departed"
  | "en_route"
  | "arrived"
  | "delayed"
  | "cancelled"
  | "diverted";

export interface EDCT {
  edctTime: string;
  tMinus: number;
  controlElement: string;
  reason: string;
}

export interface METAR {
  raw: string;
  station: string;
  observationTime: string;
  wind: {
    direction: number;
    speed: number;
    gust: number | null;
    unit: string;
  };
  temperature: number;
  dewpoint: number;
  visibility: number;
  ceiling: number | null;
  clouds: CloudLayer[];
  altimeter: number;
  flightCategory: "VFR" | "MVFR" | "IFR" | "LIFR";
}

export interface CloudLayer {
  coverage: "FEW" | "SCT" | "BKN" | "OVC";
  altitude: number;
}

export interface TAF {
  raw: string;
  station: string;
  issueTime: string;
  validFrom: string;
  validTo: string;
  forecasts: TAFForecast[];
}

export interface TAFForecast {
  type: "BASE" | "TEMPO" | "BECMG" | "FM";
  fromTime: string;
  toTime: string;
  wind: {
    direction: number;
    speed: number;
    gust: number | null;
  };
  visibility: number;
  clouds: CloudLayer[];
  flightCategory: "VFR" | "MVFR" | "IFR" | "LIFR";
}

export interface AirportWeather {
  icao: string;
  name: string;
  metar: METAR | null;
  taf: TAF | null;
  datis: string | null;
  nas: NASStatus | null;
}

export interface NASStatus {
  hasDelays: boolean;
  groundDelay: string | null;
  groundStop: string | null;
  airspaceFlowProgram: string | null;
  notes: string[];
}

export interface GateInfo {
  airport: string;
  gate: string;
  terminal: string;
  flights: FlightData[];
}

export interface SearchSuggestion {
  type: "flight" | "airport" | "gate";
  value: string;
  label: string;
  sublabel: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
}
