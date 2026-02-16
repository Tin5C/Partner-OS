// IndustryNewsStore — weekly industry news signals + big paper of the week
// In-memory singleton. Additive only.

export type IndustryNewsSignal = {
  id: string;
  title: string;
  category: 'regulation' | 'market' | 'technology' | 'cybersecurity' | 'operations' | 'other';
  source_org: string;
  source_url: string | null;
  source_published_at: string | null;
  summary: string;
  why_it_matters_sector: string;
  applied_to_focus: {
    why_it_matters: string;
    where_it_shows_up: string;
    stakeholders: string[];
  };
  strategic_implications: {
    for_vendor: string[];
    for_hub_org: string[];
  };
  confidence: 'High' | 'Medium' | 'Low';
};

export type BigPaperOfWeek = {
  id: string;
  title: string;
  source_org: string;
  source_url: string | null;
  source_published_at: string | null;
  core_theses: string[];
  whats_new: string[];
  applied_to_focus: string[];
};

export type IndustryNewsPack = {
  focusId: string;
  weekKey: string;
  industry_label: string;
  signals: IndustryNewsSignal[];
  big_paper_of_week: BigPaperOfWeek | null;
  data_gaps: string[];
  generated_at: string;
};

const packs: IndustryNewsPack[] = [];

export function getByFocusWeek(focusId: string, weekKey: string): IndustryNewsPack | null {
  return packs.find((p) => p.focusId === focusId && p.weekKey === weekKey) ?? null;
}

// ============= Schindler 2026-W07 Seed =============

