// Signal Enrichment — silent completeness check + derived fallbacks
// Ensures every Quick Brief signal has complete structured data.
// Missing fields are filled with contextual derivations, marked as 'derived'.

import type { Signal } from './signalStore';
import { listObjections } from './objectionStore';

export interface EnrichedSignal extends Signal {
  /** Fields that were derived (not from original data) */
  _derivedFields: string[];
}

const STAKEHOLDER_DEFAULTS: Record<string, string[]> = {
  vendor: ['CTO', 'VP Engineering', 'Head of Digital Transformation'],
  regulatory: ['Chief Compliance Officer', 'CISO', 'VP Engineering'],
  competitive: ['CTO', 'VP Strategy', 'Head of Procurement'],
  localMarket: ['Country Manager', 'VP Sales', 'CTO'],
  internalActivity: ['CTO', 'CISO', 'CFO'],
};

const PROOF_DEFAULTS: Record<string, string[]> = {
  vendor: ['Vendor capability brief', 'Reference architecture', 'ROI model'],
  regulatory: ['Regulation summary brief', 'Compliance mapping template', 'Gap analysis framework'],
  competitive: ['Competitive positioning matrix', 'Win/loss analysis', 'Differentiation brief'],
  localMarket: ['Local market analysis', 'Regional reference customers', 'Localization requirements'],
  internalActivity: ['Internal activity summary', 'Engagement timeline', 'Stakeholder mapping'],
};

/**
 * Silently enriches signals with derived fallbacks for missing structured data.
 * No user-facing warnings. Returns signals with complete fields.
 */
export function enrichSignals(signals: Signal[], focusId: string): EnrichedSignal[] {
  return signals.map((signal) => enrichSingle(signal, focusId));
}

function enrichSingle(signal: Signal, focusId: string): EnrichedSignal {
  const derived: string[] = [];

  // 1. Stakeholders (whoCares)
  let whoCares = signal.whoCares;
  if (!whoCares || whoCares.length === 0) {
    whoCares = STAKEHOLDER_DEFAULTS[signal.type] ?? ['CTO', 'CISO'];
    derived.push('whoCares');
  }

  // 2. Objections — check library
  let whatsMissing = signal.whatsMissing;
  if (!whatsMissing || whatsMissing.length === 0) {
    const objections = listObjections('alpnova', { account_id: focusId });
    if (objections.length > 0) {
      whatsMissing = objections.slice(0, 2).map(o => `Objection: ${o.theme} — ${o.root_cause.slice(0, 80)}`);
    } else {
      whatsMissing = [`Confirm ${signal.type} relevance with account stakeholders`];
    }
    derived.push('whatsMissing');
  }

  // 3. Proof artifacts
  let proofToRequest = signal.proofToRequest;
  if (!proofToRequest || proofToRequest.length === 0) {
    proofToRequest = PROOF_DEFAULTS[signal.type] ?? ['Supporting documentation', 'Reference case study'];
    derived.push('proofToRequest');
  }

  // 4. Talk track
  let talkTrack = signal.talkTrack;
  if (!talkTrack || talkTrack.trim().length === 0) {
    talkTrack = `Based on ${signal.title.toLowerCase()}, we recommend discussing ${signal.soWhat.toLowerCase()} Key action: ${signal.recommendedAction}`;
    derived.push('talkTrack');
  }

  // 5. Sources
  let sources = signal.sources;
  if (!sources || sources.length === 0) {
    sources = ['Internal engagement signals'];
    derived.push('sources');
  }

  // 6. Confidence label
  let confidenceLabel = signal.confidenceLabel;
  if (!confidenceLabel) {
    confidenceLabel = signal.confidence >= 70 ? 'High' : signal.confidence >= 40 ? 'Medium' : 'Low';
    derived.push('confidenceLabel');
  }

  return {
    ...signal,
    whoCares,
    whatsMissing,
    proofToRequest,
    talkTrack,
    sources,
    confidenceLabel,
    _derivedFields: derived,
  };
}
