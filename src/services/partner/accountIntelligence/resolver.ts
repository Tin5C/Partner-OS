// AccountIntelligence Resolver — single entry point for all account context
// Other modules MUST read account context through this resolver.

import type { AccountIntelligenceVM } from './contract';
import { listMemoryItems, getReadinessScore } from '@/data/partner/accountMemoryStore';
import { listAccountSignals } from '@/data/partner/accountSignalStore';
import { listObjections } from '@/data/partner/objectionStore';
import { listContentRequests } from '@/data/partner/contentRequestStore';
import { listExtractorRuns } from '@/data/partner/extractorRunStore';
import { listWeeklySignals } from '@/data/partner/weeklySignalStore';

const DEFAULT_ORG = 'alpnova';

export function resolveAccountIntelligence(
  account_id: string,
  options?: { org_id?: string; timeKey?: string; weekOf?: string; hasPromotedSignals?: boolean },
): AccountIntelligenceVM {
  const org_id = options?.org_id ?? DEFAULT_ORG;
  const timeKey = options?.timeKey ?? '2026-W07';
  const weekOf = options?.weekOf;

  return {
    account_id,
    evidenceItems: listMemoryItems(account_id),
    readiness: getReadinessScore(account_id, options?.hasPromotedSignals ?? false),
    accountSignals: listAccountSignals(org_id, { account_id, week_of: weekOf }),
    objections: listObjections(org_id, { account_id }),
    contentRequests: listContentRequests(account_id),
    extractorRuns: listExtractorRuns(account_id, timeKey),
    weeklySignals: listWeeklySignals(account_id, timeKey),
  };
}
