# OutX MCP Server

[![npm version](https://img.shields.io/npm/v/outx-mcp-server.svg)](https://www.npmjs.com/package/outx-mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MCP server for the [OutX](https://outx.ai) LinkedIn social listening and data API. Connect AI agents like Claude, Cursor, and Claude Code to LinkedIn — create watchlists, search posts, fetch profiles, and engage, all through natural language.

<p align="center">
  <code>AI Agent ←→ MCP Protocol ←→ OutX MCP Server ←→ OutX API ←→ LinkedIn</code>
</p>

## What You Can Do

- **Monitor LinkedIn** — Track posts by keywords, people, or companies with watchlists
- **Search & filter posts** — 15+ filters: keyword, date, seniority, trending, language
- **Fetch profiles** — Get full LinkedIn profiles: name, headline, experience, education, skills
- **Engage** — Like and comment on posts through your LinkedIn account
- **All via natural language** — Just tell your AI agent what you want

## Quick Start

**1. Get an API key** at [mentions.outx.ai/api-doc](https://mentions.outx.ai/api-doc)

**2. Add to your AI tool** (pick one):

<details>
<summary><strong>Claude Desktop</strong></summary>

Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

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
</details>

<details>
<summary><strong>Cursor</strong></summary>

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
</details>

<details>
<summary><strong>Claude Code</strong></summary>

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
</details>

<details>
<summary><strong>Windsurf</strong></summary>

Add to `~/.codeium/windsurf/mcp_config.json`:

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
</details>

**3. Start using it:**

> "Create a watchlist to monitor LinkedIn posts about AI startups raising Series A"

## Available Tools (20)

### Watchlist Management

| Tool | Description |
|------|-------------|
| `create_keyword_watchlist` | Monitor LinkedIn posts matching keywords with optional required/excluded terms |
| `list_keyword_watchlists` | List all keyword watchlists |
| `update_keyword_watchlist` | Update name, scan frequency, or pause/resume |
| `delete_keyword_watchlist` | Delete a keyword watchlist and all tracked data |
| `create_people_watchlist` | Track posts from specific LinkedIn profiles |
| `list_people_watchlists` | List all people watchlists |
| `update_people_watchlist` | Update name, scan frequency, or pause/resume |
| `delete_people_watchlist` | Delete a people watchlist |
| `create_company_watchlist` | Monitor posts from LinkedIn company pages |
| `list_company_watchlists` | List all company watchlists |
| `update_company_watchlist` | Update name, scan frequency, or pause/resume |
| `delete_company_watchlist` | Delete a company watchlist |

### Posts & Engagement

| Tool | Description |
|------|-------------|
| `get_posts` | Search and filter posts from watchlists (keyword, date, seniority, trending, language, etc.) |
| `like_post` | Like a post from your watchlist results |
| `comment_on_post` | Comment on a post from your watchlist results |

### LinkedIn Data API

These tools use the async LinkedIn Data API. The MCP server handles polling automatically — you get the result directly.

| Tool | Description |
|------|-------------|
| `fetch_linkedin_profile` | Fetch full LinkedIn profile by slug (name, headline, experience, education, skills) |
| `fetch_linkedin_posts` | Fetch recent posts from profiles by URN |
| `linkedin_like_post` | Like a post by activity URN |
| `linkedin_comment_on_post` | Comment on a post by activity URN |
| `get_task_status` | Check status of an async task manually |

> **Note:** LinkedIn Data tools require the [OutX Chrome extension](https://outx.ai/docs/resources/chrome-extension) to be active within the last 48 hours.

## Example Prompts

Once connected, try these with your AI agent:

**Social listening:**
- "Create a watchlist to monitor LinkedIn posts about AI startups raising Series A"
- "Show me trending posts from my watchlists this week"
- "What are VPs and Directors posting about machine learning?"
- "Find posts mentioning our competitor from the last 7 days"

**Profile research:**
- "Fetch the LinkedIn profile for williamhgates"
- "Get recent posts from this prospect's profile"

**Engagement:**
- "Like the top 3 most engaging posts about product management"
- "Comment on this post with a thoughtful response"

**Workflows:**
- "Set up a watchlist for 'looking for a CRM' and check it every 6 hours"
- "List all my watchlists and show me posts from the sales signals one"

## Prerequisites

- **Node.js 18+** — Required for the MCP server runtime
- **OutX account** — [Sign up free](https://mentions.outx.ai/login) and get your API key
- **OutX Chrome extension** — Required for LinkedIn Data API tools (profile fetching, direct engagement). [Install here](https://outx.ai/docs/resources/chrome-extension)

## How It Works

The OutX API has two surfaces:

1. **Watchlists & Engagement API** (sync) — Create watchlists to monitor LinkedIn by keywords, people, or companies. OutX scans on your schedule and stores posts. Query and engage via API.

2. **LinkedIn Data API** (async) — Direct LinkedIn proxy. Fetch profiles, get posts, like, comment. All endpoints return a task ID; the MCP server polls automatically until the result is ready.

The MCP server wraps both APIs into 20 tools that any MCP-compatible AI agent can call.

## Development

```bash
git clone https://github.com/outxai/outx-mcp-server.git
cd outx-mcp-server
npm install
npm run build
OUTX_API_KEY=your-key npm start
```

For development with auto-reload:

```bash
OUTX_API_KEY=your-key npm run dev
```

## Documentation

- [MCP Integration Guide](https://outx.ai/docs/integrations/mcp) — Detailed setup and configuration
- [API Reference](https://outx.ai/docs/api-reference/introduction) — Full REST API documentation
- [API Quick Start](https://outx.ai/docs/api-reference/quickstart) — Create watchlists and retrieve posts
- [LinkedIn Data API Quick Start](https://outx.ai/docs/linkedin-api/quickstart) — Fetch profiles in 2 minutes
- [Authentication Guide](https://outx.ai/docs/api-reference/authentication) — API keys and OTP auth
- [Rate Limits](https://outx.ai/docs/api-reference/rate-limits) — Usage limits and best practices
- [API Use Cases](https://outx.ai/docs/api-reference/use-cases) — Sales signals, competitor monitoring, hiring alerts
- [Chrome Extension](https://outx.ai/docs/resources/chrome-extension) — Required for LinkedIn Data tools
- [LinkedIn Safety Guide](https://outx.ai/docs/resources/linkedin-safety) — Rate limiting and account protection

## Integrations

- [Python SDK](https://outx.ai/docs/integrations/python-sdk) — Drop-in Python wrapper for the OutX API
- [LangChain Integration](https://outx.ai/docs/integrations/langchain) — Use OutX as a LangChain tool for AI agents
- [n8n Integration](https://outx.ai/docs/integrations/n8n) — No-code LinkedIn automation workflows

## Guides & Tutorials

- [How to Connect AI Agents to LinkedIn](https://www.outx.ai/blog/linkedin-api-for-ai-agents) — LangChain, Claude, GPT, and MCP examples
- [LinkedIn API Guide](https://www.outx.ai/blog/linkedin-api-guide) — Comprehensive API overview
- [LinkedIn API Alternatives 2026](https://www.outx.ai/blog/linkedin-api-alternatives-2026) — OutX vs Proxycurl vs PhantomBuster vs Unipile
- [How to Build a Sales Signal Pipeline](https://www.outx.ai/blog/linkedin-sales-signal-pipeline) — Detect buying intent with the OutX API
- [LinkedIn Competitor Monitoring Guide](https://www.outx.ai/blog/linkedin-competitor-monitoring-guide) — Track competitor activity via API
- [Social Listening on LinkedIn](https://www.outx.ai/blog/guide-social-listening-linkedin) — Complete guide to LinkedIn monitoring
- [How to Automate LinkedIn Likes & Comments](https://www.outx.ai/blog/automate-linkedin-likes-comments) — Engagement automation best practices
- [LinkedIn Automation Safety Guide](https://www.outx.ai/blog/linkedin-automation-safety-guide-best-practices-2026) — Keep your account safe

## Links

- [OutX Platform](https://outx.ai) — Sign up and get started
- [Get API Key](https://mentions.outx.ai/api-doc) — Generate your API key
- [OutX for AI Agents](https://outx.ai/docs/ai) — All AI integration options (MCP, skill file, llms.txt)
- [Pricing](https://outx.ai/docs/documentation/pricing-and-subscription) — Free, Pro, and Enterprise plans
- [FAQ](https://outx.ai/docs/resources/faq) — Common questions answered

## Partnerships

Interested in a collaboration or affiliate partnership? Drop us a message at [support@outx.ai](mailto:support@outx.ai).

## License

MIT
