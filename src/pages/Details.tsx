import { useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, MoreHorizontal, Printer, RefreshCw } from "lucide-react";
import { useFlightData } from "@/hooks/use-flight-data";
import { useWeatherData } from "@/hooks/use-weather-data";
import { useGateData } from "@/hooks/use-gate-data";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { SummaryTable } from "@/components/composite/SummaryTable";
import { EDCTSection } from "@/components/composite/EDCTSection";
import { RoutePanel } from "@/components/composite/RoutePanel";
import { WeatherCard } from "@/components/composite/WeatherCard";
import { GateList } from "@/components/composite/GateList";
import { ErrorCard } from "@/components/composite/ErrorCard";
import { NotificationToggle } from "@/components/composite/NotificationToggle";
import { DetailsSkeleton } from "@/components/composite/DetailsSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

/* ── Sub-views ───────────────────────────────────────────── */

function FlightDetails({ query }: { query: string }) {
  const { flight, edct, stats, originWeather, destWeather, isLoading, error, refetch } =
    useFlightData(query, true);
  const { user } = useAuth();
  const { isWatching, addPreference, removePreference, preferences } =
    useNotifications(user?.email);

  const watching = isWatching(query);
  const pref = preferences.find((p) => p.flightId === query);

  const handleToggleWatch = () => {
    if (watching && pref) {
      removePreference(pref.id);
    } else {
      addPreference(query, flight?.flightNumber ?? query);
    }
  };

  if (isLoading) return <DetailsSkeleton />;
  if (error) return <ErrorCard error={error} onRetry={refetch} />;
  if (!flight)
    return (
      <ErrorCard
        error={{ status: 404, message: "Flight not found.", retryable: false }}
      />
    );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-foreground">
            {flight.flightNumber}
          </h2>
          <p className="text-xs text-muted-foreground">{flight.airline}</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationToggle enabled={watching} onToggle={handleToggleWatch} />
          <ActionsMenu onRefresh={refetch} />
        </div>
      </div>

      {/* Summary */}
      <SummaryTable flight={flight} />

      {/* EDCT */}
      {edct && (
        <EDCTSection
          edct={edct}
          filedDeparture={flight.scheduledDeparture}
        />
      )}

      {/* Route */}
      {stats?.route && (
        <RoutePanel route={stats.route} clearance={stats.clearance} />
      )}

      {/* Weather cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {originWeather && <WeatherCard weather={originWeather} />}
        {destWeather && <WeatherCard weather={destWeather} />}
      </div>

      <LastUpdated />
    </div>
  );
}

function AirportDetails({ query }: { query: string }) {
  const { metar, taf, datis, nas, isLoading, error, refetch } =
    useWeatherData(query);

  if (isLoading) return <DetailsSkeleton />;
  if (error) return <ErrorCard error={error} onRetry={refetch} />;

  const weather = {
    icao: query.toUpperCase(),
    name: "",
    metar,
    taf,
    datis,
    nas,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold font-mono tracking-wide text-foreground">
          {query.toUpperCase()}
        </h2>
        <ActionsMenu onRefresh={refetch} />
      </div>

      <WeatherCard weather={weather} />
      <LastUpdated />
    </div>
  );
}

function GateDetails({ query }: { query: string }) {
  const { data, isLoading, error, refetch } = useGateData(query);

  if (isLoading) return <DetailsSkeleton />;
  if (error) return <ErrorCard error={error} onRetry={refetch} />;
  if (!data)
    return (
      <ErrorCard
        error={{ status: 404, message: "Gate not found.", retryable: false }}
      />
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-mono tracking-wide text-foreground">
            Gate {data.gate}
          </h2>
          <p className="text-xs text-muted-foreground">
            {data.airport} — Terminal {data.terminal}
          </p>
        </div>
        <ActionsMenu onRefresh={refetch} />
      </div>

      <GateList gate={data} />
      <LastUpdated />
    </div>
  );
}

/* ── Shared helpers ──────────────────────────────────────── */

function ActionsMenu({ onRefresh }: { onRefresh: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onRefresh}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Refresh
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.print()}>
          <Printer className="mr-2 h-3.5 w-3.5" />
          Print
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LastUpdated() {
  const now = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  return (
    <p className="text-[10px] text-muted-foreground text-right">
      Last updated: {now}
    </p>
  );
}

/* ── Main Details page ───────────────────────────────────── */

const Details = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "flight";

  return (
    <div className="container max-w-4xl py-6">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to search
      </Link>

      {type === "airport" && <AirportDetails query={query} />}
      {type === "gate" && <GateDetails query={query} />}
      {type === "flight" && <FlightDetails query={query} />}
    </div>
  );
};

export default Details;
