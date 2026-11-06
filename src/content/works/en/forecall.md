---
title: "Forecall"
description: "Measures whether AI agents choose and call your MCP tools correctly, and shows what to fix. The tool-description linter is open source."
date: 2026-10-07
type: "saas"
kind: "MCP · AGENTS"
status: "LIVE"
active: true
period: "2026.10 — present"
role: "Founder · Developer"
stack: ["TypeScript", "MCP", "Node.js", "Cloudflare Workers", "Hono"]
links:
  website: "https://forecall.dev"
  github: "https://github.com/forecall/forecall-cli"
  other:
    - label: "forecall-mcp"
      url: "https://github.com/forecall/forecall-mcp"
    - label: "GitHub Marketplace · Forecall lint"
      url: "https://github.com/marketplace/actions/forecall-lint-for-mcp-tools"
featured: true
order: 2
---

## Overview

How an agent calls an MCP tool depends on how the tool is described. Forecall starts with a linter that scores tool descriptions from 0 to 100, then measures whether agents actually choose and call the tools correctly, and shows what to fix.

## Pieces

- **forecall-cli**: `npx forecall lint tools.json` scores each tool on purpose, when to use it, arguments, return value, constraints and examples. Open source, with a GitHub Action
- **forecall-mcp**: a small relay that connects stdio-only clients such as Claude Desktop to the Forecall Failure KB, an MCP server where agents look up known failures and workarounds before and after calling a tool
- **forecall.dev**: the measurement service and dashboard

## Technical notes

- Scoring rules are versioned and separate server-wide issues (near-identical descriptions) from per-tool ones
- The KB is a Streamable HTTP MCP server; the relay exists only for clients that cannot reach a remote server
