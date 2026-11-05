---
title: "sub-screen-player"
description: "Drives the long, narrow USB sub-displays that sit under a monitor from macOS, Linux and Windows: a clock, a system dashboard, images and video at up to 60 fps."
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

## Overview

USB sub-displays such as the upHere / MiraBox D92 (1920×462) usually come with a Windows-only vendor app. `ssp`, a single binary, runs a small daemon that keeps the display alive and shows a clock, a system dashboard with your own figures, images, animations, video, web pages or live frames.

## Technical notes

- The HID device protocol is implemented in Rust; frames are encoded on one thread and sent on another, up to 60 fps
- The daemon exposes HTTP and WebSocket APIs, so anything can draw on the screen, including a Claude Code notification over the clock
- Adding a display means writing only its protocol; everything else is shared. Distributed through Homebrew and Scoop
