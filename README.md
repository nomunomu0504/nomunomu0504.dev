# nomunomu0504.dev

Personal portfolio and blog. Static site built with Astro, served from Cloudflare Workers static assets.

## Stack

- Astro 7 (content collections, i18n routing, MDX, sitemap, RSS)
- Tailwind CSS 4 via `@tailwindcss/vite`
- Pagefind for build-time search
- Cloudflare Workers static assets (`wrangler.jsonc`), deployed from GitHub Actions
- Bun as package manager, Node 24 (pinned in `mise.toml` / `.node-version`)

## Commands

| Command | Description |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Start the dev server (search is disabled in dev) |
| `bun run build` | Build to `dist/` and generate the Pagefind index |
| `bun run preview` | Preview the production build |
| `bun run check` | Type-check Astro files |
| `bun run deploy` | Build and deploy with wrangler (needs `wrangler login`) |

## Content

```
src/content/
  blog/<locale>/<slug>.md    # posts; the locale folder sets the language
  works/<locale>/<slug>.md   # projects
```

Japanese is the default locale (no URL prefix); English lives under `/en/`. A post is linked to its translation by sharing the same slug in both locale folders. Frontmatter schemas are in `src/content.config.ts`.

Pages are thin wrappers around `src/views/*`, so each page body exists once and is rendered for both locales.

## Ads

`src/components/AdSlot.astro` reserves fixed-height AdSense slots (`leaderboard`, `in-article`, `rectangle`, `skyscraper`, `list`). Slots render as placeholders until `PUBLIC_ADSENSE_CLIENT` and the per-slot `PUBLIC_ADSENSE_SLOT_*` IDs are set (see `.env.example`). Replace `public/ads.txt` before going live.

Consent is opt-out: AdSense loads unless the visitor turns ad cookies off from the banner or the footer's "Cookie settings". EEA/UK opt-in must be handled by Google's certified CMP (enable it in the AdSense console).

## Deploy

`.github/workflows/deploy.yml` deploys `main` with `cloudflare/wrangler-action`. Required repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Site URL and ad/giscus IDs are read from repository variables (`vars.*`).

## Notes

- `package.json` pins `@emnapi/runtime` to 1.11.3 through `overrides` because `@astrojs/astro2tsx` (used by `astro check`) is not yet compatible with the 2.x runtime that rolldown hoists. Remove the override once `astro check` works without it.
