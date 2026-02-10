// Unified Stories Model
// Merges Signal stories, Voice episodes, and Winwire stories into a single sorted list

import { stories, StoryItem as SignalStoryItem, StoryType } from './stories';
import { voices, Voice, VoiceEpisode, getVoiceRecencyLabel } from './voices';
import { winwireStories, WinwireStory } from './winwireStories';

export type UnifiedItemType = 'signal' | 'voice' | 'winwire';

export interface UnifiedStoryItem {
  id: string;
  itemType: UnifiedItemType;
  publishedAt: string;
  
  // Common display fields
  title: string;
  subtitle?: string;
  chipLabel: string;
  mediaType: 'image' | 'video' | 'audio';
  coverUrl?: string;
  videoUrl?: string;
  
  // Signal-specific fields
  signalType?: StoryType;
  signalData?: SignalStoryItem;
  
  // Voice-specific fields
  voiceId?: string;
  voiceName?: string;
  voiceRole?: string;
  voiceAvatarUrl?: string;
  voiceData?: Voice;
  voiceEpisode?: VoiceEpisode;
  recencyLabel?: string | null;
  
  // Winwire-specific fields
  winwireData?: WinwireStory;
}

// Convert Signal story to unified item
function signalToUnified(story: SignalStoryItem): UnifiedStoryItem {
  return {
    id: story.id,
    itemType: 'signal',
    publishedAt: story.publishedAt || new Date().toISOString(),
    title: story.headline,
    subtitle: story.one_liner,
    chipLabel: story.badge,
    mediaType: story.media_type,
    coverUrl: story.coverImageUrl || story.personImageUrl || story.logoUrl,
    videoUrl: story.videoUrl,
    signalType: story.type,
    signalData: story,
  };
}

// Convert Voice episode to unified item
function voiceEpisodeToUnified(voice: Voice, episode: VoiceEpisode): UnifiedStoryItem {
  return {
    id: episode.id,
    itemType: 'voice',
    publishedAt: episode.publishedAt,
    title: episode.hookTitle,
    subtitle: episode.hook,
    chipLabel: 'Voice',
    mediaType: episode.mediaType,
    coverUrl: episode.coverUrl,
    videoUrl: episode.videoUrl,
    voiceId: voice.voiceId,
    voiceName: voice.voiceName,
    voiceRole: voice.voiceRole,
    voiceAvatarUrl: voice.voiceAvatarUrl,
    voiceData: voice,
    voiceEpisode: episode,
    recencyLabel: getVoiceRecencyLabel(voice),
  };
}

// Convert Winwire story to unified item
function winwireToUnified(story: WinwireStory): UnifiedStoryItem {
  return {
    id: story.id,
    itemType: 'winwire',
    publishedAt: story.createdAt,
    title: story.title,
    subtitle: story.subtitle,
    chipLabel: story.chipLabel,
    mediaType: 'audio',
    coverUrl: story.media.backgroundUrl,
    winwireData: story,
  };
}

// Get all unified stories sorted by publishedAt (newest first)
export function getUnifiedStories(space?: string): UnifiedStoryItem[] {
  const signalItems = stories.map(signalToUnified);
  
  // For Voice items, we add ONLY the latest episode from each Voice to the main rail
  // This ensures the rail isn't flooded with all Voice episodes
  const voiceItems: UnifiedStoryItem[] = voices.map(voice => {
    const latestEpisode = [...voice.episodes].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )[0];
    if (!latestEpisode) return null;
    return voiceEpisodeToUnified(voice, latestEpisode);
  }).filter((item): item is UnifiedStoryItem => item !== null);
  
  // Filter winwire stories by space visibility if space is provided
  const filteredWinwire = space 
    ? winwireStories.filter(s => s.spaceVisibility.includes(space as any))
    : winwireStories;
  const winwireItems = filteredWinwire.map(winwireToUnified);
  
  return [...signalItems, ...voiceItems, ...winwireItems].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get winwire playlist for winwire context
export function getWinwirePlaylist(space?: string): UnifiedStoryItem[] {
  const filtered = space 
    ? winwireStories.filter(s => s.spaceVisibility.includes(space as any))
    : winwireStories;
  
  return filtered
    .map(winwireToUnified)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get all signal stories for signal playlist context
export function getSignalPlaylist(): UnifiedStoryItem[] {
  return stories
    .map(signalToUnified)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get all episodes for a specific Voice (for voice playlist context)
export function getVoicePlaylist(voiceId: string): UnifiedStoryItem[] {
  const voice = voices.find(v => v.voiceId === voiceId);
  if (!voice) return [];
  
  return voice.episodes
    .map(ep => voiceEpisodeToUnified(voice, ep))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get recency label for display (e.g., "New 2d ago")
export function getRecencyLabelForItem(item: UnifiedStoryItem): string | null {
  if (item.itemType === 'voice') {
    return item.recencyLabel || null;
  }
  
  // For signals, calculate recency
  const now = new Date();
  const published = new Date(item.publishedAt);
  const diffMs = now.getTime() - published.getTime();
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  
  if (diffDays === 0) return "New today";
  if (diffDays === 1) return "New 1d ago";
  if (diffDays <= 7) return `New ${diffDays}d ago`;
  
  return null;
}
