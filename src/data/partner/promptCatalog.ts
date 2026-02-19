// Prompt Catalog — canonical versioned prompt registry (Partner Space only)
// Phase 1: metadata/governance only, no runtime behavior changes.

export interface PromptEntry {
  id: string;
  version: string;
  purpose: string;
  template: string;
  outputContract: string;
  updatedAt: string;
}

const catalog: readonly PromptEntry[] = [
  {
    id: 'extractor.main',
    version: '1.0.0',
    purpose: 'Primary extractor prompt: ingests raw account context and produces Module 0–6 packs.',
    template: [
      'You are an Account Intelligence Extractor.',
      'Given the raw context below, produce a strict JSON object matching the ModulePacks schema.',
      'Module 2 MUST output strict JSON only — no prose, no markdown.',
      'Return ONLY the JSON object, nothing else.',
    ].join('\n'),
    outputContract: 'ModulePacks JSON (see contracts.ts). Module 2 must be valid JSON, no markdown fences.',
    updatedAt: '2026-02-19',
  },
  {
    id: 'composer.business',
    version: '1.0.0',
    purpose: 'Generates the Business Play Package narrative (deal strategy, proof points, open questions).',
    template: [
      'You are a Deal Strategy Composer.',
      'Given the ComposerInputBusiness JSON, produce a BusinessPlayPackage with deal_strategy, proof_points, and open_questions.',
      'Use only facts from the input. Do not hallucinate.',
    ].join('\n'),
    outputContract: 'BusinessPlayPackage JSON matching businessPlayPackageStore.ts schema.',
    updatedAt: '2026-02-19',
  },
  {
    id: 'composer.technical',
    version: '1.0.0',
    purpose: 'Generates technical recommendations for a deal plan.',
    template: [
      'You are a Technical Recommendations Composer.',
      'Given account signals, technical landscape, and service packs, produce structured technical recommendations.',
      'Output strict JSON only.',
    ].join('\n'),
    outputContract: 'TechnicalRecommendationsSection JSON as consumed by TechnicalRecommendationsSection.tsx.',
    updatedAt: '2026-02-19',
  },
  {
    id: 'composer.objection',
    version: '1.0.0',
    purpose: 'Generates objection-handling plays from account context and known objections.',
    template: [
      'You are an Objection Play Composer.',
      'Given objections and account context, produce PlayV1-shaped objection plays.',
      'Each objection must include: objection, response, whatNotToSay, proofArtifact.',
    ].join('\n'),
    outputContract: 'PlayV1 JSON (see contracts.ts PlayV1Objection[]).',
    updatedAt: '2026-02-19',
  },
  {
    id: 'composer.quick_brief',
    version: '1.0.0',
    purpose: 'Generates a QuickBriefV1 summary from weekly signals and account context.',
    template: [
      'You are a Quick Brief Composer.',
      'Given weekly signals and focus context, produce a QuickBriefV1 with whatChanged (3), soWhat, actions (3), whatsMissing (3).',
      'Be concise and actionable.',
    ].join('\n'),
    outputContract: 'QuickBriefV1 JSON (see contracts.ts).',
    updatedAt: '2026-02-19',
  },
] as const;

/** Look up a prompt entry by id. Returns the latest version. */
export function getPromptEntry(id: string): PromptEntry | undefined {
  return catalog.find((e) => e.id === id);
}

/** Look up a prompt entry by id and exact version. */
export function getPromptEntryByVersion(id: string, version: string): PromptEntry | undefined {
  return catalog.find((e) => e.id === id && e.version === version);
}

/** List all registered prompt entries. */
export function listPromptEntries(): readonly PromptEntry[] {
  return catalog;
}
