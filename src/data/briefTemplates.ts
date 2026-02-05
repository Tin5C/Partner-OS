// Brief Template Definitions (Partner-only)
// Template-driven input buckets, output sections, and maturity scoring
// Adding a new template requires only a new definition here + enabling in partner.ts

export type BriefTemplateId = 'AI_DEAL' | 'DATA_PLATFORM' | 'SECURITY_GOVERNANCE';

// ============= Input Bucket =============

export interface BriefTemplateBucket {
  id: string;
  label: string;
  description: string;
  placeholder: string;
  /** Pre-selected tag for "Ask colleague" shortcut */
  askColleagueTag: string;
}

// ============= Output Section Definitions =============

export interface BriefOutputSectionDef {
  id: string;
  label: string;
  /** Rendering hint for the UI */
  type: 'text' | 'list' | 'keyvalue' | 'checklist';
}

// ============= Maturity Dimension =============

export interface MaturityDimension {
  id: string;
  label: string;
  category: string;
  /** Which bucket IDs contribute to this dimension */
  bucketIds: string[];
}

// ============= Template Definition =============

export interface BriefTemplateDefinition {
  id: BriefTemplateId;
  label: string;
  shortDescription: string;
  inputBuckets: BriefTemplateBucket[];
  outputSectionsSeller: BriefOutputSectionDef[];
  outputSectionsEngineer: BriefOutputSectionDef[];
  maturityDimensions: MaturityDimension[];
  recommendedPacksTags: string[];
}

// ============= Template Config (for partner.ts) =============

export interface BriefTemplatesConfig {
  enabled: boolean;
  default: BriefTemplateId;
  available: BriefTemplateId[];
  definitions: Record<BriefTemplateId, BriefTemplateDefinition>;
}

// ============= AI_DEAL Template =============

