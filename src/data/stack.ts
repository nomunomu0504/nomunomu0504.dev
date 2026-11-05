/**
 * Home · 02 Stack. Intended to be regenerated at build time from public repos
 * (pubspec.yaml, package.json, Cargo.toml, go.mod, cdk.json, Dockerfile, workflows).
 * Until that script exists, `generated` stays false and the page labels the data as a sample.
 */
export interface StackItem {
  name: string;
  /** Two-letter abbreviation drawn in the small box. */
  ab: string;
  /** Number of repositories using it. */
  count: number;
}

export interface StackGroup {
  label: string;
  items: StackItem[];
}

export const stack = {
  generated: false,
  updated: '2026-11-01',
  repos: 12,
  groups: [
    {
      label: 'LANGUAGES',
      items: [
        { name: 'Dart', ab: 'Da', count: 7 },
        { name: 'TypeScript', ab: 'TS', count: 6 },
        { name: 'Rust', ab: 'Rs', count: 3 },
        { name: 'Go', ab: 'Go', count: 2 },
        { name: 'Python', ab: 'Py', count: 2 },
      ],
    },
    {
      label: 'FRAMEWORKS',
      items: [
        { name: 'Flutter', ab: 'Fl', count: 7 },
        { name: 'Riverpod', ab: 'Rv', count: 5 },
        { name: 'Astro', ab: 'As', count: 2 },
        { name: 'Hono', ab: 'Ho', count: 2 },
        { name: 'tonic / tokio', ab: 'to', count: 2 },
      ],
    },
    {
      label: 'CLOUD · INFRA',
      items: [
        { name: 'GitHub Actions', ab: 'GA', count: 11 },
        { name: 'Docker', ab: 'Dk', count: 9 },
        { name: 'AWS CDK', ab: 'CDK', count: 5 },
        { name: 'Cloudflare Workers', ab: 'CF', count: 4 },
        { name: 'Proxmox · LXC', ab: 'Px', count: 1 },
      ],
    },
    {
      label: 'DATA · SERVICES',
      items: [
        { name: 'PostgreSQL', ab: 'Pg', count: 6 },
        { name: 'Firestore', ab: 'Fs', count: 3 },
        { name: 'Neon', ab: 'Ne', count: 2 },
        { name: 'S3 / R2', ab: 'S3', count: 4 },
        { name: 'Redis', ab: 'Rd', count: 1 },
      ],
    },
  ] satisfies StackGroup[],
};
