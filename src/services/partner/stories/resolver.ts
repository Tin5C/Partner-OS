// Stories Resolver — compact story items from signals with CTA mapping

import type { StoriesVM, StoryItem } from './contract';
import { listSignals } from '@/data/partner/signalStore';

export function resolveStories(
  account_id: string,
  options?: { weekOf?: string },
): StoriesVM {
  const weekOf = options?.weekOf ?? '2026-02-10';
  const signals = listSignals(account_id, weekOf);

  const stories: StoryItem[] = signals.map((s) => ({
    signalId: s.id,
    title: s.title,
    soWhat: s.soWhat,
    recommendedAction: s.recommendedAction,
    confidence: s.confidence,
    confidenceLabel: s.confidenceLabel,
    tags: s.whoCares,
    ctaType: 'open_quick_brief' as const,
  }));

  return {
    account_id,
    weekOf,
    stories,
    sourceSignals: signals,
  };
}
