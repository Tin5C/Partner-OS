import { useState, useCallback, useEffect } from 'react';

export type ReactionType = 'useful' | 'relevant' | 'share' | 'followup';

export interface Reaction {
  type: ReactionType;
  label: string;
  icon: string; // lucide icon name
}

export const REACTIONS: Reaction[] = [
  { type: 'useful', label: 'Useful', icon: 'CheckCircle2' },
  { type: 'relevant', label: 'Relevant to my accounts', icon: 'Target' },
  { type: 'share', label: 'Worth sharing', icon: 'Forward' },
  { type: 'followup', label: 'Follow up', icon: 'Flag' },
];

interface ReactionState {
  [storyId: string]: ReactionType[];
}

const STORAGE_KEY = 'story-reactions';

function loadReactions(): ReactionState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveReactions(state: ReactionState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable
  }
}

export function useStoryReactions() {
  const [reactions, setReactions] = useState<ReactionState>(loadReactions);

  useEffect(() => {
    saveReactions(reactions);
  }, [reactions]);

  const getReactions = useCallback((storyId: string): ReactionType[] => {
    return reactions[storyId] || [];
  }, [reactions]);

  const hasReaction = useCallback((storyId: string, type: ReactionType): boolean => {
    return (reactions[storyId] || []).includes(type);
  }, [reactions]);

  const toggleReaction = useCallback((storyId: string, type: ReactionType) => {
    setReactions(prev => {
      const current = prev[storyId] || [];
      const hasIt = current.includes(type);
      
      const updated = hasIt
        ? current.filter(r => r !== type)
        : [...current, type];
      
      return {
        ...prev,
        [storyId]: updated
      };
    });
  }, []);

  const getStoriesWithReaction = useCallback((type: ReactionType): string[] => {
    return Object.entries(reactions)
      .filter(([_, types]) => types.includes(type))
      .map(([storyId]) => storyId);
  }, [reactions]);

  // Analytics helpers (internal only)
  const getReactionStats = useCallback(() => {
    const stats: Record<ReactionType, number> = {
      useful: 0,
      relevant: 0,
      share: 0,
      followup: 0
    };

    Object.values(reactions).forEach(types => {
      types.forEach(type => {
        stats[type]++;
      });
    });

    return stats;
  }, [reactions]);

  return {
    getReactions,
    hasReaction,
    toggleReaction,
    getStoriesWithReaction,
    getReactionStats
  };
}
