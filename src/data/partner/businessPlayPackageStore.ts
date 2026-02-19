// BusinessPlayPackage Store — materialized Composer outputs for Deal Planning Business tab
// In-memory singleton. Partner-only. No mutations to other stores.

export type BusinessVariant = 'executive' | 'grounded';

export interface TalkTrack {
  persona: string;
  message: string;
}

export interface ValueHypothesis {
  label: string;
  description: string;
}

export interface KPI {
  label: string;
  target: string;
}

export interface SizingInput {
  label: string;
  value: string;
}

export interface ROIPrompt {
  label: string;
  question: string;
}

export interface DiscoveryQuestion {
  theme: string;
  question: string;
}

export interface WorkshopStep {
  step: string;
  description: string;
}

export interface PilotScope {
  in_scope: string[];
  out_of_scope: string[];
  deliverables: string[];
  stakeholders: string[];
}

export interface EnablementBlock {
  seller: string[];
  engineer: string[];
}

export interface BusinessBlock {
  deal_strategy: {
    what: string;
    how: string[];
    why: string;
  };
  positioning: {
    executive_pov: string;
    talk_tracks: TalkTrack[];
  };
  commercial_assets: {
    roi_prompts: ROIPrompt[];
    value_hypotheses: ValueHypothesis[];
    kpis: KPI[];
    sizing_inputs: SizingInput[];
  };
  delivery_assets: {
    discovery_agenda: DiscoveryQuestion[];
    workshop_plan: WorkshopStep[];
    pilot_scope: PilotScope;
  };
  enablement: EnablementBlock;
  open_questions: string[];
}

export interface BusinessPlayPackage {
  variant: BusinessVariant;
  focus_id: string;
  play_id: string;
  type: string;
  motion: string;
  title: string;
  business: BusinessBlock;
  created_at: string;
}

// ============= Store =============

const store: BusinessPlayPackage[] = [];

export function seedBusinessPlayPackages(packages: BusinessPlayPackage[]): void {
  for (const pkg of packages) {
    const exists = store.some(
      (p) =>
        p.focus_id === pkg.focus_id &&
        p.play_id === pkg.play_id &&
        p.type === pkg.type &&
        p.motion === pkg.motion &&
        p.variant === pkg.variant,
    );
    if (!exists) store.push(pkg);
  }
}

export function getBusinessPlayPackage(params: {
  focusId: string;
  playId: string;
  type: string;
  motion: string;
  variant: BusinessVariant;
}): BusinessPlayPackage | null {
  return (
    store.find(
      (p) =>
        p.focus_id === params.focusId &&
        p.play_id === params.playId &&
        p.type === params.type &&
        p.motion === params.motion &&
        p.variant === params.variant,
    ) ?? null
  );
}

export function getAvailableVariants(params: {
  focusId: string;
  playId: string;
  type: string;
  motion: string;
}): BusinessVariant[] {
  const variants: BusinessVariant[] = [];
  for (const v of ['executive', 'grounded'] as BusinessVariant[]) {
    if (
      store.some(
        (p) =>
          p.focus_id === params.focusId &&
          p.play_id === params.playId &&
          p.type === params.type &&
          p.motion === params.motion &&
          p.variant === v,
      )
    ) {
      variants.push(v);
    }
  }
  return variants;
}
