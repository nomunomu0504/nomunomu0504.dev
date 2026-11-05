/**
 * Detection rules for Home · 02 Stack. A rule matches a repository when any of its
 * conditions hold: a GitHub-detected language, a file path pattern, or a dependency
 * name from a manifest (npm = package.json, pub = pubspec.yaml, cargo = Cargo.toml,
 * go = go.mod, pip = pyproject.toml / requirements.txt).
 */
export type Group = 'LANGUAGES' | 'FRAMEWORKS' | 'CLOUD · INFRA' | 'DATA · SERVICES';

export interface Rule {
  name: string;
  /** Two-letter abbreviation drawn in the small box. */
  ab: string;
  group: Group;
  languages?: string[];
  files?: RegExp[];
  deps?: Partial<Record<'npm' | 'pub' | 'cargo' | 'go' | 'pip', string[]>>;
}

export const groups: Group[] = ['LANGUAGES', 'FRAMEWORKS', 'CLOUD · INFRA', 'DATA · SERVICES'];

export const rules: Rule[] = [
  // Languages (GitHub linguist names)
  { name: 'Dart', ab: 'Da', group: 'LANGUAGES', languages: ['Dart'], files: [/(^|\/)pubspec\.yaml$/] },
  { name: 'TypeScript', ab: 'TS', group: 'LANGUAGES', languages: ['TypeScript'], files: [/(^|\/)tsconfig\.json$/] },
  { name: 'JavaScript', ab: 'JS', group: 'LANGUAGES', languages: ['JavaScript'] },
  { name: 'Rust', ab: 'Rs', group: 'LANGUAGES', languages: ['Rust'], files: [/(^|\/)Cargo\.toml$/] },
  { name: 'Go', ab: 'Go', group: 'LANGUAGES', languages: ['Go'], files: [/(^|\/)go\.mod$/] },
  { name: 'Python', ab: 'Py', group: 'LANGUAGES', languages: ['Python'], files: [/(^|\/)(pyproject\.toml|requirements\.txt)$/] },
  { name: 'Swift', ab: 'Sw', group: 'LANGUAGES', languages: ['Swift'] },
  { name: 'Kotlin', ab: 'Kt', group: 'LANGUAGES', languages: ['Kotlin'] },
  { name: 'Shell', ab: 'Sh', group: 'LANGUAGES', languages: ['Shell'] },

  // Frameworks
  { name: 'Flutter', ab: 'Fl', group: 'FRAMEWORKS', deps: { pub: ['flutter'] } },
  { name: 'Riverpod', ab: 'Rv', group: 'FRAMEWORKS', deps: { pub: ['riverpod', 'flutter_riverpod', 'hooks_riverpod'] } },
  { name: 'Astro', ab: 'As', group: 'FRAMEWORKS', deps: { npm: ['astro'] } },
  { name: 'Hono', ab: 'Ho', group: 'FRAMEWORKS', deps: { npm: ['hono'] } },
  { name: 'Next.js', ab: 'Nx', group: 'FRAMEWORKS', deps: { npm: ['next'] } },
  { name: 'React', ab: 'Re', group: 'FRAMEWORKS', deps: { npm: ['react'] } },
  { name: 'Vue', ab: 'Vu', group: 'FRAMEWORKS', deps: { npm: ['vue', 'nuxt'] } },
  { name: 'Express', ab: 'Ex', group: 'FRAMEWORKS', deps: { npm: ['express'] } },
  { name: 'NestJS', ab: 'Ne', group: 'FRAMEWORKS', deps: { npm: ['@nestjs/core'] } },
  { name: 'tonic / tokio', ab: 'to', group: 'FRAMEWORKS', deps: { cargo: ['tonic', 'tokio'] } },
  { name: 'Axum', ab: 'Ax', group: 'FRAMEWORKS', deps: { cargo: ['axum'] } },
  { name: 'Tauri', ab: 'Ta', group: 'FRAMEWORKS', deps: { cargo: ['tauri'] } },
  { name: 'FastAPI', ab: 'FA', group: 'FRAMEWORKS', deps: { pip: ['fastapi'] } },
  { name: 'Django', ab: 'Dj', group: 'FRAMEWORKS', deps: { pip: ['django'] } },

  // Cloud · Infra
  { name: 'GitHub Actions', ab: 'GA', group: 'CLOUD · INFRA', files: [/^\.github\/workflows\/.+\.ya?ml$/] },
  { name: 'Docker', ab: 'Dk', group: 'CLOUD · INFRA', files: [/(^|\/)(Dockerfile|docker-compose\.ya?ml|compose\.ya?ml)$/] },
  { name: 'AWS CDK', ab: 'CDK', group: 'CLOUD · INFRA', files: [/(^|\/)cdk\.json$/], deps: { npm: ['aws-cdk-lib', '@aws-cdk/core'] } },
  { name: 'Cloudflare Workers', ab: 'CF', group: 'CLOUD · INFRA', files: [/(^|\/)wrangler\.(toml|jsonc?)$/], deps: { npm: ['wrangler', '@cloudflare/workers-types'] } },
  { name: 'Terraform', ab: 'Tf', group: 'CLOUD · INFRA', files: [/\.tf$/] },
  { name: 'Fastlane', ab: 'fl', group: 'CLOUD · INFRA', files: [/(^|\/)fastlane\/Fastfile$/] },
  { name: 'Vercel', ab: 'Vc', group: 'CLOUD · INFRA', files: [/(^|\/)vercel\.json$/], deps: { npm: ['vercel'] } },

  // Data · Services
  { name: 'PostgreSQL', ab: 'Pg', group: 'DATA · SERVICES', deps: { npm: ['pg', 'postgres', '@neondatabase/serverless', 'drizzle-orm', 'prisma', '@prisma/client', 'kysely'], cargo: ['sqlx', 'tokio-postgres', 'diesel'], go: ['github.com/jackc/pgx', 'github.com/lib/pq'], pip: ['psycopg2', 'psycopg', 'asyncpg'], pub: ['postgres'] } },
  { name: 'Firestore', ab: 'Fs', group: 'DATA · SERVICES', deps: { pub: ['cloud_firestore', 'firebase_core'], npm: ['firebase', 'firebase-admin', '@google-cloud/firestore'], pip: ['firebase-admin', 'google-cloud-firestore'] } },
  { name: 'Neon', ab: 'Ne', group: 'DATA · SERVICES', deps: { npm: ['@neondatabase/serverless'] } },
  { name: 'S3 / R2', ab: 'S3', group: 'DATA · SERVICES', deps: { npm: ['@aws-sdk/client-s3', 'aws-sdk'], pip: ['boto3'], go: ['github.com/aws/aws-sdk-go-v2/service/s3', 'github.com/aws/aws-sdk-go'], cargo: ['aws-sdk-s3'] } },
  { name: 'Redis', ab: 'Rd', group: 'DATA · SERVICES', deps: { npm: ['redis', 'ioredis', '@upstash/redis'], pip: ['redis'], go: ['github.com/redis/go-redis'], cargo: ['redis'] } },
  { name: 'Supabase', ab: 'Sb', group: 'DATA · SERVICES', deps: { npm: ['@supabase/supabase-js'], pub: ['supabase_flutter'] } },
  { name: 'SQLite / D1', ab: 'SQ', group: 'DATA · SERVICES', deps: { npm: ['better-sqlite3', '@libsql/client'], pub: ['sqflite', 'drift'], cargo: ['rusqlite'] } },
  { name: 'Stripe', ab: 'St', group: 'DATA · SERVICES', deps: { npm: ['stripe'], pip: ['stripe'], go: ['github.com/stripe/stripe-go'] } },
];
