import { Plane, CloudSun, Radio, Clock, X } from "lucide-react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/composite/SearchBar";
import { useAuth } from "@/hooks/use-auth";
import { useRecentSearches } from "@/hooks/use-recent-searches";
import { useSearch } from "@/hooks/use-search";
import { searchService } from "@/services/searchService";
import type { SearchSuggestion } from "@/types/api";

const quickLinks = [
  { label: "JFK", type: "airport" },
  { label: "LAX", type: "airport" },
  { label: "ORD", type: "airport" },
  { label: "ATL", type: "airport" },
];

const typeIcons: Record<string, React.ElementType> = {
  flight: Plane,
  airport: CloudSun,
  gate: Radio,
};

const Index = () => {
  const navigate = useNavigate();
  const { user, isAnonymous } = useAuth();
  const { recent, addRecent, clearRecent } = useRecentSearches();
  
  // 1. Use the real API hook instead of mock state
  const { suggestions, isLoading, debouncedSearch, submitSearch } = useSearch();

  // 2. Handle when user TYPES but doesn't select a dropdown item
  const handleRawSearchSubmit = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    // Check if the query matches an existing suggestion exactly
    const exactMatch = suggestions.find(
      (s) => s.label.toLowerCase() === query.toLowerCase() || s.value.toLowerCase() === query.toLowerCase()
    );

    if (exactMatch) {
      handleSelect(exactMatch);
      return;
    }

    // Fallback: If no exact match in dropdown, assume it's an airport or flight ID and try to load it
    // (This mimics your old handleStringSubmit logic)
    const fallbackType = query.length <= 4 && !/\d/.test(query) ? "airport" : "flight";
    
    navigate(`/details?q=${encodeURIComponent(query.toUpperCase())}&type=${fallbackType}`);
  }, [suggestions, navigate]);

  // 3. Handle when user CLICKS a dropdown item
  const handleSelect = useCallback(
    (s: SearchSuggestion) => {
      addRecent(s);
      submitSearch(s); // Track it in backend
      
      // The API returns 'value' or 'label', we use 'value' to fetch details
      // Some backend objects might store the real ID in metadata, so we default to value
      const searchId = s.value || s.label;
      navigate(`/details?q=${encodeURIComponent(searchId)}&type=${s.type}`);
    },
    [navigate, addRecent, submitSearch],
  );

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center aviation-grid">
      <div className="w-full max-w-2xl px-6 animate-slide-up">
        {/* Hero */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Plane className="h-7 w-7 text-primary" />
          </div>
          <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground">
            CIRRO<span className="text-primary">STRATS</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time flight tracking, weather, and gate information
          </p>
          {!isAnonymous && user?.displayName && (
            <p className="mt-1 text-xs text-primary">
              Welcome back, {user.displayName}
            </p>
          )}
        </div>

        {/* Search */}
        <SearchBar
          onSearch={debouncedSearch}
          onSubmitRaw={handleRawSearchSubmit} 
          onSuggestionSelect={handleSelect}
          suggestions={suggestions}
          loading={isLoading}
        />

        {/* Quick links */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">Quick:</span>
          {quickLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                const s: SearchSuggestion = {
                  type: link.type as SearchSuggestion["type"],
                  value: link.label,
                  label: link.label,
                  sublabel: "",
                };
                addRecent(s);
                navigate(`/details?q=${link.label}&type=${link.type}`);
              }}
              className="rounded-md bg-secondary px-3 py-1 font-mono text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Recent searches */}
        {recent.length > 0 && (
          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Recent Searches
              </div>
              <button
                onClick={clearRecent}
                className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {recent.map((s) => {
                const Icon = typeIcons[s.type] ?? Plane;
                return (
                  <button
                    key={s.value}
                    onClick={() => handleSelect(s)}
                    className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left transition-colors hover:border-primary/30"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-xs font-medium text-foreground">
                        {s.label}
                      </p>
                      {s.sublabel && (
                        <p className="truncate text-[10px] text-muted-foreground">
                          {s.sublabel}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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

        {/* Footer */}
        <div className="mt-8 pb-6 text-center">
          <p className="text-[10px] text-muted-foreground">{dateStr}</p>
        </div>
      </div>
    </div>
  );
};

export default Index;