const AI_DEAL_TEMPLATE: BriefTemplateDefinition = {
  id: 'AI_DEAL',
  label: 'AI Deal Brief',
  shortDescription: 'Turn messy AI deal context into a deal-ready plan in 5–10 minutes.',
  inputBuckets: [
    {
      id: 'apps-deployment',
      label: 'Apps & deployment',
      description: '1st/3rd party apps, cloud vs on-prem, core vs support systems',
      placeholder: 'e.g., SAP ECC on-prem, Salesforce Cloud, custom .NET portal, legacy HR system…',
      askColleagueTag: 'Application landscape',
    },
    {
      id: 'ai-vendor-maturity',
      label: 'AI vendor maturity',
      description: 'Key SaaS vendors, their AI capabilities, interoperability signals',
      placeholder: 'e.g., Using ServiceNow with AI modules, Salesforce Einstein active, no Azure OpenAI yet…',
      askColleagueTag: 'AI vendor landscape',
    },
    {
      id: 'org-readiness',
      label: 'Org readiness',
      description: 'CoE presence, AI champion roles, decision process',
      placeholder: 'e.g., No dedicated AI team, CTO is sponsor, IT runs PoCs, business signs off…',
      askColleagueTag: 'Stakeholders & process',
    },
    {
      id: 'data-readiness',
      label: 'Data readiness',
      description: 'Sources, owners, access patterns, unstructured data availability',
      placeholder: 'e.g., SQL data warehouse, SharePoint docs, no data catalog, data team of 3…',
      askColleagueTag: 'Data sources & owners',
    },
    {
      id: 'governance-risk',
      label: 'Governance / risk / compliance',
      description: 'AI policy, PII handling, data residency, audit requirements',
      placeholder: 'e.g., GDPR applies, no AI policy yet, data must stay in EU, annual audit…',
      askColleagueTag: 'Security & compliance',
    },
    {
      id: 'platform-delivery',
      label: 'Platform & delivery',
      description: 'Identity, CI/CD, observability, FinOps / MLOps-lite',
      placeholder: 'e.g., Entra ID, Azure DevOps, basic monitoring, no ML pipeline…',
      askColleagueTag: 'Architecture & integration',
    },
    {
      id: 'use-cases',
      label: 'Use case(s) + success criteria',
      description: 'Target AI use cases and how success will be measured',
      placeholder: 'e.g., Document processing for invoices — 80% auto-extraction, save 2 FTE…',
      askColleagueTag: 'Use cases',
    },
    {
      id: 'procurement',
      label: 'Procurement / commercials',
      description: 'Budget owner, procurement gates, existing entitlements',
      placeholder: 'e.g., IT budget, needs board approval >$100K, has Azure EA, M365 E5…',
      askColleagueTag: 'Licenses & entitlements',
    },
  ],
  outputSectionsSeller: [
    { id: 'use-case-outcome', label: 'Use case + business outcome', type: 'text' },
    { id: 'value-framing', label: 'Value framing + ROI narrative', type: 'text' },
    { id: 'talk-track', label: 'Talk track + agenda', type: 'list' },
    { id: 'objections', label: 'Objections & responses (AI-specific)', type: 'keyvalue' },
    { id: 'pilot-path', label: 'Next steps: pilot path + success criteria', type: 'list' },
    { id: 'follow-up-email', label: 'Follow-up email draft', type: 'text' },
  ],
  outputSectionsEngineer: [
    { id: 'assumptions', label: 'Assumptions & open questions', type: 'list' },
    { id: 'architecture', label: 'Architecture pattern recommendation', type: 'text' },
    { id: 'services', label: 'Required services / components', type: 'list' },
    { id: 'risks', label: 'Risks & mitigations', type: 'keyvalue' },
    { id: 'validation', label: 'Validation checklist (PoC gates)', type: 'checklist' },
  ],
  maturityDimensions: [
    { id: 'data-sources', label: 'Data sources identified', category: 'Data', bucketIds: ['data-readiness', 'apps-deployment'] },
    { id: 'data-owners', label: 'Data owners confirmed', category: 'Data', bucketIds: ['data-readiness', 'org-readiness'] },
    { id: 'data-sensitivity', label: 'Data sensitivity classified', category: 'Data', bucketIds: ['governance-risk'] },
    { id: 'security-stance', label: 'Security stance documented', category: 'Security', bucketIds: ['governance-risk'] },
    { id: 'residency', label: 'Data residency requirements clear', category: 'Security', bucketIds: ['governance-risk'] },
    { id: 'integration-map', label: 'Integration points mapped', category: 'Integration', bucketIds: ['apps-deployment', 'platform-delivery'] },
    { id: 'ai-stack', label: 'Current AI stack known', category: 'Integration', bucketIds: ['ai-vendor-maturity'] },
    { id: 'use-cases-defined', label: 'AI use cases defined', category: 'Business', bucketIds: ['use-cases'] },
    { id: 'success-criteria', label: 'Success criteria set', category: 'Business', bucketIds: ['use-cases'] },
    { id: 'governance-maturity', label: 'AI governance maturity assessed', category: 'Governance', bucketIds: ['governance-risk'] },
    { id: 'org-readiness', label: 'Org readiness assessed', category: 'Governance', bucketIds: ['org-readiness'] },
    { id: 'procurement-clear', label: 'Procurement path clear', category: 'Commercial', bucketIds: ['procurement'] },
  ],
  recommendedPacksTags: ['ai-readiness', 'copilot', 'azure-openai', 'data-ai'],
};

// ============= DATA_PLATFORM Template (behind feature flag) =============

