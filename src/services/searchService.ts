import client from "./api";
import type { SearchSuggestion } from "@/types/api";

export const searchService = {
  /** Fetch autocomplete suggestions. */
  getSuggestions: async (
    query: string,
    email: string,
    limit = 10,
  ): Promise<SearchSuggestion[]> => {
    if (!query.trim()) return [];
    const { data } = await client.get<SearchSuggestion[]>(
      `/searches/suggestions/${encodeURIComponent(email)}`,
      { params: { q: query, limit } },
    );
    return data;
  },

  /** Track a selected suggestion for analytics / recent searches. */
  submitSearch: async (suggestion: SearchSuggestion, email: string): Promise<void> => {
    await client.post("/searches/track", { ...suggestion, email });
  },
};
