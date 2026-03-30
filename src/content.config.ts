import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// ── Starlight docs (stays until Phase 3 Grove migration) ──
const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

// ── Authors ──
const authors = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    avatar: z.string(),
    linkedin: z.string().optional(),
    twitter: z.string().optional(),
    bio: z.string().optional(),
  }),
});

// ── Blog ──
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(), // Will become reference('authors') after author MDX files are created
    authorRole: z.string().optional(),
    category: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// ── Future Collections (schemas ready, content empty) ──

const customers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/customers' }),
  schema: z.object({
    name: z.string(),
    industry: z.enum(['consulting', 'it-services', 'agency', 'other']),
    logo: z.string(),
    logoWidth: z.number().default(120),
    metrics: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    quote: z.string().optional(),
    quoteAuthor: z.string().optional(),
    quoteRole: z.string().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(false),
  }),
});

const integrations = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/integrations' }),
  schema: z.object({
    name: z.string(),
    category: z.enum(['crm', 'accounting', 'communication', 'project-management', 'other']),
    logo: z.string(),
    docsUrl: z.string().optional(),
    description: z.string(),
    status: z.enum(['available', 'coming-soon', 'beta']).default('coming-soon'),
  }),
});

const press = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/press' }),
  schema: z.object({
    publication: z.string(),
    headline: z.string(),
    url: z.string(),
    date: z.string(),
    logo: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { docs, authors, blog, customers, integrations, press };
