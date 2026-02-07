// Partner Vendors — Enterprise governance for ecosystem bets
// Approved + Trending (Watchlist) + Deprecated lifecycle

import type { CapabilityLevel } from './partnerProfile';

// ============= Types =============

export type VendorStatus = 'approved' | 'trending' | 'deprecated';

export type VendorCategory =
  | 'llm'
  | 'orchestration'
  | 'vector-db'
  | 'evals'
  | 'observability'
  | 'security'
  | 'governance'
  | 'other';

export type IntegrationComplexity = 'low' | 'medium' | 'high';
export type CommercialModel = 'resell' | 'referral' | 'services-attach' | 'unknown';

export interface VendorSecurityNotes {
  deploymentModel: string;
  dataHandlingSummary: string;
  ssoScimAudit: string;
  residencyNotes: string;
}

export interface VendorDeliveryNotes {
  requiredRolesSkills: string[];
  typicalTimebox: string;
  integrationComplexity: IntegrationComplexity;
}

export interface VendorCapabilityReq {
  dimensionKey: string;
  level: CapabilityLevel;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  status: VendorStatus;
  oneLiner: string;
  mappedPackages: string[];
  requiredCapabilities: VendorCapabilityReq[];
  deliveryNotes: VendorDeliveryNotes;
  securityNotes: VendorSecurityNotes | 'DATA_NEEDED';
  commercialModel: CommercialModel;
  partnerEconomics: string;
  lastVerifiedAt?: string;
  verificationSourceLinks: string[];
  ownerName: string;
  ownerRole: string;
  expiryAt?: string; // required for Trending
  recommendedNextAction?: string; // required for Trending
}

// ============= Constants =============

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  llm: 'LLM',
  orchestration: 'Orchestration',
  'vector-db': 'Vector DB',
  evals: 'Evals',
  observability: 'Observability',
  security: 'Security',
  governance: 'Governance',
  other: 'Other',
};

export const VENDOR_STATUS_LABELS: Record<VendorStatus, string> = {
  approved: 'Approved',
  trending: 'Trending',
  deprecated: 'Deprecated',
};

export const COMMERCIAL_MODEL_LABELS: Record<CommercialModel, string> = {
  resell: 'Resell',
  referral: 'Referral',
  'services-attach': 'Services Attach',
  unknown: 'Unknown',
};

export const INTEGRATION_COMPLEXITY_LABELS: Record<IntegrationComplexity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

// ============= Seed Vendors =============

