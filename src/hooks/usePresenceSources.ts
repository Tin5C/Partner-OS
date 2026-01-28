// Hook for managing presence sources (mock local storage)
import { useState, useEffect, useCallback } from 'react';
import { useExperience } from '@/contexts/ExperienceContext';
import { PersonSource } from '@/lib/presenceScorecardData';

const DEFAULT_SOURCES: PersonSource[] = [
  { id: 'linkedin', type: 'linkedin', label: 'LinkedIn', connected: false },
  { id: 'website', type: 'website', label: 'Personal website', connected: false },
  { id: 'newsletter', type: 'newsletter', label: 'Newsletter', connected: false },
  { id: 'podcast', type: 'podcast', label: 'Podcast', connected: false },
  { id: 'speaker', type: 'speaker', label: 'Speaker page', connected: false },
  { id: 'pdf', type: 'pdf', label: 'Upload PDF', connected: false },
];

function getStorageKey(tenantSlug: string, audience: string): string {
  return `presence_sources_${audience}_${tenantSlug}`;
}

export function usePresenceSources() {
  const { tenantSlug, audience } = useExperience();
  const [sources, setSources] = useState<PersonSource[]>(DEFAULT_SOURCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const key = getStorageKey(tenantSlug, audience);
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setSources(JSON.parse(stored));
      } catch {
        setSources(DEFAULT_SOURCES);
      }
    } else {
      setSources(DEFAULT_SOURCES);
    }
    setIsLoaded(true);
  }, [tenantSlug, audience]);

  // Save to localStorage
  const saveSources = useCallback((newSources: PersonSource[]) => {
    const key = getStorageKey(tenantSlug, audience);
    localStorage.setItem(key, JSON.stringify(newSources));
    setSources(newSources);
  }, [tenantSlug, audience]);

  // Connect a source
  const connectSource = useCallback((sourceId: string, value: string) => {
    const updated = sources.map(s => 
      s.id === sourceId 
        ? { ...s, value, connected: !!value, addedAt: new Date().toISOString() }
        : s
    );
    saveSources(updated);
  }, [sources, saveSources]);

  // Disconnect a source
  const disconnectSource = useCallback((sourceId: string) => {
    const updated = sources.map(s => 
      s.id === sourceId 
        ? { ...s, value: undefined, connected: false, addedAt: undefined }
        : s
    );
    saveSources(updated);
  }, [sources, saveSources]);

  // Get connected count
  const connectedCount = sources.filter(s => s.connected).length;
  const connectedSources = sources.filter(s => s.connected);

  // Calculate confidence based on sources
  const getConfidenceFromSources = useCallback((): { level: 'low' | 'medium' | 'high'; percent: number } => {
    if (connectedCount >= 4) return { level: 'high', percent: 85 };
    if (connectedCount >= 2) return { level: 'medium', percent: 60 };
    if (connectedCount >= 1) return { level: 'medium', percent: 45 };
    return { level: 'low', percent: 25 };
  }, [connectedCount]);

  return {
    sources,
    isLoaded,
    connectedCount,
    connectedSources,
    connectSource,
    disconnectSource,
    saveSources,
    getConfidenceFromSources,
  };
}
