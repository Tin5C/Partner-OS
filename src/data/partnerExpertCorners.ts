// Partner-only Expert Corners data
// Video-first expert episodes (8–45 minutes)

export interface PartnerExpertEpisode {
  id: string;
  title: string;
  expertName: string;
  expertRole: string;
  vendorTag: string;
  durationMinutes: number;
  coverImageUrl: string;
  videoUrl: string;
  publishedAt: string;
  chapters?: { time: number; label: string }[];
  readingSummary?: {
    tldr: string;
    keyPoints: string[];
    actionItems: string[];
  };
  progress?: number; // 0-100, local state for MVP
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

// Mock data for MVP
export const partnerExpertCorners: PartnerExpertCorner[] = [
  {
    id: 'azure-ai-deep-dives',
    title: 'Azure AI Deep Dives',
    description: 'Technical deep dives into Azure AI services and architectures',
    episodes: [
      {
        id: 'azure-openai-rag',
        title: 'Building Production RAG with Azure OpenAI',
        expertName: 'Sarah Mitchell',
        expertRole: 'Principal Cloud Solution Architect',
        vendorTag: 'Microsoft',
        durationMinutes: 32,
        coverImageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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
      {
        id: 'copilot-studio-workshop',
        title: 'Copilot Studio: From Zero to Custom Copilot',
        expertName: 'James Park',
        expertRole: 'Senior Technical Specialist',
        vendorTag: 'Microsoft',
        durationMinutes: 28,
        coverImageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        readingSummary: {
          tldr: 'Step-by-step guide to building custom copilots with Copilot Studio for enterprise scenarios.',
          keyPoints: [
            'Copilot Studio enables no-code/low-code AI assistant creation',
            'Connect to enterprise data sources securely',
            'Customize topics and conversation flows',
          ],
          actionItems: [
            'Identify 3 use cases for custom copilots in your customer accounts',
            'Schedule a Copilot Studio demo for interested prospects',
          ],
        },
      },
      {
        id: 'azure-fabric-analytics',
        title: 'Microsoft Fabric for Modern Analytics',
        expertName: 'Elena Rodriguez',
        expertRole: 'Data & AI Specialist',
        vendorTag: 'Microsoft',
        durationMinutes: 38,
        coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        publishedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'partner-sales-masterclass',
    title: 'Partner Sales Masterclass',
    description: 'Advanced selling techniques for Microsoft partners',
    episodes: [
      {
        id: 'enterprise-discovery',
        title: 'Enterprise Discovery: Questions That Win Deals',
        expertName: 'Michael Chen',
        expertRole: 'Partner Success Manager',
        vendorTag: 'Microsoft',
        durationMinutes: 24,
        coverImageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 80,
        readingSummary: {
          tldr: 'Master the discovery questions that uncover enterprise pain points and accelerate deal cycles.',
          keyPoints: [
            'Start with business outcomes, not technology features',
            'Use the MEDDIC framework for deal qualification',
            'Document buying committee dynamics early',
          ],
          actionItems: [
            'Practice the top 5 discovery questions in your next call',
            'Map stakeholders for your top 3 opportunities',
          ],
        },
      },
      {
        id: 'co-sell-motion',
        title: 'Maximizing Co-Sell Opportunities',
        expertName: 'Amanda Foster',
        expertRole: 'Partner Development Manager',
        vendorTag: 'Microsoft',
        durationMinutes: 18,
        coverImageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'cloud-architecture',
    title: 'Cloud Architecture Patterns',
    description: 'Reference architectures and design patterns',
    episodes: [
      {
        id: 'zero-trust-architecture',
        title: 'Implementing Zero Trust on Azure',
        expertName: 'David Kim',
        expertRole: 'Security Architecture Lead',
        vendorTag: 'Microsoft',
        durationMinutes: 42,
        coverImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        chapters: [
          { time: 0, label: 'Zero Trust Principles' },
          { time: 300, label: 'Identity & Access' },
          { time: 720, label: 'Network Segmentation' },
          { time: 1200, label: 'Data Protection' },
          { time: 1800, label: 'Implementation Roadmap' },
        ],
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
