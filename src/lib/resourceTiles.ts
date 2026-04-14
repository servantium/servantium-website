/**
 * Shared tile builders for resource index pages.
 * Accepts raw content-collection entries and produces the uniform Tile shape
 * consumed by ResourceGrid.astro + the main resources hub.
 */

export interface Tile {
  href: string;
  kind: 'calculator' | 'template' | 'guide' | 'playbook' | 'ebook' | 'checklist' | 'customer' | 'blog' | 'comparison';
  type: string;
  title: string;
  description: string;
  date?: string;
  featured?: boolean;
  readingTime?: string;
  category?: string;
}

type ResourceEntry = {
  id: string;
  data: {
    title: string;
    description: string;
    type: string;
    toolUrl?: string;
    date?: string;
    featured?: boolean;
    readingTime?: string;
  };
};

export function resourcesToTiles(entries: ResourceEntry[]): Tile[] {
  return entries.map(r => {
    const isCalc = r.data.type === 'calculator';
    return {
      href: isCalc
        ? (r.data.toolUrl || `/resources/calculators/${r.id}/`)
        : `/resources/templates/${r.id}/`,
      kind: r.data.type as Tile['kind'],
      type: r.data.type,
      title: r.data.title,
      description: r.data.description,
      date: r.data.date,
      featured: r.data.featured,
      readingTime: r.data.readingTime,
    };
  });
}

type BlogEntry = {
  id: string;
  data: {
    title: string;
    description: string;
    date: string;
    category: string;
    readingTime?: string;
    draft?: boolean;
  };
};

export function blogToTiles(entries: BlogEntry[]): Tile[] {
  return entries.map(p => ({
    href: `/blog/${p.id}/`,
    kind: 'blog',
    type: 'article',
    title: p.data.title,
    description: p.data.description,
    date: p.data.date,
    category: p.data.category,
    readingTime: p.data.readingTime,
  }));
}

type CustomerEntry = {
  id: string;
  data: {
    name: string;
    industry?: string;
    quote?: string;
    featured?: boolean;
  };
};

export function customersToTiles(entries: CustomerEntry[]): Tile[] {
  return entries.map(c => ({
    href: `/resources/customers/${c.id}/`,
    kind: 'customer',
    type: 'customer story',
    title: c.data.name,
    description: c.data.quote || `How ${c.data.name} runs engagements on Servantium.`,
    category: c.data.industry,
    featured: c.data.featured,
  }));
}

type ComparisonEntry = {
  id: string;
  data: {
    title: string;
    description: string;
    kind: string;
    tagline?: string;
    date?: string;
    order?: number;
  };
};

export function comparisonsToTiles(entries: ComparisonEntry[]): Tile[] {
  return entries.map(c => ({
    href: `/compare/${c.id}/`,
    kind: 'comparison',
    type: c.data.kind === 'competitor' ? 'comparison' : 'category',
    title: c.data.title,
    description: c.data.tagline || c.data.description,
    date: c.data.date,
  }));
}
