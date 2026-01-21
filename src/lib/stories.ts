export type StoryType = "startup" | "expert" | "competitor" | "event" | "leads";
export type ListenedState = "unseen" | "seen" | "listened";

export interface StoryItem {
  id: string;
  type: StoryType;
  label: string;
  title: string; // max 42 chars
  bullets: string[]; // 2-4 items, each max 10 words
  whyItMatters?: string; // max 1 line
  sourceName: string;
  sourceUrl?: string;
  audioUrl?: string;
  durationSec?: number;
  tags?: string[];
  relatedEpisodeId?: string;
  relatedPlaylistId?: string;
  publishedAt?: string;
}

// Empty stories array - seed data will be added separately
export const stories: StoryItem[] = [];

// Type colors for pills
export const storyTypeColors: Record<StoryType, string> = {
  startup: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  expert: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  competitor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  event: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  leads: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

export const storyTypeLabels: Record<StoryType, string> = {
  startup: "Startup",
  expert: "Expert",
  competitor: "Competitor",
  event: "Event",
  leads: "Leads",
};
