// Quick Brief Trigger Store
// Module-level singleton that carries story context to QuickBriefSection
// Uses CustomEvent to notify already-mounted components

export interface QuickBriefTriggerContext {
  storyTitle: string;
  customer?: string;
  industry?: string;
  vendor?: string;
  category?: string; // e.g. Vendor, Regulatory, LocalMarket
  tags?: string[];
  /** Canonical meta passed from Story → Quick Brief (optional, additive) */
  canonicalMeta?: {
    focusId: string;
    vendorId: string;
    weekKey: string;
    hubOrgId: string;
  };
}

let _pending: QuickBriefTriggerContext | null = null;

export const QUICK_BRIEF_TRIGGER_EVENT = 'quickBriefTrigger';

/** Set trigger context and dispatch event */
export function setQuickBriefTrigger(ctx: QuickBriefTriggerContext) {
  _pending = ctx;
  window.dispatchEvent(new CustomEvent(QUICK_BRIEF_TRIGGER_EVENT));
}

/** Consume trigger context (called once by QuickBriefSection, then cleared) */
export function consumeQuickBriefTrigger(): QuickBriefTriggerContext | null {
  const ctx = _pending;
  _pending = null;
  return ctx;
}
