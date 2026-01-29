// Internal Space Configuration
// Full access to all content types and features

import { SpaceConfig } from './types';

export const internalConfig: SpaceConfig = {
  spaceType: 'internal',
  displayName: 'Internal',
  
  sections: [
    {
      id: 'stories',
      type: 'storiesRow',
      title: 'Stories',
      subtitle: 'Quick signals and insights you can use in customer conversations.',
      variant: 'primary',
      enabled: true,
    },
    {
      id: 'account-prep',
      type: 'accountPrep',
      title: 'Account Prep',
      subtitle: 'Generate a meeting-ready prep pack',
      variant: 'primary',
      enabled: true,
    },
    {
      id: 'briefings',
      type: 'packGrid',
      title: 'Briefings',
      subtitle: 'Executive summaries you can listen to or scan.',
      variant: 'primary',
      enabled: true,
      packs: ['top-focus', 'competitive-radar', 'industry-signals', 'objection-handling'],
    },
    {
      id: 'growth',
      type: 'growth',
      title: 'Growth',
      subtitle: undefined,
      variant: 'secondary',
      enabled: true,
      packs: ['skill-of-week', 'events'],
    },
    {
      id: 'reputation',
      type: 'reputation',
      title: 'Reputation & Visibility',
      subtitle: 'How buyers are likely to perceive you — and how to improve it.',
      variant: 'tertiary',
      enabled: true,
    },
  ],
  
  labels: {
    headerTitle: 'Internal Portal',
    headerSubtitle: 'Customer Readiness',
    storiesTitle: 'Stories',
    storiesSubtitle: 'Quick signals and insights you can use in customer conversations.',
    accountPrepTitle: 'Account Prep',
    accountPrepSubtitle: 'Generate a meeting-ready prep pack',
    briefingsTitle: 'Briefings',
    briefingsSubtitle: 'Executive summaries you can listen to or scan.',
    growthTitle: 'Growth',
    reputationTitle: 'Reputation & Visibility',
    reputationSubtitle: 'How buyers are likely to perceive you — and how to improve it.',
  },
  
  features: {
    stories: true,
    accountPrep: true,
    weekNavigator: true,
    jumpNav: true,
    reputation: true,
    events: true,
    skillOfWeek: true,
  },
  
  // All story types visible to internal users
  allowedStoryTypes: ['signal', 'voice', 'competitor', 'startup', 'customer', 'expert', 'industry'],
  
  // All packs available
  availablePacks: [
    'top-focus',
    'competitive-radar',
    'industry-signals',
    'objection-handling',
    'skill-of-week',
    'events',
    'market-presence',
  ],
};
