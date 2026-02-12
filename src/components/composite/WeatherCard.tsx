import { CloudSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataCell } from "@/components/atomic";
import type { AirportWeather } from "@/types/api";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  weather: AirportWeather;
  className?: string;
}

const categoryColors: Record<string, string> = {
  VFR: "bg-vfr text-white",
  MVFR: "bg-mvfr text-white",
  IFR: "bg-ifr text-white",
  LIFR: "bg-lifr text-white",
};

export function WeatherCard({ weather, className }: WeatherCardProps) {
  const category = weather.metar?.flightCategory ?? "VFR";

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <CloudSun className="h-4 w-4 text-primary" />
            {weather.icao}
            {weather.name && (
              <span className="text-sm font-normal text-muted-foreground">
                — {weather.name}
              </span>
            )}
          </CardTitle>
          <Badge className={cn("text-[10px] font-bold", categoryColors[category])}>
            {category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metar" className="w-full">
          <TabsList className="w-full grid grid-cols-4 h-8">
            <TabsTrigger value="metar" className="text-xs">METAR</TabsTrigger>
            <TabsTrigger value="taf" className="text-xs">TAF</TabsTrigger>
            <TabsTrigger value="datis" className="text-xs">D-ATIS</TabsTrigger>
            <TabsTrigger value="nas" className="text-xs">NAS</TabsTrigger>
          </TabsList>

          {/* METAR */}
          <TabsContent value="metar" className="mt-3 space-y-3">
            {weather.metar ? (
              <>
                <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed text-foreground">
                  {weather.metar.raw}
                </pre>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <DataCell
                    label="Wind"
                    value={`${weather.metar.wind.direction}° @ ${weather.metar.wind.speed}${weather.metar.wind.gust ? `G${weather.metar.wind.gust}` : ""}`}
                    unit={weather.metar.wind.unit}
                    mono
                  />
                  <DataCell label="Temp" value={weather.metar.temperature} unit="°C" mono />
                  <DataCell label="Visibility" value={weather.metar.visibility} unit="SM" mono />
                  <DataCell
                    label="Ceiling"
                    value={weather.metar.ceiling ? `${weather.metar.ceiling}` : "CLR"}
                    unit={weather.metar.ceiling ? "ft" : undefined}
                    mono
                  />
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">No METAR available</p>
            )}
          </TabsContent>

          {/* TAF */}
          <TabsContent value="taf" className="mt-3">
            {weather.taf ? (
              <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed text-foreground">
                {weather.taf.raw}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No TAF available</p>
            )}
          </TabsContent>

          {/* D-ATIS */}
          <TabsContent value="datis" className="mt-3">
            {weather.datis ? (
              <pre className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-mono text-xs leading-relaxed text-foreground">
                {weather.datis}
              </pre>
            ) : (
              <p className="text-sm text-muted-foreground">No D-ATIS available</p>
            )}
          </TabsContent>

          {/* NAS */}
          <TabsContent value="nas" className="mt-3">
            {weather.nas ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      weather.nas.hasDelays ? "bg-warning" : "bg-success",
                    )}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {weather.nas.hasDelays ? "Delays Reported" : "No Delays"}
                  </span>
                </div>
                {weather.nas.groundDelay && (
                  <DataCell label="Ground Delay" value={weather.nas.groundDelay} />
                )}
                {weather.nas.groundStop && (
                  <DataCell label="Ground Stop" value={weather.nas.groundStop} />
                )}
                {weather.nas.notes.length > 0 && (
                  <div className="rounded-md bg-muted/50 p-3">
                    {weather.nas.notes.map((note, i) => (
                      <p key={i} className="text-xs text-muted-foreground">{note}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No NAS data available</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Timestamp */}
        {weather.metar?.observationTime && (
          <p className="mt-3 text-[10px] text-muted-foreground">
            Last updated: {weather.metar.observationTime}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
