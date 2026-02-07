// Partner Packages & Tools/Agents Data Model
// Types, seed data, and helper functions for the Package Factory system

// ============= Types =============

export type PackageStatus = 'draft' | 'approved' | 'retired';
export type ToolAgentType = 'agent' | 'tool' | 'template';
export type ToolAgentStatus = 'approved' | 'deprecated';
export type RecurringModel = 'none' | 'retainer' | 'managed-service' | 'quarterly-review';
export type PricingTierName = 'good' | 'better' | 'best';
export type PackageCategory =
  | 'governance'
  | 'copilot-adoption'
  | 'rag'
  | 'finops'
  | 'security-review'
  | 'data-readiness';

export interface PricingTier {
  tierName: PricingTierName;
  description: string;
  deliverablesDelta: string[];
  indicativeRange?: string;
}

export interface ProofKit {
  requiredCustomerInputs: string[];
  proofArtifactsToRequest: string[];
  artifactsWeProvide: string[];
  riskClauses: string[];
}

export interface MaturityTrigger {
  dimensionKey: string;
  condition: 'unknown' | 'ad-hoc' | 'below-defined';
  weight: number;
}

export interface AIPackage {
  id: string;
  name: string;
  category: PackageCategory;
  shortOutcome: string;
  targetBuyers: string[];
  whenToSell: string[];
  whenNotToSell: string[];
  deliverables: string[];
  timebox: string;
  pricingTiers: PricingTier[];
  recurringModel: RecurringModel;
  proofKit: ProofKit;
  maturityTriggers: MaturityTrigger[];
  toolsAndAgents: string[]; // ToolAgent ids
  status: PackageStatus;
  owner: string;
  updatedAt: string;
}

export interface ToolAgent {
  id: string;
  name: string;
  type: ToolAgentType;
  description: string;
  whenToUse: string[];
  securityNotes: string[];
  inputNeeded: string[];
  outputsProduced: string[];
  links: string[];
  status: ToolAgentStatus;
  mappedPackages: string[]; // Package ids
}

export interface PackageAttachment {
  briefId: string;
  packageId: string;
  selectedTier: PricingTierName;
  notes: string;
  addedAt: string;
}

export interface SellerKit {
  packageId: string;
  discoveryQuestions: string[];
  talkTrack: string[];
  objections: Array<{ objection: string; response: string }>;
  firstMeetingAgenda: string[];
  nextSteps: string[];
  emailDraft?: string;
}

// ============= Seed Tools & Agents =============

