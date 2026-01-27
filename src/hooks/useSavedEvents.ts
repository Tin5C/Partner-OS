import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'saved_events';

export function useSavedEvents(tenantSlug?: string) {
  const storageKey = tenantSlug ? `${STORAGE_KEY}_${tenantSlug}` : STORAGE_KEY;
  
  const [savedEventIds, setSavedEventIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {
      // Ignore parse errors
    }
    return new Set();
  });

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([...savedEventIds]));
    } catch {
      // Ignore storage errors
    }
  }, [savedEventIds, storageKey]);

  const saveEvent = useCallback((eventId: string) => {
    setSavedEventIds((prev) => new Set([...prev, eventId]));
  }, []);

  const unsaveEvent = useCallback((eventId: string) => {
    setSavedEventIds((prev) => {
      const next = new Set(prev);
      next.delete(eventId);
      return next;
    });
  }, []);

  const toggleSaved = useCallback((eventId: string) => {
    if (savedEventIds.has(eventId)) {
      unsaveEvent(eventId);
      return false;
    } else {
      saveEvent(eventId);
      return true;
    }
  }, [savedEventIds, saveEvent, unsaveEvent]);

  const isSaved = useCallback((eventId: string) => {
    return savedEventIds.has(eventId);
  }, [savedEventIds]);

  return {
    savedEventIds,
    saveEvent,
    unsaveEvent,
    toggleSaved,
    isSaved,
  };
}
