/**
 * JSON-LD (schema.org) builders. BaseLayout emits one graph per page: WebSite and Person on every
 * page, plus the nodes a view passes in (BlogPosting, BreadcrumbList, software, ProfilePage).
 * Node ids are absolute URLs so nodes can point at each other inside the graph.
 */
import { localeHref, localeTags, type Locale } from '@/i18n/config';
import { site } from '@/lib/site';
import type { WorkType } from '@/lib/work-types';

export type SchemaNode = Record<string, unknown>;

const abs = (siteUrl: URL, path: string): string => new URL(path, siteUrl).toString();
export const personId = (siteUrl: URL): string => abs(siteUrl, '/#person');
export const websiteId = (siteUrl: URL): string => abs(siteUrl, '/#website');

const company: Record<Locale, string> = { ja: '株式会社みらいスタジオ', en: 'Mirai Studio Inc.' };

export function personNode(siteUrl: URL, locale: Locale): SchemaNode {
  return {
    '@type': 'Person',
    '@id': personId(siteUrl),
    name: locale === 'ja' ? site.nameJa : site.name,
    alternateName: locale === 'ja' ? site.name : site.nameJa,
    url: abs(siteUrl, localeHref(locale, '/about/')),
    jobTitle: 'CTO',
    worksFor: { '@type': 'Organization', name: company[locale], url: site.companyUrl },
    sameAs: Object.values(site.social),
  };
}

export function websiteNode(siteUrl: URL, locale: Locale): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': websiteId(siteUrl),
    url: siteUrl.toString(),
    name: site.name,
    description: site.description[locale],
    inLanguage: localeTags[locale],
    publisher: { '@id': personId(siteUrl) },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbNode(siteUrl: URL, crumbs: Crumb[]): SchemaNode {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: abs(siteUrl, crumb.path),
    })),
  };
}

export interface ArticleInput {
  path: string;
  title: string;
  description: string;
  published: Date;
  updated?: Date;
  /** Site-relative image path (the generated OG image). */
  image: string;
  tags: string[];
  locale: Locale;
}

export function blogPostingNode(siteUrl: URL, article: ArticleInput): SchemaNode {
  const url = abs(siteUrl, article.path);
  return {
    '@type': 'BlogPosting',
    '@id': url,
    mainEntityOfPage: url,
    url,
    headline: article.title,
    description: article.description,
    image: abs(siteUrl, article.image),
    datePublished: article.published.toISOString(),
    dateModified: (article.updated ?? article.published).toISOString(),
    inLanguage: localeTags[article.locale],
    ...(article.tags.length > 0 ? { keywords: article.tags.join(', ') } : {}),
    author: { '@id': personId(siteUrl) },
    publisher: { '@id': personId(siteUrl) },
    isPartOf: { '@id': websiteId(siteUrl) },
  };
}

export interface SoftwareInput {
  path: string;
  name: string;
  description: string;
  image: string;
  type: WorkType;
  /** Reference pages about the project: website, repository, store listings. */
  sameAs: string[];
  github?: string;
}

/** OSS becomes SoftwareSourceCode, apps and SaaS SoftwareApplication, the rest CreativeWork. */
export function softwareNode(siteUrl: URL, work: SoftwareInput): SchemaNode {
  const url = abs(siteUrl, work.path);
  const common = {
    '@id': url,
    url,
    name: work.name,
    description: work.description,
    image: abs(siteUrl, work.image),
    author: { '@id': personId(siteUrl) },
    ...(work.sameAs.length > 0 ? { sameAs: work.sameAs } : {}),
  };
  if (work.type === 'oss') {
    return { '@type': 'SoftwareSourceCode', ...common, ...(work.github ? { codeRepository: work.github } : {}) };
  }
  if (work.type === 'app' || work.type === 'saas') {
    return { '@type': 'SoftwareApplication', ...common };
  }
  return { '@type': 'CreativeWork', ...common };
}

export function profilePageNode(siteUrl: URL, path: string): SchemaNode {
  const url = abs(siteUrl, path);
  return { '@type': 'ProfilePage', '@id': url, url, mainEntity: { '@id': personId(siteUrl) } };
}

/** One <script type="application/ld+json"> body. "<" is escaped so content can never close the tag. */
export function serialize(nodes: SchemaNode[]): string {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
