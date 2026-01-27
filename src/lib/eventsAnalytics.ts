// Events Analytics - Lightweight tracking hooks
// Can be swapped for real analytics (Segment, Mixpanel, etc.) later

export type EventAnalyticsEvent = 
  | 'events_view'
  | 'events_filter_change'
  | 'event_open'
  | 'event_save'
  | 'event_unsave'
  | 'event_generate_prep'
  | 'event_add_to_calendar';

interface AnalyticsPayload {
  event: EventAnalyticsEvent;
  properties?: Record<string, unknown>;
  timestamp: string;
}

// In-memory event store for MVP (can be exported/viewed)
const eventStore: AnalyticsPayload[] = [];

export function trackEvent(
  event: EventAnalyticsEvent,
  properties?: Record<string, unknown>
): void {
  const payload: AnalyticsPayload = {
    event,
    properties,
    timestamp: new Date().toISOString(),
  };
  
  // Console log for visibility during MVP
  console.log('[Events Analytics]', event, properties);
  
  // Store in memory
  eventStore.push(payload);
  
  // Optional: Persist to localStorage for debugging
  try {
    const stored = localStorage.getItem('events_analytics') || '[]';
    const parsed = JSON.parse(stored);
    parsed.push(payload);
    // Keep only last 100 events
    const trimmed = parsed.slice(-100);
    localStorage.setItem('events_analytics', JSON.stringify(trimmed));
  } catch {
    // Ignore storage errors
  }
}

export function getAnalyticsEvents(): AnalyticsPayload[] {
  return [...eventStore];
}

export function clearAnalyticsEvents(): void {
  eventStore.length = 0;
  localStorage.removeItem('events_analytics');
}
