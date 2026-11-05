---
title: "ポートフォリオ兼ブログを Astro で作り直した"
description: "Astro と Cloudflare Workers の静的配信で、ポートフォリオ兼ブログを組み直したときの構成メモ。"
pubDate: 2026-11-05
tags: ["astro", "cloudflare"]
draft: false
---

これはサンプル記事です。目次、コードブロック、広告枠の見え方を確認するために置いています。

## なぜ Astro にしたか

ポートフォリオとブログは、ほぼ全ページが静的で、SEO と OGP が重要で、更新頻度は低いという典型的な静的サイトです。SSR もデータベースも要りません。

Astro は型付きフロントマター、MDX、多言語ルーティング、RSS、sitemap が標準で揃っていて、既定で JavaScript をほとんど出しません。

## 構成

```ts
// astro.config.mjs
export default defineConfig({
  i18n: { defaultLocale: 'ja', locales: ['ja', 'en'] },
  integrations: [mdx(), sitemap()],
});
```

記事は Markdown を git で管理し、Cloudflare Workers の静的アセット配信に載せています。検索は Pagefind をビルド時に走らせています。

## 今後

デザインを差し替え、OG 画像の自動生成と Zenn への転載を足す予定です。
