// Stories — canonical contract (v1)

import type { Signal } from '@/data/partner/signalStore';

export interface StoryItem {
  signalId: string;
  title: string;
  soWhat: string;
  recommendedAction: string;
  confidence: number;
  confidenceLabel: string;
  tags: string[];
  ctaType: 'open_quick_brief';
}

export interface StoriesVM {
  account_id: string;
  weekOf: string;
  stories: StoryItem[];
  sourceSignals: Signal[];
}
