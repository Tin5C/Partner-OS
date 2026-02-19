// HelioWorks + Schindler demo seed data
// Imports and seeds all stores for the demo_helioworks org.
// Auto-runs on import.

import { createPartnerProfile, type PartnerProfile } from '../partnerProfileStore';
import { createAccountSignal, type AccountSignal } from '../accountSignalStore';
import { createObjection, type Objection } from '../objectionStore';
import { createBriefingArtifact, type BriefingArtifactRecord } from '../briefingArtifactStore';
import { createEngagementSignal, type EngagementSignal } from '../engagementStore';
import { addMemoryItem } from '../accountMemoryStore';

const ORG = 'demo_helioworks';
const ACCT = 'acct_schindler';

// Track seeded state to avoid duplicates on HMR
let seeded = false;

export function seedHelioWorksDemo(): void {
  if (seeded) return;
  seeded = true;

  // ── A) PartnerProfile ──
  createPartnerProfile({
    id: 'partner_helioworks',
    org_id: ORG,
    partner_name: 'HelioWorks AG',
    primary_vendor: 'Microsoft',
    positioning:
      'HelioWorks helps regulated industrial organizations move from AI pilots to production—securely, measurably, and with real change adoption.',
    core_strengths: [
      'Governance-first delivery',
      'Productionization patterns',
      'Balanced build + run',
      'Adoption playbooks',
    ],
    typical_buyers: [
      'CIO',
      'CISO',
      'Head of Data/AI',
      'Enterprise Architect',
      'Service/Field Ops',
      'Procurement',
      'Risk/Compliance',
    ],
  });

  // ── B) AccountSignals ──
  createAccountSignal({
    id: 'sig_sch_01',
    org_id: ORG,
    account_id: ACCT,
    week_of: '2026-02-10',
    depth: 1,
    headline: 'Schindler results window creates a governed Copilot pilot moment',
    what_changed:
      'Schindler enters executive results cadence while procurement and IT actively scope AI under cost and governance constraints.',
    execution_surface: ['Pilot scoping under constraints', 'Cost governance thresholds', 'Security approvals'],
    vendor: 'Microsoft',
    vendor_offer_clusters: ['Compliance & governance', 'Security', 'Copilot ecosystem'],
    vendor_value_props: [
      'Maintain compliance and audit readiness',
      'Lower cost-to-operate via operations tooling',
    ],
    partner_motion: ['Discovery Sprint', 'AI Governance Starter', 'FinOps-for-AI workstream'],
    proof_artifacts_needed: [
      'Cloud cost governance thresholds + approval workflow owner',
      'Pilot constraints + owners',
    ],
    buyer_roles: ['CFO/Finance', 'Procurement', 'CIO/IT Program', 'CISO/Security'],
    why_it_converts: 'Budget scrutiny + booked scoping indicates readiness for governed pilot.',
    gaps: ['Post–Feb 11 priorities', 'Cost threshold policy', 'Stakeholder roster confirmation'],
    confidence: 'High',
  });

  createAccountSignal({
    id: 'sig_sch_02',
    org_id: ORG,
    account_id: ACCT,
    week_of: '2026-02-10',
    depth: 2,
    headline: 'Security + governance posture is gating scope',
    what_changed:
      'Security engagement is repeated and explicit; governance artifacts and residency posture are preconditions.',
    execution_surface: [
      'Threat modeling',
      'Governance RACI',
      'Residency posture decisions',
      'Security questionnaire mapping',
    ],
    vendor: 'Microsoft',
    vendor_offer_clusters: ['Security', 'Compliance & governance'],
    vendor_value_props: [
      'Reduce enterprise risk through governance',
      'Maintain compliance and audit readiness',
    ],
    partner_motion: ['AI Governance Starter', 'Security & compliant AI'],
    proof_artifacts_needed: ['Security questionnaire template', 'Tenant boundary / residency docs'],
    buyer_roles: ['Security Lead/CISO', 'Enterprise Architect', 'Legal/Compliance', 'Procurement'],
    why_it_converts: 'Clear governance-first entry point driven by security.',
    gaps: ['Named model risk owner', 'Exception handling process', 'Legal stance on data flows'],
    confidence: 'High',
  });

  createAccountSignal({
    id: 'sig_sch_03',
    org_id: ORG,
    account_id: ACCT,
    week_of: '2026-02-10',
    depth: 3,
    headline: 'Copilot connectors + RAG evidence pull aligns to field service sponsor',
    what_changed:
      'Technical feasibility validation and field ops interest converge on grounded Copilot scenarios.',
    execution_surface: [
      'RAG feasibility',
      'Knowledge base selection',
      'Technician workflows',
      'Device/tool constraints',
    ],
    vendor: 'Microsoft',
    vendor_offer_clusters: ['Copilot ecosystem', 'Compliance & governance', 'Security'],
    vendor_value_props: [
      'Improve productivity via grounded copilots',
      'Maintain compliance and audit readiness',
    ],
    partner_motion: ['Discovery Sprint', 'Copilot Adoption Program'],
    proof_artifacts_needed: [
      'Knowledge base inventory + in-scope systems',
      'Technician tooling map + top workflows + success metrics',
    ],
    buyer_roles: ['Head of Field Service Ops', 'Solution Architect', 'IT Program', 'Security/Compliance'],
    why_it_converts: 'Pull from both technical and operational stakeholders.',
    gaps: ['In-scope repositories', 'Permissions model', 'Adoption ownership'],
    confidence: 'Medium',
  });

  // ── C) Objections ──
  createObjection({
    id: 'obj_01',
    org_id: ORG,
    account_id: ACCT,
    theme: 'AI increases risk / we can\'t pass audit',
    trigger_signals: ['sig_sch_02', 'Security microcast replay', 'Governance email reply'],
    root_cause: 'Unclear ownership, approval workflow, audit artifacts, residency posture.',
    what_they_need_to_see: ['RACI', 'Approval workflow', 'Residency posture', 'Audit artifacts checklist'],
    confidence: 'High',
  });

  createObjection({
    id: 'obj_02',
    org_id: ORG,
    account_id: ACCT,
    theme: 'Copilot won\'t work because data/permissions are messy',
    trigger_signals: ['sig_sch_03', 'RAG evidence request'],
    root_cause: 'KB inventory unknown; permissions model unclear; grounding sources not curated.',
    what_they_need_to_see: ['Repository inventory', 'Permissions map', 'Reference architecture', 'Logging/evals plan'],
    confidence: 'High',
  });

  createObjection({
    id: 'obj_03',
    org_id: ORG,
    account_id: ACCT,
    theme: 'Frontline adoption will fail / field ops disruption',
    trigger_signals: ['Field ops story open', 'Field ops hiring patterns'],
    root_cause: 'Workflow fit, device constraints, training burden, change management.',
    what_they_need_to_see: ['Workflow shortlist', 'Pilot success metrics', 'Champion model', 'Rollout plan'],
    confidence: 'Medium',
  });

  // ── D) EngagementSignals (7 from activity log) ──
  const engagementSeeds: Array<Omit<EngagementSignal, 'id' | 'created_at'> & { id: string }> = [
    {
      id: 'eng_hw_01',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'seller',
      title: 'Governance story viewed 3× in 48 h',
      so_what: 'Repeated governance content views suggest active internal compliance review.',
      interpretation: 'Cluster of governance views from same account indicates evaluation is underway.',
      recommended_next_moves: ['Offer governance workshop', 'Share RACI template'],
      confidence: 'High',
      tags: ['governance', 'copilot'],
    },
    {
      id: 'eng_hw_02',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'seller',
      title: 'Security microcast replayed twice',
      so_what: 'Security lead is revisiting audit-readiness content — likely preparing for internal review.',
      interpretation: 'Double replay of security content by CISO-adjacent role.',
      recommended_next_moves: ['Send security questionnaire template', 'Propose 30-min residency walkthrough'],
      confidence: 'High',
      tags: ['security', 'microcast'],
    },
    {
      id: 'eng_hw_03',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'seller',
      title: 'Quick Brief promoted to Deal Planning',
      so_what: 'Seller escalated brief — signals deal maturity advancement.',
      interpretation: 'Promotion to deal planning indicates the opportunity is progressing past early signals.',
      recommended_next_moves: ['Review deal brief completeness', 'Schedule stakeholder mapping session'],
      confidence: 'Medium',
      tags: ['deal-planning', 'brief'],
    },
    {
      id: 'eng_hw_04',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'engineer',
      title: 'RAG architecture doc opened + copied',
      so_what: 'Technical evaluation is active — architecture artifacts are being circulated internally.',
      interpretation: 'Copy action on architecture doc suggests it was shared with internal team.',
      recommended_next_moves: ['Offer architecture review session', 'Share reference implementation'],
      confidence: 'Medium',
      tags: ['architecture', 'rag'],
    },
    {
      id: 'eng_hw_05',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'seller',
      title: 'Field service story forwarded to colleague',
      so_what: 'Internal champion is amplifying field service use case to peers.',
      interpretation: 'Forward action indicates internal advocacy building around field ops scenario.',
      recommended_next_moves: ['Identify the forwarded-to person', 'Prepare field ops pilot scope'],
      confidence: 'Medium',
      tags: ['field-service', 'adoption'],
    },
    {
      id: 'eng_hw_06',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'seller',
      title: 'FinOps objection briefing completed',
      so_what: 'Seller consumed cost-governance content — likely preparing for CFO conversation.',
      interpretation: 'Full completion of FinOps content signals imminent budget discussion.',
      recommended_next_moves: ['Share cost threshold template', 'Offer FinOps-for-AI workshop'],
      confidence: 'High',
      tags: ['finops', 'objection'],
    },
    {
      id: 'eng_hw_07',
      org_id: ORG,
      account_id: ACCT,
      actor_role: 'seller',
      title: 'Governance email reply tracked',
      so_what: 'Customer replied to governance follow-up — engagement loop is active.',
      interpretation: 'Email reply confirms the governance thread is alive and customer is responsive.',
      recommended_next_moves: ['Schedule governance workshop', 'Prepare audit artifacts checklist'],
      confidence: 'High',
      tags: ['governance', 'email'],
    },
  ];

  for (const seed of engagementSeeds) {
    createEngagementSignal(seed);
  }

  // ── E) BriefingArtifacts ──
  createBriefingArtifact({
    id: 'ba_account_microcast_01',
    org_id: ORG,
    type: 'account_microcast',
    format: 'text',
    title: 'Schindler Microcast — Governed Copilot Pilot',
    summary: 'Security + procurement engagement indicates a governance-first pilot moment.',
    body_text: 'PLACEHOLDER: paste microcast script here',
    tags: ['schindler', 'copilot', 'governance', 'finops'],
    account_id: ACCT,
  });

  createBriefingArtifact({
    id: 'ba_industry_microcast_01',
    org_id: ORG,
    type: 'industry_microcast',
    format: 'text',
    title: 'Industry Microcast — Governed AI in Field Service',
    summary:
      'Regulated industrial orgs move from pilots to audited production; adoption depends on workflow + ownership.',
    body_text: 'PLACEHOLDER: paste industry microcast script here',
    tags: ['industrial', 'field service', 'ai governance'],
  });

  createBriefingArtifact({
    id: 'ba_objection_briefing_01',
    org_id: ORG,
    type: 'objection_briefing',
    format: 'text',
    title: 'Objection Briefing — Audit risk & AI governance',
    summary: 'What security needs to see before scale: RACI, approvals, residency posture, artifacts.',
    body_text: 'PLACEHOLDER: paste objection briefing here',
    tags: ['objections', 'audit', 'security'],
    account_id: ACCT,
  });

  // ── F) Evidence & Memory (Transcripts) ──
  addMemoryItem({
    account_id: 'schindler',
    type: 'transcript_notes',
    title: 'Transcript — Head of Data: AI-ready data platform',
    content_text: `Discovery call with Head of Data.

Key statements:
- "AI-ready means trusted data, clear ownership, and fast access."
- Governance is inconsistent across domains.
- No unified data inventory.
- Access approvals slow down AI experimentation.
- Desire for federated data products with central guardrails.
- Need lineage, catalog, policy automation.

Primary blockers:
- Manual governance processes
- No standard onboarding workflow
- Lack of reference architecture

Next steps discussed:
- Architecture workshop
- Pilot domains for governed dataset onboarding`,
    tags: ['transcript', 'head-of-data', 'governance', 'ai-ready'],
    scope_id: null,
  });

  addMemoryItem({
    account_id: 'schindler',
    type: 'transcript_notes',
    title: 'Transcript — Application Owner: Service Dispatch Hub',
    content_text: `Call with Application Owner of "Service Dispatch Hub"
(Field technician scheduling application)

Key statements:
- App is mission-critical for field operations.
- Integrations are brittle (point-to-point with ERP).
- Data extracts used for reporting; no governed event stream.
- Desire for event-driven publishing (JobCreated, JobCompleted).
- Predictive scheduling blocked by inconsistent data quality.
- Security approvals slow integration exposure.

Pain points:
- No standardized integration contracts
- Regional data inconsistencies
- Identity fragmentation

Opportunity:
- Event-driven architecture
- Shared data contracts
- Governance alignment with central data platform`,
    tags: ['transcript', 'application-owner', 'field-service', 'integration'],
    scope_id: null,
  });
}

// Auto-seed on import
seedHelioWorksDemo();
