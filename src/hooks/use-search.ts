import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/searchService";
import { useDebounce } from "@/hooks/use-debounce";
import { CACHE_TIMES } from "@/lib/queryClient";
import type { SearchSuggestion } from "@/types/api";

const DEFAULT_EMAIL = "user@example.com"; // placeholder until auth is wired

export function useSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const suggestionsQuery = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchService.getSuggestions(debouncedQuery, DEFAULT_EMAIL),
    enabled: debouncedQuery.length > 0,
    ...CACHE_TIMES.search,
  });

  const debouncedSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const submitSearch = useCallback(async (suggestion: SearchSuggestion) => {
    await searchService.submitSearch(suggestion, DEFAULT_EMAIL);
  }, []);

  return {
    query,
    suggestions: suggestionsQuery.data ?? [],
    isLoading: suggestionsQuery.isLoading,
    debouncedSearch,
    submitSearch,
  };
}
