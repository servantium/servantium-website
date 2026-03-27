import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

// Starlight docs collection (handles help docs + release notes)
const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema(),
});

// Blog collection (our custom blog system)
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string(),
    authorRole: z.string().optional(),
    category: z.string(),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { docs, blog };
