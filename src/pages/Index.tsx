import { Search, Plane, CloudSun, Radio } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const quickLinks = [
  { label: "JFK", type: "airport" },
  { label: "LAX", type: "airport" },
  { label: "ORD", type: "airport" },
  { label: "ATL", type: "airport" },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/details?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center aviation-grid">
      <div className="w-full max-w-2xl px-6 animate-slide-up">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 glow-primary">
            <Plane className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-data text-3xl font-bold tracking-tight text-foreground">
            FLIGHT<span className="text-primary">OPS</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time flight tracking, weather, and gate information
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative">
          <div className="group relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search flight, airport, or gate..."
              className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </form>

        {/* Quick links */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Quick:</span>
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(`/details?q=${link.label}`)}
              className="rounded-md bg-secondary px-3 py-1 text-data text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-3 gap-4">
          {[
            { icon: Plane, label: "Flight Tracking", desc: "Real-time status & EDCT" },
            { icon: CloudSun, label: "Weather", desc: "METAR, TAF & D-ATIS" },
            { icon: Radio, label: "NAS Status", desc: "Delays & ground stops" },
          ].map((feat) => (
            <div
              key={feat.label}
              className="rounded-xl border border-border bg-card p-4 text-center transition-colors hover:border-primary/30"
            >
              <feat.icon className="mx-auto mb-2 h-5 w-5 text-primary" />
              <p className="text-xs font-medium text-foreground">{feat.label}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
