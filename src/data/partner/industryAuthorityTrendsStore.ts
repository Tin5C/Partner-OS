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

// ============= Module 3 JSON → Store Converter =============

function fromModule3(pack: {
  hubOrgId: string;
  focusId: string;
  trends: Array<{
    trend_id: string;
    trend_title: string;
    thesis_summary: string;
    source_org: string;
    source_type?: string;
    source_url?: string;
    source_published_at?: string;
    applied_to_focus?: {
      why_it_matters_business?: string;
    };
  }>;
}): IndustryAuthorityTrendsPack {
  return {
    hubOrgId: pack.hubOrgId,
    focusId: pack.focusId,
    items: (pack.trends ?? []).map((t) => ({
      id: t.trend_id,
      hubOrgId: pack.hubOrgId,
      focusId: pack.focusId,
      trend_title: t.trend_title,
      thesis_summary: t.thesis_summary,
      why_it_matters: t?.applied_to_focus?.why_it_matters_business ?? 'DATA NEEDED',
      source_org: t.source_org,
      source_type: (t.source_type as IndustryAuthorityTrend['source_type']) ?? undefined,
      source_url: t.source_url ?? undefined,
      source_published_at: t.source_published_at ?? undefined,
      impact_type: undefined,
      urgency_level: undefined,
      strategic_direction_tags: undefined,
    })),
  };
}

// ============= Module 3 JSON Pack (Schindler) =============

const SCHINDLER_MODULE3 = {
  hubOrgId: 'helioworks',
  focusId: 'schindler',
  trends: [
    {
      trend_id: 'iat-001',
      trend_title: 'EU AI Act — High-Risk Classification for Industrial IoT',
      thesis_summary:
        'The EU AI Act classifies AI systems controlling safety-critical infrastructure (elevators, escalators) as high-risk, requiring conformity assessments and human oversight by 2027.',
      source_org: 'European Commission',
      source_type: 'regulator',
      source_url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      source_published_at: '2025-08-01',
      applied_to_focus: {
        why_it_matters_business:
          'Schindler predictive-maintenance AI may need re-certification, creating urgency for compliant ML-ops tooling and audit-trail infrastructure.',
      },
    },
    {
      trend_id: 'iat-002',
      trend_title: 'Gartner: Digital Twin Adoption in Building Management to Triple by 2028',
      thesis_summary:
        'Gartner forecasts that 60 % of large building-management operators will adopt digital twins for predictive operations by 2028, up from roughly 20 % today.',
      source_org: 'Gartner',
      source_type: 'analyst',
      source_published_at: '2026-01-15',
      applied_to_focus: {
        why_it_matters_business:
          'Schindler smart-building strategy aligns directly; early investment in Azure Digital Twins positions them ahead of competitors.',
      },
    },
    {
      trend_id: 'iat-003',
      trend_title: 'Swiss Federal Data Sovereignty Framework — Mandatory by 2027',
      thesis_summary:
        "Switzerland's revised FADP and sectoral ordinances will require critical-infrastructure operators to demonstrate data residency and processing locality for AI workloads.",
      source_org: 'FDPIC',
      source_type: 'regulator',
      source_url: 'https://www.edoeb.admin.ch',
      source_published_at: '2025-11-20',
      applied_to_focus: {
        why_it_matters_business:
          'Schindler must prove Swiss-resident AI processing; Azure Switzerland regions become a strategic advantage for compliance.',
      },
    },
    {
      trend_id: 'iat-004',
      trend_title: 'McKinsey: Generative AI in Field Service — 30 % Efficiency Gains Projected',
      thesis_summary:
        'McKinsey research indicates that Gen-AI-augmented field-service workflows (dispatch, diagnostics, knowledge retrieval) can deliver 25–35 % efficiency improvements within 18 months of deployment.',
      source_org: 'McKinsey & Company',
      source_type: 'analyst',
      source_published_at: '2026-01-08',
      applied_to_focus: {
        why_it_matters_business:
          "Schindler's 60,000+ field technicians represent a massive Gen-AI opportunity; Copilot-based tooling is a natural entry point.",
      },
    },
    {
      trend_id: 'iat-005',
      trend_title: 'EU Machinery Regulation 2023/1230 — Software as Safety Component',
      thesis_summary:
        'From January 2027 software performing safety functions in machinery (including elevator control systems) must carry CE marking and meet essential health & safety requirements independently of hardware.',
      source_org: 'European Commission',
      source_type: 'regulator',
      source_url: 'https://eur-lex.europa.eu/eli/reg/2023/1230/oj',
      source_published_at: '2025-06-14',
      applied_to_focus: {
        why_it_matters_business:
          "Schindler's embedded firmware and cloud-connected control systems will need independent CE compliance, creating demand for secure DevOps and continuous certification pipelines.",
      },
    },
  ],
};

// ============= Seed =============

function seedDemoData(): void {
  if (getByScope('helioworks', 'schindler')) return;
  const seeded = fromModule3(SCHINDLER_MODULE3);
  store.push(seeded);
}

seedDemoData();
