// Focus Cards Data Model - Spotify-like preview cards for Home
import { Episode } from './data';

// Listening highlights for follow-along during audio playback
export interface ListeningHighlight {
  id: string;
  text: string;
  startTime: number; // seconds from start
  endTime: number;
}

// Executive Summary structured content
export interface ExecSummary {
  tldr: string; // 2 lines max
  whatChanged: string[]; // 3 bullets
  whyItMatters: string[]; // 2-3 bullets
  risks?: string[]; // optional
  nextBestActions: string[]; // 3 actions
  questionsToAsk: string[]; // 3 questions
  sources?: { title: string; url?: string }[]; // collapsed
}

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
  // New fields for Listen Briefing / Exec Summary
  listeningHighlights?: ListeningHighlight[];
  execSummary?: ExecSummary;
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

// Default exec summary template
const defaultExecSummary = (card: Partial<FocusCard>): ExecSummary => ({
  tldr: card.insightLine || 'Key insights and actions for this briefing.',
  whatChanged: card.previewBullets?.slice(0, 3) || [],
  whyItMatters: [
    card.insightLine || 'Understanding these signals helps you stay ahead.',
    'Early awareness enables better positioning in conversations.'
  ],
  nextBestActions: [
    card.suggestedMove || 'Review and apply insights to your next conversation.',
    'Share key points with relevant team members.',
    'Update your account strategy based on new signals.'
  ],
  questionsToAsk: [
    'What\'s your current approach to this area?',
    'How has this changed over the past quarter?',
    'What would success look like for you here?'
  ],
  sources: [
    { title: 'Internal Research', url: undefined },
    { title: 'Industry Analysis', url: undefined }
  ]
});

