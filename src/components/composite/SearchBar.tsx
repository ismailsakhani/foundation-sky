import { useState, useRef, useEffect, useCallback } from "react";
import { Search, X, Plane, Building2, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SearchSuggestion } from "@/types/api";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void;
  suggestions?: SearchSuggestion[];
  loading?: boolean;
  placeholder?: string;
  className?: string;
}

const typeIcons: Record<SearchSuggestion["type"], React.ElementType> = {
  flight: Plane,
  airport: Building2,
  gate: DoorOpen,
};

const typeLabels: Record<SearchSuggestion["type"], string> = {
  flight: "Flight",
  airport: "Airport",
  gate: "Gate",
};

export function SearchBar({
  onSearch,
  onSuggestionSelect,
  suggestions = [],
  loading = false,
  placeholder = "Search flight, airport, or gate…",
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Debounced search
  const handleChange = useCallback(
    (value: string) => {
      setQuery(value);
      setActiveIdx(-1);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(value);
      }, 300);
    },
    [onSearch],
  );

  // Show dropdown when suggestions arrive
  useEffect(() => {
    setOpen(suggestions.length > 0 && query.length > 0);
  }, [suggestions, query]);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      onSuggestionSelect?.(suggestions[activeIdx]);
      setOpen(false);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const clear = () => {
    setQuery("");
    setOpen(false);
    onSearch("");
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="group relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && query.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 overflow-hidden rounded-lg border border-border bg-popover shadow-theme-lg">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Searching…</div>
          ) : (
            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {suggestions.map((s, idx) => {
                const Icon = typeIcons[s.type];
                return (
                  <li
                    key={`${s.type}-${s.value}`}
                    role="option"
                    aria-selected={idx === activeIdx}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                      idx === activeIdx
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent/50",
                    )}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => {
                      onSuggestionSelect?.(s);
                      setOpen(false);
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{s.label}</span>
                      {s.sublabel && (
                        <span className="ml-1.5 text-muted-foreground">{s.sublabel}</span>
                      )}
                    </div>
                    <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {typeLabels[s.type]}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