const DATA_PLATFORM_TEMPLATE: BriefTemplateDefinition = {
  id: 'DATA_PLATFORM',
  label: 'Data Platform Brief',
  shortDescription: 'Map the data estate and build a modernization plan.',
  inputBuckets: [
    { id: 'current-data-estate', label: 'Current data estate', description: 'Databases, warehouses, lakes, ETL tools', placeholder: 'e.g., SQL Server on-prem, Snowflake, SSIS…', askColleagueTag: 'Data sources & owners' },
    { id: 'analytics-bi', label: 'Analytics & BI', description: 'Reporting tools, dashboards, self-service BI', placeholder: 'e.g., Power BI, Tableau, custom dashboards…', askColleagueTag: 'Architecture & integration' },
    { id: 'data-governance', label: 'Data governance', description: 'Catalog, lineage, quality, access control', placeholder: 'e.g., No catalog, manual lineage, ad-hoc quality checks…', askColleagueTag: 'Security & compliance' },
    { id: 'use-cases', label: 'Use case(s) + success criteria', description: 'Target outcomes for data platform', placeholder: 'e.g., Real-time dashboards, ML features, data mesh…', askColleagueTag: 'Use cases' },
    { id: 'procurement', label: 'Procurement / commercials', description: 'Budget, entitlements, licensing', placeholder: 'e.g., Azure EA, Fabric trial, budget approved…', askColleagueTag: 'Licenses & entitlements' },
  ],
  outputSectionsSeller: [
    { id: 'use-case-outcome', label: 'Use case + business outcome', type: 'text' },
    { id: 'value-framing', label: 'Value framing + TCO narrative', type: 'text' },
    { id: 'talk-track', label: 'Talk track + agenda', type: 'list' },
    { id: 'objections', label: 'Objections & responses', type: 'keyvalue' },
    { id: 'migration-path', label: 'Migration path + milestones', type: 'list' },
  ],
  outputSectionsEngineer: [
    { id: 'assumptions', label: 'Assumptions & open questions', type: 'list' },
    { id: 'architecture', label: 'Target architecture', type: 'text' },
    { id: 'services', label: 'Required services / components', type: 'list' },
    { id: 'risks', label: 'Risks & mitigations', type: 'keyvalue' },
    { id: 'validation', label: 'Validation checklist', type: 'checklist' },
  ],
  maturityDimensions: [
    { id: 'data-catalog', label: 'Data catalog exists', category: 'Foundation', bucketIds: ['data-governance'] },
    { id: 'data-quality', label: 'Data quality managed', category: 'Foundation', bucketIds: ['data-governance'] },
    { id: 'analytics-self-service', label: 'Self-service analytics', category: 'Analytics', bucketIds: ['analytics-bi'] },
    { id: 'real-time', label: 'Real-time capabilities', category: 'Analytics', bucketIds: ['current-data-estate'] },
    { id: 'governance', label: 'Data governance process', category: 'Governance', bucketIds: ['data-governance'] },
    { id: 'use-cases-defined', label: 'Use cases defined', category: 'Business', bucketIds: ['use-cases'] },
  ],
  recommendedPacksTags: ['data-platform', 'fabric', 'synapse', 'migration'],
};

// ============= SECURITY_GOVERNANCE Template (behind feature flag) =============

const SECURITY_GOVERNANCE_TEMPLATE: BriefTemplateDefinition = {
  id: 'SECURITY_GOVERNANCE',
  label: 'Security & Governance Brief',
  shortDescription: 'Assess security posture and build a protection roadmap.',
  inputBuckets: [
    { id: 'security-stack', label: 'Current security stack', description: 'SIEM, EDR, identity, firewall, DLP', placeholder: 'e.g., Splunk SIEM, CrowdStrike EDR, Okta identity…', askColleagueTag: 'Security & compliance' },
    { id: 'identity-access', label: 'Identity & access', description: 'IAM, MFA, conditional access, privileged access', placeholder: 'e.g., Entra ID, MFA enforced, no PIM, basic CA policies…', askColleagueTag: 'Architecture & integration' },
    { id: 'compliance-reqs', label: 'Compliance requirements', description: 'Frameworks, audits, certifications', placeholder: 'e.g., SOC2, ISO 27001, GDPR, annual pentest…', askColleagueTag: 'Security & compliance' },
    { id: 'use-cases', label: 'Use case(s) + success criteria', description: 'Security improvement targets', placeholder: 'e.g., XDR consolidation, zero-trust rollout…', askColleagueTag: 'Use cases' },
    { id: 'procurement', label: 'Procurement / commercials', description: 'Budget, entitlements, licensing', placeholder: 'e.g., M365 E5 Security, Defender licenses…', askColleagueTag: 'Licenses & entitlements' },
  ],
  outputSectionsSeller: [
    { id: 'use-case-outcome', label: 'Use case + security outcome', type: 'text' },
    { id: 'value-framing', label: 'Value framing + risk reduction', type: 'text' },
    { id: 'talk-track', label: 'Talk track + agenda', type: 'list' },
    { id: 'objections', label: 'Objections & responses', type: 'keyvalue' },
    { id: 'roadmap', label: 'Security roadmap + quick wins', type: 'list' },
  ],
  outputSectionsEngineer: [
    { id: 'assumptions', label: 'Assumptions & open questions', type: 'list' },
    { id: 'architecture', label: 'Target security architecture', type: 'text' },
    { id: 'services', label: 'Required services / components', type: 'list' },
    { id: 'risks', label: 'Risks & mitigations', type: 'keyvalue' },
    { id: 'validation', label: 'Validation checklist', type: 'checklist' },
  ],
  maturityDimensions: [
    { id: 'identity', label: 'Identity management mature', category: 'Identity', bucketIds: ['identity-access'] },
    { id: 'threat-detection', label: 'Threat detection active', category: 'Protection', bucketIds: ['security-stack'] },
    { id: 'compliance', label: 'Compliance frameworks met', category: 'Compliance', bucketIds: ['compliance-reqs'] },
    { id: 'use-cases-defined', label: 'Security use cases defined', category: 'Business', bucketIds: ['use-cases'] },
    { id: 'zero-trust', label: 'Zero-trust progress', category: 'Architecture', bucketIds: ['identity-access', 'security-stack'] },
  ],
  recommendedPacksTags: ['security', 'zero-trust', 'defender', 'sentinel'],
};

