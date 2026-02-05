// Space Configuration Types
// Defines how each space (Internal/Partner) renders its homepage

export type SpaceType = 'internal' | 'partner';

export type SectionType = 
  | 'storiesRow'
  | 'accountPrep'
  | 'packGrid'
  | 'growth'
  | 'reputation'
  | 'enablementProgress'
  | 'customerBrief'
  | 'expertCorners'
  | 'trendingPacks'
  | 'capabilityBrand';

export type SectionVariant = 'primary' | 'secondary' | 'tertiary';

export interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  subtitle?: string;
  variant: SectionVariant;
  enabled: boolean;
  // For packGrid sections
  packs?: string[];
  // Custom copy overrides
  copyOverrides?: Record<string, string>;
}

export interface SpaceLabels {
  headerTitle: string;
  headerSubtitle?: string;
  storiesTitle: string;
  storiesSubtitle: string;
  accountPrepTitle: string;
  accountPrepSubtitle: string;
  briefingsTitle: string;
  briefingsSubtitle: string;
  growthTitle: string;
  reputationTitle: string;
  reputationSubtitle: string;
}

export interface SpaceFeatures {
  stories: boolean;
  accountPrep: boolean;
  weekNavigator: boolean;
  jumpNav: boolean;
  reputation: boolean;
  events: boolean;
  skillOfWeek: boolean;
  customerBrief?: boolean; // Partner-only feature
  expertCorners?: boolean; // Partner-only feature
  trendingPacks?: boolean; // Partner-only feature
  capabilityBrand?: boolean; // Partner-only: persona-aware branding
}

export interface SpaceConfig {
  spaceType: SpaceType;
  displayName: string;
  sections: SectionConfig[];
  labels: SpaceLabels;
  features: SpaceFeatures;
  // Content type filters for stories
  allowedStoryTypes: string[];
  // Packs available in this space
  availablePacks: string[];
}

// Get space config by type
export function getSpaceConfig(spaceType: SpaceType): SpaceConfig {
  // Dynamic import would happen here in production
  // For now, we use the configs directly
  return spaceType === 'internal' 
    ? require('./internal').internalConfig 
    : require('./partner').partnerConfig;
}
