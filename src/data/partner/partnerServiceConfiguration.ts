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
  required_capabilities: string[]; // human-readable capability names
}

export interface PartnerServiceConfiguration {
  vendor_posture: string;
  partner_capabilities: Record<string, CapabilityLevel>;
  service_packs: PartnerServicePack[];
}

export const partner_service_configuration: PartnerServiceConfiguration = {
  vendor_posture: 'Microsoft-first',
  partner_capabilities: {
    'Governance & Risk': 'Strong',
    'Security & Identity': 'Recognized',
    'Data Engineering': 'Strong',
    'Architecture': 'Some',
    'FinOps': 'Some',
    'Adoption / Change': 'Strong',
    'Cloud Operations': 'Strong',
    'Delivery Engineering': 'Some',
  },
  service_packs: [
    {
      id: 'sp_ai_readiness_001',
      name: 'AI Readiness & Use-Case Prioritization Sprint',
      description: 'Rapid discovery to prioritize AI use cases and define a 90-day execution roadmap.',
      tags: ['ai_readiness', 'adoption_change'],
      delivery_model: 'fixed',
      duration_band: '2–3 weeks',
      pricing_band: '$25K–$45K',
      proof_assets: [
        { title: 'Sprint deliverables deck', url: 'https://example.com/ai-readiness-deck' },
      ],
      required_capabilities: ['Architecture', 'Adoption / Change'],
    },
    {
      id: 'sp_ai_gov_001',
      name: 'AI Governance Quickstart',
      description: 'Define AI governance model, controls, and compliance structure.',
      tags: ['ai_governance', 'security_identity'],
      delivery_model: 'hybrid',
      duration_band: '2–4 weeks',
      pricing_band: '$35K–$70K',
      proof_assets: [
        { title: 'AI governance framework', url: 'https://example.com/ai-governance-framework' },
      ],
      required_capabilities: ['Governance & Risk', 'Security & Identity'],
    },
    {
      id: 'sp_rag_agents_001',
      name: 'Secure RAG & Agents Prototype',
      description: 'Enterprise-ready RAG/agent prototype with security controls.',
      tags: ['rag_agents', 'data_platform', 'security_identity'],
      delivery_model: 'hybrid',
      duration_band: '3–6 weeks',
      pricing_band: '$60K–$140K',
      proof_assets: [],
      required_capabilities: ['Architecture', 'Data Engineering', 'Security & Identity'],
    },
    {
      id: 'sp_data_platform_001',
      name: 'Data Platform Assessment',
      description: 'Assess and modernize data platform architecture.',
      tags: ['data_platform', 'ai_readiness'],
      delivery_model: 'fixed',
      duration_band: '3–5 weeks',
      pricing_band: '$45K–$90K',
      proof_assets: [],
      required_capabilities: ['Data Engineering', 'Architecture'],
    },
    {
      id: 'sp_m365_copilot_001',
      name: 'M365 Copilot Adoption Sprint',
      description: 'Drive Copilot adoption and measurable productivity.',
      tags: ['m365_copilot', 'adoption_change'],
      delivery_model: 'fixed',
      duration_band: '2–4 weeks',
      pricing_band: '$25K–$55K',
      proof_assets: [],
      required_capabilities: ['Adoption / Change'],
    },
  ],
};
