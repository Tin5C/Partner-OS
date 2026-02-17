// Partner-only Service Pack catalog for Recommended Plays scoring
// Does NOT replace existing servicePackStore — used only by propensity engine

export interface PlayServicePack {
  id: string;
  name: string;
  tags: string[];
  bias: 'new_logo' | 'existing_customer' | null;
  motionFit: string[];
  prerequisites: string[];
  effort: 'S' | 'M' | 'L';
}

export const PLAY_SERVICE_PACKS: PlayServicePack[] = [
  {
    id: 'play_discovery',
    name: 'AI Discovery & Use-Case Sprint',
    tags: ['ai_readiness', 'adoption_change', 'discovery'],
    bias: 'new_logo',
    motionFit: ['Net-New Acquisition', 'Strategic Pursuit', 'Partner-led Introduction'],
    prerequisites: ['Stakeholder alignment', 'Business unit sponsorship'],
    effort: 'S',
  },
  {
    id: 'play_governance',
    name: 'AI Governance Quickstart',
    tags: ['ai_governance', 'security_identity', 'compliance'],
    bias: null,
    motionFit: ['Compliance Upgrade', 'RFP/Tender', 'Competitive Displacement'],
    prerequisites: ['CISO engagement', 'Existing risk framework'],
    effort: 'M',
  },
  {
    id: 'play_copilot_adoption',
    name: 'Copilot Adoption Accelerator',
    tags: ['m365_copilot', 'adoption_change'],
    bias: 'existing_customer',
    motionFit: ['Upsell', 'Expansion', 'Renewal'],
    prerequisites: ['M365 E3+ licensing', 'Change management sponsor'],
    effort: 'S',
  },
  {
    id: 'play_rag_prototype',
    name: 'Secure RAG & Agents Prototype',
    tags: ['rag_agents', 'data_platform', 'security_identity'],
    bias: 'new_logo',
    motionFit: ['Strategic Pursuit', 'Net-New Acquisition', 'Transformation Program'],
    prerequisites: ['Data platform access', 'Architecture sponsor'],
    effort: 'L',
  },
  {
    id: 'play_data_modernization',
    name: 'Data Platform Modernization',
    tags: ['data_platform', 'ai_readiness'],
    bias: null,
    motionFit: ['Transformation Program', 'Expansion', 'Strategic Pursuit'],
    prerequisites: ['Existing data landscape documentation', 'Executive sponsorship'],
    effort: 'L',
  },
  {
    id: 'play_finops',
    name: 'FinOps for AI Workloads',
    tags: ['finops', 'ai_governance'],
    bias: 'existing_customer',
    motionFit: ['Upsell', 'Renewal', 'Expansion'],
    prerequisites: ['Azure consumption baseline', 'Finance stakeholder access'],
    effort: 'S',
  },
  {
    id: 'play_managed_ops',
    name: 'Managed Cloud Operations',
    tags: ['cloud_ops', 'finops'],
    bias: 'existing_customer',
    motionFit: ['Renewal', 'Expansion', 'Cross-sell'],
    prerequisites: ['Azure landing zone', 'Monitoring baseline'],
    effort: 'M',
  },
  {
    id: 'play_competitive_takeout',
    name: 'Competitive Displacement Sprint',
    tags: ['ai_governance', 'security_identity', 'data_platform'],
    bias: 'new_logo',
    motionFit: ['Competitive Displacement', 'RFP/Tender'],
    prerequisites: ['Competitive landscape intel', 'Technical champion'],
    effort: 'M',
  },
];
