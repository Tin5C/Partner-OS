// OnDemand Resolver — scoped lookup for briefing artifacts + selections

import type { OnDemandVM, OnDemandScope } from './contract';
import { listBriefingArtifacts } from '@/data/partner/briefingArtifactStore';
import { listBriefingSelections } from '@/data/partner/briefingSelectionStore';
import { orgIdCandidates, canonicalizeOrgId } from '@/lib/orgIdAliases';

export function resolveOnDemand(
  scope: OnDemandScope,
  options?: { org_id?: string },
): OnDemandVM {
  const canonical = canonicalizeOrgId(options?.org_id);

  const filters: Parameters<typeof listBriefingArtifacts>[1] = {};
  if (scope.type === 'account') {
    filters.account_id = scope.account_id;
  }

  // Try alias candidates for org-scoped artifact reads
  let artifacts: ReturnType<typeof listBriefingArtifacts> = [];
  for (const id of orgIdCandidates(canonical)) {
    artifacts = listBriefingArtifacts(id, filters);
    if (artifacts.length) break;
  }

  const selections = listBriefingSelections();

  return {
    scope,
    artifacts,
    selections,
  };
}
