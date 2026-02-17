// Partner-only Technical Pack catalog for Technology View recommendations

export interface TechnicalPack {
  id: string;
  name: string;
  tags: string[];
  bias: 'new_logo' | 'existing_customer' | null;
  motionFit: string[];
  prerequisites: string[];
  effort: 'S' | 'M' | 'L';
  requiredArtifacts: string[];
  keyRisks: string[];
}

export const TECHNICAL_PACKS: TechnicalPack[] = [
  {
    id: 'tech_ai_readiness_assessment',
    name: 'AI Readiness Technical Assessment',
    tags: ['ai_readiness', 'data_platform', 'discovery'],
    bias: 'new_logo',
    motionFit: ['Net-New Acquisition', 'Strategic Pursuit', 'Partner-led Introduction'],
    prerequisites: ['Access to existing data estate', 'Architecture documentation'],
    effort: 'S',
    requiredArtifacts: ['Current architecture diagram', 'Data inventory', 'Infra cost baseline'],
    keyRisks: ['Incomplete data catalog', 'Legacy system dependencies'],
  },
  {
    id: 'tech_azure_landing_zone',
    name: 'Azure Landing Zone Design',
    tags: ['cloud_ops', 'security_identity'],
    bias: null,
    motionFit: ['Transformation Program', 'Net-New Acquisition', 'Expansion'],
    prerequisites: ['Azure subscription access', 'Network architecture docs'],
    effort: 'M',
    requiredArtifacts: ['Network topology', 'IAM policy matrix', 'Compliance requirements'],
    keyRisks: ['Multi-region complexity', 'Existing on-prem dependencies'],
  },
  {
    id: 'tech_rag_architecture',
    name: 'RAG Architecture & Security Review',
    tags: ['rag_agents', 'security_identity', 'ai_governance'],
    bias: 'new_logo',
    motionFit: ['Strategic Pursuit', 'Competitive Displacement'],
    prerequisites: ['Azure OpenAI provisioned', 'Data classification completed'],
    effort: 'M',
    requiredArtifacts: ['Data flow diagram', 'Security threat model', 'API integration spec'],
    keyRisks: ['Data leakage vectors', 'Prompt injection surface', 'Latency requirements'],
  },
  {
    id: 'tech_copilot_readiness',
    name: 'Copilot Technical Readiness',
    tags: ['m365_copilot', 'security_identity'],
    bias: 'existing_customer',
    motionFit: ['Upsell', 'Expansion', 'Renewal'],
    prerequisites: ['M365 E3+ licensing', 'Azure AD P1+'],
    effort: 'S',
    requiredArtifacts: ['Licensing inventory', 'Permission audit report', 'Sensitivity labels config'],
    keyRisks: ['Over-permissioned SharePoint', 'Unlabeled sensitive content'],
  },
  {
    id: 'tech_data_platform_migration',
    name: 'Data Platform Migration Blueprint',
    tags: ['data_platform', 'ai_readiness'],
    bias: null,
    motionFit: ['Transformation Program', 'Expansion'],
    prerequisites: ['Source system access', 'ETL/ELT pipeline documentation'],
    effort: 'L',
    requiredArtifacts: ['Source-to-target mapping', 'Data quality assessment', 'Migration runbook'],
    keyRisks: ['Data quality gaps', 'Downtime constraints', 'Schema drift'],
  },
  {
    id: 'tech_finops_instrumentation',
    name: 'FinOps Instrumentation & Guardrails',
    tags: ['finops', 'cloud_ops'],
    bias: 'existing_customer',
    motionFit: ['Renewal', 'Upsell'],
    prerequisites: ['Azure Cost Management access', 'Tagging policy'],
    effort: 'S',
    requiredArtifacts: ['Cost allocation model', 'Budget guardrail config', 'Alert policy spec'],
    keyRisks: ['Untagged resources', 'Reserved instance mismatch'],
  },
];
