// Demo Vendor Data Provider — reads from seeded demo data
// No dependency on Partner providers

import type { VendorDataProvider } from '../VendorDataProvider';
import type {
  EnablementAtom,
  AtomType,
  GovernanceStatus,
  ProgramSignal,
  PublishingTarget,
  VendorInsightEvent,
} from '../contracts';
import {
  demoEnablementAtoms,
  demoProgramSignals,
  demoPublishingTargets,
  demoInsightEvents,
} from '../demo/demoVendorData';

export class DemoVendorDataProvider implements VendorDataProvider {
  private atoms = [...demoEnablementAtoms];
  private signals = [...demoProgramSignals];
  private targets = [...demoPublishingTargets];
  private insights = [...demoInsightEvents];

  listAtoms(filters?: { vendorId?: string; atomType?: AtomType; status?: GovernanceStatus }): EnablementAtom[] {
    let result = this.atoms;
    if (filters?.vendorId) result = result.filter(a => a.vendorId === filters.vendorId);
    if (filters?.atomType) result = result.filter(a => a.atomType === filters.atomType);
    if (filters?.status) result = result.filter(a => a.governance.status === filters.status);
    return result;
  }

  getAtom(id: string): EnablementAtom | null {
    return this.atoms.find(a => a.id === id) ?? null;
  }

  listProgramSignals(vendorId?: string): ProgramSignal[] {
    if (vendorId) return this.signals.filter(s => s.vendorId === vendorId);
    return this.signals;
  }

  listPublishingTargets(atomId?: string): PublishingTarget[] {
    if (atomId) return this.targets.filter(t => t.atomId === atomId);
    return this.targets;
  }

  publishAtom(atomId: string, targetSegment: string): PublishingTarget {
    const target: PublishingTarget = {
      id: `pub-${Date.now()}`,
      atomId,
      targetSegment,
      publishedAt: new Date().toISOString(),
    };
    this.targets.push(target);
    return target;
  }

  listInsights(vendorId?: string): VendorInsightEvent[] {
    if (vendorId) return this.insights.filter(i => i.vendorId === vendorId);
    return this.insights;
  }
}
