// Account Intelligence Resolver — single read model for account context
//
// MODULE NUMBERING AUDIT (2026-02-16)
// Hardcoded references found:
// - src/data/partner/contracts.ts lines 237-241: module2?–module6? optional typed fields in ModulePacks interface
// - src/data/partner/demo/demoDataset.ts line 96: modulePacks object (uses module0A, module0V, module0B, module1 keys only)
// No direct numeric module indexing (modules[2], parseInt, Object.keys) detected in runtime code.
// Safe alias resolver introduced at src/services/extractor/moduleResolver.ts for future-proof access.

import type { AccountIntelligenceVM, SignalHistoryItem } from './contract';
import { resolveCanonicalMeta } from '@/services/ids';
import { getByFocusId as getSnapshot } from '@/data/partner/accountSnapshotStore';
import { getByFocusId as getCommercial } from '@/data/partner/commercialFootprintStore';
import { getByFocusId as getTechnical } from '@/data/partner/technicalLandscapeStore';
import { listMemoryItems, getReadinessScore } from '@/data/partner/accountMemoryStore';
import { listContentRequests } from '@/data/partner/contentRequestStore';
import { listSignals } from '@/data/partner/signalStore';
import { listAccountSignals } from '@/data/partner/accountSignalStore';
import { getByFocusId as getPartnerInvolvement } from '@/data/partner/partnerInvolvementStore';
import { getByFocusId as getStrategyPillars } from '@/data/partner/strategyPillarsStore';
import { getByFocusId as getPublicInitiatives } from '@/data/partner/publicInitiativesStore';
import { getByFocusId as getProofArtifacts } from '@/data/partner/proofArtifactsStore';
import { getByScope as getTrendsByScope, getByFocusId as getTrendsByFocus } from '@/data/partner/industryAuthorityTrendsStore';
import { toIsoWeekKeyFromWeekOf } from '@/lib/partnerIds';

export function resolveAccountIntelligence(input: {
  focusId?: string;
  account_id?: string;
  hubOrgId?: string;
  hub_org_id?: string;
  weekOf?: string;
  weekKey?: string;
  week_of?: string;
  timeKey?: string;
  vendorId?: string;
}): AccountIntelligenceVM {
  const meta = resolveCanonicalMeta({
    focusId: input.focusId ?? input.account_id,
    hubOrgId: input.hubOrgId ?? input.hub_org_id,
    weekOf: input.weekOf,
    weekKey: input.weekKey,
    week_of: input.week_of,
    timeKey: input.timeKey,
  });

  // Curated stores
  const snapshot = getSnapshot(meta.focusId);
  const commercial = getCommercial(meta.focusId);
  const technical = getTechnical(meta.focusId);
  const partnerInvolvement = getPartnerInvolvement(meta.focusId);
  const strategyPillars = getStrategyPillars(meta.focusId);
  const publicInitiatives = getPublicInitiatives(meta.focusId);
  const proofArtifacts = getProofArtifacts(meta.focusId);
  const industryAuthorityTrends =
    getTrendsByScope(meta.hubOrgId, meta.focusId) ?? getTrendsByFocus(meta.focusId);

  // Signal history — combine signalStore + accountSignalStore
  const signalHistory: SignalHistoryItem[] = [];

  // From canonical signalStore
  const signals = listSignals(meta.focusId);
  for (const s of signals) {
    signalHistory.push({
      id: s.id,
      focusId: s.focusId,
      weekKey: toIsoWeekKeyFromWeekOf(s.weekOf),
      category: s.type,
      signal_type: s.type,
      description: s.title,
      implication: s.soWhat,
      impact_level: s.confidenceLabel,
      source: s.sources[0],
      timestampLabel: s.weekOf,
    });
  }

  // From accountSignalStore
  const acctSignals = listAccountSignals(snapshot?.hubOrgId ?? meta.hubOrgId, {
    account_id: meta.focusId,
  });
  for (const as of acctSignals) {
    // Avoid duplicates by ID
    if (signalHistory.some((h) => h.id === as.id)) continue;
    signalHistory.push({
      id: as.id,
      focusId: as.account_id,
      weekKey: toIsoWeekKeyFromWeekOf(as.week_of),
      category: 'account',
      signal_type: 'account',
      description: as.headline,
      implication: as.why_it_converts,
      impact_level: as.confidence,
      source: as.source_notes,
      timestampLabel: as.week_of,
    });
  }

  // Inbox + requests (account_id == focusId)
  const inbox = listMemoryItems(meta.focusId);
  const requests = listContentRequests(meta.focusId);

  // Readiness
  const hasPromotedSignals = signalHistory.length > 0;
  const readiness = getReadinessScore(meta.focusId, hasPromotedSignals);

  return {
    meta: { ...meta, vendorId: input.vendorId ?? meta.vendorId },
    snapshot,
    commercial,
    technical,
    partnerInvolvement,
    strategyPillars,
    publicInitiatives,
    proofArtifacts,
    industryAuthorityTrends,
    signalHistory,
    inbox,
    requests,
    readiness,
  };
}
