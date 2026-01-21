import { useState, useEffect, useCallback } from 'react';
import { ListenedState } from '@/lib/stories';

const STORY_STATE_KEY = 'dialogue-story-states';
const SAVED_STORIES_KEY = 'dialogue-saved-stories';

interface StoryStates {
  [storyId: string]: ListenedState;
}

export function useStoryState() {
  const [storyStates, setStoryStates] = useState<StoryStates>({});
  const [savedStories, setSavedStories] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedStates = localStorage.getItem(STORY_STATE_KEY);
      if (savedStates) {
        setStoryStates(JSON.parse(savedStates));
      }

      const saved = localStorage.getItem(SAVED_STORIES_KEY);
      if (saved) {
        setSavedStories(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load story states from localStorage', e);
    }
  }, []);

  // Persist states to localStorage
  const persistStates = useCallback((states: StoryStates) => {
    try {
      localStorage.setItem(STORY_STATE_KEY, JSON.stringify(states));
    } catch (e) {
      console.error('Failed to save story states to localStorage', e);
    }
  }, []);

  const persistSaved = useCallback((saved: string[]) => {
    try {
      localStorage.setItem(SAVED_STORIES_KEY, JSON.stringify(saved));
    } catch (e) {
      console.error('Failed to save saved stories to localStorage', e);
    }
  }, []);

  const getState = useCallback((storyId: string): ListenedState => {
    return storyStates[storyId] || 'unseen';
  }, [storyStates]);

  const markSeen = useCallback((storyId: string) => {
    setStoryStates(prev => {
      // Only update if currently unseen
      if (prev[storyId] && prev[storyId] !== 'unseen') {
        return prev;
      }
      const newStates = { ...prev, [storyId]: 'seen' as ListenedState };
      persistStates(newStates);
      return newStates;
    });
  }, [persistStates]);

  const markListened = useCallback((storyId: string) => {
    setStoryStates(prev => {
      const newStates = { ...prev, [storyId]: 'listened' as ListenedState };
      persistStates(newStates);
      return newStates;
    });
  }, [persistStates]);

  const isSaved = useCallback((storyId: string): boolean => {
    return savedStories.includes(storyId);
  }, [savedStories]);

  const toggleSave = useCallback((storyId: string) => {
    setSavedStories(prev => {
      const newSaved = prev.includes(storyId)
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId];
      persistSaved(newSaved);
      return newSaved;
    });
  }, [persistSaved]);

  return {
    getState,
    markSeen,
    markListened,
    isSaved,
    toggleSave,
    savedStories,
  };
}