const SCHINDLER_W07: IndustryNewsPack = {
  focusId: 'schindler',
  weekKey: '2026-W07',
  industry_label: 'Vertical transportation + smart building mobility services',
  generated_at: '2026-02-16T00:00:00Z',
  data_gaps: [
    'DATA NEEDED: Schindler-specific public statements on GenAI adoption timelines.',
    'DATA NEEDED: Vendor offer cluster mapping for smart-building cybersecurity.',
  ],
  big_paper_of_week: {
    id: 'bp-w07-mckinsey-genai-maintenance',
    title: 'Rewiring Maintenance with Gen AI',
    source_org: 'McKinsey',
    source_url: 'https://www.mckinsey.com/capabilities/operations/our-insights/rewiring-maintenance-with-gen-ai',
    source_published_at: '2025-02-06',
    core_theses: [
      'GenAI can shift maintenance from reactive to reliability-driven operations across industrial sectors.',
      'Knowledge retrieval, dispatch optimization, and diagnostics are the highest-ROI entry points.',
      'Successful deployments require human-in-the-loop controls and audit-trail infrastructure.',
    ],
    whats_new: [
      'Quantifies 25–35% efficiency gains within 18 months for field-service workflows.',
      'Identifies four capability tiers from assisted diagnostics to autonomous dispatch.',
    ],
    applied_to_focus: [
      "Schindler's 60,000+ field technicians represent one of the largest GenAI field-service opportunities in vertical transportation.",
      'Copilot-based tooling for troubleshooting and parts diagnostics is a natural first-mover play.',
      'Compliance with EU AI Act high-risk classification adds urgency to audit-trail investments.',
    ],
  },
  signals: [
    {
      id: 'news-w07-001',
      title: 'EU AI Act high-risk deadlines approaching: conformity assessment requirements crystallize',
      category: 'regulation',
      source_org: 'European Commission',
      source_url: 'https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai',
      source_published_at: '2026-02-10',
      summary: 'Updated guidance on EU AI Act conformity assessments for high-risk AI systems in safety-critical infrastructure, with 2027 compliance deadlines now firm.',
      why_it_matters_sector: 'Elevator and escalator OEMs using AI for predictive maintenance or dispatch must prepare conformity documentation and human-oversight mechanisms.',
      applied_to_focus: {
        why_it_matters: "Schindler's predictive-maintenance AI will likely require high-risk classification and re-certification under the Act.",
        where_it_shows_up: 'ML-ops pipelines, firmware update processes, safety-critical model governance.',
        stakeholders: ['CTO Office', 'Legal & Compliance', 'AI/ML Engineering'],
      },
      strategic_implications: {
        for_vendor: ['Position Azure AI + Purview as compliance-ready AI governance stack.', 'Offer conformity-assessment accelerator workshops.'],
        for_hub_org: ['Lead with AI Governance Advisory service pack.', 'Bundle MLOps audit-trail tooling into existing engagements.'],
      },
      confidence: 'High',
    },
    {
      id: 'news-w07-002',
      title: 'Swiss NCSC warns of rising OT/IoT attack surface in building management systems',
      category: 'cybersecurity',
      source_org: 'Swiss NCSC',
      source_url: null,
      source_published_at: '2026-02-12',
      summary: 'Swiss National Cyber Security Centre advisory highlights increased threat activity targeting building-management and elevator-control IoT endpoints.',
      why_it_matters_sector: 'Connected elevator systems are part of the expanding OT attack surface; building operators will demand security assurance from equipment vendors.',
      applied_to_focus: {
        why_it_matters: "Schindler's IoT-connected fleet is directly in scope; customers will expect documented security posture and incident-response capabilities.",
        where_it_shows_up: 'IoT endpoint security, network segmentation, incident response playbooks, vendor security assessments.',
        stakeholders: ['CISO', 'IoT Platform Team', 'Customer Success'],
      },
      strategic_implications: {
        for_vendor: ['Position Microsoft Defender for IoT and Sentinel for OT monitoring.'],
        for_hub_org: ['Offer OT/IoT security assessment as a standalone service pack.', 'Cross-sell into existing smart-building engagements.'],
      },
      confidence: 'High',
    },
    {
      id: 'news-w07-003',
      title: 'Kone announces digital twin rollout across 100,000 connected units by 2027',
      category: 'market',
      source_org: 'Kone Corporation',
      source_url: null,
      source_published_at: '2026-02-11',
      summary: 'Competitor Kone accelerates digital-twin deployment timeline, targeting 100K connected units with real-time simulation capabilities by end of 2027.',
      why_it_matters_sector: 'Digital twins are becoming a competitive differentiator in vertical transportation; lagging adoption risks losing building-operator contracts.',
      applied_to_focus: {
        why_it_matters: "Schindler must match or exceed Kone's digital-twin timeline to retain competitive positioning with large building operators.",
        where_it_shows_up: 'Digital services roadmap, IoT platform investment, SLA differentiation for FM customers.',
        stakeholders: ['VP Digital Services', 'Strategic Partnerships', 'Regional Service Directors'],
      },
      strategic_implications: {
        for_vendor: ['Accelerate Azure Digital Twins co-sell motions in vertical transportation.'],
        for_hub_org: ['Position Digital Twin Readiness Assessment as urgent for Schindler.', 'Highlight competitive gap in next account review.'],
      },
      confidence: 'Medium',
    },
    {
      id: 'news-w07-004',
      title: 'Gartner updates smart-building technology maturity curve: AI-driven energy optimization enters slope of enlightenment',
      category: 'technology',
      source_org: 'Gartner',
      source_url: null,
      source_published_at: '2026-02-09',
      summary: 'Gartner Hype Cycle update moves AI-driven energy optimization for buildings from "Peak of Inflated Expectations" to "Slope of Enlightenment", signaling practical adoption.',
      why_it_matters_sector: 'Building operators now expect measurable energy savings from connected systems, not just monitoring dashboards.',
      applied_to_focus: {
        why_it_matters: 'Schindler can differentiate by offering energy-optimized elevator operation tied to CSRD sustainability reporting requirements.',
        where_it_shows_up: 'ESG reporting, energy telemetry per unit, customer sustainability portals.',
        stakeholders: ['Sustainability Office', 'Product Management', 'Customer Success'],
      },
      strategic_implications: {
        for_vendor: ['Bundle Microsoft Sustainability Manager with IoT energy telemetry solutions.'],
        for_hub_org: ['Add sustainability data strategy to Schindler engagement roadmap.'],
      },
      confidence: 'Medium',
    },
    {
      id: 'news-w07-005',
      title: 'ThyssenKrupp Elevator rebrands field-service app with Copilot-powered diagnostics',
      category: 'operations',
      source_org: 'TK Elevator',
      source_url: null,
      source_published_at: '2026-02-13',
      summary: 'ThyssenKrupp Elevator (TK Elevator) launches AI-assisted field-service mobile app featuring Copilot-powered troubleshooting and parts ordering for technicians.',
      why_it_matters_sector: 'Competitors are shipping GenAI field tools; the bar for technician productivity tooling is rising across the sector.',
      applied_to_focus: {
        why_it_matters: "Schindler's field technician base (60,000+) is a larger deployment surface but risks falling behind if competitors ship GenAI tools first.",
        where_it_shows_up: 'Field service app roadmap, technician onboarding, knowledge management systems.',
        stakeholders: ['VP Field Operations', 'Digital Workplace', 'HR & Training'],
      },
      strategic_implications: {
        for_vendor: ['Use competitive urgency to accelerate Copilot for Field Service PoC.'],
        for_hub_org: ['Frame Copilot Readiness pack as time-sensitive given competitor moves.'],
      },
      confidence: 'High',
    },
  ],
};

function seedDemoData(): void {
  if (getByFocusWeek('schindler', '2026-W07')) return;
  packs.push(SCHINDLER_W07);
}

seedDemoData();
