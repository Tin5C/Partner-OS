// Account Intelligence — stable contract types

import type { AccountSnapshot } from '@/data/partner/accountSnapshotStore';
import type { CommercialFootprint } from '@/data/partner/commercialFootprintStore';
import type { TechnicalLandscape } from '@/data/partner/technicalLandscapeStore';
import type { AccountMemoryItem } from '@/data/partner/accountMemoryStore';
import type { ContentRequest } from '@/data/partner/contentRequestStore';
import type { EvidencePillar } from '@/data/partner/accountMemoryStore';
import type { PartnerInvolvement } from '@/data/partner/partnerInvolvementStore';

export interface SignalHistoryItem {
  id: string;
  focusId: string;
  weekKey: string;
  category?: string;
  signal_type?: string;
  description: string;
  implication?: string;
  impact_level?: string;
  source?: string;
  timestampLabel?: string;
}

export interface AccountIntelligenceVM {
  meta: { hubOrgId: string; focusId: string; weekKey: string; vendorId?: string };
  snapshot: AccountSnapshot | null;
  commercial: CommercialFootprint | null;
  technical: TechnicalLandscape | null;
  partnerInvolvement: PartnerInvolvement | null;
  signalHistory: SignalHistoryItem[];
  inbox: AccountMemoryItem[];
  requests: ContentRequest[];
  readiness: {
    score: number;
    pillars: Record<EvidencePillar, boolean>;
  };
}
