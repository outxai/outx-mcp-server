#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { OutxClient } from "./client.js";
import { registerWatchlistTools } from "./tools/watchlists.js";
import { registerPostTools } from "./tools/posts.js";
import { registerEngagementTools } from "./tools/engagement.js";
import { registerLinkedInTools } from "./tools/linkedin.js";

const apiKey = process.env.OUTX_API_KEY;
if (!apiKey) {
  console.error(
    "Error: OUTX_API_KEY environment variable is required.\n" +
      "Get your key at https://mentions.outx.ai/api-doc"
  );
  process.exit(1);
}

const client = new OutxClient(apiKey);

const server = new McpServer({
  name: "outx",
  version: "1.0.0",
});

registerWatchlistTools(server, client);
registerPostTools(server, client);
registerEngagementTools(server, client);
registerLinkedInTools(server, client);

const transport = new StdioServerTransport();
await server.connect(transport);