export const SEED_TOOLS: ToolAgent[] = [
  {
    id: 'tool-readiness-assessment',
    name: 'AI Readiness Assessment Agent',
    type: 'agent',
    description: 'Automated questionnaire + scoring engine for AI maturity across 8 dimensions.',
    whenToUse: [
      'At the start of any AI engagement to baseline the customer',
      'When updating maturity scores after a workshop',
      'When comparing multiple business units within an account',
    ],
    securityNotes: [
      'No customer data is stored externally — runs locally within the brief',
      'Assessment results are tied to the deal brief, not shared across accounts',
    ],
    inputNeeded: [
      'Responses to 8-dimension questionnaire',
      'Optional: existing maturity reports or audit results',
    ],
    outputsProduced: [
      'AI Readiness score (0–100)',
      'Per-dimension maturity breakdown',
      'Top 3 blockers with recommended actions',
    ],
    links: ['https://docs.internal/ai-readiness-agent'],
    status: 'approved',
    mappedPackages: ['pkg-readiness', 'pkg-governance', 'pkg-copilot'],
  },
  {
    id: 'tool-rag-evaluator',
    name: 'RAG Architecture Evaluator',
    type: 'tool',
    description: 'Validates RAG pipeline design against best practices and security requirements.',
    whenToUse: [
      'During RAG accelerator engagements to validate architecture',
      'When customer has existing RAG setup that needs optimization',
    ],
    securityNotes: [
      'Does not process actual customer documents — works on architecture metadata only',
      'Requires VPN access for on-premises assessments',
    ],
    inputNeeded: [
      'Architecture diagram or description of current/proposed RAG setup',
      'Data source inventory and access patterns',
    ],
    outputsProduced: [
      'Architecture scorecard with recommendations',
      'Security compliance checklist for data handling',
      'Performance optimization suggestions',
    ],
    links: ['https://docs.internal/rag-evaluator'],
    status: 'approved',
    mappedPackages: ['pkg-rag'],
  },
  {
    id: 'tool-copilot-roi',
    name: 'Copilot ROI Calculator',
    type: 'template',
    description: 'Pre-built Excel/Power BI template for modeling Copilot productivity gains.',
    whenToUse: [
      'During Copilot adoption workshops to build the business case',
      'When customer asks for quantified ROI before signing off',
      'For executive presentations requiring financial justification',
    ],
    securityNotes: [
      'Template runs locally — no data leaves the customer environment',
      'Financial assumptions are configurable and transparent',
    ],
    inputNeeded: [
      'Number of knowledge workers by role',
      'Average hourly cost by role category',
      'Current time-on-task estimates for target workflows',
    ],
    outputsProduced: [
      'Annual productivity savings estimate',
      '3-year TCO vs. ROI projection',
      'Executive summary slide deck (auto-generated)',
    ],
    links: ['https://templates.internal/copilot-roi'],
    status: 'approved',
    mappedPackages: ['pkg-copilot'],
  },
  {
    id: 'tool-governance-scanner',
    name: 'AI Governance Policy Scanner',
    type: 'agent',
    description: 'Scans existing IT policies and flags gaps for AI-specific governance.',
    whenToUse: [
      'At the start of governance engagements to identify policy gaps',
      'When customer needs to comply with EU AI Act or similar regulation',
    ],
    securityNotes: [
      'Policies are processed in-session only — not stored',
      'Requires NDA to be in place before scanning sensitive documents',
      'Results are for advisory purposes only — not legal advice',
    ],
    inputNeeded: [
      'Existing IT/data governance policies (PDF or document links)',
      'Target regulatory framework (EU AI Act, NIST, ISO 42001, etc.)',
    ],
    outputsProduced: [
      'Gap analysis report with severity ratings',
      'Recommended policy templates for missing areas',
      'Implementation priority matrix',
    ],
    links: ['https://docs.internal/governance-scanner'],
    status: 'approved',
    mappedPackages: ['pkg-governance', 'pkg-security'],
  },
  {
    id: 'tool-finops-dashboard',
    name: 'AI FinOps Dashboard Template',
    type: 'template',
    description: 'Pre-configured cost monitoring dashboard for Azure AI services.',
    whenToUse: [
      'After AI workloads are deployed to establish cost monitoring',
      'During FinOps setup engagements',
      'When customer reports unexpected AI service costs',
    ],
    securityNotes: [
      'Requires read-only access to Azure Cost Management APIs',
      'No write permissions to customer resources',
    ],
    inputNeeded: [
      'Azure subscription IDs for AI workloads',
      'Budget thresholds and alert preferences',
    ],
    outputsProduced: [
      'Real-time cost monitoring dashboard',
      'Anomaly detection alerts for cost spikes',
      'Monthly cost optimization recommendations',
    ],
    links: ['https://templates.internal/finops-dashboard'],
    status: 'approved',
    mappedPackages: ['pkg-finops'],
  },
];

// ============= Seed Packages =============

