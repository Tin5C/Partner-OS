// Experience Configuration - Config-driven layout for Seller and Partner experiences
// To replicate features: add packId to sections, optionally override copy

export type AudienceType = 'seller' | 'partner';

export interface PackDefinition {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  tags: string[];
  icon: string;
  primaryCTA: { label: string; action: 'listen' | 'generate' | 'open' };
  secondaryCTA: { label: string; action: 'read' | 'open' };
  isWizard?: boolean; // For packs like Account Prep that open a wizard
}

export interface SectionDefinition {
  id: string;
  title: string;
  description?: string;
  packs: string[]; // packIds
  variant: 'primary' | 'secondary' | 'tertiary';
  centered?: boolean;
}

export interface ExperienceConfig {
  audienceType: AudienceType;
  sections: SectionDefinition[];
  packDefinitions: Record<string, PackDefinition>;
  copyOverrides?: {
    sectionDescriptions?: Record<string, string>;
    packSubtitles?: Record<string, string>;
    ctaLabels?: Record<string, { primary?: string; secondary?: string }>;
  };
  features: {
    stories: boolean;
    weekNavigator: boolean;
    jumpNav: boolean;
  };
}

// Shared pack definitions (base)
const basePackDefinitions: Record<string, PackDefinition> = {
  'top-focus': {
    id: 'top-focus',
    title: 'Top Focus',
    subtitle: 'Highlights for the week',
    duration: '~6 min',
    tags: ['Account Update'],
    icon: 'building-2',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  'competitive-radar': {
    id: 'competitive-radar',
    title: 'Competitive Radar',
    subtitle: 'What shifted in the market',
    duration: '~6 min',
    tags: ['Competitive'],
    icon: 'radar',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  'industry-signals': {
    id: 'industry-signals',
    title: 'Industry Signals',
    subtitle: 'Applied to your accounts',
    duration: '~6 min',
    tags: ['Industry News'],
    icon: 'newspaper',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  'objection-handling': {
    id: 'objection-handling',
    title: 'Objection Handling',
    subtitle: "This week's top objections",
    duration: '~5 min',
    tags: ['Objection Handling'],
    icon: 'message-circle',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  'account-prep': {
    id: 'account-prep',
    title: 'Account Prep',
    subtitle: 'Generate a meeting-ready prep pack',
    duration: '~2 min',
    tags: ['Pre-meeting'],
    icon: 'calendar',
    primaryCTA: { label: 'Generate Prep', action: 'generate' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
    isWizard: true,
  },
  'skill-of-week': {
    id: 'skill-of-week',
    title: 'Skill of the Week',
    subtitle: 'Micro-learning for this week',
    duration: '~10–15 min',
    tags: ['Learning'],
    icon: 'book-open',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  'events': {
    id: 'events',
    title: 'Events',
    subtitle: 'Discover relevant events near you',
    duration: '',
    tags: ['Networking', 'Learning'],
    icon: 'calendar-search',
    primaryCTA: { label: 'Find Events', action: 'open' },
    secondaryCTA: { label: 'Find Events', action: 'open' },
    isWizard: true, // Opens a panel instead of standard listen/read
  },
  'market-presence': {
    id: 'market-presence',
    title: 'Market Presence',
    subtitle: 'Your visibility signals',
    duration: '~5 min',
    tags: ['Personal Brand'],
    icon: 'user-circle',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
};

// Seller Experience Config
export const sellerConfig: ExperienceConfig = {
  audienceType: 'seller',
  sections: [
    {
      id: 'execute',
      title: 'Core',
      description: 'Customer Readiness',
      packs: ['top-focus', 'competitive-radar', 'industry-signals', 'objection-handling', 'account-prep'],
      variant: 'primary',
    },
    {
      id: 'improve',
      title: 'Improve',
      packs: ['skill-of-week', 'events'],
      variant: 'secondary',
    },
    {
      id: 'reputation',
      title: 'Reputation',
      packs: ['market-presence'],
      variant: 'tertiary',
    },
  ],
  packDefinitions: basePackDefinitions,
  features: {
    stories: true,
    weekNavigator: true,
    jumpNav: true,
  },
};

// Partner Experience Config
export const partnerConfig: ExperienceConfig = {
  audienceType: 'partner',
  sections: [
    {
      id: 'execute',
      title: 'Core',
      description: 'Partner Sales Readiness',
      packs: ['top-focus', 'competitive-radar', 'industry-signals', 'objection-handling'],
      variant: 'primary',
    },
    {
      id: 'improve',
      title: 'Improve',
      packs: ['skill-of-week', 'events'],
      variant: 'secondary',
    },
  ],
  packDefinitions: basePackDefinitions,
  copyOverrides: {
    packSubtitles: {
      'top-focus': 'Partner-relevant highlights',
      'industry-signals': 'Applied to partner verticals',
    },
  },
  features: {
    stories: true,
    weekNavigator: true,
    jumpNav: true,
  },
};

// Get config by audience type
export function getExperienceConfig(audience: AudienceType): ExperienceConfig {
  return audience === 'seller' ? sellerConfig : partnerConfig;
}

// Helper to get pack definition with overrides applied
export function getPackWithOverrides(
  config: ExperienceConfig,
  packId: string
): PackDefinition | null {
  const basePack = config.packDefinitions[packId];
  if (!basePack) return null;

  const subtitleOverride = config.copyOverrides?.packSubtitles?.[packId];
  const ctaOverride = config.copyOverrides?.ctaLabels?.[packId];

  return {
    ...basePack,
    subtitle: subtitleOverride || basePack.subtitle,
    primaryCTA: {
      ...basePack.primaryCTA,
      label: ctaOverride?.primary || basePack.primaryCTA.label,
    },
    secondaryCTA: {
      ...basePack.secondaryCTA,
      label: ctaOverride?.secondary || basePack.secondaryCTA.label,
    },
  };
}
