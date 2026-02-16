import type { SearchSuggestion } from "@/types/api";

export const searchService = {
  /** Mock Suggestions based exactly on our 3 test cases */
  getSuggestions: async (
    query: string,
    email?: string,
    limit = 10
  ): Promise<SearchSuggestion[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const q = query.toUpperCase().replace(/\s/g, "");
    const suggestions: SearchSuggestion[] = [];

    // 1. Mock Airport Match
    if ("KEWR".includes(q) || "EWR".includes(q)) {
      suggestions.push({
        type: "airport", // Strictly lowercase so typeIcons["airport"] works!
        value: "KEWR",
        label: "KEWR",
        sublabel: "Newark Liberty Intl",
      });
    }

    // 2. Mock Flight Match
    if ("UA4433".includes(q)) {
      suggestions.push({
        type: "flight", // Strictly lowercase so typeIcons["flight"] works!
        value: "UA4433",
        label: "UA 4433",
        sublabel: "KEWR → KORD",
      });
    }

    // 3. Mock Gate Match
    if ("C101".includes(q)) {
      suggestions.push({
        type: "gate", // Strictly lowercase so typeIcons["gate"] works!
        value: "C101",
        label: "C101",
        sublabel: "Terminal C - Newark",
      });
    }

    return suggestions;
  },

  /** Mock raw query fallback */
  fetchRawQuery: async (query: string): Promise<any> => {
    return { mock: true };
  },

  /** Mock tracking (does nothing locally) */
  submitSearch: async (suggestion: SearchSuggestion, email?: string): Promise<void> => {
    console.log("Mock tracked search:", suggestion);
  },
};