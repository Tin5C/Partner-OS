// Voice Data Model
// Internal thought-leaders / SMEs with episodic content

import ziaAvatar from '@/assets/voices/zia.jpg';
import ziaStoryVideo from '@/assets/voices/zia_story.mp4';
import andrewAvatar from '@/assets/voices/andrew.jpg';

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
    voiceRole: 'CVP Azure AI',
    voiceAvatarUrl: ziaAvatar,
    promise: 'Weekly signals on AI infrastructure & hyperscaler moves',
    cadenceLabel: 'Drops Tue/Thu',
    episodes: [
      {
        id: 'voice-zia-ep-1',
        publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        hookTitle: "Why Azure OpenAI wins in manufacturing",
        mediaType: 'video',
        coverUrl: ziaAvatar,
        videoUrl: ziaStoryVideo,
        hook: 'Quick take on why manufacturing customers keep choosing Azure OpenAI over the competition.',
        takeaway: 'Data residency, integrated security, and the Teams/Power Platform ecosystem are deal-closers for ops-heavy orgs.',
        nextMove: "Ask: 'Where does your production data live today—and what security requirements govern AI access?'",
        durationLabel: '30s video',
        tagLabel: 'Azure AI'
      }
    ]
  },
  {
    voiceId: 'andrew-partnerships',
    voiceName: 'Andrew',
    voiceRole: 'Partnerships Lead, Microsoft Switzerland',
    voiceAvatarUrl: andrewAvatar,
    promise: 'Partner insights and co-sell strategies for EMEA',
    cadenceLabel: 'Weekly',
    episodes: [
      {
        id: 'voice-andrew-ep-1',
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        hookTitle: "Co-sell momentum in Swiss manufacturing",
        mediaType: 'image',
        coverUrl: andrewAvatar,
        hook: 'Swiss manufacturing accounts are accelerating co-sell deals—here\'s the pattern I\'m seeing.',
        takeaway: 'Local partners with industry expertise are closing 40% faster when positioned as implementation leads.',
        nextMove: "Ask: 'Which local partner has the deepest manufacturing domain expertise for your region?'",
        durationLabel: '25s read',
        tagLabel: 'Co-Sell'
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
