/**
 * Grove documentation sidebar configuration.
 * Defines the sidebar structure for help.servantium.com.
 * Used by DocsSidebar.astro to render navigation.
 *
 * When 'autogenerate' is set, all MDX files in that directory
 * are automatically listed (sorted by frontmatter date, desc).
 */
export interface DocsNavItem {
  label: string;
  slug?: string;
}

export interface DocsNavSection {
  label: string;
  items?: DocsNavItem[];
  autogenerate?: string; // directory name to auto-list
  collapsed?: boolean;
}

export const docsNav: DocsNavSection[] = [
  {
    label: 'Getting Started',
    items: [
      { label: 'Home', slug: '' },
      { label: 'Quick Start', slug: 'quick-start' },
      { label: 'Key Concepts', slug: 'key-concepts' },
    ],
  },
  {
    label: 'Using Servantium',
    items: [
      { label: 'Dashboard & Navigation', slug: 'guides/dashboard' },
      { label: 'Engagements', slug: 'guides/engagements' },
      { label: 'Quotes & Pricing', slug: 'guides/quotes-pricing' },
      { label: 'Resource Planning', slug: 'guides/resource-planning' },
      { label: 'Documents & Proposals', slug: 'guides/documents' },
      { label: 'Notes & AI', slug: 'guides/notes-ai' },
      { label: 'Contacts & Accounts', slug: 'guides/contacts-accounts' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'AI & Intelligence', slug: 'guides/ai-features' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { label: 'Settings & Administration', slug: 'guides/settings' },
    ],
  },
  {
    label: 'Release Notes',
    autogenerate: 'release-notes',
  },
  {
    label: 'Support',
    items: [
      { label: 'Contact Us', slug: 'support/contact' },
      { label: 'FAQ', slug: 'support/faq' },
    ],
  },
];
