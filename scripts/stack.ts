/**
 * Regenerates src/data/stack.ts (Home · 02 Stack) from public GitHub repositories.
 *
 *   bun run stack                       # uses GITHUB_TOKEN, else `gh auth token`, else anonymous (60 req/h)
 *   bun run stack --dry-run             # print the result without writing src/data/stack.ts
 *   STACK_REPOS=a,owner/b bun run stack # scan exactly these repositories
 *
 * Per repository: one Git Trees call (file paths), one Languages call, and raw fetches of the
 * manifests found in the tree. Rules live in scripts/stack-rules.ts, filters in stack.config.ts.
 */
import { spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { stackConfig as config } from './stack.config';
import { groups, rules, type Group } from './stack-rules';

interface Repo {
  full_name: string;
  name: string;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
  default_branch: string;
}

type DepKind = 'npm' | 'pub' | 'cargo' | 'go' | 'pip';
type Deps = Record<DepKind, Set<string>>;

const API = 'https://api.github.com';
const token = resolveToken();
const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'nomunomu0504-stack-script',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
};

function resolveToken(): string | undefined {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  const gh = spawnSync('gh', ['auth', 'token'], { encoding: 'utf8' });
  if (gh.status === 0 && gh.stdout.trim()) return gh.stdout.trim();
  console.warn('stack: no GITHUB_TOKEN and gh is not logged in; using the anonymous rate limit');
  return undefined;
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${path}`);
  return (await res.json()) as T;
}

async function raw(repo: Repo, path: string): Promise<string | undefined> {
  const res = await fetch(`https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/${path}`, {
    headers: { 'User-Agent': headers['User-Agent'], ...(token ? { Authorization: `token ${token}` } : {}) },
  });
  return res.ok ? res.text() : undefined;
}

function qualify(name: string): string {
  return name.includes('/') ? name : `${config.user}/${name}`;
}

/** "owner/name" for every links.github that points at a repository in the Works entries. */
function reposFromWorks(): string[] {
  const root = resolve(import.meta.dirname, '..', 'src', 'content', 'works');
  const found = new Set<string>();
  for (const locale of readdirSync(root, { withFileTypes: true }).filter((d) => d.isDirectory())) {
    const dir = resolve(root, locale.name);
    for (const file of readdirSync(dir).filter((f) => /\.mdx?$/.test(f))) {
      const front = /^---\n([\s\S]*?)\n---/.exec(readFileSync(resolve(dir, file), 'utf8'))?.[1] ?? '';
      const m = /^\s*github:\s*["']?https:\/\/github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?["']?\s*$/m.exec(front);
      if (m) found.add(`${m[1]}/${m[2]}`);
    }
  }
  return [...found];
}

/** Explicit list: STACK_REPOS env, else config.repos plus Works-derived repos; empty means discovery. */
function explicitRepos(): string[] {
  const fromEnv = (process.env.STACK_REPOS ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  if (fromEnv.length > 0) return fromEnv.map(qualify);
  const listed = [...config.repos, ...(config.reposFromWorks ? reposFromWorks() : [])].map(qualify);
  return [...new Set(listed)];
}

async function listRepos(): Promise<Repo[]> {
  const explicit = explicitRepos();
  if (explicit.length > 0) {
    const repos: Repo[] = [];
    for (const full of explicit) {
      try {
        repos.push(await api<Repo>(`/repos/${full}`));
      } catch (error) {
        console.warn(`stack: skipping ${full} (${error instanceof Error ? error.message : String(error)})`);
      }
    }
    return repos;
  }
  const since = Date.parse(config.since);
  const all: Repo[] = [];
  for (let page = 1; page <= 5; page += 1) {
    const batch = await api<Repo[]>(`/users/${config.user}/repos?per_page=100&type=owner&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  const picked = all.filter(
    (repo) =>
      (config.includeForks || !repo.fork) &&
      !repo.archived &&
      Date.parse(repo.pushed_at) >= since &&
      !config.exclude.includes(repo.name),
  );
  for (const full of config.extraRepos) {
    const repo = await api<Repo>(`/repos/${full}`);
    if (!picked.some((r) => r.full_name === repo.full_name)) picked.push(repo);
  }
  return picked;
}

