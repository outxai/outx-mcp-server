import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { OutxClient } from "../client.js";

export function registerPostTools(
  server: McpServer,
  client: OutxClient
): void {
  server.tool(
    "get_posts",
    "Search and filter LinkedIn posts from your watchlists. Supports keyword search, date range, seniority, trending, language, and more. Returns 20 posts per page.",
    {
      watchlist_id: z.string().optional().describe("Filter by watchlist ID (omit for all)"),
      search_term: z.string().optional().describe("Search within post content"),
      sort_by: z
        .enum(["recent_first", "oldest_first", "engagement"])
        .optional()
        .describe("Sort order (default: recent_first)"),
      page: z.string().optional().describe("Page number (default: 1)"),
      start_date: z.string().optional().describe("Filter posts after this date (ISO 8601)"),
      end_date: z.string().optional().describe("Filter posts before this date (ISO 8601)"),
      seniority_level: z.string().optional().describe("Filter by author seniority (e.g. 'Director', 'VP')"),
      trending: z.string().optional().describe("Set to 'true' to show only trending posts"),
      lang: z.string().optional().describe("Filter by language code (e.g. 'en', 'es')"),
      post_type: z.string().optional().describe("Filter by post type"),
      labels: z.string().optional().describe("Filter by label"),
      people_slug: z.string().optional().describe("Filter by author's LinkedIn slug"),
      company_slug: z.string().optional().describe("Filter by company's LinkedIn slug"),
      interacted: z.string().optional().describe("Set to 'true' to show only posts you've interacted with"),
      linkedin_post_slug: z.string().optional().describe("Get a specific post by its LinkedIn slug"),
    },
    async (params) => {
      const queryParams: Record<string, string> = {};
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined) queryParams[k] = v;
      }
      const result = await client.get("/api-posts", queryParams);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
