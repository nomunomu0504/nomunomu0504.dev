import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { localeHref } from '@/i18n/config';
import { getPosts, slugOf } from '@/lib/content';
import { site } from '@/lib/site';

export async function GET(context: APIContext) {
  const posts = await getPosts('en');
  return rss({
    title: site.name,
    description: site.description.en,
    site: context.site ?? 'https://nomunomu0504.dev',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: localeHref('en', `/blog/${slugOf(post)}/`),
      categories: post.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
