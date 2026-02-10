// Partner Data Layer — barrel export
export * from './contracts';
export type { PartnerDataProvider, ActiveContext } from './PartnerDataProvider';
export { DemoPartnerDataProvider } from './providers/DemoPartnerDataProvider';
export { LivePartnerDataProvider } from './providers/LivePartnerDataProvider';

// Briefing Artifact store (generic uploaded content)
export * from './briefingArtifactStore';

// Engagement tracking
export * from './engagementStore';

// Legacy exports (kept for backward compat during migration)
export type { FocusDataProvider } from './FocusDataProvider';
export { LiveFocusDataProvider } from './FocusDataProvider';
export { DemoFocusDataProvider } from './DemoFocusDataProvider';