// ============= All Templates =============

export const BRIEF_TEMPLATE_DEFINITIONS: Record<BriefTemplateId, BriefTemplateDefinition> = {
  AI_DEAL: AI_DEAL_TEMPLATE,
  DATA_PLATFORM: DATA_PLATFORM_TEMPLATE,
  SECURITY_GOVERNANCE: SECURITY_GOVERNANCE_TEMPLATE,
};

// ============= Maturity Score Engine =============

export interface MaturityScore {
  overall: number; // 0–100
  label: string; // 'Not ready' | 'Ad-hoc' | 'Defined' | 'Scaled'
  dimensions: Array<{
    id: string;
    label: string;
    category: string;
    level: 0 | 1 | 2 | 3; // Unknown/Ad-hoc/Defined/Scaled
    levelLabel: string;
  }>;
  topBlockers: string[];
  missingChecklist: Array<{
    category: string;
    item: string;
    filled: boolean;
  }>;
}

const LEVEL_LABELS = ['Unknown', 'Ad-hoc', 'Defined', 'Scaled'] as const;

/**
 * Compute maturity score from bucket notes against template dimensions.
 * Each dimension scores 0–3 based on whether its contributing buckets have content.
 */
export function computeMaturityScore(
  templateId: BriefTemplateId,
  bucketNotes: Record<string, string>,
  evidenceBuckets: Set<string>,
): MaturityScore {
  const template = BRIEF_TEMPLATE_DEFINITIONS[templateId];
  if (!template) {
    return { overall: 0, label: 'Not ready', dimensions: [], topBlockers: [], missingChecklist: [] };
  }

  const dimensions = template.maturityDimensions.map((dim) => {
    // Count how many contributing buckets have content
    const filledBuckets = dim.bucketIds.filter(
      (bid) => (bucketNotes[bid] && bucketNotes[bid].trim().length > 0) || evidenceBuckets.has(bid)
    );
    const ratio = dim.bucketIds.length > 0 ? filledBuckets.length / dim.bucketIds.length : 0;

    let level: 0 | 1 | 2 | 3 = 0;
    if (ratio >= 1) level = 3;
    else if (ratio >= 0.5) level = 2;
    else if (ratio > 0) level = 1;

    return {
      id: dim.id,
      label: dim.label,
      category: dim.category,
      level,
      levelLabel: LEVEL_LABELS[level],
    };
  });

  const totalPossible = dimensions.length * 3;
  const totalScore = dimensions.reduce((sum, d) => sum + d.level, 0);
  const overall = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  let label = 'Not ready';
  if (overall >= 75) label = 'Scaled';
  else if (overall >= 50) label = 'Defined';
  else if (overall >= 25) label = 'Ad-hoc';

  // Top blockers: dimensions at level 0
  const topBlockers = dimensions
    .filter((d) => d.level === 0)
    .slice(0, 3)
    .map((d) => `${d.category}: ${d.label}`);

  // Missing checklist
  const missingChecklist = dimensions.map((d) => ({
    category: d.category,
    item: d.label,
    filled: d.level >= 2,
  }));

  return { overall, label, dimensions, topBlockers, missingChecklist };
}

/**
 * Get the default template config for partner.ts
 */
export function getDefaultBriefTemplatesConfig(): BriefTemplatesConfig {
  return {
    enabled: true,
    default: 'AI_DEAL',
    available: ['AI_DEAL'],
    definitions: BRIEF_TEMPLATE_DEFINITIONS,
  };
}
