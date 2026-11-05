---
# TODO: confirm the app framework (native Swift or Flutter) for `stack`.
title: "Stacky"
description: "コピーが、積もっていく。iPhone と Mac のクリップボード履歴・定型文マネージャー。端末の中だけに保存、広告なし。"
date: 2026-07-26
type: "app"
kind: "iOS · macOS"
status: "iOS / macOS"
active: true
role: "設計・実装・運用"
stack: ["iOS", "macOS"]
links:
  website: "https://stacky.tools"
  appStore: "https://apps.apple.com/app/id6794009964"
featured: false
order: 8
---

## 概要

「さっきコピーしたやつ、もう一回見たい」。Stacky は、コピーした文章が開くだけで静かに積み上がる、コピー履歴と定型文のアプリ。iPhone と Mac で使える。

## できること

- **自動取り込み**。ほかのアプリでコピーして Stacky を開くだけで履歴に積み上がる
- **保存コピー**。共有メニューの「保存コピー」で、保存とコピーが一回で済む
- **背面タップ**。iPhone の背面タップに「クリップを保存」を割り当てられる
- **定型文**。よく使う文章を登録して、すぐ貼れる

## 技術的なポイント

- すべて端末の中だけに保存し、外部サーバーへは送らない。広告もない
