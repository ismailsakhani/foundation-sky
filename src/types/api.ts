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

export interface WeatherBlock {
  raw: string;
  zt: string; // The "55 mins ago" recency string from your backend
}

export interface AirportWeather {
  icao: string;
  name: string;
  metar: WeatherBlock | null;
  taf: WeatherBlock | null;
  datis: WeatherBlock | null;
  nas: NASStatus | null; // Leave NASStatus interface exactly as it is further down the file
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
