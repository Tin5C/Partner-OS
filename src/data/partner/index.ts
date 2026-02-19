// Partner Data Layer — barrel export
export * from './contracts';
export type { PartnerDataProvider, ActiveContext } from './PartnerDataProvider';
export { DemoPartnerDataProvider } from './providers/DemoPartnerDataProvider';
export { LivePartnerDataProvider } from './providers/LivePartnerDataProvider';

// Briefing Artifact store (generic uploaded content)
export * from './briefingArtifactStore';

// Engagement tracking
export * from './engagementStore';

// Canonical intelligence collections
export * from './accountSignalStore';
export * from './objectionStore';
export * from './partnerProfileStore';

// Legacy deal plan selection store (kept for backward compat)
export {
  listDealPlanSelections,
  getDealPlanSelection,
  removeDealPlanSelection,
  ALL_SECTION_KEYS,
  SECTION_LABELS,
  type DealPlanSelection,
  type DealPlanSectionKey,
  type PromoteSelection,
} from './dealPlanSelectionStore';

// New canonical stores
export * from './dealPlanStore';
export * from './signalStore';
export * from './quickBriefStore';

// Extractor + WeeklySignal layer
export * from './extractorRunStore';
export * from './weeklySignalStore';

// On-Demand Briefing taxonomy + selection
export * from './briefingTaxonomy';
export * from './briefingSelectionStore';

// Prompt Catalog (Phase 1 — governance metadata only)
export * from './promptCatalog';

// HelioWorks demo seed (auto-runs on import)
import './demo/helioworksSeed';

// Legacy exports (kept for backward compat during migration)
export type { FocusDataProvider } from './FocusDataProvider';
export { LiveFocusDataProvider } from './FocusDataProvider';
export { DemoFocusDataProvider } from './DemoFocusDataProvider';
