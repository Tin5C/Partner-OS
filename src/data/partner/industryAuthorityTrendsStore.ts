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
  industry_label: 'Vertical transportation (elevators, escalators) + smart building mobility services',
  generated_at: '2026-02-16T00:00:00Z',
  summary: {
    industry_implications: [
      'Service differentiation increasingly depends on connected-asset operations (telemetry, remote diagnostics, predictive reliability) rather than hardware alone.',
      'Buyers will evaluate smart-building integration capabilities: interoperability, security, and measurable operational outcomes.',
      'Scaling AI in industrial services shifts the bar toward governance, cost control, and audit-ready operating models—not just pilots.',
      'EU regulatory timelines push earlier investment in compliance posture, documentation, and risk management for AI-enabled features.',
    ],
    near_term_watchouts: [
      'Regulatory deadlines and staged applicability under the EU AI Act can change buyer procurement and assurance requirements as 2026 approaches.',
      'Scaling AI use cases without a governance + cost management model can create reliability and margin risk in service operations.',
      'Smart-building cybersecurity risks in OT/IoT integration can create blockers unless ownership and controls are explicit.',
    ],
    data_gaps: [
      'DATA NEEDED: Module 0V offer map clusters to map trends to vendor offer clusters deterministically.',
      'DATA NEEDED: Module 0A service motions/packages to map trends to hub org delivery motions deterministically.',
      'DATA NEEDED: Schindler-specific public statements on AI-enabled features beyond connectivity (if any) for tighter applied mapping.',
    ],
  },
  trends: [
    {
      id: 'trend_verticaltransport_mckinsey_genai_maintenance_2025',
      trend_title: 'GenAI-enabled maintenance: shifting from reactive work to reliability-driven operations',
      source_org: 'McKinsey',
      source_type: 'consulting_report',
      source_url: 'https://www.mckinsey.com/capabilities/operations/our-insights/rewiring-maintenance-with-gen-ai',
      source_published_at: '2025-02-06',
      thesis_summary:
        'GenAI is positioned as a lever to improve reliability, sustainability, efficiency, and cost effectiveness in maintenance operations, by changing how work is executed and supported.',
      applied_to_focus: {
        why_it_matters:
          "Schindler's service business depends on uptime and field efficiency; GenAI in maintenance can improve technician productivity, knowledge access, and reliability outcomes.",
        where_it_shows_up:
          'Field service workflows, troubleshooting playbooks, parts diagnostics, dispatch/triage, service knowledge management, continuous improvement.',
        stakeholders: ['Head of Service Operations', 'Field Service Leadership', 'CIO / IT Ops', 'Head of Quality / Reliability'],
        capability_implications: [
          'Knowledge retrieval for technicians',
          'Secure operational copilots',
          'Integration across work orders + telemetry + manuals',
          'Auditability and human-in-the-loop controls',
        ],
        mapped_vendor_offer_clusters: ['DATA NEEDED'],
        mapped_hub_org_motions: ['DATA NEEDED'],
      },
      confidence: 'High',
    },
    {
      id: 'trend_verticaltransport_mckinsey_digital_twin_undated',
      trend_title: 'Digital twins as an operations lever: using real-time linked models to simulate and optimize performance',
      source_org: 'McKinsey',
      source_type: 'consulting_report',
      source_url: 'https://www.mckinsey.com/featured-insights/mckinsey-explainers/what-is-digital-twin-technology',
      source_published_at: '2024-08-26',
      thesis_summary:
        'Digital twins are described as virtual replicas linked to real data sources that update in real time, enabling simulation and better understanding of how systems work in practice.',
      applied_to_focus: {
        why_it_matters:
          "Schindler already positions IoT-connected assets; a digital-twin approach can strengthen predictive maintenance, modernization planning, and SLA outcomes for building operators.",
        where_it_shows_up:
          'Asset telemetry + monitoring, failure prediction, modernization/upgrade planning, remote diagnostics, service-level reporting.',
        stakeholders: ['VP Digital Services', 'Head of Product (Digital)', 'CIO / Data Platform Owner', 'Regional Service Directors'],
        capability_implications: [
          'IoT-to-data platform pipelines',
          'Model-driven monitoring & simulation',
          'Data governance for operational data',
          'Secure access controls for building/operator views',
        ],
        mapped_vendor_offer_clusters: ['DATA NEEDED'],
        mapped_hub_org_motions: ['DATA NEEDED'],
      },
      confidence: 'High',
    },
    {
      id: 'trend_verticaltransport_deloitte_smart_buildings_undated',
      trend_title: 'Smart buildings convergence: aligning OT, IT and IoT to streamline operations and improve workplace experience',
      source_org: 'Deloitte',
      source_type: 'big4_report',
      source_url: 'https://www.deloitte.com/us/en/services/consulting/services/smart-buildings-solutions.html',
      source_published_at: null,
      thesis_summary:
        'Deloitte frames smart buildings as a convergence of IoT, OT and IT to streamline operations and elevate workplace experience, using connected building systems and digital capabilities.',
      applied_to_focus: {
        why_it_matters:
          "Schindler's connected mobility systems are part of the broader smart-building stack; buyers will expect interoperability, cybersecurity, and measurable operational outcomes.",
        where_it_shows_up:
          'Integration with building management systems, identity/access experiences, occupancy-driven flow, operational reporting for building owners.',
        stakeholders: ['Building Owner / FM Leadership', 'CIO / Digital Workplace', 'CISO', 'Head of Smart Building Programs'],
        capability_implications: [
          'Interoperability & APIs',
          'Secure OT/IoT integration patterns',
          'Identity & access for occupants/technicians',
          'Outcome measurement and dashboards',
        ],
        mapped_vendor_offer_clusters: ['DATA NEEDED'],
        mapped_hub_org_motions: ['DATA NEEDED'],
      },
      confidence: 'Medium',
    },
    {
      id: 'trend_verticaltransport_mckinsey_tech_trends_2025_agentic_ai_2025',
      trend_title: 'Scaling AI across the enterprise: agentic AI and AI infrastructure pressures moving from POCs to operationalization',
      source_org: 'McKinsey',
      source_type: 'consulting_report',
      source_url: 'https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-top-trends-in-tech',
      source_published_at: '2025-07-22',
      thesis_summary:
        "McKinsey's 2025 tech trends emphasize frontier technologies and the operationalization of AI, including the enterprise implications of scaling AI capabilities and related infrastructure considerations.",
      applied_to_focus: {
        why_it_matters:
          'If Schindler expands digital services and AI-driven operations, buyers will ask for reliability, cost control, and explainability—not just features.',
        where_it_shows_up:
          'Digital product roadmap, service analytics, internal productivity tooling, experimentation-to-production pipelines.',
        stakeholders: ['CIO', 'Head of Data/AI', 'CFO (cost governance)', 'Digital Product Leadership'],
        capability_implications: [
          'AI platform governance',
          'Model lifecycle management',
          'Cost and capacity management',
          'Security + privacy controls for enterprise deployments',
        ],
        mapped_vendor_offer_clusters: ['DATA NEEDED'],
        mapped_hub_org_motions: ['DATA NEEDED'],
      },
      confidence: 'Medium',
    },
    {
      id: 'trend_verticaltransport_eu_ai_act_official_timeline_undated',
      trend_title: 'EU AI Act timeline: approaching 2026 applicability and governance expectations for AI systems',
      source_org: 'European Union (Digital Strategy)',
      source_type: 'standards_body',
      source_url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      source_published_at: null,
      thesis_summary:
        'The EU AI Act entered into force on 1 Aug 2024 and is scheduled to be fully applicable on 2 Aug 2026, with staged applicability for different obligations.',
      applied_to_focus: {
        why_it_matters:
          "For Schindler's digital services and any AI-enabled features, customers will demand compliance posture, documentation, and governance-ready operating models—especially in regulated environments.",
        where_it_shows_up:
          'Product compliance, supplier risk, AI feature documentation, model risk management, audit readiness.',
        stakeholders: ['CISO / Risk', 'Legal / Compliance', 'CIO', 'Digital Product Owners'],
        capability_implications: [
          'Responsible AI governance',
          'Documentation & traceability',
          'Risk classification processes',
          'Security and privacy-by-design controls',
        ],
        mapped_vendor_offer_clusters: ['DATA NEEDED'],
        mapped_hub_org_motions: ['DATA NEEDED'],
      },
      confidence: 'High',
    },
    {
      id: 'trend_verticaltransport_ey_iso42001_ai_governance_2025',
      trend_title: 'ISO/IEC 42001 as an AI governance anchor: formalizing AI management systems and risk mitigation',
      source_org: 'EY',
      source_type: 'big4_report',
      source_url: 'https://www.ey.com/en_us/insights/ai/iso-42001-paving-the-way-for-ethical-ai',
      source_published_at: '2025-01-17',
      thesis_summary:
        'EY positions ISO 42001 as a mechanism to promote ethical AI development and risk mitigation via a formal AI management system approach.',
      applied_to_focus: {
        why_it_matters:
          "ISO-aligned governance is a credible buyer-facing proof point for Schindler's AI-enabled services and internal AI adoption, especially when selling to safety- and compliance-sensitive customers.",
        where_it_shows_up:
          'AI policy, operating model, risk controls, internal audits, supplier requirements, customer assurance artifacts.',
        stakeholders: ['Risk & Compliance', 'CISO', 'Head of Data/AI', 'Quality Management'],
        capability_implications: [
          'Control framework + governance operating model',
          'Assurance artifacts (audits, policies, logs)',
          'Lifecycle controls',
          'Training / AI literacy enablement',
        ],
        mapped_vendor_offer_clusters: ['DATA NEEDED'],
        mapped_hub_org_motions: ['DATA NEEDED'],
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
