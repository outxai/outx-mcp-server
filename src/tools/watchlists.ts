import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { OutxClient } from "../client.js";

const fetchFreqEnum = z
  .enum(["1", "3", "6", "12", "24", "48", "72"])
  .describe("How often to scan for new posts (hours)");

export function registerWatchlistTools(
  server: McpServer,
  client: OutxClient
): void {
  // ── Keyword Watchlists ──────────────────────────────────

  server.tool(
    "create_keyword_watchlist",
    "Create a watchlist that monitors LinkedIn posts matching keywords. Posts appear after the first scan cycle.",
    {
      keywords: z
        .array(z.string())
        .min(1)
        .describe("Keywords to track (e.g. ['AI startup funding', 'series A'])"),
      required_keywords: z
        .array(z.string())
        .optional()
        .describe("Posts MUST contain at least one of these words"),
      exclude_keywords: z
        .array(z.string())
        .optional()
        .describe("Exclude posts containing any of these words"),
      name: z.string().optional().describe("Watchlist name"),
      description: z.string().optional(),
      labels: z.array(z.string()).optional().describe("Custom labels for categorization"),
      fetchFreqInHours: fetchFreqEnum.optional(),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        keywords: params.keywords.map((kw) => {
          const obj: Record<string, unknown> = { keyword: kw };
          if (params.required_keywords) obj.required_keywords = params.required_keywords;
          if (params.exclude_keywords) obj.exclude_keywords = params.exclude_keywords;
          return obj;
        }),
      };
      if (params.name) body.name = params.name;
      if (params.description) body.description = params.description;
      if (params.labels) body.labels = params.labels;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);

      const result = await client.post("/api-keyword-watchlist", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_keyword_watchlists",
    "List all keyword watchlists for your account.",
    {},
    async () => {
      const result = await client.get("/api-keyword-watchlist");
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_keyword_watchlist",
    "Update a keyword watchlist's name, frequency, or status.",
    {
      id: z.string().describe("Watchlist ID"),
      name: z.string().optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
      status: z.enum(["active", "paused"]).optional(),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.name) body.name = params.name;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);
      if (params.status) body.status = params.status;

      const result = await client.put("/api-keyword-watchlist", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_keyword_watchlist",
    "Delete a keyword watchlist and all its tracked data.",
    {
      id: z.string().describe("Watchlist ID to delete"),
    },
    async (params) => {
      const result = await client.delete("/api-keyword-watchlist", {
        id: params.id,
      });
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── People Watchlists ───────────────────────────────────

  server.tool(
    "create_people_watchlist",
    "Create a watchlist that monitors posts from specific LinkedIn profiles.",
    {
      profiles: z
        .array(z.string())
        .min(1)
        .describe("LinkedIn profile URLs or slugs to track"),
      name: z.string().optional().describe("Watchlist name"),
      description: z.string().optional(),
      labels: z.array(z.string()).optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
    },
    async (params) => {
      const body: Record<string, unknown> = { profiles: params.profiles };
      if (params.name) body.name = params.name;
      if (params.description) body.description = params.description;
      if (params.labels) body.labels = params.labels;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);

      const result = await client.post("/api-people-watchlist", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_people_watchlists",
    "List all people watchlists for your account.",
    {},
    async () => {
      const result = await client.get("/api-people-watchlist");
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_people_watchlist",
    "Update a people watchlist's name, frequency, or status.",
    {
      id: z.string().describe("Watchlist ID"),
      name: z.string().optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
      status: z.enum(["active", "paused"]).optional(),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.name) body.name = params.name;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);
      if (params.status) body.status = params.status;

      const result = await client.put("/api-people-watchlist", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_people_watchlist",
    "Delete a people watchlist and all its tracked data.",
    {
      id: z.string().describe("Watchlist ID to delete"),
    },
    async (params) => {
      const result = await client.delete("/api-people-watchlist", {
        id: params.id,
      });
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  // ── Company Watchlists ──────────────────────────────────

  server.tool(
    "create_company_watchlist",
    "Create a watchlist that monitors posts from LinkedIn company pages.",
    {
      companies: z
        .array(z.string())
        .min(1)
        .describe("LinkedIn company URLs or slugs to track"),
      name: z.string().optional().describe("Watchlist name"),
      description: z.string().optional(),
      labels: z.array(z.string()).optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
    },
    async (params) => {
      const body: Record<string, unknown> = { companies: params.companies };
      if (params.name) body.name = params.name;
      if (params.description) body.description = params.description;
      if (params.labels) body.labels = params.labels;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);

      const result = await client.post("/api-company-watchlist", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "list_company_watchlists",
    "List all company watchlists for your account.",
    {},
    async () => {
      const result = await client.get("/api-company-watchlist");
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "update_company_watchlist",
    "Update a company watchlist's name, frequency, or status.",
    {
      id: z.string().describe("Watchlist ID"),
      name: z.string().optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
      status: z.enum(["active", "paused"]).optional(),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.name) body.name = params.name;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);
      if (params.status) body.status = params.status;

      const result = await client.put("/api-company-watchlist", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "delete_company_watchlist",
    "Delete a company watchlist and all its tracked data.",
    {
      id: z.string().describe("Watchlist ID to delete"),
    },
    async (params) => {
      const result = await client.delete("/api-company-watchlist", {
        id: params.id,
      });
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
