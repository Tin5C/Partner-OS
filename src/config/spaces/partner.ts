// Partner Space Configuration
// Curated content with partner-safe signals only
// Guided scroll structure: Stories → Customer Brief → Deep Dives → Trending → Execution

import { SpaceConfig } from './types';

export const partnerConfig: SpaceConfig = {
  spaceType: 'partner',
  displayName: 'Partner',
  
  sections: [
    // 1. STORIES - What's new / what should I notice?
    {
      id: 'stories',
      type: 'storiesRow',
      title: 'Stories',
      subtitle: 'Product updates, competitive insights, and thought leadership.',
      variant: 'primary',
      enabled: true,
    },
    // 2. CUSTOMER BRIEF - What am I working on? (The spine of the page)
    {
      id: 'customer-brief',
      type: 'customerBrief',
      title: 'Customer Brief',
      subtitle: 'Enter your deal context — get the right programs, funding, assets, and steps.',
      variant: 'primary',
      enabled: true,
    },
    // 3. SOLUTION DEEP DIVES - Help me understand this properly
    {
      id: 'expert-corners',
      type: 'expertCorners',
      title: 'Solution deep dives tailored to you',
      subtitle: 'Synthetic explainers based on vendor documentation',
      variant: 'primary',
      enabled: true,
    },
    // 4. TRENDING PACKS - What's hot right now / what buyers care about
    {
      id: 'trending-packs',
      type: 'trendingPacks',
      title: 'Trending Packs',
      subtitle: 'What partners are talking about right now',
      variant: 'primary',
      enabled: true,
    },
    // 5. EXECUTION PACKS / BRIEFINGS - What do I say or do next?
    {
      id: 'briefings',
      type: 'packGrid',
      title: 'Execution Packs',
      subtitle: 'Concrete actions, talk tracks, and objection handling.',
      variant: 'primary',
      enabled: true,
      packs: ['product-focus', 'competitive-overview', 'objection-handling'],
      copyOverrides: {
        'objection-handling-subtitle': 'Approved objection responses',
      },
    },
    // 6. GROWTH - Personal development (lower priority)
    {
      id: 'growth',
      type: 'growth',
      title: 'Enablement',
      subtitle: undefined,
      variant: 'secondary',
      enabled: true,
      packs: ['skill-of-week'],
    },
  ],
  
  labels: {
    headerTitle: 'Partner Portal',
    headerSubtitle: 'Partner Sales Readiness',
    storiesTitle: 'Stories',
    storiesSubtitle: 'Product updates, competitive insights, and thought leadership.',
    accountPrepTitle: 'Customer Brief',
    accountPrepSubtitle: 'Enter your deal context — get the right programs, funding, assets, and steps.',
    briefingsTitle: 'Execution Packs',
    briefingsSubtitle: 'Concrete actions, talk tracks, and objection handling.',
    growthTitle: 'Enablement',
    reputationTitle: 'Enablement Progress',
    reputationSubtitle: 'Track your partner certification and training.',
  },
  
  features: {
    stories: true,
    accountPrep: false, // Partners use Customer Brief instead
    weekNavigator: true,
    jumpNav: true,
    reputation: false, // Hidden for partners
    events: false, // Hidden for partners
    skillOfWeek: true,
    customerBrief: true, // Partner-only feature
    expertCorners: true, // Partner-only feature
    trendingPacks: true, // Partner-only feature
  },
  
  // Only curated/approved story types
  allowedStoryTypes: ['voice', 'competitor', 'product', 'success', 'winwire'],
  
  // Partner-approved packs only
  availablePacks: [
    'product-focus',
    'competitive-overview',
    'objection-handling',
    'skill-of-week',
  ],
};
