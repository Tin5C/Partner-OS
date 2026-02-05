// Partner Space Configuration
// Curated content with partner-safe signals only
// Guided scroll structure: Stories → Customer Brief → Deep Dives → Trending → Execution

import { SpaceConfig } from './types';
import { getDefaultBriefTemplatesConfig, BriefTemplatesConfig } from '@/data/briefTemplates';

// Brief templates config (exported for use by partner components)
export const partnerBriefTemplates: BriefTemplatesConfig = getDefaultBriefTemplatesConfig();

export const partnerConfig: SpaceConfig = {
  spaceType: 'partner',
  displayName: 'Partner',
  
  sections: [
    // 1. STORIES — trigger: "what changed?"
    {
      id: 'stories',
      type: 'storiesRow',
      title: 'AI Selling Signals',
      subtitle: 'What changed, why it matters, what to do.',
      variant: 'primary',
      enabled: true,
    },
    // 2. QUICK BRIEF — fast situational refresh (60–120 sec)
    {
      id: 'quick-brief',
      type: 'quickBrief',
      title: 'Quick Brief',
      subtitle: 'Fast situational refresh before a call or meeting — 60 seconds.',
      variant: 'secondary',
      enabled: true,
    },
    // 3. DEAL PLANNING — AI Deal Brief (5–10 min commitment)
    {
      id: 'customer-brief',
      type: 'customerBrief',
      title: 'AI Deal Brief',
      subtitle: 'Turn messy AI deal context into a deal-ready plan in 5–10 minutes.',
      variant: 'primary',
      enabled: true,
    },
    // 4. SOLUTION DEEP DIVES — Help me understand this properly
    {
      id: 'expert-corners',
      type: 'expertCorners',
      title: 'Solution deep dives tailored to you',
      subtitle: 'Synthetic explainers based on vendor documentation',
      variant: 'primary',
      enabled: true,
    },
    // 5. TRENDING PACKS — What's hot right now / what buyers care about
    {
      id: 'trending-packs',
      type: 'trendingPacks',
      title: 'Trending Packs',
      subtitle: 'What partners are talking about right now',
      variant: 'primary',
      enabled: true,
    },
    // 6. EXECUTION PACKS / BRIEFINGS
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
    // 7. CAPABILITY & BRAND
    {
      id: 'capability-brand',
      type: 'capabilityBrand',
      title: 'Capability & Brand Snapshot',
      subtitle: undefined,
      variant: 'secondary',
      enabled: true,
    },
    // 8. GROWTH — Personal development (lower priority)
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
    headerSubtitle: 'AI Sales Readiness',
    storiesTitle: 'AI Selling Signals',
    storiesSubtitle: 'What changed, why it matters, what to do.',
    accountPrepTitle: 'AI Deal Brief',
    accountPrepSubtitle: 'Turn messy AI deal context into a deal-ready plan in 5–10 minutes.',
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
    reputation: false, // Hidden for partners - replaced by Capability & Brand
    events: false, // Hidden for partners
    skillOfWeek: true,
    customerBrief: true, // Partner-only: full AI Deal Brief
    quickBrief: true, // Partner-only: fast 60-sec situational brief
    expertCorners: true, // Partner-only feature
    trendingPacks: true, // Partner-only feature
    capabilityBrand: true, // Partner-only: persona-aware branding
    briefTemplatesEnabled: true, // Partner-only: template-driven briefs
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
