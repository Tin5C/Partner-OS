// IndustryAuthorityTrends — analyst / regulator / industry body trends
// In-memory singleton. Additive only.

export type IndustryAuthorityTrend = {
  id: string;
  trend_title: string;
  source_org: string;
  source_type: 'consulting_report' | 'analyst_report' | 'big4_report' | 'standards_body' | 'other';
  source_url: string | null;
  source_published_at: string | null;
  thesis_summary: string;
  applied_to_focus: {
    why_it_matters: string;
    where_it_shows_up: string;
    stakeholders: string[];
    capability_implications: string[];
    mapped_vendor_offer_clusters: string[];
    mapped_hub_org_motions: string[];
  };
  confidence: 'High' | 'Medium' | 'Low';
};

export type IndustryAuthorityTrendsPack = {
  focusId: string;
  industry_label: string;
  trends: IndustryAuthorityTrend[];
  summary: {
    industry_implications: string[];
    near_term_watchouts: string[];
    data_gaps: string[];
  };
  generated_at: string;
};

const packs: IndustryAuthorityTrendsPack[] = [];

export function getByFocusId(focusId: string): IndustryAuthorityTrendsPack | null {
  return packs.find((p) => p.focusId === focusId) ?? null;
}

// ============= Schindler Seed =============

const SCHINDLER_PACK: IndustryAuthorityTrendsPack = {
  focusId: 'schindler',
  industry_label: 'Elevators & Escalators / Building Technology',
  generated_at: '2026-02-14T09:00:00Z',
  summary: {
    industry_implications: [
      'AI-driven predictive maintenance is becoming table-stakes for elevator OEMs.',
      'Regulatory pressure (EU AI Act, EU Machinery Reg) forces compliance-first engineering.',
      'Digital twin adoption is accelerating faster than most building-tech firms anticipated.',
    ],
    near_term_watchouts: [
      'EU AI Act high-risk classification deadlines in 2027 — compliance gap assessments needed now.',
      'Swiss FADP data-residency mandates will constrain multi-cloud strategies.',
    ],
    data_gaps: [
      'Mapped vendor offer clusters not yet confirmed for all trends.',
      'Hub org motions still require internal alignment review.',
    ],
  },
  trends: [
    {
      id: 'iat-001',
      trend_title: 'EU AI Act — High-Risk Classification for Industrial IoT',
      source_org: 'European Commission',
      source_type: 'standards_body',
      source_url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      source_published_at: '2025-08-01',
      thesis_summary:
        'The EU AI Act classifies AI systems controlling safety-critical infrastructure (elevators, escalators) as high-risk, requiring conformity assessments and human oversight by 2027.',
      applied_to_focus: {
        why_it_matters:
          'Schindler predictive-maintenance AI may need re-certification, creating urgency for compliant ML-ops tooling and audit-trail infrastructure.',
        where_it_shows_up:
          'Predictive maintenance models, elevator dispatch optimization, safety-critical firmware updates.',
        stakeholders: ['CTO Office', 'Legal & Compliance', 'AI/ML Engineering'],
        capability_implications: ['MLOps audit trails', 'Conformity assessment tooling', 'Human-in-the-loop orchestration'],
        mapped_vendor_offer_clusters: ['Azure AI', 'Microsoft Purview', 'DATA NEEDED'],
        mapped_hub_org_motions: ['AI Governance Advisory', 'Compliance Accelerator'],
      },
      confidence: 'High',
    },
    {
      id: 'iat-002',
      trend_title: 'Gartner: Digital Twin Adoption in Building Management to Triple by 2028',
      source_org: 'Gartner',
      source_type: 'analyst_report',
      source_url: null,
      source_published_at: '2026-01-15',
      thesis_summary:
        'Gartner forecasts that 60% of large building-management operators will adopt digital twins for predictive operations by 2028, up from roughly 20% today.',
      applied_to_focus: {
        why_it_matters:
          'Schindler smart-building strategy aligns directly; early investment in Azure Digital Twins positions them ahead of competitors.',
        where_it_shows_up:
          'Smart building portfolio, facility management platforms, IoT edge deployments.',
        stakeholders: ['VP Smart Buildings', 'IoT Platform Team', 'Strategic Partnerships'],
        capability_implications: ['Azure Digital Twins integration', 'IoT data pipeline design', 'Building simulation models'],
        mapped_vendor_offer_clusters: ['Azure Digital Twins', 'Azure IoT Hub'],
        mapped_hub_org_motions: ['Digital Twin Readiness Assessment', 'DATA NEEDED'],
      },
      confidence: 'High',
    },
    {
      id: 'iat-003',
      trend_title: 'Swiss Federal Data Sovereignty Framework — Mandatory by 2027',
      source_org: 'FDPIC',
      source_type: 'standards_body',
      source_url: 'https://www.edoeb.admin.ch',
      source_published_at: '2025-11-20',
      thesis_summary:
        "Switzerland's revised FADP and sectoral ordinances will require critical-infrastructure operators to demonstrate data residency and processing locality for AI workloads.",
      applied_to_focus: {
        why_it_matters:
          'Schindler must prove Swiss-resident AI processing; Azure Switzerland regions become a strategic advantage for compliance.',
        where_it_shows_up:
          'Cloud hosting decisions, AI model training pipelines, customer data processing agreements.',
        stakeholders: ['CISO', 'Data Protection Officer', 'Cloud Architecture'],
        capability_implications: ['Swiss-region cloud migration', 'Data residency audit', 'Sovereign cloud architecture'],
        mapped_vendor_offer_clusters: ['Azure Switzerland North/West', 'DATA NEEDED'],
        mapped_hub_org_motions: ['Data Sovereignty Workshop', 'Cloud Residency Assessment'],
      },
      confidence: 'Medium',
    },
    {
      id: 'iat-004',
      trend_title: 'McKinsey: Generative AI in Field Service — 30% Efficiency Gains Projected',
      source_org: 'McKinsey & Company',
      source_type: 'consulting_report',
      source_url: null,
      source_published_at: '2026-01-08',
      thesis_summary:
        'McKinsey research indicates that Gen-AI-augmented field-service workflows (dispatch, diagnostics, knowledge retrieval) can deliver 25–35% efficiency improvements within 18 months of deployment.',
      applied_to_focus: {
        why_it_matters:
          "Schindler's 60,000+ field technicians represent a massive Gen-AI opportunity; Copilot-based tooling is a natural entry point.",
        where_it_shows_up:
          'Field technician dispatch, on-site diagnostics, knowledge base retrieval, parts ordering.',
        stakeholders: ['VP Field Operations', 'Digital Workplace', 'HR & Training'],
        capability_implications: ['Copilot for Field Service', 'RAG-based knowledge retrieval', 'Mobile-first AI UX'],
        mapped_vendor_offer_clusters: ['Microsoft 365 Copilot', 'Azure OpenAI Service', 'DATA NEEDED'],
        mapped_hub_org_motions: ['Copilot Readiness', 'Field Service AI PoC'],
      },
      confidence: 'High',
    },
    {
      id: 'iat-005',
      trend_title: 'EU Machinery Regulation 2023/1230 — Software as Safety Component',
      source_org: 'European Commission',
      source_type: 'standards_body',
      source_url: 'https://eur-lex.europa.eu/eli/reg/2023/1230/oj',
      source_published_at: '2025-06-14',
      thesis_summary:
        'From January 2027 software performing safety functions in machinery (including elevator control systems) must carry CE marking and meet essential health & safety requirements independently of hardware.',
      applied_to_focus: {
        why_it_matters:
          "Schindler's embedded firmware and cloud-connected control systems will need independent CE compliance, creating demand for secure DevOps and continuous certification pipelines.",
        where_it_shows_up:
          'Elevator control firmware, OTA update systems, safety-critical software release pipelines.',
        stakeholders: ['Engineering Leadership', 'Quality & Certification', 'DevOps'],
        capability_implications: ['Secure CI/CD pipelines', 'Continuous certification automation', 'Safety-critical code review'],
        mapped_vendor_offer_clusters: ['GitHub Advanced Security', 'Azure DevOps', 'DATA NEEDED'],
        mapped_hub_org_motions: ['DevSecOps Maturity', 'DATA NEEDED'],
      },
      confidence: 'Medium',
    },
    {
      id: 'iat-006',
      trend_title: 'Deloitte: Sustainability Reporting Mandates Drive Digital Transformation in Building Sector',
      source_org: 'Deloitte',
      source_type: 'big4_report',
      source_url: null,
      source_published_at: '2025-12-03',
      thesis_summary:
        'CSRD and EU Taxonomy reporting requirements are forcing building-technology companies to instrument energy consumption, carbon footprint, and lifecycle data across their installed base.',
      applied_to_focus: {
        why_it_matters:
          'Schindler must provide granular energy and emissions data per elevator/escalator unit to meet customer CSRD reporting demands.',
        where_it_shows_up:
          'ESG reporting dashboards, energy monitoring on installed units, customer sustainability portals.',
        stakeholders: ['Sustainability Office', 'Product Management', 'Customer Success'],
        capability_implications: ['IoT energy telemetry', 'ESG data platform', 'Carbon footprint analytics'],
        mapped_vendor_offer_clusters: ['Microsoft Sustainability Manager', 'Azure Data Explorer'],
        mapped_hub_org_motions: ['Sustainability Data Strategy', 'DATA NEEDED'],
      },
      confidence: 'Medium',
    },
  ],
};

function seedDemoData(): void {
  if (getByFocusId('schindler')) return;
  packs.push(SCHINDLER_PACK);
}

seedDemoData();
