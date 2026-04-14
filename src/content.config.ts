import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Help docs (Grove — replaces Starlight) ──
const docs = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/docs/help' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    badge: z.object({
      text: z.string(),
      variant: z.enum(['note', 'success', 'caution', 'danger']).default('note'),
    }).optional(),
    hero: z.object({
      tagline: z.string().optional(),
      actions: z.array(z.object({
        text: z.string(),
        link: z.string(),
        icon: z.string().optional(),
        variant: z.string().optional(),
      })).optional(),
    }).optional(),
    date: z.string().optional(),
    version: z.string().optional(),
    repo: z.string().optional(),
    featured: z.boolean().default(false),
    featuredIcon: z.string().optional(),
    featuredLabel: z.string().optional(),
  }),
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
    // TODO: Change to reference('authors') when ready to refactor all blog components
    // (BlogCard, FeaturedPost, BubbleGrid, blog listing, author pages, category pages, RSS feed).
    // Author IDs (christopher-veale, maxwell-friel) already match entries in src/content/authors/.
    author: z.string(),
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

// ── Resources (lead magnets: templates, calculators, guides) ──
const resources = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Type drives the resource card icon, badge, and index grouping.
    type: z.enum(['template', 'calculator', 'guide', 'ebook', 'playbook', 'checklist']),
    // Where the asset lives. 'internal' = on-site calculator/tool page.
    // 'download' = file served from /public. 'gated' = email gate then download.
    delivery: z.enum(['internal', 'download', 'gated']).default('download'),
    // For 'download' / 'gated': path to the file in /public
    fileUrl: z.string().optional(),
    // For 'internal': the local URL of the tool
    toolUrl: z.string().optional(),
    // For card thumbnails
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    // Preview/reading time for guides
    readingTime: z.string().optional(),
    // Ordering + surfacing
    featured: z.boolean().default(false),
    order: z.number().default(100),
    date: z.string(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

// ── Comparisons (competitor + category comparison pages) ──
const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/comparisons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // 'competitor' = Servantium vs {Product}. 'category' = PSA vs ERP etc.
    kind: z.enum(['competitor', 'category']).default('competitor'),
    // The thing being compared against (for competitor pages)
    competitor: z.string().optional(),
    competitorLogo: z.string().optional(),
    // A one-line honest summary used in footer link labels
    tagline: z.string().optional(),
    // For structured comparison tables
    verdict: z.string().optional(),
    // Feature matrix rendered at top of page
    matrix: z.array(z.object({
      feature: z.string(),
      servantium: z.string(),
      other: z.string(),
      winner: z.enum(['servantium', 'other', 'tie']).optional(),
    })).optional(),
    date: z.string(),
    updated: z.string().optional(),
    order: z.number().default(100),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, authors, blog, customers, integrations, press, resources, comparisons };
