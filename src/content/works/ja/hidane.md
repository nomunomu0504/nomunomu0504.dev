---
title: "hidane"
description: "Java 不要の Firestore エミュレータ。Rust の単一バイナリで、公式エミュレータの置き換えとして動く。"
date: 2026-10-09
type: "oss"
kind: "RUST"
status: "v0.6.0"
active: true
period: "2026.10 — present"
license: "MIT OR Apache-2.0"
role: "Author · Maintainer"
stack: ["Rust", "tonic", "tokio", "axum", "gRPC", "GitHub Actions"]
links:
  github: "https://github.com/hidane-dev/hidane"
  website: "https://hidane.dev"
  other:
    - label: "setup-hidane (GitHub Action)"
      url: "https://github.com/hidane-dev/setup-hidane"
    - label: "benchmark-results"
      url: "https://github.com/hidane-dev/benchmark-results"
featured: true
order: 1
---

## 概要

公式の Cloud Firestore エミュレータは JDK が要り、起動も遅い。hidane（火種）は同じ gRPC / REST / WebChannel のワイヤプロトコルと Security Rules を話す Rust の単一バイナリで、`firebase-tools` の下でそのまま動く。公式エミュレータをオラクルにしたパリティテストで互換性を検証している。

## 構成

- **hidane** 本体。エミュレータに加えて `doctor` / `migrate` / `benchmark` / `report` のサブコマンドを持つ
- **setup-hidane**。GitHub Actions で hidane を入れる公式アクション。リリースの SHA-256 とビルド来歴を検証してから実行する。テストを公式エミュレータから移す PR を開くサブアクションも同梱
- **benchmark-results**。公式エミュレータとの比較ベンチマークを同じマシンで毎晩・毎リリース記録している

## 技術的なポイント

- tonic / tokio の gRPC サーバーに axum の REST を同居させ、ドキュメント・クエリ・集計・ベクトル検索・トランザクション・リスナー・エクスポートとインポートまでを公式と突き合わせている
- Testcontainers では Cloud SDK イメージの代替としても使える
