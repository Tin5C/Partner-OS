// Seed: BusinessPlayPackages for Schindler / play_finops — Executive + Grounded variants
// Auto-runs on import. Partner-only.
// Partner display name derived from canonical partnerProfileStore.

import { seedBusinessPlayPackages, type BusinessPlayPackage } from '../businessPlayPackageStore';
import { listPartnerProfiles } from '../partnerProfileStore';
import { getSignal } from '../signalStore';
import { getAccountSignal } from '../accountSignalStore';

// ---------- Canonical partner name resolution ----------

function resolvePartnerName(): string {
  // Try canonical profile (org_id 'alpnova' is the legacy alias for helioworks)
  const profiles = listPartnerProfiles('alpnova');
  if (profiles.length > 0) return profiles[0].partner_name;
  const hw = listPartnerProfiles('helioworks');
  if (hw.length > 0) return hw[0].partner_name;
  return 'Our Practice'; // stable fallback — never hardcode a brand
}

// ---------- Citation validation ----------

function validateCitations(ids: string[]): string[] {
  return ids.filter((id) => {
    if (getSignal(id)) return true;
    if (getAccountSignal(id)) return true;
    return false;
  });
}

// ---------- Seed data ----------

function buildPackages(): BusinessPlayPackage[] {
  const pn = resolvePartnerName();

  const EXECUTIVE: BusinessPlayPackage = {
    variant: 'executive',
    focus_id: 'schindler',
    play_id: 'play_finops',
    type: 'New Logo',
    motion: 'Strategic Pursuit',
    title: 'FinOps AI Readiness — Executive',
    created_at: '2026-02-19T10:00:00+01:00',
    business: {
      signal_citation_ids: validateCitations([
        'sig-sch-finops-ai',
        'sig-sch-azure-swiss',
        'sig-sch-copilot-field',
        'sig-sch-eu-machinery',
      ]),
      deal_strategy: {
        what: `Position ${pn} as the FinOps and AI-readiness partner for Schindler's Azure estate, leveraging Swiss data-residency compliance and Copilot field-service automation as the dual entry wedge.`,
        how: [
          'Lead with a FinOps maturity assessment to quantify cloud cost optimisation potential.',
          'Anchor AI readiness on Azure Swiss North availability — remove data-sovereignty objection.',
          'Propose a 50-technician Copilot pilot for field-service work-order triage.',
          'Use pilot KPIs to build an expansion business case for enterprise rollout.',
        ],
        why: `Azure OpenAI in Swiss North removes the last compliance blocker. EU Machinery Regulation (2027 deadline) creates board-level urgency for AI-augmented field operations. Schindler's current vendor stack lacks a delivery partner with joint FinOps + AI credentials.`,
      },
      positioning: {
        executive_pov: `Schindler needs a partner who can deliver measurable cloud ROI today while building the AI-ready foundation required by 2027. Generic cloud resellers optimise VMs — ${pn} optimises business outcomes across FinOps, data platforms, and applied AI, all within Swiss compliance boundaries.`,
        talk_tracks: [
          { persona: 'CIO / VP Engineering', message: 'We deliver a unified FinOps + AI roadmap anchored in Azure Swiss North — so you get cost visibility and AI readiness in a single engagement, not two separate vendor relationships.' },
          { persona: 'CFO / Finance', message: 'Our FinOps assessment typically identifies 15-25% cloud cost reduction in the first 90 days. That recovered budget funds the AI pilot at near-zero incremental cost.' },
          { persona: 'CISO', message: 'All data stays in Azure Swiss North. Our governance framework is pre-aligned to ISO 27001 and the EU Machinery Regulation — your compliance review is de-risked from day one.' },
          { persona: 'Procurement', message: 'We scope a fixed-fee FinOps assessment with committed savings targets. The AI pilot is milestone-gated — you only expand what proves ROI.' },
        ],
      },
      commercial_assets: {
        roi_prompts: [
          { label: 'Cloud waste reduction', question: 'What is your current monthly Azure spend, and what percentage do you estimate is idle or over-provisioned?' },
          { label: 'Field productivity', question: 'How many work orders per day does a technician currently handle, and what is the average triage time?' },
          { label: 'Compliance cost', question: 'What is the annual cost of your current data-residency compliance programme for cloud workloads?' },
        ],
        value_hypotheses: [
          { label: 'FinOps savings', description: '15-25% Azure cost reduction within 90 days through right-sizing, reserved instances, and anomaly detection.' },
          { label: 'Technician productivity', description: '20-30% faster work-order triage via Copilot-assisted dispatch, freeing 2+ hours per technician per day.' },
          { label: 'Compliance acceleration', description: 'Reduce data-residency audit preparation from weeks to days with pre-certified Azure Swiss North architecture.' },
        ],
        kpis: [
          { label: 'Azure cost reduction', target: '15-25% within 90 days' },
          { label: 'Copilot adoption rate', target: '>80% active usage in pilot cohort by week 6' },
          { label: 'Work-order triage time', target: '20-30% reduction vs. baseline' },
          { label: 'Compliance certification', target: 'Architecture review complete within 30 days' },
        ],
        sizing_inputs: [
          { label: 'Monthly Azure spend', value: 'Required to baseline FinOps opportunity' },
          { label: 'Number of field technicians', value: 'Required to size Copilot pilot licensing' },
          { label: 'Work-order volume', value: 'Daily/weekly volume to calculate triage improvement' },
          { label: 'Existing M365 licensing', value: 'Determines Copilot add-on cost' },
        ],
      },
      delivery_assets: {
        discovery_agenda: [
          { theme: 'Cloud estate', question: 'Walk us through your current Azure subscription structure and governance model.' },
          { theme: 'Cost visibility', question: 'What FinOps tooling or processes do you have in place today?' },
          { theme: 'AI readiness', question: 'Where are you on the AI adoption curve — experimentation, piloting, or scaling?' },
          { theme: 'Field operations', question: 'Describe the current work-order lifecycle from dispatch to completion.' },
          { theme: 'Data residency', question: 'What are your hard requirements for data residency and sovereignty?' },
        ],
        workshop_plan: [
          { step: 'Current-state mapping', description: 'Map Azure estate, identify cost hotspots and governance gaps.' },
          { step: 'FinOps opportunity sizing', description: 'Quantify savings potential across right-sizing, reservations, and anomaly detection.' },
          { step: 'AI use-case prioritisation', description: 'Score candidate use cases (field service, predictive maintenance, quality) on impact vs. feasibility.' },
          { step: 'Architecture blueprint', description: 'Design target-state architecture on Azure Swiss North with AI integration points.' },
          { step: 'Roadmap and governance', description: 'Define phased delivery plan with milestone gates and success criteria.' },
        ],
        pilot_scope: {
          in_scope: [
            '50 field technicians in a single geographic region',
            'Copilot for work-order triage and parts prediction',
            'FinOps dashboard with weekly cost anomaly alerts',
            'Azure Swiss North data-residency architecture',
          ],
          out_of_scope: [
            'Enterprise-wide Copilot rollout',
            'SAP / ERP integration',
            'Custom ML model development',
            'Multi-cloud strategy',
          ],
          deliverables: [
            'FinOps maturity assessment report with savings roadmap',
            'Copilot pilot deployment (50 users, 8 weeks)',
            'Azure Swiss architecture design document',
            'Pilot ROI report with expansion business case',
          ],
          stakeholders: [
            'VP Engineering (sponsor)',
            'Head of Digital Transformation (champion)',
            'CISO (governance gate)',
            'Head of Procurement (commercial gate)',
          ],
        },
      },
      enablement: {
        seller: [
          'Lead with FinOps savings to fund the AI conversation — never lead with AI alone.',
          'Reference Azure Swiss North GA as the compliance unlock — this removes the #1 objection.',
          'Position the pilot as risk-free: milestone-gated, fixed scope, committed KPIs.',
          'Use the 2027 EU Machinery Regulation deadline to create board-level urgency.',
        ],
        engineer: [
          'Prepare a live FinOps demo using Azure Cost Management + custom Power BI dashboard.',
          'Have an Azure Swiss North architecture reference ready (landing zone + AI services).',
          'Know Copilot for Field Service licensing model and prerequisites.',
        ],
      },
      open_questions: [
        'Has Schindler engaged any other partner for FinOps or AI readiness?',
        'What is the internal timeline for AI governance framework approval?',
        'Is there an existing FinOps team or centre of excellence?',
        'What is the budget approval process for pilot engagements above CHF 50K?',
        'Are there competing priorities that could delay the pilot start?',
      ],
    },
  };

  const GROUNDED: BusinessPlayPackage = {
    variant: 'grounded',
    focus_id: 'schindler',
    play_id: 'play_finops',
    type: 'New Logo',
    motion: 'Strategic Pursuit',
    title: 'FinOps AI Readiness — Grounded',
    created_at: '2026-02-19T10:00:00+01:00',
    business: {
      signal_citation_ids: validateCitations([
        'sig-sch-finops-ai',
        'sig-sch-ai-governance',
        'sig-sch-azure-swiss',
        'sig-sch-copilot-field',
        'as-seed-schindler-01',
      ]),
      deal_strategy: {
        what: `Engage Schindler through a FinOps assessment that directly addresses their Azure cost visibility gap, using the results to open a Copilot field-service pilot anchored in their existing work-order triage pain point.`,
        how: [
          'Reference their published ActionBoard initiative as evidence of digital service investment appetite.',
          'Use their 24/7 SOC programme to validate security-first positioning — align to their governance model.',
          'Map FinOps savings to the specific Azure subscription structure observed in their Developer Portal documentation.',
          'Propose Copilot pilot scoped to the Service division, which already operates connected IoT units at scale.',
        ],
        why: `Schindler's public investments in connected units (ActionBoard, Ahead) signal readiness for AI-augmented field operations. Their 24/7 SOC and RACI-based AI governance mean they will gate any vendor on compliance — ${pn}'s Swiss-hosted, ISO-aligned approach turns this gate into an advantage. No competing partner has delivered a combined FinOps + field-service AI engagement in the Swiss industrial sector.`,
      },
      positioning: {
        executive_pov: `Schindler has already invested in connected unit infrastructure and a security-first digital culture. The missing piece is a partner who can translate that foundation into measurable AI outcomes — starting with field-service efficiency and cloud cost optimisation — without requiring a new governance framework. ${pn} delivers that bridge.`,
        talk_tracks: [
          { persona: 'CIO / VP Engineering', message: 'Your ActionBoard and connected-unit investments have created the data foundation. We help you extract AI value from that foundation — starting with work-order triage — within your existing governance framework.' },
          { persona: 'CFO / Finance', message: 'Based on the scale of your Azure estate supporting connected units, we typically identify CHF 200-400K in annual savings through FinOps optimisation. That funds the Copilot pilot with zero incremental budget.' },
          { persona: 'CISO', message: 'We\'ve reviewed your published security posture — 24/7 SOC, RACI-based access control. Our architecture deploys entirely within Azure Swiss North and aligns to your existing ISO 27001 controls. No new governance overhead.' },
          { persona: 'Procurement', message: 'The FinOps assessment is a 4-week fixed-fee engagement with guaranteed savings identification. The Copilot pilot is scoped to 50 technicians with a go/no-go gate at week 4 — your exposure is capped.' },
        ],
      },
      commercial_assets: {
        roi_prompts: [
          { label: 'Connected-unit scale', question: 'How many connected units does the ActionBoard currently monitor, and what is the monthly data ingestion cost?' },
          { label: 'Field dispatch efficiency', question: 'What is the current first-time-fix rate, and how much does each return visit cost on average?' },
          { label: 'SOC integration cost', question: 'What is the annual cost of your 24/7 SOC, and would consolidating AI workload monitoring reduce that overhead?' },
        ],
        value_hypotheses: [
          { label: 'FinOps savings (grounded)', description: 'CHF 200-400K annual Azure cost reduction based on estimated connected-unit data ingestion and IoT workload patterns.' },
          { label: 'First-time-fix improvement', description: '10-15% improvement in first-time-fix rate through Copilot-assisted parts prediction, reducing return visits.' },
          { label: 'Governance efficiency', description: 'Eliminate 2-3 weeks of compliance review per AI project by pre-certifying on Azure Swiss North within their existing RACI model.' },
        ],
        kpis: [
          { label: 'Azure cost reduction (connected units)', target: 'CHF 200-400K annually' },
          { label: 'First-time-fix rate', target: '10-15% improvement vs. current baseline' },
          { label: 'Copilot adoption (Service division)', target: '>80% daily active usage by week 6' },
          { label: 'Governance approval time', target: '<2 weeks for AI workload certification' },
        ],
        sizing_inputs: [
          { label: 'Connected units monitored', value: 'Number of units on ActionBoard (data volume proxy)' },
          { label: 'Service division headcount', value: 'Field technicians in target region for pilot sizing' },
          { label: 'Current first-time-fix rate', value: 'Baseline metric for Copilot impact measurement' },
          { label: 'Azure subscription count', value: 'Scope for FinOps assessment coverage' },
        ],
      },
      delivery_assets: {
        discovery_agenda: [
          { theme: 'ActionBoard architecture', question: 'What is the data pipeline from connected units to the ActionBoard? Where does data land in Azure?' },
          { theme: 'Service dispatch', question: 'Walk us through a work-order lifecycle in the Service division — from alert to resolution.' },
          { theme: 'SOC integration', question: 'How does your 24/7 SOC currently monitor cloud workloads, and what alerting thresholds are in place?' },
          { theme: 'Developer Portal', question: 'Which APIs from the Developer Portal are most consumed, and by which internal teams?' },
          { theme: 'AI governance', question: 'Describe the RACI approval process for deploying a new AI workload in production.' },
        ],
        workshop_plan: [
          { step: 'Connected-unit data mapping', description: 'Trace data flows from IoT endpoints through ActionBoard to Azure storage and analytics layers.' },
          { step: 'FinOps deep-dive (Service division)', description: 'Analyse Azure spend specifically attributed to connected-unit workloads and field operations.' },
          { step: 'Copilot use-case validation', description: 'Map work-order triage process to Copilot capabilities; identify data prerequisites and gaps.' },
          { step: 'Compliance architecture review', description: 'Validate Azure Swiss North deployment against Schindler\'s SOC monitoring and RACI requirements.' },
          { step: 'Pilot design and stakeholder sign-off', description: 'Define pilot scope, success criteria, and governance gates for Service division deployment.' },
        ],
        pilot_scope: {
          in_scope: [
            '50 field technicians in Swiss Service division',
            'Copilot for work-order triage using ActionBoard alert data',
            'FinOps dashboard scoped to connected-unit Azure subscriptions',
            'Architecture aligned to existing SOC monitoring and RACI model',
          ],
          out_of_scope: [
            'ActionBoard platform re-architecture',
            'Developer Portal API changes',
            'Non-Swiss regions or non-Service divisions',
            'Custom ML models beyond Copilot capabilities',
          ],
          deliverables: [
            'FinOps assessment scoped to connected-unit workloads (CHF savings identified)',
            'Copilot pilot deployment for 50 Service technicians (8 weeks)',
            'Architecture document certified against SOC and RACI requirements',
            'Expansion business case with division-by-division rollout plan',
          ],
          stakeholders: [
            'VP Engineering (executive sponsor, ActionBoard owner)',
            'Head of Digital Transformation (Copilot champion)',
            'CISO (SOC integration and RACI gate)',
            'Head of Service Operations (pilot operational owner)',
          ],
        },
      },
      enablement: {
        seller: [
          'Reference ActionBoard by name — shows you\'ve done account research, not generic pitch.',
          'Quote the 24/7 SOC and RACI model to pre-empt security objections before they\'re raised.',
          'Use "CHF 200-400K" savings range — grounded in connected-unit workload assumptions.',
          'Position the pilot in the Service division specifically — it\'s where IoT data and field operations intersect.',
        ],
        engineer: [
          'Review Schindler Developer Portal APIs before the discovery call — understand their data model.',
          'Prepare a reference architecture showing ActionBoard data flow into Azure AI services.',
          'Be ready to explain Copilot integration with existing ITSM / work-order systems.',
        ],
      },
      open_questions: [
        'Is the ActionBoard data pipeline fully on Azure, or are there on-premises components?',
        'Has the Service division previously piloted any AI or automation tools for dispatch?',
        'What is the CISO\'s current stance on Azure OpenAI specifically — has it been evaluated?',
        'Are there existing FinOps practices or tools within the Service division\'s Azure subscriptions?',
        'Who owns the P&L for field technician productivity — Service Operations or Digital Transformation?',
      ],
    },
  };

  return [EXECUTIVE, GROUNDED];
}

seedBusinessPlayPackages(buildPackages());
