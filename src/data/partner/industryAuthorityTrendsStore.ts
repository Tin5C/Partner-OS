// IndustryAuthorityTrends — analyst / regulator / industry body trends
// In-memory singleton. Additive only.

export type IndustryAuthorityTrend = {
  id: string;
  hubOrgId: string;
  focusId: string;
  scope_id?: string;

  trend_title: string;
  thesis_summary: string;
  why_it_matters: string;

  impact_type?: string;
  urgency_level?: 'low' | 'medium' | 'high';
  strategic_direction_tags?: string[];

  source_org: string;
  source_type?: 'analyst' | 'regulator' | 'industry_body' | 'research' | 'media' | 'other';
  source_url?: string;
  source_published_at?: string;
};

export type IndustryAuthorityTrendsPack = {
  hubOrgId: string;
  focusId: string;
  items: IndustryAuthorityTrend[];
};

const store: IndustryAuthorityTrendsPack[] = [];

export function getByScope(hubOrgId: string, focusId: string): IndustryAuthorityTrendsPack | null {
  return store.find((s) => s.hubOrgId === hubOrgId && s.focusId === focusId) ?? null;
}

export function getByFocusId(focusId: string): IndustryAuthorityTrendsPack | null {
  return store.find((s) => s.focusId === focusId) ?? null;
}

export function upsert(pack: IndustryAuthorityTrendsPack): IndustryAuthorityTrendsPack {
  const idx = store.findIndex((s) => s.hubOrgId === pack.hubOrgId && s.focusId === pack.focusId);
  if (idx >= 0) {
    store[idx] = { ...store[idx], ...pack };
    return store[idx];
  }
  store.push(pack);
  return pack;
}

// ============= Seed =============

function seedDemoData(): void {
  if (getByScope('helioworks', 'schindler')) return;
  upsert({
    hubOrgId: 'helioworks',
    focusId: 'schindler',
    items: [
      {
        id: 'iat-001',
        hubOrgId: 'helioworks',
        focusId: 'schindler',
        trend_title: 'EU AI Act - High-Risk Classification for Industrial IoT',
        thesis_summary:
          'The EU AI Act classifies AI systems controlling safety-critical infrastructure (elevators, escalators) as high-risk, requiring conformity assessments and human oversight by 2027.',
        why_it_matters:
          'Schindler predictive maintenance AI may need re-certification, creating urgency for compliant ML-ops tooling.',
        impact_type: 'Regulatory',
        urgency_level: 'high',
        strategic_direction_tags: ['AI Governance', 'Compliance', 'IoT'],
        source_org: 'European Commission',
        source_type: 'regulator',
        source_url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
        source_published_at: '2025-08-01',
      },
      {
        id: 'iat-002',
        hubOrgId: 'helioworks',
        focusId: 'schindler',
        trend_title: 'Gartner: Digital Twin Adoption in Building Management to Triple by 2028',
        thesis_summary:
          'Gartner forecasts that 60% of large building-management operators will adopt digital twins for predictive operations by 2028, up from roughly 20% today.',
        why_it_matters:
          'Schindler smart-building strategy aligns directly; early investment in Azure Digital Twins positions them ahead of competitors.',
        impact_type: 'Market',
        urgency_level: 'medium',
        strategic_direction_tags: ['Digital Twin', 'Smart Buildings', 'Azure'],
        source_org: 'Gartner',
        source_type: 'analyst',
        source_published_at: '2026-01-15',
      },
      {
        id: 'iat-003',
        hubOrgId: 'helioworks',
        focusId: 'schindler',
        trend_title: 'Swiss Federal Data Sovereignty Framework - Mandatory by 2027',
        thesis_summary:
          'Switzerland revised FADP and sectoral ordinances will require critical-infrastructure operators to demonstrate data residency and processing locality for AI workloads.',
        why_it_matters:
          'Schindler must prove Swiss-resident AI processing; Azure Switzerland regions become a strategic advantage.',
        impact_type: 'Regulatory',
        urgency_level: 'high',
        strategic_direction_tags: ['Data Sovereignty', 'Compliance', 'Cloud'],
        source_org: 'FDPIC',
        source_type: 'regulator',
        source_url: 'https://www.edoeb.admin.ch',
        source_published_at: '2025-11-20',
      },
      {
        id: 'iat-004',
        hubOrgId: 'helioworks',
        focusId: 'schindler',
        trend_title: 'McKinsey: Generative AI in Field Service - 30% Efficiency Gains Projected',
        thesis_summary:
          'McKinsey research indicates that Gen-AI-augmented field-service workflows (dispatch, diagnostics, knowledge retrieval) can deliver 25-35% efficiency improvements within 18 months of deployment.',
        why_it_matters:
          'Schindler 60,000+ field technicians represent a massive Gen-AI opportunity; Copilot-based tooling is a natural entry point.',
        impact_type: 'Operational',
        urgency_level: 'medium',
        strategic_direction_tags: ['Gen AI', 'Field Service', 'Copilot'],
        source_org: 'McKinsey & Company',
        source_type: 'analyst',
        source_published_at: '2026-01-08',
      },
    ],
  });
}

seedDemoData();
