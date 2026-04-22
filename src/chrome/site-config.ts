/**
 * site-config.ts — single source of truth for cross-site chrome content.
 *
 * Both servantium-website AND servantium-help consume this file:
 *   - Website imports it directly.
 *   - Help clones the website repo into vendor/website/ at build time and
 *     imports it from vendor/website/src/chrome/site-config.
 *
 * Changes here are propagated to help via a path-filtered workflow in
 * .github/workflows/notify-help.yml (triggers on push to src/chrome/**).
 *
 * Rules for this file:
 *   - Keep it dependency-free. No Astro components, no React, just plain
 *     data + optional helper functions. Help imports it from a vendored
 *     directory; anything it imports has to resolve there too.
 *   - The `origin` param on the helpers lets help absolute-link marketing
 *     URLs back to https://servantium.com while website uses relative paths.
 */

import type { NavLink, NavCta } from '@servantium/grove/SiteNav';
import type { FooterColumn, FooterFounder } from '@servantium/grove/SiteFooter';

interface BuildOptions {
  /**
   * When set (e.g. "https://servantium.com"), marketing links are prefixed
   * with this origin. Help sets it so its nav links jump cross-site to the
   * marketing home. Website leaves it blank (relative URLs).
   */
  origin?: string;
}

const HELP_ORIGIN = 'https://help.servantium.com';

export function buildNavLinks({ origin = '' }: BuildOptions = {}): NavLink[] {
  return [
    { href: `${origin}/`, label: 'Home', id: 'home' },
    { href: `${origin}/platform/`, label: 'Platform', id: 'platform' },
    {
      href: `${origin}/blog/`,
      label: 'Resources',
      id: 'resources',
      dropdown: [
        {
          heading: 'Learn',
          items: [
            { href: `${origin}/blog/`, label: 'Blog', description: 'Strategy essays and operator op-eds', icon: 'blog' },
            { href: `${HELP_ORIGIN}/release-notes/`, label: 'Release Notes', description: 'What shipped, when, and why', icon: 'releases' },
          ],
        },
        {
          heading: 'Help',
          items: [
            { href: `${HELP_ORIGIN}/`, label: 'Help Center', description: 'Product documentation and support guides', icon: 'help' },
            { href: `${HELP_ORIGIN}/glossary/`, label: 'Glossary', description: 'Key terms and definitions for services leaders', icon: 'glossary' },
          ],
        },
      ],
    },
    { href: `${origin}/about`, label: 'About', id: 'about' },
  ];
}

export function buildFooterColumns({ origin = '' }: BuildOptions = {}): FooterColumn[] {
  return [
    {
      heading: 'Product',
      items: [
        { href: `${origin}/platform`, label: 'Platform' },
        { href: `${HELP_ORIGIN}/`, label: 'Help Center' },
        { href: `${HELP_ORIGIN}/release-notes/`, label: 'Release Notes' },
        { href: `${HELP_ORIGIN}/glossary/`, label: 'Glossary' },
      ],
    },
    {
      heading: 'Learn',
      items: [
        { href: `${origin}/blog/`, label: 'Blog' },
        { href: `${HELP_ORIGIN}/`, label: 'Guides' },
        { href: `${HELP_ORIGIN}/videos/`, label: 'Videos' },
      ],
    },
    {
      heading: 'Company',
      items: [
        { href: `${origin}/about`, label: 'About' },
        { href: `${origin}/#contact`, label: 'Contact' },
        { href: `${origin}/privacy`, label: 'Privacy' },
        { href: `${origin}/terms`, label: 'Terms' },
      ],
    },
  ];
}

export const brand = {
  name: 'Servantium',
  tagline: 'The Professional Services OS.',
  logoSrc: '/logo.png',
  logoAlt: 'Servantium',
  logoHref: 'https://servantium.com/',
};

export const contactEmail = 'hello@servantium.com';

export const social = {
  linkedin: 'https://linkedin.com/company/servantium',
};

export const founders: FooterFounder[] = [
  { name: 'Christopher Veale', href: 'https://linkedin.com/in/christopher-veale' },
  { name: 'Maxwell Friel', href: 'https://linkedin.com/in/maxwell-friel-2bb02b30' },
];

// Cal.com booking details — used by the "Book a Demo" CTA in the nav.
export const calBooking = {
  link: 'christopher-veale/servantium-introduction?duration=15',
  namespace: 'servantium-introduction',
  config: '{"layout":"month_view"}',
};

export function buildNavCtas(): NavCta[] {
  return [
    {
      kind: 'secondary',
      label: 'Book a Demo',
      calLink: calBooking.link,
      calNamespace: calBooking.namespace,
      calConfig: calBooking.config,
    },
    {
      kind: 'primary',
      label: 'Log In',
      href: 'https://app.servantium.com',
      rel: 'noopener',
    },
  ];
}

// UI strings (absorbed from the former src/data/strings.ts).
// Organized for future i18n swap.
export const strings = {
  nav: {
    bookDemo: 'Book a Demo',
    logIn: 'Log In',
  },
  footer: {
    tagline: brand.tagline,
  },
};
