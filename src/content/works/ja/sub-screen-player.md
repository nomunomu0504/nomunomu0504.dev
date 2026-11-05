---
title: "sub-screen-player"
description: "モニター下に置く細長い USB サブディスプレイを macOS / Linux / Windows から動かす。時計、システムダッシュボード、画像や動画を最大 60 fps で。"
date: 2026-10-07
type: "oss"
kind: "RUST · USB"
status: "v0.10.0"
active: true
period: "2026.10 — present"
license: "MIT OR Apache-2.0"
role: "Author · Maintainer"
stack: ["Rust", "hidapi", "axum", "tokio", "WebSocket"]
links:
  github: "https://github.com/nomunomu0504/sub-screen-player"
  website: "https://subscreen.dev"
featured: true
order: 3
---

## 概要

upHere / MiraBox D92（1920×462）のような USB サブディスプレイは、メーカーの Windows 専用アプリでしか動かないことが多い。`ssp` という単一バイナリの小さなデーモンがディスプレイを保持し、時計、自分の数値を出せるシステムダッシュボード、画像、アニメーション、動画、Web ページ、ライブフレームを表示する。

## 技術的なポイント

- HID 経由のデバイスプロトコルを Rust で実装。フレームのエンコードと送信を別スレッドに分け、最大 60 fps
- デーモンは HTTP と WebSocket の API を持ち、外部から何でも描ける。Claude Code の通知を時計の上に出す、といった使い方も
- デバイスを足すときはプロトコル部分だけ書けばよく、それ以外は共通。Homebrew と Scoop で配布
