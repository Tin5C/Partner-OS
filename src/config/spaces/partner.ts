// Partner Space Configuration
// Curated content with partner-safe signals only

import { SpaceConfig } from './types';

export const partnerConfig: SpaceConfig = {
  spaceType: 'partner',
  displayName: 'Partner',
  
  sections: [
    {
      id: 'stories',
      type: 'storiesRow',
      title: 'Stories',
      subtitle: 'Product updates, competitive insights, and thought leadership.',
      variant: 'primary',
      enabled: true,
    },
    {
      id: 'account-prep',
      type: 'accountPrep',
      title: 'Account Prep',
      subtitle: 'Generate a meeting-ready prep pack',
      variant: 'primary',
      enabled: false, // Partners use different prep flow
    },
    {
      id: 'briefings',
      type: 'packGrid',
      title: 'Briefings',
      subtitle: 'Partner-ready insights and talking points.',
      variant: 'primary',
      enabled: true,
      packs: ['product-focus', 'competitive-overview', 'objection-handling'],
      copyOverrides: {
        'objection-handling-subtitle': 'Approved objection responses',
      },
    },
    {
      id: 'growth',
      type: 'growth',
      title: 'Enablement',
      subtitle: undefined,
      variant: 'secondary',
      enabled: true,
      packs: ['skill-of-week'],
    },
    {
      id: 'enablement-progress',
      type: 'enablementProgress',
      title: 'Enablement Progress',
      subtitle: 'Track your partner certification and training.',
      variant: 'tertiary',
      enabled: true,
    },
  ],
  
  labels: {
    headerTitle: 'Partner Portal',
    headerSubtitle: 'Partner Sales Readiness',
    storiesTitle: 'Stories',
    storiesSubtitle: 'Product updates, competitive insights, and thought leadership.',
    accountPrepTitle: 'Account Prep',
    accountPrepSubtitle: 'Prepare for customer conversations',
    briefingsTitle: 'Briefings',
    briefingsSubtitle: 'Partner-ready insights and talking points.',
    growthTitle: 'Enablement',
    reputationTitle: 'Enablement Progress',
    reputationSubtitle: 'Track your partner certification and training.',
  },
  
  features: {
    stories: true,
    accountPrep: false, // Disabled for partners
    weekNavigator: true,
    jumpNav: true,
    reputation: false, // Hidden for partners
    events: false, // Hidden for partners
    skillOfWeek: true,
  },
  
  // Only curated/approved story types
  allowedStoryTypes: ['voice', 'competitor', 'product'],
  
  // Partner-approved packs only
  availablePacks: [
    'product-focus',
    'competitive-overview',
    'objection-handling',
    'skill-of-week',
  ],
};
