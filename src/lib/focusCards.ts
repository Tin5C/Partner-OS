// Focus Cards Data Model - Spotify-like preview cards for Home
import { Episode } from './data';

export interface FocusCard {
  id: string;
  title: string;
  subtitle: string;
  previewBullets: string[];
  insightLine?: string;
  insightLabel?: string;
  listenFor?: string[];
  suggestedMove?: string;
  footer: string;
  tags: { label: string; value: string }[];
  timeEstimate: string;
  lastUpdated: string;
  weekStart: string; // ISO date string for the Monday of this card's week
  audioUrl?: string;
  linkedPlaylistId?: string;
  linkedEpisode?: Episode;
  primaryAction: 'play' | 'open-playlist';
  secondaryAction?: { label: string; action: 'open-playlist' | 'view-scorecard' | 'continue-listening' };
  icon: string;
  gradient: string;
  logos?: string[]; // Array of logo identifiers for this card
}

// Helper to get Monday of current week
function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Format date as YYYY-MM-DD in local timezone (NOT UTC)
function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to get Monday of N weeks ago
function getWeekStartOffset(weeksBack: number): string {
  const today = new Date();
  const monday = getMondayOfWeek(today);
  monday.setDate(monday.getDate() - weeksBack * 7);
  return formatLocalDate(monday);
}

// Current week (week 0) and past weeks
const week0 = getWeekStartOffset(0); // Current week
const week1 = getWeekStartOffset(1); // 1 week ago
const week2 = getWeekStartOffset(2); // 2 weeks ago
const week3 = getWeekStartOffset(3); // 3 weeks ago

