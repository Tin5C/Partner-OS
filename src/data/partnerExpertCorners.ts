// Partner-only Expert Corners data
// Includes synthetic doc explainer episodes (8–45 minutes) and YouTube videos

export type EpisodeType = 'humanExpert' | 'syntheticDocExplainer';
export type SourceType = 'syntheticDocExplainer' | 'youtube' | 'uploadedVideo';
export type GenerationStatus = 'ready' | 'generating' | 'failed';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

// Structured exec summary for synthetic explainers
export interface SyntheticExecSummary {
  whatThisCovers: string[];
  whyItMattersForPartners: string[];
  whenToUseInDeal: string[];
  partnerTalkTrack: string[];
  commonObjections?: { objection: string; response: string }[];
  nextBestActions: string[];
}

export interface PartnerExpertEpisode {
  id: string;
  title: string;
  vendorTag: string;
  durationMinutes: number;
  coverImageUrl: string;
  videoUrl: string;
  publishedAt: string;
  chapters?: { time: number; label: string }[];
  progress?: number; // 0-100, local state for MVP
  
  // Episode type - determines UI treatment
  type?: EpisodeType; // defaults to 'humanExpert' if not specified
  
  // Source type - determines how video is rendered (YouTube embed vs native)
  sourceType?: SourceType; // defaults to 'syntheticDocExplainer' if not specified
  youtubeUrl?: string; // required if sourceType is 'youtube'
  
  // Human expert fields (legacy)
  expertName?: string;
  expertRole?: string;
  readingSummary?: {
    tldr: string;
    keyPoints: string[];
    actionItems: string[];
  };
  
  // Synthetic doc explainer fields
  topicTags?: string[];
  sourceReferences?: string[];
  generationStatus?: GenerationStatus;
  confidenceLevel?: ConfidenceLevel;
  execSummary?: SyntheticExecSummary;
}

// Helper to check if episode is a YouTube video
export function isYouTubeEpisode(episode: PartnerExpertEpisode): boolean {
  return episode.sourceType === 'youtube';
}

// Extract YouTube video ID from URL
export function getYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match ? match[1] : null;
}

export interface PartnerExpertCorner {
  id: string;
  title: string;
  description: string;
  vendorLogo?: string;
  episodes: PartnerExpertEpisode[];
}

// Filter episodes to only those with 8-45 minute duration
export function getValidEpisodes(episodes: PartnerExpertEpisode[]): PartnerExpertEpisode[] {
  return episodes.filter(ep => ep.durationMinutes >= 8 && ep.durationMinutes <= 45);
}

