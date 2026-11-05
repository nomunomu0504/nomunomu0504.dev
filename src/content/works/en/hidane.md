---
title: "hidane"
description: "A Firestore emulator without Java: a single Rust binary that works as a drop-in replacement for the official one."
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

## Overview

The official Cloud Firestore emulator needs a JDK and is slow to start. hidane (火種, "the seed of fire") is a single Rust binary that speaks the same gRPC, REST and WebChannel wire protocols and evaluates the same Security Rules, and runs under `firebase-tools`. Compatibility is verified by parity tests that use the official emulator as the oracle.

## Pieces

- **hidane** itself: the emulator plus the `doctor`, `migrate`, `benchmark` and `report` subcommands
- **setup-hidane**: the GitHub Action that installs hidane in a job, verifying the release's SHA-256 and build provenance first. A sub-action opens a pull request that moves a repository's tests off the official emulator
- **benchmark-results**: nightly and per-release benchmarks against the official emulator on the same machine

## Technical notes

- A tonic / tokio gRPC server with axum for REST, checked against the official emulator for documents, queries, aggregations, vector search, transactions, listeners, exports and imports
- Also stands in for the Cloud SDK image in Testcontainers
