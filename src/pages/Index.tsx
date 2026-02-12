import { Plane, CloudSun, Radio } from "lucide-react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/composite/SearchBar";
import type { SearchSuggestion } from "@/types/api";

const quickLinks = [
  { label: "JFK", type: "airport" },
  { label: "LAX", type: "airport" },
  { label: "ORD", type: "airport" },
  { label: "ATL", type: "airport" },
];

// Mock suggestions for demo — will be replaced with API call
const mockSuggestions: SearchSuggestion[] = [
  { type: "flight", value: "AAL100", label: "AA 100", sublabel: "JFK → LAX" },
  { type: "flight", value: "UAL237", label: "UA 237", sublabel: "ORD → SFO" },
  { type: "airport", value: "KJFK", label: "KJFK", sublabel: "John F. Kennedy Intl" },
  { type: "airport", value: "KLAX", label: "KLAX", sublabel: "Los Angeles Intl" },
  { type: "gate", value: "JFK-B22", label: "B22", sublabel: "JFK Terminal 4" },
];

const Index = () => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = useCallback((query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    // Simulate API — filter mock data
    setTimeout(() => {
      const q = query.toLowerCase();
      setSuggestions(
        mockSuggestions.filter(
          (s) =>
            s.label.toLowerCase().includes(q) ||
            s.sublabel.toLowerCase().includes(q) ||
            s.value.toLowerCase().includes(q),
        ),
      );
      setLoading(false);
    }, 200);
  }, []);

  const handleSelect = useCallback(
    (s: SearchSuggestion) => {
      navigate(`/details?q=${encodeURIComponent(s.value)}`);
    },
    [navigate],
  );

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center aviation-grid">
      <div className="w-full max-w-2xl px-6 animate-slide-up">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Plane className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
            FLIGHT<span className="text-primary">OPS</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time flight tracking, weather, and gate information
          </p>
        </div>

        {/* Search */}
        <SearchBar
          onSearch={handleSearch}
          onSuggestionSelect={handleSelect}
          suggestions={suggestions}
          loading={loading}
        />

        {/* Quick links */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Quick:</span>
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(`/details?q=${link.label}`)}
              className="rounded-md bg-secondary px-3 py-1 font-mono text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
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
