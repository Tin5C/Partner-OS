// QuickBrief Resolver — single source for brief signals

import type { QuickBriefVM } from './contract';
import { getQuickBrief } from '@/data/partner/quickBriefStore';
import { listSignals, getSignal } from '@/data/partner/signalStore';

export function resolveQuickBrief(
  account_id: string,
  options?: { weekOf?: string },
): QuickBriefVM {
  const weekOf = options?.weekOf ?? '2026-02-10';

  const brief = getQuickBrief(account_id, weekOf);
  const allSignals = listSignals(account_id, weekOf);

  const signals = brief
    ? brief.signalIds
        .map((id) => getSignal(id))
        .filter((s): s is NonNullable<typeof s> => s !== null)
    : [];

  return {
    account_id,
    weekOf,
    brief,
    signals,
    allSignals,
  };
}