const currentWeek = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const focusCards: FocusCard[] = [
  // Week 0 (current week) cards
  {
    id: 'top-focus-sulzer',
    title: 'Top Focus — Sulzer',
    subtitle: 'Highlights for the week',
    previewBullets: [
      'Employer brand signal (Top Employer 2025) → execution capacity',
      'Services/rentals expansion continues (wastewater rental acquisition)',
      'Order intake baseline frames near-term investment appetite',
    ],
    insightLine: 'Standardization + delivery confidence are becoming the story, not just products.',
    insightLabel: 'Why it matters',
    listenFor: ['deployment excellence', 'commercial discipline', 'service attach', 'installed base'],
    suggestedMove: 'Ask 1 question on deployment variance + 1 on services growth metrics.',
    footer: 'Listen to the podcast for the full talk track + SPIN questions.',
    tags: [
      { label: 'Focus', value: 'Sulzer' },
      { label: 'Industry', value: 'Manufacturing' },
      { label: 'Type', value: 'Account Update' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week0,
    linkedPlaylistId: 'top-accounts',
    primaryAction: 'play',
    secondaryAction: { label: 'Open playlist', action: 'open-playlist' },
    icon: 'building-2',
    gradient: 'from-blue-500/20 to-blue-500/5',
    logos: ['sulzer'],
  },
  {
    id: 'competitive-radar',
    title: 'Competitive Radar',
    subtitle: 'What shifted in the market',
    previewBullets: [
      'Sovereign cloud messaging is rising as a procurement filter',
      'Buyers expect faster pilots + clearer ROI narratives',
      'Platform cadence is becoming a comparison point',
    ],
    insightLine: 'Treat sovereignty as a sales motion—then anchor to outcomes and adoption.',
    insightLabel: 'How to think',
    listenFor: undefined,
    suggestedMove: undefined,
    footer: 'Listen to the podcast for the deep dive + seller moves.',
    tags: [
      { label: 'Type', value: 'Competitive' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week0,
    linkedPlaylistId: 'competitive',
    primaryAction: 'play',
    secondaryAction: { label: 'Open playlist', action: 'open-playlist' },
    icon: 'radar',
    gradient: 'from-red-500/20 to-red-500/5',
    logos: ['aws', 'gcp', 'azure'],
  },
  {
    id: 'industry-news-manufacturing',
    title: 'Industry News — Manufacturing',
    subtitle: 'Applied to Sulzer',
    previewBullets: [
      'Resilience + risk now shape investment decisions',
      'Energy affordability and security constrain transformation pace',
      'Execution risk drives cost → standardization is the hedge',
      'Services are a margin lever—data becomes revenue',
    ],
    insightLine: 'Hiring + expansion signals point to deployment discipline and services growth.',
    insightLabel: 'Applied to Sulzer',
    footer: 'Listen to the podcast for thesis-to-account translation + resonance questions.',
    tags: [
      { label: 'Industry', value: 'Manufacturing' },
      { label: 'Type', value: 'Industry News' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week0,
    linkedPlaylistId: 'industry-news',
    primaryAction: 'play',
    secondaryAction: { label: 'Open playlist', action: 'open-playlist' },
    icon: 'newspaper',
    gradient: 'from-amber-500/20 to-amber-500/5',
    logos: ['mckinsey', 'gartner'],
  },
  {
    id: 'book-briefings',
    title: 'Book Briefings',
    subtitle: 'Micro-learning for this week',
    previewBullets: [
      'Execution discipline',
      'Cost clarity',
      'Services growth',
      'Procurement trust',
    ],
    insightLine: "5 short episodes → 3 takeaways each → one 'apply this week' action.",
    insightLabel: 'Format',
    footer: 'Listen, then use the tactic in your next account conversation.',
    tags: [
      { label: 'Type', value: 'Learning' },
    ],
    timeEstimate: '~10–15 min',
    lastUpdated: currentWeek,
    weekStart: week0,
    linkedPlaylistId: 'book-briefings',
    primaryAction: 'open-playlist',
    secondaryAction: { label: 'Continue listening', action: 'continue-listening' },
    icon: 'book-open',
    gradient: 'from-rose-500/20 to-rose-500/5',
  },

  // Week 1 (1 week ago) cards
  {
    id: 'objection-handling',
    title: 'Objection Handling',
    subtitle: "This month's set (derived from Competitive + Industry signals)",
    previewBullets: [
      'Sovereignty is unclear—procurement will block this.',
      "We're in cost mode—no funding.",
      'Integration will kill us—too many systems.',
      "Adoption won't stick in operations.",
      "Our data isn't ready for services growth.",
    ],
    insightLine: 'ACRN: Acknowledge → Clarify → Reframe → Next step.',
    insightLabel: 'Framework',
    footer: 'Listen to the podcast for ready-to-use responses + proof prompts.',
    tags: [
      { label: 'Type', value: 'Objection Handling' },
      { label: 'Cadence', value: 'Monthly' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'objection-handling',
    primaryAction: 'play',
    secondaryAction: { label: 'Open playlist', action: 'open-playlist' },
    icon: 'message-circle',
    gradient: 'from-purple-500/20 to-purple-500/5',
  },
  {
    id: 'personal-brand-daniel',
    title: 'Personal Brand — Daniel Schaffhauser',
    subtitle: 'Snapshot scorecard',
    previewBullets: [
      'Tier: Practitioner (cross-channel: light)',
      'Strength: clear role + strong LinkedIn activity',
      'Gap: more proof-backed posts + one external validation signal',
    ],
    insightLine: 'Add a signature POV + publish 2 micro-case posts.',
    insightLabel: 'Next upgrade',
    footer: 'Listen to the podcast for the score breakdown + exact edits.',
    tags: [
      { label: 'Type', value: 'Personal Brand' },
    ],
    timeEstimate: '~3–4 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'personal-brand',
    primaryAction: 'play',
    secondaryAction: { label: 'View scorecard', action: 'view-scorecard' },
    icon: 'user-circle',
    gradient: 'from-violet-500/20 to-violet-500/5',
  },
  {
    id: 'competitive-radar-w1',
    title: 'Competitive Radar',
    subtitle: "Last week's market shifts",
    previewBullets: [
      'New pricing tiers announced by major competitor',
      'Industry analysts shifting narrative on cloud adoption',
      'Enterprise deal velocity metrics updated',
    ],
    insightLine: 'Position against complexity—simplicity wins in procurement.',
    insightLabel: 'How to think',
    footer: 'Listen for competitive positioning angles.',
    tags: [
      { label: 'Type', value: 'Competitive' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'competitive',
    primaryAction: 'play',
    icon: 'radar',
    gradient: 'from-red-500/20 to-red-500/5',
    logos: ['aws', 'azure'],
  },

  // Week 2 (2 weeks ago) cards
  {
    id: 'top-focus-sulzer-w2',
    title: 'Top Focus — Sulzer',
    subtitle: 'Q4 review highlights',
    previewBullets: [
      'Q4 earnings beat expectations by 3%',
      'New regional expansion announced',
      'Leadership changes in operations division',
    ],
    insightLine: 'Growth trajectory remains strong—execution is the differentiator.',
    insightLabel: 'Why it matters',
    footer: 'Review Q4 talking points before next call.',
    tags: [
      { label: 'Focus', value: 'Sulzer' },
      { label: 'Type', value: 'Account Update' },
    ],
    timeEstimate: '~7 min',
    lastUpdated: currentWeek,
    weekStart: week2,
    linkedPlaylistId: 'top-accounts',
    primaryAction: 'play',
    icon: 'building-2',
    gradient: 'from-blue-500/20 to-blue-500/5',
    logos: ['sulzer'],
  },
  {
    id: 'industry-news-w2',
    title: 'Industry News — Manufacturing',
    subtitle: 'Sector-wide trends',
    previewBullets: [
      'Supply chain normalization continues',
      'Labor market pressures easing',
      'Investment in automation accelerating',
    ],
    insightLine: 'Cost optimization is the near-term priority for most buyers.',
    insightLabel: 'Market context',
    footer: 'Use these trends to frame value conversations.',
    tags: [
      { label: 'Industry', value: 'Manufacturing' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week2,
    linkedPlaylistId: 'industry-news',
    primaryAction: 'play',
    icon: 'newspaper',
    gradient: 'from-amber-500/20 to-amber-500/5',
    logos: ['mckinsey'],
  },

  // Week 3 (3 weeks ago) cards
  {
    id: 'book-briefings-w3',
    title: 'Book Briefings',
    subtitle: 'Sales methodology deep dive',
    previewBullets: [
      'SPIN Selling refresher',
      'Challenger Sale key tactics',
      'Value-based selling frameworks',
    ],
    insightLine: "Apply one technique this week and track the response.",
    insightLabel: 'Action',
    footer: 'Classic frameworks, modern applications.',
    tags: [
      { label: 'Type', value: 'Learning' },
    ],
    timeEstimate: '~12 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'book-briefings',
    primaryAction: 'open-playlist',
    icon: 'book-open',
    gradient: 'from-rose-500/20 to-rose-500/5',
  },
  {
    id: 'competitive-radar-w3',
    title: 'Competitive Radar',
    subtitle: 'Monthly summary',
    previewBullets: [
      'Market share shifts documented',
      'Competitive win/loss analysis complete',
      'New battlecards published',
    ],
    insightLine: 'Review battlecards before major pitches.',
    insightLabel: 'Action',
    footer: 'Stay sharp on competitive positioning.',
    tags: [
      { label: 'Type', value: 'Competitive' },
    ],
    timeEstimate: '~8 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'competitive',
    primaryAction: 'play',
    icon: 'radar',
    gradient: 'from-red-500/20 to-red-500/5',
    logos: ['gcp', 'azure'],
  },
];

// Create mock episodes for each focus card
export const focusEpisodes: Record<string, Episode> = {
  'top-focus-sulzer': {
    id: 'focus-sulzer-1',
    title: 'Top Focus — Sulzer: This Week',
    playlistId: 'top-accounts',
    duration: 360,
    speaker: 'Strategy Team',
    speakerRole: 'Account Intelligence',
    date: new Date().toISOString().split('T')[0],
    takeaways: [
      'Employer brand signal (Top Employer 2025) → execution capacity',
      'Services/rentals expansion continues',
      'Order intake baseline frames investment appetite',
    ],
    tags: ['sulzer', 'manufacturing', 'account'],
    plays: 234,
  },
  'competitive-radar': {
    id: 'focus-competitive-1',
    title: 'Competitive Radar: This Week',
    playlistId: 'competitive',
    duration: 360,
    speaker: 'Market Intelligence',
    speakerRole: 'Competitive Analysis',
    date: new Date().toISOString().split('T')[0],
    takeaways: [
      'Sovereign cloud messaging rising as procurement filter',
      'Buyers expect faster pilots + clearer ROI',
      'Platform cadence becoming a comparison point',
    ],
    tags: ['competitive', 'market', 'strategy'],
    plays: 456,
  },
  'industry-news-manufacturing': {
    id: 'focus-industry-1',
    title: 'Industry News — Manufacturing: Applied to Sulzer',
    playlistId: 'industry-news',
    duration: 360,
    speaker: 'Industry Insights',
    speakerRole: 'Research Team',
    date: new Date().toISOString().split('T')[0],
    takeaways: [
      'Resilience + risk shape investment decisions',
      'Energy affordability constrains transformation',
      'Services are a margin lever',
    ],
    tags: ['manufacturing', 'industry', 'sulzer'],
    plays: 321,
  },
  'objection-handling': {
    id: 'focus-objection-1',
    title: 'Objection Handling: This Month',
    playlistId: 'objection-handling',
    duration: 360,
    speaker: 'Sales Enablement',
    speakerRole: 'Training Team',
    date: new Date().toISOString().split('T')[0],
    takeaways: [
      'ACRN Framework: Acknowledge → Clarify → Reframe → Next step',
      'Ready-to-use sovereignty response',
      'Cost mode objection handling',
    ],
    tags: ['objections', 'sales', 'training'],
    plays: 567,
  },
  'personal-brand-daniel': {
    id: 'focus-brand-1',
    title: 'Personal Brand — Daniel Schaffhauser',
    playlistId: 'personal-brand',
    duration: 220,
    speaker: 'Brand Coach',
    speakerRole: 'Executive Presence',
    date: new Date().toISOString().split('T')[0],
    takeaways: [
      'Tier: Practitioner (cross-channel: light)',
      'Add signature POV + 2 micro-case posts',
      'Get one external validation signal',
    ],
    tags: ['brand', 'linkedin', 'personal'],
    plays: 189,
  },
  'book-briefings': {
    id: 'focus-books-1',
    title: 'Book Briefings: This Week',
    playlistId: 'book-briefings',
    duration: 720,
    speaker: 'Learning Team',
    speakerRole: 'L&D',
    date: new Date().toISOString().split('T')[0],
    takeaways: [
      'Execution discipline tactics',
      'Cost clarity frameworks',
      'Services growth playbook',
    ],
    tags: ['books', 'learning', 'growth'],
    plays: 412,
  },
};
