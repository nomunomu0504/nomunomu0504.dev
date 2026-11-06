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
| `bun run stack` | Regenerate `src/data/stack.ts` from public GitHub repos (uses `GITHUB_TOKEN` or `gh auth token`) |
| `bun run new:post <slug>` | Scaffold a draft post (`--title`, `--tags a,b`, `--en` for the English twin) |
| `bun run new:work <slug>` | Scaffold a project (`--title`, `--type oss\|app\|saas\|client\|infra`, `--en`) |

## Content

```
src/content/
  blog/<locale>/<slug>.md    # posts; the locale folder sets the language
  works/<locale>/<slug>.md   # projects
```

Japanese is the default locale (no URL prefix); English lives under `/en/`. A post is linked to its translation by sharing the same slug in both locale folders. Frontmatter schemas are in `src/content.config.ts`.

Pages are thin wrappers around `src/views/*`, so each page body exists once and is rendered for both locales.

## Scripts

- `scripts/stack.ts` writes the Home "Stack" data by matching manifests and languages against `scripts/stack-rules.ts`. By default it scans the repositories linked from the Works entries (`links.github`) plus any listed in `repos` of `scripts/stack.config.ts` (`name` or `owner/name`; private ones need a token that can read them); with neither, it discovers the account's public, non-fork repositories pushed since `since`. `STACK_REPOS=a,b bun run stack` overrides the list for one run; `--dry-run` prints without writing. Things that live outside git (homelab) go in `manual`.
- `scripts/new.ts` creates dated Markdown stubs under `src/content/`.
- `scripts/og-fonts.py` vendors the fonts used by `src/lib/og.ts`, which renders Open Graph images at build time (`/og/<locale>/<blog|works>/<slug>.png` and `/og/default.png`).

## Ads and analytics

Google Tag Manager loads when `PUBLIC_GTM_ID` is set (`src/components/GoogleTagManager.astro`); GA4 is configured inside the container, not in the page. Consent Mode v2 defaults are pushed from the same opt-out choice before the container loads.

`src/components/AdSlot.astro` reserves fixed-height AdSense slots (`leaderboard`, `in-article`, `rectangle`, `skyscraper`, `list`). Slots render as placeholders until `PUBLIC_ADSENSE_CLIENT` and the per-slot `PUBLIC_ADSENSE_SLOT_*` IDs are set (see `.env.example`). Create the units in AdSense as *Responsive* display units (plus one *In-article* unit): the page sizes the display `<ins>` itself (full width, fixed height per breakpoint) so the ad can never outgrow its frame. Replace `public/ads.txt` before going live.

Consent is opt-out: AdSense loads and consent signals are granted unless the visitor turns ad/analytics cookies off from the banner or the footer's "Cookie settings". EEA/UK opt-in must be handled by Google's certified CMP (enable it in the AdSense console).

## Deploy

`.github/workflows/deploy.yml` deploys `main` with `cloudflare/wrangler-action`. Required repository secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`. Site URL and ad/giscus IDs are read from repository variables (`vars.*`).

`wrangler.jsonc` attaches the Worker to `nomunomu0504.dev` as a Custom Domain, so Cloudflare owns the apex DNS record and certificate; the `workers.dev` URL stays available as a check URL. `public/_redirects` carries the paths left over from the Hatena Blog that previously lived on the domain (`/feed`, `/rss`, `/archive`, `/entry/*`). When an old article is migrated, add a specific `/entry/YYYY/MM/DD/HHMMSS /blog/<slug>/ 301` line above the catch-all.

## Notes

- `package.json` pins `@emnapi/runtime` to 1.11.3 through `overrides` because `@astrojs/astro2tsx` (used by `astro check`) is not yet compatible with the 2.x runtime that rolldown hoists. Remove the override once `astro check` works without it.