// Default listening highlights (timed for ~6 min briefing)
const defaultListeningHighlights = (bullets: string[]): ListeningHighlight[] => {
  const highlights: ListeningHighlight[] = [];
  const timePerHighlight = 60; // 1 minute per highlight
  
  bullets.forEach((bullet, idx) => {
    highlights.push({
      id: `highlight-${idx}`,
      text: bullet,
      startTime: idx * timePerHighlight,
      endTime: (idx + 1) * timePerHighlight - 1
    });
  });
  
  return highlights;
};

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
    listeningHighlights: [
      { id: 'h1', text: 'Sulzer earned Top Employer 2025 certification, signaling strong execution capacity and talent retention.', startTime: 0, endTime: 45 },
      { id: 'h2', text: 'Wastewater rental acquisition expands their services portfolio—attach rate opportunity.', startTime: 46, endTime: 120 },
      { id: 'h3', text: 'Order intake metrics suggest cautious but sustained investment appetite.', startTime: 121, endTime: 180 },
      { id: 'h4', text: 'Key theme: Standardization and delivery confidence matter more than product features.', startTime: 181, endTime: 240 },
      { id: 'h5', text: 'Suggested approach: Lead with deployment excellence, not just capabilities.', startTime: 241, endTime: 300 },
      { id: 'h6', text: 'Action: Ask about deployment variance and services growth metrics in your next call.', startTime: 301, endTime: 360 },
    ],
    execSummary: {
      tldr: 'Sulzer\'s Top Employer signal + services expansion indicate execution focus over feature competition.',
      whatChanged: [
        'Top Employer 2025 certification earned—talent and execution capacity signal',
        'Wastewater rental acquisition completed—services attach expansion',
        'Order intake baseline stabilized—cautious but consistent investment'
      ],
      whyItMatters: [
        'Buyers are evaluating vendors on delivery confidence, not just product specs',
        'Services revenue is becoming a strategic priority—opens attach discussions',
        'Investment appetite exists but requires clear ROI framing'
      ],
      nextBestActions: [
        'Lead with deployment excellence narrative in your next conversation',
        'Probe services growth metrics—what\'s the attach rate target?',
        'Frame proposals around execution certainty, not feature lists'
      ],
      questionsToAsk: [
        'What\'s your current baseline for deployment variance across sites?',
        'How are you measuring services growth against the installed base?',
        'What would successful standardization look like in the next 12 months?'
      ],
      sources: [
        { title: 'Sulzer Annual Report 2024' },
        { title: 'Top Employer Institute Certification' },
        { title: 'Internal Account Intelligence' }
      ]
    }
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
    listeningHighlights: [
      { id: 'h1', text: 'Major competitor leading with data sovereignty in DACH sales pitches.', startTime: 0, endTime: 60 },
      { id: 'h2', text: 'Procurement teams using sovereignty as early-stage filter—answer it or get filtered out.', startTime: 61, endTime: 120 },
      { id: 'h3', text: 'Buyers expect pilot-to-production in weeks, not months.', startTime: 121, endTime: 180 },
      { id: 'h4', text: 'Platform release cadence is becoming a competitive comparison point.', startTime: 181, endTime: 240 },
      { id: 'h5', text: 'Strategy: Lead with your own controls story before they ask.', startTime: 241, endTime: 300 },
    ],
    execSummary: {
      tldr: 'Competitors are weaponizing sovereignty—treat it as a sales motion, not a technical checkbox.',
      whatChanged: [
        'Data sovereignty now leads competitor pitches in DACH region',
        'Pilot expectations compressed—weeks, not months',
        'Platform cadence becoming a differentiation point'
      ],
      whyItMatters: [
        'Sovereignty is an early procurement filter—miss it, miss the shortlist',
        'Speed to value is expected, not exceptional',
        'Comparison happens on cadence and commitment, not just features'
      ],
      risks: [
        'Getting filtered out before reaching technical evaluation',
        'Appearing reactive rather than proactive on compliance'
      ],
      nextBestActions: [
        'Lead with your controls story before they ask about sovereignty',
        'Prepare a 2-week pilot framework for common use cases',
        'Reference your platform roadmap cadence in competitive situations'
      ],
      questionsToAsk: [
        'What\'s your current stance on workload boundaries and data residency?',
        'How do you typically evaluate pilot success criteria?',
        'What does your ideal vendor release cadence look like?'
      ],
      sources: [
        { title: 'Competitive Intelligence Report Q1' },
        { title: 'Win/Loss Analysis - DACH' },
        { title: 'Analyst Briefing Notes' }
      ]
    }
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
    listeningHighlights: [
      { id: 'h1', text: 'Manufacturing investment now filtered through resilience and risk lens.', startTime: 0, endTime: 60 },
      { id: 'h2', text: 'Energy costs remain board-level constraint—affects transformation pace.', startTime: 61, endTime: 120 },
      { id: 'h3', text: 'Execution risk is driving cost—standardization emerges as the hedge.', startTime: 121, endTime: 180 },
      { id: 'h4', text: 'Services becoming margin lever—data monetization is real.', startTime: 181, endTime: 240 },
      { id: 'h5', text: 'Sulzer signals: hiring + expansion = deployment discipline focus.', startTime: 241, endTime: 300 },
    ],
    execSummary: {
      tldr: 'Manufacturing buyers filter on resilience—position around execution certainty and services growth.',
      whatChanged: [
        'Resilience and risk now primary investment filters',
        'Energy affordability constraining transformation timelines',
        'Services revenue becoming strategic priority for margin'
      ],
      whyItMatters: [
        'Buyers need confidence in execution, not just capability promises',
        'Cost pressure makes standardization more attractive than customization',
        'Services attach creates stickier revenue—opens new conversations'
      ],
      nextBestActions: [
        'Frame proposals around execution certainty and risk reduction',
        'Lead services conversation with data monetization angle',
        'Reference industry benchmarks for deployment standardization'
      ],
      questionsToAsk: [
        'How has your investment criteria evolved over the past year?',
        'What role does energy cost play in your transformation timeline?',
        'How do you think about services revenue in your growth model?'
      ],
      sources: [
        { title: 'McKinsey Manufacturing Report 2024' },
        { title: 'Gartner Industrial Outlook' },
        { title: 'Industry Conference Insights' }
      ]
    }
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
    listeningHighlights: [
      { id: 'h1', text: 'This week: Atomic Habits applied to sales execution.', startTime: 0, endTime: 60 },
      { id: 'h2', text: 'Key concept: 1% improvements compound over time.', startTime: 61, endTime: 120 },
      { id: 'h3', text: 'Application: Stack one sales habit onto an existing routine.', startTime: 121, endTime: 180 },
    ],
    execSummary: {
      tldr: 'Micro-learning format: 5 episodes, 3 takeaways each, one weekly action.',
      whatChanged: [
        'New format optimized for busy schedules',
        'Each episode tied to practical application',
        'Weekly theme aligns with current account priorities'
      ],
      whyItMatters: [
        'Small improvements compound into significant results',
        'Applicable tactics beat theoretical knowledge',
        'Consistency matters more than intensity'
      ],
      nextBestActions: [
        'Listen to one episode before your next customer call',
        'Apply one technique from this week\'s theme',
        'Share a takeaway with your team'
      ],
      questionsToAsk: [
        'What habit could you improve by 1% this week?',
        'Where does consistency break down in your process?',
        'What would compound improvement look like in 90 days?'
      ]
    }
  },
  {
    id: 'objection-handling-w0',
    title: 'Objection Handling',
    subtitle: 'This week\'s top objections',
    previewBullets: [
      '"We need to see more proof of ROI first."',
      '"Our team isn\'t ready for this level of change."',
      '"We\'re locked into our current vendor."',
    ],
    insightLine: 'ACRN: Acknowledge → Clarify → Reframe → Next step.',
    insightLabel: 'Framework',
    footer: 'Listen for ready-to-use responses.',
    tags: [
      { label: 'Type', value: 'Objection Handling' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week0,
    linkedPlaylistId: 'objection-handling',
    primaryAction: 'play',
    icon: 'message-circle',
    gradient: 'from-purple-500/20 to-purple-500/5',
    listeningHighlights: [
      { id: 'h1', text: '"We need more ROI proof" — Acknowledge the need for evidence, then ask about their measurement criteria.', startTime: 0, endTime: 60 },
      { id: 'h2', text: '"Team isn\'t ready" — Clarify what readiness looks like, reframe as a change management opportunity.', startTime: 61, endTime: 120 },
      { id: 'h3', text: '"Locked into current vendor" — Explore the contract timeline and parallel evaluation options.', startTime: 121, endTime: 180 },
    ],
    execSummary: {
      tldr: 'Three common objections this week—use ACRN framework for consistent responses.',
      whatChanged: [
        'ROI scrutiny increasing in current budget climate',
        'Change readiness concerns surfacing earlier in deals',
        'Vendor lock-in being used as negotiation tactic'
      ],
      whyItMatters: [
        'Early objection handling prevents deal stalls',
        'Consistent framework builds confidence',
        'Understanding the real concern behind the objection is key'
      ],
      nextBestActions: [
        'Prepare ROI proof points specific to their industry',
        'Offer change management resources proactively',
        'Map contract timelines in your territory'
      ],
      questionsToAsk: [
        'What does ROI success look like for your organization?',
        'What would make your team feel ready for this change?',
        'When does your current agreement come up for review?'
      ]
    }
  },
  {
    id: 'personal-brand-w0',
    title: 'Personal Brand',
    subtitle: 'Your weekly brand pulse',
    previewBullets: [
      'LinkedIn engagement: +12% vs last week',
      'Content gap: industry POV posts',
      'Quick win: comment on 3 prospect posts',
    ],
    insightLine: 'Consistency beats perfection—post something this week.',
    insightLabel: 'Action',
    footer: 'Build your presence one post at a time.',
    tags: [
      { label: 'Type', value: 'Personal Brand' },
    ],
    timeEstimate: '~3 min',
    lastUpdated: currentWeek,
    weekStart: week0,
    linkedPlaylistId: 'personal-brand',
    primaryAction: 'play',
    icon: 'user-circle',
    gradient: 'from-violet-500/20 to-violet-500/5',
    listeningHighlights: [
      { id: 'h1', text: 'Your LinkedIn engagement is up 12% this week—momentum is building.', startTime: 0, endTime: 45 },
      { id: 'h2', text: 'Content gap identified: more industry point-of-view posts needed.', startTime: 46, endTime: 90 },
      { id: 'h3', text: 'Quick win: comment thoughtfully on 3 prospect posts today.', startTime: 91, endTime: 135 },
    ],
    execSummary: {
      tldr: 'Engagement trending up—focus on industry POV content this week.',
      whatChanged: [
        'LinkedIn engagement up 12% week-over-week',
        'Profile views increased from target accounts',
        'Content mix shifting toward insights'
      ],
      whyItMatters: [
        'Personal brand accelerates deal velocity',
        'Prospects research sellers before meetings',
        'Consistent presence builds trust over time'
      ],
      nextBestActions: [
        'Post one industry point-of-view this week',
        'Comment on 3 prospect posts with value-add insights',
        'Share one customer success story (with permission)'
      ],
      questionsToAsk: [
        'What industry trend could you share a perspective on?',
        'Which prospects should you engage with this week?',
        'What customer story would resonate with your audience?'
      ]
    }
  },

  // Week 1 (1 week ago) cards - ALL 6 categories
  {
    id: 'top-focus-sulzer-w1',
    title: 'Top Focus — Sulzer',
    subtitle: 'Mid-week developments',
    previewBullets: [
      'Board approved Q1 expansion budget',
      'New sustainability initiative announced',
      'Key contact promoted to VP Operations',
    ],
    insightLine: 'Expansion signals strong—align your pitch to growth mode.',
    insightLabel: 'Why it matters',
    footer: 'Refresh your stakeholder map.',
    tags: [
      { label: 'Focus', value: 'Sulzer' },
      { label: 'Type', value: 'Account Update' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'top-accounts',
    primaryAction: 'play',
    icon: 'building-2',
    gradient: 'from-blue-500/20 to-blue-500/5',
    logos: ['sulzer'],
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'competitive-radar-w1',
    title: 'Competitive Radar',
    subtitle: 'Last week\'s market shifts',
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
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'industry-news-w1',
    title: 'Industry News — Manufacturing',
    subtitle: 'Last week\'s developments',
    previewBullets: [
      'Major acquisition reshapes competitive landscape',
      'New regulatory framework proposed for EU markets',
      'Labor costs stabilizing across EMEA region',
    ],
    insightLine: 'Regulatory changes create urgency—use this in discovery.',
    insightLabel: 'Angle',
    footer: 'Frame conversations around compliance readiness.',
    tags: [
      { label: 'Industry', value: 'Manufacturing' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'industry-news',
    primaryAction: 'play',
    icon: 'newspaper',
    gradient: 'from-amber-500/20 to-amber-500/5',
    logos: ['mckinsey', 'gartner'],
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'objection-handling-w1',
    title: 'Objection Handling',
    subtitle: 'This month\'s set (derived from Competitive + Industry signals)',
    previewBullets: [
      'Sovereignty is unclear—procurement will block this.',
      'We\'re in cost mode—no funding.',
      'Integration will kill us—too many systems.',
    ],
    insightLine: 'ACRN: Acknowledge → Clarify → Reframe → Next step.',
    insightLabel: 'Framework',
    footer: 'Listen to the podcast for ready-to-use responses + proof prompts.',
    tags: [
      { label: 'Type', value: 'Objection Handling' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'objection-handling',
    primaryAction: 'play',
    icon: 'message-circle',
    gradient: 'from-purple-500/20 to-purple-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'personal-brand-w1',
    title: 'Personal Brand — Daniel',
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
    icon: 'user-circle',
    gradient: 'from-violet-500/20 to-violet-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'book-briefings-w1',
    title: 'Book Briefings',
    subtitle: 'Negotiation tactics',
    previewBullets: [
      'Never Split the Difference: tactical empathy',
      'Getting to Yes: principled negotiation',
      'Influence: reciprocity in action',
    ],
    insightLine: 'Use one labeling technique in your next call.',
    insightLabel: 'Action',
    footer: 'Small tactics, big impact.',
    tags: [
      { label: 'Type', value: 'Learning' },
    ],
    timeEstimate: '~10 min',
    lastUpdated: currentWeek,
    weekStart: week1,
    linkedPlaylistId: 'book-briefings',
    primaryAction: 'open-playlist',
    icon: 'book-open',
    gradient: 'from-rose-500/20 to-rose-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },

  // Week 2 (2 weeks ago) cards - ALL 6 categories
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
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'competitive-radar-w2',
    title: 'Competitive Radar',
    subtitle: 'Pricing intelligence update',
    previewBullets: [
      'Competitor A reduced enterprise tier by 15%',
      'New bundling strategies emerging',
      'Partner ecosystem expansion accelerating',
    ],
    insightLine: 'Lead with value, not price—emphasize TCO.',
    insightLabel: 'How to think',
    footer: 'Know their moves, control the narrative.',
    tags: [
      { label: 'Type', value: 'Competitive' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week2,
    linkedPlaylistId: 'competitive',
    primaryAction: 'play',
    icon: 'radar',
    gradient: 'from-red-500/20 to-red-500/5',
    logos: ['aws', 'gcp'],
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
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
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'objection-handling-w2',
    title: 'Objection Handling',
    subtitle: 'Budget season objections',
    previewBullets: [
      '"Budget is locked until next fiscal year."',
      '"We need to see competitive bids first."',
      '"The timing just isn\'t right."',
    ],
    insightLine: 'Reframe timing as cost of delay.',
    insightLabel: 'Framework',
    footer: 'Turn budget objections into urgency.',
    tags: [
      { label: 'Type', value: 'Objection Handling' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week2,
    linkedPlaylistId: 'objection-handling',
    primaryAction: 'play',
    icon: 'message-circle',
    gradient: 'from-purple-500/20 to-purple-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'personal-brand-w2',
    title: 'Personal Brand',
    subtitle: 'Content calendar review',
    previewBullets: [
      'Best performing post: industry insight thread',
      'Engagement dip on product-focused content',
      'Opportunity: more customer story reshares',
    ],
    insightLine: 'Stories outperform features—share more wins.',
    insightLabel: 'Insight',
    footer: 'Let customers do the selling.',
    tags: [
      { label: 'Type', value: 'Personal Brand' },
    ],
    timeEstimate: '~4 min',
    lastUpdated: currentWeek,
    weekStart: week2,
    linkedPlaylistId: 'personal-brand',
    primaryAction: 'play',
    icon: 'user-circle',
    gradient: 'from-violet-500/20 to-violet-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'book-briefings-w2',
    title: 'Book Briefings',
    subtitle: 'Strategic selling',
    previewBullets: [
      'The Challenger Sale: teaching for differentiation',
      'SPIN Selling: situation questions that work',
      'Gap Selling: problem-centric discovery',
    ],
    insightLine: 'Challenge assumptions, don\'t just confirm them.',
    insightLabel: 'Action',
    footer: 'Push thinking, earn trust.',
    tags: [
      { label: 'Type', value: 'Learning' },
    ],
    timeEstimate: '~12 min',
    lastUpdated: currentWeek,
    weekStart: week2,
    linkedPlaylistId: 'book-briefings',
    primaryAction: 'open-playlist',
    icon: 'book-open',
    gradient: 'from-rose-500/20 to-rose-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },

  // Week 3 (3 weeks ago) cards - ALL 6 categories
  {
    id: 'top-focus-sulzer-w3',
    title: 'Top Focus — Sulzer',
    subtitle: 'Strategic planning insights',
    previewBullets: [
      'Annual strategy review completed',
      'New digital transformation roadmap published',
      'Key stakeholder realignment in progress',
    ],
    insightLine: 'Strategic clarity emerging—align your timing.',
    insightLabel: 'Why it matters',
    footer: 'Map your approach to their planning cycle.',
    tags: [
      { label: 'Focus', value: 'Sulzer' },
      { label: 'Type', value: 'Account Update' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'top-accounts',
    primaryAction: 'play',
    icon: 'building-2',
    gradient: 'from-blue-500/20 to-blue-500/5',
    logos: ['sulzer'],
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'competitive-radar-w3',
    title: 'Competitive Radar',
    subtitle: 'Product launch analysis',
    previewBullets: [
      'Competitor announced new enterprise features',
      'Market positioning shift detected',
      'Customer migration patterns emerging',
    ],
    insightLine: 'Feature parity claims incoming—prepare differentiation story.',
    insightLabel: 'How to think',
    footer: 'Stay ahead of the narrative.',
    tags: [
      { label: 'Type', value: 'Competitive' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'competitive',
    primaryAction: 'play',
    icon: 'radar',
    gradient: 'from-red-500/20 to-red-500/5',
    logos: ['aws', 'gcp', 'azure'],
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'industry-news-w3',
    title: 'Industry News — Manufacturing',
    subtitle: 'Quarterly outlook',
    previewBullets: [
      'Economic indicators pointing to cautious optimism',
      'Investment patterns shifting to operational efficiency',
      'Sustainability requirements driving new evaluations',
    ],
    insightLine: 'Efficiency and sustainability are converging priorities.',
    insightLabel: 'Market context',
    footer: 'Lead with operational impact.',
    tags: [
      { label: 'Industry', value: 'Manufacturing' },
    ],
    timeEstimate: '~6 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'industry-news',
    primaryAction: 'play',
    icon: 'newspaper',
    gradient: 'from-amber-500/20 to-amber-500/5',
    logos: ['mckinsey', 'gartner'],
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'objection-handling-w3',
    title: 'Objection Handling',
    subtitle: 'Technical evaluation pushback',
    previewBullets: [
      '"Your solution is too complex for our team."',
      '"We need more integration options."',
      '"Security review will take months."',
    ],
    insightLine: 'Simplicity wins—lead with ease of deployment.',
    insightLabel: 'Framework',
    footer: 'Reduce friction at every step.',
    tags: [
      { label: 'Type', value: 'Objection Handling' },
    ],
    timeEstimate: '~5 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'objection-handling',
    primaryAction: 'play',
    icon: 'message-circle',
    gradient: 'from-purple-500/20 to-purple-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'personal-brand-w3',
    title: 'Personal Brand',
    subtitle: 'Network expansion focus',
    previewBullets: [
      'Connection requests from target accounts up 25%',
      'Thought leadership pieces gaining traction',
      'Speaking opportunity pipeline building',
    ],
    insightLine: 'Visibility is compounding—maintain momentum.',
    insightLabel: 'Progress',
    footer: 'Your brand is working for you.',
    tags: [
      { label: 'Type', value: 'Personal Brand' },
    ],
    timeEstimate: '~4 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'personal-brand',
    primaryAction: 'play',
    icon: 'user-circle',
    gradient: 'from-violet-500/20 to-violet-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
  {
    id: 'book-briefings-w3',
    title: 'Book Briefings',
    subtitle: 'Relationship selling',
    previewBullets: [
      'The Trusted Advisor: building credibility',
      'Let\'s Get Real: authentic conversations',
      'Fanatical Prospecting: consistent outreach',
    ],
    insightLine: 'Trust is earned through consistency and honesty.',
    insightLabel: 'Action',
    footer: 'Be the advisor, not the vendor.',
    tags: [
      { label: 'Type', value: 'Learning' },
    ],
    timeEstimate: '~10 min',
    lastUpdated: currentWeek,
    weekStart: week3,
    linkedPlaylistId: 'book-briefings',
    primaryAction: 'open-playlist',
    icon: 'book-open',
    gradient: 'from-rose-500/20 to-rose-500/5',
    get listeningHighlights() { return defaultListeningHighlights(this.previewBullets); },
    get execSummary() { return defaultExecSummary(this); }
  },
];

// Episode data for audio playback
export const focusEpisodes: Record<string, Episode> = {
  'top-focus-sulzer': {
    id: 'focus-sulzer-ep',
    playlistId: 'top-accounts',
    title: 'Top Focus — Sulzer Weekly Briefing',
    speaker: 'Intelligence Team',
    speakerRole: 'Account Strategy',
    duration: 360,
    date: new Date().toISOString(),
    tags: ['account', 'sulzer', 'manufacturing'],
    takeaways: [
      'Top Employer certification signals execution capacity',
      'Services expansion creates attach opportunities',
      'Lead with deployment excellence, not features'
    ]
  },
  'competitive-radar': {
    id: 'focus-competitive-ep',
    playlistId: 'competitive',
    title: 'Competitive Radar — Weekly Update',
    speaker: 'Market Intelligence',
    speakerRole: 'Competitive Strategy',
    duration: 360,
    date: new Date().toISOString(),
    tags: ['competitive', 'strategy'],
    takeaways: [
      'Sovereignty is becoming a procurement filter',
      'Speed to pilot is now an expectation',
      'Lead with your controls story proactively'
    ]
  },
  'industry-news-manufacturing': {
    id: 'focus-industry-ep',
    playlistId: 'industry-news',
    title: 'Industry News — Manufacturing Weekly',
    speaker: 'Industry Research',
    speakerRole: 'Market Analysis',
    duration: 360,
    date: new Date().toISOString(),
    tags: ['industry', 'manufacturing'],
    takeaways: [
      'Resilience now filters investment decisions',
      'Services revenue is strategic priority',
      'Frame around execution certainty'
    ]
  },
  'book-briefings': {
    id: 'focus-books-ep',
    playlistId: 'book-briefings',
    title: 'Book Briefings — Atomic Habits Applied',
    speaker: 'Learning Team',
    speakerRole: 'Professional Development',
    duration: 600,
    date: new Date().toISOString(),
    tags: ['learning', 'books'],
    takeaways: [
      '1% improvements compound over time',
      'Stack habits onto existing routines',
      'Consistency beats intensity'
    ]
  },
  'objection-handling-w0': {
    id: 'focus-objection-ep-w0',
    playlistId: 'objection-handling',
    title: 'Objection Handling — This Week',
    speaker: 'Sales Enablement',
    speakerRole: 'Training',
    duration: 300,
    date: new Date().toISOString(),
    tags: ['objection', 'talk-track'],
    takeaways: [
      'Use ACRN framework consistently',
      'Understand the concern behind the objection',
      'Prepare industry-specific proof points'
    ]
  },
  'personal-brand-w0': {
    id: 'focus-brand-ep-w0',
    playlistId: 'personal-brand',
    title: 'Personal Brand — Weekly Pulse',
    speaker: 'Marketing',
    speakerRole: 'Brand Strategy',
    duration: 180,
    date: new Date().toISOString(),
    tags: ['brand', 'linkedin'],
    takeaways: [
      'Consistency beats perfection',
      'Engage with prospect content',
      'Share industry perspectives'
    ]
  }
};

// Add episodes for other weeks (use same base data with different IDs)
['top-focus-sulzer-w1', 'top-focus-sulzer-w2', 'top-focus-sulzer-w3'].forEach((id, idx) => {
  focusEpisodes[id] = { ...focusEpisodes['top-focus-sulzer'], id: `focus-sulzer-ep-w${idx + 1}` };
});

['competitive-radar-w1', 'competitive-radar-w2', 'competitive-radar-w3'].forEach((id, idx) => {
  focusEpisodes[id] = { ...focusEpisodes['competitive-radar'], id: `focus-competitive-ep-w${idx + 1}` };
});

['industry-news-w1', 'industry-news-w2', 'industry-news-w3'].forEach((id, idx) => {
  focusEpisodes[id] = { ...focusEpisodes['industry-news-manufacturing'], id: `focus-industry-ep-w${idx + 1}` };
});

['book-briefings-w1', 'book-briefings-w2', 'book-briefings-w3'].forEach((id, idx) => {
  focusEpisodes[id] = { ...focusEpisodes['book-briefings'], id: `focus-books-ep-w${idx + 1}` };
});

['objection-handling-w1', 'objection-handling-w2', 'objection-handling-w3'].forEach((id, idx) => {
  focusEpisodes[id] = { ...focusEpisodes['objection-handling-w0'], id: `focus-objection-ep-w${idx + 1}` };
});

['personal-brand-w1', 'personal-brand-w2', 'personal-brand-w3'].forEach((id, idx) => {
  focusEpisodes[id] = { ...focusEpisodes['personal-brand-w0'], id: `focus-brand-ep-w${idx + 1}` };
});
