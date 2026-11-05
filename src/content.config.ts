import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { workTypes } from '@/lib/work-types';

// Entries live under src/content/<collection>/<locale>/<slug>.md
// so the entry id encodes the locale ("ja/hello-world").
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
});

const works = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      /** Category shown as the first half of the meta line ("OSS · RUST"). */
      type: z.enum(workTypes).default('oss'),
      /** Second half of the meta line, free text ("RUST", "FLUTTER", "HOMELAB"). */
      kind: z.string().optional(),
      /** Right side of the meta line ("v1.x", "BETA", "iOS / Android"). */
      status: z.string().optional(),
      /** Draws the accent dot next to the status. */
      active: z.boolean().default(false),
      period: z.string().optional(),
      role: z.string().optional(),
      license: z.string().optional(),
      stack: z.array(z.string()).default([]),
      links: z
        .object({
          github: z.url().optional(),
          website: z.url().optional(),
          appStore: z.url().optional(),
          playStore: z.url().optional(),
          other: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
        })
        .default({ other: [] }),
      featured: z.boolean().default(false),
      order: z.number().default(100),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      screenshots: z.array(z.object({ src: image(), alt: z.string().default('') })).default([]),
      /** Slug of a related blog post in the same locale. */
      relatedPost: z.string().optional(),
    }),
});

export const collections = { blog, works };
