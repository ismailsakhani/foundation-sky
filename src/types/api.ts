export interface FlightData {
  flightNumber: string;
  airline: string;
  aircraftType: string;
  origin: string;
  destination: string;
  departureAlternate: string | null;
  arrivalAlternate: string | null;
  departureGate: string;
  arrivalGate: string;
  scheduledDeparture: string | null;
  actualDeparture: string | null;
  scheduledArrival: string | null;
  actualArrival: string | null;
  status: FlightStatus | string;
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
  | "diverted"
  | string;

export interface EDCT {
  edct_departure_time: string;
  delay_duration: string;
  reason: string;
}

// Replaces the complex METAR/TAF widgets with our simple HTML injection blocks
export interface WeatherBlock {
  raw: string;
  zt: string;
}

export interface AirportWeather {
  icao: string;
  name: string;
  metar: WeatherBlock | null;
  taf: WeatherBlock | null;
  datis: WeatherBlock | null;
  nas: NASStatus | null;
}

export interface NASStatus {
  hasDelays: boolean;
  groundDelay: string | null;
  groundStop: string | null;
  airspaceFlowProgram: string | null;
  notes: string[];
}

// Updated to match the mock data structure for Gates
export interface GateFlight {
  flightNumber: string;
  destination: string;
  status: string;
  aircraftType: string;
  scheduledDeparture: string;
  estimatedDeparture?: string;
}

export interface GateInfo {
  airport: string;
  gate: string;
  terminal: string;
  currentFlight: GateFlight | null;
  upcomingFlights: GateFlight[];
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