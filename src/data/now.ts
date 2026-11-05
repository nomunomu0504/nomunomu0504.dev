import type { Locale } from '@/i18n/config';

/** Home · 04 Now. Edit by hand, roughly monthly. */
export const now = {
  updated: '2026-11-01',
  items: {
    ja: [
      { key: 'BUILDING', value: 'このサイトの作り直し。Astro と Cloudflare Workers の静的配信' },
      { key: 'RUNNING', value: '自宅 Proxmox の LXC を Tailscale 前提の構成に整理中' },
      { key: 'READING', value: '[読んでいる本・資料]' },
      { key: 'OPEN TO', value: '技術顧問・Flutter / AWS の設計相談・OSS へのコントリビュート' },
    ],
    en: [
      { key: 'BUILDING', value: 'Rebuilding this site on Astro and Cloudflare Workers static assets' },
      { key: 'RUNNING', value: 'Reorganizing the homelab LXCs around Tailscale' },
      { key: 'READING', value: '[books and papers]' },
      { key: 'OPEN TO', value: 'Technical advising, Flutter / AWS architecture reviews, OSS contributions' },
    ],
  } satisfies Record<Locale, { key: string; value: string }[]>,
};