const MANIFESTS: { kind: DepKind; test: RegExp }[] = [
  { kind: 'npm', test: /(^|\/)package\.json$/ },
  { kind: 'pub', test: /(^|\/)pubspec\.yaml$/ },
  { kind: 'cargo', test: /(^|\/)Cargo\.toml$/ },
  { kind: 'go', test: /(^|\/)go\.mod$/ },
  { kind: 'pip', test: /(^|\/)(pyproject\.toml|requirements\.txt)$/ },
];
const SKIP_DIRS = /(^|\/)(node_modules|vendor|\.dart_tool|build|dist|target|third_party)\//;
const MAX_MANIFESTS = 20;

function parseDeps(kind: DepKind, text: string, into: Set<string>): void {
  switch (kind) {
    case 'npm': {
      try {
        const json = JSON.parse(text) as Record<string, Record<string, string> | undefined>;
        for (const key of ['dependencies', 'devDependencies', 'peerDependencies']) {
          for (const name of Object.keys(json[key] ?? {})) into.add(name);
        }
      } catch {
        // malformed package.json; ignore
      }
      break;
    }
    case 'pub': {
      // Keys indented by exactly two spaces under dependencies:/dev_dependencies:
      let inDeps = false;
      for (const line of text.split('\n')) {
        if (/^(dependencies|dev_dependencies|dependency_overrides):/.test(line)) inDeps = true;
        else if (/^\S/.test(line)) inDeps = false;
        else if (inDeps) {
          const m = /^  ([A-Za-z0-9_]+):/.exec(line);
          if (m) into.add(m[1]);
        }
      }
      break;
    }
    case 'cargo': {
      let inDeps = false;
      for (const line of text.split('\n')) {
        const section = /^\s*\[([^\]]+)\]/.exec(line);
        if (section) {
          const name = section[1];
          inDeps = /(^|\.)(dependencies|dev-dependencies|build-dependencies)$/.test(name);
          const dotted = /(?:^|\.)(?:dependencies|dev-dependencies|build-dependencies)\.([A-Za-z0-9_-]+)$/.exec(name);
          if (dotted) into.add(dotted[1]);
          continue;
        }
        if (inDeps) {
          const m = /^\s*([A-Za-z0-9_-]+)\s*=/.exec(line);
          if (m) into.add(m[1]);
        }
      }
      break;
    }
    case 'go': {
      for (const m of text.matchAll(/^\s*(?:require\s+)?([a-z0-9.\-]+\.[a-z]+\/[^\s]+)\s+v/gm)) into.add(m[1]);
      break;
    }
    case 'pip': {
      for (const line of text.split('\n')) {
        const m = /^\s*"?([A-Za-z0-9_.-]+)/.exec(line);
        if (m && !/^(\[|#|-)/.test(line.trim())) into.add(m[1].toLowerCase());
      }
      break;
    }
  }
}

function depMatches(deps: Deps, wanted: NonNullable<(typeof rules)[number]['deps']>): boolean {
  return (Object.entries(wanted) as [DepKind, string[]][]).some(([kind, names]) =>
    names.some((name) => {
      if (kind === 'go') return [...deps.go].some((dep) => dep === name || dep.startsWith(`${name}/`));
      return deps[kind].has(kind === 'pip' ? name.toLowerCase() : name);
    }),
  );
}

async function scan(repo: Repo): Promise<Set<string>> {
  const tree = await api<{ tree: { path: string; type: string }[] }>(
    `/repos/${repo.full_name}/git/trees/${repo.default_branch}?recursive=1`,
  );
  const paths = tree.tree.filter((e) => e.type === 'blob' && !SKIP_DIRS.test(e.path)).map((e) => e.path);
  const languages = await api<Record<string, number>>(`/repos/${repo.full_name}/languages`);
  const total = Object.values(languages).reduce((a, b) => a + b, 0) || 1;
  const langs = new Set(Object.entries(languages).filter(([, bytes]) => bytes / total >= 0.05).map(([name]) => name));

  const deps: Deps = { npm: new Set(), pub: new Set(), cargo: new Set(), go: new Set(), pip: new Set() };
  const manifests = paths
    .flatMap((path) => MANIFESTS.filter((m) => m.test.test(path)).map((m) => ({ kind: m.kind, path })))
    .slice(0, MAX_MANIFESTS);
  await Promise.all(
    manifests.map(async ({ kind, path }) => {
      const text = await raw(repo, path);
      if (text) parseDeps(kind, text, deps[kind]);
    }),
  );

  const matched = new Set<string>();
  for (const rule of rules) {
    const byLanguage = rule.languages?.some((l) => langs.has(l)) ?? false;
    const byFile = rule.files?.some((re) => paths.some((p) => re.test(p))) ?? false;
    const byDep = rule.deps ? depMatches(deps, rule.deps) : false;
    if (byLanguage || byFile || byDep) matched.add(rule.name);
  }
  return matched;
}

function render(counts: Map<string, number>, repos: number): string {
  const byGroup = new Map<Group, { name: string; ab: string; count: number }[]>(groups.map((g) => [g, []]));
  for (const rule of rules) {
    const count = counts.get(rule.name) ?? 0;
    if (count > 0) byGroup.get(rule.group)!.push({ name: rule.name, ab: rule.ab, count });
  }
  for (const item of config.manual) {
    const list = byGroup.get(item.group as Group);
    if (list && !list.some((i) => i.name === item.name)) list.push({ name: item.name, ab: item.ab, count: item.count });
  }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Tokyo' }).format(new Date());
  const lines: string[] = [
    '/**',
    ' * Home · 02 Stack. GENERATED by scripts/stack.ts — do not edit by hand.',
    ` * Source: repositories selected in scripts/stack.config.ts (owner: ${config.user}).`,
    ' */',
    'export interface StackItem {',
    '  name: string;',
    '  /** Two-letter abbreviation drawn in the small box. */',
    '  ab: string;',
    '  /** Number of repositories using it. */',
    '  count: number;',
    '}',
    '',
    'export interface StackGroup {',
    '  label: string;',
    '  items: StackItem[];',
    '}',
    '',
    'export const stack = {',
    '  generated: true,',
    `  updated: '${today}',`,
    `  repos: ${repos},`,
    '  groups: [',
  ];
  for (const group of groups) {
    const items = (byGroup.get(group) ?? []).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, config.perGroup);
    if (items.length === 0) continue;
    lines.push('    {', `      label: '${group}',`, '      items: [');
    for (const item of items) lines.push(`        { name: '${item.name.replace(/'/g, "\\'")}', ab: '${item.ab}', count: ${item.count} },`);
    lines.push('      ],', '    },');
  }
  lines.push('  ] satisfies StackGroup[],', '};', '');
  return lines.join('\n');
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const repos = await listRepos();
  const mode = explicitRepos().length > 0 ? 'explicit list' : 'discovery';
  console.log(`stack: scanning ${repos.length} repositories (${mode}${token ? '' : ', anonymous'})`);
  const counts = new Map<string, number>();
  let scanned = 0;
  for (const repo of repos) {
    try {
      const matched = await scan(repo);
      scanned += 1;
      for (const name of matched) counts.set(name, (counts.get(name) ?? 0) + 1);
      console.log(`  ${repo.full_name.padEnd(42)} ${[...matched].join(', ') || '-'}`);
    } catch (error) {
      console.warn(`  ${repo.full_name.padEnd(42)} skipped: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  if (scanned === 0) throw new Error('no repositories could be scanned');
  const output = render(counts, scanned);
  if (dryRun) {
    console.log(`stack: dry run, ${scanned} repos, ${counts.size} items matched\n`);
    console.log(output);
    return;
  }
  writeFileSync(resolve(import.meta.dirname, '..', config.output), output);
  console.log(`stack: wrote ${config.output} (${scanned} repos, ${counts.size} items matched)`);
}

main().catch((error) => {
  console.error(`stack: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
