// buildComposerInputBusiness — deterministic composer input for deal planning
// Read-only. No mutations. Partner-only.

import { getSignal, type Signal } from '@/data/partner/signalStore';
import { getAccountSignal, type AccountSignal } from '@/data/partner/accountSignalStore';
import { listMemoryItems, getReadinessScore, type EvidencePillar } from '@/data/partner/accountMemoryStore';
import { getByFocusId as getInitiativesPack } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getTrendsPack } from '@/data/partner/industryAuthorityTrendsStore';
import { getActivePlay } from '@/partner/data/dealPlanning/selectedPackStore';

// ============= Output types =============

export interface ComposerSignalRef {
  id: string;
  title: string;
  summary: string;
  tags: string[];
}

export interface ComposerEvidenceRef {
  id: string;
  title: string;
  type: string;
  excerpt: string;
}

export interface ComposerInitiativeRef {
  id: string;
  title: string;
  summary: string;
}

export interface ComposerTrendRef {
  id: string;
  title: string;
  summary: string;
}

export interface ComposerReadinessGap {
  id: string;
  title: string;
  summary: string;
}

export interface ComposerInputBusiness {
  focus_id: string;
  play_id: string;
  play_title: string;
  type: string;
  motion: string;
  selected_signals: ComposerSignalRef[];
  evidence_items: ComposerEvidenceRef[];
  initiatives: ComposerInitiativeRef[];
  trends: ComposerTrendRef[];
  readiness_gaps: ComposerReadinessGap[];
}

// ============= Helpers =============

function resolveSignal(id: string): ComposerSignalRef | null {
  // Try signalStore first (weekly signals)
  const ws = getSignal(id) as Signal | null;
  if (ws) {
    return {
      id: ws.id,
      title: ws.title,
      summary: ws.soWhat,
      tags: [...ws.whoCares],
    };
  }
  // Try accountSignalStore (extractor-derived)
  const as = getAccountSignal(id) as AccountSignal | null;
  if (as) {
    return {
      id: as.id,
      title: as.headline,
      summary: as.why_it_converts,
      tags: [...as.execution_surface],
    };
  }
  return null;
}

// ============= Builder =============

export interface BuildComposerInputArgs {
  focusId: string;
  playId: string;
  type: string;
  motion: string;
  activeSignalIds: string[];
}

export function buildComposerInputBusiness(args: BuildComposerInputArgs): ComposerInputBusiness {
  const { focusId, playId, type, motion, activeSignalIds } = args;

  // Play title
  const activePlay = getActivePlay(focusId);
  const playTitle = activePlay?.playTitle ?? playId;

  // Selected signals
  const selected_signals: ComposerSignalRef[] = [];
  for (const sid of activeSignalIds) {
    const ref = resolveSignal(sid);
    if (ref) selected_signals.push(ref);
  }

  // Evidence items (max 5, newest first)
  const memoryItems = listMemoryItems(focusId);
  const evidence_items: ComposerEvidenceRef[] = memoryItems.slice(0, 5).map((m) => ({
    id: m.id,
    title: m.title,
    type: m.type,
    excerpt: (m.content_text ?? '').slice(0, 400),
  }));

  // Initiatives (max 3)
  const initPack = getInitiativesPack(focusId);
  const initiatives: ComposerInitiativeRef[] = (initPack?.public_it_initiatives ?? [])
    .slice(0, 3)
    .map((i) => ({ id: i.id, title: i.title, summary: i.summary }));

  // Trends (max 3)
  const trendsPack = getTrendsPack(focusId);
  const trends: ComposerTrendRef[] = (trendsPack?.trends ?? [])
    .slice(0, 3)
    .map((t) => ({ id: t.id, title: t.trend_title, summary: t.thesis_summary }));

  // Readiness gaps (pillars that are false → <60%)
  const hasPromotedSignals = activeSignalIds.length > 0;
  const { pillars } = getReadinessScore(focusId, hasPromotedSignals);
  const readiness_gaps: ComposerReadinessGap[] = [];
  for (const [pillar, covered] of Object.entries(pillars) as [EvidencePillar, boolean][]) {
    if (!covered) {
      readiness_gaps.push({
        id: `gap_${pillar}`,
        title: `Low readiness in ${pillar}`,
        summary: 'Limited documented evidence in this pillar.',
      });
    }
  }

  return {
    focus_id: focusId,
    play_id: playId,
    play_title: playTitle,
    type,
    motion,
    selected_signals,
    evidence_items,
    initiatives,
    trends,
    readiness_gaps,
  };
}
