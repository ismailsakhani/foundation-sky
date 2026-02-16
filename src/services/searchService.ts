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
    // Changed 'q' to 'query' to match backend expectations
    const { data } = await client.get<SearchSuggestion[]>(
      `/searches/suggestions/${encodeURIComponent(email)}`,
      { params: { query, limit } }, 
    );
    return data;
  },

  /** Fetch raw search query results. */
  fetchRawQuery: async (query: string): Promise<any> => {
    // Re-added from your legacy cirrostrats frontend
    const { data } = await client.get('/query', { params: { search: query } });
    return data;
  },

  /** Track a selected suggestion for analytics / recent searches. */
  submitSearch: async (suggestion: SearchSuggestion, email: string): Promise<void> => {
    await client.post("/searches/track", { ...suggestion, email });
  },
};