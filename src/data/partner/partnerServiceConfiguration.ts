// Partner Service Configuration — seed dataset
// Contains vendor posture, partner capabilities, and service packs.
// Referenced by the deterministic scoring engine in servicePackStore.

import type { PackTag, CapabilityLevel } from './servicePackScoringConfig';

export interface ProofAsset {
  title: string;
  url: string;
}

export interface PartnerServicePack {
  id: string;
  name: string;
  description: string;
  tags: PackTag[];
  delivery_model: string;
  duration_band: string;
  pricing_band: string;
  proof_assets: ProofAsset[];
  required_capabilities: string[];
}

export interface PartnerServiceConfiguration {
  hub_org_id: string;
  vendor_posture: string;
  partner_capabilities: Record<string, CapabilityLevel>;
  service_packs: PartnerServicePack[];
}

export const partner_service_configuration: PartnerServiceConfiguration = {
  hub_org_id: 'helioworks',
  vendor_posture: 'Microsoft-first',
  partner_capabilities: {
    'Governance & Risk': 'Strong',
    'Security & Identity': 'Recognized',
    'Data Engineering': 'Strong',
    'Architecture': 'Recognized',
    'FinOps': 'Some',
    'Adoption / Change': 'Strong',
    'Cloud Operations': 'Strong',
    'Delivery Engineering': 'Some',
  },
  service_packs: [
    {
      id: 'sp_ai_readiness_001',
      name: 'AI Readiness & Use-Case Prioritization Sprint',
      description: 'Discovery sprint to prioritize AI use cases, align stakeholders, define success metrics, and produce a 90-day roadmap.',
      tags: ['ai_readiness', 'adoption_change'],
      delivery_model: 'fixed',
      duration_band: '2–3 weeks',
      pricing_band: 'CHF 25K–45K',
      proof_assets: [
        { title: 'Sprint deliverables deck', url: 'https://example.com/ai-readiness-deck' },
        { title: 'Use-case scoring template', url: 'https://example.com/usecase-scoring' },
      ],
      required_capabilities: ['Architecture', 'Adoption / Change'],
    },
    {
      id: 'sp_ai_gov_001',
      name: 'AI Governance Quickstart (Risk, Policy, Controls)',
      description: 'Define AI governance model, data boundaries, auditability, and policy controls aligned to enterprise security and compliance.',
      tags: ['ai_governance', 'security_identity'],
      delivery_model: 'hybrid',
      duration_band: '2–4 weeks',
      pricing_band: 'CHF 35K–70K',
      proof_assets: [
        { title: 'AI governance reference framework', url: 'https://example.com/ai-governance-framework' },
        { title: 'Control mapping template', url: 'https://example.com/control-mapping' },
      ],
      required_capabilities: ['Governance & Risk', 'Security & Identity'],
    },
    {
      id: 'sp_rag_agents_001',
      name: 'Secure RAG & Agents Prototype',
      description: 'Build a secure RAG/agent prototype with enterprise controls, logging, and a path to production hardening.',
      tags: ['rag_agents', 'data_platform', 'security_identity'],
      delivery_model: 'hybrid',
      duration_band: '3–6 weeks',
      pricing_band: 'CHF 60K–140K',
      proof_assets: [
        { title: 'Secure RAG reference architecture (slides)', url: 'https://example.com/secure-rag-architecture' },
      ],
      required_capabilities: ['Architecture', 'Data Engineering', 'Security & Identity'],
    },
    {
      id: 'sp_data_platform_001',
      name: 'Data Platform Assessment & Modernization Plan',
      description: 'Assess the current data platform, define target architecture, migration phases, and quick wins tied to measurable outcomes.',
      tags: ['data_platform', 'ai_readiness'],
      delivery_model: 'fixed',
      duration_band: '3–5 weeks',
      pricing_band: 'CHF 45K–90K',
      proof_assets: [
        { title: 'Target blueprint deck', url: 'https://example.com/data-platform-blueprint' },
      ],
      required_capabilities: ['Data Engineering', 'Architecture'],
    },
    {
      id: 'sp_security_identity_001',
      name: 'Identity & Access Hardening for AI Workloads',
      description: 'Harden IAM, least privilege, secrets management, and access patterns for AI services and data assets.',
      tags: ['security_identity', 'ai_governance'],
      delivery_model: 't&m',
      duration_band: '2–4 weeks',
      pricing_band: 'CHF 30K–75K',
      proof_assets: [
        { title: 'IAM hardening checklist', url: 'https://example.com/iam-checklist' },
      ],
      required_capabilities: ['Security & Identity'],
    },
    {
      id: 'sp_finops_001',
      name: 'FinOps for AI: Cost Baseline + Guardrails',
      description: 'Set cost baselines, monitoring, chargeback/showback, and guardrails for AI usage and scaling.',
      tags: ['finops', 'ai_governance'],
      delivery_model: 'fixed',
      duration_band: '2–3 weeks',
      pricing_band: 'CHF 20K–40K',
      proof_assets: [
        { title: 'AI cost guardrails template', url: 'https://example.com/ai-finops-guardrails' },
      ],
      required_capabilities: ['FinOps'],
    },
    {
      id: 'sp_m365_copilot_001',
      name: 'M365 Copilot Adoption Sprint',
      description: 'Drive Copilot readiness and adoption with enablement, change management, and measurable productivity scenarios.',
      tags: ['m365_copilot', 'adoption_change'],
      delivery_model: 'fixed',
      duration_band: '2–4 weeks',
      pricing_band: 'CHF 25K–55K',
      proof_assets: [
        { title: 'Copilot adoption playbook (deck)', url: 'https://example.com/copilot-playbook' },
      ],
      required_capabilities: ['Adoption / Change'],
    },
    {
      id: 'sp_cloud_ops_001',
      name: 'Managed Cloud Ops Starter (Landing + Run)',
      description: 'Establish operational baseline, monitoring, incident processes, and a scalable run model for cloud workloads.',
      tags: ['cloud_ops', 'finops'],
      delivery_model: 'hybrid',
      duration_band: '4–8 weeks',
      pricing_band: 'CHF 8K–25K / month',
      proof_assets: [
        { title: 'Managed services overview deck', url: 'https://example.com/managed-ops-deck' },
      ],
      required_capabilities: ['Cloud Operations'],
    },
  ],
};
