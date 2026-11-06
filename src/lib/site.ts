import type { Locale } from '@/i18n/config';

export const site = {
  name: 'Hiroki Nomura',
  nameJa: '野村 弘樹',
  handle: 'nomunomu0504',
  repo: 'https://github.com/nomunomu0504/nomunomu0504.dev',
  role: 'CTO, MIRAI STUDIO',
  companyUrl: 'https://miraistudio.co.jp',
  /** Public contact address shown on About. Leave empty to hide the row. */
  email: '' as string,
  location: 'TOKYO, JP',
  description: {
    ja: 'みらいスタジオ CTO。Flutter、AWS、Cloudflare、自宅サーバーまわりの話を書いています。',
    en: 'CTO at Mirai Studio. Writing about Flutter, AWS, Cloudflare, and running a homelab.',
  } satisfies Record<Locale, string>,
  intro: {
    ja: 'Flutter と AWS でプロダクトを作り、自宅の Proxmox でそれを支える側も自分で運用しています。みらいスタジオ CTO。受託と自社開発のかたわら、個人開発と OSS をいくつか。',
    en: 'I build products with Flutter and AWS, and run the Proxmox homelab that backs them. CTO at Mirai Studio; client work and in-house products by day, side projects and open source on the side.',
  } satisfies Record<Locale, string>,
  bio: {
    ja: 'Flutter / AWS / 自宅サーバー。個人開発と OSS をいくつか。設計相談や協業の話は X の DM か About から。',
    en: 'Flutter, AWS, homelab. A few side projects and open-source tools. For architecture questions or collaboration, reach out via X DM or the About page.',
  } satisfies Record<Locale, string>,
  social: {
    github: 'https://github.com/nomunomu0504',
    x: 'https://x.com/nomunomu0504',
    zenn: 'https://zenn.dev/nomunomu0504',
    lapras: 'https://lapras.com/public/nomunomu0504',
  },
  ogImage: '/og/default.png',
} as const;
