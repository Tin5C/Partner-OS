// Runtime validation for demo artifact safety
// Throws clear errors when precomputed data violates contracts

import type { QuickBriefV1, StoryCardsV1, PlayV1, DealBriefV1, MicrocastV1 } from './contracts';

function fail(artifact: string, msg: string): never {
  throw new Error(`Demo artifact invalid: ${artifact} ${msg}`);
}

function assertArrayLen(arr: unknown[], min: number, max: number, artifact: string, field: string) {
  if (arr.length < min || arr.length > max) {
    fail(artifact, `requires ${min}–${max} ${field}, got ${arr.length}`);
  }
}

function assertExactLen(arr: unknown[], len: number, artifact: string, field: string) {
  if (arr.length !== len) {
    fail(artifact, `requires exactly ${len} ${field}, got ${arr.length}`);
  }
}

export function assertQuickBriefV1(c: QuickBriefV1): void {
  const a = 'quickBrief.v1';
  assertExactLen(c.whatChanged, 3, a, 'whatChanged bullets');
  assertExactLen(c.actions, 3, a, 'actions');
  assertExactLen(c.whatsMissing, 3, a, 'whatsMissing items');
}

export function assertStoryCardsV1(c: StoryCardsV1): void {
  const a = 'storyCards.v1';
  assertArrayLen(c.cards, 0, 6, a, 'cards');
}

export function assertDealBriefV1(c: DealBriefV1): void {
  const a = 'dealBrief.v1';
  assertArrayLen(c.topSignals, 0, 3, a, 'topSignals');
  assertArrayLen(c.stakeholders, 0, 12, a, 'stakeholders');
  assertArrayLen(c.recommendedPlays, 0, 3, a, 'recommendedPlays');
}

export function assertPlayV1(c: PlayV1): void {
  const a = 'play.v1';
  assertArrayLen(c.triggers, 3, 6, a, 'triggers');
  assertArrayLen(c.talkTrack, 6, 10, a, 'talkTrack items');
  assertArrayLen(c.objections, 5, 8, a, 'objections');
  assertArrayLen(c.proofArtifacts, 5, 10, a, 'proofArtifacts');
  assertArrayLen(c.discoveryPrompts, 6, 10, a, 'discoveryPrompts');
  assertArrayLen(c.nextActions, 2, 4, a, 'nextActions');
  assertArrayLen(c.redFlags, 3, 5, a, 'redFlags');
  if (c.estMinutes < 3 || c.estMinutes > 6) {
    fail(a, `requires estMinutes 3–6, got ${c.estMinutes}`);
  }
}

export function assertMicrocastV1(c: MicrocastV1): void {
  const a = 'microcast.v1';
  assertExactLen(c.actions, 3, a, 'actions');
  assertExactLen(c.proofArtifacts, 3, a, 'proofArtifacts');
  assertArrayLen(c.sourceStoryIds, 1, 6, a, 'sourceStoryIds');
  const validTypes = ['account', 'industry'];
  if (!validTypes.includes(c.microcastType)) {
    fail(a, `invalid microcastType "${c.microcastType}"`);
  }
}
