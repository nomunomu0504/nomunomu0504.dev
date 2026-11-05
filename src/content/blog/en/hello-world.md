---
title: "Rebuilding my portfolio and blog with Astro"
description: "Notes on rebuilding a portfolio and blog as a static site with Astro and Cloudflare Workers."
pubDate: 2026-11-05
tags: ["astro", "cloudflare"]
draft: false
---

This is a sample post. It exists so the table of contents, code blocks, and ad slots can be checked.

## Why Astro

A portfolio and blog is the textbook static site: almost every page is static, SEO and Open Graph matter, and updates are infrequent. No SSR, no database.

Astro ships typed frontmatter, MDX, i18n routing, RSS, and sitemaps out of the box, and emits almost no JavaScript by default.

## Setup

```ts
// astro.config.mjs
export default defineConfig({
  i18n: { defaultLocale: 'ja', locales: ['ja', 'en'] },
  integrations: [mdx(), sitemap()],
});
```

Posts are Markdown files tracked in git, served from Cloudflare Workers static assets. Search is indexed at build time with Pagefind.

## Next

Swap in the real design, generate OG images at build time, and cross-post to Zenn.
