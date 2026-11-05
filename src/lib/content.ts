import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { defaultLocale, isLocale, type Locale } from '@/i18n/config';

export type Post = CollectionEntry<'blog'>;
export type Work = CollectionEntry<'works'>;
type Collection = 'blog' | 'works';

/** Entry ids look like "ja/hello-world"; the first segment is the locale folder. */
export function parseId(id: string): { locale: Locale; slug: string } {
  const [head, ...rest] = id.split('/');
  if (isLocale(head) && rest.length > 0) return { locale: head, slug: rest.join('/') };
  return { locale: defaultLocale, slug: id };
}

export const slugOf = (entry: { id: string }): string => parseId(entry.id).slug;
export const localeOf = (entry: { id: string }): Locale => parseId(entry.id).locale;

const isPublished = (post: Post): boolean => import.meta.env.DEV || !post.data.draft;

export async function getPosts(locale: Locale): Promise<Post[]> {
  const posts = await getCollection('blog', (post) => localeOf(post) === locale && isPublished(post));
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getWorks(locale: Locale): Promise<Work[]> {
  const works = await getCollection('works', (work) => localeOf(work) === locale);
  return works.sort(
    (a, b) => a.data.order - b.data.order || b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

/** Returns the counterpart entry in another locale, or undefined when it has not been translated. */
export async function getTranslation(collection: Collection, locale: Locale, slug: string) {
  const entry = await getEntry(collection, `${locale}/${slug}`);
  if (!entry) return undefined;
  if (collection === 'blog' && !isPublished(entry as Post)) return undefined;
  return entry;
}

export interface TagCount {
  tag: string;
  count: number;
}

export function collectTags(posts: Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Tags that co-occur with `tag`, most frequent first. */
export function relatedTags(tag: string, posts: Post[], limit = 6): TagCount[] {
  const withTag = posts.filter((post) => post.data.tags.includes(tag));
  return collectTags(withTag)
    .filter((entry) => entry.tag !== tag)
    .slice(0, limit);
}

export function relatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  const tags = new Set(current.data.tags);
  return all
    .filter((post) => post.id !== current.id)
    .map((post) => ({ post, score: post.data.tags.filter((tag) => tags.has(tag)).length }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf())
    .slice(0, limit)
    .map(({ post }) => post);
}

export interface YearGroup {
  year: number;
  posts: Post[];
}

/** Groups already-sorted posts by publication year, newest year first. */
export function groupByYear(posts: Post[]): YearGroup[] {
  const groups = new Map<number, Post[]>();
  for (const post of posts) {
    const year = tokyoYear(post.data.pubDate);
    const list = groups.get(year) ?? [];
    list.push(post);
    groups.set(year, list);
  }
  return [...groups.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, posts: list }));
}

export function countByType(works: Work[]): Map<Work['data']['type'], number> {
  const counts = new Map<Work['data']['type'], number>();
  for (const work of works) counts.set(work.data.type, (counts.get(work.data.type) ?? 0) + 1);
  return counts;
}

/** Rough reading time in minutes: ~500 characters/min for Japanese, ~200 words/min otherwise. */
export function readingTime(body: string | undefined, locale: Locale): number {
  if (!body) return 1;
  const text = body.replace(/```[\s\S]*?```/g, ' ').replace(/<[^>]+>/g, ' ');
  if (locale === 'ja') {
    const chars = text.replace(/\s+/g, '').length;
    return Math.max(1, Math.ceil(chars / 500));
  }
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

const tokyo = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  timeZone: 'Asia/Tokyo',
});

/** Ledger date format, locale-independent: 2026.10.28 */
export function formatDate(date: Date): string {
  return tokyo.format(date).replace(/-/g, '.');
}

export function tokyoYear(date: Date): number {
  return Number(tokyo.format(date).slice(0, 4));
}

/** Splits long lists into chunks so an ad can sit between them. */
export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