// Get all valid episodes across all corners, sorted by date
export function getAllPartnerExpertEpisodes(): PartnerExpertEpisode[] {
  return partnerExpertCorners
    .flatMap(corner => getValidEpisodes(corner.episodes))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Check if episode is synthetic explainer
export function isSyntheticExplainer(episode: PartnerExpertEpisode): boolean {
  return episode.type === 'syntheticDocExplainer';
}

// Mock data for MVP - includes both human expert and synthetic episodes
export const partnerExpertCorners: PartnerExpertCorner[] = [
  {
    id: 'synthetic-explainers',
    title: 'Synthetic Explainers',
    description: 'AI-generated explainer videos from vendor documentation',
    episodes: [
      {
        id: 'ai-governance-purview',
        type: 'syntheticDocExplainer',
        title: 'AI Governance with Microsoft Purview',
        vendorTag: 'Microsoft',
        topicTags: ['AI Governance', 'Compliance', 'Data Protection'],
        durationMinutes: 34,
        coverImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        confidenceLevel: 'High',
        sourceReferences: [
          'https://learn.microsoft.com/en-us/purview/ai-microsoft-purview',
          'https://learn.microsoft.com/en-us/purview/data-governance',
          'https://learn.microsoft.com/en-us/azure/ai-services/responsible-use-of-ai-overview',
        ],
        chapters: [
          { time: 0, label: 'Introduction to AI Governance' },
          { time: 240, label: 'Purview Capabilities Overview' },
          { time: 600, label: 'Data Classification & Labeling' },
          { time: 1020, label: 'AI Controls & Policies' },
          { time: 1500, label: 'Implementation Roadmap' },
        ],
        execSummary: {
          whatThisCovers: [
            'How Microsoft Purview provides governance controls for AI workloads',
            'Data classification, sensitivity labeling, and access policies for AI-ready data',
            'Compliance frameworks and audit capabilities for AI deployments',
          ],
          whyItMattersForPartners: [
            'Every enterprise AI project faces governance blockers — Purview directly addresses these',
            'Positions partners as trusted advisors who understand compliance requirements',
          ],
          whenToUseInDeal: [
            'When customers express concerns about AI safety, data leakage, or regulatory compliance',
            'During discovery when data governance is immature or undefined',
          ],
          partnerTalkTrack: [
            '"Before we deploy any AI, we need to ensure your data is classified and governed — that\'s where Purview comes in."',
            '"Purview gives you visibility into what data AI can access and audit trails for compliance."',
            '"We typically see governance as the unlock for faster AI adoption, not a blocker."',
          ],
          commonObjections: [
            {
              objection: 'We already have a data governance tool',
              response: 'Purview integrates with existing tools and adds AI-specific controls like prompt monitoring and data boundary enforcement.',
            },
            {
              objection: 'This seems like more overhead',
              response: 'It\'s actually the opposite — proper governance reduces friction later by preventing data access issues and compliance violations.',
            },
          ],
          nextBestActions: [
            'Run a data readiness assessment using Purview\'s free scanner',
            'Identify top 3 datasets needed for the customer\'s priority AI use case',
            'Schedule a Purview demo focused on AI governance capabilities',
          ],
        },
      },
      {
        id: 'azure-ai-foundry',
        type: 'syntheticDocExplainer',
        title: 'AI Innovation at Scale with Azure AI Foundry',
        vendorTag: 'Microsoft',
        topicTags: ['Azure AI', 'MLOps', 'Partner Accelerators'],
        durationMinutes: 28,
        coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        confidenceLevel: 'High',
        sourceReferences: [
          'https://learn.microsoft.com/en-us/azure/ai-studio/',
          'https://learn.microsoft.com/en-us/azure/machine-learning/',
          'https://azure.microsoft.com/en-us/products/ai-services/',
        ],
        chapters: [
          { time: 0, label: 'Azure AI Foundry Overview' },
          { time: 180, label: 'From Experimentation to Production' },
          { time: 480, label: 'Partner Accelerators & Templates' },
          { time: 900, label: 'Integration Patterns' },
          { time: 1320, label: 'Next Steps' },
        ],
        execSummary: {
          whatThisCovers: [
            'Azure AI Foundry as the unified platform for AI development and deployment',
            'Transition path from experimentation (notebooks, prompts) to production (APIs, monitoring)',
            'Partner-specific accelerators and pre-built templates for common scenarios',
          ],
          whyItMattersForPartners: [
            'Foundry consolidates previously fragmented AI services — simpler story to tell',
            'Partner accelerators reduce time-to-value and increase project success rates',
          ],
          whenToUseInDeal: [
            'When customers want to move beyond POCs to production AI',
            'When discussing AI strategy or platform consolidation',
          ],
          partnerTalkTrack: [
            '"Azure AI Foundry is where your team builds, tests, and deploys AI — all in one place."',
            '"We have accelerators that cut 60% of the typical setup time for common patterns like RAG and agents."',
            '"The beauty is you can start with prompts and notebooks, then graduate to production APIs without switching platforms."',
          ],
          nextBestActions: [
            'Demo Azure AI Foundry with a customer-relevant use case',
            'Identify which partner accelerator applies to the customer\'s priority scenario',
            'Propose a 2-week pilot using Foundry for their top AI use case',
          ],
        },
      },
      {
        id: 'enterprise-copilot-security',
        type: 'syntheticDocExplainer',
        title: 'Enterprise Copilot: Security, Boundaries, Adoption',
        vendorTag: 'Microsoft',
        topicTags: ['Copilot', 'Security', 'IT Governance'],
        durationMinutes: 38,
        coverImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        confidenceLevel: 'High',
        sourceReferences: [
          'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-overview',
          'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy',
          'https://learn.microsoft.com/en-us/entra/identity/',
        ],
        chapters: [
          { time: 0, label: 'Enterprise Copilot Landscape' },
          { time: 300, label: 'Security Architecture' },
          { time: 720, label: 'Data Boundaries & Access Controls' },
          { time: 1200, label: 'IT Governance Patterns' },
          { time: 1680, label: 'Adoption Roadmap' },
        ],
        execSummary: {
          whatThisCovers: [
            'Security architecture and data boundaries for Microsoft 365 Copilot',
            'IT governance patterns including access controls, audit, and rollout strategies',
            'Common adoption blockers and how to address them',
          ],
          whyItMattersForPartners: [
            'Security concerns are the #1 blocker for Copilot adoption — this content directly addresses them',
            'Partners who can speak to IT/security concerns close deals faster',
          ],
          whenToUseInDeal: [
            'When IT or security stakeholders raise concerns about Copilot accessing sensitive data',
            'During Copilot readiness assessments or adoption planning',
          ],
          partnerTalkTrack: [
            '"Copilot respects your existing permissions — if a user can\'t see a file, Copilot can\'t either."',
            '"We recommend starting with a pilot group to validate data boundaries before broader rollout."',
            '"The biggest risk isn\'t Copilot seeing too much — it\'s existing oversharing that Copilot makes visible."',
          ],
          commonObjections: [
            {
              objection: 'Copilot might expose sensitive data',
              response: 'Copilot respects all existing SharePoint permissions and sensitivity labels. We typically run a permission audit first.',
            },
            {
              objection: 'We\'re not sure our org is ready',
              response: 'That\'s why we start with a readiness assessment — it identifies gaps before any rollout.',
            },
          ],
          nextBestActions: [
            'Run a SharePoint permission audit to identify oversharing risks',
            'Identify a pilot group (typically 50-100 users) for controlled rollout',
            'Schedule a Copilot security deep-dive with the customer\'s IT/security team',
          ],
        },
      },
      {
        id: 'responsible-ai-azure',
        type: 'syntheticDocExplainer',
        title: 'Responsible AI in Practice on Azure',
        vendorTag: 'Microsoft',
        topicTags: ['Responsible AI', 'Ethics', 'Platform Controls'],
        durationMinutes: 24,
        coverImageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        confidenceLevel: 'Medium',
        sourceReferences: [
          'https://learn.microsoft.com/en-us/azure/ai-services/responsible-use-of-ai-overview',
          'https://www.microsoft.com/en-us/ai/responsible-ai',
          'https://learn.microsoft.com/en-us/azure/ai-services/openai/concepts/content-filter',
        ],
        chapters: [
          { time: 0, label: 'Responsible AI Principles' },
          { time: 180, label: 'Azure Platform Controls' },
          { time: 480, label: 'Content Filtering' },
          { time: 840, label: 'Transparency & Documentation' },
          { time: 1140, label: 'Implementation Checklist' },
        ],
        execSummary: {
          whatThisCovers: [
            'Microsoft\'s Responsible AI principles and how they translate to platform controls',
            'Content filtering, safety systems, and transparency features in Azure AI services',
            'Practical implementation checklist for responsible AI deployments',
          ],
          whyItMattersForPartners: [
            'Customers increasingly ask about AI ethics and safety — partners need credible answers',
            'Responsible AI practices reduce deployment risk and build customer trust',
          ],
          whenToUseInDeal: [
            'When customers ask about AI safety, bias, or ethical considerations',
            'During procurement or compliance discussions involving AI',
          ],
          partnerTalkTrack: [
            '"Azure AI has built-in content filters that block harmful outputs by default."',
            '"We follow Microsoft\'s Responsible AI framework, which includes fairness, transparency, and accountability."',
            '"Every AI deployment we do includes a Responsible AI review as part of our process."',
          ],
          nextBestActions: [
            'Include Responsible AI considerations in your AI proposal template',
            'Run a Responsible AI workshop for customer stakeholders',
            'Review Azure AI content filter documentation for customer-specific tuning',
          ],
        },
      },
      {
        id: 'data-readiness-ai',
        type: 'syntheticDocExplainer',
        title: 'Data Readiness for AI: What Blocks Real Adoption',
        vendorTag: 'Microsoft',
        topicTags: ['Data Quality', 'Data Governance', 'AI Readiness'],
        durationMinutes: 32,
        coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        confidenceLevel: 'High',
        sourceReferences: [
          'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/scenarios/data-management/',
          'https://learn.microsoft.com/en-us/purview/data-catalog',
          'https://learn.microsoft.com/en-us/fabric/get-started/microsoft-fabric-overview',
        ],
        chapters: [
          { time: 0, label: 'Why Data Readiness Matters' },
          { time: 240, label: 'Common Data Blockers' },
          { time: 600, label: 'Data Quality Assessment' },
          { time: 1020, label: 'Ownership & Governance' },
          { time: 1440, label: 'Accelerating AI Readiness' },
        ],
        execSummary: {
          whatThisCovers: [
            'Common data quality, ownership, and governance issues that block AI adoption',
            'Assessment frameworks for evaluating data readiness',
            'Practical approaches to accelerating data readiness without boiling the ocean',
          ],
          whyItMattersForPartners: [
            'Data issues cause 70%+ of AI project failures — partners who address this win',
            'Data readiness engagements often lead to larger AI and data platform deals',
          ],
          whenToUseInDeal: [
            'When customers want to start AI but haven\'t assessed their data estate',
            'When AI POCs succeed but production stalls due to data issues',
          ],
          partnerTalkTrack: [
            '"Before we build any AI, let\'s understand what data you have and how ready it is."',
            '"Most AI projects don\'t fail because of the AI — they fail because of the data."',
            '"We use a data readiness assessment that takes 2 weeks and gives you a clear picture of what needs work."',
          ],
          commonObjections: [
            {
              objection: 'We already know our data — let\'s just start the AI project',
              response: 'Great — let\'s validate that quickly. A 1-week assessment can confirm readiness or surface issues early, saving months later.',
            },
            {
              objection: 'This sounds like a long data governance project',
              response: 'We focus on the specific data needed for your priority AI use case — not a full data transformation.',
            },
          ],
          nextBestActions: [
            'Propose a 2-week data readiness assessment for their priority AI use case',
            'Identify the key datasets needed and their current owners',
            'Use Purview or Fabric to run a quick data profiling scan',
          ],
        },
      },
    ],
  },
  // YouTube videos from external sources
  {
    id: 'youtube-deep-dives',
    title: 'YouTube Deep Dives',
    description: 'Expert videos from official Microsoft channels',
    episodes: [
      {
        id: 'youtube-ai-agents-azure',
        type: 'humanExpert',
        sourceType: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=HhZo06QSTpU',
        title: 'Build AI Agents with Azure AI Foundry',
        vendorTag: 'Microsoft',
        topicTags: ['Azure AI', 'AI Agents', 'AI Foundry'],
        durationMinutes: 12,
        coverImageUrl: 'https://img.youtube.com/vi/HhZo06QSTpU/maxresdefault.jpg',
        videoUrl: '', // Not used for YouTube
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        sourceReferences: [
          'https://www.youtube.com/watch?v=HhZo06QSTpU',
        ],
        execSummary: {
          whatThisCovers: [
            'How to build AI agents using Azure AI Foundry',
            'Key architecture patterns for agentic workflows',
            'Integration with Azure services and enterprise systems',
          ],
          whyItMattersForPartners: [
            'AI agents are the next wave of enterprise AI adoption — partners need to lead here',
            'Azure AI Foundry simplifies agent development, reducing partner delivery time',
          ],
          whenToUseInDeal: [
            'When customers want to automate complex workflows with AI',
            'When discussing next-generation AI capabilities beyond simple Q&A',
          ],
          partnerTalkTrack: [
            '"AI agents can orchestrate multiple tasks autonomously — think of them as AI that takes action, not just answers questions."',
            '"Azure AI Foundry gives us the tools to build, test, and deploy agents in a governed way."',
            '"We can start with a simple agent and expand its capabilities over time."',
          ],
          nextBestActions: [
            'Identify one workflow the customer wants to automate end-to-end',
            'Demo a simple AI agent scenario using Azure AI Foundry',
            'Propose a 4-week agent pilot for their priority use case',
          ],
        },
      },
      {
        id: 'youtube-azure-ai-studio-intro',
        type: 'humanExpert',
        sourceType: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=4BcVWkSTZ3I',
        title: 'Getting Started with Azure AI Studio',
        vendorTag: 'Microsoft',
        topicTags: ['Azure AI', 'AI Studio', 'Getting Started'],
        durationMinutes: 15,
        coverImageUrl: 'https://img.youtube.com/vi/4BcVWkSTZ3I/maxresdefault.jpg',
        videoUrl: '', // Not used for YouTube
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        generationStatus: 'ready',
        sourceReferences: [
          'https://www.youtube.com/watch?v=4BcVWkSTZ3I',
        ],
        execSummary: {
          whatThisCovers: [
            'Introduction to Azure AI Studio and its core capabilities',
            'How to set up projects and deploy AI models',
            'Best practices for prompt engineering and model evaluation',
          ],
          whyItMattersForPartners: [
            'Azure AI Studio is the unified entry point for AI development on Azure',
            'Partners who know AI Studio can accelerate customer AI journeys significantly',
          ],
          whenToUseInDeal: [
            'When customers are evaluating AI platforms or just starting their AI journey',
            'When onboarding technical teams to Azure AI capabilities',
          ],
          partnerTalkTrack: [
            '"Azure AI Studio is your one-stop shop for building AI applications — from prompt design to production deployment."',
            '"We can prototype quickly in the playground and then deploy the same model to production with enterprise guardrails."',
            '"It integrates with your existing Azure infrastructure, so there\'s no new platform to manage."',
          ],
          nextBestActions: [
            'Walk the customer through Azure AI Studio with a hands-on demo',
            'Set up a shared AI Studio project for the customer\'s pilot',
            'Create a prompt template for their specific use case',
          ],
        },
      },
    ],
  },
  {
    id: 'azure-ai-deep-dives',
    title: 'Azure AI Deep Dives',
    description: 'Technical deep dives into Azure AI services and architectures',
    episodes: [
      {
        id: 'azure-openai-rag',
        type: 'humanExpert',
        title: 'Building Production RAG with Azure OpenAI',
        expertName: 'Sarah Mitchell',
        expertRole: 'Principal Cloud Solution Architect',
        vendorTag: 'Microsoft',
        durationMinutes: 32,
        coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        chapters: [
          { time: 0, label: 'Introduction' },
          { time: 180, label: 'RAG Architecture Overview' },
          { time: 480, label: 'Vector Store Setup' },
          { time: 900, label: 'Prompt Engineering' },
          { time: 1400, label: 'Production Deployment' },
        ],
        readingSummary: {
          tldr: 'Learn how to build a production-ready RAG system using Azure OpenAI, Azure AI Search, and best practices for enterprise deployment.',
          keyPoints: [
            'RAG architecture reduces hallucinations by grounding responses in your data',
            'Azure AI Search provides hybrid search combining semantic and keyword matching',
            'Chunk size and overlap significantly impact retrieval quality',
            'Implement caching and rate limiting for production workloads',
          ],
          actionItems: [
            'Evaluate your customer data sources for RAG compatibility',
            'Set up an Azure AI Search index with semantic ranking',
            'Test different chunking strategies for your use case',
          ],
        },
        progress: 45,
      },
    ],
  },
];

// Get a specific episode by ID
export function getPartnerExpertEpisode(episodeId: string): PartnerExpertEpisode | null {
  for (const corner of partnerExpertCorners) {
    const episode = corner.episodes.find(ep => ep.id === episodeId);
    if (episode) return episode;
  }
  return null;
}