export const SEED_PACKAGES: AIPackage[] = [
  {
    id: 'pkg-readiness',
    name: 'AI Readiness & Use Case Prioritization',
    category: 'data-readiness',
    shortOutcome: 'Prioritized AI use case roadmap with readiness score and business case.',
    targetBuyers: ['CTO', 'CDO', 'VP Engineering', 'Head of Innovation'],
    whenToSell: [
      'Customer says "we want to do AI but don\'t know where to start"',
      'Multiple AI ideas floating around with no prioritization',
      'Budget allocated but no clear use case ownership',
    ],
    whenNotToSell: [
      'Customer already has a mature AI CoE with active projects',
      'Customer is only looking for a specific tool implementation (use RAG Accelerator instead)',
    ],
    deliverables: [
      'AI maturity assessment (8 dimensions)',
      'Use case inventory with scoring matrix',
      'Top 3 prioritized use cases with business cases',
      'Data readiness assessment per use case',
      'Recommended architecture patterns',
      'Implementation roadmap (30/60/90 day)',
      'Executive presentation deck',
      'Stakeholder alignment workshop facilitation',
    ],
    timebox: '2–3 weeks',
    pricingTiers: [
      {
        tierName: 'good',
        description: 'Assessment + prioritized use case list',
        deliverablesDelta: ['AI maturity assessment', 'Use case scoring matrix', 'Top 3 recommendations'],
        indicativeRange: '$15K – $25K',
      },
      {
        tierName: 'better',
        description: 'Full assessment + business cases + roadmap',
        deliverablesDelta: ['All Good tier items', 'Detailed business cases', 'Implementation roadmap', 'Executive deck'],
        indicativeRange: '$25K – $45K',
      },
      {
        tierName: 'best',
        description: 'Full engagement + stakeholder workshops + pilot kickoff',
        deliverablesDelta: ['All Better tier items', 'Stakeholder workshops', 'Pilot kickoff plan', 'Change management framework'],
        indicativeRange: '$45K – $75K',
      },
    ],
    recurringModel: 'none',
    proofKit: {
      requiredCustomerInputs: [
        'Current technology landscape overview',
        'Existing AI initiatives or experiments (if any)',
        'Business priorities for the next 12–18 months',
        'Key stakeholder availability for workshops',
      ],
      proofArtifactsToRequest: [
        'IT architecture diagram (current state)',
        'Data inventory or catalog (if available)',
        'Strategic planning documents',
      ],
      artifactsWeProvide: [
        'AI maturity scorecard template',
        'Use case prioritization framework',
        'Reference architecture catalog',
        'Executive summary template',
      ],
      riskClauses: [
        'Data access dependency: assessment quality depends on access to data source documentation',
        'Stakeholder availability: workshops require key decision-makers to participate',
        'Scope creep: additional use cases beyond top 3 require separate engagement',
      ],
    },
    maturityTriggers: [
      { dimensionKey: 'ai-vendor-maturity', condition: 'unknown', weight: 3 },
      { dimensionKey: 'org-readiness', condition: 'ad-hoc', weight: 2 },
      { dimensionKey: 'use-cases', condition: 'unknown', weight: 3 },
    ],
    toolsAndAgents: ['tool-readiness-assessment'],
    status: 'approved',
    owner: 'Practice Lead — AI Strategy',
    updatedAt: '2025-12-15',
  },
  {
    id: 'pkg-governance',
    name: 'AI Governance Quickstart',
    category: 'governance',
    shortOutcome: 'Operational AI governance framework with policies, roles, and monitoring.',
    targetBuyers: ['CISO', 'CTO', 'Chief Risk Officer', 'Head of Compliance'],
    whenToSell: [
      'Customer deploying AI without formal governance policies',
      'Regulatory pressure (EU AI Act, industry-specific compliance)',
      'Board or exec team asking "are we doing AI responsibly?"',
    ],
    whenNotToSell: [
      'Customer has a mature AI governance team with established policies',
      'Customer is pre-AI (sell Readiness package first)',
    ],
    deliverables: [
      'AI governance policy framework (draft)',
      'AI risk classification matrix',
      'RACI for AI model lifecycle',
      'Monitoring & audit recommendations',
      'Compliance gap analysis',
      'Governance committee charter template',
      'Quarterly review process design',
    ],
    timebox: '3–4 weeks',
    pricingTiers: [
      {
        tierName: 'good',
        description: 'Policy framework + risk classification',
        deliverablesDelta: ['AI governance policy draft', 'Risk classification matrix', 'High-level RACI'],
        indicativeRange: '$20K – $35K',
      },
      {
        tierName: 'better',
        description: 'Full framework + compliance analysis + monitoring design',
        deliverablesDelta: ['All Good tier items', 'Compliance gap analysis', 'Monitoring recommendations', 'Committee charter'],
        indicativeRange: '$35K – $55K',
      },
      {
        tierName: 'best',
        description: 'Full engagement + quarterly review setup + training',
        deliverablesDelta: ['All Better tier items', 'Quarterly review process', 'Team training workshops', 'Ongoing advisory retainer setup'],
        indicativeRange: '$55K – $85K',
      },
    ],
    recurringModel: 'quarterly-review',
    proofKit: {
      requiredCustomerInputs: [
        'Current AI projects and models in production',
        'Existing governance or risk management frameworks',
        'Regulatory requirements applicable to their industry',
        'Organizational structure for technology decision-making',
      ],
      proofArtifactsToRequest: [
        'Current IT/data governance policies',
        'AI model inventory (if exists)',
      ],
      artifactsWeProvide: [
        'AI governance policy template library',
        'Risk classification framework',
        'Compliance mapping template',
      ],
      riskClauses: [
        'Regulatory landscape is evolving — framework may need updates as new regulations are finalized',
        'Policy adoption requires executive sponsorship and cultural change management',
        'Compliance gaps may require legal review beyond our advisory scope',
      ],
    },
    maturityTriggers: [
      { dimensionKey: 'governance-risk', condition: 'unknown', weight: 3 },
      { dimensionKey: 'governance-risk', condition: 'ad-hoc', weight: 2 },
      { dimensionKey: 'org-readiness', condition: 'ad-hoc', weight: 1 },
    ],
    toolsAndAgents: ['tool-governance-scanner', 'tool-readiness-assessment'],
    status: 'approved',
    owner: 'Practice Lead — Governance & Risk',
    updatedAt: '2025-12-10',
  },
  {
    id: 'pkg-copilot',
    name: 'Copilot Adoption Sprint',
    category: 'copilot-adoption',
    shortOutcome: 'Rapid Copilot deployment with measurable adoption metrics in 4 weeks.',
    targetBuyers: ['CIO', 'VP IT', 'Head of Digital Workplace', 'CHRO'],
    whenToSell: [
      'Customer has M365 E5 or Copilot licenses but low adoption',
      'Executive mandate to "make Copilot work" across the org',
      'Customer wants quick wins to justify broader AI investment',
    ],
    whenNotToSell: [
      'Customer doesn\'t have M365 E3/E5 (address licensing first)',
      'Customer wants custom AI development (use RAG Accelerator)',
    ],
    deliverables: [
      'Copilot readiness assessment',
      'Role-based adoption playbook',
      'Champion network design & training',
      'Usage analytics dashboard setup',
      'Success metrics framework',
      'Executive ROI report template',
      '4-week sprint plan with milestones',
      'Change management toolkit',
    ],
    timebox: '4–6 weeks',
    pricingTiers: [
      {
        tierName: 'good',
        description: 'Assessment + adoption playbook',
        deliverablesDelta: ['Readiness assessment', 'Role-based playbook', 'Sprint plan'],
        indicativeRange: '$18K – $30K',
      },
      {
        tierName: 'better',
        description: 'Full sprint + analytics + champion program',
        deliverablesDelta: ['All Good tier items', 'Analytics dashboard', 'Champion program', 'Change toolkit'],
        indicativeRange: '$30K – $50K',
      },
      {
        tierName: 'best',
        description: 'Full engagement + executive reporting + ongoing retainer',
        deliverablesDelta: ['All Better tier items', 'Executive ROI reporting', 'Monthly optimization reviews', 'Ongoing advisory'],
        indicativeRange: '$50K – $80K',
      },
    ],
    recurringModel: 'retainer',
    proofKit: {
      requiredCustomerInputs: [
        'M365 license inventory and Copilot allocation plan',
        'Target user groups and roles for initial rollout',
        'Current productivity pain points by department',
        'IT readiness for Copilot prerequisites (data, security)',
      ],
      proofArtifactsToRequest: [
        'M365 usage reports (current)',
        'Organizational chart for target departments',
        'Any previous Copilot pilot results',
      ],
      artifactsWeProvide: [
        'Copilot ROI calculator',
        'Role-based prompt library',
        'Adoption tracking dashboard template',
        'Executive presentation template',
      ],
      riskClauses: [
        'Adoption depends on end-user engagement — champion network is critical',
        'ROI measurement requires minimum 4 weeks of usage data',
        'Data quality in M365 affects Copilot output quality',
      ],
    },
    maturityTriggers: [
      { dimensionKey: 'ai-vendor-maturity', condition: 'ad-hoc', weight: 2 },
      { dimensionKey: 'org-readiness', condition: 'below-defined', weight: 2 },
    ],
    toolsAndAgents: ['tool-copilot-roi', 'tool-readiness-assessment'],
    status: 'approved',
    owner: 'Practice Lead — Modern Workplace',
    updatedAt: '2026-01-08',
  },
  {
    id: 'pkg-rag',
    name: 'RAG Accelerator',
    category: 'rag',
    shortOutcome: 'Production-ready RAG pipeline from unstructured data to intelligent search in 6 weeks.',
    targetBuyers: ['CTO', 'VP Engineering', 'Head of Data', 'Head of Product'],
    whenToSell: [
      'Customer wants to build AI-powered search or knowledge base',
      'Customer has large volumes of unstructured documents (PDFs, wikis, etc.)',
      'Customer evaluating GenAI but wants to use their own data, not just public models',
    ],
    whenNotToSell: [
      'Customer\'s primary need is structured data analytics (use Data Readiness instead)',
      'Customer has no clear use case for document/knowledge search',
    ],
    deliverables: [
      'Data source inventory and ingestion design',
      'Chunking and embedding strategy',
      'Vector store setup and optimization',
      'Retrieval pipeline with ranking',
      'LLM integration and prompt engineering',
      'Evaluation framework (accuracy, relevance, latency)',
      'Security and access control design',
      'Production deployment guide',
      'Monitoring and observability setup',
    ],
    timebox: '4–6 weeks',
    pricingTiers: [
      {
        tierName: 'good',
        description: 'PoC with single data source + evaluation',
        deliverablesDelta: ['Single data source ingestion', 'Basic RAG pipeline', 'Evaluation report'],
        indicativeRange: '$25K – $40K',
      },
      {
        tierName: 'better',
        description: 'Multi-source pipeline + security + monitoring',
        deliverablesDelta: ['All Good tier items', 'Multi-source ingestion', 'Access control design', 'Monitoring setup'],
        indicativeRange: '$40K – $65K',
      },
      {
        tierName: 'best',
        description: 'Production-ready + managed service + optimization',
        deliverablesDelta: ['All Better tier items', 'Production deployment', 'Ongoing optimization', 'Advanced ranking tuning'],
        indicativeRange: '$65K – $100K',
      },
    ],
    recurringModel: 'managed-service',
    proofKit: {
      requiredCustomerInputs: [
        'Sample document corpus (representative of production data)',
        'Target user groups and their search/query patterns',
        'Security and data residency requirements',
        'Existing infrastructure and cloud environment details',
      ],
      proofArtifactsToRequest: [
        'Sample documents (50–100 representative files)',
        'Access pattern documentation',
        'Infrastructure diagram',
      ],
      artifactsWeProvide: [
        'RAG architecture reference design',
        'Evaluation framework and metrics',
        'Chunking strategy playbook',
        'Security design template',
      ],
      riskClauses: [
        'Document quality directly impacts retrieval accuracy',
        'Data residency requirements may limit model and service options',
        'Production scale may require infrastructure upgrades beyond PoC',
        'Ongoing model updates require maintenance process',
      ],
    },
    maturityTriggers: [
      { dimensionKey: 'data-readiness', condition: 'ad-hoc', weight: 2 },
      { dimensionKey: 'use-cases', condition: 'unknown', weight: 2 },
      { dimensionKey: 'platform-delivery', condition: 'ad-hoc', weight: 1 },
    ],
    toolsAndAgents: ['tool-rag-evaluator'],
    status: 'approved',
    owner: 'Practice Lead — AI Engineering',
    updatedAt: '2026-01-12',
  },
  {
    id: 'pkg-security',
    name: 'Security & Privacy Review for AI',
    category: 'security-review',
    shortOutcome: 'Comprehensive security and privacy assessment for AI workloads with remediation plan.',
    targetBuyers: ['CISO', 'DPO', 'Head of Security', 'CTO'],
    whenToSell: [
      'Customer deploying AI to production and needs security sign-off',
      'Regulatory audit coming up that includes AI systems',
      'Customer had a security incident or near-miss involving AI/data',
    ],
    whenNotToSell: [
      'Customer is in early exploration phase (sell Readiness first)',
      'Customer only needs governance policy (sell Governance Quickstart)',
    ],
    deliverables: [
      'AI threat model (per workload)',
      'Data flow and privacy impact assessment',
      'Security controls assessment',
      'Prompt injection / adversarial testing results',
      'Remediation plan with priorities',
      'Compliance mapping (GDPR, industry-specific)',
      'Incident response plan for AI systems',
    ],
    timebox: '2–4 weeks',
    pricingTiers: [
      {
        tierName: 'good',
        description: 'Threat model + high-level assessment',
        deliverablesDelta: ['AI threat model', 'Security controls assessment', 'High-level remediation plan'],
        indicativeRange: '$20K – $35K',
      },
      {
        tierName: 'better',
        description: 'Full assessment + adversarial testing + compliance mapping',
        deliverablesDelta: ['All Good tier items', 'Privacy impact assessment', 'Adversarial testing', 'Compliance mapping'],
        indicativeRange: '$35K – $60K',
      },
      {
        tierName: 'best',
        description: 'Full engagement + recurring reviews + incident response',
        deliverablesDelta: ['All Better tier items', 'Incident response plan', 'Quarterly security reviews', 'Team training'],
        indicativeRange: '$60K – $90K',
      },
    ],
    recurringModel: 'quarterly-review',
    proofKit: {
      requiredCustomerInputs: [
        'AI workloads in scope (models, data flows, access patterns)',
        'Current security policies and standards',
        'Regulatory requirements and compliance targets',
        'Previous security assessments or audit results',
      ],
      proofArtifactsToRequest: [
        'Architecture diagrams for AI workloads',
        'Data flow documentation',
        'Current security policies',
      ],
      artifactsWeProvide: [
        'AI threat modeling framework',
        'Security assessment checklist',
        'Remediation planning template',
      ],
      riskClauses: [
        'Assessment scope is limited to identified AI workloads — undisclosed systems may have additional risks',
        'Adversarial testing may cause temporary service disruption — requires change approval',
        'Compliance mapping is advisory — legal sign-off is customer responsibility',
      ],
    },
    maturityTriggers: [
      { dimensionKey: 'governance-risk', condition: 'ad-hoc', weight: 3 },
      { dimensionKey: 'governance-risk', condition: 'below-defined', weight: 2 },
    ],
    toolsAndAgents: ['tool-governance-scanner'],
    status: 'approved',
    owner: 'Practice Lead — Security',
    updatedAt: '2026-01-05',
  },
  {
    id: 'pkg-finops',
    name: 'FinOps for AI Setup',
    category: 'finops',
    shortOutcome: 'Cost visibility, budgeting, and optimization framework for AI workloads.',
    targetBuyers: ['CFO', 'VP Infrastructure', 'Head of Cloud', 'FinOps Lead'],
    whenToSell: [
      'Customer getting surprised by AI compute/inference costs',
      'Multiple teams spinning up AI workloads without cost governance',
      'Customer scaling from PoC to production and needs cost predictability',
    ],
    whenNotToSell: [
      'Customer has mature FinOps practice that already covers AI (just advise)',
      'Customer is pre-AI deployment (sell Readiness first)',
    ],
    deliverables: [
      'AI cost taxonomy and tagging strategy',
      'Budget allocation framework per AI workload',
      'Cost monitoring dashboard',
      'Optimization recommendations (model selection, scaling, caching)',
      'Chargeback / showback model',
      'Monthly review process design',
    ],
    timebox: '2–3 weeks',
    pricingTiers: [
      {
        tierName: 'good',
        description: 'Cost visibility + tagging + basic dashboard',
        deliverablesDelta: ['Cost taxonomy', 'Tagging strategy', 'Basic monitoring dashboard'],
        indicativeRange: '$12K – $22K',
      },
      {
        tierName: 'better',
        description: 'Full framework + optimization + chargeback model',
        deliverablesDelta: ['All Good tier items', 'Optimization recommendations', 'Chargeback model', 'Budget framework'],
        indicativeRange: '$22K – $38K',
      },
      {
        tierName: 'best',
        description: 'Full engagement + recurring governance + advanced analytics',
        deliverablesDelta: ['All Better tier items', 'Monthly review process', 'Advanced cost analytics', 'Anomaly alerting'],
        indicativeRange: '$38K – $55K',
      },
    ],
    recurringModel: 'managed-service',
    proofKit: {
      requiredCustomerInputs: [
        'Azure subscription details for AI workloads',
        'Current AI service usage patterns',
        'Budget constraints and approval processes',
        'Organizational structure for cost ownership',
      ],
      proofArtifactsToRequest: [
        'Azure cost reports for last 3 months',
        'List of AI services and models in use',
      ],
      artifactsWeProvide: [
        'AI FinOps dashboard template',
        'Cost optimization playbook',
        'Chargeback model template',
      ],
      riskClauses: [
        'Cost optimization may require changes to model selection or architecture',
        'Accurate chargeback requires consistent resource tagging — adoption timeline varies',
        'AI costs are usage-dependent — projections are estimates, not guarantees',
      ],
    },
    maturityTriggers: [
      { dimensionKey: 'platform-delivery', condition: 'ad-hoc', weight: 2 },
      { dimensionKey: 'procurement', condition: 'unknown', weight: 2 },
    ],
    toolsAndAgents: ['tool-finops-dashboard'],
    status: 'approved',
    owner: 'Practice Lead — Cloud Economics',
    updatedAt: '2026-01-20',
  },
];

