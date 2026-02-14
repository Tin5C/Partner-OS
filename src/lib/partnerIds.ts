// Canonical ID helpers for Partner Space
// Deterministic, tiny, no side-effects.

/** Normalize hub org ID — defaults to "helioworks" for demo safety */
export function canonicalHubOrgId(input?: string): string {
  if (!input || !input.trim()) return 'helioworks';
  return input.trim().toLowerCase();
}

/** Normalize vendor ID — strips "vendor-" prefix, lowercases */
export function canonicalVendorId(input?: string): string {
  if (!input || !input.trim()) return 'microsoft';
  return input.trim().toLowerCase().replace(/^vendor-/, '');
}

/** Normalize focus/account ID — defaults to "schindler" for demo safety */
export function canonicalFocusId(input?: string): string {
  if (!input || !input.trim()) return 'schindler';
  return input.trim().toLowerCase();
}

/** Convert an ISO date string (e.g. "2026-02-10") to ISO week key (e.g. "2026-W07") */
export function toIsoWeekKeyFromWeekOf(weekOfISODate: string): string {
  const d = new Date(weekOfISODate + 'T00:00:00Z');
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

/** Resolve a canonical ISO week key from any of the known temporal fields.
 *  Priority: weekKey > timeKey > weekOf > week_of */
export function toIsoWeekKey(input: {
  weekKey?: string;
  timeKey?: string;
  weekOf?: string;
  week_of?: string;
}): string {
  if (input.weekKey) return input.weekKey;
  if (input.timeKey) return input.timeKey;
  if (input.weekOf) return toIsoWeekKeyFromWeekOf(input.weekOf);
  if (input.week_of) return toIsoWeekKeyFromWeekOf(input.week_of);
  // Fallback to current week
  const now = new Date();
  return toIsoWeekKeyFromWeekOf(now.toISOString().slice(0, 10));
}
