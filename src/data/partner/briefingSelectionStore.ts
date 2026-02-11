// Persisted selection metadata for On-Demand Briefings (Partner space)
// Stores what the user picked per briefing tile. No scripts/audio — selection only.

import type { BriefingType } from './briefingContracts';

export interface BriefingSelection {
  briefingType: BriefingType;
  /** Selected taxonomy item IDs keyed by picker name */
  picks: Record<string, string>;
  updatedAt: string;
}

const STORAGE_KEY = 'partner_briefing_selections';

function load(): Record<string, BriefingSelection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function persist(data: Record<string, BriefingSelection>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getBriefingSelection(briefingType: BriefingType): BriefingSelection | null {
  return load()[briefingType] ?? null;
}

export function saveBriefingSelection(briefingType: BriefingType, picks: Record<string, string>): BriefingSelection {
  const all = load();
  const sel: BriefingSelection = { briefingType, picks, updatedAt: new Date().toISOString() };
  all[briefingType] = sel;
  persist(all);
  return sel;
}

export function clearBriefingSelection(briefingType: BriefingType) {
  const all = load();
  delete all[briefingType];
  persist(all);
}

export function listBriefingSelections(): BriefingSelection[] {
  return Object.values(load());
}
