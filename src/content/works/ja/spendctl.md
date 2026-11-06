---
title: "spendctl"
description: "支払いをする AI エージェントのための予算・承認・レシート。x402 や Stripe MPP などの HTTP 402 系プロトコルとウォレットを横断する、支出ポリシーの制御プレーン。"
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

## 概要

API に支払いをするエージェントには、財布そのものとは別に「いくらまで、どこに、誰の承認で」を決める層が要る。spendctl はその支出ポリシーを、エージェントの外側で強制する制御プレーン。予算、許可リスト、人の承認、レシート、支払いの連鎖の追跡を、ウォレットやプロトコルをまたいで一か所にまとめる。

## 構成

- **SDK**（OSS、Apache-2.0）。どの言語からも使えるゲートウェイ URL、依存ゼロの fetch ラッパー、MCP サーバー。サイドカー本体はプロプライエタリ
- **サンドボックス**。ログイン不要の隔離環境で、ポリシーのプリセット、拒否と承認の流れを模擬の有料 API 相手に試せる
- **制御プレーン**。早期アクセス受付中

## 技術的なポイント

- 失敗後の再署名、Idempotency-Key によるリトライの重複排除、売り手が対応していれば x402 の payment-identifier 拡張を使う
- 対応プロトコルは x402 v1 / v2 と Stripe MPP。Claude Agent SDK、OpenAI Agents SDK、LangGraph から利用できる
