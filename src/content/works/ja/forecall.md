---
title: "Forecall"
description: "AI エージェントが MCP ツールを正しく選んで呼べるかを測り、直すべき点を示す。ツール説明のリンターは OSS。"
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

## 概要

MCP サーバーのツールは、説明文の良し悪しでエージェントの呼び方が変わる。Forecall はツール説明を 0〜100 で採点するリンターから始まり、エージェントが実際にツールを正しく選んで呼べているかを測って、直すべき点を示す。

## 構成

- **forecall-cli**。`npx forecall lint tools.json` で、目的・使いどころ・引数・戻り値・制約・例の観点から各ツールを採点する OSS のリンターと CLI。GitHub Actions 版もある
- **forecall-mcp**。stdio でサーバーを起動するクライアント（Claude Desktop など）を Forecall Failure KB につなぐ小さなリレー。KB はエージェントが MCP ツールの既知の失敗と回避策を呼び出し前後に引ける MCP サーバー
- **forecall.dev**。計測とダッシュボードの本体

## 技術的なポイント

- 採点ルールはバージョン管理され、サーバー全体の問題（ほぼ同じ説明の重複など）とツール単位の問題を分けて出す
- KB は Streamable HTTP の MCP サーバーとして公開し、リモート接続できないクライアントだけリレーを挟む
