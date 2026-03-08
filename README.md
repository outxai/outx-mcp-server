# OutX MCP Server

MCP server for the [OutX](https://outx.ai) LinkedIn social listening and data API. Lets AI agents (Claude, Cursor, Claude Code, etc.) create watchlists, search LinkedIn posts, fetch profiles, and engage — all through natural language.

## Quick Start

```bash
npx outx-mcp-server
```

Requires `OUTX_API_KEY` environment variable. [Get your API key](https://mentions.outx.ai/api-doc).

## Setup

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "outx": {
      "command": "npx",
      "args": ["-y", "outx-mcp-server"],
      "env": {
        "OUTX_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "outx": {
      "command": "npx",
      "args": ["-y", "outx-mcp-server"],
      "env": {
        "OUTX_API_KEY": "your-api-key"
      }
    }
  }
}
```

### Claude Code

Add to `.mcp.json` in your project:

```json
{
  "mcpServers": {
    "outx": {
      "command": "npx",
      "args": ["-y", "outx-mcp-server"],
      "env": {
        "OUTX_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Available Tools

### Watchlist Management

| Tool | Description |
|------|-------------|
| `create_keyword_watchlist` | Monitor LinkedIn posts matching keywords |
| `list_keyword_watchlists` | List all keyword watchlists |
| `update_keyword_watchlist` | Update name, frequency, or status |
| `delete_keyword_watchlist` | Delete a keyword watchlist |
| `create_people_watchlist` | Track posts from specific LinkedIn profiles |
| `list_people_watchlists` | List all people watchlists |
| `update_people_watchlist` | Update name, frequency, or status |
| `delete_people_watchlist` | Delete a people watchlist |
| `create_company_watchlist` | Monitor posts from LinkedIn company pages |
| `list_company_watchlists` | List all company watchlists |
| `update_company_watchlist` | Update name, frequency, or status |
| `delete_company_watchlist` | Delete a company watchlist |

### Posts & Engagement

| Tool | Description |
|------|-------------|
| `get_posts` | Search and filter posts from your watchlists |
| `like_post` | Like a watchlist post |
| `comment_on_post` | Comment on a watchlist post |

### LinkedIn Data API

These tools use the async LinkedIn Data API. The MCP server handles polling automatically — you get the result directly.

| Tool | Description |
|------|-------------|
| `fetch_linkedin_profile` | Fetch a LinkedIn profile by slug |
| `fetch_linkedin_posts` | Fetch posts from profiles by URN |
| `linkedin_like_post` | Like a post by activity URN |
| `linkedin_comment_on_post` | Comment on a post by activity URN |
| `get_task_status` | Check status of an async task manually |

> LinkedIn Data tools require the [OutX Chrome extension](https://outx.ai/docs/resources/chrome-extension) to be active within the last 48 hours.

## Example Prompts

Once connected, try these with your AI agent:

- "Create a watchlist to monitor LinkedIn posts about AI startups raising Series A"
- "Show me trending posts from my watchlists"
- "Fetch the LinkedIn profile for williamhgates"
- "Like the most recent post about product management"
- "What are VPs posting about machine learning this week?"

## Development

```bash
git clone https://github.com/outxai/outx-mcp-server.git
cd outx-mcp-server
npm install
npm run build
OUTX_API_KEY=your-key npm start
```

## Links

- [OutX Platform](https://outx.ai)
- [API Documentation](https://outx.ai/docs/api-reference/introduction)
- [Get API Key](https://mentions.outx.ai/api-doc)
- [LinkedIn Data API Guide](https://outx.ai/docs/linkedin-api/quickstart)

## License

MIT
