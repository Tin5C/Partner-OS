// Partner-only hook for Expert Corners expertise tracking
// Tracks: episode progress, completion, topic-based expertise levels

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PartnerExpertEpisode, getAllPartnerExpertEpisodes } from '@/data/partnerExpertCorners';

// Expertise levels (professional, not gamified)
export type ExpertiseLevel = 'none' | 'exploring' | 'practitioner' | 'recognized';

export interface TopicExpertise {
  topic: string;
  level: ExpertiseLevel;
  episodesStarted: number;
  episodesCompleted: number;
}

export interface EpisodeProgress {
  episodeId: string;
  progressPercent: number; // 0-100
  completed: boolean;
  lastWatchedAt: string;
}

export interface ExpertiseState {
  progress: Record<string, EpisodeProgress>;
  topicExpertise: TopicExpertise[];
  recentlyCompletedTopic: string | null; // For showing the banner once
}

const STORAGE_KEY = 'partner_expertise_state';
const COMPLETION_THRESHOLD = 80; // ≥80% watched = completed

// Get expertise level based on episodes started/completed
function getExpertiseLevel(started: number, completed: number): ExpertiseLevel {
  if (completed >= 2) return 'recognized';
  if (completed >= 1) return 'practitioner';
  if (started >= 1) return 'exploring';
  return 'none';
}

// Get human-readable label for expertise level
export function getExpertiseLevelLabel(level: ExpertiseLevel): string {
  switch (level) {
    case 'recognized': return 'Recognized';
    case 'practitioner': return 'Practitioner';
    case 'exploring': return 'Exploring';
    default: return '';
  }
}

// Build empty default state
function createDefaultState(): ExpertiseState {
  return {
    progress: {},
    topicExpertise: [],
    recentlyCompletedTopic: null,
  };
}

// Calculate topic expertise from progress
function calculateTopicExpertise(
  progress: Record<string, EpisodeProgress>,
  episodes: PartnerExpertEpisode[]
): TopicExpertise[] {
  // Group episodes by topic
  const topicMap = new Map<string, { started: number; completed: number }>();
  
  for (const episode of episodes) {
    const episodeProgress = progress[episode.id];
    const isStarted = episodeProgress && episodeProgress.progressPercent > 0;
    const isCompleted = episodeProgress?.completed ?? false;
    
    // Each episode can have multiple topic tags
    const topics = episode.topicTags || [];
    for (const topic of topics) {
      const current = topicMap.get(topic) || { started: 0, completed: 0 };
      if (isStarted) current.started++;
      if (isCompleted) current.completed++;
      topicMap.set(topic, current);
    }
  }
  
  // Convert to array with levels
  const expertise: TopicExpertise[] = [];
  topicMap.forEach((counts, topic) => {
    const level = getExpertiseLevel(counts.started, counts.completed);
    if (level !== 'none') {
      expertise.push({
        topic,
        level,
        episodesStarted: counts.started,
        episodesCompleted: counts.completed,
      });
    }
  });
  
  // Sort by level (recognized > practitioner > exploring) then by topic
  const levelOrder: Record<ExpertiseLevel, number> = {
    recognized: 0,
    practitioner: 1,
    exploring: 2,
    none: 3,
  };
  
  return expertise.sort((a, b) => {
    const levelDiff = levelOrder[a.level] - levelOrder[b.level];
    if (levelDiff !== 0) return levelDiff;
    return a.topic.localeCompare(b.topic);
  });
}

export function usePartnerExpertise() {
  const [state, setState] = useState<ExpertiseState>(createDefaultState);
  
  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as ExpertiseState;
        // Recalculate topic expertise in case episodes changed
        const episodes = getAllPartnerExpertEpisodes();
        const topicExpertise = calculateTopicExpertise(parsed.progress, episodes);
        setState({
          ...parsed,
          topicExpertise,
        });
      }
    } catch (e) {
      console.warn('Failed to load expertise state:', e);
    }
  }, []);
  
  // Save to localStorage when progress changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save expertise state:', e);
    }
  }, [state]);
  
  // Update progress for an episode
  const updateProgress = useCallback((episodeId: string, progressPercent: number) => {
    setState((prev) => {
      const existingProgress = prev.progress[episodeId];
      const wasCompleted = existingProgress?.completed ?? false;
      const isNowCompleted = progressPercent >= COMPLETION_THRESHOLD;
      const justCompleted = !wasCompleted && isNowCompleted;
      
      const newProgress: Record<string, EpisodeProgress> = {
        ...prev.progress,
        [episodeId]: {
          episodeId,
          progressPercent: Math.max(progressPercent, existingProgress?.progressPercent || 0),
          completed: wasCompleted || isNowCompleted,
          lastWatchedAt: new Date().toISOString(),
        },
      };
      
      const episodes = getAllPartnerExpertEpisodes();
      const topicExpertise = calculateTopicExpertise(newProgress, episodes);
      
      // Detect if a topic level just increased
      let recentlyCompletedTopic: string | null = null;
      if (justCompleted) {
        const episode = episodes.find(e => e.id === episodeId);
        if (episode?.topicTags?.length) {
          // Find first topic that had a level increase
          for (const topic of episode.topicTags) {
            const prevTopic = prev.topicExpertise.find(t => t.topic === topic);
            const newTopic = topicExpertise.find(t => t.topic === topic);
            if (newTopic && (!prevTopic || newTopic.level !== prevTopic.level)) {
              recentlyCompletedTopic = topic;
              break;
            }
          }
        }
      }
      
      return {
        progress: newProgress,
        topicExpertise,
        recentlyCompletedTopic,
      };
    });
  }, []);
  
  // Clear the recently completed topic banner
  const clearRecentlyCompletedTopic = useCallback(() => {
    setState((prev) => ({
      ...prev,
      recentlyCompletedTopic: null,
    }));
  }, []);
  
  // Get progress for a specific episode
  const getEpisodeProgress = useCallback((episodeId: string): EpisodeProgress | undefined => {
    return state.progress[episodeId];
  }, [state.progress]);
  
  // Check if episode is completed
  const isCompleted = useCallback((episodeId: string): boolean => {
    return state.progress[episodeId]?.completed ?? false;
  }, [state.progress]);
  
  // Get all topic expertise (filtered to only visible ones)
  const visibleExpertise = useMemo(() => {
    return state.topicExpertise.filter(t => t.level !== 'none');
  }, [state.topicExpertise]);
  
  // Get episodes in progress (started but not completed)
  const inProgressEpisodes = useMemo(() => {
    return Object.values(state.progress)
      .filter(p => p.progressPercent > 0 && !p.completed)
      .sort((a, b) => new Date(b.lastWatchedAt).getTime() - new Date(a.lastWatchedAt).getTime());
  }, [state.progress]);
  
  return {
    progress: state.progress,
    topicExpertise: visibleExpertise,
    recentlyCompletedTopic: state.recentlyCompletedTopic,
    updateProgress,
    clearRecentlyCompletedTopic,
    getEpisodeProgress,
    isCompleted,
    inProgressEpisodes,
  };
}
