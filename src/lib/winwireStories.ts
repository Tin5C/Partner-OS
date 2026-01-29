// Winwire Stories - Video-first case studies
// Enterprise-safe stories with video as the centerpiece

import ubsWinwireVideo from '@/assets/stories/ubs-winwire.mp4';

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
  logoUrl?: string;  // Optional logo to show on tile
  durationSeconds: number;
  media: {
    backgroundType: 'static' | 'video';
    backgroundUrl: string;
    videoUrl?: string;  // Video-first: primary media
    audioUrl?: string;  // Fallback audio if needed
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
    logoUrl: "/assets/logos/ubs.png",
    durationSeconds: 65,
    media: {
      backgroundType: "video",
      backgroundUrl: "/assets/logos/ubs.png",
      videoUrl: ubsWinwireVideo,
    },
    subtitles: [], // Video has audio - no need for subtitle overlays
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
