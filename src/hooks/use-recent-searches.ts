import { useLocalStorage } from "@/hooks/use-local-storage";
import type { SearchSuggestion } from "@/types/api";

const MAX_RECENT = 6;

export function useRecentSearches() {
  const [recent, setRecent] = useLocalStorage<SearchSuggestion[]>(
    "flightops-recent-searches",
    [],
  );

  const addRecent = (suggestion: SearchSuggestion) => {
    setRecent((prev) => {
      const filtered = prev.filter((s) => s.value !== suggestion.value);
      return [suggestion, ...filtered].slice(0, MAX_RECENT);
    });
  };

  const clearRecent = () => setRecent([]);

  return { recent, addRecent, clearRecent };
}
