import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Get Monday of a given date (Europe/Zurich timezone logic)
export function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Get the Monday of N weeks ago
export function getWeekStartOffset(weeksBack: number): Date {
  const today = new Date();
  const monday = getMondayOfWeek(today);
  monday.setDate(monday.getDate() - weeksBack * 7);
  return monday;
}

// Format date as "Mon DD"
export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

// Format date as "Week of Jan 20"
export function formatWeekLabel(date: Date): string {
  return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}

// Get Sunday of the week
export function getSundayOfWeek(monday: Date): Date {
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  return sunday;
}

// Check if a date falls within a given week (Monday to Sunday)
// Uses string comparison to avoid timezone issues
export function isDateInWeek(dateStr: string, weekStart: Date): boolean {
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weekEnd = getSundayOfWeek(weekStart);
  const weekEndStr = weekEnd.toISOString().split('T')[0];
  
  // Compare as strings (YYYY-MM-DD format)
  return dateStr >= weekStartStr && dateStr <= weekEndStr;
}

const MAX_WEEKS_BACK = 3;

export function useWeekSelection() {
  const { user } = useAuth();
  const storageKey = user ? `focusWeekOffset:${user.id}` : null;

  // Initialize from localStorage
  const [weekOffset, setWeekOffset] = useState<number>(() => {
    if (!storageKey) return 0;
    const stored = localStorage.getItem(storageKey);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= MAX_WEEKS_BACK) {
        return parsed;
      }
    }
    return 0;
  });

  // Persist to localStorage when offset changes
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, weekOffset.toString());
    }
  }, [weekOffset, storageKey]);

  // Re-read from storage when user changes
  useEffect(() => {
    if (storageKey) {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        const parsed = parseInt(stored, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= MAX_WEEKS_BACK) {
          setWeekOffset(parsed);
          return;
        }
      }
      setWeekOffset(0);
    }
  }, [storageKey]);

  const goToPreviousWeek = useCallback(() => {
    setWeekOffset((prev) => Math.min(prev + 1, MAX_WEEKS_BACK));
  }, []);

  const goToNextWeek = useCallback(() => {
    setWeekOffset((prev) => Math.max(prev - 1, 0));
  }, []);

  const canGoPrevious = weekOffset < MAX_WEEKS_BACK;
  const canGoNext = weekOffset > 0;

  const selectedWeekStart = useMemo(() => getWeekStartOffset(weekOffset), [weekOffset]);
  const selectedWeekEnd = useMemo(() => getSundayOfWeek(selectedWeekStart), [selectedWeekStart]);

  const weekLabel = useMemo(() => formatWeekLabel(selectedWeekStart), [selectedWeekStart]);
  const weekRange = useMemo(() => {
    const startStr = formatShortDate(selectedWeekStart);
    const endStr = formatShortDate(selectedWeekEnd);
    return `${startStr}–${endStr}`;
  }, [selectedWeekStart, selectedWeekEnd]);

  return {
    weekOffset,
    selectedWeekStart,
    selectedWeekEnd,
    weekLabel,
    weekRange,
    goToPreviousWeek,
    goToNextWeek,
    canGoPrevious,
    canGoNext,
    isDateInWeek: (dateStr: string) => isDateInWeek(dateStr, selectedWeekStart),
  };
}
