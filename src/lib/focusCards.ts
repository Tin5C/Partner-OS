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
  audioUrl?: string;
  linkedPlaylistId?: string;
  linkedEpisode?: Episode;
  primaryAction: 'play' | 'open-playlist';
  secondaryAction?: { label: string; action: 'open-playlist' | 'view-scorecard' | 'continue-listening' };
  icon: string;
  gradient: string;
  logos?: string[]; // Array of logo identifiers for this card
}

const currentWeek = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const focusCards: FocusCard[] = [
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
    linkedPlaylistId: 'industry-news',
    primaryAction: 'play',
    secondaryAction: { label: 'Open playlist', action: 'open-playlist' },
    icon: 'newspaper',
    gradient: 'from-amber-500/20 to-amber-500/5',
    logos: ['mckinsey', 'gartner'],
  },
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
    linkedPlaylistId: 'personal-brand',
    primaryAction: 'play',
    secondaryAction: { label: 'View scorecard', action: 'view-scorecard' },
    icon: 'user-circle',
    gradient: 'from-violet-500/20 to-violet-500/5',
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
    linkedPlaylistId: 'book-briefings',
    primaryAction: 'open-playlist',
    secondaryAction: { label: 'Continue listening', action: 'continue-listening' },
    icon: 'book-open',
    gradient: 'from-rose-500/20 to-rose-500/5',
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