// ============= Helper Functions =============

export function getPackageById(id: string): AIPackage | undefined {
  return SEED_PACKAGES.find(p => p.id === id);
}

export function getToolById(id: string): ToolAgent | undefined {
  return SEED_TOOLS.find(t => t.id === id);
}

export function getToolsForPackage(pkg: AIPackage): ToolAgent[] {
  return pkg.toolsAndAgents
    .map(id => getToolById(id))
    .filter(Boolean) as ToolAgent[];
}

export function getPackagesByStatus(status: PackageStatus): AIPackage[] {
  return SEED_PACKAGES.filter(p => p.status === status);
}

export function getPackagesByCategory(category: PackageCategory): AIPackage[] {
  return SEED_PACKAGES.filter(p => p.category === category);
}

export const PACKAGE_CATEGORY_LABELS: Record<PackageCategory, string> = {
  governance: 'Governance',
  'copilot-adoption': 'Copilot Adoption',
  rag: 'RAG / Knowledge',
  finops: 'FinOps',
  'security-review': 'Security Review',
  'data-readiness': 'Data Readiness',
};

// ============= Recommendation Engine =============

/**
 * Recommend packages based on maturity gaps.
 * Takes a map of dimensionKey -> score (0=unknown, 1=ad-hoc, 2=defined, 3=scaled)
 * Returns sorted list of recommended packages with reasons.
 */
