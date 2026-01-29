// Unified Content Model - Shared types for all content across Internal and Partner spaces

export type ContentMediaType = 'audio' | 'video' | 'image' | 'text';
export type ContentSourceType = 'internal' | 'external';
export type SpaceVisibility = 'internal' | 'partner' | 'both';

// Base content item - all content conforms to this
export interface ContentItem {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  durationMin?: number;
  durationLabel?: string;
  publishedAt: string;
  coverUrl?: string;
  mediaType: ContentMediaType;
  tags: string[];
  sourceType: ContentSourceType;
  spaceVisibility: SpaceVisibility;
  isNew?: boolean;
}

// Story-specific content
export interface StoryItem extends ContentItem {
  type: 'signal' | 'voice';
  chipLabel: string;
  
  // Signal-specific
  badge?: string;
  headline?: string;
  oneLiner?: string;
  whyItMatters?: string;
  talkTrack?: string;
  companyName?: string;
  personName?: string;
  logoUrl?: string;
  personImageUrl?: string;
  videoUrl?: string;
  
  // Voice-specific
  voiceId?: string;
  voiceName?: string;
  voiceRole?: string;
  voiceAvatarUrl?: string;
  hook?: string;
  takeaway?: string;
  nextMove?: string;
}

// Pack/Briefing content
export interface PackItem extends ContentItem {
  type: 'briefing' | 'skill' | 'event' | 'presence';
  icon: string;
  category: 'core' | 'improve' | 'reputation';
  primaryCTA: { label: string; action: 'listen' | 'open' | 'generate' };
  secondaryCTA: { label: string; action: 'read' | 'open' };
  isWizard?: boolean;
  
  // Exec summary content
  execSummary?: {
    tldr: string;
    whatChanged: string[];
    whyItMatters: string[];
    risks?: string[];
    nextBestActions: string[];
    questionsToAsk: string[];
    sources?: { title: string; url?: string }[];
  };
  
  // Audio content
  listenUrl?: string;
}

// Event content
export interface EventItem extends ContentItem {
  type: 'event';
  startDateTime: string;
  endDateTime?: string;
  city: string;
  venue: string;
  organizer: string;
  topics: string[];
  description: string;
  relevanceReason?: string;
  eventUrl?: string;
}

// Content feed for a space
export interface SpaceContentFeed {
  stories: StoryItem[];
  packs: PackItem[];
  events: EventItem[];
}

// Week-keyed content
export interface WeeklyContent {
  weekKey: string;
  packs: PackItem[];
}

// Helper to get week key from date
export function getWeekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayNum}`;
}
