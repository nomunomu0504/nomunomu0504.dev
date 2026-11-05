/** Which repositories feed Home · 02 Stack, plus anything the scanner cannot see. */
export const stackConfig = {
  user: 'nomunomu0504',

  /**
   * Take repositories from the Works entries (links.github in src/content/works/<locale>/*.md),
   * so the Stack follows whatever is published as a project. Combined with `repos` below.
   */
  reposFromWorks: false,
  /**
   * Explicit repositories to scan: "name" for your own account, "owner/name" for others.
   * When this list plus the Works-derived list is non-empty, it is used as-is and the discovery
   * filters below are ignored. Private repositories work when the token can read them (locally
   * via `gh auth token`; in CI set the STACK_GITHUB_TOKEN secret to a PAT with repo read access).
   * Ad-hoc override without editing this file: STACK_REPOS=a,b,owner/c bun run stack
   */
  repos: [
    'sub-screen-player',
    'forecall/forecall-cli',
    'forecall/forecall-mcp',
    'hidane-dev/hidane',
    'hidane-dev/setup-hidane',
  ] as string[],

  // ---- Discovery mode (only when `repos` is empty) ----------------------------------------
  /** Forks are skipped; they rarely reflect what you actually use. */
  includeForks: false,
  /** Only repositories pushed on or after this date are counted. */
  since: '2022-01-01',
  /** Repository names to skip even if they match the filters above. */
  exclude: ['homebrew-tap', 'scoop-bucket', 'nomunomu0504', 'Zenn.dev-Content-public'] as string[],
  /** Repositories outside the account to add to discovery, as "owner/name". */
  extraRepos: [] as string[],

  // ---- Output -----------------------------------------------------------------------------
  /** Items the scanner cannot derive from manifests (infra that lives outside git). */
  manual: [{ name: 'Proxmox · LXC', ab: 'Px', group: 'CLOUD · INFRA', count: 1 }] as {
    name: string;
    ab: string;
    group: string;
    count: number;
  }[],
  /** Items shown per column. */
  perGroup: 5,
  /** Write target. */
  output: 'src/data/stack.ts',
};
