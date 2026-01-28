// Voice Data Model
// Internal thought-leaders / SMEs with episodic content

export interface VoiceEpisode {
  id: string;
  publishedAt: string; // ISO date string
  hookTitle: string;
  mediaType: 'image' | 'video';
  coverUrl?: string;
  videoUrl?: string;
  hook: string; // 1 sentence
  takeaway: string; // 1 sentence
  nextMove: string; // actionable line starting with "Ask:" or "Do:"
  durationLabel?: string; // e.g., "20s read"
  tagLabel?: string;
}

export interface Voice {
  voiceId: string;
  voiceName: string;
  voiceRole: string;
  voiceAvatarUrl?: string;
  promise: string; // short description/promise
  cadenceLabel?: string;
  episodes: VoiceEpisode[];
}

// Get recency label for a Voice (e.g., "New 2d ago")
export function getVoiceRecencyLabel(voice: Voice): string | null {
  if (voice.episodes.length === 0) return null;
  
  const latest = [...voice.episodes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];
  
  const now = new Date();
  const published = new Date(latest.publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  if (diffDays === 0) return "New today";
  if (diffDays === 1) return "New 1d ago";
  if (diffDays <= 7) return `New ${diffDays}d ago`;
  
  return null;
}

// Get the most recent episode
export function getLatestVoiceEpisode(voice: Voice): VoiceEpisode | null {
  if (voice.episodes.length === 0) return null;
  
  return [...voice.episodes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )[0];
}

// Filter episodes by date range
export function filterVoiceEpisodesByDateRange(
  episodes: VoiceEpisode[],
  filter: 'last-4-weeks' | 'all'
): VoiceEpisode[] {
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
export function formatVoiceEpisodeDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Seed data for MVP
export const voices: Voice[] = [
  {
    voiceId: 'zia-ai-lead',
    voiceName: 'Zia',
    voiceRole: 'AI Lead, Manufacturing',
    voiceAvatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face',
    promise: 'Weekly signals on AI infrastructure & hyperscaler moves',
    cadenceLabel: 'Drops Tue/Thu',
    episodes: [
      {
        id: 'voice-zia-ep-0',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        hookTitle: "Why Azure OpenAI wins in manufacturing",
        mediaType: 'video',
        coverUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
        hook: 'Quick take on why manufacturing customers keep choosing Azure OpenAI over the competition.',
        takeaway: 'Data residency, integrated security, and the Teams/Power Platform ecosystem are deal-closers for ops-heavy orgs.',
        nextMove: "Ask: 'Where does your production data live today—and what security requirements govern AI access?'",
        durationLabel: '30s video',
        tagLabel: 'Azure AI'
      },
      {
        id: 'voice-zia-ep-1',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: "Azure's new GPU allocation strategy",
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
        hook: 'Microsoft just shifted how they allocate GPU capacity to enterprise customers.',
        takeaway: 'Priority access now requires a 12-month commit—this changes the conversation for Q1 renewals.',
        nextMove: "Ask: 'How are you planning your AI compute needs for the next year?'",
        durationLabel: '25s read',
        tagLabel: 'Azure AI'
      },
      {
        id: 'voice-zia-ep-2',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: "GCP's Gemini price drop impact",
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        hook: "Google cut Gemini API pricing by 40%—here's what it means for multi-cloud deals.",
        takeaway: 'Customers comparing Azure OpenAI now have a strong cost argument for GCP.',
        nextMove: 'Do: Update your competitive deck with the new pricing comparison.',
        durationLabel: '30s read',
        tagLabel: 'GCP'
      },
      {
        id: 'voice-zia-ep-3',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: "AWS Bedrock's enterprise push",
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-639322537228-f710d846310a?w=600&h=400&fit=crop',
        hook: 'Amazon is offering 6-month free trials of Bedrock to steal enterprise AI workloads.',
        takeaway: 'This aggressive move targets customers evaluating Azure AI—know your counter.',
        nextMove: "Ask: 'What's your current timeline for evaluating AI platforms?'",
        durationLabel: '20s read',
        tagLabel: 'AWS'
      },
      {
        id: 'voice-zia-ep-4',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: "NVIDIA's H200 availability update",
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
        hook: 'H200 GPUs are now shipping in volume—this changes the capacity conversation.',
        takeaway: 'Customers waiting for next-gen hardware can now commit to larger AI initiatives.',
        nextMove: 'Do: Reach out to accounts that delayed decisions due to hardware constraints.',
        durationLabel: '35s read',
        tagLabel: 'Infrastructure'
      },
      {
        id: 'voice-zia-ep-5',
        publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: 'Open source LLMs gaining enterprise traction',
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&h=400&fit=crop',
        hook: "Llama 3 and Mistral are now showing up in enterprise RFPs—here's how to position.",
        takeaway: 'Frame the conversation around total cost of ownership, not just model licensing.',
        nextMove: "Ask: 'Beyond the model, what support and security requirements do you have?'",
        durationLabel: '40s read',
        tagLabel: 'Strategy'
      },
      {
        id: 'voice-zia-ep-6',
        publishedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: 'Sovereign cloud requirements in EMEA',
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
        hook: 'New EU regulations are making sovereign cloud a must-have for financial services.',
        takeaway: 'Position our local datacenter presence as a key differentiator.',
        nextMove: 'Do: Map your EMEA accounts against the new compliance requirements.',
        durationLabel: '30s read',
        tagLabel: 'Compliance'
      },
      {
        id: 'voice-zia-ep-7',
        publishedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: 'Q4 cloud spending trends',
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        hook: 'Enterprise cloud budgets are shifting from infrastructure to AI services.',
        takeaway: 'Lead with AI value propositions rather than compute cost savings.',
        nextMove: "Ask: 'How is your AI roadmap influencing your cloud budget for next year?'",
        durationLabel: '45s read',
        tagLabel: 'Trends'
      },
      {
        id: 'voice-zia-ep-8',
        publishedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: 'The rise of inference-optimized hardware',
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
        hook: 'New inference chips are 3x more cost-effective than training GPUs for production.',
        takeaway: 'Help customers think beyond training—production inference is where costs compound.',
        nextMove: "Do: Review your top accounts' AI production roadmaps.",
        durationLabel: '35s read',
        tagLabel: 'Infrastructure'
      }
    ]
  },
  {
    voiceId: 'marcus-exec',
    voiceName: 'Marcus',
    voiceRole: 'VP Sales, Enterprise',
    voiceAvatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    promise: 'Executive insights for strategic conversations',
    cadenceLabel: 'Weekly',
    episodes: [
      {
        id: 'voice-marcus-ep-1',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: 'Navigating budget freezes',
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
        hook: 'CFOs are tightening budgets—but AI projects are still getting approved.',
        takeaway: 'Frame AI investments as cost-reduction initiatives, not new spending.',
        nextMove: "Ask: 'What efficiency gains would justify this investment to your CFO?'",
        durationLabel: '30s read',
        tagLabel: 'Objection'
      },
      {
        id: 'voice-marcus-ep-2',
        publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: "The CTO's AI adoption concerns",
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=400&fit=crop',
        hook: "CTOs are worried about AI security and governance—here's how to address it.",
        takeaway: 'Lead with your enterprise security features and compliance certifications.',
        nextMove: 'Do: Prepare a security-focused one-pager for technical stakeholders.',
        durationLabel: '25s read',
        tagLabel: 'Discovery'
      },
      {
        id: 'voice-marcus-ep-3',
        publishedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        hookTitle: 'Building executive champions',
        mediaType: 'image',
        coverUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop',
        hook: "The best deals have VP+ sponsors—here's how to identify and cultivate them.",
        takeaway: 'Look for executives with public commitments to digital transformation.',
        nextMove: "Do: Research your top 5 accounts' executives on LinkedIn for AI mentions.",
        durationLabel: '35s read',
        tagLabel: 'Strategy'
      }
    ]
  }
];

// Get a specific Voice by ID
export function getVoice(voiceId: string): Voice | null {
  return voices.find(v => v.voiceId === voiceId) || null;
}

// Get all episodes for a Voice
export function getVoiceEpisodes(voiceId: string): VoiceEpisode[] {
  const voice = getVoice(voiceId);
  if (!voice) return [];
  return [...voice.episodes].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
