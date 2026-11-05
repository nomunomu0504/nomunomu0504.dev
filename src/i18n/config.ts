export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ja';

export const localeLabels: Record<Locale, string> = {
  ja: '日本語',
  en: 'English',
};

/** BCP 47 tags used for hreflang and og:locale. */
export const localeTags: Record<Locale, string> = {
  ja: 'ja-JP',
  en: 'en-US',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function resolveLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ja' ? 'en' : 'ja';
}

/**
 * Builds a site-relative href for the given locale.
 * The default locale has no prefix; others are prefixed (e.g. /en/blog/).
 * Trailing slashes are left exactly as given so file routes like /rss.xml stay intact.
 */
export function localeHref(locale: Locale, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (locale === defaultLocale) return normalized;
  return normalized === '/' ? `/${locale}/` : `/${locale}${normalized}`;
}

/** Maps the current pathname to its counterpart in every locale, assuming the page exists in both. */
export function defaultAlternates(pathname: string, current: Locale): Record<Locale, string> {
  const bare = current === defaultLocale ? pathname : pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return {
    ja: localeHref('ja', bare),
    en: localeHref('en', bare),
  };
}
