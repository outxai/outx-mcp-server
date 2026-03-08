import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { OutxClient } from "../client.js";

export function registerEngagementTools(
  server: McpServer,
  client: OutxClient
): void {
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
