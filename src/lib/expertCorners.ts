// Expert Corners Data Model
// Each Expert Corner is a "show" with multiple episodes

export interface ExpertEpisode {
  id: string;
  publishedAt: string; // ISO date string
  title: string;
  durationLabel: string; // e.g., "20s read" or "1:00"
  tagLabel: string;
  mediaType: 'image' | 'video';
  coverUrl?: string;
  videoUrl?: string;
  hook: string; // 1 sentence
  takeaway: string; // 1 sentence
  nextMove: string; // actionable line starting with "Ask:" or "Do:"
}

export interface ExpertCorner {
  id: string;
  title: string;
  description: string;
  cadenceLabel?: string; // e.g., "Drops Tue/Thu"
  coverUrl?: string;
  hostName?: string;
  episodes: ExpertEpisode[];
}

// Check if any episode was published in the last N days
export function hasRecentEpisode(corner: ExpertCorner, days: number = 7): boolean {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  
  return corner.episodes.some(ep => new Date(ep.publishedAt) >= cutoff);
}

// Get the most recent episode
export function getLatestEpisode(corner: ExpertCorner): ExpertEpisode | null {
  if (corner.episodes.length === 0) return null;
  
  return [...corner.episodes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];
}

// Get recency label (e.g., "New 2d ago")
export function getRecencyLabel(corner: ExpertCorner): string | null {
  const latest = getLatestEpisode(corner);
  if (!latest) return null;
  
  const now = new Date();
  const published = new Date(latest.publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  if (diffDays === 0) return "New today";
  if (diffDays === 1) return "New 1d ago";
  if (diffDays <= 7) return `New ${diffDays}d ago`;
  
  return null;
}

// Filter episodes by date range
export function filterEpisodesByDateRange(
  episodes: ExpertEpisode[],
  filter: 'last-4-weeks' | 'all'
): ExpertEpisode[] {
  if (filter === 'all') {
    return [...episodes].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }
  
  const now = new Date();
  const cutoff = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);
  
  return episodes
    .filter(ep => new Date(ep.publishedAt) >= cutoff)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Format episode date for display
export function formatEpisodeDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Seed data for MVP
export const expertCorners: ExpertCorner[] = [
  {
    id: 'zias-corner',
    title: "Zia's Corner",
    description: "Weekly signals on AI infrastructure & hyperscaler moves",
    cadenceLabel: "Drops Tue/Thu",
    coverUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
    hostName: "Zia Rahman",
    episodes: [
      {
        id: 'zia-ep-1',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        title: "Azure's new GPU allocation strategy",
        durationLabel: "25s read",
        tagLabel: "Azure AI",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
        hook: "Microsoft just shifted how they allocate GPU capacity to enterprise customers.",
        takeaway: "Priority access now requires a 12-month commit—this changes the conversation for Q1 renewals.",
        nextMove: "Ask: 'How are you planning your AI compute needs for the next year?'"
      },
      {
        id: 'zia-ep-2',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        title: "GCP's Gemini price drop impact",
        durationLabel: "30s read",
        tagLabel: "GCP",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
        hook: "Google cut Gemini API pricing by 40%—here's what it means for multi-cloud deals.",
        takeaway: "Customers comparing Azure OpenAI now have a strong cost argument for GCP.",
        nextMove: "Do: Update your competitive deck with the new pricing comparison."
      },
      {
        id: 'zia-ep-3',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        title: "AWS Bedrock's enterprise push",
        durationLabel: "20s read",
        tagLabel: "AWS",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&h=400&fit=crop",
        hook: "Amazon is offering 6-month free trials of Bedrock to steal enterprise AI workloads.",
        takeaway: "This aggressive move targets customers evaluating Azure AI—know your counter.",
        nextMove: "Ask: 'What's your current timeline for evaluating AI platforms?'"
      },
      {
        id: 'zia-ep-4',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        title: "NVIDIA's H200 availability update",
        durationLabel: "35s read",
        tagLabel: "Infrastructure",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
        hook: "H200 GPUs are now shipping in volume—this changes the capacity conversation.",
        takeaway: "Customers waiting for next-gen hardware can now commit to larger AI initiatives.",
        nextMove: "Do: Reach out to accounts that delayed decisions due to hardware constraints."
      },
      {
        id: 'zia-ep-5',
        publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days ago
        title: "Open source LLMs gaining enterprise traction",
        durationLabel: "40s read",
        tagLabel: "Strategy",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop",
        hook: "Llama 3 and Mistral are now showing up in enterprise RFPs—here's how to position.",
        takeaway: "Frame the conversation around total cost of ownership, not just model licensing.",
        nextMove: "Ask: 'Beyond the model, what support and security requirements do you have?'"
      },
      {
        id: 'zia-ep-6',
        publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days ago
        title: "Sovereign cloud requirements in EMEA",
        durationLabel: "30s read",
        tagLabel: "Compliance",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
        hook: "New EU regulations are making sovereign cloud a must-have for financial services.",
        takeaway: "Position our local datacenter presence as a key differentiator.",
        nextMove: "Do: Map your EMEA accounts against the new compliance requirements."
      },
      {
        id: 'zia-ep-7',
        publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago (outside 4 weeks)
        title: "Q4 cloud spending trends",
        durationLabel: "45s read",
        tagLabel: "Trends",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        hook: "Enterprise cloud budgets are shifting from infrastructure to AI services.",
        takeaway: "Lead with AI value propositions rather than compute cost savings.",
        nextMove: "Ask: 'How is your AI roadmap influencing your cloud budget for next year?'"
      },
      {
        id: 'zia-ep-8',
        publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
        title: "The rise of inference-optimized hardware",
        durationLabel: "35s read",
        tagLabel: "Infrastructure",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
        hook: "New inference chips are 3x more cost-effective than training GPUs for production.",
        takeaway: "Help customers think beyond training—production inference is where costs compound.",
        nextMove: "Do: Review your top accounts' AI production roadmaps."
      }
    ]
  },
  {
    id: 'leadership-corner',
    title: "Leadership Corner",
    description: "Executive insights for strategic conversations",
    cadenceLabel: "Weekly",
    coverUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    hostName: "Marcus Chen",
    episodes: [
      {
        id: 'lead-ep-1',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        title: "Navigating budget freezes",
        durationLabel: "30s read",
        tagLabel: "Objection",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
        hook: "CFOs are tightening budgets—but AI projects are still getting approved.",
        takeaway: "Frame AI investments as cost-reduction initiatives, not new spending.",
        nextMove: "Ask: 'What efficiency gains would justify this investment to your CFO?'"
      },
      {
        id: 'lead-ep-2',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        title: "The CTO's AI adoption concerns",
        durationLabel: "25s read",
        tagLabel: "Discovery",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=400&fit=crop",
        hook: "CTOs are worried about AI security and governance—here's how to address it.",
        takeaway: "Lead with your enterprise security features and compliance certifications.",
        nextMove: "Do: Prepare a security-focused one-pager for technical stakeholders."
      },
      {
        id: 'lead-ep-3',
        publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
        title: "Building executive champions",
        durationLabel: "35s read",
        tagLabel: "Strategy",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop",
        hook: "The best deals have VP+ sponsors—here's how to identify and cultivate them.",
        takeaway: "Look for executives with public commitments to digital transformation.",
        nextMove: "Do: Research your top 5 accounts' executives on LinkedIn for AI mentions."
      },
      {
        id: 'lead-ep-4',
        publishedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago (outside 4 weeks)
        title: "End-of-year deal acceleration",
        durationLabel: "40s read",
        tagLabel: "Closing",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
        hook: "Q4 is prime time for closing—but timing matters more than discounting.",
        takeaway: "Align your deal timeline with your customer's budget cycle, not yours.",
        nextMove: "Ask: 'When does your fiscal year end? How does that affect this decision?'"
      },
      {
        id: 'lead-ep-5',
        publishedAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(), // 50 days ago
        title: "Multi-threading your deals",
        durationLabel: "30s read",
        tagLabel: "Strategy",
        mediaType: 'image',
        coverUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
        hook: "Deals with single-threaded relationships are 3x more likely to stall.",
        takeaway: "Build relationships across IT, business, and procurement early.",
        nextMove: "Do: Map all stakeholders for your top 3 deals and identify gaps."
      }
    ]
  }
];

// Get a specific Expert Corner by ID
export function getExpertCorner(id: string): ExpertCorner | null {
  return expertCorners.find(c => c.id === id) || null;
}

// Get a specific episode from any corner
export function getEpisode(cornerId: string, episodeId: string): ExpertEpisode | null {
  const corner = getExpertCorner(cornerId);
  if (!corner) return null;
  return corner.episodes.find(ep => ep.id === episodeId) || null;
}
