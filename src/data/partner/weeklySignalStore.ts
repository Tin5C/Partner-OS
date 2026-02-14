// WeeklySignal Store (Partner Space only)
// Index layer: curated weekly signals per customer, materialized from ExtractorRuns.

import type { ExtractorRun } from './extractorRunStore';

export interface CuratedSignalSourceRef {
  label: string;
  urlOrInternalNote?: string;
}

export interface CuratedWeeklySignal {
  id: string;
  spaceId: 'partner';
  customerId: string;
  timeKey: string; // ISO week, e.g. "2026-W07"
  rank: number; // 1–5
  title: string;
  whatChangedBullets: [string, string, string]; // exactly 3
  soWhat: string;
  recommendedActions: string[]; // 1–3 bullets
  sourceRefs: CuratedSignalSourceRef[];
  linkedExtractorRunId: string;
  isPlaceholder: boolean;
  createdAt: string;
}

// ============= In-memory store =============

const store: CuratedWeeklySignal[] = [];
let nextId = 1;

// ============= Week alias map (weekOf ↔ weekKey) =============

const weekAliasMap = new Map<string, string>(); // bidirectional: weekOf→weekKey, weekKey→weekOf

export function registerWeekAlias(weekOf: string, weekKey: string): void {
  weekAliasMap.set(weekOf, weekKey);
  weekAliasMap.set(weekKey, weekOf);
}

export function resolveWeekAlias(input: string): string | undefined {
  return weekAliasMap.get(input);
}

// ============= Query =============

export function listWeeklySignals(customerId: string, timeKey: string): CuratedWeeklySignal[] {
  return store
    .filter((s) => s.customerId === customerId && s.timeKey === timeKey)
    .sort((a, b) => a.rank - b.rank);
}

export function getWeeklySignal(id: string): CuratedWeeklySignal | null {
  return store.find((s) => s.id === id) ?? null;
}

export function hasWeeklySignals(customerId: string, timeKey: string): boolean {
  return store.some((s) => s.customerId === customerId && s.timeKey === timeKey);
}

// ============= Materialization from ExtractorRun =============

export function materializeWeeklySignals(run: ExtractorRun): CuratedWeeklySignal[] {
  // Register week alias if both formats available
  if (run.weekOfDate && run.timeKey) {
    registerWeekAlias(run.weekOfDate, run.timeKey);
  }
  if (run.meta?.weekKey && run.weekOfDate) {
    registerWeekAlias(run.weekOfDate, run.meta.weekKey);
  }

  // Remove existing signals for this customer+timeKey+run to avoid duplicates
  const existing = store.filter(
    (s) => s.customerId === run.customerId && s.timeKey === run.timeKey && s.linkedExtractorRunId === run.id
  );
  for (const e of existing) {
    const idx = store.indexOf(e);
    if (idx >= 0) store.splice(idx, 1);
  }

  const parsed = parseRawSignals(run.rawText);
  const created: CuratedWeeklySignal[] = [];

  const count = Math.min(parsed.length, 5);
  for (let i = 0; i < count; i++) {
    const p = parsed[i];
    const signal: CuratedWeeklySignal = {
      id: `ws-${nextId++}`,
      spaceId: 'partner',
      customerId: run.customerId,
      timeKey: run.timeKey,
      rank: i + 1,
      title: p.title,
      whatChangedBullets: padToThree(p.bullets),
      soWhat: p.soWhat || `Key development for ${run.customerId} this week.`,
      recommendedActions: p.actions.length > 0 ? p.actions.slice(0, 3) : ['Review and assess impact.'],
      sourceRefs: p.sources,
      linkedExtractorRunId: run.id,
      isPlaceholder: false,
      createdAt: new Date().toISOString(),
    };
    store.push(signal);
    created.push(signal);
  }

  // Fill placeholders up to rank 5
  for (let rank = count + 1; rank <= 5; rank++) {
    const placeholder: CuratedWeeklySignal = {
      id: `ws-${nextId++}`,
      spaceId: 'partner',
      customerId: run.customerId,
      timeKey: run.timeKey,
      rank,
      title: 'No curated signal yet',
      whatChangedBullets: ['No curated signal yet.', 'Check back after the next extraction.', 'Or switch to On-Demand for instant research.'],
      soWhat: 'No curated signal yet.',
      recommendedActions: ['Wait for next extraction or use On-Demand.'],
      sourceRefs: [],
      linkedExtractorRunId: run.id,
      isPlaceholder: true,
      createdAt: new Date().toISOString(),
    };
    store.push(placeholder);
    created.push(placeholder);
  }

  return created;
}

// ============= Parsing helpers =============

interface ParsedSignal {
  title: string;
  bullets: string[];
  soWhat: string;
  actions: string[];
  sources: CuratedSignalSourceRef[];
}

function parseRawSignals(rawText: string): ParsedSignal[] {
  const blocks = rawText
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);

  const results: ParsedSignal[] = [];

  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const title = lines[0].replace(/^[\d.)\-*]+\s*/, '').trim();
    if (!title || title.length < 5) continue;

    const bullets = lines.slice(1).map((l) => l.replace(/^[\-*•]+\s*/, '').trim());

    results.push({
      title,
      bullets,
      soWhat: bullets[0] || '',
      actions: bullets.length > 1 ? [bullets[bullets.length - 1]] : [],
      sources: [],
    });

    if (results.length >= 5) break;
  }

  return results;
}

function padToThree(arr: string[]): [string, string, string] {
  const padded = [...arr];
  while (padded.length < 3) padded.push('—');
  return [padded[0], padded[1], padded[2]];
}

// ============= Seed from demo signals =============

import { listSignals } from './signalStore';

export function seedWeeklySignalsFromSignalStore(): void {
  const CUSTOMER = 'schindler';
  const TIME_KEY = '2026-W07';
  const WEEK_OF = '2026-02-10';

  // Register alias so both formats resolve
  registerWeekAlias(WEEK_OF, TIME_KEY);

  if (hasWeeklySignals(CUSTOMER, TIME_KEY)) return;

  const signals = listSignals('schindler', '2026-02-10');
  const seeded: CuratedWeeklySignal[] = signals.slice(0, 5).map((s, i) => ({
    id: `ws-seed-${i + 1}`,
    spaceId: 'partner' as const,
    customerId: CUSTOMER,
    timeKey: TIME_KEY,
    rank: i + 1,
    title: s.title,
    whatChangedBullets: padToThree(s.whatChanged),
    soWhat: s.soWhat,
    recommendedActions: [s.recommendedAction],
    sourceRefs: s.sources.map((src) => ({ label: src })),
    linkedExtractorRunId: 'seed-demo',
    isPlaceholder: false,
    createdAt: s.createdAt,
  }));

  store.push(...seeded);
}

seedWeeklySignalsFromSignalStore();
