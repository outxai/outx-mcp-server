import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { OutxClient } from "../client.js";

export function registerLinkedInTools(
  server: McpServer,
  client: OutxClient
): void {
  server.tool(
    "fetch_linkedin_profile",
    "Fetch a LinkedIn profile by slug. Returns full profile data including name, headline, experience, education, and skills. Requires the OutX Chrome extension to be active within the last 48 hours. This tool handles async polling automatically.",
    {
      profile_slug: z
        .string()
        .describe("LinkedIn profile slug (e.g. 'williamhgates' from linkedin.com/in/williamhgates)"),
    },
    async (params) => {
      const response = (await client.post("/linkedin-agent/fetch-profile", {
        profile_slug: params.profile_slug,
      })) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "fetch_linkedin_posts",
    "Fetch recent posts from LinkedIn profiles by URN. Use fetch_linkedin_profile first to get the profile URN. Requires the OutX Chrome extension to be active. This tool handles async polling automatically.",
    {
      profile_urns: z
        .array(z.string())
        .min(1)
        .describe("LinkedIn profile URNs (e.g. ['urn:li:fsd_profile:ABC123'])"),
    },
    async (params) => {
      const response = (await client.post(
        "/linkedin-agent/fetch-profiles-posts",
        { profile_urns: params.profile_urns }
      )) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "linkedin_like_post",
    "Like a LinkedIn post by its activity URN. This uses the LinkedIn Data API (direct LinkedIn action). Requires the OutX Chrome extension to be active. This tool handles async polling automatically.",
    {
      social_urn: z
        .string()
        .describe("LinkedIn activity URN of the post to like"),
    },
    async (params) => {
      const response = (await client.post("/linkedin-agent/like-post", {
        social_urn: params.social_urn,
      })) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "linkedin_comment_on_post",
    "Comment on a LinkedIn post by its activity URN. This uses the LinkedIn Data API (direct LinkedIn action). Requires the OutX Chrome extension to be active. This tool handles async polling automatically.",
    {
      social_urn: z
        .string()
        .describe("LinkedIn activity URN of the post to comment on"),
      comment_text: z.string().describe("The comment text to post"),
    },
    async (params) => {
      const response = (await client.post("/linkedin-agent/comment-post", {
        social_urn: params.social_urn,
        comment_text: params.comment_text,
      })) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "get_task_status",
    "Check the status of an async LinkedIn Data API task. Use this to manually check tasks that timed out. Status values: pending, processing, completed, failed.",
    {
      task_id: z.string().describe("The api_agent_task_id to check"),
    },
    async (params) => {
      const result = await client.get("/linkedin-agent/get-task-status", {
        api_agent_task_id: params.task_id,
      });
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );
}
