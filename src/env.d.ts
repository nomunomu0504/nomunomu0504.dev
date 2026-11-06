interface ImportMetaEnv {
  readonly SITE_URL?: string;
  readonly PUBLIC_GTM_ID?: string;
  readonly PUBLIC_ADSENSE_CLIENT?: string;
  readonly PUBLIC_ADSENSE_SLOT_LEADERBOARD?: string;
  readonly PUBLIC_ADSENSE_SLOT_IN_ARTICLE?: string;
  readonly PUBLIC_ADSENSE_SLOT_RECTANGLE?: string;
  readonly PUBLIC_ADSENSE_SLOT_SKYSCRAPER?: string;
  readonly PUBLIC_ADSENSE_SLOT_LIST?: string;
  readonly PUBLIC_GISCUS_REPO?: string;
  readonly PUBLIC_GISCUS_REPO_ID?: string;
  readonly PUBLIC_GISCUS_CATEGORY?: string;
  readonly PUBLIC_GISCUS_CATEGORY_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
