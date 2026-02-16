// AccountIntelligence Resolver — single entry point for all account context
// Other modules MUST read account context through this resolver.

import type { AccountIntelligenceVM } from './contract';
import { listMemoryItems, getReadinessScore } from '@/data/partner/accountMemoryStore';
import { listAccountSignals } from '@/data/partner/accountSignalStore';
import { listObjections } from '@/data/partner/objectionStore';
import { listContentRequests } from '@/data/partner/contentRequestStore';
import { listExtractorRuns } from '@/data/partner/extractorRunStore';
import { listWeeklySignals } from '@/data/partner/weeklySignalStore';
import { orgIdCandidates, canonicalizeOrgId } from '@/lib/orgIdAliases';

export function resolveAccountIntelligence(
  account_id: string,
  options?: { org_id?: string; timeKey?: string; weekOf?: string; hasPromotedSignals?: boolean },
): AccountIntelligenceVM {
  const canonical = canonicalizeOrgId(options?.org_id);
  const timeKey = options?.timeKey ?? '2026-W07';
  const weekOf = options?.weekOf;

  // Try alias candidates for org-scoped reads
  let accountSignals: ReturnType<typeof listAccountSignals> = [];
  for (const id of orgIdCandidates(canonical)) {
    accountSignals = listAccountSignals(id, { account_id, week_of: weekOf });
    if (accountSignals.length) break;
  }

  let objections: ReturnType<typeof listObjections> = [];
  for (const id of orgIdCandidates(canonical)) {
    objections = listObjections(id, { account_id });
    if (objections.length) break;
  }

  return {
    account_id,
    evidenceItems: listMemoryItems(account_id),
    readiness: getReadinessScore(account_id, options?.hasPromotedSignals ?? false),
    accountSignals,
    objections,
    contentRequests: listContentRequests(account_id),
    extractorRuns: listExtractorRuns(account_id, timeKey),
    weeklySignals: listWeeklySignals(account_id, timeKey),
  };
}
