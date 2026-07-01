import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { OutxClient } from "../client.js";

export function registerAccountTools(
  server: McpServer,
  client: OutxClient
): void {
  server.tool(
    "get_team",
    "Read your OutX team account: identity, effective plan (with expiry), and plan limits with current usage (watchlists and team members). Call this before creating watchlists to check remaining quota and avoid a 402.",
    {},
    async () => {
      const result = await client.get("/api-team", {});
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }
  );
}