export function recommendPackages(
  maturityGaps: Record<string, number>,
  maxResults = 3
): Array<{ package: AIPackage; score: number; reason: string }> {
  const results: Array<{ package: AIPackage; score: number; reason: string }> = [];

  for (const pkg of SEED_PACKAGES.filter(p => p.status === 'approved')) {
    let totalScore = 0;
    const matchedTriggers: string[] = [];

    for (const trigger of pkg.maturityTriggers) {
      const currentLevel = maturityGaps[trigger.dimensionKey] ?? 0;
      let matches = false;

      switch (trigger.condition) {
        case 'unknown':
          matches = currentLevel === 0;
          break;
        case 'ad-hoc':
          matches = currentLevel <= 1;
          break;
        case 'below-defined':
          matches = currentLevel < 2;
          break;
      }

      if (matches) {
        totalScore += trigger.weight;
        matchedTriggers.push(trigger.dimensionKey);
      }
    }

    if (totalScore > 0) {
      const gapNames = matchedTriggers.map(k => k.replace(/-/g, ' ')).join(', ');
      results.push({
        package: pkg,
        score: totalScore,
        reason: `Addresses gaps in: ${gapNames}`,
      });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

// ============= Seller Kit Generator (Mock) =============

export function generateSellerKit(pkg: AIPackage): SellerKit {
  return {
    packageId: pkg.id,
    discoveryQuestions: [
      `What is your current approach to ${pkg.category.replace(/-/g, ' ')}?`,
      'How are you currently measuring success in this area?',
      'What has prompted you to explore this now?',
      'Who are the key stakeholders involved in this decision?',
      'What is your timeline for making a decision?',
      'Have you evaluated other approaches or vendors?',
      'What would success look like for you in 6 months?',
      'What are the biggest risks or concerns you have?',
      'What budget or investment range are you considering?',
      'How does this initiative align with your broader strategy?',
    ],
    talkTrack: [
      `We\'ve designed ${pkg.name} specifically for organizations at your stage of AI maturity.`,
      `The outcome is clear: ${pkg.shortOutcome}`,
      `We can deliver this in ${pkg.timebox}, which means you see value fast.`,
      'Our approach is structured around proof — we bring the framework, you bring the context.',
      `We've successfully delivered this for similar ${pkg.targetBuyers[0]}-led organizations.`,
      'Let me walk you through the three tiers so you can choose the right level of engagement.',
    ],
    objections: [
      {
        objection: 'We can do this ourselves internally.',
        response: 'Many clients start that way. We typically engage when internal teams need acceleration or external validation. Our framework compresses months into weeks.',
      },
      {
        objection: 'This is too expensive for a consulting engagement.',
        response: `Our Good tier starts at a fraction of the cost and delivers concrete deliverables in ${pkg.timebox}. The ROI typically exceeds 5x within the first quarter.`,
      },
      {
        objection: 'We\'re not ready for this yet.',
        response: 'That\'s actually the ideal time to engage. Establishing the right foundation now prevents costly rework later.',
      },
      {
        objection: 'We\'re already working with another vendor.',
        response: 'We complement rather than compete with existing vendors. Our focus is on the strategy and governance layer that ensures your investments deliver returns.',
      },
      {
        objection: 'How is this different from what Microsoft offers directly?',
        response: 'Microsoft provides the platform — we provide the implementation expertise and industry-specific methodology. We\'re a certified partner with deep domain knowledge.',
      },
      {
        objection: 'Can you guarantee results?',
        response: 'We guarantee deliverables and methodology. Our proof kit ensures we\'re working from validated customer context, which significantly de-risks the outcome.',
      },
      {
        objection: 'We need to see a case study first.',
        response: 'Absolutely — we have reference customers in similar industries. We can also structure a focused pilot to demonstrate value before a larger commitment.',
      },
      {
        objection: 'The timeline is too long.',
        response: `Our Good tier can deliver initial value in as little as 2 weeks. The full ${pkg.timebox} timeline ensures comprehensive coverage.`,
      },
    ],
    firstMeetingAgenda: [
      'Introductions and context setting (5 min)',
      `Customer's current ${pkg.category.replace(/-/g, ' ')} landscape (15 min)`,
      `${pkg.name} overview and fit assessment (15 min)`,
      'Tier options and engagement model (10 min)',
      'Q&A and next steps (10 min)',
      'Agree on follow-up actions and timeline (5 min)',
    ],
    nextSteps: [
      'Schedule a focused discovery session with key stakeholders',
      'Share relevant documentation and context from the proof kit requirements',
      'Propose a formal engagement letter with selected tier and timeline',
    ],
    emailDraft: `Subject: ${pkg.name} — Next Steps\n\nHi [Name],\n\nThank you for the productive conversation today about your ${pkg.category.replace(/-/g, ' ')} needs.\n\nAs discussed, ${pkg.name} is designed to deliver: ${pkg.shortOutcome}\n\nWe can achieve this in ${pkg.timebox}, starting with a focused discovery session to validate the right tier for your needs.\n\nI've attached a brief overview of the engagement structure. Would [date] work for the next step?\n\nBest regards,\n[Your name]`,
  };
}

// ============= Local Storage Helpers (MVP) =============

const ATTACHMENTS_KEY = 'partner-package-attachments';

export function getPackageAttachments(): PackageAttachment[] {
  try {
    const raw = localStorage.getItem(ATTACHMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPackageAttachment(attachment: PackageAttachment): void {
  const current = getPackageAttachments();
  current.push(attachment);
  localStorage.setItem(ATTACHMENTS_KEY, JSON.stringify(current));
}

export function getAttachmentsForBrief(briefId: string): PackageAttachment[] {
  return getPackageAttachments().filter(a => a.briefId === briefId);
}
