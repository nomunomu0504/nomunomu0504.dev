/**
 * Scaffolds content files with today's date and a draft flag.
 *
 *   bun run new:post <slug> [--title "..."] [--tags a,b] [--en]
 *   bun run new:work <slug> [--title "..."] [--type oss|app|saas|client|infra] [--en]
 *
 * --en also creates the English counterpart (same slug, so the locale switcher links them).
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    tags: { type: 'string' },
    type: { type: 'string', default: 'oss' },
    en: { type: 'boolean', default: false },
    description: { type: 'string', default: '' },
  },
});

const [kind, slug] = positionals;
if ((kind !== 'post' && kind !== 'work') || !slug) {
  console.error('usage: bun scripts/new.ts <post|work> <slug> [--title ...] [--tags a,b] [--type oss] [--en]');
  process.exit(1);
}
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(`slug must be kebab-case (got "${slug}")`);
  process.exit(1);
}

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
const title = values.title ?? slug;
const tags = (values.tags ?? '')
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean);
const quote = (text: string) => `"${text.replace(/"/g, '\\"')}"`;
const list = (items: string[]) => `[${items.map(quote).join(', ')}]`;

function postBody(locale: 'ja' | 'en'): string {
  const lines = [
    '---',
    `title: ${quote(title)}`,
    `description: ${quote(values.description)}`,
    `pubDate: ${today}`,
    `tags: ${list(tags)}`,
    'draft: true',
    '---',
    '',
    locale === 'ja' ? '## はじめに' : '## Introduction',
    '',
    '',
  ];
  return lines.join('\n');
}

function workBody(locale: 'ja' | 'en'): string {
  const lines = [
    '---',
    `title: ${quote(title)}`,
    `description: ${quote(values.description)}`,
    `date: ${today}`,
    `type: ${values.type}`,
    'kind: ""',
    'status: ""',
    'active: false',
    'period: ""',
    'role: ""',
    'stack: []',
    'links:',
    '  github: ""',
    'featured: false',
    'order: 100',
    '---',
    '',
    locale === 'ja' ? '## 概要' : '## Overview',
    '',
    '',
    locale === 'ja' ? '## 技術的なポイント' : '## Technical notes',
    '',
    '',
  ];
  return lines.join('\n');
}

const collection = kind === 'post' ? 'blog' : 'works';
const locales: ('ja' | 'en')[] = values.en ? ['ja', 'en'] : ['ja'];
for (const locale of locales) {
  const dir = resolve(import.meta.dirname, '..', 'src', 'content', collection, locale);
  const file = resolve(dir, `${slug}.md`);
  if (existsSync(file)) {
    console.error(`exists: ${file}`);
    process.exit(1);
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(file, kind === 'post' ? postBody(locale) : workBody(locale));
  console.log(`created src/content/${collection}/${locale}/${slug}.md`);
}
