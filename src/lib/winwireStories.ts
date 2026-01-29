// Winwire Stories - Narrated case studies with subtitles
// These are enterprise-safe stories that autoplay audio with synchronized subtitles

export interface WinwireSubtitle {
  start: number;  // seconds
  end: number;    // seconds
  text: string;
}

export interface WinwireStory {
  id: string;
  type: 'story';
  storyType: 'winwire';
  spaceVisibility: ('internal' | 'partner')[];
  chipLabel: string;
  title: string;
  subtitle: string;
  industry: string;
  durationSeconds: number;
  media: {
    backgroundType: 'static' | 'video';
    backgroundUrl: string;
    audioUrl: string;
  };
  subtitles: WinwireSubtitle[];
  tags: string[];
  sourceType: string;
  sanitizationLevel: string;
  createdAt: string;
}

// Winwire stories collection
export const winwireStories: WinwireStory[] = [
  {
    id: "winwire-ubs-ai-documents",
    type: "story",
    storyType: "winwire",
    spaceVisibility: ["internal", "partner"],
    chipLabel: "Winwire",
    title: "UBS turns 60,000+ documents into AI-ready knowledge",
    subtitle: "How advisors unlocked institutional knowledge with AI",
    industry: "Banking / Financial Services",
    durationSeconds: 65,
    media: {
      backgroundType: "static",
      backgroundUrl: "/assets/backgrounds/abstract-finance.jpg",
      audioUrl: "/assets/audio/winwire-ubs-ai-narration.mp3"
    },
    subtitles: [
      { start: 0, end: 6, text: "UBS transformed how advisors access institutional knowledge with AI." },
      { start: 6, end: 14, text: "They were sitting on tens of thousands of investment and product documents." },
      { start: 14, end: 22, text: "Finding the right insight often took too long." },
      { start: 22, end: 32, text: "So UBS digitized and indexed over sixty thousand documents into a searchable knowledge base." },
      { start: 32, end: 42, text: "Advisors can now surface relevant insights in seconds." },
      { start: 42, end: 52, text: "Strong governance and access controls were built in from the start." },
      { start: 52, end: 65, text: "Ask yourself: what internal knowledge would change performance if it was instantly searchable?" }
    ],
    tags: ["AI", "Knowledge Management", "Advisory", "Enablement"],
    sourceType: "public-learning",
    sanitizationLevel: "enterprise-safe",
    createdAt: "2026-01-29"
  }
];

// Get winwire stories filtered by space visibility
export function getWinwireStories(space: 'internal' | 'partner'): WinwireStory[] {
  return winwireStories.filter(story => story.spaceVisibility.includes(space));
}

// Get a single winwire story by ID
export function getWinwireStory(id: string): WinwireStory | undefined {
  return winwireStories.find(story => story.id === id);
}

// Format duration for display
export function formatWinwireDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
