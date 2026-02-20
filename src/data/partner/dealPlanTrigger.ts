// Deal Plan Trigger Store
// Module-level singleton that carries signal context to Deal Planning
// Uses CustomEvent to notify already-mounted components

export interface DealPlanTriggerContext {
  signalId: string;
  customer: string;
  signalTitle: string;
  tags?: string[];
  /** Account ID for signal-first entry */
  focusId?: string;
  /** Entry source */
  entry?: 'quickbrief' | 'inbox' | 'story' | 'ai_trend';
  /** Authority trend focus (ai_trend entry) */
  trendId?: string;
  trendTitle?: string;
}

let _pending: DealPlanTriggerContext | null = null;

export const DEAL_PLAN_TRIGGER_EVENT = 'dealPlanTrigger';

/** Set trigger context and dispatch event */
export function setDealPlanTrigger(ctx: DealPlanTriggerContext) {
  _pending = ctx;
  window.dispatchEvent(new CustomEvent(DEAL_PLAN_TRIGGER_EVENT));
}

/** Consume trigger context (called once by PartnerModeSection, then cleared) */
export function consumeDealPlanTrigger(): DealPlanTriggerContext | null {
  const ctx = _pending;
  _pending = null;
  return ctx;
}
