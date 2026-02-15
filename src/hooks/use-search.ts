import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchService } from "@/services/searchService";
import { authService } from "@/services/authService";
import { useDebounce } from "@/hooks/use-debounce";
import { CACHE_TIMES } from "@/lib/queryClient";
import type { SearchSuggestion } from "@/types/api";

const getUserEmail = () => authService.getUserEmail();

export function useSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const suggestionsQuery = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchService.getSuggestions(debouncedQuery, getUserEmail()),
    enabled: debouncedQuery.length > 0,
    ...CACHE_TIMES.search,
  });

  const debouncedSearch = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const submitSearch = useCallback(async (suggestion: SearchSuggestion) => {
    await searchService.submitSearch(suggestion, getUserEmail());
  }, []);

  return {
    query,
    suggestions: suggestionsQuery.data ?? [],
    isLoading: suggestionsQuery.isLoading,
    debouncedSearch,
    submitSearch,
  };
}
