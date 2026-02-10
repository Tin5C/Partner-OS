// Partner Space Configuration
// Curated content with partner-safe signals only
// Guided scroll structure: Stories → Customer Brief → Deep Dives → Trending → Execution

import { SpaceConfig } from './types';
import { getDefaultBriefTemplatesConfig, BriefTemplatesConfig } from '@/data/briefTemplates';
import type { BriefingSourceMode } from '@/data/partner/briefingContracts';

// Brief templates config (exported for use by partner components)
export const partnerBriefTemplates: BriefTemplatesConfig = getDefaultBriefTemplatesConfig();

// Demo mode switch — true = precomputed artifacts (Option A), false = live generation (Option B)
export const partnerDemoMode: boolean = true;

// Briefing source mode — controls On-Demand Briefings behavior
export const briefingSourceMode: BriefingSourceMode = 'seeded_only';

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
    // 2. PARTNER MODE — Quick Brief ↔ Deal Planning
    {
      id: 'partner-mode',
      type: 'partnerMode',
      title: 'Execution Mode',
      subtitle: 'Choose how deep you want to go — fast or thorough.',
      variant: 'primary',
      enabled: true,
    },
    // 3. ON-DEMAND BRIEFINGS
    {
      id: 'on-demand-briefings',
      type: 'onDemandBriefings',
      title: 'On-Demand Briefings',
      subtitle: 'Generate short briefings when you need them — audio or read.',
      variant: 'primary',
      enabled: true,
    },
    // 4. SOLUTION DEEP DIVES
    {
      id: 'expert-corners',
      type: 'expertCorners',
      title: 'Solution deep dives tailored to you',
      subtitle: 'Synthetic explainers based on vendor documentation',
      variant: 'primary',
      enabled: true,
    },
    // 5. CAPABILITY & BRAND
    {
      id: 'capability-brand',
      type: 'capabilityBrand',
      title: 'Capability & Brand Snapshot',
      subtitle: undefined,
      variant: 'secondary',
      enabled: true,
    },
    // 6. GROWTH / ENABLEMENT — last
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
    briefingsTitle: 'On-Demand Briefings',
    briefingsSubtitle: 'Generate short briefings when you need them — audio or read.',
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
    trendingPacks: false, // Replaced by On-Demand Briefings
    onDemandBriefings: true, // Partner-only: unified briefing system
    capabilityBrand: true, // Partner-only: persona-aware branding
    briefTemplatesEnabled: true, // Partner-only: template-driven briefs
  },
  
  // Only curated/approved story types
  allowedStoryTypes: ['voice', 'competitor', 'product', 'success', 'winwire'],
  
  // Available content items
  availablePacks: [
    'skill-of-week',
  ],
};
