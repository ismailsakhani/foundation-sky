import type { FlightStatus } from "./api";

export interface StatusBadgeProps {
  status: FlightStatus;
  size?: "sm" | "md" | "lg";
}

export interface FlightCardProps {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: FlightStatus;
  gate?: string;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: import("./api").SearchSuggestion) => void;
  placeholder?: string;
  className?: string;
}

export interface WeatherCardProps {
  icao: string;
  name: string;
  metar: import("./api").METAR | null;
  flightCategory?: "VFR" | "MVFR" | "IFR" | "LIFR";
}

export interface DataCellProps {
  label: string;
  value: string | number | null;
  unit?: string;
  mono?: boolean;
  className?: string;
}
