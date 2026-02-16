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
  industry_label: 'Vertical transportation (elevators, escalators) + smart building mobility services',
  generated_at: '2026-02-16T00:00:00Z',
  data_gaps: [
    'If you want this pack to be fully weekly-accurate, add 1–2 true "dated in-week" items beyond trade press (e.g., standards update, vendor security bulletin, or regulator note).',
    'To map to Deal Planning automatically, ensure Module 0V offer clusters and Module 0A motions are available so we can replace generic implications with deterministic mappings.',
  ],
  big_paper_of_week: {
    id: 'bigpaper_pwc_global_digital_trust_2026',
    title: '2026 Global Digital Trust Insights',
    source_org: 'PwC',
    source_url: 'https://www.pwc.com/us/en/services/consulting/cybersecurity-risk-regulatory/library/global-digital-trust-insights.html',
    source_published_at: '2025-10-01',
    core_theses: [
      'Cyber risk is increasingly tied to business resilience and trust outcomes, not just IT controls.',
      'OT/IIoT environments create governance and ownership complexity that many organizations haven\'t resolved.',
      'Talent and operating-model gaps can be as limiting as technology gaps.',
    ],
    whats_new: [
      'Elevated prominence of OT/IIoT in executive risk framing.',
      'Emphasis on governance clarity and ownership as recurring blockers.',
    ],
    applied_to_focus: [
      'Treat connected-asset services as a trust product: publish an assurance narrative with controls and ownership.',
      'Standardize security questionnaires + evidence packs to reduce friction in enterprise procurement.',
      'Align OT/IoT governance roles across product, security, and operations.',
    ],
  },
  signals: [
    {
      id: 'indnews_verticaltransport_elevatorworld_feb2026_projects_2026',
      title: 'Vertical transportation project activity highlights (Europe): major intermodal/public infrastructure deployments featured',
      category: 'market',
      source_org: 'Elevator World (Feb 2026 issue)',
      source_url: 'https://elevatorworld.com/wp-content/uploads/2026/02/Elevator-World-February-2026-Digital.pdf',
      source_published_at: '2026-02-01',
      summary: 'Trade press coverage highlights continued investment in large public infrastructure projects and modern vertical transportation systems across Europe.',
      why_it_matters_sector: 'Public infrastructure and multi-use developments remain a durable demand driver for modernization and lifecycle service.',
      applied_to_focus: {
        why_it_matters: 'Reinforces demand for modernization + service excellence positioning with owners/operators in large infrastructure and multi-site portfolios.',
        where_it_shows_up: 'Bid strategy, reference storytelling, service SLA proof, modernization pipeline qualification.',
        stakeholders: ['Regional GM', 'Head of Sales', 'Head of Service', 'Marketing/Comms'],
      },
      strategic_implications: {
        for_vendor: ['Outcome proof matters: reporting/measurement tooling becomes part of the sale (uptime, response times, modernization impact).'],
        for_hub_org: ["Package an 'Operational Excellence + Measurement' motion: baseline → instrumentation → reporting → continuous improvement."],
      },
      confidence: 'Medium',
    },
    {
      id: 'indnews_verticaltransport_eu_machinery_reg_guide_update_undated',
      title: 'EU Machinery Regulation (2023/1230) guidance work progresses: documentation and interpretation expectations moving toward 2027 applicability',
      category: 'regulation',
      source_org: 'IBF Solutions (status update on EU Machinery Regulation guide work)',
      source_url: 'https://www.ibf-solutions.com/en/seminars-and-news/news/news-on-the-guide-for-the-machinery-regulation',
      source_published_at: '2025-11-01',
      summary: 'A status update indicates ongoing work on accompanying guidance for the EU Machinery Regulation, which affects how requirements are interpreted and applied in practice.',
      why_it_matters_sector: 'Safety + compliance interpretation changes create downstream requirements for documentation, traceability, and software safety components.',
      applied_to_focus: {
        why_it_matters: 'For connected and software-enabled systems, compliance posture and documentation readiness can become a sales blocker or accelerator.',
        where_it_shows_up: 'Product compliance artifacts, supplier requirements, customer assurance packs, release governance.',
        stakeholders: ['Quality/Compliance', 'Legal', 'CISO', 'Product Engineering Leadership'],
      },
      strategic_implications: {
        for_vendor: ['Security/governance tooling becomes procurement-critical when compliance narratives mature (auditability, controls, documentation).'],
        for_hub_org: ["Offer a 'Compliance Readiness' service motion: evidence inventory → gaps → controls → documentation pack."],
      },
      confidence: 'Medium',
    },
    {
      id: 'indnews_verticaltransport_pwc_digital_trust_2026_ot_iiot_2026',
      title: 'Cyber risk focus shifts to OT/IIoT ownership and governance gaps (C-suite survey signal)',
      category: 'cybersecurity',
      source_org: 'PwC (Global Digital Trust Insights 2026)',
      source_url: 'https://www.pwc.com/us/en/services/consulting/cybersecurity-risk-regulatory/library/global-digital-trust-insights.html',
      source_published_at: '2025-10-01',
      summary: "PwC's 2026 digital trust survey emphasizes OT/IIoT as pressure points and highlights governance/ownership and skills gaps as recurring blockers.",
      why_it_matters_sector: 'Connected-building and connected-asset services increase attack surface; governance clarity becomes a buyer requirement.',
      applied_to_focus: {
        why_it_matters: "Schindler's connected services and asset telemetry strengthen differentiation—but only if buyers trust the security and governance model.",
        where_it_shows_up: 'Security posture discussions, RFP/security questionnaires, customer assurance, internal ownership models for IoT data.',
        stakeholders: ['CISO', 'Head of Digital Services', 'IT Security Architecture', 'Risk/Compliance'],
      },
      strategic_implications: {
        for_vendor: ['Security + governance accelerators become conversion levers in connected-services deals (identity, monitoring, policy).'],
        for_hub_org: ["Create a repeatable 'Connected Asset Security Baseline' workshop + remediation roadmap."],
      },
      confidence: 'Medium',
    },
    {
      id: 'indnews_verticaltransport_deloitte_tmt_predictions_ai_scale_2025',
      title: 'AI scaling: the gap between promise and reality narrows as enterprises push for operationalization',
      category: 'technology',
      source_org: 'Deloitte (TMT Predictions 2026)',
      source_url: 'https://www.deloitte.com/us/en/insights/industry/technology/technology-media-and-telecom-predictions.html',
      source_published_at: '2025-11-17',
      summary: 'Deloitte predicts increased pressure to operationalize AI at scale, focusing on making AI real in business processes rather than pilots.',
      why_it_matters_sector: 'Industrial and service businesses are moving from experimentation to measurable process impact; governance and integration become the bottlenecks.',
      applied_to_focus: {
        why_it_matters: 'If Schindler expands AI use in operations or digital services, buyers will ask for reliability, controls, and measurable improvement—not demos.',
        where_it_shows_up: 'Service operations copilots, predictive workflows, internal productivity, product feature assurance.',
        stakeholders: ['CIO', 'Head of Data/AI', 'COO/Service Ops', 'CFO (benefits realization)'],
      },
      strategic_implications: {
        for_vendor: ['Enterprise AI governance + secure deployment patterns are critical to move from POC to production.'],
        for_hub_org: ["Position an 'AI operationalization sprint' tied to one workflow (service triage, dispatch, diagnostics) with measurable KPIs."],
      },
      confidence: 'Medium',
    },
  ],
};

function seedDemoData(): void {
  if (getByFocusWeek('schindler', '2026-W07')) return;
  packs.push(SCHINDLER_W07);
}

seedDemoData();
