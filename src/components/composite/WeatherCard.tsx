import { CloudSun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataCell } from "@/components/atomic";
import type { AirportWeather } from "@/types/api";
import { cn } from "@/lib/utils";

interface WeatherCardProps {
  weather: AirportWeather;
  className?: string;
}

export function WeatherCard({ weather, className }: WeatherCardProps) {
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
          <TabsContent value="metar" className="mt-3">
            {weather.metar ? (
              <div className="space-y-1">
                {weather.metar.zt && (
                  <div 
                    className="text-right text-[10px] text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: weather.metar.zt }} 
                  />
                )}
                <div 
                  className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-mono text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: weather.metar.raw }}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No METAR available</p>
            )}
          </TabsContent>

          {/* TAF */}
          <TabsContent value="taf" className="mt-3">
            {weather.taf ? (
              <div className="space-y-1">
                 {weather.taf.zt && (
                  <div 
                    className="text-right text-[10px] text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: weather.taf.zt }} 
                  />
                )}
                <div 
                  className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-mono text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: weather.taf.raw }}
                />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No TAF available</p>
            )}
          </TabsContent>

          {/* D-ATIS */}
          <TabsContent value="datis" className="mt-3">
            {weather.datis ? (
               <div className="space-y-1">
                {weather.datis.zt && (
                  <div 
                    className="text-right text-[10px] text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: weather.datis.zt }} 
                  />
                )}
                <div 
                  className="whitespace-pre-wrap break-words rounded-md bg-muted/50 p-3 font-mono text-sm leading-relaxed text-foreground"
                  dangerouslySetInnerHTML={{ __html: weather.datis.raw }}
                />
               </div>
            ) : (
              <p className="text-sm text-muted-foreground">No D-ATIS available</p>
            )}
          </TabsContent>

          {/* NAS - Untouched, remains exactly the same as previous setup */}
          <TabsContent value="nas" className="mt-3">
            {weather.nas && weather.nas.hasDelays ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                  <span className="text-sm font-medium text-foreground">Delays Reported</span>
                </div>
                {weather.nas.groundDelay && <DataCell label="Ground Delay" value={weather.nas.groundDelay} />}
                {weather.nas.groundStop && <DataCell label="Ground Stop" value={weather.nas.groundStop} />}
                {weather.nas.notes.length > 0 && (
                  <div className="rounded-md bg-muted/50 p-3">
                    {weather.nas.notes.map((note, i) => (
                      <p key={i} className="text-xs text-muted-foreground">{note}</p>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <span className="text-sm font-medium text-foreground">No NAS Delays</span>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}