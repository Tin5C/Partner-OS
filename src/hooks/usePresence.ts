// Hook for managing presence/visibility data - separate from core profile
import { useState, useEffect, useCallback } from 'react';
import { useExperience } from '@/contexts/ExperienceContext';
import {
  PresenceData,
  DEFAULT_PRESENCE,
  getStoredPresence,
  savePresence,
  hasPresenceSource,
} from '@/lib/presenceConfig';

export function usePresence() {
  const { tenantSlug, audience } = useExperience();
  const [presence, setPresence] = useState<PresenceData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load presence on mount
  useEffect(() => {
    const stored = getStoredPresence(tenantSlug, audience);
    setPresence(stored);
    setIsLoaded(true);
  }, [tenantSlug, audience]);

  // Save presence
  const updatePresence = useCallback((updates: Partial<PresenceData>) => {
    setPresence((prev) => {
      const updated = { 
        ...(prev || DEFAULT_PRESENCE), 
        ...updates,
        isConfigured: true,
      };
      savePresence(tenantSlug, audience, updated);
      return updated;
    });
  }, [tenantSlug, audience]);

  // Full save
  const saveFullPresence = useCallback((fullPresence: PresenceData) => {
    const toSave = { ...fullPresence, isConfigured: true };
    savePresence(tenantSlug, audience, toSave);
    setPresence(toSave);
  }, [tenantSlug, audience]);

  // Clear/disconnect presence
  const clearPresence = useCallback(() => {
    const cleared = { ...DEFAULT_PRESENCE };
    savePresence(tenantSlug, audience, cleared);
    setPresence(cleared);
  }, [tenantSlug, audience]);

  // Remove specific source
  const removeSource = useCallback((source: 'linkedin' | 'blog' | 'medium' | 'github' | 'newsletter') => {
    setPresence((prev) => {
      if (!prev) return prev;
      const updated = { ...prev };
      switch (source) {
        case 'linkedin':
          updated.linkedinUrl = undefined;
          updated.linkedinPdfUploaded = false;
          break;
        case 'blog':
          updated.blogUrl = undefined;
          break;
        case 'medium':
          updated.mediumUrl = undefined;
          break;
        case 'github':
          updated.githubUrl = undefined;
          break;
        case 'newsletter':
          updated.newsletterUrl = undefined;
          break;
      }
      // Check if still configured
      updated.isConfigured = hasPresenceSource(updated) || updated.goals.length > 0;
      savePresence(tenantSlug, audience, updated);
      return updated;
    });
  }, [tenantSlug, audience]);

  const isConfigured = presence?.isConfigured ?? false;
  const hasSource = hasPresenceSource(presence);

  return {
    presence,
    isLoaded,
    isConfigured,
    hasSource,
    updatePresence,
    saveFullPresence,
    clearPresence,
    removeSource,
  };
}
