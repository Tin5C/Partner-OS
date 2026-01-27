// Shared Content Model - Content keyed by tenant + week + packId
// For MVP, this contains mock/sample content

export interface PackContent {
  listenUrl?: string;
  execSummary: {
    tldr: string;
    whatChanged: string[];
    whyItMatters: string[];
    risks?: string[];
    nextBestActions: string[];
    questionsToAsk: string[];
    sources?: { title: string; url?: string }[];
  };
  metadata?: {
    lastUpdated?: string;
    sources?: string[];
  };
}

export interface WeekContent {
  [packId: string]: PackContent;
}

export interface TenantContent {
  [weekKey: string]: WeekContent;
}

export interface ContentStore {
  [tenantSlug: string]: TenantContent;
}

// Helper to get week key from date
export function getWeekKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${dayNum}`;
}

// Get week keys for last N weeks
export function getLastNWeeks(n: number): string[] {
  const weeks: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    weeks.push(getWeekKey(date));
  }
  return weeks;
}

// Default exec summary template
const createDefaultExecSummary = (packId: string, tenantSlug: string): PackContent['execSummary'] => ({
  tldr: `Key insights and actions for ${packId.replace('-', ' ')} this week.`,
  whatChanged: [
    'New developments identified in the market',
    'Updated analysis based on recent signals',
    'Fresh perspective on priorities',
  ],
  whyItMatters: [
    'Understanding these signals helps you stay ahead',
    'Early awareness enables better positioning',
  ],
  nextBestActions: [
    'Review and apply insights to your next conversation',
    'Share key points with relevant team members',
    'Update your strategy based on new signals',
  ],
  questionsToAsk: [
    "What's your current approach to this area?",
    'How has this changed over the past quarter?',
    'What would success look like for you here?',
  ],
  sources: [
    { title: 'Internal Research' },
    { title: 'Industry Analysis' },
  ],
});

// Generate mock content for a tenant
export function generateMockContent(tenantSlug: string): TenantContent {
  const weeks = getLastNWeeks(4);
  const packIds = [
    'top-focus',
    'competitive-radar',
    'industry-signals',
    'objection-handling',
    'skill-of-week',
    'market-presence',
  ];

  const content: TenantContent = {};

  weeks.forEach((weekKey) => {
    content[weekKey] = {};
    packIds.forEach((packId) => {
      content[weekKey][packId] = {
        listenUrl: undefined, // Mock - no actual audio
        execSummary: createDefaultExecSummary(packId, tenantSlug),
        metadata: {
          lastUpdated: new Date().toISOString(),
        },
      };
    });
  });

  return content;
}

// Mock content store
const mockContentStore: ContentStore = {};

// Get content for a tenant (generates mock if not exists)
export function getTenantContent(tenantSlug: string): TenantContent {
  if (!mockContentStore[tenantSlug]) {
    mockContentStore[tenantSlug] = generateMockContent(tenantSlug);
  }
  return mockContentStore[tenantSlug];
}

// Get specific pack content
export function getPackContent(
  tenantSlug: string,
  weekKey: string,
  packId: string
): PackContent | null {
  const tenantContent = getTenantContent(tenantSlug);
  return tenantContent[weekKey]?.[packId] || null;
}
