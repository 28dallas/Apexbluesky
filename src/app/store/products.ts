export type StoreProduct = {
  title: string;
  slug?: string;
  service: string;
  price: string;
  badge: string;
  description: string;
  features: string[];
};

export const storeProducts: StoreProduct[] = [
  {
    title: 'Next.js Launchpad Kit',
    service: 'Developer kits',
    price: '$79',
    badge: 'Best seller',
    description: 'A polished starter stack with page templates, SEO basics, and a clean dashboard shell.',
    features: ['Next.js + Tailwind setup', 'Reusable page patterns', 'Launch-ready structure'],
  },
  {
    title: 'Automation Playbook Pack',
    service: 'Automation assets',
    price: '$49',
    badge: 'New',
    description: 'Ready-to-adapt workflow templates for repetitive operations and internal systems.',
    features: ['Workflow templates', 'Task checklists', 'Fast implementation guides'],
  },
  {
    title: 'Creator Growth Bundle',
    service: 'Creator toolkits',
    price: '$39',
    badge: 'Popular',
    description: 'A compact toolkit for content planning, offers, and promotional assets.',
    features: ['Prompt packs', 'Content planning sheets', 'Promo asset templates'],
  },
  {
    title: 'AI Product Sprint Kit',
    service: 'Developer kits',
    price: '$99',
    badge: 'Featured',
    description: 'A faster way to launch AI-enabled products with clear onboarding and prompt flows.',
    features: ['Prompt flows', 'UI starter blocks', 'Product-ready copy'],
  },
  {
    title: 'Ops Shortcut Vault',
    service: 'Automation assets',
    price: '$59',
    badge: 'Hot',
    description: 'Practical systems that reduce admin drag and make daily execution more reliable.',
    features: ['Automation checklists', 'Team SOP templates', 'Recurring task maps'],
  },
  {
    title: 'Brand Launch Assets',
    service: 'Creator toolkits',
    price: '$29',
    badge: 'Starter',
    description: 'A lightweight bundle for announcing your offer, building trust, and converting faster.',
    features: ['Launch emails', 'Social captions', 'Sales page copy'],
  },
];
