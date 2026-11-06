---
title: "spendctl"
description: "Budgets, approvals and receipts for AI agents that pay. A spend-policy control plane across wallets and every HTTP 402 protocol, including x402 and Stripe MPP."
date: 2026-10-25
type: "saas"
kind: "AGENTS · PAYMENTS"
status: "EARLY ACCESS"
active: true
role: "Founder · Developer"
stack: ["TypeScript", "Python", "Cloudflare Workers", "x402", "Stripe MPP", "MCP"]
links:
  website: "https://spendctl.dev"
  github: "https://github.com/miraistudio/spendctl-sdk"
  other:
    - label: "npm · spendctl"
      url: "https://www.npmjs.com/package/spendctl"
featured: true
order: 4
---

## Overview

An agent that pays for APIs needs a layer, separate from the wallet, that decides how much, to whom and with whose approval. spendctl enforces that spend policy outside the agent: budgets, allowlists, human approvals, receipts and chain tracing, across wallets and protocols.

## Pieces

- **SDK** (open source, Apache-2.0): a gateway URL for any language, a zero-dependency fetch wrapper, and an MCP server. The sidecar itself is proprietary
- **Sandbox**: a login-free, isolated environment to try policy presets and walk through refusals and approvals against mock paid APIs
- **Control plane**: in early access

## Technical notes

- Re-signs payments after a failure, dedupes retries by Idempotency-Key, and uses the x402 payment-identifier extension when the seller supports it
- Supports x402 v1 / v2 and Stripe MPP; usable from the Claude Agent SDK, OpenAI Agents SDK and LangGraph