export const SEED_VENDORS: Vendor[] = [
  {
    id: 'vendor-azure-openai',
    name: 'Azure OpenAI Service',
    category: 'llm',
    status: 'approved',
    oneLiner: 'Enterprise-grade GPT models with Azure compliance, residency, and networking controls.',
    mappedPackages: ['pkg-rag', 'pkg-copilot', 'pkg-readiness'],
    requiredCapabilities: [
      { dimensionKey: 'architecture-rag-agents', level: 1 },
      { dimensionKey: 'security-identity', level: 2 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['Azure AI Engineer', 'Prompt Engineer'],
      typicalTimebox: '2–4 weeks',
      integrationComplexity: 'medium',
    },
    securityNotes: {
      deploymentModel: 'Azure-hosted (region-specific)',
      dataHandlingSummary: 'Data processed in-region; no cross-tenant data sharing; opt-out of abuse monitoring available.',
      ssoScimAudit: 'Azure AD SSO; full audit logging via Azure Monitor.',
      residencyNotes: 'Available in Switzerland North, West Europe, and 10+ other regions.',
    },
    commercialModel: 'services-attach',
    partnerEconomics: 'Azure consumption revenue + services margin (20–40%).',
    lastVerifiedAt: '2026-01-15',
    verificationSourceLinks: ['https://learn.microsoft.com/azure/ai-services/openai/'],
    ownerName: 'Marcus Steiner',
    ownerRole: 'Alliance Manager — Microsoft',
  },
  {
    id: 'vendor-langchain',
    name: 'LangChain / LangGraph',
    category: 'orchestration',
    status: 'approved',
    oneLiner: 'Open-source orchestration framework for building LLM-powered applications and agents.',
    mappedPackages: ['pkg-rag', 'pkg-readiness'],
    requiredCapabilities: [
      { dimensionKey: 'architecture-rag-agents', level: 2 },
      { dimensionKey: 'data-engineering', level: 1 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['Python/TypeScript Developer', 'AI Engineer'],
      typicalTimebox: '2–6 weeks',
      integrationComplexity: 'medium',
    },
    securityNotes: {
      deploymentModel: 'Self-hosted (any cloud/on-prem)',
      dataHandlingSummary: 'Open-source; data stays in customer infrastructure.',
      ssoScimAudit: 'N/A (library, not SaaS). LangSmith companion has SSO.',
      residencyNotes: 'Fully customer-controlled deployment.',
    },
    commercialModel: 'services-attach',
    partnerEconomics: 'Pure services revenue. No licensing fee for open-source.',
    lastVerifiedAt: '2026-01-20',
    verificationSourceLinks: ['https://langchain.com/', 'https://github.com/langchain-ai/langchain'],
    ownerName: 'Anja Müller',
    ownerRole: 'Practice Lead — AI Engineering',
  },
  {
    id: 'vendor-pinecone',
    name: 'Pinecone',
    category: 'vector-db',
    status: 'approved',
    oneLiner: 'Managed vector database for high-performance similarity search in RAG pipelines.',
    mappedPackages: ['pkg-rag'],
    requiredCapabilities: [
      { dimensionKey: 'data-engineering', level: 2 },
      { dimensionKey: 'architecture-rag-agents', level: 1 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['Data Engineer', 'Backend Developer'],
      typicalTimebox: '1–3 weeks',
      integrationComplexity: 'low',
    },
    securityNotes: {
      deploymentModel: 'SaaS (AWS/GCP/Azure)',
      dataHandlingSummary: 'Vectors stored encrypted at rest; customer-managed keys available on Enterprise.',
      ssoScimAudit: 'SSO via SAML/OIDC on Enterprise; SCIM not yet available; audit logs on Enterprise.',
      residencyNotes: 'Region-specific pods available (US, EU). Switzerland region not yet available.',
    },
    commercialModel: 'referral',
    partnerEconomics: 'Referral commission (10–15%) + services revenue.',
    lastVerifiedAt: '2026-01-10',
    verificationSourceLinks: ['https://www.pinecone.io/'],
    ownerName: 'Anja Müller',
    ownerRole: 'Practice Lead — AI Engineering',
  },
  {
    id: 'vendor-purview',
    name: 'Microsoft Purview',
    category: 'governance',
    status: 'approved',
    oneLiner: 'Unified governance for data cataloging, classification, and compliance across AI workloads.',
    mappedPackages: ['pkg-governance', 'pkg-security'],
    requiredCapabilities: [
      { dimensionKey: 'governance-risk', level: 2 },
      { dimensionKey: 'security-identity', level: 1 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['Data Governance Specialist', 'Azure Admin'],
      typicalTimebox: '3–6 weeks',
      integrationComplexity: 'medium',
    },
    securityNotes: {
      deploymentModel: 'Azure-native SaaS',
      dataHandlingSummary: 'Metadata cataloging; sensitive data classification with DLP integration.',
      ssoScimAudit: 'Azure AD SSO; full audit trail via Microsoft 365 compliance center.',
      residencyNotes: 'Available in all Azure regions including Switzerland.',
    },
    commercialModel: 'services-attach',
    partnerEconomics: 'M365 E5 licensing revenue + implementation services.',
    lastVerifiedAt: '2026-01-18',
    verificationSourceLinks: ['https://learn.microsoft.com/purview/'],
    ownerName: 'Marcus Steiner',
    ownerRole: 'Alliance Manager — Microsoft',
  },
  {
    id: 'vendor-presidio',
    name: 'Microsoft Presidio',
    category: 'security',
    status: 'approved',
    oneLiner: 'Open-source PII detection and anonymization for AI data pipelines.',
    mappedPackages: ['pkg-security', 'pkg-rag'],
    requiredCapabilities: [
      { dimensionKey: 'security-identity', level: 1 },
      { dimensionKey: 'data-engineering', level: 1 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['Python Developer', 'Security Engineer'],
      typicalTimebox: '1–2 weeks',
      integrationComplexity: 'low',
    },
    securityNotes: {
      deploymentModel: 'Self-hosted (any cloud/on-prem)',
      dataHandlingSummary: 'Open-source; data never leaves customer environment.',
      ssoScimAudit: 'N/A (library). Deploy within existing security perimeter.',
      residencyNotes: 'Fully customer-controlled.',
    },
    commercialModel: 'services-attach',
    partnerEconomics: 'Pure services revenue. No licensing.',
    lastVerifiedAt: '2026-01-12',
    verificationSourceLinks: ['https://github.com/microsoft/presidio'],
    ownerName: 'Lukas Weber',
    ownerRole: 'Practice Lead — Security',
  },
  // --- Trending ---
  {
    id: 'vendor-promptfoo',
    name: 'Promptfoo',
    category: 'evals',
    status: 'trending',
    oneLiner: 'Open-source LLM evaluation framework for testing prompts, models, and RAG pipelines.',
    mappedPackages: ['pkg-rag', 'pkg-readiness'],
    requiredCapabilities: [
      { dimensionKey: 'mlops-observability', level: 1 },
      { dimensionKey: 'architecture-rag-agents', level: 1 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['AI Engineer', 'QA Engineer'],
      typicalTimebox: '1–2 weeks',
      integrationComplexity: 'low',
    },
    securityNotes: 'DATA_NEEDED',
    commercialModel: 'services-attach',
    partnerEconomics: 'DATA NEEDED',
    verificationSourceLinks: ['https://github.com/promptfoo/promptfoo'],
    ownerName: 'Anja Müller',
    ownerRole: 'Practice Lead — AI Engineering',
    expiryAt: '2026-02-28',
    recommendedNextAction: 'Run internal PoC on 2 existing RAG projects to validate eval quality.',
  },
  {
    id: 'vendor-langsmith',
    name: 'LangSmith',
    category: 'observability',
    status: 'trending',
    oneLiner: 'Observability platform for LLM applications — tracing, debugging, and monitoring.',
    mappedPackages: ['pkg-rag'],
    requiredCapabilities: [
      { dimensionKey: 'mlops-observability', level: 1 },
    ],
    deliveryNotes: {
      requiredRolesSkills: ['AI Engineer', 'DevOps Engineer'],
      typicalTimebox: '1–2 weeks',
      integrationComplexity: 'low',
    },
    securityNotes: {
      deploymentModel: 'SaaS (US-hosted) or self-hosted Enterprise',
      dataHandlingSummary: 'Traces and logs are stored in LangSmith cloud unless self-hosted.',
      ssoScimAudit: 'SSO on Enterprise plan; SCIM not available; basic audit logging.',
      residencyNotes: 'SaaS is US-only. Self-hosted available for EU residency requirements.',
    },
    commercialModel: 'referral',
    partnerEconomics: 'DATA NEEDED',
    lastVerifiedAt: '2026-01-22',
    verificationSourceLinks: ['https://smith.langchain.com/'],
    ownerName: 'Anja Müller',
    ownerRole: 'Practice Lead — AI Engineering',
    expiryAt: '2026-03-15',
    recommendedNextAction: 'Negotiate partner pricing and confirm EU self-hosted deployment option.',
  },
  // --- Deprecated ---
  {
    id: 'vendor-chroma-legacy',
    name: 'ChromaDB (legacy eval)',
    category: 'vector-db',
    status: 'deprecated',
    oneLiner: 'Previously used for small PoC projects. Replaced by Pinecone for production workloads.',
    mappedPackages: [],
    requiredCapabilities: [],
    deliveryNotes: {
      requiredRolesSkills: ['Python Developer'],
      typicalTimebox: '1 week',
      integrationComplexity: 'low',
    },
    securityNotes: 'DATA_NEEDED',
    commercialModel: 'services-attach',
    partnerEconomics: 'N/A — no commercial relationship.',
    verificationSourceLinks: [],
    ownerName: 'Anja Müller',
    ownerRole: 'Practice Lead — AI Engineering',
  },
];

// ============= Helpers =============

export function getVendorById(id: string): Vendor | undefined {
  return SEED_VENDORS.find(v => v.id === id);
}

export function getVendorsByStatus(status: VendorStatus): Vendor[] {
  return SEED_VENDORS.filter(v => v.status === status);
}

export function getApprovedVendors(): Vendor[] {
  return getVendorsByStatus('approved');
}

export function getTrendingVendors(): Vendor[] {
  return getVendorsByStatus('trending');
}

export function getVendorsForPackage(packageId: string): Vendor[] {
  return SEED_VENDORS.filter(v => v.mappedPackages.includes(packageId) && v.status === 'approved');
}

export function getAllActiveVendors(): Vendor[] {
  return SEED_VENDORS.filter(v => v.status !== 'deprecated');
}
