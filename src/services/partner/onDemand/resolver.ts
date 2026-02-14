// OnDemand Resolver — scoped lookup for briefing artifacts + selections

import type { OnDemandVM, OnDemandScope } from './contract';
import { listBriefingArtifacts } from '@/data/partner/briefingArtifactStore';
import { listBriefingSelections } from '@/data/partner/briefingSelectionStore';

const DEFAULT_ORG = 'alpnova';

export function resolveOnDemand(
  scope: OnDemandScope,
  options?: { org_id?: string },
): OnDemandVM {
  const org_id = options?.org_id ?? DEFAULT_ORG;

  const filters: Parameters<typeof listBriefingArtifacts>[1] = {};
  if (scope.type === 'account') {
    filters.account_id = scope.account_id;
  }

  const artifacts = listBriefingArtifacts(org_id, filters);
  const selections = listBriefingSelections();

  return {
    scope,
    artifacts,
    selections,
  };
}
