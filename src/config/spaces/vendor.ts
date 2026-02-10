// Vendor Space Configuration

import { SpaceConfig } from './types';

export const vendorConfig: SpaceConfig = {
  spaceType: 'vendor',
  displayName: 'Vendor Channel',

  sections: [
    {
      id: 'program-signals',
      type: 'programSignals',
      title: 'Program Signals',
      subtitle: 'Vendor announcements, launches, and updates.',
      variant: 'primary',
      enabled: true,
    },
    {
      id: 'publishing',
      type: 'publishing',
      title: 'Publishing',
      subtitle: 'Manage enablement content — draft, approve, and publish to partners.',
      variant: 'primary',
      enabled: true,
    },
    {
      id: 'partner-briefing-presets',
      type: 'partnerBriefingPresets',
      title: 'Partner Briefing Presets',
      subtitle: 'Preview what partners will see from your published content.',
      variant: 'primary',
      enabled: true,
    },
    {
      id: 'vendor-insights',
      type: 'vendorInsights',
      title: 'Insights',
      subtitle: 'How partners are engaging with your content.',
      variant: 'secondary',
      enabled: true,
    },
  ],

  labels: {
    headerTitle: 'Vendor Channel',
    headerSubtitle: 'Channel Enablement Management',
    storiesTitle: 'Program Signals',
    storiesSubtitle: 'Vendor announcements and updates.',
    accountPrepTitle: 'Publishing',
    accountPrepSubtitle: 'Draft → Approved → Published.',
    briefingsTitle: 'Partner Briefing Presets',
    briefingsSubtitle: 'Preview what partners will see.',
    growthTitle: 'Insights',
    reputationTitle: 'Engagement',
    reputationSubtitle: 'Partner engagement metrics.',
  },

  features: {
    stories: false,
    accountPrep: false,
    weekNavigator: false,
    jumpNav: false,
    reputation: false,
    events: false,
    skillOfWeek: false,
    customerBrief: false,
    quickBrief: false,
    expertCorners: false,
    trendingPacks: false,
    onDemandBriefings: false,
    capabilityBrand: false,
  },

  allowedStoryTypes: [],
  availablePacks: [],
};
