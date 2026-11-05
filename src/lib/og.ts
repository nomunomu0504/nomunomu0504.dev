/**
 * Build-time Open Graph images in the Ledger style, rendered with satori + resvg.
 * Fonts are vendored under src/assets/og-fonts (see scripts/og-fonts.py); Noto Sans JP is
 * split into unicode-range subsets, so only the subsets covering the rendered text are loaded.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { localeHref, type Locale } from '@/i18n/config';

export interface OgInput {
  title: string;
  /** Mono line at the top, e.g. "BLOG". */
  section: string;
  /** Mono line bottom-left, e.g. "2026.10.28 · #astro". */
  meta: string;
  /** Mono line bottom-right, e.g. "Hiroki Nomura · CTO, MIRAI STUDIO". */
  footer: string;
  /** Brand shown next to the accent dot. */
  brand: string;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const FONT_DIR = resolve(process.cwd(), 'src/assets/og-fonts');

interface Subset {
  file: string;
  ranges: [number, number][];
}

let subsets: Subset[] | undefined;
const fontCache = new Map<string, Buffer>();

function loadFont(path: string): Buffer {
  let data = fontCache.get(path);
  if (!data) {
    data = readFileSync(resolve(FONT_DIR, path));
    fontCache.set(path, data);
  }
  return data;
}

/** Parses the Fontsource CSS into file → unicode ranges. */
function notoSubsets(): Subset[] {
  if (subsets) return subsets;
  const css = readFileSync(resolve(FONT_DIR, 'noto-sans-jp/700.css'), 'utf8');
  subsets = [];
  for (const block of css.split('@font-face').slice(1)) {
    const file = /url\(\.\/files\/([^)]+\.woff2)\)/.exec(block)?.[1];
    const range = /unicode-range:\s*([^;]+);/.exec(block)?.[1];
    if (!file || !range) continue;
    const ranges: [number, number][] = [];
    for (const part of range.split(',')) {
      const m = /U\+([0-9A-Fa-f]+)(?:-([0-9A-Fa-f]+))?/.exec(part.trim());
      if (!m) continue;
      const start = parseInt(m[1], 16);
      ranges.push([start, m[2] ? parseInt(m[2], 16) : start]);
    }
    subsets.push({ file, ranges });
  }
  return subsets;
}

/** Noto Sans JP subset files that cover at least one character of `text`. */
function subsetsFor(text: string): string[] {
  const needed = new Set<string>();
  const all = notoSubsets();
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x80) continue;
    const hit = all.find((subset) => subset.ranges.some(([a, b]) => code >= a && code <= b));
    if (hit) needed.add(hit.file);
  }
  return [...needed];
}

const C = {
  bg: '#f6f6f3',
  fg: '#161718',
  fg2: '#5b5e63',
  fg3: '#63666c',
  rule: '#d9d9d3',
  rule2: '#c4c4bd',
  accent: '#117a46',
  accentInk: '#0d6139',
};

function titleSize(title: string): number {
  const n = [...title].length;
  if (n <= 22) return 66;
  if (n <= 36) return 58;
  if (n <= 52) return 50;
  return 44;
}

function clamp(text: string, max: number): string {
  const chars = [...text];
  return chars.length > max ? `${chars.slice(0, max - 1).join('')}…` : text;
}

// satori accepts plain React-like element objects; every multi-child node needs display: flex.
const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({
  type,
  props: { style, children },
});

export async function renderOgSvg(input: OgInput): Promise<string> {
  const title = clamp(input.title, 72);
  const text = `${title}${input.section}${input.meta}${input.footer}${input.brand}`;
  const fonts = [
    { name: 'Geist', data: loadFont('geist-latin-700-normal.woff2'), weight: 700 as const, style: 'normal' as const },
    { name: 'Geist Mono', data: loadFont('geist-mono-latin-wght-normal.woff2'), weight: 400 as const, style: 'normal' as const },
    ...subsetsFor(text).map((file) => ({
      name: `Noto Sans JP ${file.replace(/\D/g, '') || 'x'}`,
      data: loadFont(`noto-sans-jp/${file}`),
      weight: 700 as const,
      style: 'normal' as const,
    })),
  ];
  const families = fonts.map((font) => font.name).join(', ');

  const mono = { fontFamily: 'Geist Mono', fontSize: 22, letterSpacing: 0.5 };
  // satori sizes `height` as content-box, so the padded frame lives on an inner flex: 1 wrapper.
  const tree = h(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      background: C.bg,
      color: C.fg,
      fontFamily: families,
    },
    h(
      'div',
      {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '56px 64px 48px',
      },
      [
      h('div', { display: 'flex', alignItems: 'center', gap: 16, ...mono, color: C.accentInk }, [
        h('div', { width: 12, height: 12, borderRadius: 6, background: C.accent }),
        h('div', {}, input.brand),
        h('div', { width: 32, height: 1, background: C.rule2 }),
        h('div', {}, input.section),
      ]),
      h('div', { display: 'flex', alignItems: 'center', padding: '24px 0' }, [
        h(
          'div',
          {
            fontSize: titleSize(title),
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: -1.2,
            maxWidth: 1040,
            textWrap: 'balance',
          },
          title,
        ),
      ]),
      h(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          flexShrink: 0,
          paddingTop: 24,
          borderTop: `1px solid ${C.rule}`,
          ...mono,
          color: C.fg3,
        },
        [h('div', {}, input.meta), h('div', {}, input.footer)],
      ),
    ],
    ),
  );

  return satori(tree as Parameters<typeof satori>[0], { width: OG_WIDTH, height: OG_HEIGHT, fonts });
}

export async function renderOg(input: OgInput): Promise<Buffer> {
  const svg = await renderOgSvg(input);
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}

/** Site-relative path of the generated image for a post or project. */
export function ogImagePath(locale: Locale, kind: 'blog' | 'works', slug: string): string {
  return `/og${localeHref(locale, `/${kind}/${slug}`)}.png`;
}
