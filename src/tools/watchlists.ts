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
    "Create a watchlist that monitors LinkedIn posts matching keywords. Two modes: provide `keywords` to track exact terms, OR provide `prompt` to have OutX generate keywords and intent labels from a plain-English description. Pass one or the other, not both.",
    {
      keywords: z
        .array(z.string())
        .optional()
        .describe(
          "Direct mode. Keywords to track (e.g. ['AI startup funding', 'series A']). Mutually exclusive with `prompt`."
        ),
      required_keywords: z
        .array(z.string())
        .optional()
        .describe("Direct mode only. Applied to every keyword. Posts MUST contain at least one of these words."),
      exclude_keywords: z
        .array(z.string())
        .optional()
        .describe("Direct mode only. Applied to every keyword. Posts containing any of these are excluded."),
      prompt: z
        .string()
        .optional()
        .describe(
          "AI mode. Plain-English description of what to track (e.g. 'People looking for remote software engineering jobs'). OutX generates keywords and intent labels in the background. Mutually exclusive with `keywords`."
        ),
      name: z.string().optional().describe("Watchlist name. Auto-generated if omitted."),
      description: z.string().optional().describe("Direct mode only. Optional description for the watchlist."),
      labels: z.array(z.string()).optional().describe("Direct mode only. Custom labels for categorization."),
      fetchFreqInHours: fetchFreqEnum.optional(),
    },
    async (params) => {
      const hasKeywords = Array.isArray(params.keywords) && params.keywords.length > 0;
      const hasPrompt = typeof params.prompt === "string" && params.prompt.trim().length > 0;

      if (hasKeywords && hasPrompt) {
        throw new Error("Provide either `keywords` or `prompt`, not both.");
      }
      if (!hasKeywords && !hasPrompt) {
        throw new Error("Provide either `keywords` (array) or `prompt` (string).");
      }

      const body: Record<string, unknown> = {};

      if (hasPrompt) {
        body.prompt = params.prompt!.trim();
      } else {
        body.keywords = params.keywords!.map((kw) => {
          const obj: Record<string, unknown> = { keyword: kw };
          if (params.required_keywords) obj.required_keywords = params.required_keywords;
          if (params.exclude_keywords) obj.exclude_keywords = params.exclude_keywords;
          return obj;
        });
        if (params.description) body.description = params.description;
        if (params.labels) body.labels = params.labels;
      }

      if (params.name) body.name = params.name;
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
    "Update a keyword watchlist. Patch any fields (name, fetchFreqInHours, disable, slack_webhook_url, keywords, labels), OR pass `prompt` to have OutX regenerate keywords and labels from a new description. Patch and prompt modes are mutually exclusive.",
    {
      id: z.string().describe("Watchlist ID"),
      name: z.string().optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
      disable: z
        .boolean()
        .optional()
        .describe("Set to true to pause tracking, false to resume"),
      slack_webhook_url: z
        .string()
        .nullable()
        .optional()
        .describe("Slack incoming webhook URL for alerts. Pass null to clear."),
      keywords: z
        .array(z.string())
        .optional()
        .describe(
          "Patch mode. Replace tracked keywords; all existing keywords are removed and these are inserted. Mutually exclusive with `prompt`."
        ),
      required_keywords: z
        .array(z.string())
        .optional()
        .describe("Patch mode only. Applied to every keyword above. Posts MUST contain at least one."),
      exclude_keywords: z
        .array(z.string())
        .optional()
        .describe("Patch mode only. Applied to every keyword above. Posts containing any are excluded."),
      labels: z
        .array(z.string())
        .optional()
        .describe("Patch mode only. Replace label set used to categorize matched posts."),
      prompt: z
        .string()
        .optional()
        .describe(
          "Regenerate mode. New plain-English prompt. OutX wipes the existing keywords and labels and regenerates them in the background. Mutually exclusive with patch fields above (other than `id`)."
        ),
    },
    async (params) => {
      const hasPrompt = typeof params.prompt === "string" && params.prompt.trim().length > 0;
      const hasPatch =
        params.name !== undefined ||
        params.fetchFreqInHours !== undefined ||
        params.disable !== undefined ||
        params.slack_webhook_url !== undefined ||
        params.keywords !== undefined ||
        params.labels !== undefined;

      if (hasPrompt && hasPatch) {
        throw new Error(
          "Provide either patch fields (name, fetchFreqInHours, disable, slack_webhook_url, keywords, labels) or `prompt` for regeneration, not both."
        );
      }

      const body: Record<string, unknown> = { id: params.id };

      if (hasPrompt) {
        body.prompt = params.prompt!.trim();
      } else {
        if (params.name) body.name = params.name;
        if (params.fetchFreqInHours)
          body.fetchFreqInHours = parseInt(params.fetchFreqInHours);
        if (params.disable !== undefined) body.disable = params.disable;
        if (params.slack_webhook_url !== undefined)
          body.slack_webhook_url = params.slack_webhook_url;
        if (params.keywords) {
          body.keywords = params.keywords.map((kw) => {
            const obj: Record<string, unknown> = { keyword: kw };
            if (params.required_keywords) obj.required_keywords = params.required_keywords;
            if (params.exclude_keywords) obj.exclude_keywords = params.exclude_keywords;
            return obj;
          });
        }
        if (params.labels) body.labels = params.labels;
      }

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
    "Update a people watchlist. Can change name, fetch frequency, Slack webhook, and pause/resume tracking via `disable`.",
    {
      id: z.string().describe("Watchlist ID"),
      name: z.string().optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
      disable: z
        .boolean()
        .optional()
        .describe("Set to true to pause tracking, false to resume"),
      slack_webhook_url: z
        .string()
        .nullable()
        .optional()
        .describe("Slack incoming webhook URL for alerts. Pass null to clear."),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.name) body.name = params.name;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);
      if (params.disable !== undefined) body.disable = params.disable;
      if (params.slack_webhook_url !== undefined)
        body.slack_webhook_url = params.slack_webhook_url;

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
    "Update a company watchlist. Can change name, fetch frequency, Slack webhook, and pause/resume tracking via `disable`.",
    {
      id: z.string().describe("Watchlist ID"),
      name: z.string().optional(),
      fetchFreqInHours: fetchFreqEnum.optional(),
      disable: z
        .boolean()
        .optional()
        .describe("Set to true to pause tracking, false to resume"),
      slack_webhook_url: z
        .string()
        .nullable()
        .optional()
        .describe("Slack incoming webhook URL for alerts. Pass null to clear."),
    },
    async (params) => {
      const body: Record<string, unknown> = { id: params.id };
      if (params.name) body.name = params.name;
      if (params.fetchFreqInHours)
        body.fetchFreqInHours = parseInt(params.fetchFreqInHours);
      if (params.disable !== undefined) body.disable = params.disable;
      if (params.slack_webhook_url !== undefined)
        body.slack_webhook_url = params.slack_webhook_url;

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
