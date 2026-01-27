// User Profile Configuration and Storage
// MVP: localStorage-based profile with skills, industries, competitors

export interface UserProfile {
  // Required fields
  name: string;
  role: 'ae' | 'partner-rep' | 'sales-lead' | 'sales-engineer';
  region: 'ch' | 'dach' | 'emea' | 'global';
  segments: string[];
  topIndustries: string[];
  otherIndustry?: string;
  competitorsFaced: string[];
  competitorsToTrack: string[];
  skillsToImprove: string[];
  
  // Optional fields
  preferredPlays?: string[];
  contentGoal?: 'credibility' | 'pipeline' | 'recruiting' | 'partnerships';
  tone?: 'enterprise-safe' | 'balanced' | 'bold';
  channels?: string[];
  knownFor?: string;
  contrarianInsight?: string;
  
  // Metadata
  lastUpdated?: string;
}

// Role options
export const ROLE_OPTIONS = [
  { id: 'ae', label: 'AE' },
  { id: 'partner-rep', label: 'Partner Rep' },
  { id: 'sales-lead', label: 'Sales Lead' },
  { id: 'sales-engineer', label: 'Sales Engineer' },
] as const;

// Region options
export const REGION_OPTIONS = [
  { id: 'ch', label: 'CH' },
  { id: 'dach', label: 'DACH' },
  { id: 'emea', label: 'EMEA' },
  { id: 'global', label: 'Global' },
] as const;

// Segment options
export const SEGMENT_OPTIONS = [
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'mid-market', label: 'Mid-market' },
  { id: 'smb', label: 'SMB' },
  { id: 'public-sector', label: 'Public sector' },
] as const;

// Industry options
export const INDUSTRY_OPTIONS = [
  'Financial Services',
  'Healthcare',
  'Manufacturing',
  'Retail & Consumer',
  'Technology',
  'Energy & Utilities',
  'Government',
  'Education',
  'Telecommunications',
  'Transportation & Logistics',
  'Professional Services',
  'Media & Entertainment',
] as const;

// Default competitor options (user can add custom)
export const DEFAULT_COMPETITORS = [
  'Salesforce',
  'AWS',
  'Google Cloud',
  'Oracle',
  'SAP',
  'ServiceNow',
  'Workday',
  'Adobe',
  'IBM',
  'Cisco',
  'Dell',
  'HPE',
  'VMware',
  'Snowflake',
  'Databricks',
] as const;

// Skills list (MANDATORY - no partner co-sell)
export const SKILLS_LIST = [
  'Discovery & qualification',
  'Executive messaging',
  'Objection handling',
  'Negotiation',
  'Competitive positioning',
  'Account strategy / account planning',
  'Stakeholder mapping',
  'Value selling (ROI / business case)',
  'Storytelling & presentations',
  'Follow-up & deal control',
  'Personal brand / thought leadership',
] as const;

// Default skills to preselect
export const DEFAULT_SKILLS = [
  'Discovery & qualification',
  'Objection handling',
  'Executive messaging',
];

// Preferred plays options
export const PLAY_OPTIONS = [
  { id: 'data-ai', label: 'Data & AI' },
  { id: 'security', label: 'Security' },
  { id: 'modern-work', label: 'Modern Work' },
  { id: 'infra', label: 'Infra' },
  { id: 'business-apps', label: 'Business Apps' },
  { id: 'no-preference', label: 'No preference' },
] as const;

// Content goal options
export const CONTENT_GOAL_OPTIONS = [
  { id: 'credibility', label: 'Credibility' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'recruiting', label: 'Recruiting' },
  { id: 'partnerships', label: 'Partnerships' },
] as const;

// Tone options
export const TONE_OPTIONS = [
  { id: 'enterprise-safe', label: 'Enterprise-safe' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'bold', label: 'Bold' },
] as const;

// Channel options
export const CHANNEL_OPTIONS = [
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'medium', label: 'Medium' },
  { id: 'internal-post', label: 'Internal post' },
  { id: 'script', label: 'Script' },
] as const;

// Default profile
export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  role: 'ae',
  region: 'ch',
  segments: [],
  topIndustries: [],
  competitorsFaced: [],
  competitorsToTrack: [],
  skillsToImprove: [...DEFAULT_SKILLS],
  tone: 'enterprise-safe',
};

// Storage key generator
export function getProfileStorageKey(tenantSlug: string, audience: string): string {
  return `user_profile_${audience}_${tenantSlug}`;
}

// Get profile from localStorage
export function getStoredProfile(tenantSlug: string, audience: string): UserProfile | null {
  const key = getProfileStorageKey(tenantSlug, audience);
  const stored = localStorage.getItem(key);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as UserProfile;
  } catch {
    return null;
  }
}

// Save profile to localStorage
export function saveProfile(tenantSlug: string, audience: string, profile: UserProfile): void {
  const key = getProfileStorageKey(tenantSlug, audience);
  const toSave = { ...profile, lastUpdated: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(toSave));
}

// Calculate profile completeness (0-100)
export function calculateProfileCompleteness(profile: UserProfile | null): number {
  if (!profile) return 0;
  
  // Required fields and their weights
  const checks = [
    { field: 'name', weight: 15, check: () => profile.name.trim().length > 0 },
    { field: 'role', weight: 10, check: () => !!profile.role },
    { field: 'region', weight: 10, check: () => !!profile.region },
    { field: 'segments', weight: 15, check: () => profile.segments.length > 0 },
    { field: 'topIndustries', weight: 15, check: () => profile.topIndustries.length > 0 },
    { field: 'competitorsFaced', weight: 10, check: () => profile.competitorsFaced.length > 0 },
    { field: 'competitorsToTrack', weight: 10, check: () => profile.competitorsToTrack.length > 0 },
    { field: 'skillsToImprove', weight: 15, check: () => profile.skillsToImprove.length > 0 },
  ];
  
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks.reduce((sum, c) => sum + (c.check() ? c.weight : 0), 0);
  
  return Math.round((earnedWeight / totalWeight) * 100);
}

// Check if profile has skills selected
export function hasSkillsSelected(profile: UserProfile | null): boolean {
  return !!profile && profile.skillsToImprove.length > 0;
}
