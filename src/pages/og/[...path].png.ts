import type { APIRoute } from 'astro';
import { locales, localeHref } from '@/i18n/config';
import { formatDate, getPosts, getWorks, slugOf } from '@/lib/content';
import { renderOg, type OgInput } from '@/lib/og';
import { site } from '@/lib/site';

const brand = 'nomunomu0504.dev';
const footer = `${site.name} · ${site.role}`;

export async function getStaticPaths() {
  const paths: { params: { path: string }; props: OgInput }[] = [
    {
      params: { path: 'default' },
      props: { title: site.description.ja, section: 'PORTFOLIO · BLOG', meta: `@${site.handle}`, footer, brand },
    },
  ];
  for (const locale of locales) {
    const prefix = localeHref(locale, '/').slice(1); // "" or "en/"
    for (const post of await getPosts(locale)) {
      const tags = post.data.tags.map((tag) => `#${tag}`).join(' ');
      paths.push({
        params: { path: `${prefix}blog/${slugOf(post)}` },
        props: {
          title: post.data.title,
          section: 'BLOG',
          meta: [formatDate(post.data.pubDate), tags].filter(Boolean).join(' · '),
          footer,
          brand,
        },
      });
    }
    for (const work of await getWorks(locale)) {
      paths.push({
        params: { path: `${prefix}works/${slugOf(work)}` },
        props: {
          title: work.data.title,
          section: 'WORKS',
          meta: [work.data.type.toUpperCase(), work.data.kind?.toUpperCase(), ...work.data.stack.slice(0, 3)]
            .filter(Boolean)
            .join(' · '),
          footer,
          brand,
        },
      });
    }
  }
  return paths;
}

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(props as OgInput);
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
