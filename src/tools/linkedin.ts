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
    "fetch_linkedin_company",
    "Fetch a LinkedIn company page by slug. Returns company data including name, industry, employee count, description, headquarters, and logo. Requires the OutX Chrome extension to be active within the last 48 hours. This tool handles async polling automatically.",
    {
      company_slug: z
        .string()
        .describe("LinkedIn company slug (e.g. 'microsoft' from linkedin.com/company/microsoft)"),
    },
    async (params) => {
      const response = (await client.post("/linkedin-agent/fetch-company", {
        company_slug: params.company_slug,
      })) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "fetch_linkedin_company_posts",
    "Fetch recent posts from a LinkedIn company page by slug. Returns posts with engagement data (likes, comments, shares). Requires the OutX Chrome extension to be active within the last 48 hours. This tool handles async polling automatically.",
    {
      company_slug: z
        .string()
        .describe("LinkedIn company slug (e.g. 'openai' from linkedin.com/company/openai)"),
    },
    async (params) => {
      const response = (await client.post("/linkedin-agent/fetch-company-posts", {
        company_slug: params.company_slug,
      })) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "linkedin_send_message",
    "Send a LinkedIn direct message to a 1st-degree connection. Requires the recipient's person URN (get it from fetch_linkedin_profile or linkedin_search_profiles). Message is sent from your team's oldest admin member's LinkedIn account. Requires the OutX Chrome extension to be active. This tool handles async polling automatically.",
    {
      recipient_urn: z
        .string()
        .describe("LinkedIn person URN of the recipient (e.g. 'urn:li:person:ACoAABCDEFG')"),
      message: z
        .string()
        .describe("Message text to send (max 10,000 characters)"),
    },
    async (params) => {
      const response = (await client.post("/linkedin-agent/send-message", {
        recipient_urn: params.recipient_urn,
        message: params.message,
      })) as { api_agent_task_id: string };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "linkedin_search_profiles",
    "Search LinkedIn profiles by keywords, title, company, location, industry, and more. Returns matching profiles with name, headline, location, profile slug, and connection degree. At least one filter is required. Requires the OutX Chrome extension to be active. This tool handles async polling automatically.",
    {
      keywords: z.string().optional().describe("General keyword search across name, headline, and profile text"),
      title: z.string().optional().describe("Filter by job title (e.g. 'VP of Engineering')"),
      company: z.string().optional().describe("Filter by current company name (e.g. 'Google')"),
      first_name: z.string().optional().describe("Filter by first name"),
      last_name: z.string().optional().describe("Filter by last name"),
      geo_urn: z.array(z.string()).optional().describe("LinkedIn geographic URNs (e.g. ['103644278'] for US)"),
      current_company: z.array(z.string()).optional().describe("LinkedIn company URNs for current employer"),
      industry: z.array(z.string()).optional().describe("LinkedIn industry URNs"),
      past_company: z.array(z.string()).optional().describe("LinkedIn company URNs for past employer"),
      school: z.string().optional().describe("Filter by school name (e.g. 'MIT')"),
      profile_language: z.array(z.string()).optional().describe("Language codes (e.g. ['en'])"),
      count: z.number().optional().describe("Number of profiles to return (default 25, max 50)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.keywords) body.keywords = params.keywords;
      if (params.title) body.title = params.title;
      if (params.company) body.company = params.company;
      if (params.first_name) body.first_name = params.first_name;
      if (params.last_name) body.last_name = params.last_name;
      if (params.geo_urn) body.geo_urn = params.geo_urn;
      if (params.current_company) body.current_company = params.current_company;
      if (params.industry) body.industry = params.industry;
      if (params.past_company) body.past_company = params.past_company;
      if (params.school) body.school = params.school;
      if (params.profile_language) body.profile_language = params.profile_language;
      if (params.count) body.count = params.count;

      const response = (await client.post("/linkedin-agent/search-profiles", body)) as {
        api_agent_task_id: string;
      };

      const result = await client.pollTask(response.api_agent_task_id);
      return { content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }] };
    }
  );

  server.tool(
    "linkedin_fetch_connections",
    "Fetch your 1st-degree LinkedIn connections. Optionally filter by keyword, sort by recently added, and paginate. Connections are from your team's oldest admin member's LinkedIn account. Requires the OutX Chrome extension to be active. This tool handles async polling automatically.",
    {
      keyword: z.string().optional().describe("Filter connections by name (e.g. 'John')"),
      sort_type: z.string().optional().describe("Sort order. Pass 'RECENTLY_ADDED' for newest first"),
      start: z.number().optional().describe("Pagination offset (default 0)"),
      count: z.number().optional().describe("Number of connections to return (default 40, max 100)"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};
      if (params.keyword) body.keyword = params.keyword;
      if (params.sort_type) body.sort_type = params.sort_type;
      if (params.start !== undefined) body.start = params.start;
      if (params.count) body.count = params.count;

      const response = (await client.post("/linkedin-agent/fetch-connections", body)) as {
        api_agent_task_id: string;
      };

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
