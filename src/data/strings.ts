/**
 * UI strings — lightweight i18n readiness.
 * All user-facing text in one place. When localization is needed,
 * swap this for a proper i18n solution.
 */
export const strings = {
  // Navigation
  nav: {
    home: 'Home',
    platform: 'Platform',
    about: 'About',
    blog: 'Blog',
    help: 'Help',
    bookDemo: 'Book a Demo',
    logIn: 'Log In',
  },

  // Footer
  footer: {
    tagline: 'The operating system for professional services.',
    followUs: 'Follow us on',
    explore: 'Explore',
    company: 'Company',
    legal: 'Legal',
    copyright: `© ${new Date().getFullYear()} Servantium Inc.`,
    foundedBy: 'Founded by',
  },

  // CTAs
  cta: {
    scheduleDemo: 'Schedule a Demo',
    sendMessage: 'Send a Message',
    learnMore: 'Learn More',
    getStarted: 'Get Started',
    contactUs: 'Contact Us',
    explorePlatform: 'Explore the Platform',
  },

  // Blog
  blog: {
    title: 'Blog',
    subtitle: 'Insights on professional services, engagement management, and building the operational infrastructure services businesses deserve.',
    readMore: 'Read more',
    relatedPosts: 'Related Posts',
    shareArticle: 'Share this article',
    allCategories: 'All',
  },

  // Help / Grove
  help: {
    title: 'Help Center',
    onThisPage: 'On this page',
    editPage: 'Edit page',
    lastUpdated: 'Last updated',
    previous: 'Previous',
    next: 'Next',
    searchPlaceholder: 'Search docs...',
  },

  // Contact
  contact: {
    name: 'Name',
    email: 'Email',
    message: 'Message',
    send: 'Send Message',
    successMessage: "Thanks for reaching out! We'll be in touch within 24 hours.",
  },

  // Company
  company: {
    name: 'Servantium',
    email: 'hello@servantium.com',
    address: '1111B S Governors Ave STE 48074, Dover, DE 19904',
    appUrl: 'https://app.servantium.com/',
    linkedIn: 'https://linkedin.com/company/servantium',
  },
} as const;
