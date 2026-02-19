// SchindlerDefaults — ensures Schindler account is prepopulated for Deal Planning on each session
// Partner-only, in-memory, idempotent (runs once per session)

import { listMemoryItems } from '@/data/partner/accountMemoryStore';
import { seedHelioWorksDemo } from './helioworksSeed';
import { setDealPlanningSelection } from '@/data/partner/dealPlanningSelectionStore';
import { addActiveSignal } from '@/partner/data/dealPlanning/activeSignalsStore';

let didInit = false;

export function ensureSchindlerDefaults(): void {
  if (didInit) return;
  didInit = true;

  // A) Ensure evidence exists (helioworksSeed is idempotent via its own guard)
  if (listMemoryItems('schindler').length === 0) {
    seedHelioWorksDemo();
  }

  // B) Preselect type + motion
  setDealPlanningSelection('schindler', {
    type: 'New Logo',
    motion: 'Strategic Pursuit',
  });

  // C) Preselect drivers (idempotent — addActiveSignal returns true if already present)
  addActiveSignal('schindler', 'sig-sch-finops-ai');
  addActiveSignal('schindler', 'sig-sch-ai-governance');
}
