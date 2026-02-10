// Vendor Data Provider — Interface for Vendor Space
// Completely isolated from Partner data providers

import type {
  EnablementAtom,
  AtomType,
  GovernanceStatus,
  ProgramSignal,
  PublishingTarget,
  VendorInsightEvent,
} from './contracts';

export interface VendorDataProvider {
  // Enablement Atoms
  listAtoms(filters?: { vendorId?: string; atomType?: AtomType; status?: GovernanceStatus }): EnablementAtom[];
  getAtom(id: string): EnablementAtom | null;

  // Program Signals
  listProgramSignals(vendorId?: string): ProgramSignal[];

  // Publishing
  listPublishingTargets(atomId?: string): PublishingTarget[];
  publishAtom(atomId: string, targetSegment: string): PublishingTarget;

  // Insights
  listInsights(vendorId?: string): VendorInsightEvent[];
}
