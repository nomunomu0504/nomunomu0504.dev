---
# TODO: confirm the mobile stack.
title: "LaterHub"
description: "後で読む・後で見るを、チームのナレッジに。記事・動画・資料を保存し、AI 要約と曖昧検索で共有する AI ブックマークサービス。"
date: 2026-07-15
type: "saas"
kind: "AI · TEAMS"
status: "LIVE"
active: true
role: "設計・実装・運用"
stack: ["iOS", "Android", "Chrome Extension", "Next.js", "Claude"]
links:
  website: "https://laterhub.app"
  appStore: "https://apps.apple.com/app/id6781946514"
  playStore: "https://play.google.com/store/apps/details?id=app.laterhub.mobile"
  other:
    - label: "Chrome Web Store"
      url: "https://chromewebstore.google.com/detail/laterhub/lgipnibklcpnafekgdpldihbjhodjgmk"
featured: true
order: 5
---

## 概要

個人の「あとで読む」はたいてい読まれずに終わる。LaterHub は保存したリンクをチームの共有物にして、AI の要約と曖昧検索で後から引けるようにする。

## 構成

- ブラウザ拡張、モバイルアプリ、OS の共有シートから保存
- 保存したリンクは Claude が要約し、グループごとの既読状況と、共有やコメントのリアルタイム通知
- Web、iOS、Android、Chrome 拡張
