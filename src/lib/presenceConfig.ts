// Presence Configuration and Storage
// Focused on visibility/reputation signals - separate from core profile

export interface PresenceData {
  // LinkedIn (primary source)
  linkedinUrl?: string;
  linkedinPdfUploaded?: boolean;
  
  // Optional additional sources
  blogUrl?: string;
  mediumUrl?: string;
  githubUrl?: string;
  newsletterUrl?: string;
  
  // Goals
  goals: string[];
  
  // Metadata
  isConfigured: boolean;
  lastUpdated?: string;
}

// Default empty presence
export const DEFAULT_PRESENCE: PresenceData = {
  goals: [],
  isConfigured: false,
};

// Goals options
export const PRESENCE_GOALS = [
  { id: 'visibility', label: 'Visibility' },
  { id: 'credibility', label: 'Credibility' },
  { id: 'thought-leadership', label: 'Thought leadership' },
  { id: 'speaking-opportunities', label: 'Speaking opportunities' },
  { id: 'consistent-posting', label: 'Consistent posting' },
] as const;

// Storage key generator
export function getPresenceStorageKey(tenantSlug: string, audience: string): string {
  return `presence_data_${audience}_${tenantSlug}`;
}

// Get presence from localStorage
export function getStoredPresence(tenantSlug: string, audience: string): PresenceData | null {
  const key = getPresenceStorageKey(tenantSlug, audience);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as PresenceData;
  } catch {
    return null;
  }
}

// Save presence to localStorage
export function savePresence(tenantSlug: string, audience: string, presence: PresenceData): void {
  const key = getPresenceStorageKey(tenantSlug, audience);
  const toSave = { ...presence, lastUpdated: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(toSave));
}

// Check if presence has any source connected
export function hasPresenceSource(presence: PresenceData | null): boolean {
  if (!presence) return false;
  return !!(
    presence.linkedinUrl || 
    presence.linkedinPdfUploaded ||
    presence.blogUrl ||
    presence.mediumUrl ||
    presence.githubUrl ||
    presence.newsletterUrl
  );
}

// Validate LinkedIn URL
export function isValidLinkedInUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  try {
    const urlObj = new URL(trimmed);
    return urlObj.hostname.includes('linkedin.com');
  } catch {
    return false;
  }
}
