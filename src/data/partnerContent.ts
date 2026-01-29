// Partner Content Feed - Curated data for partner space
// Uses unified content model types

import { StoryItem, PackItem } from '@/lib/content/types';

export const partnerStories: StoryItem[] = [
  // Partner-safe stories only
  // No internal-only labels, customers, or sensitive signals
];

export const partnerPacks: PackItem[] = [
  {
    id: 'product-focus',
    type: 'briefing',
    title: 'Product Focus',
    subtitle: 'Latest product updates and positioning',
    durationMin: 5,
    durationLabel: '5 min',
    publishedAt: new Date().toISOString(),
    mediaType: 'audio',
    tags: ['Product Update'],
    sourceType: 'internal',
    spaceVisibility: 'partner',
    isNew: true,
    icon: 'building-2',
    category: 'core',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  {
    id: 'competitive-overview',
    type: 'briefing',
    title: 'Competitive Overview',
    subtitle: 'Approved competitive positioning and responses',
    durationMin: 4,
    durationLabel: '4 min',
    publishedAt: new Date().toISOString(),
    mediaType: 'audio',
    tags: ['Competitive'],
    sourceType: 'internal',
    spaceVisibility: 'partner',
    isNew: false,
    icon: 'radar',
    category: 'core',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  {
    id: 'objection-handling',
    type: 'briefing',
    title: 'Objection Handling',
    subtitle: 'Approved objection responses',
    durationMin: 5,
    durationLabel: '5 min',
    publishedAt: new Date().toISOString(),
    mediaType: 'audio',
    tags: ['Objection Handling'],
    sourceType: 'internal',
    spaceVisibility: 'partner',
    isNew: false,
    icon: 'message-circle',
    category: 'core',
    primaryCTA: { label: 'Listen Briefing', action: 'listen' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
  {
    id: 'skill-of-week',
    type: 'skill',
    title: 'Skill of the Week',
    subtitle: 'Partner selling techniques',
    durationMin: 10,
    durationLabel: '10 min',
    publishedAt: new Date().toISOString(),
    mediaType: 'text',
    tags: ['Learning'],
    sourceType: 'internal',
    spaceVisibility: 'partner',
    isNew: true,
    icon: 'book-open',
    category: 'improve',
    primaryCTA: { label: 'Start Learning', action: 'open' },
    secondaryCTA: { label: 'Exec Summary', action: 'read' },
  },
];

export const partnerContentFeed = {
  stories: partnerStories,
  packs: partnerPacks,
  events: [],
};
