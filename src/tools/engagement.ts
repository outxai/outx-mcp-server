import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { OutxClient } from "../client.js";

export function registerEngagementTools(
  server: McpServer,
  client: OutxClient
): void {
  server.tool(
    "get_interactions",
    "Retrieve likes and comments for posts in a specific watchlist. Use to analyze engagement activity, build reports, or power dashboards. Returns interactions with full post objects, pagination with like/comment totals, and a 7-day graph.",
    {
      watchlist_id: z.string().describe("Watchlist ID to retrieve interactions from"),
      interaction_type: z
        .enum(["like", "comment"])
        .optional()
        .describe("Filter by interaction type"),
      actor_ids: z
        .string()
        .optional()
        .describe("Comma-separated actor IDs (user IDs, author IDs, or company IDs)"),
      page: z.string().optional().describe("Page number (default: 1)"),
      page_size: z.string().optional().describe("Results per page, max 100 (default: 10)"),
    },
    async (params) => {
      const queryParams: Record<string, string> = {
        watchlist_id: params.watchlist_id,
      };
      if (params.interaction_type) queryParams.interaction_type = params.interaction_type;
      if (params.actor_ids) queryParams.actor_ids = params.actor_ids;
      if (params.page) queryParams.page = params.page;
      if (params.page_size) queryParams.page_size = params.page_size;

      const result = await client.get("/api-interactions", queryParams);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "like_post",
    "Like a LinkedIn post from your watchlist. Requires the post ID from get_posts results.",
    {
      post_id: z.string().describe("Post ID from get_posts results"),
      user_email: z.string().describe("Email of the LinkedIn account to like from"),
      actor_type: z
        .enum(["user", "company"])
        .optional()
        .describe("Like as user or company page (default: user)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        post_id: params.post_id,
        user_email: params.user_email,
      };
      if (params.actor_type) body.actor_type = params.actor_type;

      const result = await client.post("/api-like", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "comment_on_post",
    "Comment on a LinkedIn post from your watchlist. Requires the post ID from get_posts results.",
    {
      post_id: z.string().describe("Post ID from get_posts results"),
      user_email: z.string().describe("Email of the LinkedIn account to comment from"),
      comment_text: z.string().describe("The comment text to post"),
      actor_type: z
        .enum(["user", "company"])
        .optional()
        .describe("Comment as user or company page (default: user)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        post_id: params.post_id,
        user_email: params.user_email,
        comment_text: params.comment_text,
      };
      if (params.actor_type) body.actor_type = params.actor_type;

      const result = await client.post("/api-comment", body);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
